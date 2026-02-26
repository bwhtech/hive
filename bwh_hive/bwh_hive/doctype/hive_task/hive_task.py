# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today

VALID_TRANSITIONS: dict[str, set[str]] = {
	"Backlog": {"To Do", "In Progress", "Done", "Blocked"},
	"To Do": {"Backlog", "In Progress", "Done", "Blocked"},
	"In Progress": {"To Do", "Done", "Blocked"},
	"Done": {"To Do", "In Progress"},
	"Blocked": {"Backlog", "To Do", "In Progress", "Done"},
}


class HiveTask(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		assigned_to: DF.Link | None
		completed_on: DF.Date | None
		depends_on: DF.Link | None
		description: DF.TextEditor | None
		due_date: DF.Date | None
		is_archived: DF.Check
		is_internal: DF.Check
		milestone: DF.Link | None
		pr_link: DF.Data | None
		priority: DF.Literal["Low", "Medium", "High", "Urgent"]
		project: DF.Link
		size: DF.Literal["", "Small", "Medium", "Large"]
		start_date: DF.Date | None
		status: DF.Literal["Backlog", "To Do", "In Progress", "Done", "Blocked"]
		title: DF.Data
		uat_approved_by: DF.Link | None
		uat_date: DF.Date | None
		uat_status: DF.Literal["Pending", "Approved", "Rejected"]
	# end: auto-generated types

	def on_update(self):
		self._notify_new_assignees()

	def validate(self):
		self._validate_status_transition()
		self._validate_dates()
		self._validate_dependency()
		self._set_completed_on()

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

	def _validate_dependency(self):
		if not self.depends_on:
			return

		if self.depends_on == self.name:
			frappe.throw("A task cannot depend on itself")

		# Walk the dependency chain to detect cycles
		visited = {self.name}
		current = self.depends_on
		while current:
			if current in visited:
				frappe.throw("Circular dependency detected")
			visited.add(current)
			current = frappe.db.get_value("Hive Task", current, "depends_on")

	def _set_completed_on(self):
		if self.status == "Done" and not self.completed_on:
			self.completed_on = today()
		elif self.status != "Done":
			self.completed_on = None

	def _notify_new_assignees(self):
		if self.is_new():
			return

		old_assignees = set()
		if self._doc_before_save:
			for a in self._doc_before_save.get("assignees", []):
				old_assignees.add(a.member)

		new_assignees = {a.member for a in self.get("assignees", [])}
		added = new_assignees - old_assignees
		# Don't notify yourself
		added.discard(frappe.session.user)
		if not added:
			return

		from_name = frappe.get_cached_value("User", frappe.session.user, "full_name") or frappe.session.user
		subject = f"{from_name} assigned you to: {self.title}"

		from frappe.desk.doctype.notification_log.notification_log import enqueue_create_notification

		enqueue_create_notification(
			list(added),
			{
				"type": "Assignment",
				"document_type": "Hive Task",
				"document_name": self.name,
				"subject": subject,
				"from_user": frappe.session.user,
				"email_content": f"You have been assigned to task: {self.title}",
			},
		)

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
