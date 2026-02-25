# Copyright (c) 2026, BWH Studios and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


def _make_project_type(type_name="Test Type"):
	return frappe.get_doc({"doctype": "Hive Project Type", "type_name": type_name}).insert(
		ignore_permissions=True
	)


class IntegrationTestHiveProjectType(IntegrationTestCase):
	"""Integration tests for Hive Project Type soft delete (archive/restore)."""

	def setUp(self):
		self.pt = _make_project_type("Alpha Type")

	def tearDown(self):
		frappe.db.rollback()

	def test_project_type_defaults_to_not_archived(self):
		self.assertEqual(self.pt.is_archived, 0)

	def test_archive_project_type(self):
		frappe.db.set_value("Hive Project Type", self.pt.name, "is_archived", 1)
		self.pt.reload()
		self.assertEqual(self.pt.is_archived, 1)

	def test_restore_project_type(self):
		frappe.db.set_value("Hive Project Type", self.pt.name, "is_archived", 1)
		frappe.db.set_value("Hive Project Type", self.pt.name, "is_archived", 0)
		self.pt.reload()
		self.assertEqual(self.pt.is_archived, 0)

	def test_archived_project_type_excluded_from_get_all(self):
		"""Simulates frontend query pattern: is_archived=0 filter."""
		frappe.db.set_value("Hive Project Type", self.pt.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Project Type",
			filters={"is_archived": 0},
			fields=["name"],
		)
		visible_names = {pt.name for pt in visible}
		self.assertNotIn(self.pt.name, visible_names)

	def test_restored_project_type_included_in_get_all(self):
		frappe.db.set_value("Hive Project Type", self.pt.name, "is_archived", 1)
		frappe.db.set_value("Hive Project Type", self.pt.name, "is_archived", 0)

		visible = frappe.get_all(
			"Hive Project Type",
			filters={"is_archived": 0},
			fields=["name"],
		)
		visible_names = {pt.name for pt in visible}
		self.assertIn(self.pt.name, visible_names)

	def test_archive_preserves_project_type_data(self):
		"""Archiving should not destroy any data."""
		frappe.db.set_value("Hive Project Type", self.pt.name, "is_archived", 1)
		self.pt.reload()
		self.assertEqual(self.pt.type_name, "Alpha Type")

	def test_multiple_types_only_archived_one_hidden(self):
		pt2 = _make_project_type("Beta Type")
		frappe.db.set_value("Hive Project Type", self.pt.name, "is_archived", 1)

		visible = frappe.get_all(
			"Hive Project Type",
			filters={"is_archived": 0},
			fields=["name"],
		)
		visible_names = {pt.name for pt in visible}
		self.assertNotIn(self.pt.name, visible_names)
		self.assertIn(pt2.name, visible_names)
