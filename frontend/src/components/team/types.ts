import type { TaskPriority, TaskStatus } from '@/types'

/** `get_team_dashboard` row: one team member with their workload counts. */
export interface TeamMemberStats {
	user: string
	member_name: string
	user_image: string
	designation: string
	wip_count: number
	backlog_count: number
	blocked_count: number
	trend: 'increasing' | 'decreasing' | 'stable'
	completed_7d: number
	created_7d: number
}

/** `get_member_tasks` row. */
export interface MemberTask {
	name: string
	title: string
	project: string
	project_title: string
	status: TaskStatus
	priority: TaskPriority
	due_date: string | null
}

/** A task as `get_team_stats` returns it, enriched with its project title. */
export interface TeamStatsTask {
	name: string
	title: string
	project: string
	project_title: string
	project_slug: string
	priority: TaskPriority
	status?: TaskStatus
	due_date?: string | null
	completed_on?: string | null
}

/** `get_team_stats` row: one member's overdue and just-completed tasks. */
export interface TeamStatsMember {
	user: string
	member_name: string
	user_image: string
	designation: string
	completed_tasks: TeamStatsTask[]
	overdue_tasks: TeamStatsTask[]
}

/**
 * What a member card renders: the workload counts from `get_team_dashboard`,
 * the period's tasks from `get_team_stats` and the staleness flag, merged on
 * the page so one component can show the whole picture for a member.
 */
export interface TeamMemberView extends TeamMemberStats {
	overdue_tasks: TeamStatsTask[]
	completed_tasks: TeamStatsTask[]
	/** No project update posted inside the stale window. */
	stale: boolean
}
