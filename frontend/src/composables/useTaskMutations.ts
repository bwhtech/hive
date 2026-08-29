import { call, toast, useDoctype, useNewDoc } from 'frappe-ui'
import { useCelebrate } from '@/composables/useCelebrate'
import { today } from '@/lib/dates'
import type { CreateTaskValues, HiveTask, TaskStatus } from '@/types'

/** The subset of a `useList<HiveTask>` result these mutations write back into. */
export interface TaskListHandle {
	updateRow: (doc: Partial<{ name: string }> & Record<string, unknown>) => void
	reload: () => unknown
}

/**
 * Task writes shared by the board, the table and the panel. Pass the list a
 * screen is rendering so status changes land optimistically.
 */
export function useTaskMutations(list?: TaskListHandle) {
	const tasks = useDoctype<HiveTask>('Hive Task')
	const { celebrate } = useCelebrate()

	/** Writes one row optimistically. Reports success rather than toasting, so
	 *  a batch can speak once for the whole batch. */
	async function writeStatus(task: HiveTask, status: TaskStatus): Promise<boolean> {
		const previous = { status: task.status, completed_on: task.completed_on }
		const completed_on = status === 'Done' ? (task.completed_on ?? today()) : null

		list?.updateRow({ name: task.name, status, completed_on })
		try {
			await tasks.setValue.submit({ name: task.name, status, completed_on })
			return true
		} catch {
			list?.updateRow({ name: task.name, ...previous })
			return false
		}
	}

	async function setStatus(task: HiveTask, status: TaskStatus) {
		if (task.status === status) return
		const completing = status === 'Done' && task.status !== 'Done'
		if (!(await writeStatus(task, status))) {
			toast.error('Could not update status')
			throw new Error('setStatus failed')
		}
		if (completing) celebrate()
	}

	/**
	 * Move a multi-card board selection into one column. The writes run in
	 * sequence — they share a single `setValue` resource — and a row that fails
	 * rolls back on its own, so a partial move still shows what landed.
	 */
	async function setStatusMany(items: HiveTask[], status: TaskStatus) {
		const moving = items.filter((task) => task.status !== status)
		if (!moving.length) return
		if (moving.length === 1) return setStatus(moving[0], status)

		const completing = status === 'Done' && moving.some((task) => task.status !== 'Done')
		let failed = 0
		for (const task of moving) {
			if (!(await writeStatus(task, status))) failed += 1
		}

		if (failed === moving.length) {
			toast.error('Could not move these tasks')
			throw new Error('setStatusMany failed')
		}
		if (failed) toast.error(`Could not move ${failed} of ${moving.length} tasks`)
		if (completing) celebrate()
	}

	/**
	 * Insert, then assign. The two are separate try/catch blocks on purpose:
	 * `assign_to.add` throws on permission failures and bundling it would report
	 * a successful task creation as a failure.
	 */
	async function createTask(values: CreateTaskValues): Promise<HiveTask> {
		const { assignees = [], ...fields } = values
		const newDoc = useNewDoc<HiveTask>('Hive Task', {
			status: 'Backlog',
			priority: 'Medium',
			...fields,
		})

		const created = await newDoc.submit()

		if (assignees.length) {
			try {
				await assign(created.name, assignees)
			} catch {
				toast.warning('Task created, but assignment failed')
			}
		}
		return created
	}

	async function assign(name: string, users: string[]) {
		if (!users.length) return
		await call('frappe.desk.form.assign_to.add', {
			doctype: 'Hive Task',
			name,
			assign_to: JSON.stringify(users),
		})
	}

	async function unassign(name: string, user: string) {
		await call('frappe.desk.form.assign_to.remove', {
			doctype: 'Hive Task',
			name,
			assign_to: user,
		})
	}

	return { setStatus, setStatusMany, createTask, assign, unassign, tasks }
}
