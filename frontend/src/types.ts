export interface HiveProject {
  name: string
  title: string
  status: "Open" | "Completed" | "On Hold"
  project_type: string
  client: string
  description: string
  creation: string
  modified: string
}

export interface HiveTask {
  name: string
  title: string
  project: string
  status: "Backlog" | "To Do" | "In Progress" | "Done" | "Blocked"
  priority: "Low" | "Medium" | "High" | "Urgent"
  assigned_to: string
  is_client_task: 0 | 1
  description: string
  creation: string
  modified: string
}

export interface HiveMember {
  name: string
  user: string
  member_name: string
  user_image: string
  type: "Team" | "Client"
  client: string
  designation: string
  is_active: 0 | 1
}

export interface HiveClient {
  name: string
  company_name: string
  is_active: 0 | 1
}

export interface HiveProjectMember {
  member: string
  member_name: string
  role: "Member" | "Champion" | "Stakeholder"
}

export const TASK_STATUSES = ["Backlog", "To Do", "In Progress", "Done"] as const
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const
export const PROJECT_STATUSES = ["Open", "Completed", "On Hold"] as const
