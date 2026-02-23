import frappe


def after_install():
	"""Bootstrap Hive roles and create a Hive Member for Administrator."""
	_ensure_roles()
	_bootstrap_admin()
	frappe.db.commit()


def after_migrate():
	"""Ensure roles exist after every migrate (covers upgrades on existing sites)."""
	_ensure_roles()
	_bootstrap_admin()
	frappe.db.commit()


def _ensure_roles():
	for role_name in ("Hive Team", "Hive Client"):
		if not frappe.db.exists("Role", role_name):
			frappe.get_doc({"doctype": "Role", "role_name": role_name}).insert(ignore_permissions=True)


def _bootstrap_admin():
	"""Give Administrator the Hive Team role and create their Hive Member."""
	admin = "Administrator"

	# Add Hive Team role if not already present
	if "Hive Team" not in frappe.get_roles(admin):
		user = frappe.get_doc("User", admin)
		user.add_roles("Hive Team")

	# Create Hive Member record
	if not frappe.db.exists("Hive Member", admin):
		frappe.get_doc(
			{
				"doctype": "Hive Member",
				"user": admin,
				"type": "Team",
				"is_active": 1,
			}
		).insert(ignore_permissions=True)
