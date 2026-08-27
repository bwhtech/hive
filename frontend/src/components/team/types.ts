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
