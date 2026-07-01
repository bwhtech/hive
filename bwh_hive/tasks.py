import frappe
from frappe.utils import get_datetime, now_datetime, nowdate

from bwh_hive.bwh_hive.api import _enrich_tasks_with_project_titles
from bwh_hive.bwh_hive.orchestrator import service
from bwh_hive.bwh_hive.orchestrator.benchspace import BenchSpaceClient, BenchSpaceError


def daily() -> None:
	send_daily_overdue_notifications()


def send_daily_overdue_notifications() -> None:
	"""Send daily email to each team member who has overdue tasks.

	Each email includes:
	- The member's own overdue tasks (title, project, priority, how overdue)
	- A summary table of other team members' overdue counts
	"""
	today = nowdate()

	members = frappe.get_all(
		"Hive Member",
		filters={"type": "Team", "is_active": 1},
		fields=["user", "member_name"],
	)
	if not members:
		return

	# Gather overdue tasks per member
	member_overdue: dict[str, dict] = {}
	for member in members:
		tasks = frappe.get_all(
			"Hive Task",
			filters={
				"_assign": ["like", f"%{member.user}%"],
				"due_date": ["<", today],
				"status": ["not in", ["Done", "Someday"]],
				"is_archived": 0,
			},
			fields=["name", "title", "project", "status", "priority", "due_date"],
			order_by="due_date asc",
			limit=50,
		)
		if tasks:
			_enrich_tasks_with_project_titles(tasks)
			member_overdue[member.user] = {
				"member_name": member.member_name,
				"tasks": tasks,
			}

	if not member_overdue:
		return

	# Build team summary sorted by overdue count descending
	team_summary = [
		{"member_name": data["member_name"], "overdue_count": len(data["tasks"])}
		for data in member_overdue.values()
	]
	team_summary.sort(key=lambda x: x["overdue_count"], reverse=True)

	site_url = frappe.utils.get_url()

	for user, data in member_overdue.items():
		other_summary = [s for s in team_summary if s["member_name"] != data["member_name"]]
		count = len(data["tasks"])

		frappe.sendmail(
			recipients=[user],
			subject=f"You have {count} overdue task{'s' if count != 1 else ''} in Hive",
			template="daily_overdue",
			args={
				"member_name": data["member_name"],
				"tasks": data["tasks"],
				"team_summary": other_summary,
				"task_count": count,
				"site_url": site_url,
			},
			now=True,
		)


# --------------------------------------------------------------------------- #
# Agent lifecycle watchdog (specs/v2 06-phase-5 §5-6)
# --------------------------------------------------------------------------- #
# Human-wait states: no human action arriving is normal, so they are not phase-timed
# (pass A). They are reclaimed by idle teardown (pass C) instead.
_IDLE_STATES = {"Spec Created", "Spec Approved", "PR Ready"}

# Grace before the watchdog retries teardown of a Merged/Cancelled box whose synchronous
# teardown job may still be in flight (minutes).
_TEARDOWN_SETTLE_MINUTES = 5

_DEPROVISION = "bwh_hive.bwh_hive.orchestrator.service.deprovision_for_task"
_PROVISION = "bwh_hive.bwh_hive.orchestrator.service.provision_for_task"


def reconcile_agent_tasks() -> None:
	"""Orchestration-side lifecycle watchdog (specs/v2 06-phase-5 §5).

	Runs on a ~10-minute cron and backstops the box's own self-timeouts: drags timed-out
	tasks to Failed, reconciles tasks whose box vanished, reclaims idle boxes, sweeps the
	Failed-grace + terminal-teardown set and orphaned boxes, and drains the Queued backlog
	under the concurrency cap. Every pass is idempotent.
	"""
	settings = frappe.get_cached_doc("Hive Settings")
	if not settings.agent_orchestration_enabled:
		return

	live = frappe.get_all(
		"Hive Task",
		filters={"agent_status": ["in", list(service.LIVE_STATES)]},
		fields=["name", "agent_status", "agent_dev_box", "modified"],
	)

	cap = settings.max_concurrent_agent_boxes or service.DEFAULT_MAX_CONCURRENT_BOXES
	provisioned = frappe.db.count("Hive Task", {"agent_status": ["in", list(service.PROVISIONED_STATES)]})
	at_cap = provisioned >= cap

	_sweep_timeouts(live, settings, at_cap)  # pass A: stuck phase -> Failed
	_reconcile_vanished_boxes(live)  # pass B: box gone -> Failed
	_sweep_idle(live, settings)  # pass C: idle human-wait -> Failed + teardown
	_sweep_terminal_teardown(settings)  # pass D: Failed grace + terminal retry
	_sweep_orphans()  # orphaned boxes whose task is gone
	_drain_queue(settings, cap, provisioned)  # promote Queued -> Provisioning under cap

	if not frappe.flags.in_test:
		frappe.db.commit()


# --- pass A: phase timeouts (backstop) ------------------------------------- #
def _phase_budget(status: str, settings) -> int:
	"""Per-phase watchdog budget in minutes (0 = no phase timeout for this state)."""
	if status in ("Queued", "Provisioning"):
		return settings.provisioning_timeout_minutes or 0
	if status == "Spec In Progress":
		return settings.spec_timeout_minutes or 0
	if status in ("Implementing", "Changes Requested"):
		return settings.implement_timeout_minutes or 0
	return 0


def _sweep_timeouts(live: list, settings, at_cap: bool) -> None:
	now = now_datetime()
	for t in live:
		budget = _phase_budget(t.agent_status, settings)
		if budget <= 0:
			continue
		# A Queued task held back only because the cap is full is legitimately waiting,
		# not stuck — don't fail it; the queue drain will promote it when a slot frees.
		if t.agent_status == "Queued" and at_cap:
			continue
		age_min = (now - get_datetime(t.modified)).total_seconds() / 60
		if age_min >= budget:
			service.mark_failed(t.name, f"{t.agent_status} timed out after {budget} min")


# --- pass B: vanished boxes ------------------------------------------------ #
def _poll_box_gone(client, name: str):
	"""(gone, status): True/False if known, None if the poll was transient (skip this tick)."""
	try:
		info = client.get_box(name)
	except BenchSpaceError as e:
		msg = str(e)
		if "(404)" in msg or "DoesNotExist" in msg or "not found" in msg.lower():
			return True, "404"
		return None, None  # transient (network / 5xx) — don't fail on one flaky poll
	status = (info or {}).get("status")
	return status in ("deleted", "error"), status


def _reconcile_vanished_boxes(live: list) -> None:
	client = _client()
	if not client:
		return
	for t in live:
		if not t.agent_dev_box or t.agent_status not in service.PROVISIONED_STATES:
			continue
		gone, status = _poll_box_gone(client, t.agent_dev_box)
		if gone:
			service.mark_failed(t.name, f"Box disappeared (status={status})")


# --- pass C: idle teardown (cost) ------------------------------------------ #
def _sweep_idle(live: list, settings) -> None:
	hours = settings.idle_teardown_hours or 0
	if hours <= 0:
		return
	now = now_datetime()
	for t in live:
		if t.agent_status not in _IDLE_STATES or not t.agent_dev_box:
			continue
		age_h = (now - get_datetime(t.modified)).total_seconds() / 3600
		if age_h >= hours:
			service.mark_failed(t.name, f"Idle teardown after {hours} h")
			_enqueue(_DEPROVISION, t.name)  # idle overrides the Failed grace — reclaim now


# --- pass D: Failed grace + terminal-teardown retry ------------------------ #
def _sweep_terminal_teardown(settings) -> None:
	"""Tear down terminal tasks whose box has not been torn down yet.

	Failed boxes are kept `failed_teardown_grace_hours` for debugging; Merged/Cancelled
	boxes should already be gone, so an un-torn-down one means the synchronous teardown
	failed/raced — retry it after a short settle window. `deprovision_for_task` sets
	`agent_box_torn_down` only on success, so a torn-down box drops out of this set.
	"""
	grace_h = settings.failed_teardown_grace_hours or 0
	rows = frappe.get_all(
		"Hive Task",
		filters={
			"agent_status": ["in", list(service.TERMINAL_STATES)],
			"agent_dev_box": ["is", "set"],
			"agent_box_torn_down": 0,
		},
		fields=["name", "agent_status", "modified"],
	)
	now = now_datetime()
	for r in rows:
		age_min = (now - get_datetime(r.modified)).total_seconds() / 60
		if r.agent_status == "Failed":
			if grace_h <= 0 or age_min < grace_h * 60:
				continue
		elif age_min < _TEARDOWN_SETTLE_MINUTES:  # Merged/Cancelled — let the async job finish
			continue
		_enqueue(_DEPROVISION, r.name)


# --- orphan sweep ---------------------------------------------------------- #
def _sweep_orphans() -> None:
	"""Deprovision agent boxes no Hive task references (their task was hard-deleted)."""
	client = _client()
	if not client:
		return
	try:
		boxes = client.list_agent_boxes()
	except BenchSpaceError as e:
		frappe.log_error(title="reconcile: list_agent_boxes failed", message=str(e))
		return
	if not boxes:
		return
	referenced = set(
		frappe.get_all("Hive Task", filters={"agent_dev_box": ["is", "set"]}, pluck="agent_dev_box")
	)
	for b in boxes:
		name = b.get("name")
		if name and name not in referenced:
			try:
				client.deprovision(name)
			except BenchSpaceError as e:
				frappe.log_error(title=f"reconcile: orphan deprovision failed {name}", message=str(e))


# --- queue drain ----------------------------------------------------------- #
def _drain_queue(settings, cap: int, provisioned: int) -> None:
	if cap <= 0:
		return
	free = cap - provisioned
	if free <= 0:
		return
	queued = frappe.get_all(
		"Hive Task",
		filters={"agent_status": "Queued"},
		order_by="modified asc",  # FIFO
		limit=free,
		pluck="name",
	)
	for name in queued:
		_enqueue(_PROVISION, name)  # provision_for_task re-checks the cap, so it can't overshoot


# --- helpers --------------------------------------------------------------- #
def _client():
	try:
		return BenchSpaceClient()
	except BenchSpaceError as e:
		frappe.log_error(title="reconcile: BenchSpace client unavailable", message=str(e))
		return None


def _enqueue(method: str, task_name: str) -> None:
	frappe.enqueue(method, queue="long", enqueue_after_commit=True, task_name=task_name)
