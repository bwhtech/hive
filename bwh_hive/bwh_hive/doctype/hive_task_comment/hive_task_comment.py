# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

import re

import frappe
from frappe.model.document import Document


class HiveTaskComment(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		content: DF.TextEditor
		posted_by: DF.Link
		task: DF.Link
	# end: auto-generated types

	def after_insert(self):
		self.notify_mentioned_users()

	def notify_mentioned_users(self):
		mentioned_emails = extract_mentions(self.content)
		if not mentioned_emails:
			return

		# Don't notify the comment author
		mentioned_emails = [e for e in mentioned_emails if e != self.posted_by]
		if not mentioned_emails:
			return

		task_doc = frappe.get_doc("Hive Task", self.task)
		poster_name = frappe.get_cached_value("User", self.posted_by, "full_name") or self.posted_by

		subject = f"{poster_name} mentioned you in a comment on: {task_doc.title}"

		# Build link to the task
		site_url = frappe.utils.get_url()
		project = task_doc.project
		task_link = f"{site_url}/hive/projects/{project}/tasks/{self.task}"

		message = f"""
		<p><strong>{poster_name}</strong> mentioned you in a comment on task
		<a href="{task_link}">{task_doc.title}</a>:</p>
		<blockquote style="border-left: 3px solid #ccc; padding-left: 12px; margin: 12px 0; color: #555;">
		{self.content}
		</blockquote>
		<p><a href="{task_link}">View Task</a></p>
		"""

		try:
			frappe.sendmail(
				recipients=mentioned_emails,
				subject=subject,
				message=message,
				reference_doctype="Hive Task Comment",
				reference_name=self.name,
				now=True,
			)
		except frappe.OutgoingEmailError:
			pass


def extract_mentions(html: str) -> list[str]:
	"""Extract user emails from @mention tags in HTML content."""
	mentions = set()
	for tag in re.finditer(r"<[^>]+data-type=\"mention\"[^>]+>", html):
		match = re.search(r'data-id="([^"]+)"', tag.group())
		if match:
			mentions.add(match.group(1))
	return list(mentions)
