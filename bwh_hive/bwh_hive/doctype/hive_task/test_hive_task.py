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


class IntegrationTestHiveTask(IntegrationTestCase):
	"""Integration tests for Hive Task soft delete (archive/restore)."""

	def setUp(self):
		self.project = _make_project("Soft Delete Test Project")
		self.task = _make_task(self.project, "Task Alpha")

	def tearDown(self):
		frappe.db.rollback()

	def test_task_defaults_to_not_archived(self):
		self.assertEqual(self.task.is_archived, 0)

	def test_archive_task(self):
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)
		self.task.reload()
		self.assertEqual(self.task.is_archived, 1)

	def test_restore_task(self):
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 0)
		self.task.reload()
		self.assertEqual(self.task.is_archived, 0)

	def test_archived_task_excluded_from_get_all(self):
		"""Simulates frontend query pattern: is_archived=0 filter."""
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Task",
			filters={"project": self.project.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {t.name for t in visible}
		self.assertNotIn(self.task.name, visible_names)

	def test_restored_task_included_in_get_all(self):
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 0)

		visible = frappe.get_all(
			"Hive Task",
			filters={"project": self.project.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {t.name for t in visible}
		self.assertIn(self.task.name, visible_names)

	def test_archived_task_excluded_from_project_dashboard(self):
		from bwh_hive.bwh_hive.api import get_project_dashboard

		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)
		result = get_project_dashboard(project=self.project.name)
		self.assertEqual(result["total_tasks"], 0)

	def test_active_task_included_in_project_dashboard(self):
		from bwh_hive.bwh_hive.api import get_project_dashboard

		result = get_project_dashboard(project=self.project.name)
		self.assertEqual(result["total_tasks"], 1)

	def test_archived_task_excluded_from_search(self):
		from bwh_hive.bwh_hive.api import _search_like

		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)
		result = _search_like("Task Alpha", project=None, limit=10)
		task_names = {t["name"] for t in result["tasks"]}
		self.assertNotIn(self.task.name, task_names)

	def test_active_task_included_in_search(self):
		from bwh_hive.bwh_hive.api import _search_like

		result = _search_like("Task Alpha", project=None, limit=10)
		task_names = {t["name"] for t in result["tasks"]}
		self.assertIn(self.task.name, task_names)

	def test_archived_task_excluded_from_member_tasks(self):
		from bwh_hive.bwh_hive.api import get_member_tasks

		user = frappe.session.user
		frappe.db.set_value("Hive Task", self.task.name, "assigned_to", user)
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)

		result = get_member_tasks(user=user)
		all_task_names = {t.name for t in result["wip"] + result["backlog"] + result["blocked"]}
		self.assertNotIn(self.task.name, all_task_names)

	def test_archive_preserves_task_data(self):
		"""Archiving should not destroy any task data."""
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)
		self.task.reload()

		self.assertEqual(self.task.title, "Task Alpha")
		self.assertEqual(self.task.project, self.project.name)
		self.assertEqual(self.task.status, "To Do")

	def test_multiple_tasks_only_archived_one_hidden(self):
		task2 = _make_task(self.project, "Task Beta")
		frappe.db.set_value("Hive Task", self.task.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Task",
			filters={"project": self.project.name, "is_archived": 0},
			fields=["name"],
		)
		visible_names = {t.name for t in visible}
		self.assertNotIn(self.task.name, visible_names)
		self.assertIn(task2.name, visible_names)
