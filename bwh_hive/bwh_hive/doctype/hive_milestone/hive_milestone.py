# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class HiveMilestone(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		description: DF.TextEditor | None
		project: DF.Link
		status: DF.Literal["Upcoming", "In Progress", "Completed"]
		target_date: DF.Date | None
		title: DF.Data
	# end: auto-generated types

	pass
