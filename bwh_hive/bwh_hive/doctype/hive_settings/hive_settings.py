# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import get_url


class HiveSettings(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		app_name: DF.Data | None
		github_app_client_id: DF.Data | None
		github_app_client_secret: DF.Password | None
		github_app_id: DF.Data | None
		github_app_public_link: DF.Data | None
		lock_due_date_on_or_after: DF.Check
		onboarding_completed: DF.Check
	# end: auto-generated types

	@frappe.whitelist()
	def get_github_app_manifest(self):
		app_name = f"Hive {frappe.generate_hash(length=6).upper()}"
		return {
			"name": app_name,
			"url": get_url(),
			"redirect_url": get_url("/github/redirect"),
			"callback_url": get_url("/github/authorize"),
			"public": False,
			"default_permissions": {"issues": "write", "metadata": "read"},
			"request_oauth_on_install": True,
		}
