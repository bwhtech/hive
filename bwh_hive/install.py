import frappe


def after_install():
	"""Bootstrap Hive roles, members, and default project types."""
	_ensure_roles()
	_bootstrap_system_managers()
	_ensure_default_project_types()
	frappe.db.commit()


def after_migrate():
	"""Ensure roles and defaults exist after every migrate (covers upgrades on existing sites)."""
	_ensure_roles()
	_bootstrap_system_managers()
	_ensure_default_project_types()
	_generate_missing_project_slugs()
	frappe.db.commit()


def _ensure_roles():
	for role_name in ("Hive Team", "Hive Client"):
		if not frappe.db.exists("Role", role_name):
			frappe.get_doc({"doctype": "Role", "role_name": role_name}).insert(ignore_permissions=True)


def _bootstrap_system_managers():
	"""Give all System Managers the Hive Team role and create their Hive Member."""
	system_managers = frappe.get_all(
		"Has Role",
		filters={"role": "System Manager", "parenttype": "User"},
		pluck="parent",
	)
	# Always include Administrator
	if "Administrator" not in system_managers:
		system_managers.append("Administrator")

	for user_name in system_managers:
		if not frappe.db.exists("User", user_name):
			continue

		# Add Hive Team role if not already present
		if "Hive Team" not in frappe.get_roles(user_name):
			frappe.get_doc("User", user_name).add_roles("Hive Team")

		# Create Hive Member record — check by `user` (unique), not `name`,
		# because Frappe rename propagates Link values but does not necessarily
		# rename the Hive Member's primary key.
		if not frappe.db.exists("Hive Member", {"user": user_name}):
			frappe.get_doc(
				{
					"doctype": "Hive Member",
					"user": user_name,
					"type": "Team",
					"is_active": 1,
				}
			).insert(ignore_permissions=True)


def _generate_missing_project_slugs():
	"""Generate slugs for any projects that don't have one yet."""
	projects = frappe.get_all(
		"Hive Project",
		filters=[["slug", "is", "not set"]],
		fields=["name"],
	)
	for p in projects:
		doc = frappe.get_doc("Hive Project", p.name)
		doc.save(ignore_permissions=True)


DEFAULT_PROJECT_TYPES = ["Development", "Implementation", "Retainer", "Internal"]


def _ensure_default_project_types():
	for type_name in DEFAULT_PROJECT_TYPES:
		if not frappe.db.exists("Hive Project Type", type_name):
			frappe.get_doc({"doctype": "Hive Project Type", "type_name": type_name}).insert(
				ignore_permissions=True
			)
