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
  // Agent settings (specs/v2 09 — surface 3)
  agent_enabled?: 0 | 1
  agent_engine?: "Claude Code" | "Codex" | null
  github_pat?: string | null
  agent_template_slug?: string | null
  target_app_name?: string | null
  target_app_repo?: string | null
  target_app_branch?: string | null
  skills_repo_override?: string | null
  agent_spec_prompt?: string | null
  agent_implement_prompt?: string | null
  agent_changes_prompt?: string | null
  creation: string
  modified: string
}

/** The 11-state agent lifecycle on Hive Task (specs/v2 §4.2). */
export const AGENT_STATUSES = [
  "Queued",
  "Provisioning",
  "Spec In Progress",
  "Spec Created",
  "Spec Approved",
  "Implementing",
  "PR Ready",
  "Changes Requested",
  "Merged",
  "Cancelled",
  "Failed",
] as const
export type AgentStatus = (typeof AGENT_STATUSES)[number]

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
  recurrence_frequency: "" | "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly" | null
  recurrence_end_date: string | null
  recurring_parent: string | null
  // Agent lifecycle (specs/v2 09 — surface 1). Only populated once a task is
  // handed to the Agent bot; absent/blank on ordinary tasks.
  agent_status?: AgentStatus | "" | null
  agent_dev_box?: string | null
  agent_box_slug?: string | null
  agent_control_url?: string | null
  agent_site_url?: string | null
  agent_code_url?: string | null
  agent_spec_path?: string | null
  agent_branch?: string | null
  agent_last_error?: string | null
  agent_box_torn_down?: 0 | 1
  creation: string
  modified: string
}

export const TASK_RECURRENCE_FREQUENCIES = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] as const
export type TaskRecurrenceFrequency = (typeof TASK_RECURRENCE_FREQUENCIES)[number]

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
  view_type: "list" | "kanban" | "calendar"
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
