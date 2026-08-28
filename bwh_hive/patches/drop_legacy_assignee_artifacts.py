"""Drop what the move to `_assign` and to view icons left behind.

The Hive Task Assignee child table and the `assigned_to` column are both
superseded by `_assign`; `Hive View.emoji` is superseded by icon/color/avatar.
Removing a field from a DocType JSON leaves its column in place, so drop those
here. Runs in post_model_sync, after the schema sync.
"""

import frappe


def execute():
	if frappe.db.exists("DocType", "Hive Task Assignee"):
		frappe.delete_doc("DocType", "Hive Task Assignee", force=True, ignore_missing=True)

	# `delete_doc` on the DocType leaves the table behind when it is forced.
	frappe.db.sql_ddl("DROP TABLE IF EXISTS `tabHive Task Assignee`")

	_drop_column("Hive Task", "assigned_to")
	_drop_column("Hive View", "emoji")


def _drop_column(doctype: str, column: str):
	if frappe.db.has_column(doctype, column):
		frappe.db.sql_ddl(f"ALTER TABLE `tab{doctype}` DROP COLUMN `{column}`")
