<template>
	<!-- Fixed column tracks need a floor to line up against; below it the list
	     scrolls sideways inside its own box rather than dragging the page. -->
	<div class="overflow-x-auto">
		<div class="min-w-[52rem] space-y-4">
			<section
				v-for="group in groups"
				:key="group.key"
				data-testid="task-group"
				:data-group="group.key"
			>
				<!-- A full-width header button, as the recipe does it: the section
				     stays quiet until hovered, when it offers the toggle in words. -->
				<button
					class="group flex w-full items-baseline rounded-sm bg-surface-sidebar px-2.5 py-2 text-base transition hover:bg-surface-gray-2"
					:aria-expanded="isOpen(group.key)"
					@click="toggleGroup(group.key)"
				>
					<span class="truncate font-medium text-ink-gray-8">{{ group.label }}</span>
					<span class="ml-2 text-sm text-ink-gray-5">{{ group.tasks.length }}</span>
					<span
						class="ml-auto hidden shrink-0 text-sm text-ink-gray-5 group-hover:inline"
					>
						{{ isOpen(group.key) ? 'Collapse' : 'Expand' }}
					</span>
				</button>

				<List
					v-if="isOpen(group.key)"
					class="mt-1"
					:columns="COLUMN_TRACKS"
					:active="activeTask ?? undefined"
				>
					<ListRow
						v-for="task in group.tasks"
						:key="task.name"
						:value="task.name"
						class="h-10"
						data-testid="task-row"
						:data-task="task.name"
						@click="emit('select', task)"
					>
						<ListCell>
							<!-- Setting the status must not open the task: stop the
							     click before it reaches the row. -->
							<span v-if="!readonly" @click.stop>
								<Tooltip text="Change status">
									<Dropdown :options="statusOptions(task)">
										<button
											class="flex rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
											:aria-label="`Status: ${task.status}`"
										>
											<span
												class="size-4 text-ink-gray-6"
												:class="statusIcon(task.status)"
												aria-hidden="true"
											/>
										</button>
									</Dropdown>
								</Tooltip>
							</span>
							<span
								v-else
								class="size-4 text-ink-gray-6"
								:class="statusIcon(task.status)"
								:aria-label="task.status"
							/>
						</ListCell>

						<ListCell>
							<span class="truncate text-base-medium text-ink-gray-8">
								{{ task.title }}
							</span>
							<Tooltip
								v-if="task.recurrence_frequency"
								:text="`Recurs ${task.recurrence_frequency}`"
							>
								<span
									class="lucide-repeat ml-1.5 size-3.5 shrink-0 text-ink-gray-5"
									aria-hidden="true"
								/>
							</Tooltip>
						</ListCell>

						<ListCell class="gap-1.5 overflow-hidden">
							<!-- The project is implied once the list is scoped to one;
							     label it only where the rows span projects. -->
							<Badge
								v-if="!hideProject"
								variant="outline"
								theme="gray"
								class="shrink-0"
								:label="projectTitle(task)"
							/>
							<Badge
								v-if="milestoneTitle(task)"
								variant="outline"
								theme="gray"
								class="shrink-0"
								:label="milestoneTitle(task)"
							>
								<template #prefix>
									<span
										class="lucide-milestone size-3 text-ink-gray-5"
										aria-hidden="true"
									/>
								</template>
							</Badge>
						</ListCell>

						<ListCell>
							<span
								v-if="task.due_date"
								class="flex items-center whitespace-nowrap text-sm"
								:class="isTaskOverdue(task) ? 'text-ink-red-6' : 'text-ink-gray-5'"
							>
								<span
									class="lucide-calendar mr-1.5 size-3.5 shrink-0"
									aria-hidden="true"
								/>
								{{ formatDate(task.due_date, 'D MMM') }}
							</span>
						</ListCell>

						<ListCell>
							<PriorityBadge :priority="task.priority" />
						</ListCell>

						<ListCell class="justify-end">
							<AvatarStack
								v-if="stackFor(task).length"
								:members="stackFor(task)"
								:max="2"
							/>
						</ListCell>
					</ListRow>
				</List>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Badge, Dropdown, Tooltip, type DropdownOptions } from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'
import AvatarStack from '@/components/common/AvatarStack.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import { useTaskMutations, type TaskListHandle } from '@/composables/useTaskMutations'
import { formatDate, today } from '@/lib/dates'
import {
	COLLAPSED_STATUSES,
	priorityRank,
	sizeWeight,
	statusIcon,
	statusRank,
	TASK_STATUS_ORDER,
	type TaskGroupField,
	type TaskSortDirection,
	type TaskSortKey,
} from '@/lib/status'
import type { HiveTask, HiveTaskAssignee, TaskPriority, TaskStatus } from '@/types'

/** Mirrors `AvatarStack`'s member shape, which a `<script setup>` cannot export. */
interface StackMember {
	user: string
	name?: string
	image?: string | null
}

/** One collapsible section. `key` identifies the bucket, `label` names it. */
interface TaskGroup {
	key: string
	label: string
	tasks: HiveTask[]
}

const props = withDefaults(
	defineProps<{
		tasks: HiveTask[]
		projectTitles?: Record<string, string>
		milestoneTitles?: Record<string, string>
		assigneesByTask?: Record<string, HiveTaskAssignee[]>
		groupBy?: TaskGroupField
		sortKey?: TaskSortKey
		sortDirection?: TaskSortDirection
		/** Highlights the row whose task panel is open. */
		activeTask?: string | null
		/** Drops the project badge where the list already speaks for one project. */
		hideProject?: boolean
		/**
		 * The list the tasks came from. Passing it makes an inline status change
		 * optimistic — `setStatus` writes the row back before the server answers.
		 */
		list?: TaskListHandle
		/** Clients read the list; they do not set status from it. */
		readonly?: boolean
	}>(),
	{
		projectTitles: () => ({}),
		milestoneTitles: () => ({}),
		assigneesByTask: () => ({}),
		groupBy: 'status',
		sortKey: 'due_date',
		sortDirection: 'asc',
		hideProject: false,
		readonly: false,
	},
)

const emit = defineEmits<{ select: [task: HiveTask] }>()

const { setStatus } = useTaskMutations(props.list)

// Every trailing track is a fixed width so the title (`minmax(0, 1fr)`) is the
// sole flexible one: it alone absorbs row-to-row differences, and the columns
// after it land at the same x on every row of every group.
const COLUMN_TRACKS = [
	'auto', // status glyph
	'minmax(0, 1fr)', // title
	'16rem', // tags (project, milestone)
	'6.5rem', // due date
	'6.5rem', // priority
	'3.5rem', // assignees (a 2-avatar stack, right-aligned)
]

/** Undated rows sort last in both directions' natural reading. */
const NO_DATE = '9999-12-31'

function projectTitle(task: HiveTask) {
	return props.projectTitles[task.project] ?? task.project
}

function milestoneTitle(task: HiveTask) {
	return task.milestone ? (props.milestoneTitles[task.milestone] ?? task.milestone) : ''
}

function assigneesOf(task: HiveTask): HiveTaskAssignee[] {
	return props.assigneesByTask[task.name] ?? []
}

function stackFor(task: HiveTask): StackMember[] {
	const assignees = assigneesOf(task)
	if (assignees.length) {
		return assignees.map((a) => ({
			user: a.member,
			name: a.member_name || a.member,
			image: a.user_image,
		}))
	}
	// Tasks created before the `_assign` migration only carry `assigned_to`.
	return task.assigned_to ? [{ user: task.assigned_to, name: task.assigned_to }] : []
}

/** A task past its due date that nobody has parked or finished. */
function isTaskOverdue(task: HiveTask) {
	if (!task.due_date) return false
	if (task.status === 'Done' || task.status === 'Someday') return false
	return task.due_date < today()
}

function statusOptions(task: HiveTask): DropdownOptions {
	return TASK_STATUS_ORDER.map((status) => ({
		label: status,
		icon: statusIcon(status),
		// `setStatus` rolls the row back and toasts on failure, then rethrows so
		// callers that await it can react; this one has nothing left to do.
		onClick: () => void setStatus(task, status).catch(() => {}),
	}))
}

// -- grouping ------------------------------------------------------------

/** A task lands in exactly one section — its primary assignee, its milestone —
 *  so the counts on the headers stay honest. */
function groupKeyOf(task: HiveTask, field: TaskGroupField): string {
	switch (field) {
		case 'priority':
			return task.priority
		case 'assignee':
			return assigneesOf(task)[0]?.member || task.assigned_to || ''
		case 'project':
			return task.project
		case 'milestone':
			return task.milestone || ''
		default:
			return task.status
	}
}

function groupLabelOf(task: HiveTask, key: string, field: TaskGroupField): string {
	switch (field) {
		case 'assignee':
			return key ? (assigneesOf(task)[0]?.member_name ?? key) : 'No assignee'
		case 'project':
			return projectTitle(task)
		case 'milestone':
			return key ? milestoneTitle(task) : 'No milestone'
		default:
			return key
	}
}

/** Fixed vocabularies carry a meaningful order; the rest sort by label, with
 *  the unset bucket ("No assignee", "No milestone") last. */
function compareGroups(a: TaskGroup, b: TaskGroup, field: TaskGroupField): number {
	if (field === 'status') {
		return statusRank(a.key as TaskStatus) - statusRank(b.key as TaskStatus)
	}
	if (field === 'priority') {
		return priorityRank(a.key as TaskPriority) - priorityRank(b.key as TaskPriority)
	}
	if (!a.key !== !b.key) return a.key ? -1 : 1
	return a.label.localeCompare(b.label)
}

const groups = computed<TaskGroup[]>(() => {
	const field = props.groupBy
	const buckets = new Map<string, TaskGroup>()
	for (const task of props.tasks) {
		const key = groupKeyOf(task, field)
		const bucket = buckets.get(key)
		if (bucket) bucket.tasks.push(task)
		else buckets.set(key, { key, label: groupLabelOf(task, key, field), tasks: [task] })
	}
	return [...buckets.values()]
		.map((group) => ({ ...group, tasks: sortTasks(group.tasks) }))
		.sort((a, b) => compareGroups(a, b, field))
})

/**
 * Explicit user toggles, keyed by field so switching the Group menu does not
 * carry one field's collapsed sections over to another's. Anything absent falls
 * back to `defaultOpen`.
 */
const openState = reactive<Record<string, boolean>>({})

function stateKey(key: string) {
	return `${props.groupBy}:${key}`
}

function defaultOpen(key: string) {
	return !(props.groupBy === 'status' && COLLAPSED_STATUSES.includes(key as TaskStatus))
}

function isOpen(key: string) {
	const id = stateKey(key)
	return id in openState ? openState[id] : defaultOpen(key)
}

function toggleGroup(key: string) {
	openState[stateKey(key)] = !isOpen(key)
}

// -- sorting -------------------------------------------------------------

function sortValue(task: HiveTask, key: TaskSortKey): string | number {
	switch (key) {
		case 'title':
			return task.title.toLowerCase()
		case 'project':
			return projectTitle(task).toLowerCase()
		case 'status':
			return statusRank(task.status)
		case 'priority':
			return priorityRank(task.priority)
		case 'size':
			return sizeWeight(task.size)
		case 'milestone':
			return milestoneTitle(task).toLowerCase()
		case 'start_date':
			return task.start_date || NO_DATE
		case 'due_date':
			return task.due_date || NO_DATE
	}
}

function sortTasks(tasks: HiveTask[]): HiveTask[] {
	const key = props.sortKey
	const factor = props.sortDirection === 'desc' ? -1 : 1
	return [...tasks].sort((a, b) => {
		const va = sortValue(a, key)
		const vb = sortValue(b, key)
		if (va === vb) return 0
		return (va < vb ? -1 : 1) * factor
	})
}
</script>
