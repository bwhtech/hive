"""Copy Hive Task Assignee child table data to the standard _assign field.

Runs in pre_model_sync so the child table data is still accessible before
the DocType schema change removes the `assignees` Table field.
"""

import json

import frappe


def execute():
	# Check if the child table still exists (idempotent)
	if not frappe.db.table_exists("Hive Task Assignee"):
		return

	# Read all child table rows grouped by parent task
	rows = frappe.db.sql(
		"""
		SELECT parent, member
		FROM `tabHive Task Assignee`
		WHERE parenttype = 'Hive Task' AND parentfield = 'assignees'
		ORDER BY parent, idx
		""",
		as_dict=True,
	)

	if not rows:
		return

	task_assignees: dict[str, list[str]] = {}
	for row in rows:
		task_assignees.setdefault(row.parent, []).append(row.member)

	for task_name, members in task_assignees.items():
		# Read existing _assign to avoid overwriting
		existing = frappe.db.get_value("Hive Task", task_name, "_assign")
		existing_list = json.loads(existing) if existing else []

		# Merge: keep existing + add from child table (deduplicated, order preserved)
		merged = list(dict.fromkeys(existing_list + members))
		frappe.db.set_value(
			"Hive Task",
			task_name,
			"_assign",
			json.dumps(merged),
			update_modified=False,
		)
