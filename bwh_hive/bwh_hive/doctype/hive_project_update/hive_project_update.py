# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

from __future__ import annotations

import frappe
from frappe.model.document import Document


class HiveProjectUpdate(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		from bwh_hive.bwh_hive.doctype.hive_update_reaction.hive_update_reaction import HiveUpdateReaction

		content: DF.TextEditor
		posted_by: DF.Link
		project: DF.Link
		reactions: DF.Table[HiveUpdateReaction]
	# end: auto-generated types

	@frappe.whitelist()
	def toggle_reaction(self: HiveProjectUpdate, emoji: str) -> list:
		"""Add or remove the current user's reaction with the given emoji."""
		user = frappe.session.user
		existing = None
		for r in self.reactions:
			if r.user == user and r.emoji == emoji:
				existing = r
				break

		if existing:
			self.remove(existing)
		else:
			self.append("reactions", {"user": user, "emoji": emoji})

		self.save()
		return self.reactions
