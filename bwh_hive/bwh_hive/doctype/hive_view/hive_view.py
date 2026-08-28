# Copyright (c) 2026, BWH and contributors
# For license information, please see license.txt

import re

import frappe
from frappe import _
from frappe.model.document import Document

AVATAR_DATA_URI = re.compile(r"^data:image/svg\+xml[;,]", re.IGNORECASE)


class HiveView(Document):
	def validate(self):
		self._validate_avatar()

	def _validate_avatar(self):
		"""Keep `avatar` to the one shape the frontend will render.

		The same guard `Hive Project` applies, for the same reason: a view is
		writable by any team member, an SVG can carry script, and the client
		only ever puts the value in an `<img src>` and only after checking the
		prefix. Repeating the check here means a value that could never be
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
