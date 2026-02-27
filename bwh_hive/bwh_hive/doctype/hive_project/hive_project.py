# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class HiveProject(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		client: DF.Link | None
		description: DF.TextEditor | None
		erp_project: DF.Data | None
		project_type: DF.Link | None
		status: DF.Literal["Open", "Completed", "On Hold"]
		title: DF.Data
	# end: auto-generated types

	def after_insert(self):
		self.sync_to_erpnext_project()

	def sync_to_erpnext_project(self):
		"""Create an ERPNext Project if sync is enabled and ERPNext is installed."""
		if not _is_erpnext_sync_enabled():
			return

		if not frappe.db.exists("DocType", "Project"):
			return

		settings = frappe.get_single("Hive Settings")
		company = settings.default_company
		if not company:
			frappe.log_error(
				title="Hive ERPNext Sync: Missing Company",
				message="Default Company is not set in Hive Settings. Cannot create ERPNext Project.",
			)
			return

		STATUS_MAP = {
			"Open": "Open",
			"Completed": "Completed",
			"On Hold": "Cancelled",
		}

		erp_project = frappe.new_doc("Project")
		erp_project.project_name = self.title
		erp_project.status = STATUS_MAP.get(self.status, "Open")
		erp_project.company = company
		erp_project.notes = self.description or ""
		erp_project.insert(ignore_permissions=True)

		frappe.db.set_value("Hive Project", self.name, "erp_project", erp_project.name, update_modified=False)


def _is_erpnext_sync_enabled() -> bool:
	"""Check if ERPNext sync is enabled in Hive Settings."""
	try:
		return bool(frappe.db.get_single_value("Hive Settings", "enable_erpnext_sync"))
	except Exception:
		return False
