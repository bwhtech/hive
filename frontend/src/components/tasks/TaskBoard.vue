<template>
	<ScrollArea
		ref="scroller"
		orientation="horizontal"
		viewport-class="pb-3"
		:style="{ maskImage: mask, WebkitMaskImage: mask }"
	>
		<div class="flex items-start gap-3">
			<section
				v-for="status in TASK_STATUSES"
				:key="status"
				class="flex min-w-56 flex-1 basis-72 flex-col rounded-4 bg-surface-gray-1 p-2"
				data-testid="board-column"
				:data-status="status"
			>
				<header class="flex items-center justify-between px-1 pb-2">
					<span class="text-sm font-medium text-ink-gray-7">{{ status }}</span>
					<Badge variant="subtle" theme="gray" :label="String(columns[status].length)" />
				</header>

				<draggable
					v-model="columns[status]"
					v-bind="dragOptions"
					item-key="name"
					class="flex min-h-16 flex-col gap-2"
					@change="onChange($event, status)"
				>
					<template #item="{ element }: { element: HiveTask }">
						<TaskBoardCard
							:task="element"
							:assignees="assigneesByTask[element.name]"
							:depends-on="dependency(element)"
							:show-uat="showUat"
							:draggable="!readonly"
							@select="emit('select', element)"
						/>
					</template>
				</draggable>

				<p
					v-if="!columns[status].length"
					class="px-1 py-6 text-center text-xs text-ink-gray-5"
				>
					{{ status === 'Done' ? 'Nothing done in the last 7 days' : 'No tasks' }}
				</p>
			</section>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { Badge, ScrollArea } from 'frappe-ui'
import TaskBoardCard from '@/components/tasks/TaskBoardCard.vue'
import { usePinnedTasks } from '@/composables/usePinnedTasks'
import { useScrollFade } from '@/composables/useScrollFade'
import { useTaskMutations, type TaskListHandle } from '@/composables/useTaskMutations'
import { dayjs, DATE_FORMAT } from '@/lib/dates'
import { TASK_STATUSES, type HiveTask, type HiveTaskAssignee } from '@/types'

/** The five board columns. `Blocked` is a status, not a column. */
type BoardStatus = (typeof TASK_STATUSES)[number]

const props = withDefaults(
	defineProps<{
		tasks: HiveTask[]
		assigneesByTask?: Record<string, HiveTaskAssignee[]>
		/**
		 * The list the tasks came from. Passing it makes a drop optimistic —
		 * `setStatus` writes the row back before the server answers.
		 */
		list?: TaskListHandle
		/** Clients see the board but cannot move cards. */
		readonly?: boolean
		showUat?: boolean
	}>(),
	{ assigneesByTask: () => ({}), readonly: false, showUat: true },
)

const emit = defineEmits<{ select: [task: HiveTask]; changed: [] }>()

/** Done is a recency window, not an archive: older cards drop off the board. */
const DONE_WINDOW_DAYS = 7
/** Sorts undated cards after dated ones without a branch per comparison. */
const NO_DATE = '9999-12-31'

const { setStatus } = useTaskMutations(props.list)
const { pinned } = usePinnedTasks()

/** `ScrollArea` hands out its viewport through a plain getter, so read it once
 *  the component is mounted rather than expecting a reactive value. */
const scroller = ref<{ viewportElement: HTMLElement | null } | null>(null)
const viewport = ref<HTMLElement | null>(null)
const { mask } = useScrollFade(viewport, 'horizontal')
onMounted(() => {
	viewport.value = scroller.value?.viewportElement ?? null
})

const dragOptions = computed(() => ({
	group: 'tasks',
	animation: 150,
	disabled: props.readonly,
	ghostClass: 'opacity-40',
}))

function emptyColumns(): Record<BoardStatus, HiveTask[]> {
	return { Someday: [], Backlog: [], 'To Do': [], 'In Progress': [], Done: [] }
}

const columns = ref<Record<BoardStatus, HiveTask[]>>(emptyColumns())

const taskMap = computed(() => {
	const map: Record<string, HiveTask> = {}
	for (const task of props.tasks) map[task.name] = task
	return map
})

function dependency(task: HiveTask): HiveTask | null {
	return task.depends_on ? (taskMap.value[task.depends_on] ?? null) : null
}

function rebuild() {
	const next = emptyColumns()
	const cutoff = dayjs().subtract(DONE_WINDOW_DAYS, 'day').format(DATE_FORMAT)
	for (const task of props.tasks) {
		const bucket = next[task.status as BoardStatus]
		if (!bucket) continue
		if (task.status === 'Done' && (!task.completed_on || task.completed_on < cutoff)) continue
		bucket.push(task)
	}
	const pins = new Set(pinned.value)
	for (const status of TASK_STATUSES) {
		next[status].sort((a, b) => {
			const pa = pins.has(a.name) ? 0 : 1
			const pb = pins.has(b.name) ? 0 : 1
			if (pa !== pb) return pa - pb
			return (a.due_date || NO_DATE).localeCompare(b.due_date || NO_DATE)
		})
	}
	columns.value = next
}

watch([() => props.tasks, pinned], rebuild, { immediate: true })

interface DragChange {
	added?: { element: HiveTask; newIndex: number }
}

async function onChange(event: DragChange, status: BoardStatus) {
	const task = event?.added?.element
	if (!task || task.status === status) return
	try {
		await setStatus(task, status)
		emit('changed')
	} catch {
		// `setStatus` already rolled the row back and toasted; re-derive the
		// columns so the card returns to where it came from.
		rebuild()
	}
}
</script>
