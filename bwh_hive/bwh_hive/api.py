import frappe


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
