# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Doc-event glue that turns Agent assignment into provisioning (specs/v2 §C.8).

Hive assigns via Frappe's standard `assign_to.add`, which creates a **ToDo** and updates
the document's `_assign` field directly — it does NOT run the Hive Task's `on_update`.
So we hook the **ToDo** doctype (not Hive Task) to reliably observe assignment changes,
filter to Hive Task ToDos allocated to the Agent user, and route into the orchestrator.

Idempotency lives in the orchestrator: `on_agent_assigned` no-ops if the task is already
agent-managed; `on_agent_unassigned` no-ops if it is unset or already terminal. So firing
on every relevant ToDo event is safe.
"""

import frappe

from bwh_hive.bwh_hive.orchestrator import service

# ToDo statuses that mean "assignment is no longer active".
_INACTIVE_TODO_STATUS = {"Cancelled", "Closed"}


def on_todo_change(doc, method: str) -> None:
	"""React to ToDo create/update/trash for Agent-assigned Hive Tasks."""
	if doc.reference_type != "Hive Task" or not doc.reference_name:
		return

	agent_user = service.get_agent_user()
	if not agent_user or doc.allocated_to != agent_user:
		return

	if not frappe.db.exists("Hive Task", doc.reference_name):
		return

	# Assignment is "active" only on an open ToDo that still exists.
	active = method != "on_trash" and (doc.status not in _INACTIVE_TODO_STATUS)

	if active:
		service.on_agent_assigned(doc.reference_name)
	else:
		service.on_agent_unassigned(doc.reference_name)
