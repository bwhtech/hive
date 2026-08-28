import frappe


def _get_client_projects() -> list[str]:
	"""Get project names where the current client user is a project member."""
	member = frappe.db.get_value("Hive Member", frappe.session.user, "client")
	if not member:
		return []

	return frappe.get_all(
		"Hive Project",
		filters={"client": member},
		pluck="name",
	)


def _is_hive_client() -> bool:
	return "Hive Client" in frappe.get_roles(frappe.session.user) and "Hive Team" not in frappe.get_roles(
		frappe.session.user
	)


def _private_project_condition(table: str, user: str) -> str:
	"""Return SQL condition that hides other users' private projects."""
	user_escaped = frappe.db.escape(user)
	return f"(`{table}`.`is_private` = 0 OR `{table}`.`owner` = {user_escaped})"


def project_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator":
		return ""

	if not _is_hive_client():
		# Team members: hide other users' private projects
		return _private_project_condition("tabHive Project", user)

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Project`.`name` IN ({project_list})"


def _private_task_condition(user: str) -> str:
	"""Return SQL condition that hides tasks belonging to other users' private projects."""
	user_escaped = frappe.db.escape(user)
	return (
		f"`tabHive Task`.`project` NOT IN "
		f"(SELECT `name` FROM `tabHive Project` WHERE `is_private` = 1 AND `owner` != {user_escaped})"
	)


def task_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator":
		return ""

	if not _is_hive_client():
		# Team members: hide tasks from other users' private projects
		return _private_task_condition(user)

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Task`.`project` IN ({project_list}) AND `tabHive Task`.`is_internal` = 0"


def _private_project_subquery_condition(table: str, project_field: str, user: str) -> str:
	"""Return SQL condition for child tables that reference a project."""
	user_escaped = frappe.db.escape(user)
	return (
		f"`{table}`.`{project_field}` NOT IN "
		f"(SELECT `name` FROM `tabHive Project` WHERE `is_private` = 1 AND `owner` != {user_escaped})"
	)


def feature_request_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator":
		return ""

	if not _is_hive_client():
		return _private_project_subquery_condition("tabHive Feature Request", "project", user)

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Feature Request`.`project` IN ({project_list})"


def project_update_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator":
		return ""

	if not _is_hive_client():
		return _private_project_subquery_condition("tabHive Project Update", "project", user)

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Project Update`.`project` IN ({project_list})"


def milestone_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator":
		return ""

	if not _is_hive_client():
		return _private_project_subquery_condition("tabHive Milestone", "project", user)

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Milestone`.`project` IN ({project_list})"


def member_query(user: str | None) -> str:
	"""Client users can only see members who share the same client."""
	if not user:
		user = frappe.session.user

	if user == "Administrator" or not _is_hive_client():
		return ""

	client = frappe.db.get_value("Hive Member", user, "client")
	if not client:
		# No client assigned — can only see themselves
		return f"`tabHive Member`.`name` = {frappe.db.escape(user)}"

	return f"`tabHive Member`.`client` = {frappe.db.escape(client)}"


def project_has_permission(doc, ptype: str | None = None, user: str | None = None) -> bool:
	"""Block access to private projects for non-owners and restrict client access."""
	if not user:
		user = frappe.session.user

	# Private projects: only the owner can access
	if doc.is_private and doc.owner != user:
		return False

	# Client users: can only access projects linked to their client org
	roles = frappe.get_roles(user)
	if "Hive Client" in roles and "Hive Team" not in roles:
		client = frappe.db.get_value("Hive Member", user, "client")
		if not client or doc.client != client:
			return False

	return True


def client_query(user: str | None) -> str:
	"""Client users cannot see any Hive Client records."""
	if not user:
		user = frappe.session.user

	if user == "Administrator" or not _is_hive_client():
		return ""

	return "1=0"


def pinned_project_query(user: str | None) -> str:
	"""A pin is one user's own sidebar shortcut; nobody else's are listable."""
	if not user:
		user = frappe.session.user
	return f"`tabHive Pinned Project`.`user` = {frappe.db.escape(user)}"


def pinned_project_has_permission(doc, ptype: str | None = None, user: str | None = None) -> bool:
	"""Only the pin's own user may read, change or drop it.

	`create` is allowed through: `before_insert` stamps the session user, so a
	pin cannot be created for anyone else.
	"""
	if not user:
		user = frappe.session.user
	if ptype == "create":
		return True
	return doc.user == user


# Roles that grant access to Hive at all. Anyone on the team or on a client's
# side belongs in the app; everyone else is kept off the apps screen.
HIVE_ROLES = ("System Manager", "Hive Team", "Hive Client")


def has_hive_access(user: str | None = None) -> bool:
	"""Whether `user` is allowed to see Hive at all."""
	if not user:
		user = frappe.session.user

	if user == "Administrator":
		return True

	return any(role in frappe.get_roles(user) for role in HIVE_ROLES)
