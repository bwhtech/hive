import frappe
import requests


def _back_to_settings(result: str):
	"""Land on the GitHub settings panel, not the app's home page.

	Creating the app takes the browser to github.com and back through a fresh
	page load, so the settings dialog the user started in is gone. The query
	string is what reopens it and tells the panel what to say.
	"""
	frappe.flags.redirect_location = frappe.utils.get_url(f"/hive?settings=github&github={result}")
	raise frappe.Redirect


def get_context(context):
	if frappe.db.get_single_value("Hive Settings", "github_app_id"):
		# Already converted — a refresh of this page, or a second visit.
		_back_to_settings("connected")

	code = frappe.form_dict.get("code")
	if not code:
		_back_to_settings("error")

	# The redirect has to happen outside the try: frappe.Redirect is an
	# exception, and `except Exception` would swallow it.
	created = False
	try:
		response = frappe._dict(
			requests.post(
				f"https://api.github.com/app-manifests/{code}/conversions",
				headers={"Accept": "application/vnd.github.v3+json"},
				timeout=30,
			).json()
		)
		if not response.get("id"):
			raise ValueError(f"GitHub did not return an app: {response.get('message')}")

		settings = frappe.get_doc("Hive Settings", "Hive Settings")
		settings.github_app_id = response.id
		settings.github_app_client_id = response.client_id
		settings.github_app_client_secret = response.client_secret
		settings.github_app_public_link = response.html_url
		settings.github_app_private_key = response.pem
		settings.save()
		frappe.db.commit()
		created = True
	except Exception:
		frappe.log_error("GitHub App Creation Error")

	_back_to_settings("connected" if created else "error")
