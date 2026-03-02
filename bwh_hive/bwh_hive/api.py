import json
from datetime import timedelta

import frappe
from frappe.utils import getdate, nowdate


@frappe.whitelist(methods=["POST"])
def invite_member(email: str, role: str = "Hive Team"):
	"""Create a User Invitation. Email delivery is best-effort."""
	email = email.strip()
	if not email:
		frappe.throw("Email is required")

	try:
		from frappe.core.api.user_invitation import invite_by_email

		return invite_by_email(
			emails=email,
			roles=[role],
			redirect_to_path="/hive",
			app_name="bwh_hive",
		)
	except frappe.OutgoingEmailError:
		# No outgoing email account configured — create invitation without email
		frappe.flags.mute_emails = True
		try:
			frappe.get_doc(
				{
					"doctype": "User Invitation",
					"email": email,
					"roles": [{"role": role}],
					"redirect_to_path": "/hive",
					"app_name": "bwh_hive",
				}
			).insert(ignore_permissions=True)
		finally:
			frappe.flags.mute_emails = False


@frappe.whitelist(methods=["POST"])
def invite_client_member(email: str, client: str):
	"""Invite a user as a Hive Client member and pre-link them to a client org.

	Sends the standard Frappe invitation email, then stamps the User Invitation
	with the hive_client field so the on_update hook auto-assigns the client
	when the invitation is accepted.
	"""
	if not frappe.db.exists("Hive Client", client):
		frappe.throw(f"Client '{client}' does not exist")

	result = invite_member(email=email, role="Hive Client")

	# Stamp hive_client on the newly created invitation
	inv_name = frappe.db.get_value(
		"User Invitation",
		{"email": email, "status": "Pending", "app_name": "bwh_hive"},
		"name",
	)
	if inv_name:
		frappe.db.set_value("User Invitation", inv_name, "hive_client", client)

	return result


@frappe.whitelist()
def get_my_dashboard():
	"""Return aggregated personal dashboard data: my tasks, my projects, unread updates."""
	user = frappe.session.user

	# My tasks: assigned via Frappe's _assign field
	my_tasks = frappe.get_all(
		"Hive Task",
		filters={"_assign": ["like", f"%{user}%"], "status": ["not in", ["Done"]], "is_archived": 0},
		fields=["name", "title", "project", "status", "priority", "due_date", "is_internal"],
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
			filters={"name": ["in", list(all_my_project_ids)], "is_archived": 0},
			fields=["name", "title", "status", "project_type", "client", "modified"],
			order_by="modified desc",
		)

	# Unread updates count across my projects (exclude drafts)
	unread_count = 0
	if all_my_project_ids:
		updates = frappe.get_all(
			"Hive Project Update",
			filters={"project": ["in", list(all_my_project_ids)], "is_draft": 0, "is_archived": 0},
			fields=["name", "_seen"],
			limit=200,
		)
		for upd in updates:
			seen = upd.get("_seen") or "[]"
			if user not in seen:
				unread_count += 1

	# Recent updates from my projects (exclude drafts)
	recent_updates = []
	if all_my_project_ids:
		recent_updates = frappe.get_all(
			"Hive Project Update",
			filters={"project": ["in", list(all_my_project_ids)], "is_draft": 0, "is_archived": 0},
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
def get_my_overdue_tasks():
	"""Return tasks assigned to the current user that are past their due date and not done."""
	user = frappe.session.user
	today = nowdate()

	tasks = frappe.get_all(
		"Hive Task",
		filters=[
			["_assign", "like", f"%{user}%"],
			["due_date", "is", "set"],
			["due_date", "<", today],
			["status", "not in", ["Done"]],
			["is_archived", "=", 0],
		],
		fields=["name", "title", "project", "status", "priority", "due_date"],
		order_by="due_date asc",
		limit=50,
	)

	# Enrich with project titles
	_enrich_tasks_with_project_titles(tasks)

	return tasks


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
			filters={"posted_by": member.user, "is_draft": 0, "is_archived": 0},
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
	"""Return assignees for tasks grouped by task name. Reads from Frappe's standard _assign field."""
	filters: dict = {"is_archived": 0, "_assign": ["is", "set"]}
	if project:
		filters["project"] = project

	tasks = frappe.get_all(
		"Hive Task",
		filters=filters,
		fields=["name", "_assign"],
		limit=500,
	)

	# Resolve names from Hive Member
	members = frappe.get_all(
		"Hive Member",
		fields=["name", "member_name", "user_image"],
	)
	member_map = {m.name: m for m in members}

	result: dict[str, list[dict]] = {}
	for task in tasks:
		assignee_list = json.loads(task._assign or "[]")
		if not assignee_list:
			continue
		for user in assignee_list:
			member_info = member_map.get(user)
			result.setdefault(task.name, []).append(
				{
					"member": user,
					"member_name": member_info.member_name if member_info else user,
					"user_image": member_info.user_image if member_info else None,
				}
			)

	return result


@frappe.whitelist()
def get_my_project_memberships():
	"""Return project names where the current user is a member.

	The REST API strips parent/custom fields from child-table docs,
	so we use frappe.get_all on the server side instead.
	"""
	rows = frappe.get_all(
		"Hive Project Member",
		filters={"member": frappe.session.user},
		fields=["parent"],
	)
	return [r.parent for r in rows]


@frappe.whitelist(methods=["GET"])
def search(query: str, project: str | None = None, limit: int = 10):
	"""Search projects and tasks using FTS with LIKE fallback."""
	query = (query or "").strip()
	if not query:
		return {"projects": [], "tasks": []}

	limit = min(int(limit), 20)

	try:
		return _search_fts(query, project, limit)
	except Exception:
		return _search_like(query, project, limit)


def _search_fts(query: str, project: str | None, limit: int) -> dict:
	"""Full-text search using Frappe SQLiteSearch."""
	from bwh_hive.search import HiveSearch

	fts = HiveSearch()
	filters = {}
	if project:
		filters["project"] = [project]

	result = fts.search(query, filters=filters)
	fts_results = result.get("results", [])

	projects = []
	tasks = []

	for r in fts_results:
		if r.get("doctype") == "Hive Project" and len(projects) < limit:
			projects.append(
				{
					"name": r["name"],
					"title": _strip_marks(r.get("title", "")),
					"status": r.get("status", ""),
				}
			)
		elif r.get("doctype") == "Hive Task" and len(tasks) < limit:
			tasks.append(
				{
					"name": r["name"],
					"title": _strip_marks(r.get("title", "")),
					"project": r.get("project", ""),
					"status": r.get("status", ""),
					"priority": r.get("priority", ""),
				}
			)

	# Enrich tasks with project titles
	_enrich_tasks_with_project_titles(tasks)

	return {"projects": projects, "tasks": tasks}


def _search_like(query: str, project: str | None, limit: int) -> dict:
	"""Fallback LIKE-based search."""
	like = f"%{query}%"

	projects = frappe.get_all(
		"Hive Project",
		filters={"title": ["like", like], "is_archived": 0},
		fields=["name", "title", "status"],
		order_by="modified desc",
		limit=limit,
	)

	task_filters: dict = {"title": ["like", like], "is_archived": 0}
	if project:
		task_filters["project"] = project

	tasks = frappe.get_all(
		"Hive Task",
		filters=task_filters,
		fields=["name", "title", "project", "status", "priority"],
		order_by="modified desc",
		limit=limit,
	)

	_enrich_tasks_with_project_titles(tasks)

	return {"projects": projects, "tasks": tasks}


def _enrich_tasks_with_project_titles(tasks: list) -> None:
	task_project_ids = list({t["project"] for t in tasks if t.get("project")})
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
			t["project_title"] = proj_map.get(t.get("project"), t.get("project"))


def _strip_marks(text: str) -> str:
	"""Strip <mark> tags from FTS highlighted results."""
	return text.replace("<mark>", "").replace("</mark>", "")


@frappe.whitelist()
def get_team_dashboard():
	"""Return team members with WIP/Backlog task counts and 7-day workload trend."""
	members = frappe.get_all(
		"Hive Member",
		filters={"type": "Team", "is_active": 1},
		fields=["name", "user", "member_name", "user_image", "designation"],
		order_by="member_name asc",
	)

	# Fetch user_image from User docs (Hive Member's fetch_from only runs on save)
	user_emails = [m.user for m in members]
	user_images = {}
	if user_emails:
		user_images = {
			u.name: u.user_image
			for u in frappe.get_all(
				"User",
				filters={"name": ["in", user_emails]},
				fields=["name", "user_image"],
			)
		}

	# Get all non-Done tasks with _assign field
	tasks = frappe.get_all(
		"Hive Task",
		filters={"status": ["not in", ["Done"]], "is_archived": 0},
		fields=["name", "status", "_assign"],
		limit=500,
	)

	# Build task status map and user -> task set mapping from _assign
	task_status = {t.name: t.status for t in tasks}
	user_tasks: dict[str, set] = {}

	for task in tasks:
		for user in json.loads(task._assign or "[]"):
			user_tasks.setdefault(user, set()).add(task.name)

	# --- Trend data: completed vs created in last 7 days ---
	cutoff = getdate(nowdate()) - timedelta(days=7)

	# Tasks completed (moved to Done) in last 7 days
	done_tasks = frappe.get_all(
		"Hive Task",
		filters={"status": "Done", "modified": [">=", cutoff], "is_archived": 0},
		fields=["name", "_assign"],
		limit=500,
	)

	user_completed: dict[str, set] = {}
	for t in done_tasks:
		for user in json.loads(t._assign or "[]"):
			user_completed.setdefault(user, set()).add(t.name)

	# Tasks created in last 7 days (any status)
	new_tasks = frappe.get_all(
		"Hive Task",
		filters={"creation": [">=", cutoff], "is_archived": 0},
		fields=["name", "_assign"],
		limit=500,
	)

	user_created: dict[str, set] = {}
	for t in new_tasks:
		for user in json.loads(t._assign or "[]"):
			user_created.setdefault(user, set()).add(t.name)

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

		completed_7d = len(user_completed.get(member.user, set()))
		created_7d = len(user_created.get(member.user, set()))
		net = created_7d - completed_7d
		if net > 0:
			trend = "increasing"
		elif net < 0:
			trend = "decreasing"
		else:
			trend = "stable"

		result.append(
			{
				"user": member.user,
				"member_name": member.member_name,
				"user_image": user_images.get(member.user) or member.user_image,
				"designation": member.designation,
				"wip_count": wip,
				"backlog_count": backlog,
				"blocked_count": blocked,
				"trend": trend,
				"completed_7d": completed_7d,
				"created_7d": created_7d,
			}
		)

	return result


@frappe.whitelist()
def get_team_stats(period: str = "week"):
	"""Return team completion chart data and per-member overdue/completed tasks.

	Args:
		period: "week" (last 7 days) or "month" (last 30 days)
	"""
	days = 7 if period == "week" else 30
	cutoff = getdate(nowdate()) - timedelta(days=days)
	today = nowdate()

	members = frappe.get_all(
		"Hive Member",
		filters={"type": "Team", "is_active": 1},
		fields=["name", "user", "member_name", "user_image", "designation"],
		order_by="member_name asc",
	)

	# Fetch fresh user images
	user_emails = [m.user for m in members]
	user_images = {}
	if user_emails:
		user_images = {
			u.name: u.user_image
			for u in frappe.get_all(
				"User",
				filters={"name": ["in", user_emails]},
				fields=["name", "user_image"],
			)
		}

	# Completed tasks in the period
	completed_tasks = frappe.get_all(
		"Hive Task",
		filters={
			"status": "Done",
			"completed_on": [">=", cutoff],
			"is_archived": 0,
		},
		fields=["name", "title", "project", "priority", "completed_on", "_assign"],
		order_by="completed_on desc",
		limit=500,
	)
	_enrich_tasks_with_project_titles(completed_tasks)

	# Overdue tasks (not done, past due date)
	overdue_tasks = frappe.get_all(
		"Hive Task",
		filters={
			"due_date": ["<", today],
			"status": ["not in", ["Done"]],
			"is_archived": 0,
		},
		fields=["name", "title", "project", "priority", "due_date", "status", "_assign"],
		order_by="due_date asc",
		limit=500,
	)
	_enrich_tasks_with_project_titles(overdue_tasks)

	# Map tasks to users
	user_completed: dict[str, list] = {}
	for t in completed_tasks:
		for user in json.loads(t._assign or "[]"):
			task_copy = {k: v for k, v in t.items() if k != "_assign"}
			user_completed.setdefault(user, []).append(task_copy)

	user_overdue: dict[str, list] = {}
	for t in overdue_tasks:
		for user in json.loads(t._assign or "[]"):
			task_copy = {k: v for k, v in t.items() if k != "_assign"}
			user_overdue.setdefault(user, []).append(task_copy)

	# Build time series: completed tasks per day
	today_date = getdate(nowdate())
	date_counts: dict[str, int] = {}
	for d in range(days):
		date_counts[str(today_date - timedelta(days=d))] = 0
	for t in completed_tasks:
		dt = str(getdate(t.completed_on))
		if dt in date_counts:
			date_counts[dt] += 1
	time_series = [{"date": d, "completed": c} for d, c in sorted(date_counts.items())]

	# Build member details
	member_details = []
	for m in members:
		image = user_images.get(m.user) or m.user_image
		completed = user_completed.get(m.user, [])
		overdue = user_overdue.get(m.user, [])

		member_details.append(
			{
				"user": m.user,
				"member_name": m.member_name,
				"user_image": image,
				"designation": m.designation,
				"completed_tasks": completed,
				"overdue_tasks": overdue,
			}
		)

	return {
		"time_series": time_series,
		"members": member_details,
	}


@frappe.whitelist()
def get_member_tasks(user: str):
	"""Return tasks assigned to a specific member, grouped by category (wip, backlog, blocked)."""
	all_tasks = frappe.get_all(
		"Hive Task",
		filters={
			"_assign": ["like", f"%{user}%"],
			"status": ["not in", ["Done"]],
			"is_archived": 0,
		},
		fields=["name", "title", "project", "status", "priority", "due_date"],
		limit=100,
	)
	task_map = {t.name: t for t in all_tasks}

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
def mark_updates_seen(project: str):
	"""Mark all unread project updates as seen by the current user."""
	import json

	user = frappe.session.user
	updates = frappe.get_all(
		"Hive Project Update",
		filters={"project": project, "is_draft": 0, "is_archived": 0},
		fields=["name", "_seen"],
	)

	for upd in updates:
		seen = json.loads(upd.get("_seen") or "[]")
		if user not in seen:
			seen.append(user)
			frappe.db.set_value(
				"Hive Project Update", upd.name, "_seen", json.dumps(seen), update_modified=False
			)


@frappe.whitelist()
def publish_update(update_name: str):
	"""Publish a draft update (set is_draft = 0). Only the author can publish."""
	doc = frappe.get_doc("Hive Project Update", update_name)
	if doc.posted_by != frappe.session.user:
		frappe.throw("Only the author can publish this update")
	doc.is_draft = 0
	doc.save()
	return {"name": doc.name}


@frappe.whitelist()
def get_project_dashboard(project: str):
	"""Return aggregated stats for a project: task counts by status, milestone progress, team members."""
	tasks = frappe.get_all(
		"Hive Task",
		filters={"project": project, "is_archived": 0},
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


@frappe.whitelist()
def get_project_activity(project: str, limit: int = 100):
	"""Return activity feed for a project using Version Log and creation events."""
	if not frappe.db.exists("Hive Project", project):
		frappe.throw("Project not found")

	limit = min(int(limit), 200)
	activities: list[dict] = []

	# --- 1. Version logs for the project itself ---
	project_versions = frappe.get_all(
		"Version",
		filters={"ref_doctype": "Hive Project", "docname": project},
		fields=["name", "data", "owner", "creation"],
		order_by="creation desc",
		limit=limit,
	)
	project_doc = frappe.get_doc("Hive Project", project)

	for v in project_versions:
		data = json.loads(v.data)
		changes = data.get("changed", [])
		for change in changes:
			if len(change) >= 3:
				activities.append(
					{
						"type": "project_changed",
						"doctype": "Hive Project",
						"docname": project,
						"label": project_doc.title,
						"field": change[0],
						"old_value": change[1],
						"new_value": change[2],
						"user": v.owner,
						"datetime": str(v.creation),
					}
				)

	# --- 2. Get tasks belonging to this project ---
	project_tasks = frappe.get_all(
		"Hive Task",
		filters={"project": project},
		fields=["name", "title", "creation", "owner"],
		limit=500,
	)
	task_map = {t.name: t for t in project_tasks}
	task_names = list(task_map.keys())

	# Task creation events
	for t in project_tasks:
		activities.append(
			{
				"type": "task_created",
				"doctype": "Hive Task",
				"docname": t.name,
				"label": t.title,
				"user": t.owner,
				"datetime": str(t.creation),
			}
		)

	# Task version logs (field changes)
	if task_names:
		task_versions = frappe.get_all(
			"Version",
			filters={"ref_doctype": "Hive Task", "docname": ["in", task_names]},
			fields=["name", "docname", "data", "owner", "creation"],
			order_by="creation desc",
			limit=limit,
		)
		for v in task_versions:
			data = json.loads(v.data)
			task_info = task_map.get(v.docname)
			task_title = task_info.title if task_info else v.docname

			for change in data.get("changed", []):
				if len(change) >= 3:
					field = change[0]
					# Only surface interesting fields
					if field in (
						"status",
						"priority",
						"title",
						"milestone",
						"assigned_to",
						"due_date",
						"start_date",
						"completed_on",
						"size",
						"uat_status",
					):
						activities.append(
							{
								"type": "task_changed",
								"doctype": "Hive Task",
								"docname": v.docname,
								"label": task_title,
								"field": field,
								"old_value": change[1],
								"new_value": change[2],
								"user": v.owner,
								"datetime": str(v.creation),
							}
						)

	# --- 3. Milestones ---
	project_milestones = frappe.get_all(
		"Hive Milestone",
		filters={"project": project},
		fields=["name", "title", "creation", "owner"],
		limit=100,
	)
	milestone_map = {m.name: m for m in project_milestones}
	milestone_names = list(milestone_map.keys())

	# Milestone creation events
	for m in project_milestones:
		activities.append(
			{
				"type": "milestone_created",
				"doctype": "Hive Milestone",
				"docname": m.name,
				"label": m.title,
				"user": m.owner,
				"datetime": str(m.creation),
			}
		)

	# Milestone version logs
	if milestone_names:
		ms_versions = frappe.get_all(
			"Version",
			filters={"ref_doctype": "Hive Milestone", "docname": ["in", milestone_names]},
			fields=["name", "docname", "data", "owner", "creation"],
			order_by="creation desc",
			limit=limit,
		)
		for v in ms_versions:
			data = json.loads(v.data)
			ms_info = milestone_map.get(v.docname)
			ms_title = ms_info.title if ms_info else v.docname

			for change in data.get("changed", []):
				if len(change) >= 3:
					activities.append(
						{
							"type": "milestone_changed",
							"doctype": "Hive Milestone",
							"docname": v.docname,
							"label": ms_title,
							"field": change[0],
							"old_value": change[1],
							"new_value": change[2],
							"user": v.owner,
							"datetime": str(v.creation),
						}
					)

	# --- 4. Sort by datetime descending ---
	activities.sort(key=lambda a: a["datetime"], reverse=True)

	# --- 5. Resolve user names ---
	user_emails = list({a["user"] for a in activities})
	user_name_map = {}
	user_image_map = {}
	if user_emails:
		users = frappe.get_all(
			"User",
			filters={"name": ["in", user_emails]},
			fields=["name", "full_name", "user_image"],
		)
		for u in users:
			user_name_map[u.name] = u.full_name or u.name
			user_image_map[u.name] = u.user_image

	for a in activities:
		a["user_name"] = user_name_map.get(a["user"], a["user"])
		a["user_image"] = user_image_map.get(a["user"])

	return activities[:limit]
