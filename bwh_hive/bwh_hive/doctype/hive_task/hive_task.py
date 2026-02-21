# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class HiveTask(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		assigned_to: DF.Link | None
		description: DF.TextEditor | None
		priority: DF.Literal["Low", "Medium", "High", "Urgent"]
		project: DF.Link
		status: DF.Literal["Backlog", "To Do", "In Progress", "Done", "Blocked"]
		title: DF.Data
	# end: auto-generated types

	pass
