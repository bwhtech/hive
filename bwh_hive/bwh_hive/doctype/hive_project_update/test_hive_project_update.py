# Copyright (c) 2026, BWH Studios and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


def _make_project(title="Update Test Project"):
	return frappe.get_doc({"doctype": "Hive Project", "title": title}).insert(ignore_permissions=True)


def _make_update(project, content="Test update", is_draft=0):
	return frappe.get_doc(
		{
			"doctype": "Hive Project Update",
			"project": project.name,
			"content": content,
			"is_draft": is_draft,
		}
	).insert(ignore_permissions=True)


class IntegrationTestHiveProjectUpdate(IntegrationTestCase):
	"""Integration tests for Hive Project Update soft delete (archive/restore)."""

	def setUp(self):
		self.project = _make_project()
		self.update = _make_update(self.project, "Alpha update")

	def tearDown(self):
		frappe.db.rollback()

	def test_update_defaults_to_not_archived(self):
		self.assertEqual(self.update.is_archived, 0)

	def test_archive_update(self):
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 1)
		self.update.reload()
		self.assertEqual(self.update.is_archived, 1)

	def test_restore_update(self):
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 1)
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 0)
		self.update.reload()
		self.assertEqual(self.update.is_archived, 0)

	def test_archived_update_excluded_from_get_all(self):
		"""Simulates frontend query pattern: is_archived=0 filter."""
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Project Update",
			filters={"project": self.project.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {u.name for u in visible}
		self.assertNotIn(self.update.name, visible_names)

	def test_restored_update_included_in_get_all(self):
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 1)
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 0)

		visible = frappe.get_all(
			"Hive Project Update",
			filters={"project": self.project.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {u.name for u in visible}
		self.assertIn(self.update.name, visible_names)

	def test_archive_preserves_update_data(self):
		"""Archiving should not destroy any update data."""
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 1)
		self.update.reload()

		self.assertEqual(self.update.content, "Alpha update")
		self.assertEqual(self.update.project, self.project.name)
		self.assertEqual(self.update.is_draft, 0)

	def test_multiple_updates_only_archived_one_hidden(self):
		update2 = _make_update(self.project, "Beta update")
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Project Update",
			filters={"project": self.project.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {u.name for u in visible}
		self.assertNotIn(self.update.name, visible_names)
		self.assertIn(update2.name, visible_names)

	def test_archiving_update_does_not_affect_other_projects(self):
		"""Archiving an update on one project should not affect updates on other projects."""
		project2 = _make_project("Other Project")
		update2 = _make_update(project2, "Other project update")
		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Project Update",
			filters={"project": project2.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {u.name for u in visible}
		self.assertIn(update2.name, visible_names)

	def test_archived_draft_excluded_from_drafts_query(self):
		"""Draft updates should also be hidden when archived."""
		draft = _make_update(self.project, "Draft update", is_draft=1)
		frappe.db.set_value("Hive Project Update", draft.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Project Update",
			filters={"project": self.project.name, "is_draft": 1, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {u.name for u in visible}
		self.assertNotIn(draft.name, visible_names)

	def test_archived_update_excluded_from_dashboard_unread(self):
		"""Archived updates should not count toward unread count in get_my_dashboard."""
		from bwh_hive.bwh_hive.api import get_my_dashboard

		frappe.db.set_value("Hive Project Update", self.update.name, "is_archived", 1)

		result = get_my_dashboard()
		# The archived update should not appear in recent_updates
		recent_names = {u["name"] for u in result.get("recent_updates", [])}
		self.assertNotIn(self.update.name, recent_names)
