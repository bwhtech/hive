import type { ProjectColor } from '@/lib/project'

/**
 * DocType shapes as the frontend consumes them. Field names mirror the Frappe
 * DocType JSONs; agent-lifecycle fields are deliberately absent (see
 * plans/frappe-ui-rewrite.md §2 cut list).
 */

export const PROJECT_STATUSES = ['Open', 'Completed', 'On Hold'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

/** Selectable in filters and selects. `Blocked` is not a board column. */
export const TASK_STATUSES = ['Someday', 'Backlog', 'To Do', 'In Progress', 'Done'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number] | 'Blocked'

export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const TASK_SIZES = ['Small', 'Medium', 'Large'] as const
export type TaskSize = (typeof TASK_SIZES)[number]

export const TASK_RECURRENCE_FREQUENCIES = [
	'Daily',
	'Weekly',
	'Monthly',
	'Quarterly',
	'Yearly',
] as const
export type TaskRecurrenceFrequency = (typeof TASK_RECURRENCE_FREQUENCIES)[number]

export const MILESTONE_STATUSES = ['Upcoming', 'In Progress', 'Completed'] as const
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number]

export const FEATURE_REQUEST_STATUSES = [
	'Open',
	'Under Review',
	'Approved',
	'Rejected',
	'Converted',
] as const
export type FeatureRequestStatus = (typeof FEATURE_REQUEST_STATUSES)[number]

export const FEATURE_REQUEST_PRIORITIES = ['Nice to Have', 'Important', 'Critical'] as const
export type FeatureRequestPriority = (typeof FEATURE_REQUEST_PRIORITIES)[number]

export type Bool = 0 | 1

export interface HiveProjectLink {
	name?: string
	title: string
	url: string
}

export interface HiveProject {
	name: string
	title: string
	slug: string
	status: ProjectStatus
	/** Lucide icon name for the project avatar; empty means the default folder. */
	icon: string
	/** One of `PROJECT_COLORS`; empty derives a colour from `name`. */
	color: ProjectColor | ''
	/**
	 * Generated DiceBear avatar as a `data:image/svg+xml` URI. Set means the
	 * project shows this instead of `icon`. Untrusted: only `projectAvatarSrc`
	 * may hand it to the DOM, and only to an `<img src>`.
	 */
	avatar: string
	/** DiceBear style id the avatar came from, e.g. `notionists`. */
	avatar_style: string
	/** Seed the avatar came from; style + seed + options reproduce the SVG. */
	avatar_seed: string
	/** JSON object of hand-picked component variants, or empty. */
	avatar_options: string
	project_type: string
	client: string
	description: string
	is_private: Bool
	is_archived: Bool
	github_repo: string | null
	owner: string
	links?: HiveProjectLink[]
	members?: HiveProjectMember[]
	creation: string
	modified: string
}

export interface HiveTask {
	name: string
	title: string
	project: string
	status: TaskStatus
	priority: TaskPriority
	size: TaskSize | '' | null
	milestone: string | null
	depends_on: string | null
	is_internal: Bool
	is_archived: Bool
	description: string
	due_date: string | null
	start_date: string | null
	completed_on: string | null
	pr_link: string | null
	github_issue_url: string | null
	recurrence_frequency: TaskRecurrenceFrequency | '' | null
	recurrence_end_date: string | null
	recurring_parent: string | null
	creation: string
	modified: string
}

export interface HiveMilestone {
	name: string
	title: string
	project: string
	status: MilestoneStatus
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
	type: 'Team' | 'Client'
	client: string
	designation: string
	is_active: Bool
}

export interface HiveClient {
	name: string
	company_name: string
	is_active: Bool
}

export interface HiveProjectMember {
	member: string
	member_name: string
	role: 'Member' | 'Champion' | 'Stakeholder'
}

export interface HiveFeatureRequest {
	name: string
	title: string
	project: string
	requested_by: string
	status: FeatureRequestStatus
	priority: FeatureRequestPriority
	description: string
	converted_task: string | null
	creation: string
	modified: string
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
	is_draft: Bool
	is_archived: Bool
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
	is_archived: Bool
	creation: string
	modified: string
}

export interface HiveView {
	name: string
	label: string
	/**
	 * The same six identity fields a project carries, under the same names, so
	 * `IdentityPicker` and `IdentityAvatar` serve both. A view saved before
	 * they existed has all six empty and falls back exactly as a project does.
	 */
	icon: string
	color: ProjectColor | ''
	avatar: string
	avatar_style: string
	avatar_seed: string
	avatar_options: string
	view_type: 'list' | 'kanban' | 'calendar'
	filters_json: string
	is_public: Bool
	owner: string
	creation: string
	modified: string
}

export interface SessionUser {
	name: string
	full_name: string
	user_image?: string | null
}

/** Payload accepted by `useTaskMutations().createTask`. */
export interface CreateTaskValues {
	title: string
	project?: string
	status?: TaskStatus
	priority?: TaskPriority
	size?: TaskSize | ''
	milestone?: string | null
	description?: string
	start_date?: string | null
	due_date?: string | null
	is_internal?: Bool
	recurrence_frequency?: TaskRecurrenceFrequency | ''
	recurrence_end_date?: string | null
	/** User ids handed to `frappe.desk.form.assign_to.add` after insert. */
	assignees?: string[]
}
