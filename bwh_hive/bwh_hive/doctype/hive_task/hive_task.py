# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today


class HiveTask(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		assigned_to: DF.Link | None
		description: DF.TextEditor | None
		due_date: DF.Date | None
		is_client_task: DF.Check
		pr_link: DF.Data | None
		priority: DF.Literal["Low", "Medium", "High", "Urgent"]
		project: DF.Link
		start_date: DF.Date | None
		status: DF.Literal["Backlog", "To Do", "In Progress", "Done", "Blocked"]
		title: DF.Data
		uat_approved_by: DF.Link | None
		uat_date: DF.Date | None
		uat_status: DF.Literal["Pending", "Approved", "Rejected"]
	# end: auto-generated types

	@frappe.whitelist()
	def approve_uat(self):
		self.uat_status = "Approved"
		self.uat_approved_by = frappe.session.user
		self.uat_date = today()
		self.save()

	@frappe.whitelist()
	def reject_uat(self):
		self.uat_status = "Rejected"
		self.uat_approved_by = frappe.session.user
		self.uat_date = today()
		self.save()
