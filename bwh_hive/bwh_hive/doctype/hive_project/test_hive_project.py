# Copyright (c) 2026, BWH Studios and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


def _make_project(title="Test Project"):
	return frappe.get_doc({"doctype": "Hive Project", "title": title}).insert(ignore_permissions=True)


def _make_task(project, title="Test Task", **kwargs):
	doc = frappe.get_doc({"doctype": "Hive Task", "title": title, "project": project.name, **kwargs})
	return doc.insert(ignore_permissions=True)


class IntegrationTestHiveProject(IntegrationTestCase):
	"""Integration tests for Hive Project soft delete (archive/restore)."""

	def setUp(self):
		self.project = _make_project("Archive Test Project")

	def tearDown(self):
		frappe.db.rollback()

	def test_project_defaults_to_not_archived(self):
		self.assertEqual(self.project.is_archived, 0)

	def test_archive_project(self):
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)
		self.project.reload()
		self.assertEqual(self.project.is_archived, 1)

	def test_restore_project(self):
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 0)
		self.project.reload()
		self.assertEqual(self.project.is_archived, 0)

	def test_archived_project_excluded_from_get_all(self):
		"""Simulates frontend query pattern: is_archived=0 filter."""
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Project",
			filters={"is_archived": 0},
			fields=["name"],
		)
		visible_names = {p.name for p in visible}
		self.assertNotIn(self.project.name, visible_names)

	def test_restored_project_included_in_get_all(self):
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 0)

		visible = frappe.get_all(
			"Hive Project",
			filters={"is_archived": 0},
			fields=["name"],
		)
		visible_names = {p.name for p in visible}
		self.assertIn(self.project.name, visible_names)

	def test_archived_project_excluded_from_search(self):
		from bwh_hive.bwh_hive.api import _search_like

		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)
		result = _search_like("Archive Test", project=None, limit=10)
		project_names = {p["name"] for p in result["projects"]}
		self.assertNotIn(self.project.name, project_names)

	def test_active_project_included_in_search(self):
		from bwh_hive.bwh_hive.api import _search_like

		result = _search_like("Archive Test", project=None, limit=10)
		project_names = {p["name"] for p in result["projects"]}
		self.assertIn(self.project.name, project_names)

	def test_archive_preserves_project_data(self):
		"""Archiving should not destroy any project data."""
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)
		self.project.reload()

		self.assertEqual(self.project.title, "Archive Test Project")
		self.assertEqual(self.project.status, "Open")

	def test_archived_project_tasks_still_accessible(self):
		"""Archiving a project should not affect its tasks' own archive status."""
		task = _make_task(self.project, "Task in archived project")
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)

		task.reload()
		self.assertEqual(task.is_archived, 0)

	def test_multiple_projects_only_archived_one_hidden(self):
		project2 = _make_project("Active Project")
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Project",
			filters={"is_archived": 0},
			fields=["name"],
		)
		visible_names = {p.name for p in visible}
		self.assertNotIn(self.project.name, visible_names)
		self.assertIn(project2.name, visible_names)

	def test_archived_project_excluded_from_dashboard(self):
		"""Archived project should not appear in get_my_dashboard results."""
		from bwh_hive.bwh_hive.api import get_my_dashboard

		# Add current user as project member so it shows in dashboard
		self.project.append("members", {"member": frappe.session.user})
		self.project.save(ignore_permissions=True)

		# Verify it shows before archiving
		result = get_my_dashboard()
		project_names = {p.name for p in result["my_projects"]}
		self.assertIn(self.project.name, project_names)

		# Archive and verify it's hidden
		frappe.db.set_value("Hive Project", self.project.name, "is_archived", 1)
		result = get_my_dashboard()
		project_names = {p.name for p in result["my_projects"]}
		self.assertNotIn(self.project.name, project_names)
