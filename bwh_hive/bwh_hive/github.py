import json
from base64 import b64encode

import requests

import frappe


@frappe.whitelist()
def status() -> dict:
	settings = frappe.get_single("Hive Settings")
	app_configured = bool(settings.github_app_id)

	connected = False
	github_username = None
	authorized_at = None

	if app_configured and frappe.db.exists("GitHub Token", frappe.session.user):
		token_doc = frappe.get_doc("GitHub Token", frappe.session.user)
		connected = bool(token_doc.get_password("access_token", raise_exception=False))
		github_username = token_doc.github_username
		authorized_at = str(token_doc.authorized_at) if token_doc.authorized_at else None

	return {
		"app_configured": app_configured,
		"connected": connected,
		"github_username": github_username,
		"authorized_at": authorized_at,
	}


@frappe.whitelist()
def get_connect_url() -> str:
	settings = frappe.get_single("Hive Settings")
	if not settings.github_app_client_id:
		frappe.throw("GitHub App not configured. Ask your administrator to set it up.")

	state = b64encode(json.dumps({"user": frappe.session.user}).encode()).decode()

	return (
		f"https://github.com/login/oauth/authorize"
		f"?client_id={settings.github_app_client_id}"
		f"&state={state}"
	)


@frappe.whitelist()
def disconnect() -> dict:
	if not frappe.db.exists("GitHub Token", frappe.session.user):
		frappe.throw("No GitHub connection found.")

	token_doc = frappe.get_doc("GitHub Token", frappe.session.user)
	access_token = token_doc.get_password("access_token", raise_exception=False)

	# Revoke on GitHub
	if access_token:
		settings = frappe.get_single("Hive Settings")
		client_id = settings.github_app_client_id
		client_secret = settings.get_password("github_app_client_secret", raise_exception=False)
		if client_id and client_secret:
			try:
				requests.delete(
					f"https://api.github.com/applications/{client_id}/token",
					auth=(client_id, client_secret),
					json={"access_token": access_token},
					headers={"Accept": "application/vnd.github.v3+json"},
					timeout=10,
				)
			except requests.RequestException:
				frappe.log_error("GitHub Token Revocation Error")

	frappe.delete_doc("GitHub Token", frappe.session.user, ignore_permissions=True)
	frappe.db.commit()
	return {"success": True}
