# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Thin BenchSpace REST client (specs/v2 §5.2).

Reads creds from Hive Settings and wraps the `benchspace.api.agent_box` methods with
token auth (§2.1), a short timeout, and a typed `BenchSpaceError` on any non-2xx so the
orchestrator can surface failures as `agent_last_error`.
"""

import frappe
import requests

TIMEOUT = 30


class BenchSpaceError(frappe.ValidationError):
	pass


class BenchSpaceClient:
	def __init__(self):
		settings = frappe.get_cached_doc("Hive Settings")
		self.base_url = (settings.benchspace_api_url or "").rstrip("/")
		self.api_key = settings.benchspace_api_key
		self.api_secret = settings.get_password("benchspace_api_secret", raise_exception=False)
		if not (self.base_url and self.api_key and self.api_secret):
			raise BenchSpaceError("BenchSpace API credentials are not configured in Hive Settings")

	def _headers(self) -> dict:
		return {
			"Authorization": f"token {self.api_key}:{self.api_secret}",
			"Content-Type": "application/json",
		}

	def _call(self, method: str, *, http: str, payload: dict) -> dict:
		url = f"{self.base_url}/api/method/{method}"
		try:
			if http == "GET":
				resp = requests.get(url, params=payload, headers=self._headers(), timeout=TIMEOUT)
			else:
				resp = requests.post(url, json=payload, headers=self._headers(), timeout=TIMEOUT)
		except requests.RequestException as e:
			raise BenchSpaceError(f"BenchSpace unreachable calling {method}: {e}") from e

		if resp.status_code >= 400:
			raise BenchSpaceError(f"{method} failed ({resp.status_code}): {resp.text[:500]}")

		try:
			data = resp.json()
		except ValueError as e:
			raise BenchSpaceError(f"{method} returned non-JSON: {resp.text[:200]}") from e
		# Frappe wraps whitelisted return values under "message".
		return data.get("message", data)

	def provision(self, template: str, boot_env: dict, owner_user: str | None = None) -> dict:
		return self._call(
			"benchspace.api.agent_box.provision",
			http="POST",
			payload={"template": template, "boot_env": boot_env, "owner_user": owner_user},
		)

	def get_box(self, name: str) -> dict:
		return self._call("benchspace.api.agent_box.get_box", http="GET", payload={"name": name})

	def list_agent_boxes(self) -> list[dict]:
		result = self._call("benchspace.api.agent_box.list_agent_boxes", http="GET", payload={})
		return result if isinstance(result, list) else []

	def deprovision(self, name: str) -> dict:
		return self._call("benchspace.api.agent_box.deprovision", http="POST", payload={"name": name})
