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

# How many live agent boxes may exist at once. Tasks beyond the cap stay Queued.
MAX_CONCURRENT_BOXES = 3

CONTROL_TIMEOUT = 30

# specs/v2 §4.2 — terminal states; both trigger teardown.
TERMINAL_STATES = {"Merged", "Cancelled", "Failed"}

# Allowed transitions, keyed by current state (specs/v2 §4.2). `Failed` and `Cancelled`
# are reachable from any non-terminal state and are injected below.
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

	project = frappe.get_doc("Hive Project", task.project)
	if not project.agent_enabled:
		_fail(task, "Project is not agent-enabled.")
		return

	live_boxes = frappe.db.count(
		"Hive Task",
		{"agent_dev_box": ["is", "set"], "agent_status": ["not in", list(TERMINAL_STATES)]},
	)
	if live_boxes >= MAX_CONCURRENT_BOXES:
		_comment(task, f"At concurrency cap ({MAX_CONCURRENT_BOXES} live boxes); staying Queued.")
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

	Phase 1 wires teardown on terminal states. The Spec Approved → Implementing and
	Changes Requested -> Implementing control dispatches land in Phases 3-4.
	"""
	if new_status in TERMINAL_STATES:
		if task.agent_dev_box:
			frappe.enqueue(
				"bwh_hive.bwh_hive.orchestrator.service.deprovision_for_task",
				queue="long",
				enqueue_after_commit=True,
				task_name=task.name,
			)
	# TODO(Phase 3): on "Spec Approved" → set_agent_status(Implementing) + dispatch /implement/start
	# TODO(Phase 4): on "Changes Requested" → dispatch /changes/apply


def _notify(task: Document, new_status: str) -> None:
	"""Notification hook (specs/v2 §07). Phase 1: no-op placeholder.

	The notifications module (07-notifications.md) plugs in here; left thin so the
	state machine is testable without a Telegram dependency.
	"""
	return


def deprovision_for_task(task_name: str) -> None:
	"""Tear down a task's box (specs/v2 Phase 5 stub).

	Idempotent: no-op if the task never had a box. Leaves the box coordinates on the
	task for audit; full field cleanup is Phase 5.
	"""
	task = frappe.get_doc("Hive Task", task_name)
	if not task.agent_dev_box:
		return
	try:
		BenchSpaceClient().deprovision(task.agent_dev_box)
	except Exception as e:  # teardown failures are logged, not fatal
		frappe.log_error(title=f"Agent deprovision failed: {task_name}", message=str(e))


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
	"""The Agent user was unassigned → cancel + tear down (specs/v2 §4.2)."""
	task = frappe.get_doc("Hive Task", task_name)
	if not task.agent_status or task.agent_status in TERMINAL_STATES:
		return
	set_agent_status(task, "Cancelled", actor="orchestrator", message="Agent unassigned — cancelling.")


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
