# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""The `NotificationEvent` value object + event catalogue + template renderer.

A `NotificationEvent` is an immutable description of *what happened*, independent of *how*
it is delivered. Channels render it; they never query Hive themselves (`from_task` reads
the task once, here). Telegram renders MarkdownV2; the plain-text fallback strips it.

See specs/v2/07-notifications.md "Event catalogue" + "Message templates".
"""

import dataclasses
from enum import Enum

import frappe
from frappe.utils import get_url


class EventType(str, Enum):
	PROVISIONING = "provisioning"  # optional (chatty)
	SPEC_CREATED = "spec_created"  # required
	CHANGES_REQ = "changes_requested"  # optional (chatty)
	PR_READY = "pr_ready"  # required
	FAILED = "failed"  # required


@dataclasses.dataclass(frozen=True)
class NotificationEvent:
	"""Immutable, picklable (it is passed across `frappe.enqueue`)."""

	type: EventType
	task: str  # Hive Task name, e.g. "TASK-0007"
	task_title: str
	project: str | None = None
	actor: str | None = None  # "agent" or a User; for the footer line
	message: str | None = None  # free-text detail (e.g. error summary)
	# deep links — populated from the task's agent_* fields where present
	task_url: str | None = None  # {site}/hive/tasks/{task}
	code_url: str | None = None  # box code-server (review spec)
	site_url: str | None = None  # box Frappe site (review changes)
	pr_url: str | None = None  # GitHub PR
	payload: dict | None = None  # channel-specific extras (e.g. {"phase": ...})

	@classmethod
	def from_task(cls, type: EventType, task_name: str, **overrides) -> "NotificationEvent":
		"""Build an event by reading the agent_* fields off a Hive Task once.

		`overrides` win over the task-derived values (e.g. `message=error`,
		`payload={"phase": phase}` from `report_agent_error`).
		"""
		doc = frappe.get_doc("Hive Task", task_name)
		base = dict(
			type=type,
			task=doc.name,
			task_title=doc.title or doc.name,
			project=doc.project,
			task_url=f"{get_url()}/hive/tasks/{doc.name}",
			code_url=doc.agent_code_url or None,
			site_url=doc.agent_site_url or None,
			pr_url=doc.pr_link or None,
		)
		base.update(overrides)
		return cls(**base)


# --------------------------------------------------------------------------- #
# MarkdownV2 rendering (Telegram)
# --------------------------------------------------------------------------- #
# Telegram MarkdownV2 reserves these; every dynamic substring must escape them.
# https://core.telegram.org/bots/api#markdownv2-style
_MD2_RESERVED = r"_*[]()~`>#+-=|{}.!"
_MD2_TABLE = {ord(c): "\\" + c for c in _MD2_RESERVED}


def escape_md2(text) -> str:
	"""Escape a string for Telegram MarkdownV2. None → empty string."""
	return str(text or "").translate(_MD2_TABLE)


def _link(label: str, url: str | None) -> str | None:
	"""A MarkdownV2 inline link, or None when the URL is absent (graceful degrade)."""
	if not url:
		return None
	# The link *text* is still MarkdownV2 — reserved chars in the label (e.g. the parens
	# in "Review spec (code)") must be escaped or Telegram rejects with 400 "can't parse
	# entities". Inside the URL part only `)` and `\` need escaping.
	safe_url = url.replace("\\", "\\\\").replace(")", "\\)")
	return f"[{escape_md2(label)}]({safe_url})"


def _links_line(*links: str | None) -> str:
	rendered = [link for link in links if link]
	return " · ".join(rendered)


def render_markdown_template(event: NotificationEvent) -> str:
	"""Render a NotificationEvent to a Telegram MarkdownV2 message body.

	Each template leads with an emoji + headline, names the task, and ends with the
	available deep links. A link is omitted when its URL field is empty, so an
	early-lifecycle event degrades to just `[Open task]`.
	"""
	task = escape_md2(event.task)
	title = escape_md2(event.task_title)
	open_task = _link("Open task", event.task_url)

	if event.type is EventType.SPEC_CREATED:
		links = _links_line(_link("Review spec (code)", event.code_url), open_task)
		return (
			f"📝 *Spec ready* — `{task}`\n"
			f"*{title}*\n"
			f"The agent finished writing the spec\\. Review it before approving\\.\n\n"
			f"{links}"
		)

	if event.type is EventType.PR_READY:
		links = _links_line(_link("View PR", event.pr_url), _link("Review site", event.site_url), open_task)
		return (
			f"✅ *PR ready* — `{task}`\n"
			f"*{title}*\n"
			f"The agent opened a pull request\\. Review and merge or request changes\\.\n\n"
			f"{links}"
		)

	if event.type is EventType.FAILED:
		phase = escape_md2((event.payload or {}).get("phase"))
		error = escape_md2(event.message)
		detail = f"Phase: {phase}\n" if phase else ""
		if error:
			detail += f"{error}\n"
		return f"🔴 *Agent failed* — `{task}`\n*{title}*\n{detail}\n{_links_line(open_task)}"

	if event.type is EventType.PROVISIONING:
		return (
			f"🚀 *Box provisioning* — `{task}`\n"
			f"*{title}*\n"
			f"A dev box is spinning up for this task\\.\n\n"
			f"{_links_line(open_task)}"
		)

	if event.type is EventType.CHANGES_REQ:
		links = _links_line(_link("View PR", event.pr_url), open_task)
		return (
			f"🔁 *Changes requested* — `{task}`\n"
			f"*{title}*\n"
			f"Review comments are being applied; a new push is on the way\\.\n\n"
			f"{links}"
		)

	# Unknown type — degrade to a minimal, escaped notice rather than raise.
	return f"*{escape_md2(event.type)}* — `{task}`\n*{title}*"


def render_plain_template(event: NotificationEvent) -> str:
	"""A plain-text rendering (Email / Notification Log fallback). No MarkdownV2 escaping."""
	lines = {
		EventType.SPEC_CREATED: "Spec ready for review",
		EventType.PR_READY: "PR ready for review",
		EventType.FAILED: "Agent failed",
		EventType.PROVISIONING: "Box provisioning",
		EventType.CHANGES_REQ: "Changes requested",
	}
	headline = lines.get(event.type, str(event.type))
	body = f"{headline} — {event.task}: {event.task_title}"
	if event.type is EventType.FAILED:
		phase = (event.payload or {}).get("phase")
		if phase:
			body += f"\nPhase: {phase}"
		if event.message:
			body += f"\n{event.message}"
	if event.task_url:
		body += f"\n{event.task_url}"
	return body
