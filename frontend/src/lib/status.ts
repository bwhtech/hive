import type { BadgeProps } from 'frappe-ui'
import type { ListSortDirection } from 'frappe-ui/list'
import type {
	FeatureRequestPriority,
	FeatureRequestStatus,
	MilestoneStatus,
	ProjectStatus,
	TaskPriority,
	TaskSize,
	TaskStatus,
} from '@/types'

export type BadgeTheme = NonNullable<BadgeProps['theme']>

/**
 * How task attributes render. Every badge colour, glyph and ordering in the app
 * resolves through this file so a status never picks up a raw Tailwind colour
 * utility — or an ad-hoc icon name — at the call site.
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

/**
 * Linear-style status glyphs: the circle fills in as work moves down the
 * pipeline, so a column of rows scans as progress rather than as colour.
 */
const TASK_STATUS_ICON: Record<TaskStatus, string> = {
	Someday: 'lucide-circle-dashed',
	Backlog: 'lucide-circle-dot-dashed',
	'To Do': 'lucide-circle',
	'In Progress': 'lucide-circle-dot',
	Done: 'lucide-circle-check',
	Blocked: 'lucide-circle-slash',
}

export function statusIcon(status: TaskStatus | null | undefined): string {
	return (status && TASK_STATUS_ICON[status]) || 'lucide-circle'
}

/**
 * Pipeline order, active work first. One order drives the status Select, the
 * inline status dropdown, the grouped list's sections and status sorting —
 * better than three orders that disagree.
 */
export const TASK_STATUS_ORDER: TaskStatus[] = [
	'In Progress',
	'Blocked',
	'To Do',
	'Backlog',
	'Someday',
	'Done',
]

/**
 * Status sections the grouped list collapses until asked for: finished work and
 * parked work are the two nobody scans.
 */
export const COLLAPSED_STATUSES: TaskStatus[] = ['Done', 'Someday']

const TASK_PRIORITY_THEME: Record<TaskPriority, BadgeTheme> = {
	Low: 'gray',
	Medium: 'blue',
	High: 'amber',
	Urgent: 'red',
}

export function priorityTheme(priority: TaskPriority | null | undefined): BadgeTheme {
	return (priority && TASK_PRIORITY_THEME[priority]) || 'gray'
}

/**
 * Signal-bar glyphs: more bars = higher priority. The bar count already encodes
 * severity, so colour only reinforces it — hot for the two that want attention,
 * warm for Medium, muted for Low so low-priority rows recede.
 */
const TASK_PRIORITY_ICON: Record<TaskPriority, string> = {
	Urgent: 'lucide-signal',
	High: 'lucide-signal-high',
	Medium: 'lucide-signal-medium',
	Low: 'lucide-signal-low',
}

const TASK_PRIORITY_COLOR: Record<TaskPriority, string> = {
	Urgent: 'text-ink-red-7',
	High: 'text-ink-red-7',
	Medium: 'text-ink-amber-7',
	Low: 'text-ink-gray-5',
}

export function priorityIcon(priority: TaskPriority | null | undefined): string {
	return (priority && TASK_PRIORITY_ICON[priority]) || 'lucide-signal-low'
}

export function priorityColor(priority: TaskPriority | null | undefined): string {
	return (priority && TASK_PRIORITY_COLOR[priority]) || 'text-ink-gray-5'
}

/** Most urgent first, matching the glyphs' bar count. */
export const TASK_PRIORITY_ORDER: TaskPriority[] = ['Urgent', 'High', 'Medium', 'Low']

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

/** Position in a fixed vocabulary; unknown values sort last, not first. */
function rankIn<T>(order: T[], value: T): number {
	const index = order.indexOf(value)
	return index === -1 ? order.length : index
}

export function statusRank(status: TaskStatus | null | undefined): number {
	return status ? rankIn(TASK_STATUS_ORDER, status) : TASK_STATUS_ORDER.length
}

export function priorityRank(priority: TaskPriority | null | undefined): number {
	return priority ? rankIn(TASK_PRIORITY_ORDER, priority) : TASK_PRIORITY_ORDER.length
}

/** Relative effort per size. Large ≈ 4× Small, Medium ≈ 2×. */
export const TASK_SIZE_WEIGHT: Record<TaskSize, number> = {
	Small: 1,
	Medium: 2,
	Large: 4,
}

export function sizeWeight(size: TaskSize | '' | null | undefined): number {
	return size ? (TASK_SIZE_WEIGHT[size] ?? 0) : 0
}

/* -- tasks list: grouping and sorting ------------------------------------- */

/** Attributes the tasks list can section by, in the Group menu's order. */
export const TASK_GROUP_FIELDS = ['status', 'priority', 'assignee', 'project', 'milestone'] as const
export type TaskGroupField = (typeof TASK_GROUP_FIELDS)[number]

export const TASK_GROUP_LABELS: Record<TaskGroupField, string> = {
	status: 'Status',
	priority: 'Priority',
	assignee: 'Assignee',
	project: 'Project',
	milestone: 'Milestone',
}

/** Sort keys. Grouping replaced the sortable column headers, so the toolbar's
 * Sort menu is now the only way in — and it sorts within each group. */
export const TASK_SORT_KEYS = [
	'due_date',
	'priority',
	'status',
	'title',
	'project',
	'milestone',
	'size',
	'start_date',
] as const
export type TaskSortKey = (typeof TASK_SORT_KEYS)[number]

export const TASK_SORT_LABELS: Record<TaskSortKey, string> = {
	due_date: 'Due date',
	priority: 'Priority',
	status: 'Status',
	title: 'Title',
	project: 'Project',
	milestone: 'Milestone',
	size: 'Size',
	start_date: 'Start date',
}

/** Re-exported so callers need one import for the whole sort vocabulary. */
export type TaskSortDirection = ListSortDirection
