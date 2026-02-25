# Copyright (c) 2026, BWH Studios and Contributors
# See license.txt

from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase

from bwh_hive.bwh_hive.doctype.hive_task_comment.hive_task_comment import extract_mentions

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


def _make_project(title="Comment Test Project"):
	return frappe.get_doc({"doctype": "Hive Project", "title": title}).insert(ignore_permissions=True)


def _make_task(project, title="Comment Test Task"):
	return frappe.get_doc({"doctype": "Hive Task", "title": title, "project": project.name}).insert(
		ignore_permissions=True
	)


def _make_comment(task, content="Test comment"):
	return frappe.get_doc({"doctype": "Hive Task Comment", "task": task.name, "content": content}).insert(
		ignore_permissions=True
	)


class IntegrationTestHiveTaskComment(IntegrationTestCase):
	"""Integration tests for Hive Task Comment soft delete (archive/restore)."""

	def setUp(self):
		self.project = _make_project()
		self.task = _make_task(self.project)
		self.comment = _make_comment(self.task, "Alpha comment")

	def tearDown(self):
		frappe.db.rollback()

	def test_comment_defaults_to_not_archived(self):
		self.assertEqual(self.comment.is_archived, 0)

	def test_archive_comment(self):
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 1)
		self.comment.reload()
		self.assertEqual(self.comment.is_archived, 1)

	def test_restore_comment(self):
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 1)
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 0)
		self.comment.reload()
		self.assertEqual(self.comment.is_archived, 0)

	def test_archived_comment_excluded_from_get_all(self):
		"""Simulates frontend query pattern: is_archived=0 filter."""
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Task Comment",
			filters={"task": self.task.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {c.name for c in visible}
		self.assertNotIn(self.comment.name, visible_names)

	def test_restored_comment_included_in_get_all(self):
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 1)
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 0)

		visible = frappe.get_all(
			"Hive Task Comment",
			filters={"task": self.task.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {c.name for c in visible}
		self.assertIn(self.comment.name, visible_names)

	def test_archive_preserves_comment_data(self):
		"""Archiving should not destroy any comment data."""
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 1)
		self.comment.reload()

		self.assertEqual(self.comment.content, "Alpha comment")
		self.assertEqual(self.comment.task, self.task.name)

	def test_multiple_comments_only_archived_one_hidden(self):
		comment2 = _make_comment(self.task, "Beta comment")
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Task Comment",
			filters={"task": self.task.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {c.name for c in visible}
		self.assertNotIn(self.comment.name, visible_names)
		self.assertIn(comment2.name, visible_names)

	def test_archiving_task_comment_does_not_affect_other_tasks(self):
		"""Archiving a comment on one task should not affect comments on other tasks."""
		task2 = _make_task(self.project, "Another Task")
		comment2 = _make_comment(task2, "Other task comment")
		frappe.db.set_value("Hive Task Comment", self.comment.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Task Comment",
			filters={"task": task2.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {c.name for c in visible}
		self.assertIn(comment2.name, visible_names)


class TestExtractMentions(IntegrationTestCase):
	"""Unit tests for extracting @mentions from HTML content."""

	def test_extract_single_mention(self):
		html = '<p>Hey <span data-type="mention" class="mention" data-id="alice@example.com" data-label="Alice Smith">@Alice Smith</span></p>'
		self.assertEqual(extract_mentions(html), ["alice@example.com"])

	def test_extract_multiple_mentions(self):
		html = '<p><span data-type="mention" class="mention" data-id="alice@example.com" data-label="Alice">@Alice</span> and <span data-type="mention" class="mention" data-id="bob@example.com" data-label="Bob">@Bob</span></p>'
		result = extract_mentions(html)
		self.assertEqual(set(result), {"alice@example.com", "bob@example.com"})

	def test_no_mentions(self):
		html = "<p>Just a regular comment with no mentions.</p>"
		self.assertEqual(extract_mentions(html), [])

	def test_duplicate_mentions_deduplicated(self):
		html = '<p><span data-type="mention" class="mention" data-id="alice@example.com" data-label="Alice">@Alice</span> and again <span data-type="mention" class="mention" data-id="alice@example.com" data-label="Alice">@Alice</span></p>'
		self.assertEqual(extract_mentions(html), ["alice@example.com"])


class TestMentionNotification(IntegrationTestCase):
	"""Integration tests for @mention email notifications."""

	def setUp(self):
		self.project = _make_project()
		self.task = _make_task(self.project)

	def tearDown(self):
		frappe.db.rollback()

	@patch("bwh_hive.bwh_hive.doctype.hive_task_comment.hive_task_comment.frappe.sendmail")
	def test_mention_triggers_email(self, mock_sendmail):
		content = '<p>Hey <span data-type="mention" class="mention" data-id="alice@example.com" data-label="Alice Smith">@Alice Smith</span></p>'
		_make_comment(self.task, content)
		mock_sendmail.assert_called_once()
		call_kwargs = mock_sendmail.call_args
		self.assertIn("alice@example.com", call_kwargs.kwargs["recipients"])

	@patch("bwh_hive.bwh_hive.doctype.hive_task_comment.hive_task_comment.frappe.sendmail")
	def test_no_mention_no_email(self, mock_sendmail):
		_make_comment(self.task, "<p>Just a regular comment</p>")
		mock_sendmail.assert_not_called()

	@patch("bwh_hive.bwh_hive.doctype.hive_task_comment.hive_task_comment.frappe.sendmail")
	def test_self_mention_no_email(self, mock_sendmail):
		"""Mentioning yourself should not trigger an email."""
		user = frappe.session.user
		content = (
			f'<p><span data-type="mention" class="mention" data-id="{user}" data-label="Me">@Me</span></p>'
		)
		_make_comment(self.task, content)
		mock_sendmail.assert_not_called()

	@patch("bwh_hive.bwh_hive.doctype.hive_task_comment.hive_task_comment.frappe.sendmail")
	def test_email_subject_contains_task_title(self, mock_sendmail):
		content = '<p><span data-type="mention" class="mention" data-id="alice@example.com" data-label="Alice">@Alice</span></p>'
		_make_comment(self.task, content)
		subject = mock_sendmail.call_args.kwargs["subject"]
		self.assertIn(self.task.title, subject)
