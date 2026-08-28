import json
from base64 import b64decode

import frappe
import requests
from frappe.utils import now_datetime


def get_context(context):
	code = frappe.form_dict.get("code")
	state = frappe.form_dict.get("state")

	if not code or not state:
		frappe.flags.redirect_location = "/hive"
		raise frappe.Redirect

	# Validate state
	try:
		state_data = json.loads(b64decode(state).decode())
	except Exception:
		frappe.throw("Invalid state parameter.")

	if state_data.get("user") != frappe.session.user:
		frappe.throw("State mismatch. Please try connecting again.")

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

	# Store on Hive Settings (site-level)
	settings.db_set("github_access_token", access_token)
	settings.db_set("github_username", github_username)
	settings.db_set("github_authorized_at", now_datetime())
	frappe.db.commit()

	frappe.flags.redirect_location = "/hive"
	raise frappe.Redirect
