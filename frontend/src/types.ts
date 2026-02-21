export interface HiveProject {
  name: string
  title: string
  status: "Open" | "Completed" | "On Hold"
  project_type: string
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
  description: string
  creation: string
  modified: string
}

export const TASK_STATUSES = ["Backlog", "To Do", "In Progress", "Done"] as const
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const
export const PROJECT_STATUSES = ["Open", "Completed", "On Hold"] as const
