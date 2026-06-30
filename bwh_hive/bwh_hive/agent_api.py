# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Box → Hive callback API (specs/v2).

Endpoints the in-VM control plane calls to report agent lifecycle state back to a
Hive Task. Auth is the shared "Agent" bot service key (00-architecture.md §2.2):
every method asserts the calling session is the Agent bot (by role) before writing.

Phase 0 (specs/v2/01-phase-0-mvp.md) ships just `report_agent_status`. Phase 1
expands this to the full §5.1 surface (set_spec_ready / set_pr_ready / ...).

All methods are type-annotated — Hive enforces require_type_annotated_api_methods
(hooks.py).
"""

import frappe

AGENT_BOT_ROLE = "Agent Bot"


def _assert_agent_caller() -> None:
	"""Reject callers that are not the Agent bot user.

	The bot is identified by the `Agent Bot` role rather than a hardcoded email, so
	the shared service key (carried on that user) is the only thing that can drive
	these callbacks. A leaked non-bot key cannot reach them.
	"""
	if AGENT_BOT_ROLE not in frappe.get_roles(frappe.session.user):
		frappe.throw("Only the Agent bot may call agent callbacks.", frappe.PermissionError)


@frappe.whitelist(methods=["POST"])
def report_agent_status(task: str, status: str, message: str | None = None) -> dict:
	"""Set a Hive Task's agent_status and optionally append a timeline comment.

	Phase 0 keeps this deliberately thin: no transition validation (that lands in
	Phase 1's orchestrator). It exists to prove the box can reach Hive with the
	shared key and move the task.
	"""
	_assert_agent_caller()

	if not frappe.db.exists("Hive Task", task):
		frappe.throw(f"Hive Task {task} not found")

	doc = frappe.get_doc("Hive Task", task)
	doc.db_set("agent_status", status)

	if message:
		frappe.get_doc(
			{
				"doctype": "Hive Task Comment",
				"task": task,
				"content": message,
				"posted_by": frappe.session.user,
			}
		).insert(ignore_permissions=True)

	return {"ok": True, "agent_status": status}
