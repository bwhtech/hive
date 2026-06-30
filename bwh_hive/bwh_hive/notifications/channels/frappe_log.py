# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Frappe Notification Log channel — a real subclass, disabled by default.

Reuses `enqueue_create_notification` (the same path @mention alerts use) so a reviewer's
desk bell can later light up on agent events. `is_enabled()` hard-returns False in v2.
See 07-notifications.md step 5.
"""

import frappe
from frappe.desk.doctype.notification_log.notification_log import enqueue_create_notification

from bwh_hive.bwh_hive.notifications.base import NotificationChannel
from bwh_hive.bwh_hive.notifications.events import NotificationEvent, render_plain_template


class FrappeLogChannel(NotificationChannel):
	name = "frappe_log"

	def is_enabled(self) -> bool:
		# Disabled in v2. Telegram is the only sending channel.
		return False

	def render(self, event: NotificationEvent) -> dict:
		return {
			"subject": render_plain_template(event).split("\n", 1)[0],
			"type": "Alert",
			"document_type": "Hive Task",
			"document_name": event.task,
		}

	def send(self, event: NotificationEvent) -> None:
		notification = self.render(event)
		# Route to the task assignee(s); falls back to the session user if none resolve.
		recipients = [frappe.session.user]
		enqueue_create_notification(recipients, notification)
