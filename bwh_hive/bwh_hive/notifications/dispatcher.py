# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""The single public entry point: `notify(event)` (07-notifications.md "dispatcher.py").

Two layers of safety:
  • `notify()` only *enqueues* (callback returns at network speed) and is itself wrapped so
    even a broker hiccup logs rather than 500s the callback.
  • `_deliver()` runs in the worker and catches everything, so a broken channel logs to the
    Error Log instead of an alert storm or a surfaced exception.
`enqueue_after_commit=True` means a status callback that rolls back never sends a phantom ping.
"""

import frappe

from bwh_hive.bwh_hive.notifications.channels.email import EmailChannel
from bwh_hive.bwh_hive.notifications.channels.frappe_log import FrappeLogChannel
from bwh_hive.bwh_hive.notifications.channels.telegram import TelegramChannel
from bwh_hive.bwh_hive.notifications.events import EventType, NotificationEvent

# Optional events fire only when listed here; the three required events always fire when
# notifications are enabled. Flip these on by adding them to the set — no other change.
CHATTY_EVENTS: set[EventType] = set()  # PROVISIONING / CHANGES_REQ muted by default

_REQUIRED_EVENTS = {EventType.SPEC_CREATED, EventType.PR_READY, EventType.FAILED}

_CHANNEL_CLASSES = {
	"telegram": TelegramChannel,
	"email": EmailChannel,
	"frappe_log": FrappeLogChannel,
}


def notify(event: NotificationEvent) -> None:
	"""Public API. Non-blocking: enqueues one background job per enabled channel.

	Defensive throughout — a notification must never resurface into the callback path.
	"""
	try:
		if event.type not in _REQUIRED_EVENTS and event.type not in CHATTY_EVENTS:
			return  # optional event, muted
		settings = frappe.get_cached_doc("Hive Settings")
		if not settings.notifications_enabled:
			return  # global kill-switch → no-op
		for channel in _enabled_channels(settings):
			frappe.enqueue(
				"bwh_hive.bwh_hive.notifications.dispatcher._deliver",
				queue="short",
				timeout=30,
				enqueue_after_commit=True,  # don't fire on a rolled-back callback
				channel_name=channel.name,
				event=event,
			)
	except Exception:
		frappe.log_error(
			title="Notification enqueue failed",
			message=frappe.get_traceback(),
		)  # even the enqueue is best-effort — a broker hiccup cannot 500 a callback


def _enabled_channels(settings) -> list:
	candidates = [cls(settings) for cls in _CHANNEL_CLASSES.values()]
	return [c for c in candidates if c.is_enabled()]


def _build(channel_name: str):
	settings = frappe.get_cached_doc("Hive Settings")
	return _CHANNEL_CLASSES[channel_name](settings)


def _deliver(channel_name: str, event: NotificationEvent) -> None:
	"""Runs in the worker. One channel, fully isolated."""
	try:
		_build(channel_name).send(event)
	except Exception:
		frappe.log_error(
			title=f"Notification failed: {channel_name} / {event.type.value}",
			message=frappe.get_traceback(),
		)  # swallow — a broken channel must never resurface
