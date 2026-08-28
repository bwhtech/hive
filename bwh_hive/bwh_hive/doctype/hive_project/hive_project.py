# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import re

import frappe
from frappe.model.document import Document


class HiveProject(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		client: DF.Link | None
		description: DF.TextEditor | None
		github_repo: DF.Data | None
		is_archived: DF.Check
		is_private: DF.Check
		project_type: DF.Link | None
		slug: DF.Data | None
		status: DF.Literal["Open", "Completed", "On Hold"]
		title: DF.Data
	# end: auto-generated types

	def before_save(self):
		if not self.slug or self.has_value_changed("title"):
			self.slug = self._generate_unique_slug()

	def _generate_unique_slug(self) -> str:
		base = slugify(self.title)
		slug = base
		counter = 1
		while frappe.db.exists("Hive Project", {"slug": slug, "name": ("!=", self.name)}):
			slug = f"{base}-{counter}"
			counter += 1
		return slug


def slugify(text: str) -> str:
	"""Convert text to a URL-friendly slug."""
	text = text.lower().strip()
	text = re.sub(r"[^\w\s-]", "", text)
	text = re.sub(r"[\s_-]+", "-", text)
	text = text.strip("-")
	return text or "project"
