# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

from __future__ import annotations

import frappe
from frappe.model.document import Document


class HiveFeatureRequest(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		converted_task: DF.Link | None
		description: DF.TextEditor | None
		priority: DF.Literal["Nice to Have", "Important", "Critical"]
		project: DF.Link
		requested_by: DF.Link
		status: DF.Literal["Open", "Under Review", "Approved", "Rejected", "Converted"]
		title: DF.Data
	# end: auto-generated types

	@frappe.whitelist()
	def review(self: HiveFeatureRequest, action: str) -> None:
		"""Team reviews a feature request: approve, reject, or set under review."""
		valid = {"approve": "Approved", "reject": "Rejected", "under_review": "Under Review"}
		if action not in valid:
			frappe.throw(f"Invalid action: {action}")
		self.status = valid[action]
		self.save()

	@frappe.whitelist()
	def convert_to_task(self: HiveFeatureRequest) -> str:
		"""Convert this feature request into a Hive Task."""
		if self.status == "Converted":
			frappe.throw("Already converted to a task")

		task = frappe.get_doc(
			{
				"doctype": "Hive Task",
				"title": self.title,
				"project": self.project,
				"description": self.description,
				"status": "Backlog",
				"priority": "Medium",
				"is_client_task": 1,
			}
		)
		task.insert()

		self.status = "Converted"
		self.converted_task = task.name
		self.save()

		return task.name
