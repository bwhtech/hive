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
def get_team_dashboard():
	"""Return team members with WIP and Backlog task counts."""
	members = frappe.get_all(
		"Hive Member",
		filters={"type": "Team", "is_active": 1},
		fields=["name", "user", "member_name", "user_image", "designation"],
		order_by="member_name asc",
	)

	# Get all non-Done tasks
	tasks = frappe.get_all(
		"Hive Task",
		filters={"status": ["not in", ["Done"]]},
		fields=["name", "status", "assigned_to"],
		limit=500,
	)

	# Get all task assignees (multi-assignee system)
	assignees = frappe.get_all(
		"Hive Task Assignee",
		filters={"parenttype": "Hive Task", "parentfield": "assignees"},
		fields=["parent", "member"],
		limit=500,
	)

	# Build task status map
	task_status = {t.name: t.status for t in tasks}

	# Build user -> task set mapping (deduplicates legacy + new assignees)
	user_tasks: dict[str, set] = {}

	for task in tasks:
		if task.assigned_to:
			user_tasks.setdefault(task.assigned_to, set()).add(task.name)

	for row in assignees:
		if row.parent in task_status:
			user_tasks.setdefault(row.member, set()).add(row.parent)

	# Count per member
	result = []
	for member in members:
		member_task_names = user_tasks.get(member.user, set())
		wip = 0
		backlog = 0
		blocked = 0
		for task_name in member_task_names:
			status = task_status.get(task_name)
			if status in ("In Progress", "To Do"):
				wip += 1
			elif status == "Backlog":
				backlog += 1
			elif status == "Blocked":
				blocked += 1

		result.append(
			{
				"user": member.user,
				"member_name": member.member_name,
				"user_image": member.user_image,
				"designation": member.designation,
				"wip_count": wip,
				"backlog_count": backlog,
				"blocked_count": blocked,
			}
		)

	return result


@frappe.whitelist()
def get_member_tasks(user: str):
	"""Return tasks assigned to a specific member, grouped by category (wip, backlog, blocked)."""
	# Get tasks via legacy assigned_to
	legacy_tasks = frappe.get_all(
		"Hive Task",
		filters={"assigned_to": user, "status": ["not in", ["Done"]]},
		fields=["name", "title", "project", "status", "priority", "due_date"],
		limit=100,
	)
	task_names = {t.name for t in legacy_tasks}
	task_map = {t.name: t for t in legacy_tasks}

	# Get tasks via multi-assignee system
	assignee_rows = frappe.get_all(
		"Hive Task Assignee",
		filters={"member": user, "parenttype": "Hive Task", "parentfield": "assignees"},
		fields=["parent"],
		limit=100,
	)
	extra_task_names = {r.parent for r in assignee_rows} - task_names
	if extra_task_names:
		extra_tasks = frappe.get_all(
			"Hive Task",
			filters={"name": ["in", list(extra_task_names)], "status": ["not in", ["Done"]]},
			fields=["name", "title", "project", "status", "priority", "due_date"],
		)
		for t in extra_tasks:
			task_map[t.name] = t

	# Enrich with project titles
	project_ids = list({t.project for t in task_map.values() if t.project})
	proj_title_map = {}
	if project_ids:
		proj_title_map = {
			p.name: p.title
			for p in frappe.get_all(
				"Hive Project",
				filters={"name": ["in", project_ids]},
				fields=["name", "title"],
			)
		}

	# Group by category
	wip = []
	backlog = []
	blocked = []
	for task in task_map.values():
		task["project_title"] = proj_title_map.get(task.project, task.project)
		if task.status in ("In Progress", "To Do"):
			wip.append(task)
		elif task.status == "Backlog":
			backlog.append(task)
		elif task.status == "Blocked":
			blocked.append(task)

	return {"wip": wip, "backlog": backlog, "blocked": blocked}


@frappe.whitelist()
def get_project_dashboard(project: str):
	"""Return aggregated stats for a project: task counts by status, milestone progress, team members."""
	tasks = frappe.get_all(
		"Hive Task",
		filters={"project": project},
		fields=["status"],
		limit=500,
	)

	status_map: dict[str, int] = {}
	total = 0
	for row in tasks:
		status_map[row.status] = status_map.get(row.status, 0) + 1
		total += 1

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
