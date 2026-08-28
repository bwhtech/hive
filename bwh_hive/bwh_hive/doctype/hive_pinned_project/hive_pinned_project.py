# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class HivePinnedProject(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		name: DF.Int | None
		order: DF.Int
		project: DF.Link
		user: DF.Link
	# end: auto-generated types

	def before_insert(self):
		# A pin always belongs to whoever made it; the client never picks the user.
		self.user = frappe.session.user
		self.order = frappe.db.count("Hive Pinned Project", {"user": self.user}) + 1

		if frappe.db.exists("Hive Pinned Project", {"user": self.user, "project": self.project}):
			frappe.throw(_("This project is already pinned"))

		if not frappe.has_permission("Hive Project", doc=self.project, ptype="read"):
			frappe.throw(_("Not permitted"), frappe.PermissionError)


def get_pinned_project_names(user: str | None = None) -> list[str]:
	"""Pinned project names for a user, in pin order."""
	# `order` is an SQL keyword, which `get_all`'s order_by validation rejects.
	Pin = frappe.qb.DocType("Hive Pinned Project")
	return (
		frappe.qb.from_(Pin)
		.select(Pin.project)
		.where(Pin.user == (user or frappe.session.user))
		.orderby(Pin.order)
		.orderby(Pin.name)
		.run(pluck=True)
	)


@frappe.whitelist()
def get_pinned_projects() -> list[str]:
	return get_pinned_project_names()


@frappe.whitelist(methods=["POST"])
def toggle_pin(project: str) -> list[str]:
	"""Pin `project` for the session user, or unpin it if already pinned.

	Returns the resulting pinned list so the caller can replace its state in one go.
	"""
	user = frappe.session.user
	existing = frappe.db.get_value("Hive Pinned Project", {"user": user, "project": project})

	if existing:
		frappe.delete_doc("Hive Pinned Project", existing, ignore_permissions=True)
	else:
		frappe.get_doc({"doctype": "Hive Pinned Project", "project": project}).insert()

	return get_pinned_project_names(user)
