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

	async function setStatus(task: HiveTask, status: TaskStatus) {
		if (task.status === status) return
		const previous = { status: task.status, completed_on: task.completed_on }
		const completed_on = status === 'Done' ? (task.completed_on ?? today()) : null

		list?.updateRow({ name: task.name, status, completed_on })
		try {
			await tasks.setValue.submit({ name: task.name, status, completed_on })
			if (status === 'Done' && previous.status !== 'Done') celebrate()
		} catch {
			list?.updateRow({ name: task.name, ...previous })
			toast.error('Could not update status')
			throw new Error('setStatus failed')
		}
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

	return { setStatus, createTask, assign, unassign, tasks }
}
