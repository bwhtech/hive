import frappe


def after_install():
	"""Bootstrap Hive roles and create Hive Members for all System Managers."""
	_ensure_roles()
	_bootstrap_system_managers()
	frappe.db.commit()


def after_migrate():
	"""Ensure roles exist after every migrate (covers upgrades on existing sites)."""
	_ensure_roles()
	_bootstrap_system_managers()
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

		# Create Hive Member record
		if not frappe.db.exists("Hive Member", user_name):
			frappe.get_doc(
				{
					"doctype": "Hive Member",
					"user": user_name,
					"type": "Team",
					"is_active": 1,
				}
			).insert(ignore_permissions=True)
