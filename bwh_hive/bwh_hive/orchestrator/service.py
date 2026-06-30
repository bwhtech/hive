# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Agent orchestration core (specs/v2 §4, §5.3).

Owns: boot-env assembly, async provisioning, the `agent_status` state machine, control
-plane dispatch, and (Phase 1 stub) deprovision. Box callbacks and human/desk actions
both funnel status changes through `set_agent_status`, which is the single place that
validates transitions and fires side effects (notifications, teardown, control dispatch).
"""

import frappe
import requests
from frappe.model.document import Document

from bwh_hive.bwh_hive.orchestrator.benchspace import BenchSpaceClient, BenchSpaceError

AGENT_BOT_ROLE = "Agent Bot"

# Fallback cap when Hive Settings.max_concurrent_agent_boxes is unset (specs/v2 06-phase-5 §3).
DEFAULT_MAX_CONCURRENT_BOXES = 5

CONTROL_TIMEOUT = 30

# specs/v2 §4.2 — terminal states. Merged/Cancelled tear down immediately; Failed is kept
# for a grace period (debuggability) and swept by the watchdog (06-phase-5 step 2).
TERMINAL_STATES = {"Merged", "Cancelled", "Failed"}

# Terminal states whose `_react` tears the box down synchronously (Failed waits for the
# watchdog's grace sweep — 06-phase-5 pass D).
IMMEDIATE_TEARDOWN_STATES = {"Merged", "Cancelled"}

# Non-terminal agent states (everything the watchdog considers "live"). Queued is live but
# owns no box yet; PROVISIONED_STATES are the ones that hold a real box against the cap.
LIVE_STATES = {
	"Queued",
	"Provisioning",
	"Spec In Progress",
	"Spec Created",
	"Spec Approved",
	"Implementing",
	"PR Ready",
	"Changes Requested",
}
PROVISIONED_STATES = LIVE_STATES - {"Queued"}

# Allowed transitions, keyed by current state (specs/v2 §4.2). `Failed` and `Cancelled`
# are reachable from any non-terminal state and are injected below. `Failed → Queued` is
# the single sanctioned retry edge (06-phase-5 step 8).
_BASE_TRANSITIONS: dict[str, set[str]] = {
	"": {"Queued"},
	"Queued": {"Provisioning"},
	"Provisioning": {"Provisioning", "Spec In Progress"},
	"Spec In Progress": {"Spec Created"},
	"Spec Created": {"Spec Approved"},
	"Spec Approved": {"Implementing"},
	"Implementing": {"PR Ready"},
	"PR Ready": {"Changes Requested", "Merged"},
	"Changes Requested": {"Implementing"},
	"Failed": {"Queued"},  # retry only
}


def _allowed_targets(current: str) -> set[str]:
	targets = set(_BASE_TRANSITIONS.get(current, set()))
	if current not in TERMINAL_STATES:
		targets |= {"Failed", "Cancelled"}
	return targets


# Which actor may drive which target (specs/v2 §4.2). The orchestrator is trusted and
# may set anything reachable; box and human are constrained.
ACTOR_TARGETS: dict[str, set[str]] = {
	"box": {"Provisioning", "Spec In Progress", "Spec Created", "PR Ready", "Failed"},
	"human": {"Spec Approved", "Changes Requested", "Merged"},
	# "orchestrator" is unrestricted (handled in set_agent_status).
}


class InvalidAgentTransition(frappe.ValidationError):
	pass


# --------------------------------------------------------------------------- #
# Identity helpers
# --------------------------------------------------------------------------- #
def get_agent_user() -> str | None:
	"""Return the enabled User carrying the Agent Bot role (specs/v2 §2.2)."""
	users = frappe.get_all(
		"Has Role",
		filters={"role": AGENT_BOT_ROLE, "parenttype": "User"},
		pluck="parent",
	)
	enabled = [u for u in users if frappe.db.get_value("User", u, "enabled")]
	candidates = enabled or users
	# Prefer a dedicated bot over Administrator if both somehow carry the role.
	for u in candidates:
		if u != "Administrator":
			return u
	return candidates[0] if candidates else None


# --------------------------------------------------------------------------- #
# Boot-env assembly (specs/v2 §3)
# --------------------------------------------------------------------------- #
def build_boot_env(task: Document) -> dict:
	"""Assemble the MMDS agent context from Task + Project + Settings.

	Generates a fresh per-box CONTROL_TOKEN. All values are strings (MMDS env map).
	"""
	project = frappe.get_doc("Hive Project", task.project)
	settings = frappe.get_cached_doc("Hive Settings")
	skills_repo = project.get("skills_repo_override") or settings.skills_repo

	# Box-side self-timeout budgets (seconds), kept a few minutes BELOW the Hive watchdog
	# budgets so the box reports report_agent_error first and the watchdog is pure backstop
	# (specs/v2 06-phase-5 step 7). 0 setting → fall back to the field default.
	spec_min = settings.spec_timeout_minutes or 30
	impl_min = settings.implement_timeout_minutes or 45
	spec_run_timeout = max(spec_min - 5, 5) * 60
	impl_run_timeout = max(impl_min - 5, 5) * 60

	env = {
		"AGENT_MODE": "1",
		"HIVE_BASE_URL": frappe.utils.get_url(),
		"HIVE_API_KEY": settings.agent_callback_api_key or "",
		"HIVE_API_SECRET": settings.get_password("agent_callback_api_secret", raise_exception=False) or "",
		"HIVE_TASK_ID": task.name,
		"HIVE_PROJECT": project.get("slug") or project.name,
		"CONTROL_TOKEN": frappe.generate_hash(length=48),
		"GIT_REPO": project.get("github_repo") or "",
		"GIT_PAT": project.get_password("github_pat", raise_exception=False) or "",
		"TARGET_APP_NAME": project.get("target_app_name") or "",
		"TARGET_APP_REPO": project.get("target_app_repo") or "",
		"TARGET_APP_BRANCH": project.get("target_app_branch") or "develop",
		"SKILLS_REPO": skills_repo or "",
		"ANTHROPIC_API_KEY": settings.get_password("anthropic_api_key", raise_exception=False) or "",
		"SPEC_RUN_TIMEOUT": spec_run_timeout,
		"IMPL_RUN_TIMEOUT": impl_run_timeout,
	}
	return {k: str(v) for k, v in env.items()}


# --------------------------------------------------------------------------- #
# Provisioning (async; enqueued from the assignment hook)
# --------------------------------------------------------------------------- #
def provision_for_task(task_name: str) -> None:
	"""Provision a BenchSpace box for a Queued task (idempotent, enqueued).

	Guards: orchestration enabled, project agent-enabled, not already provisioned,
	under the concurrency cap. On success stores box coordinates + control token and
	advances to Provisioning. On BenchSpace failure, moves the task to Failed.
	"""
	task = frappe.get_doc("Hive Task", task_name)
	settings = frappe.get_cached_doc("Hive Settings")

	if not settings.agent_orchestration_enabled:
		return
	if task.agent_dev_box:
		return  # already provisioned — re-assignment no-op (specs/v2 decision)
	if task.agent_status != "Queued":
		# The task was unassigned/cancelled (reset to "" or a terminal state) between the
		# enqueue and now — don't provision a box nobody is waiting for. Only a Queued task
		# is a live provisioning request (06-phase-5: unassign-race guard).
		return

	project = frappe.get_doc("Hive Project", task.project)
	if not project.agent_enabled:
		_fail(task, "Project is not agent-enabled.")
		return

	cap = settings.max_concurrent_agent_boxes or DEFAULT_MAX_CONCURRENT_BOXES
	live_boxes = frappe.db.count("Hive Task", {"agent_status": ["in", list(PROVISIONED_STATES)]})
	if live_boxes >= cap:
		_comment(task, f"At concurrency cap ({cap} live boxes); staying Queued.")
		return

	boot_env = build_boot_env(task)
	control_token = boot_env["CONTROL_TOKEN"]
	template = project.get("agent_template_slug") or settings.default_agent_template_slug
	if not template:
		_fail(task, "No agent template configured.")
		return

	try:
		box = BenchSpaceClient().provision(template, boot_env)
	except Exception as e:  # any failure routes to Failed + audit log
		frappe.log_error(title=f"Agent provision failed: {task_name}", message=str(e))
		_fail(task, f"Provision failed: {e}")
		return

	# Persist box coordinates + control token in a single save (encrypts the Password).
	task.agent_dev_box = box.get("name")
	task.agent_box_slug = box.get("slug")
	task.agent_control_url = box.get("control_url")
	task.agent_site_url = box.get("site_url")
	task.agent_code_url = box.get("code_url")
	task.agent_control_token = control_token
	task.save(ignore_permissions=True)

	set_agent_status(
		task, "Provisioning", actor="orchestrator", message=f"Box {box.get('name')} provisioning."
	)


# --------------------------------------------------------------------------- #
# State machine (specs/v2 §4.2)
# --------------------------------------------------------------------------- #
def set_agent_status(task, new_status: str, actor: str, message: str | None = None) -> None:
	"""Validate and apply an agent_status transition, then fire side effects.

	`actor` ∈ {"box", "human", "orchestrator"}. Raises on an illegal transition or an
	actor that is not permitted to reach `new_status`.
	"""
	task_doc = task if isinstance(task, Document) else frappe.get_doc("Hive Task", task)
	current = task_doc.agent_status or ""

	if current == new_status:
		if message:
			_comment(task_doc, message)
		return

	if new_status not in _allowed_targets(current):
		frappe.throw(
			f"Invalid agent_status transition: {current or '(empty)'} → {new_status}",
			InvalidAgentTransition,
		)
	if actor != "orchestrator" and new_status not in ACTOR_TARGETS.get(actor, set()):
		frappe.throw(
			f"Actor '{actor}' may not set agent_status to {new_status}",
			frappe.PermissionError,
		)

	task_doc.db_set("agent_status", new_status)
	if message:
		_comment(task_doc, message)
	_notify(task_doc, new_status)
	_react(task_doc, new_status, actor)


def _react(task: Document, new_status: str, actor: str) -> None:
	"""Post-transition side effects.

	Merged/Cancelled tear the box down immediately; Failed keeps its box for the grace
	period and is swept by the watchdog (specs/v2 06-phase-5 step 2 / pass D). Entering
	Spec Approved kicks off the implementation run (Phase 3). The Changes Requested →
	/changes/apply dispatch is Phase 4.
	"""
	if new_status in IMMEDIATE_TEARDOWN_STATES:
		if task.agent_dev_box:
			frappe.enqueue(
				"bwh_hive.bwh_hive.orchestrator.service.deprovision_for_task",
				queue="long",
				enqueue_after_commit=True,
				task_name=task.name,
			)
		return
	if new_status in TERMINAL_STATES:  # Failed — deferred teardown (grace sweep)
		return
	if new_status == "Spec Approved":
		# Run the implement kickoff in the background: it flips the task to Implementing
		# and dispatches to the box over HTTP, which must not block the approving request.
		frappe.enqueue(
			"bwh_hive.bwh_hive.orchestrator.service.start_implementation_for_task",
			queue="long",
			enqueue_after_commit=True,
			task_name=task.name,
		)
	# Changes Requested → Implementing + dispatch /changes/apply is handled inline in
	# request_changes (it carries the comments payload and surfaces dispatch errors to the
	# reviewer synchronously), so it is intentionally not enqueued from here.


def _notify(task: Document, new_status: str) -> None:
	"""Notification hook (specs/v2 §07). Phase 1: no-op placeholder.

	The notifications module (07-notifications.md) plugs in here; left thin so the
	state machine is testable without a Telegram dependency.
	"""
	return


def start_implementation_for_task(task_name: str) -> None:
	"""Flip an approved task to Implementing and dispatch the box (specs/v2 04-phase-3 §A.2).

	Enqueued when a task enters Spec Approved. On a dispatch failure (box unreachable) it
	reverts to Spec Approved and records the error so the Phase 5 watchdog can retry.
	Idempotent: a task no longer in Spec Approved is left alone.
	"""
	task = frappe.get_doc("Hive Task", task_name)
	if task.agent_status != "Spec Approved":
		return

	set_agent_status(
		task, "Implementing", actor="orchestrator", message="Spec approved — dispatching implementation."
	)
	try:
		dispatch(task, "/implement/start", {})
	except Exception as e:
		frappe.log_error(title=f"Implement dispatch failed: {task_name}", message=str(e))
		# Revert directly: Implementing → Spec Approved is not a valid forward transition,
		# so go around set_agent_status. The watchdog (Phase 5) retries from here.
		task.db_set("agent_last_error", f"Implement dispatch failed: {e}")
		task.db_set("agent_status", "Spec Approved")
		_comment(task, "Implementation dispatch failed; reverted to Spec Approved (will retry).")


def request_changes(task, comments: list[dict]) -> None:
	"""Human asks the agent for another PR iteration (specs/v2 05-phase-4 §B.6).

	PR Ready → Changes Requested (human) → Implementing (orchestrator), then dispatch the
	comments to the box. Dispatch is synchronous so a box-unreachable error surfaces to the
	reviewer; on failure the task rolls back to PR Ready rather than stranding in Implementing.
	"""
	task_doc = task if isinstance(task, Document) else frappe.get_doc("Hive Task", task)

	set_agent_status(task_doc, "Changes Requested", actor="human", message="Changes requested.")
	set_agent_status(
		task_doc, "Implementing", actor="orchestrator", message="Dispatching review changes to the box."
	)
	try:
		dispatch(task_doc, "/changes/apply", {"comments": comments})
	except Exception as e:
		frappe.log_error(title=f"Changes dispatch failed: {task_doc.name}", message=str(e))
		# Revert directly: Implementing → PR Ready is not a valid forward transition, so go
		# around set_agent_status. The reviewer retries.
		task_doc.db_set("agent_last_error", f"Changes dispatch failed: {e}")
		task_doc.db_set("agent_status", "PR Ready")
		_comment(task_doc, "Changes dispatch failed; reverted to PR Ready.")
		frappe.throw(f"Could not dispatch changes to the box: {e}")


def mark_merged(task) -> None:
	"""Record that the PR was merged (specs/v2 05-phase-4 §B.8).

	Only state — Merged is terminal, so the existing `_react` enqueues deprovision (the
	`Merged → deprovision` reaction locked in 00-architecture §4.2).
	"""
	task_doc = task if isinstance(task, Document) else frappe.get_doc("Hive Task", task)
	set_agent_status(task_doc, "Merged", actor="human", message="PR merged.")


def deprovision_for_task(task_name: str) -> None:
	"""The single teardown sink (specs/v2 06-phase-5 step 1).

	Idempotent: no-op if the task never had a box; BenchSpace `deprovision` is itself a
	no-op on an already-deleted/missing box, so the merge transition, unassign hook, and
	watchdog can all race here harmlessly. Retains the audit fields (agent_dev_box, pr_link,
	branch, spec_path, URLs, last_error) and clears only the now-dead control credential.
	"""
	task = frappe.get_doc("Hive Task", task_name)
	if not task.agent_dev_box or task.agent_box_torn_down:
		return  # never provisioned, or already torn down — no-op
	try:
		BenchSpaceClient().deprovision(task.agent_dev_box)
	except Exception as e:  # teardown failures are logged, not fatal
		# Leave agent_box_torn_down = 0: the box may still be alive, and the watchdog's
		# terminal-teardown sweep re-attempts a not-yet-torn-down box next tick
		# (06-phase-5 cleanup table).
		frappe.log_error(title=f"Agent deprovision failed: {task_name}", message=str(e))
		return

	# Success (incl. already-deleted box): the control token is now a dead secret (§2.3).
	# Frappe keeps Password values in `__Auth` (the doc column is just a `*****` placeholder),
	# so removing it requires remove_encrypted_password — db_set on the field would not clear
	# the secret. Mark the box torn down so the watchdog sweep skips it (the queryable signal).
	from frappe.utils.password import remove_encrypted_password

	remove_encrypted_password("Hive Task", task.name, "agent_control_token")
	task.db_set({"agent_control_token": None, "agent_box_torn_down": 1})


# --------------------------------------------------------------------------- #
# Control-plane dispatch (specs/v2 §5.3)
# --------------------------------------------------------------------------- #
def dispatch(task, path: str, body: dict | None = None) -> dict:
	"""POST to the box control plane with the per-box bearer token."""
	task_doc = task if isinstance(task, Document) else frappe.get_doc("Hive Task", task)
	url = task_doc.agent_control_url
	token = task_doc.get_password("agent_control_token", raise_exception=False)
	if not (url and token):
		raise BenchSpaceError(f"Task {task_doc.name} has no control plane URL/token")

	resp = requests.post(
		f"{url.rstrip('/')}{path}",
		json=body or {},
		headers={"Authorization": f"Bearer {token}"},
		timeout=CONTROL_TIMEOUT,
	)
	resp.raise_for_status()
	return resp.json() if resp.text else {}


# --------------------------------------------------------------------------- #
# Assignment reactions (called from the ToDo doc-event hook)
# --------------------------------------------------------------------------- #
def on_agent_assigned(task_name: str) -> None:
	"""The Agent user was assigned to a task → queue provisioning (idempotent)."""
	settings = frappe.get_cached_doc("Hive Settings")
	if not settings.agent_orchestration_enabled:
		return

	task = frappe.get_doc("Hive Task", task_name)
	if task.agent_status or task.agent_dev_box:
		return  # already agent-managed — one box per task

	project = frappe.get_doc("Hive Project", task.project)
	if not project.agent_enabled:
		return

	set_agent_status(
		task, "Queued", actor="orchestrator", message="Assigned to Agent — queued for provisioning."
	)
	frappe.enqueue(
		"bwh_hive.bwh_hive.orchestrator.service.provision_for_task",
		queue="long",
		enqueue_after_commit=True,
		task_name=task.name,
	)


def on_agent_unassigned(task_name: str) -> None:
	"""The Agent user was unassigned → cancel + tear down (specs/v2 §4.2).

	A task that was never provisioned (no box) just resets to "" — there's nothing to tear
	down and it leaves the agent flow cleanly (06-phase-5 step 2).
	"""
	task = frappe.get_doc("Hive Task", task_name)
	if not task.agent_status or task.agent_status in TERMINAL_STATES:
		return
	if not task.agent_dev_box:
		task.db_set("agent_status", "")
		return
	set_agent_status(task, "Cancelled", actor="orchestrator", message="Agent unassigned — cancelling.")


# --------------------------------------------------------------------------- #
# Desk / lifecycle actions (specs/v2 06-phase-5 steps 2, 8, 9)
# --------------------------------------------------------------------------- #
def cancel_agent_task(task_name: str) -> None:
	"""Explicit cancel: transition to Cancelled, drop the Agent assignment, tear down.

	Routes through `set_agent_status` so `_react` enqueues teardown (Cancelled is an
	immediate-teardown state). Safe at any non-terminal phase, including Queued/Provisioning.
	"""
	task = frappe.get_doc("Hive Task", task_name)
	if not task.agent_status:
		frappe.throw("Task is not agent-managed.")
	if task.agent_status in TERMINAL_STATES:
		return  # already cancelled/merged/failed — nothing to do
	set_agent_status(task, "Cancelled", actor="orchestrator", message="Cancelled by user.")
	_clear_agent_assignment(task)


def force_teardown(task_name: str) -> None:
	"""Tear a box down ahead of the watchdog grace sweep ("Tear Down Now" — 06-phase-5 step 9)."""
	deprovision_for_task(task_name)


def retry_agent_task(task_name: str) -> dict:
	"""Re-provision a clean box for a Failed task (specs/v2 06-phase-5 step 8).

	Tears the old box down and clears the box-binding fields BEFORE re-queuing, so
	`provision_for_task`'s "already provisioned ⇒ no-op" guard can never leave two live
	boxes. Goes through Queued (not straight to Provisioning) so the concurrency cap still
	applies. A second rapid retry finds the task at Queued (not Failed) and is rejected.
	"""
	task = frappe.get_doc("Hive Task", task_name)
	if task.agent_status != "Failed":
		frappe.throw("Retry is only available for a Failed task.")

	deprovision_for_task(task.name)  # idempotent
	task.db_set(
		{
			"agent_dev_box": None,
			"agent_box_slug": None,
			"agent_control_url": None,
			"agent_control_token": None,
			"agent_site_url": None,
			"agent_code_url": None,
			"agent_last_error": None,
			"agent_box_torn_down": 0,  # fresh box will be tear-down-able again
		}
	)

	set_agent_status(task, "Queued", actor="orchestrator", message="Retry requested.")
	frappe.enqueue(
		"bwh_hive.bwh_hive.orchestrator.service.provision_for_task",
		queue="long",
		enqueue_after_commit=True,
		task_name=task.name,
	)
	return {"ok": True}


def _clear_agent_assignment(task: Document) -> None:
	"""Best-effort removal of the Agent user's assignment (ToDo) on a task.

	Removing the ToDo re-fires `on_todo_change` → `on_agent_unassigned`, which no-ops on a
	terminal task — so this is safe to call right after setting Cancelled.
	"""
	agent = get_agent_user()
	if not agent:
		return
	try:
		from frappe.desk.form.assign_to import remove

		remove("Hive Task", task.name, agent)
	except Exception as e:
		frappe.log_error(title=f"Clear agent assignment failed: {task.name}", message=str(e))


# --------------------------------------------------------------------------- #
# Internal
# --------------------------------------------------------------------------- #
def _fail(task: Document, reason: str) -> None:
	"""Surface an orchestrator-side failure on agent_last_error, then move to Failed.

	The spec (specs/v2 §B.5) requires provision/orchestration errors to land on
	agent_last_error, not just a comment.
	"""
	task.db_set("agent_last_error", reason)
	set_agent_status(task, "Failed", actor="orchestrator", message=reason)


def mark_failed(task, reason: str) -> None:
	"""Public watchdog entry point: record `reason` and transition to Failed (idempotent).

	A no-op on an already-terminal task, so the watchdog passes can call it freely without
	racing each other or the box's own `report_agent_error` (06-phase-5 passes A-C).
	"""
	doc = task if isinstance(task, Document) else frappe.get_doc("Hive Task", task)
	if doc.agent_status in TERMINAL_STATES:
		return
	_fail(doc, reason)


def _comment(task: Document, content: str) -> None:
	"""Append a lightweight timeline comment on the task."""
	frappe.get_doc(
		{
			"doctype": "Hive Task Comment",
			"task": task.name,
			"content": content,
			"posted_by": frappe.session.user,
		}
	).insert(ignore_permissions=True)
