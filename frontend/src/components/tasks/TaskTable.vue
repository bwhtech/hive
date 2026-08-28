<template>
	<div class="space-y-3">
		<div class="overflow-x-auto">
			<List
				class="min-w-[64rem]"
				:columns="COLUMN_TRACKS"
				:row-height="44"
				:active="activeTask ?? undefined"
			>
				<ListHeader>
					<ListHeaderCellSort
						v-for="column in COLUMNS"
						:key="column.key"
						:direction="sortKey === column.key ? sortDirection : null"
						@click="toggleSort(column.key)"
					>
						{{ column.label }}
					</ListHeaderCellSort>
					<ListHeaderCell>Assignees</ListHeaderCell>
				</ListHeader>

				<ListRow
					v-for="task in pageRows"
					:key="task.name"
					:value="task.name"
					data-testid="task-row"
					:data-task="task.name"
					@click="emit('select', task)"
				>
					<ListCell>
						<div class="flex min-w-0 items-center gap-2">
							<span
								class="size-2 shrink-0 rounded-full"
								:class="statusDotClass(task.status)"
								aria-hidden="true"
							/>
							<span class="truncate text-base text-ink-gray-8">{{ task.title }}</span>
							<Tooltip
								v-if="task.recurrence_frequency"
								:text="`Recurs ${task.recurrence_frequency}`"
							>
								<span
									class="lucide-repeat size-3.5 shrink-0 text-ink-gray-5"
									aria-hidden="true"
								/>
							</Tooltip>
						</div>
					</ListCell>

					<ListCell>
						<span class="truncate text-base text-ink-gray-7">
							{{ projectTitle(task) }}
						</span>
					</ListCell>

					<ListCell><StatusBadge :status="task.status" /></ListCell>

					<ListCell><PriorityBadge :priority="task.priority" /></ListCell>

					<ListCell>
						<Badge
							v-if="task.size"
							:theme="sizeTheme(task.size)"
							:label="task.size"
							variant="subtle"
						/>
						<span v-else class="text-base text-ink-gray-4">—</span>
					</ListCell>

					<ListCell>
						<span class="truncate text-base text-ink-gray-7">
							{{ milestoneTitle(task) || '—' }}
						</span>
					</ListCell>

					<ListCell>
						<span class="text-base text-ink-gray-7">
							{{ formatDate(task.start_date, 'D MMM YYYY') || '—' }}
						</span>
					</ListCell>

					<ListCell>
						<span
							v-if="task.due_date"
							class="text-base"
							:class="
								isTaskOverdue(task)
									? 'font-medium text-ink-red-6'
									: 'text-ink-gray-7'
							"
						>
							{{ formatDate(task.due_date, 'D MMM YYYY') }}
						</span>
						<span v-else class="text-base text-ink-gray-4">—</span>
					</ListCell>

					<ListCell>
						<AvatarStack
							v-if="stackFor(task).length"
							:members="stackFor(task)"
							:max="3"
						/>
						<span v-else class="text-base text-ink-gray-4">—</span>
					</ListCell>
				</ListRow>
			</List>
		</div>

		<div class="flex items-center justify-between gap-3">
			<p class="text-sm text-ink-gray-5">
				{{ tasks.length }} task{{ tasks.length === 1 ? '' : 's' }}
			</p>
			<div v-if="pageCount > 1" class="flex items-center gap-2">
				<p class="text-sm text-ink-gray-5">Page {{ page + 1 }} of {{ pageCount }}</p>
				<Button label="Previous" :disabled="page === 0" @click="page -= 1" />
				<Button label="Next" :disabled="page >= pageCount - 1" @click="page += 1" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Badge, Button, Tooltip } from 'frappe-ui'
import {
	List,
	ListCell,
	ListHeader,
	ListHeaderCell,
	ListHeaderCellSort,
	ListRow,
	type ListSortDirection,
} from 'frappe-ui/list'
import AvatarStack from '@/components/common/AvatarStack.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatDate, today } from '@/lib/dates'
import { PRIORITY_ORDER, sizeTheme, sizeWeight, statusDotClass } from '@/lib/status'
import type { HiveTask, HiveTaskAssignee, TaskStatus } from '@/types'

/** Mirrors `AvatarStack`'s member shape, which a `<script setup>` cannot export. */
interface StackMember {
	user: string
	name?: string
	image?: string | null
}

const props = withDefaults(
	defineProps<{
		tasks: HiveTask[]
		projectTitles?: Record<string, string>
		milestoneTitles?: Record<string, string>
		assigneesByTask?: Record<string, HiveTaskAssignee[]>
		/** Highlights the row whose task panel is open. */
		activeTask?: string | null
	}>(),
	{ projectTitles: () => ({}), milestoneTitles: () => ({}), assigneesByTask: () => ({}) },
)

const emit = defineEmits<{ select: [task: HiveTask] }>()

const PAGE_SIZE = 20

type SortKey =
	| 'title'
	| 'project'
	| 'status'
	| 'priority'
	| 'size'
	| 'milestone'
	| 'start_date'
	| 'due_date'

const COLUMNS: { key: SortKey; label: string }[] = [
	{ key: 'title', label: 'Task' },
	{ key: 'project', label: 'Project' },
	{ key: 'status', label: 'Status' },
	{ key: 'priority', label: 'Priority' },
	{ key: 'size', label: 'Size' },
	{ key: 'milestone', label: 'Milestone' },
	{ key: 'start_date', label: 'Start' },
	{ key: 'due_date', label: 'Due' },
]

// Deterministic tracks: `auto` would size per row and break the grid.
const COLUMN_TRACKS = [
	'minmax(14rem, 2.5fr)',
	'minmax(8rem, 1.2fr)',
	'7rem',
	'6.5rem',
	'6rem',
	'minmax(8rem, 1fr)',
	'7rem',
	'7rem',
	'6rem',
]

/** Board order, so sorting by status reads as pipeline order, not alphabetical. */
const STATUS_ORDER: Record<TaskStatus, number> = {
	Someday: 0,
	Backlog: 1,
	'To Do': 2,
	'In Progress': 3,
	Done: 4,
	Blocked: 5,
}

/** Undated rows sort last in both directions' natural reading. */
const NO_DATE = '9999-12-31'

const sortKey = ref<SortKey>('due_date')
const sortDirection = ref<ListSortDirection>('asc')
const page = ref(0)

function projectTitle(task: HiveTask) {
	return props.projectTitles[task.project] ?? task.project
}

function milestoneTitle(task: HiveTask) {
	return task.milestone ? (props.milestoneTitles[task.milestone] ?? '') : ''
}

function stackFor(task: HiveTask): StackMember[] {
	const assignees = props.assigneesByTask[task.name] ?? []
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

function sortValue(task: HiveTask, key: SortKey): string | number {
	switch (key) {
		case 'title':
			return task.title.toLowerCase()
		case 'project':
			return projectTitle(task).toLowerCase()
		case 'status':
			return STATUS_ORDER[task.status] ?? 99
		case 'priority':
			return PRIORITY_ORDER[task.priority] ?? 99
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

const sorted = computed(() => {
	const key = sortKey.value
	const factor = sortDirection.value === 'desc' ? -1 : 1
	return [...props.tasks].sort((a, b) => {
		const va = sortValue(a, key)
		const vb = sortValue(b, key)
		if (va === vb) return 0
		return (va < vb ? -1 : 1) * factor
	})
})

const pageCount = computed(() => Math.max(1, Math.ceil(sorted.value.length / PAGE_SIZE)))
const pageRows = computed(() =>
	sorted.value.slice(page.value * PAGE_SIZE, page.value * PAGE_SIZE + PAGE_SIZE),
)

function toggleSort(key: SortKey) {
	if (sortKey.value === key) {
		sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
	} else {
		sortKey.value = key
		sortDirection.value = 'asc'
	}
	page.value = 0
}

// A filter change can shrink the result past the current page.
watch(pageCount, (count) => {
	if (page.value > count - 1) page.value = Math.max(0, count - 1)
})
</script>
