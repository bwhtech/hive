# Copyright (c) 2026, BWH Studios and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []

CLIENT_USER_EMAIL = "test_client_user@example.com"
TEAM_USER_EMAIL = "test_team_user@example.com"


def _ensure_user(email, roles):
	"""Create a test user with the given roles if it doesn't exist."""
	if not frappe.db.exists("User", email):
		user = frappe.get_doc(
			{
				"doctype": "User",
				"email": email,
				"first_name": email.split("@")[0],
				"enabled": 1,
				"roles": [{"role": r} for r in roles],
			}
		)
		user.insert(ignore_permissions=True)
	else:
		user = frappe.get_doc("User", email)
		existing_roles = {r.role for r in user.roles}
		for r in roles:
			if r not in existing_roles:
				user.append("roles", {"role": r})
		user.save(ignore_permissions=True)
	# Clear Frappe's Redis role cache so frappe.get_roles() picks up the new roles
	frappe.cache.hdel("roles", email)
	return email


def _make_client(name="Test Client Co"):
	if frappe.db.exists("Hive Client", name):
		return frappe.get_doc("Hive Client", name)
	return frappe.get_doc({"doctype": "Hive Client", "company_name": name}).insert(ignore_permissions=True)


def _make_member(user, member_type="Team", client=None):
	if frappe.db.exists("Hive Member", user):
		member = frappe.get_doc("Hive Member", user)
		member.type = member_type
		member.client = client
		member.save(ignore_permissions=True)
		return member
	return frappe.get_doc(
		{
			"doctype": "Hive Member",
			"user": user,
			"type": member_type,
			"client": client,
			"is_active": 1,
		}
	).insert(ignore_permissions=True)


def _make_project(title="Test Project", client=None):
	return frappe.get_doc({"doctype": "Hive Project", "title": title, "client": client}).insert(
		ignore_permissions=True
	)


def _make_task(project, title="Test Task", **kwargs):
	return frappe.get_doc({"doctype": "Hive Task", "title": title, "project": project.name, **kwargs}).insert(
		ignore_permissions=True
	)


class TestClientPermissions(IntegrationTestCase):
	"""Integration tests for client user permission restrictions.

	Uses frappe.get_list() (not get_all) to test permission_query_conditions,
	since get_all ignores permissions.
	"""

	def setUp(self):
		# Create users
		_ensure_user(CLIENT_USER_EMAIL, ["Hive Client"])
		_ensure_user(TEAM_USER_EMAIL, ["Hive Team"])

		# Create client org and link client user
		self.client_org = _make_client("Perm Test Client")
		self.other_client = _make_client("Other Client Co")

		# Create members
		self.client_member = _make_member(CLIENT_USER_EMAIL, "Client", self.client_org.name)
		self.team_member = _make_member(TEAM_USER_EMAIL, "Team")

		# Create projects
		self.client_project = _make_project("Client Visible Project", client=self.client_org.name)
		self.other_project = _make_project("Internal Only Project")
		self.other_client_project = _make_project("Other Client Project", client=self.other_client.name)

		# Create tasks
		self.visible_task = _make_task(self.client_project, "Visible Task", is_internal=0)
		self.internal_task = _make_task(self.client_project, "Internal Task", is_internal=1)
		self.other_project_task = _make_task(self.other_project, "Other Project Task")

	def tearDown(self):
		frappe.set_user("Administrator")
		frappe.db.rollback()

	# --- Task visibility ---

	def test_client_sees_non_internal_tasks_in_their_project(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		tasks = frappe.get_list("Hive Task", fields=["name", "is_internal"])
		task_names = {t.name for t in tasks}
		self.assertIn(self.visible_task.name, task_names)

	def test_client_cannot_see_internal_tasks(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		tasks = frappe.get_list("Hive Task", fields=["name", "is_internal"])
		task_names = {t.name for t in tasks}
		self.assertNotIn(self.internal_task.name, task_names)

	def test_client_cannot_see_other_project_tasks(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		tasks = frappe.get_list("Hive Task", fields=["name"])
		task_names = {t.name for t in tasks}
		self.assertNotIn(self.other_project_task.name, task_names)

	def test_team_user_sees_all_tasks(self):
		frappe.set_user(TEAM_USER_EMAIL)
		tasks = frappe.get_list("Hive Task", fields=["name"])
		task_names = {t.name for t in tasks}
		self.assertIn(self.visible_task.name, task_names)
		self.assertIn(self.internal_task.name, task_names)
		self.assertIn(self.other_project_task.name, task_names)

	# --- Project visibility ---

	def test_client_sees_own_projects(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		projects = frappe.get_list("Hive Project", fields=["name"])
		project_names = {p.name for p in projects}
		self.assertIn(self.client_project.name, project_names)

	def test_client_cannot_see_other_projects(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		projects = frappe.get_list("Hive Project", fields=["name"])
		project_names = {p.name for p in projects}
		self.assertNotIn(self.other_project.name, project_names)
		self.assertNotIn(self.other_client_project.name, project_names)

	def test_client_cannot_create_project(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		self.assertRaises(
			frappe.PermissionError,
			lambda: frappe.get_doc({"doctype": "Hive Project", "title": "Unauthorized Project"}).insert(),
		)

	# --- Client org visibility ---

	def test_client_cannot_see_client_list(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		clients = frappe.get_list("Hive Client", fields=["name"])
		self.assertEqual(len(clients), 0)

	def test_team_user_sees_all_clients(self):
		frappe.set_user(TEAM_USER_EMAIL)
		clients = frappe.get_list("Hive Client", fields=["name"])
		client_names = {c.name for c in clients}
		self.assertIn(self.client_org.name, client_names)
		self.assertIn(self.other_client.name, client_names)

	# --- Member visibility ---

	def test_client_sees_only_same_client_members(self):
		# Create another client member in the same org
		other_client_email = "other_client_member@example.com"
		_ensure_user(other_client_email, ["Hive Client"])
		_make_member(other_client_email, "Client", self.client_org.name)

		frappe.set_user(CLIENT_USER_EMAIL)
		members = frappe.get_list("Hive Member", fields=["name", "client"])
		member_names = {m.name for m in members}
		# Should see themselves and the other client member
		self.assertIn(CLIENT_USER_EMAIL, member_names)
		self.assertIn(other_client_email, member_names)
		# Should NOT see the team member (no client assigned)
		self.assertNotIn(TEAM_USER_EMAIL, member_names)

	def test_team_user_sees_all_members(self):
		frappe.set_user(TEAM_USER_EMAIL)
		members = frappe.get_list("Hive Member", fields=["name"])
		member_names = {m.name for m in members}
		self.assertIn(CLIENT_USER_EMAIL, member_names)
		self.assertIn(TEAM_USER_EMAIL, member_names)

	# --- Client cannot create/delete/write restricted doctypes ---

	def test_client_cannot_create_client_org(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		self.assertRaises(
			frappe.PermissionError,
			lambda: frappe.get_doc(
				{"doctype": "Hive Client", "company_name": "Unauthorized Client"}
			).insert(),
		)

	def test_client_cannot_delete_project(self):
		frappe.set_user(CLIENT_USER_EMAIL)
		self.assertRaises(
			frappe.PermissionError,
			lambda: frappe.delete_doc("Hive Project", self.client_project.name),
		)
