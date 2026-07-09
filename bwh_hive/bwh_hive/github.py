import time
from urllib.parse import urlencode

import jwt
import requests

import frappe

OAUTH_STATE_TTL_SECONDS = 10 * 60


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
		frappe.throw("GitHub App is not installed on any account. Install it from the GitHub App settings page.")

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


def _oauth_state_key(nonce: str) -> str:
	return f"github_oauth_state:{nonce}"


def _new_oauth_state() -> str:
	"""Mint a single-use nonce tied to the current user for the OAuth `state` parameter."""
	nonce = frappe.generate_hash(length=32)
	frappe.cache.set_value(
		_oauth_state_key(nonce), frappe.session.user, expires_in_sec=OAUTH_STATE_TTL_SECONDS
	)
	return nonce


def consume_oauth_state(nonce: str) -> str | None:
	"""Return the user who started this OAuth flow, invalidating the nonce."""
	key = _oauth_state_key(nonce)
	user = frappe.cache.get_value(key)
	frappe.cache.delete_value(key)
	return user


def _get_user_token() -> str:
	"""Get the current user's GitHub OAuth token."""
	token = None
	if frappe.db.exists("GitHub Token", frappe.session.user):
		token = frappe.get_doc("GitHub Token", frappe.session.user).get_password(
			"access_token", raise_exception=False
		)

	if not token:
		frappe.throw(frappe._("Connect your GitHub account from Settings first."))

	return token


@frappe.whitelist(methods=["POST"])
def connect_url() -> str:
	"""Build the GitHub OAuth URL that links the current user's GitHub account."""
	settings = frappe.get_single("Hive Settings")
	if not settings.github_app_client_id:
		frappe.throw(frappe._("GitHub App not configured."))

	params = urlencode(
		{
			"client_id": settings.github_app_client_id,
			"redirect_uri": frappe.utils.get_url("/github/authorize"),
			"state": _new_oauth_state(),
		}
	)
	return f"https://github.com/login/oauth/authorize?{params}"


@frappe.whitelist(methods=["POST"])
def install_url() -> str:
	"""Build the GitHub App installation URL.

	Carries an OAuth state so the post-install redirect also connects the user's account,
	since the App manifest sets `request_oauth_on_install`.
	"""
	settings = frappe.get_single("Hive Settings")
	if not settings.github_app_public_link:
		frappe.throw(frappe._("GitHub App not configured."))

	params = urlencode({"state": _new_oauth_state()})
	return f"{settings.github_app_public_link}/installations/new?{params}"


@frappe.whitelist(methods=["POST"])
def disconnect() -> None:
	"""Unlink the current user's GitHub account."""
	if frappe.db.exists("GitHub Token", frappe.session.user):
		frappe.delete_doc("GitHub Token", frappe.session.user, ignore_permissions=True)


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

	github_token = frappe.db.get_value(
		"GitHub Token", frappe.session.user, "github_username", as_dict=True
	)

	return {
		"app_configured": app_configured,
		"connected": connected,
		"installed_account": installed_account,
		"account_connected": bool(github_token),
		"github_username": github_token.github_username if github_token else None,
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
			frappe.throw(f"GitHub API error ({resp.status_code}): {resp.json().get('message', 'Unknown error')}")

		data = resp.json()
		for repo in data.get("repositories", []):
			repos.append({
				"full_name": repo["full_name"],
				"private": repo["private"],
			})

		if len(repos) >= data.get("total_count", 0):
			break
		page += 1

	return repos


@frappe.whitelist()
def create_issue(task_name: str) -> dict:
	"""Convert a Hive Task into a GitHub issue authored by the current user."""
	task = frappe.get_doc("Hive Task", task_name)

	if task.github_issue_url:
		frappe.throw("This task has already been converted to a GitHub issue.")

	project = frappe.get_doc("Hive Project", task.project)
	if not project.github_repo:
		frappe.throw("No GitHub repository linked to this project. Set it in the project settings.")

	token = _get_user_token()

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
