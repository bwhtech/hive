import frappe
from frappe.utils import nowdate

from bwh_hive.bwh_hive.api import _enrich_tasks_with_project_titles


def daily() -> None:
	send_daily_overdue_notifications()


def send_daily_overdue_notifications() -> None:
	"""Send daily email to each team member who has overdue tasks.

	Each email includes:
	- The member's own overdue tasks (title, project, priority, how overdue)
	- A summary table of other team members' overdue counts
	"""
	today = nowdate()

	members = frappe.get_all(
		"Hive Member",
		filters={"type": "Team", "is_active": 1},
		fields=["user", "member_name"],
	)
	if not members:
		return

	# Gather overdue tasks per member
	member_overdue: dict[str, dict] = {}
	for member in members:
		tasks = frappe.get_all(
			"Hive Task",
			filters={
				"_assign": ["like", f"%{member.user}%"],
				"due_date": ["<", today],
				"status": ["not in", ["Done"]],
				"is_archived": 0,
			},
			fields=["name", "title", "project", "status", "priority", "due_date"],
			order_by="due_date asc",
			limit=50,
		)
		if tasks:
			_enrich_tasks_with_project_titles(tasks)
			member_overdue[member.user] = {
				"member_name": member.member_name,
				"tasks": tasks,
			}

	if not member_overdue:
		return

	# Build team summary sorted by overdue count descending
	team_summary = [
		{"member_name": data["member_name"], "overdue_count": len(data["tasks"])}
		for data in member_overdue.values()
	]
	team_summary.sort(key=lambda x: x["overdue_count"], reverse=True)

	site_url = frappe.utils.get_url()

	for user, data in member_overdue.items():
		other_summary = [s for s in team_summary if s["member_name"] != data["member_name"]]
		count = len(data["tasks"])

		frappe.sendmail(
			recipients=[user],
			subject=f"You have {count} overdue task{'s' if count != 1 else ''} in Hive",
			template="daily_overdue",
			args={
				"member_name": data["member_name"],
				"tasks": data["tasks"],
				"team_summary": other_summary,
				"task_count": count,
				"site_url": site_url,
			},
			now=True,
		)
