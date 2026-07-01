# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Telegram channel — the only channel that sends in v2 (07-notifications.md)."""

import requests

from bwh_hive.bwh_hive.notifications.base import NotificationChannel
from bwh_hive.bwh_hive.notifications.events import NotificationEvent, render_markdown_template

API_BASE = "https://api.telegram.org"


class TelegramChannel(NotificationChannel):
	name = "telegram"

	def is_enabled(self) -> bool:
		"""On only when notifications are enabled AND both token + chat id are present.

		A missing token/chat id is the graceful-off path — a silent no-op, not an error.
		"""
		return bool(
			self.settings.notifications_enabled
			and self.settings.get_password("telegram_bot_token", raise_exception=False)
			and self.settings.telegram_default_chat_id
		)

	def render(self, event: NotificationEvent) -> dict:
		return {
			"chat_id": self.settings.telegram_default_chat_id,
			"text": render_markdown_template(event),
			"parse_mode": "MarkdownV2",
			"disable_web_page_preview": True,
		}

	def send(self, event: NotificationEvent) -> None:
		token = self.settings.get_password("telegram_bot_token")
		resp = requests.post(f"{API_BASE}/bot{token}/sendMessage", json=self.render(event), timeout=10)
		if not resp.ok:
			# Surface Telegram's 4xx body (e.g. "chat not found", "can't parse entities")
			# so a bad chat id or an escaping bug is diagnosable in the Error Log.
			raise requests.HTTPError(f"Telegram sendMessage {resp.status_code}: {resp.text}", response=resp)
