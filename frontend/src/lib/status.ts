import type { BadgeProps } from 'frappe-ui'
import type {
	FeatureRequestPriority,
	FeatureRequestStatus,
	MilestoneStatus,
	ProjectStatus,
	TaskPriority,
	TaskSize,
	TaskStatus,
	UATStatus,
} from '@/types'

export type BadgeTheme = NonNullable<BadgeProps['theme']>

/**
 * Every badge colour in the app resolves through this file so a status never
 * picks up a raw Tailwind colour utility at the call site.
 */

const TASK_STATUS_THEME: Record<TaskStatus, BadgeTheme> = {
	Someday: 'violet',
	Backlog: 'gray',
	'To Do': 'amber',
	'In Progress': 'blue',
	Done: 'green',
	Blocked: 'red',
}

export function statusTheme(status: TaskStatus | null | undefined): BadgeTheme {
	return (status && TASK_STATUS_THEME[status]) || 'gray'
}

/** Dot colour for compact rows, where a full badge is too loud. */
const TASK_STATUS_DOT: Record<TaskStatus, string> = {
	Someday: 'bg-surface-violet-3',
	Backlog: 'bg-surface-gray-4',
	'To Do': 'bg-surface-amber-3',
	'In Progress': 'bg-surface-blue-3',
	Done: 'bg-surface-green-3',
	Blocked: 'bg-surface-red-3',
}

export function statusDotClass(status: TaskStatus | null | undefined): string {
	return (status && TASK_STATUS_DOT[status]) || 'bg-surface-gray-4'
}

const TASK_PRIORITY_THEME: Record<TaskPriority, BadgeTheme> = {
	Low: 'gray',
	Medium: 'blue',
	High: 'amber',
	Urgent: 'red',
}

export function priorityTheme(priority: TaskPriority | null | undefined): BadgeTheme {
	return (priority && TASK_PRIORITY_THEME[priority]) || 'gray'
}

const TASK_SIZE_THEME: Record<TaskSize, BadgeTheme> = {
	Small: 'gray',
	Medium: 'blue',
	Large: 'violet',
}

export function sizeTheme(size: TaskSize | '' | null | undefined): BadgeTheme {
	return (size && TASK_SIZE_THEME[size]) || 'gray'
}

const PROJECT_STATUS_THEME: Record<ProjectStatus, BadgeTheme> = {
	Open: 'green',
	Completed: 'blue',
	'On Hold': 'amber',
}

export function projectStatusTheme(status: ProjectStatus | null | undefined): BadgeTheme {
	return (status && PROJECT_STATUS_THEME[status]) || 'gray'
}

const MILESTONE_STATUS_THEME: Record<MilestoneStatus, BadgeTheme> = {
	Upcoming: 'gray',
	'In Progress': 'blue',
	Completed: 'green',
}

export function milestoneStatusTheme(status: MilestoneStatus | null | undefined): BadgeTheme {
	return (status && MILESTONE_STATUS_THEME[status]) || 'gray'
}

const FEATURE_REQUEST_STATUS_THEME: Record<FeatureRequestStatus, BadgeTheme> = {
	Open: 'gray',
	'Under Review': 'amber',
	Approved: 'green',
	Rejected: 'red',
	Converted: 'blue',
}

export function featureRequestStatusTheme(
	status: FeatureRequestStatus | null | undefined,
): BadgeTheme {
	return (status && FEATURE_REQUEST_STATUS_THEME[status]) || 'gray'
}

const FEATURE_REQUEST_PRIORITY_THEME: Record<FeatureRequestPriority, BadgeTheme> = {
	'Nice to Have': 'gray',
	Important: 'blue',
	Critical: 'red',
}

export function featureRequestPriorityTheme(
	priority: FeatureRequestPriority | null | undefined,
): BadgeTheme {
	return (priority && FEATURE_REQUEST_PRIORITY_THEME[priority]) || 'gray'
}

const UAT_STATUS_THEME: Record<UATStatus, BadgeTheme> = {
	Pending: 'amber',
	Approved: 'green',
	Rejected: 'red',
}

export function uatStatusTheme(status: UATStatus | null | undefined): BadgeTheme {
	return (status && UAT_STATUS_THEME[status]) || 'gray'
}

/** Sort order for priority columns — lower sorts first. */
export const PRIORITY_ORDER: Record<TaskPriority, number> = {
	Urgent: 0,
	High: 1,
	Medium: 2,
	Low: 3,
}

/** Relative effort per size. Large ≈ 4× Small, Medium ≈ 2×. */
export const TASK_SIZE_WEIGHT: Record<TaskSize, number> = {
	Small: 1,
	Medium: 2,
	Large: 4,
}

export function sizeWeight(size: TaskSize | '' | null | undefined): number {
	return size ? TASK_SIZE_WEIGHT[size] ?? 0 : 0
}
