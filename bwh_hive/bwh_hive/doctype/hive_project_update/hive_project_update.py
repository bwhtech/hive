# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

from __future__ import annotations

import frappe
from frappe.model.document import Document


class HiveProjectUpdate(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		from bwh_hive.bwh_hive.doctype.hive_update_reaction.hive_update_reaction import HiveUpdateReaction

		content: DF.TextEditor
		is_draft: DF.Check
		posted_by: DF.Link
		project: DF.Link
		reactions: DF.Table[HiveUpdateReaction]
	# end: auto-generated types

	def on_update(self):
		# Notify mentioned users when update is published (draft -> published)
		if not self.is_draft and self.has_value_changed("is_draft"):
			self.notify_mentioned_users()

	def notify_mentioned_users(self):
		from bwh_hive.bwh_hive.doctype.hive_task_comment.hive_task_comment import extract_mentions

		mentioned_emails = extract_mentions(self.content)
		if not mentioned_emails:
			return

		mentioned_emails = [e for e in mentioned_emails if e != self.posted_by]
		if not mentioned_emails:
			return

		project_title = frappe.get_cached_value("Hive Project", self.project, "title") or self.project
		poster_name = frappe.get_cached_value("User", self.posted_by, "full_name") or self.posted_by
		subject = f"{poster_name} mentioned you in a project update on: {project_title}"

		from frappe.desk.doctype.notification_log.notification_log import enqueue_create_notification
		from frappe.utils import get_url

		project_link = f"{get_url()}/hive/projects/{self.project}?tab=updates"
		enqueue_create_notification(
			mentioned_emails,
			{
				"type": "Mention",
				"document_type": "Hive Project",
				"document_name": self.project,
				"subject": subject,
				"from_user": self.posted_by,
				"email_content": self.content,
				"link": project_link,
			},
		)

	@frappe.whitelist()
	def toggle_reaction(self: HiveProjectUpdate, emoji: str) -> list:
		"""Add or remove the current user's reaction with the given emoji."""
		user = frappe.session.user
		existing = None
		for r in self.reactions:
			if r.user == user and r.emoji == emoji:
				existing = r
				break

		if existing:
			self.remove(existing)
		else:
			self.append("reactions", {"user": user, "emoji": emoji})

		self.save()
		return self.reactions
