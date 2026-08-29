# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import re

import frappe
from frappe import _
from frappe.model.document import Document

AVATAR_DATA_URI = re.compile(r"^data:image/svg\+xml[;,]", re.IGNORECASE)


class HiveProject(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		avatar: DF.LongText | None
		avatar_options: DF.SmallText | None
		avatar_seed: DF.Data | None
		avatar_style: DF.Data | None
		client: DF.Link | None
		color: DF.Literal["", "gray", "blue", "green", "amber", "red", "violet"]
		description: DF.TextEditor | None
		github_repo: DF.Data | None
		icon: DF.Data | None
		is_archived: DF.Check
		is_private: DF.Check
		project_type: DF.Link | None
		slug: DF.Data | None
		status: DF.Literal["Open", "Completed", "On Hold"]
		sync_github_issues: DF.Check
		title: DF.Data
	# end: auto-generated types

	def validate(self):
		self._validate_avatar()

	def before_save(self):
		if not self.slug or self.has_value_changed("title"):
			self.slug = self._generate_unique_slug()

	def _validate_avatar(self):
		"""Keep `avatar` to the one shape the frontend will render.

		The field is writable by any team member and an SVG can carry script, so
		the client only ever puts it in an `<img src>` and only after checking
		the prefix. Repeating the check here means a value that could never be
		drawn also never reaches the row — a REST client cannot park markup in
		the field for some future reader to trust.
		"""
		if not self.avatar:
			return

		self.avatar = self.avatar.strip()
		if not AVATAR_DATA_URI.match(self.avatar):
			frappe.throw(
				_("Avatar must be an SVG data URI (data:image/svg+xml,…)"),
				title=_("Invalid Avatar"),
			)

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
