import time

import frappe
import jwt
import requests
from frappe import _


def _get_app_jwt(settings) -> str:
	"""Generate a short-lived JWT signed with the GitHub App's private key."""
	private_key = settings.get_password("github_app_private_key", raise_exception=False)
	if not private_key:
		frappe.throw("GitHub App private key not found. Please re-create the GitHub App.")

	now = int(time.time())
	payload = {
		"iat": now - 60,
		"exp": now + (10 * 60),
		"iss": settings.github_app_id,
	}
	return jwt.encode(payload, private_key, algorithm="RS256")


def _get_installation_token(settings) -> str:
	"""Get an installation access token for the GitHub App."""
	app_jwt = _get_app_jwt(settings)

	# Get the first installation (the org/account where the app is installed)
	resp = requests.get(
		"https://api.github.com/app/installations",
		headers={
			"Authorization": f"Bearer {app_jwt}",
			"Accept": "application/vnd.github.v3+json",
		},
		timeout=15,
	)
	if resp.status_code != 200:
		frappe.throw(f"GitHub API error ({resp.status_code}): {resp.json().get('message', 'Unknown error')}")

	installations = resp.json()
	if not installations:
		frappe.throw(
			_("GitHub App is not installed on any account. Install it from the GitHub App settings page.")
		)

	installation_id = installations[0]["id"]

	# Generate an installation access token
	resp = requests.post(
		f"https://api.github.com/app/installations/{installation_id}/access_tokens",
		headers={
			"Authorization": f"Bearer {app_jwt}",
			"Accept": "application/vnd.github.v3+json",
		},
		timeout=15,
	)
	if resp.status_code != 201:
		frappe.throw(f"GitHub API error ({resp.status_code}): {resp.json().get('message', 'Unknown error')}")

	return resp.json()["token"]


@frappe.whitelist()
def status() -> dict:
	settings = frappe.get_single("Hive Settings")
	app_configured = bool(settings.github_app_id)

	connected = False
	installed_account = None

	if app_configured:
		private_key = settings.get_password("github_app_private_key", raise_exception=False)
		if private_key:
			try:
				app_jwt = _get_app_jwt(settings)
				resp = requests.get(
					"https://api.github.com/app/installations",
					headers={
						"Authorization": f"Bearer {app_jwt}",
						"Accept": "application/vnd.github.v3+json",
					},
					timeout=10,
				)
				if resp.status_code == 200 and resp.json():
					connected = True
					installed_account = resp.json()[0]["account"]["login"]
			except Exception:
				pass

	return {
		"app_configured": app_configured,
		"connected": connected,
		"installed_account": installed_account,
	}


@frappe.whitelist()
def get_repos() -> list[dict]:
	"""Fetch repositories where the GitHub App is installed."""
	settings = frappe.get_single("Hive Settings")
	if not settings.github_app_id:
		frappe.throw("GitHub App not configured.")

	token = _get_installation_token(settings)

	repos = []
	page = 1
	while True:
		resp = requests.get(
			"https://api.github.com/installation/repositories",
			headers={
				"Authorization": f"Bearer {token}",
				"Accept": "application/vnd.github.v3+json",
			},
			params={"per_page": 100, "page": page},
			timeout=15,
		)
		if resp.status_code != 200:
			frappe.throw(
				f"GitHub API error ({resp.status_code}): {resp.json().get('message', 'Unknown error')}"
			)

		data = resp.json()
		for repo in data.get("repositories", []):
			repos.append(
				{
					"full_name": repo["full_name"],
					"private": repo["private"],
				}
			)

		if len(repos) >= data.get("total_count", 0):
			break
		page += 1

	return repos


@frappe.whitelist()
def create_issue(task_name: str) -> dict:
	"""Convert a Hive Task into a GitHub issue using an installation token."""
	task = frappe.get_doc("Hive Task", task_name)

	if task.github_issue_url:
		frappe.throw("This task has already been converted to a GitHub issue.")

	project = frappe.get_doc("Hive Project", task.project)
	if not project.github_repo:
		frappe.throw("No GitHub repository linked to this project. Set it in the project settings.")

	settings = frappe.get_single("Hive Settings")
	token = _get_installation_token(settings)

	# Build issue body
	body = ""
	if task.description:
		from frappe.utils import strip_html_tags

		body = strip_html_tags(task.description)

	task_url = f"{frappe.utils.get_url()}/hive/projects/{task.project}?task={task.name}"
	body += f"\n\n---\n*Created from Hive task [{task.name}]({task_url})*"

	resp = requests.post(
		f"https://api.github.com/repos/{project.github_repo}/issues",
		headers={
			"Authorization": f"Bearer {token}",
			"Accept": "application/vnd.github.v3+json",
		},
		json={
			"title": task.title,
			"body": body,
		},
		timeout=15,
	)

	if resp.status_code != 201:
		frappe.throw(f"GitHub API error ({resp.status_code}): {resp.json().get('message', 'Unknown error')}")

	issue_data = resp.json()
	issue_url = issue_data["html_url"]

	task.db_set("github_issue_url", issue_url)

	return {
		"issue_url": issue_url,
		"issue_number": issue_data["number"],
	}
