from datetime import timedelta

import frappe
from frappe.utils import getdate, nowdate


@frappe.whitelist()
def get_my_dashboard():
	"""Return aggregated personal dashboard data: my tasks, my projects, unread updates."""
	user = frappe.session.user

	# My tasks grouped by project
	my_tasks = frappe.get_all(
		"Hive Task",
		filters={"assigned_to": user, "status": ["not in", ["Done"]]},
		fields=["name", "title", "project", "status", "priority", "due_date", "is_client_task"],
		order_by="priority desc, modified desc",
		limit=50,
	)

	# Get project titles for the tasks
	project_ids = list({t.project for t in my_tasks if t.project})
	project_map = {}
	if project_ids:
		projects = frappe.get_all(
			"Hive Project",
			filters={"name": ["in", project_ids]},
			fields=["name", "title", "status", "project_type", "client"],
		)
		project_map = {p.name: p for p in projects}

	# Group tasks by project
	tasks_by_project: dict[str, list[dict]] = {}
	for task in my_tasks:
		pid = task.project
		if pid not in tasks_by_project:
			tasks_by_project[pid] = []
		tasks_by_project[pid].append(task)

	grouped_tasks = []
	for pid, tasks in tasks_by_project.items():
		proj = project_map.get(pid, {})
		grouped_tasks.append(
			{
				"project": pid,
				"project_title": proj.get("title", pid) if proj else pid,
				"project_status": proj.get("status", "") if proj else "",
				"tasks": tasks,
			}
		)

	# My projects (where I'm a member or have tasks)
	my_project_member_entries = frappe.get_all(
		"Hive Project Member",
		filters={"member": user},
		fields=["parent"],
	)
	member_project_ids = {e.parent for e in my_project_member_entries}
	all_my_project_ids = member_project_ids | set(project_ids)

	my_projects = []
	if all_my_project_ids:
		my_projects = frappe.get_all(
			"Hive Project",
			filters={"name": ["in", list(all_my_project_ids)]},
			fields=["name", "title", "status", "project_type", "client", "modified"],
			order_by="modified desc",
		)

	# Unread updates count across my projects
	unread_count = 0
	if all_my_project_ids:
		updates = frappe.get_all(
			"Hive Project Update",
			filters={"project": ["in", list(all_my_project_ids)]},
			fields=["name", "_seen"],
			limit=200,
		)
		for upd in updates:
			seen = upd.get("_seen") or "[]"
			if user not in seen:
				unread_count += 1

	# Recent updates from my projects
	recent_updates = []
	if all_my_project_ids:
		recent_updates = frappe.get_all(
			"Hive Project Update",
			filters={"project": ["in", list(all_my_project_ids)]},
			fields=["name", "project", "posted_by", "content", "creation", "_seen"],
			order_by="creation desc",
			limit=10,
		)
		for upd in recent_updates:
			seen = upd.get("_seen") or "[]"
			upd["is_unread"] = user not in seen
			# Get project title
			proj = project_map.get(upd.project)
			upd["project_title"] = proj.get("title", upd.project) if proj else upd.project
			# Get poster name
			upd["posted_by_name"] = (
				frappe.get_cached_value("User", upd.posted_by, "full_name") or upd.posted_by
			)

	return {
		"tasks_by_project": grouped_tasks,
		"my_projects": my_projects,
		"unread_count": unread_count,
		"recent_updates": recent_updates,
	}


@frappe.whitelist()
def get_stale_members(threshold_days: int = 7):
	"""Return team members who haven't posted a project update in threshold_days."""
	cutoff = getdate(nowdate()) - timedelta(days=int(threshold_days))

	team_members = frappe.get_all(
		"Hive Member",
		filters={"type": "Team", "is_active": 1},
		fields=["name", "user", "member_name", "user_image"],
	)

	# Get the most recent update per user
	stale_users = set()
	for member in team_members:
		latest = frappe.get_all(
			"Hive Project Update",
			filters={"posted_by": member.user},
			fields=["creation"],
			order_by="creation desc",
			limit=1,
		)
		if not latest:
			stale_users.add(member.user)
		elif getdate(latest[0].creation) < cutoff:
			stale_users.add(member.user)

	return list(stale_users)


@frappe.whitelist()
def get_task_assignees(project: str | None = None):
	"""Return assignees for tasks grouped by task name. Optionally filter by project."""
	assignees = frappe.get_all(
		"Hive Task Assignee",
		filters={"parenttype": "Hive Task", "parentfield": "assignees"},
		fields=["parent", "member", "member_name", "user_image"],
		limit=500,
	)

	# If project specified, filter to only tasks belonging to that project
	if project:
		project_tasks = {
			t.name
			for t in frappe.get_all(
				"Hive Task",
				filters={"project": project},
				fields=["name"],
				limit=500,
			)
		}
	else:
		project_tasks = None

	result: dict[str, list[dict]] = {}
	for row in assignees:
		if project_tasks is not None and row.parent not in project_tasks:
			continue
		result.setdefault(row.parent, []).append(
			{
				"member": row.member,
				"member_name": row.member_name,
				"user_image": row.user_image,
			}
		)

	return result


@frappe.whitelist(methods=["GET"])
def search(query: str, project: str | None = None, limit: int = 10):
	"""Search projects and tasks using SQL LIKE."""
	query = (query or "").strip()
	if not query:
		return {"projects": [], "tasks": []}

	limit = min(int(limit), 20)
	like = f"%{query}%"

	# Search projects by title
	projects = frappe.get_all(
		"Hive Project",
		filters={"title": ["like", like]},
		fields=["name", "title", "status"],
		order_by="modified desc",
		limit=limit,
	)

	# Search tasks by title, optionally scoped to a project
	task_filters: dict = {"title": ["like", like]}
	if project:
		task_filters["project"] = project

	tasks = frappe.get_all(
		"Hive Task",
		filters=task_filters,
		fields=["name", "title", "project", "status", "priority"],
		order_by="modified desc",
		limit=limit,
	)

	# Enrich tasks with project titles
	task_project_ids = list({t.project for t in tasks if t.project})
	if task_project_ids:
		proj_map = {
			p.name: p.title
			for p in frappe.get_all(
				"Hive Project",
				filters={"name": ["in", task_project_ids]},
				fields=["name", "title"],
			)
		}
		for t in tasks:
			t["project_title"] = proj_map.get(t.project, t.project)

	return {"projects": projects, "tasks": tasks}


@frappe.whitelist()
def get_project_dashboard(project: str):
	"""Return aggregated stats for a project: task counts by status, milestone progress, team members."""
	task_counts = frappe.get_all(
		"Hive Task",
		filters={"project": project},
		fields=["status", "count(name) as count"],
		group_by="status",
	)

	status_map = {}
	total = 0
	for row in task_counts:
		status_map[row.status] = row.count
		total += row.count

	milestones = frappe.get_all(
		"Hive Milestone",
		filters={"project": project},
		fields=["name", "title", "status", "target_date"],
		order_by="target_date asc",
	)

	milestone_counts = {"Upcoming": 0, "In Progress": 0, "Completed": 0}
	for ms in milestones:
		if ms.status in milestone_counts:
			milestone_counts[ms.status] += 1

	project_doc = frappe.get_doc("Hive Project", project)
	members = []
	if hasattr(project_doc, "members"):
		for m in project_doc.members:
			members.append(
				{
					"member": m.member,
					"member_name": m.member_name,
					"role": m.role,
				}
			)

	return {
		"task_counts": status_map,
		"total_tasks": total,
		"milestones": milestones,
		"milestone_counts": milestone_counts,
		"members": members,
	}
