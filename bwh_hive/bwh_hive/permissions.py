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


def project_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator" or not _is_hive_client():
		return ""

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Project`.`name` IN ({project_list})"


def task_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator" or not _is_hive_client():
		return ""

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Task`.`project` IN ({project_list})"


def feature_request_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator" or not _is_hive_client():
		return ""

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Feature Request`.`project` IN ({project_list})"


def project_update_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator" or not _is_hive_client():
		return ""

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Project Update`.`project` IN ({project_list})"


def milestone_query(user: str | None) -> str:
	if not user:
		user = frappe.session.user

	if user == "Administrator" or not _is_hive_client():
		return ""

	projects = _get_client_projects()
	if not projects:
		return "1=0"

	project_list = ", ".join(frappe.db.escape(p) for p in projects)
	return f"`tabHive Milestone`.`project` IN ({project_list})"
