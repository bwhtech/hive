# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Box → Hive callback API (specs/v2 §5.1).

Endpoints the in-VM control plane calls to report agent lifecycle state back to a Hive
Task. Auth is the shared "Agent" bot service key (00-architecture.md §2.2): every method
asserts (a) the calling session is the Agent bot (by role), and (b) the target task is
currently assigned to that bot — so a leaked key cannot drive arbitrary tasks.

Status changes route through `orchestrator.service.set_agent_status` so transition
validation and side effects stay centralized.

All methods are type-annotated — Hive enforces require_type_annotated_api_methods.
"""

import json

import frappe

from bwh_hive.bwh_hive.orchestrator import service

AGENT_BOT_ROLE = "Agent Bot"


def _assert_agent_caller() -> None:
	"""Reject callers that are not the Agent bot user (identified by role)."""
	if AGENT_BOT_ROLE not in frappe.get_roles(frappe.session.user):
		frappe.throw("Only the Agent bot may call agent callbacks.", frappe.PermissionError)


def _assert_task_assigned(task: str) -> None:
	"""Reject writes to a task the calling Agent bot is not assigned to."""
	if not frappe.db.exists("Hive Task", task):
		frappe.throw(f"Hive Task {task} not found", frappe.DoesNotExistError)
	assignees = json.loads(frappe.db.get_value("Hive Task", task, "_assign") or "[]")
	if frappe.session.user not in assignees:
		frappe.throw("This task is not assigned to the Agent bot.", frappe.PermissionError)


def _guard(task: str) -> None:
	_assert_agent_caller()
	_assert_task_assigned(task)


@frappe.whitelist(methods=["POST"])
def report_agent_status(task: str, status: str, message: str | None = None) -> dict:
	"""Set a Hive Task's agent_status (box actor) and optionally append a comment."""
	_guard(task)
	service.set_agent_status(task, status, actor="box", message=message)
	return {"ok": True, "agent_status": status}


@frappe.whitelist(methods=["POST"])
def set_spec_ready(
	task: str,
	code_url: str | None = None,
	site_url: str | None = None,
	spec_path: str | None = None,
	branch: str | None = None,
) -> dict:
	"""Record spec coordinates and advance the task to Spec Created."""
	_guard(task)
	doc = frappe.get_doc("Hive Task", task)
	updates: dict = {}
	if code_url:
		updates["agent_code_url"] = code_url
	if site_url:
		updates["agent_site_url"] = site_url
	if spec_path:
		updates["agent_spec_path"] = spec_path
	if branch:
		updates["agent_branch"] = branch
	if updates:
		doc.db_set(updates)
	service.set_agent_status(doc, "Spec Created", actor="box", message="Spec ready for review.")
	return {"ok": True, "agent_status": "Spec Created"}


@frappe.whitelist(methods=["POST"])
def set_pr_ready(task: str, pr_url: str, branch: str | None = None) -> dict:
	"""Record the PR link and advance the task to PR Ready."""
	_guard(task)
	doc = frappe.get_doc("Hive Task", task)
	updates: dict = {"pr_link": pr_url}
	if branch:
		updates["agent_branch"] = branch
	doc.db_set(updates)
	service.set_agent_status(doc, "PR Ready", actor="box", message=f"PR ready: {pr_url}")
	return {"ok": True, "agent_status": "PR Ready"}


@frappe.whitelist(methods=["POST"])
def report_agent_error(task: str, error: str, phase: str | None = None) -> dict:
	"""Record a failure and move the task to Failed."""
	_guard(task)
	doc = frappe.get_doc("Hive Task", task)
	doc.db_set("agent_last_error", error)
	msg = f"Agent error ({phase}): {error}" if phase else f"Agent error: {error}"
	service.set_agent_status(doc, "Failed", actor="box", message=msg)
	return {"ok": True, "agent_status": "Failed"}


@frappe.whitelist(methods=["POST"])
def append_agent_log(task: str, log: str, stream: str = "stdout") -> dict:
	"""Append a cheap, frequent log line as a task comment."""
	_guard(task)
	frappe.get_doc(
		{
			"doctype": "Hive Task Comment",
			"task": task,
			"content": f"[{stream}] {log}",
			"posted_by": frappe.session.user,
		}
	).insert(ignore_permissions=True)
	return {"ok": True}


@frappe.whitelist(methods=["GET"])
def get_task(task: str) -> dict:
	"""Return task context so the box can compose spec/implement prompts (read-only)."""
	_guard(task)
	doc = frappe.get_doc("Hive Task", task)
	return {
		"name": doc.name,
		"title": doc.title,
		"description": doc.description,
		"project": doc.project,
		"agent_status": doc.agent_status,
		"agent_branch": doc.agent_branch,
		"agent_spec_path": doc.agent_spec_path,
		"github_issue_url": doc.github_issue_url,
		"pr_link": doc.pr_link,
	}
