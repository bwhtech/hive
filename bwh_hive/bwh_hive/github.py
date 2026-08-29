import time

import frappe
import jwt
import requests
from frappe import _

GITHUB_API = "https://api.github.com"
ACCEPT_HEADER = "application/vnd.github.v3+json"
# Installation tokens live for an hour; expire ours a little early so a cached
# token is never handed out moments before GitHub rejects it.
TOKEN_CACHE_TTL = 50 * 60


def _get_app_jwt(settings) -> str:
	"""Generate a short-lived JWT signed with the GitHub App's private key."""
	private_key = settings.get_password("github_app_private_key", raise_exception=False)
	if not private_key:
		frappe.throw(_("GitHub App private key not found. Please re-create the GitHub App."))

	now = int(time.time())
	payload = {
		"iat": now - 60,
		"exp": now + (10 * 60),
		"iss": settings.github_app_id,
	}
	return jwt.encode(payload, private_key, algorithm="RS256")


def _request(method: str, path: str, token: str, **kwargs) -> requests.Response:
	"""Call the GitHub API and turn any error response into a Frappe error."""
	resp = requests.request(
		method,
		f"{GITHUB_API}{path}",
		headers={"Authorization": f"Bearer {token}", "Accept": ACCEPT_HEADER},
		timeout=15,
		**kwargs,
	)
	if resp.status_code >= 400:
		message = "Unknown error"
		try:
			message = resp.json().get("message", message)
		except ValueError:
			pass
		frappe.throw(_("GitHub API error ({0}): {1}").format(resp.status_code, message))
	return resp


def _get_settings():
	settings = frappe.get_single("Hive Settings")
	if not settings.github_app_id:
		frappe.throw(_("GitHub App not configured."))
	return settings


def _list_installations(settings) -> list[dict]:
	"""Every account (user or org) the GitHub App is installed on."""
	app_jwt = _get_app_jwt(settings)
	installations = []
	page = 1
	while True:
		batch = _request("GET", "/app/installations", app_jwt, params={"per_page": 100, "page": page}).json()
		installations.extend(batch)
		if len(batch) < 100:
			return installations
		page += 1


def _summarise_installation(installation: dict) -> dict:
	account = installation.get("account") or {}
	return {
		"id": installation["id"],
		"account": account.get("login"),
		"account_type": account.get("type"),
		"avatar_url": account.get("avatar_url"),
		# "all" or "selected" — whether the user limited the app to some repos.
		"repository_selection": installation.get("repository_selection"),
		# GitHub's own settings page for this installation: where repo access is
		# changed and the app can be uninstalled.
		"html_url": installation.get("html_url"),
	}


def _token_cache_key(installation_id) -> str:
	return f"github_installation_token::{installation_id}"


def _get_installation_token(settings, installation_id) -> str:
	"""Get (and briefly cache) an access token for one installation."""
	cached = frappe.cache.get_value(_token_cache_key(installation_id))
	if cached:
		return cached

	token = _request(
		"POST", f"/app/installations/{installation_id}/access_tokens", _get_app_jwt(settings)
	).json()["token"]
	frappe.cache.set_value(_token_cache_key(installation_id), token, expires_in_sec=TOKEN_CACHE_TTL)
	return token


def _installation_for_repo(settings, repo: str) -> dict:
	"""Find the installation that owns `owner/name`."""
	owner = repo.split("/")[0].lower()
	for installation in _list_installations(settings):
		if ((installation.get("account") or {}).get("login") or "").lower() == owner:
			return installation

	frappe.throw(_("The GitHub App is not installed on {0}. Install it on that account first.").format(owner))


@frappe.whitelist()
def status() -> dict:
	settings = frappe.get_single("Hive Settings")
	app_configured = bool(settings.github_app_id)

	installations = []
	if app_configured and settings.get_password("github_app_private_key", raise_exception=False):
		try:
			installations = [_summarise_installation(i) for i in _list_installations(settings)]
		except Exception:
			# A broken key or an app deleted on GitHub should still render the
			# panel, so the user can disconnect and start over.
			pass

	return {
		"app_configured": app_configured,
		"app_public_link": settings.github_app_public_link,
		"connected": bool(installations),
		# Kept for callers that only need to know "is there somewhere to read
		# repositories from".
		"installed_account": installations[0]["account"] if installations else None,
		"installations": installations,
	}


@frappe.whitelist()
def get_repos() -> list[dict]:
	"""Fetch repositories from every account the GitHub App is installed on."""
	settings = _get_settings()

	repos = []
	for installation in _list_installations(settings):
		token = _get_installation_token(settings, installation["id"])
		page = 1
		while True:
			data = _request(
				"GET",
				"/installation/repositories",
				token,
				params={"per_page": 100, "page": page},
			).json()
			batch = data.get("repositories", [])
			for repo in batch:
				repos.append(
					{
						"full_name": repo["full_name"],
						"private": repo["private"],
						"owner": repo["owner"]["login"],
						"installation_id": installation["id"],
					}
				)
			if len(batch) < 100:
				break
			page += 1

	repos.sort(key=lambda repo: repo["full_name"].lower())
	return repos


@frappe.whitelist()
def disconnect_app() -> dict:
	"""Forget the GitHub App so a new one can be created.

	Project repo links are left alone: re-connecting an app to the same
	organisations makes them valid again, and clearing them would be silent
	data loss.
	"""
	frappe.has_permission("Hive Settings", "write", throw=True)

	settings = frappe.get_single("Hive Settings")

	# Best effort: a half-broken app (revoked key, deleted on GitHub) is exactly
	# the state you disconnect from, so a failed lookup must not block it. The
	# tokens left behind expire within the hour.
	try:
		for installation in _list_installations(settings):
			frappe.cache.delete_value(_token_cache_key(installation["id"]))
	except Exception:
		pass

	for field in (
		"github_app_id",
		"github_app_client_id",
		"github_app_client_secret",
		"github_app_public_link",
		"github_app_private_key",
		"github_access_token",
		"github_username",
		"github_authorized_at",
	):
		settings.set(field, None)
	settings.save(ignore_permissions=True)

	return {"disconnected": True}


@frappe.whitelist()
def uninstall(installation_id: str) -> dict:
	"""Remove the GitHub App from one account, leaving other accounts alone."""
	frappe.has_permission("Hive Settings", "write", throw=True)

	settings = _get_settings()
	_request("DELETE", f"/app/installations/{installation_id}", _get_app_jwt(settings))
	frappe.cache.delete_value(_token_cache_key(installation_id))

	return {"uninstalled": True}


@frappe.whitelist()
def create_issue(task_name: str) -> dict:
	"""Convert a Hive Task into a GitHub issue using an installation token."""
	task = frappe.get_doc("Hive Task", task_name)

	if task.github_issue_url:
		frappe.throw(_("This task has already been converted to a GitHub issue."))

	project = frappe.get_doc("Hive Project", task.project)
	if not project.github_repo:
		frappe.throw(_("No GitHub repository linked to this project. Set it in the project settings."))

	settings = _get_settings()
	installation = _installation_for_repo(settings, project.github_repo)
	token = _get_installation_token(settings, installation["id"])

	# Build issue body
	body = ""
	if task.description:
		from frappe.utils import strip_html_tags

		body = strip_html_tags(task.description)

	task_url = f"{frappe.utils.get_url()}/hive/projects/{task.project}?task={task.name}"
	body += f"\n\n---\n*Created from Hive task [{task.name}]({task_url})*"

	issue_data = _request(
		"POST",
		f"/repos/{project.github_repo}/issues",
		token,
		json={"title": task.title, "body": body},
	).json()

	issue_url = issue_data["html_url"]
	task.db_set("github_issue_url", issue_url)

	return {
		"issue_url": issue_url,
		"issue_number": issue_data["number"],
	}
