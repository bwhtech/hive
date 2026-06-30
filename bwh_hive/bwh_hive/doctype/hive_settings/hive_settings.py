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

		agent_callback_api_key: DF.Data | None
		agent_callback_api_secret: DF.Password | None
		agent_orchestration_enabled: DF.Check
		anthropic_api_key: DF.Password | None
		app_name: DF.Data | None
		benchspace_api_key: DF.Data | None
		benchspace_api_secret: DF.Password | None
		benchspace_api_url: DF.Data | None
		default_agent_template_slug: DF.Data | None
		failed_teardown_grace_hours: DF.Int
		github_app_client_id: DF.Data | None
		github_app_client_secret: DF.Password | None
		github_app_id: DF.Data | None
		github_app_public_link: DF.Data | None
		idle_teardown_hours: DF.Int
		implement_timeout_minutes: DF.Int
		lock_due_date_on_or_after: DF.Check
		max_concurrent_agent_boxes: DF.Int
		notifications_enabled: DF.Check
		onboarding_completed: DF.Check
		provisioning_timeout_minutes: DF.Int
		skills_repo: DF.Data | None
		spec_timeout_minutes: DF.Int
		telegram_bot_token: DF.Password | None
		telegram_default_chat_id: DF.Data | None
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
