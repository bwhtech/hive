# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today

VALID_TRANSITIONS: dict[str, set[str]] = {
	"Backlog": {"To Do", "In Progress", "Blocked"},
	"To Do": {"Backlog", "In Progress", "Blocked"},
	"In Progress": {"To Do", "Done", "Blocked"},
	"Done": {"To Do", "In Progress"},
	"Blocked": {"Backlog", "To Do", "In Progress"},
}


class HiveTask(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		assigned_to: DF.Link | None
		description: DF.TextEditor | None
		due_date: DF.Date | None
		is_internal: DF.Check
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

	def validate(self):
		self._validate_status_transition()
		self._validate_dates()

	def _validate_status_transition(self):
		if self.is_new():
			return

		old_status = self.get_db_value("status")
		if not old_status or old_status == self.status:
			return

		allowed = VALID_TRANSITIONS.get(old_status, set())
		if self.status not in allowed:
			frappe.throw(f"Cannot move task from '{old_status}' to '{self.status}'")

	def _validate_dates(self):
		if self.start_date and self.due_date and self.start_date > self.due_date:
			frappe.throw("Start date cannot be after due date")

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
