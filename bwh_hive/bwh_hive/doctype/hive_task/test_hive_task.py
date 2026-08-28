# Copyright (c) 2026, BWH Studios and Contributors
# See license.txt

import json

import frappe
from frappe.tests import IntegrationTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


def _make_project(title="Test Project"):
	return frappe.get_doc({"doctype": "Hive Project", "title": title}).insert(ignore_permissions=True)


def _make_task(project, title="Test Task", **kwargs):
	doc = frappe.get_doc({"doctype": "Hive Task", "title": title, "project": project.name, **kwargs})
	return doc.insert(ignore_permissions=True)


class TestHiveTaskDependencyValidation(IntegrationTestCase):
	"""Integration tests for Hive Task circular dependency validation."""

	def setUp(self):
		self.project = _make_project("Dependency Test Project")

	def tearDown(self):
		frappe.db.rollback()

	def test_self_dependency_rejected(self):
		task = _make_task(self.project, "Task A")
		task.depends_on = task.name
		self.assertRaises(frappe.ValidationError, task.save)

	def test_direct_circular_dependency_rejected(self):
		"""A → B → A should be rejected."""
		task_a = _make_task(self.project, "Task A")
		task_b = _make_task(self.project, "Task B", depends_on=task_a.name)
		task_a.depends_on = task_b.name
		self.assertRaises(frappe.ValidationError, task_a.save)

	def test_indirect_circular_dependency_rejected(self):
		"""A → B → C → A should be rejected."""
		task_a = _make_task(self.project, "Task A")
		task_b = _make_task(self.project, "Task B", depends_on=task_a.name)
		task_c = _make_task(self.project, "Task C", depends_on=task_b.name)
		task_a.depends_on = task_c.name
		self.assertRaises(frappe.ValidationError, task_a.save)

	def test_valid_dependency_accepted(self):
		task_a = _make_task(self.project, "Task A")
		task_b = _make_task(self.project, "Task B")
		task_b.depends_on = task_a.name
		task_b.save()
		task_b.reload()
		self.assertEqual(task_b.depends_on, task_a.name)

	def test_valid_chain_accepted(self):
		"""A → B → C is a valid chain (no cycle)."""
		task_a = _make_task(self.project, "Task A")
		task_b = _make_task(self.project, "Task B", depends_on=task_a.name)
		task_c = _make_task(self.project, "Task C")
		task_c.depends_on = task_b.name
		task_c.save()
		task_c.reload()
		self.assertEqual(task_c.depends_on, task_b.name)

	def test_clearing_dependency_accepted(self):
		task_a = _make_task(self.project, "Task A")
		task_b = _make_task(self.project, "Task B", depends_on=task_a.name)
		task_b.depends_on = None
		task_b.save()
		task_b.reload()
		self.assertIsNone(task_b.depends_on)

	def test_changing_dependency_to_non_circular_accepted(self):
		task_a = _make_task(self.project, "Task A")
		task_b = _make_task(self.project, "Task B")
		task_c = _make_task(self.project, "Task C", depends_on=task_a.name)
		task_c.depends_on = task_b.name
		task_c.save()
		task_c.reload()
		self.assertEqual(task_c.depends_on, task_b.name)


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
		frappe.db.set_value("Hive Task", self.task.name, "_assign", json.dumps([user]))
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
