"""Re-migrate Hive Task Assignee child table data to Frappe _assign using the
proper frappe.desk.form.assign_to API so that ToDo entries are also created.

This fixes the failed initial migration where _assign was set directly via
frappe.db.set_value without creating the corresponding ToDo documents.
"""

import frappe


def execute():
	if not frappe.db.table_exists("tabHive Task Assignee"):
		frappe.log_error(
			title="remigrate_assignees: table missing",
			message="tabHive Task Assignee does not exist — nothing to migrate.",
		)
		return

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
		frappe.log_error(
			title="remigrate_assignees: no rows",
			message="tabHive Task Assignee exists but has 0 matching rows.",
		)
		return

	# Group assignees by task
	task_assignees: dict[str, list[str]] = {}
	for row in rows:
		if row.member:
			task_assignees.setdefault(row.parent, []).append(row.member)

	migrated = 0
	skipped = 0

	for task_name, members in task_assignees.items():
		# Verify the task still exists
		if not frappe.db.exists("Hive Task", task_name):
			skipped += 1
			continue

		for member in members:
			# Check if already assigned (avoid duplicate ToDos)
			existing_todo = frappe.db.exists(
				"ToDo",
				{
					"reference_type": "Hive Task",
					"reference_name": task_name,
					"allocated_to": member,
					"status": ("!=", "Cancelled"),
				},
			)
			if existing_todo:
				continue

			try:
				from frappe.desk.form.assign_to import add as assign_add

				assign_add(
					{
						"doctype": "Hive Task",
						"name": task_name,
						"assign_to": [member],
						"notify": 0,  # Don't send emails during migration
					}
				)
				migrated += 1
			except Exception:
				frappe.log_error(
					title="remigrate_assignees: assign failed",
					message=f"Failed to assign {member} to {task_name}",
				)

	frappe.db.commit()
	frappe.log_error(
		title="remigrate_assignees: complete",
		message=f"Migrated {migrated} assignments, skipped {skipped} deleted tasks. Total tasks: {len(task_assignees)}",
	)
