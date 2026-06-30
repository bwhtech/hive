# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""Agent-lifecycle notifications (specs/v2 07-notifications.md).

A small, object-oriented dispatcher that turns agent-lifecycle transitions into chat
alerts. Telegram is the only channel that sends in v2; Email/FrappeLog are real
subclasses left disabled by default. The orchestration/callback layer imports `notify`
from `.dispatcher`; nothing here imports back into the orchestrator.
"""
