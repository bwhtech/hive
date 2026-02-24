"""Seed script for E2E Playwright tests.

Run via: bench --site <site> execute bwh_hive.e2e_seed.setup_e2e_data
"""

import frappe


def setup_e2e_data():
	"""Create the client user, client org, projects, and tasks needed by E2E tests."""

	# 0a. Set Administrator's full name (tests expect "Administrator Bhaisaab")
	frappe.db.set_value(
		"User",
		"Administrator",
		{
			"first_name": "Administrator",
			"last_name": "Bhaisaab",
		},
	)

	# 0b. Sync the Hive Member record (created at install time with the old name)
	if frappe.db.exists("Hive Member", "Administrator"):
		frappe.db.set_value("Hive Member", "Administrator", "member_name", "Administrator Bhaisaab")

	# 0c. Ensure a default outgoing Email Account exists so invite_by_email
	#     doesn't crash even though mute_emails=1 in CI (Frappe resolves the
	#     account before checking the mute flag).
	_ensure_outgoing_email_account()

	# 1. Ensure the "Hive Client" role exists
	if not frappe.db.exists("Role", "Hive Client"):
		frappe.get_doc({"doctype": "Role", "role_name": "Hive Client"}).insert(ignore_permissions=True)

	# 2. Create client user
	client_email = "clientuser@example.com"
	if not frappe.db.exists("User", client_email):
		user = frappe.get_doc(
			{
				"doctype": "User",
				"email": client_email,
				"first_name": "Client",
				"last_name": "User",
				"enabled": 1,
				"roles": [{"role": "Hive Client"}],
			}
		)
		user.flags.no_welcome_mail = True
		user.insert(ignore_permissions=True)
		frappe.utils.password.update_password(client_email, "admin")

	# 3. Create client org
	client_name = "Acme Corp"
	if not frappe.db.exists("Hive Client", client_name):
		frappe.get_doc(
			{
				"doctype": "Hive Client",
				"company_name": client_name,
				"is_active": 1,
			}
		).insert(ignore_permissions=True)

	# 4. Create Hive Member linking client user to client org
	if not frappe.db.exists("Hive Member", client_email):
		frappe.get_doc(
			{
				"doctype": "Hive Member",
				"user": client_email,
				"type": "Client",
				"client": client_name,
				"is_active": 1,
			}
		).insert(ignore_permissions=True)

	# 5. Mark onboarding as completed so the dialog doesn't block E2E tests
	frappe.db.set_single_value("Hive Settings", "onboarding_completed", 1)

	# 6. Create projects
	# Project visible to client
	website_project = _create_project("Website Redesign", client=client_name)

	# Projects NOT visible to client (no client set)
	_create_project("Mobile App MVP")
	_create_project("Infrastructure Migration")

	# 7. Create a task in the client's project (tests expect kanban columns)
	if website_project:
		_create_task("Design homepage mockup", website_project, status="In Progress")
		_create_task("Implement responsive layout", website_project, status="Backlog")

	frappe.db.commit()


def _create_project(title: str, client: str | None = None) -> str | None:
	"""Create a Hive Project if one with the same title doesn't already exist."""
	existing = frappe.db.get_value("Hive Project", {"title": title}, "name")
	if existing:
		return existing

	doc = frappe.get_doc(
		{
			"doctype": "Hive Project",
			"title": title,
			"status": "Open",
			"client": client,
		}
	)
	doc.insert(ignore_permissions=True)
	return doc.name


def _create_task(title: str, project: str, status: str = "Backlog") -> str | None:
	"""Create a Hive Task if one with the same title+project doesn't already exist."""
	existing = frappe.db.get_value("Hive Task", {"title": title, "project": project}, "name")
	if existing:
		return existing

	doc = frappe.get_doc(
		{
			"doctype": "Hive Task",
			"title": title,
			"project": project,
			"status": status,
		}
	)
	doc.insert(ignore_permissions=True)
	return doc.name


def _ensure_outgoing_email_account():
	"""Create a dummy outgoing Email Account for CI so Frappe's sendmail doesn't crash."""
	if frappe.db.exists("Email Account", {"default_outgoing": 1}):
		return

	doc = frappe.get_doc(
		{
			"doctype": "Email Account",
			"email_account_name": "E2E Test Outgoing",
			"email_id": "test@example.com",
			"default_outgoing": 1,
			"enable_outgoing": 1,
			"smtp_server": "localhost",
			"smtp_port": 25,
		}
	)
	doc.flags.ignore_validate = True
	doc.flags.ignore_links = True
	doc.insert(ignore_permissions=True)
