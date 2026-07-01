# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Email channel — a real subclass, disabled by default (07-notifications.md step 5).

`render`/`send` are real (reuse `frappe.sendmail`) so the abstraction is exercised, but
`is_enabled()` hard-returns False until a later phase turns email on. This keeps the
fan-out honest without doubling alerts.
"""

import frappe

from bwh_hive.bwh_hive.notifications.base import NotificationChannel
from bwh_hive.bwh_hive.notifications.events import NotificationEvent, render_plain_template


class EmailChannel(NotificationChannel):
	name = "email"

	def is_enabled(self) -> bool:
		# Disabled in v2. Telegram is the only sending channel.
		return False

	def render(self, event: NotificationEvent) -> dict:
		return {
			"subject": f"[Hive Agent] {event.task}: {event.task_title}",
			"message": render_plain_template(event).replace("\n", "<br>"),
		}

	def send(self, event: NotificationEvent) -> None:
		recipients = self.settings.get("agent_notify_email") or frappe.session.user
		payload = self.render(event)
		frappe.sendmail(
			recipients=recipients,
			subject=payload["subject"],
			message=payload["message"],
		)
