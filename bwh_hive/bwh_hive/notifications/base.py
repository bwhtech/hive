# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""The channel contract (specs/v2 07-notifications.md "base.py")."""

from abc import ABC, abstractmethod

from bwh_hive.bwh_hive.notifications.events import NotificationEvent


class NotificationChannel(ABC):
	name: str  # "telegram" | "email" | "frappe_log"

	def __init__(self, settings):
		# cached Hive Settings doc — no per-send DB round-trip for the token
		self.settings = settings

	@abstractmethod
	def is_enabled(self) -> bool:
		"""Channel-level gate (config present + turned on). Cheap, no network."""

	@abstractmethod
	def render(self, event: NotificationEvent) -> dict:
		"""Turn a NotificationEvent into this channel's payload."""

	@abstractmethod
	def send(self, event: NotificationEvent) -> None:
		"""Deliver. Runs inside an enqueued job. May raise; the dispatcher isolates it."""
