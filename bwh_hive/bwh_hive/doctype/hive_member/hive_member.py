# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class HiveMember(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		designation: DF.Data | None
		is_active: DF.Check
		member_name: DF.Data | None
		type: DF.Literal["Team", "Client"]
		user: DF.Link
		user_image: DF.Data | None
	# end: auto-generated types

	pass
