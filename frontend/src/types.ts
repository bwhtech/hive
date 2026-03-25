export interface HiveProject {
  name: string
  title: string
  slug: string
  status: "Open" | "Completed" | "On Hold"
  project_type: string
  client: string
  description: string
  is_private: 0 | 1
  is_archived: 0 | 1
  github_repo: string | null
  owner: string
  links?: HiveProjectLink[]
  creation: string
  modified: string
}

export interface HiveTask {
  name: string
  title: string
  project: string
  status: "Someday" | "Backlog" | "To Do" | "In Progress" | "Done" | "Blocked"
  priority: "Low" | "Medium" | "High" | "Urgent"
  size: "Small" | "Medium" | "Large" | "" | null
  milestone: string | null
  depends_on: string | null
  assigned_to: string
  is_internal: 0 | 1
  is_archived: 0 | 1
  description: string
  due_date: string | null
  start_date: string | null
  completed_on: string | null
  pr_link: string | null
  github_issue_url: string | null
  uat_status: "Pending" | "Approved" | "Rejected"
  uat_approved_by: string | null
  uat_date: string | null
  creation: string
  modified: string
}

export interface HiveMilestone {
  name: string
  title: string
  project: string
  status: "Upcoming" | "In Progress" | "Completed"
  target_date: string | null
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

export interface HiveFeatureRequest {
  name: string
  title: string
  project: string
  requested_by: string
  status: "Open" | "Under Review" | "Approved" | "Rejected" | "Converted"
  priority: "Nice to Have" | "Important" | "Critical"
  description: string
  converted_task: string | null
  creation: string
  modified: string
}

export interface HiveProjectLink {
  name?: string
  title: string
  url: string
}

export interface HiveTaskAssignee {
  member: string
  member_name: string
  user_image: string
}

export interface HiveUpdateReaction {
  user: string
  emoji: string
}

export interface HiveProjectUpdate {
  name: string
  project: string
  posted_by: string
  content: string
  is_draft: 0 | 1
  is_archived: 0 | 1
  reactions: HiveUpdateReaction[]
  _seen: string
  creation: string
  modified: string
}

export interface HiveTaskComment {
  name: string
  task: string
  posted_by: string
  content: string
  is_archived: 0 | 1
  creation: string
  modified: string
}

export const TASK_STATUSES = ["Someday", "Backlog", "To Do", "In Progress", "Done"] as const
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const
export const TASK_SIZES = ["Small", "Medium", "Large"] as const

/** Numeric weight for each size (Large ≈ 4× Small, Medium ≈ 2×) */
export const TASK_SIZE_WEIGHT: Record<string, number> = {
  Small: 1,
  Medium: 2,
  Large: 4,
} as const
export interface HiveView {
  name: string
  label: string
  emoji: string
  view_type: "list" | "kanban"
  filters_json: string
  is_public: 0 | 1
  owner: string
  creation: string
  modified: string
}

export const PROJECT_STATUSES = ["Open", "Completed", "On Hold"] as const
export const MILESTONE_STATUSES = ["Upcoming", "In Progress", "Completed"] as const
export const FEATURE_REQUEST_STATUSES = ["Open", "Under Review", "Approved", "Rejected", "Converted"] as const
export const FEATURE_REQUEST_PRIORITIES = ["Nice to Have", "Important", "Critical"] as const
