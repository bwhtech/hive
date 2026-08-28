"""Fold the legacy single-user `assigned_to` field into Frappe's `_assign`.

`assigned_to` predates multi-assignee support. Tasks that were never touched
since still carry an assignee there and nowhere else, so copy them across —
through `assign_to.add`, so the matching ToDo exists — before the field goes.

Runs in pre_model_sync: the column has to still be there to be read.
"""

import json

import frappe
from frappe.desk.form.assign_to import _add as assign_to_add


def execute():
	if not frappe.db.has_column("Hive Task", "assigned_to"):
		return

	rows = frappe.db.sql(
		"""
		SELECT name, assigned_to, _assign
		FROM `tabHive Task`
		WHERE assigned_to IS NOT NULL AND assigned_to != ''
		""",
		as_dict=True,
	)

	for row in rows:
		already = json.loads(row._assign) if row._assign else []
		if row.assigned_to in already:
			continue
		if not frappe.db.exists("User", row.assigned_to):
			continue
		try:
			assign_to_add(
				{
					"doctype": "Hive Task",
					"name": row.name,
					"assign_to": [row.assigned_to],
				},
				ignore_permissions=True,
			)
		except Exception:
			frappe.log_error(
				title="migrate_assigned_to_to_assign",
				message=f"Could not assign {row.assigned_to} to {row.name}:\n{frappe.get_traceback()}",
			)
