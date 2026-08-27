import { sizeWeight } from '@/lib/status'
import type { HiveTask } from '@/types'

export interface MilestoneProgress {
	/** Weighted totals — a Large task moves the bar four times a Small one. */
	weight: number
	doneWeight: number
	tasks: number
	doneTasks: number
	percent: number
}

/** Sorts undated tasks after dated ones without a branch per comparison. */
const NO_DATE = '9999-12-31'

/** Tasks that carry a milestone, bucketed by it and sorted by due date. */
export function groupTasksByMilestone(tasks: HiveTask[]): Record<string, HiveTask[]> {
	const groups: Record<string, HiveTask[]> = {}
	for (const task of tasks) {
		if (!task.milestone) continue
		;(groups[task.milestone] ??= []).push(task)
	}
	for (const group of Object.values(groups)) {
		group.sort((a, b) => (a.due_date || NO_DATE).localeCompare(b.due_date || NO_DATE))
	}
	return groups
}

/**
 * Progress per milestone, weighted by task size. A milestone with no sized
 * tasks still reports its task counts, so the bar and the caption agree.
 */
export function milestoneProgress(tasks: HiveTask[]): Record<string, MilestoneProgress> {
	const progress: Record<string, MilestoneProgress> = {}
	for (const task of tasks) {
		if (!task.milestone) continue
		const entry = (progress[task.milestone] ??= {
			weight: 0,
			doneWeight: 0,
			tasks: 0,
			doneTasks: 0,
			percent: 0,
		})
		// An unsized task still has to count, or it can never complete the bar.
		const weight = sizeWeight(task.size) || 1
		entry.weight += weight
		entry.tasks += 1
		if (task.status === 'Done') {
			entry.doneWeight += weight
			entry.doneTasks += 1
		}
	}
	for (const entry of Object.values(progress)) {
		entry.percent = entry.weight ? Math.round((entry.doneWeight / entry.weight) * 100) : 0
	}
	return progress
}
