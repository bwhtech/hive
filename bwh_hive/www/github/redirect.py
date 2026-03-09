import frappe
import requests


def get_context(context):
	if not frappe.db.get_single_value("Hive Settings", "github_app_id"):
		code = frappe.form_dict.code
		try:
			headers = {"Accept": "application/vnd.github.v3+json"}
			response = frappe._dict(
				requests.post(
					f"https://api.github.com/app-manifests/{code}/conversions",
					headers=headers,
				).json()
			)

			settings = frappe.get_doc("Hive Settings", "Hive Settings")
			settings.github_app_id = response.id
			settings.github_app_client_id = response.client_id
			settings.github_app_client_secret = response.client_secret
			settings.github_app_public_link = response.html_url
			settings.save()
			frappe.db.commit()
		except Exception:
			frappe.log_error("GitHub App Creation Error")

	frappe.flags.redirect_location = frappe.utils.get_url("/hive")
	raise frappe.Redirect
