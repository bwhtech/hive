# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import json

import frappe
from frappe.model.document import Document
from frappe.utils import add_days, add_months, getdate, today

VALID_TRANSITIONS: dict[str, set[str]] = {
	"Someday": {"Backlog", "To Do", "In Progress", "Done", "Blocked"},
	"Backlog": {"Someday", "To Do", "In Progress", "Done", "Blocked"},
	"To Do": {"Someday", "Backlog", "In Progress", "Done", "Blocked"},
	"In Progress": {"Someday", "Backlog", "To Do", "Done", "Blocked"},
	"Done": {"To Do", "In Progress"},
	"Blocked": {"Someday", "Backlog", "To Do", "In Progress", "Done"},
}

# Days/months delta for each recurrence frequency
RECURRENCE_DELTA: dict[str, tuple[str, int]] = {
	"Daily": ("days", 1),
	"Weekly": ("days", 7),
	"Monthly": ("months", 1),
	"Quarterly": ("months", 3),
	"Yearly": ("months", 12),
}


def _add_period(base_date, frequency: str):
	delta = RECURRENCE_DELTA.get(frequency)
	if not delta:
		return None
	unit, amount = delta
	if unit == "days":
		return add_days(base_date, amount)
	return add_months(base_date, amount)


class HiveTask(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

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
		recurrence_end_date: DF.Date | None
		recurrence_frequency: DF.Literal["", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]
		recurring_parent: DF.Link | None
		size: DF.Literal["", "Small", "Medium", "Large"]
		start_date: DF.Date | None
		status: DF.Literal["Someday", "Backlog", "To Do", "In Progress", "Done", "Blocked"]
		title: DF.Data
	# end: auto-generated types

	def validate(self):
		self._validate_status_transition()
		self._validate_dates()
		self._validate_dependency()
		self._set_completed_on()

	def on_update(self):
		self._maybe_spawn_recurrence()

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

	def _maybe_spawn_recurrence(self):
		"""When a recurring task is marked Done, spawn the next instance.

		Skips if the frequency is unset, the status didn't just change to Done,
		or the computed next due date is past `recurrence_end_date`.
		"""
		if not self.recurrence_frequency or self.status != "Done":
			return
		if not self.has_value_changed("status"):
			return
		if self.flags.get("recurrence_spawned"):
			return

		next_due = _add_period(self.due_date or today(), self.recurrence_frequency)
		if not next_due:
			return
		if self.recurrence_end_date and getdate(next_due) > getdate(self.recurrence_end_date):
			return

		new_start = None
		if self.start_date and self.due_date:
			interval_days = (getdate(self.due_date) - getdate(self.start_date)).days
			new_start = add_days(next_due, -interval_days)

		parent_name = self.recurring_parent or self.name
		new_task = frappe.new_doc("Hive Task")
		new_task.update(
			{
				"title": self.title,
				"project": self.project,
				"priority": self.priority,
				"status": "To Do",
				"size": self.size,
				"milestone": self.milestone,
				"is_internal": self.is_internal,
				"description": self.description,
				"due_date": next_due,
				"start_date": new_start,
				"recurrence_frequency": self.recurrence_frequency,
				"recurrence_end_date": self.recurrence_end_date,
				"recurring_parent": parent_name,
			}
		)
		new_task.flags.recurrence_spawned = True
		new_task.insert(ignore_permissions=True)

		assignees = json.loads(self.get("_assign") or "[]")
		if assignees:
			from frappe.desk.form.assign_to import add as assign_add

			try:
				assign_add(
					{
						"doctype": "Hive Task",
						"name": new_task.name,
						"assign_to": assignees,
						"notify": 0,
					}
				)
			except Exception:
				frappe.log_error(
					title="recurring task: assign failed",
					message=f"Failed to assign {assignees} to {new_task.name}",
				)
