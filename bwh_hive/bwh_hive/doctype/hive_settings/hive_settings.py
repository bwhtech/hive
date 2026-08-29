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
			# A private app can only ever be installed on the single account that
			# owns it, which caps Hive at one organisation. Public makes GitHub's
			# install page offer an account picker, so one app can serve every org
			# the user belongs to. Public is not listed anywhere: publishing to
			# Marketplace is a separate opt-in.
			"public": True,
			"default_permissions": {"issues": "write", "metadata": "read"},
			"request_oauth_on_install": True,
		}
