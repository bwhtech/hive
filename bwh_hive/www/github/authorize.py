import requests

import frappe
from frappe.utils import now_datetime

from bwh_hive.bwh_hive.github import consume_oauth_state


def get_context(context):
	code = frappe.form_dict.get("code")
	state = frappe.form_dict.get("state")

	if not code:
		frappe.flags.redirect_location = "/hive"
		raise frappe.Redirect

	if not state or consume_oauth_state(state) != frappe.session.user:
		frappe.throw(
			frappe._("This GitHub authorization link is invalid or has expired. Try connecting again.")
		)

	# Exchange code for access token
	settings = frappe.get_single("Hive Settings")
	token_response = requests.post(
		"https://github.com/login/oauth/access_token",
		json={
			"client_id": settings.github_app_client_id,
			"client_secret": settings.get_password("github_app_client_secret"),
			"code": code,
		},
		headers={"Accept": "application/json"},
		timeout=15,
	)
	token_data = token_response.json()

	access_token = token_data.get("access_token")
	if not access_token:
		error = token_data.get("error_description", token_data.get("error", "Unknown error"))
		frappe.throw(f"GitHub OAuth failed: {error}")

	# Fetch GitHub username
	user_response = requests.get(
		"https://api.github.com/user",
		headers={
			"Authorization": f"Bearer {access_token}",
			"Accept": "application/vnd.github.v3+json",
		},
		timeout=10,
	)
	github_user = user_response.json()
	github_username = github_user.get("login", "")

	if frappe.db.exists("GitHub Token", frappe.session.user):
		token = frappe.get_doc("GitHub Token", frappe.session.user)
	else:
		token = frappe.new_doc("GitHub Token", user=frappe.session.user)

	token.access_token = access_token
	token.github_username = github_username
	token.authorized_at = now_datetime()
	token.save(ignore_permissions=True)
	frappe.db.commit()

	frappe.flags.redirect_location = "/hive"
	raise frappe.Redirect
