<template>
	<div ref="root" class="relative flex min-h-0 flex-col" :style="{ height }">
		<ScrollArea
			ref="scroller"
			orientation="horizontal"
			class="min-h-0 flex-1"
			viewport-class="h-full pb-3 [&>div]:!block [&>div]:h-full"
			:style="{ maskImage: mask, WebkitMaskImage: mask }"
		>
			<div class="flex h-full items-stretch gap-3">
				<section
					v-for="status in TASK_STATUSES"
					:key="status"
					:ref="(el) => setColumn(status, el)"
					class="flex h-full min-h-0 min-w-56 flex-1 basis-72 flex-col rounded-4 border p-2 transition-colors"
					:class="
						over === status
							? 'border-outline-gray-3 bg-surface-gray-2'
							: 'border-transparent bg-surface-gray-1'
					"
					data-testid="board-column"
					:data-status="status"
				>
					<header class="flex shrink-0 items-center justify-between px-1 pb-2">
						<span class="text-sm font-medium text-ink-gray-7">{{ status }}</span>
						<Badge
							variant="subtle"
							theme="gray"
							:label="String(columns[status].length)"
						/>
					</header>

					<!-- Each column scrolls on its own, so the board never grows
					     taller than the screen and the five headers stay in line. -->
					<div class="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
						<div class="flex flex-col gap-2 pb-1">
							<TaskBoardCard
								v-for="task in columns[status]"
								:key="task.name"
								:task="task"
								:assignees="assigneesByTask[task.name]"
								:depends-on="dependency(task)"
								:draggable="!readonly"
								:selected="isSelected(task.name)"
								:dragging="isDragging(task.name)"
								@pointerdown="press($event, task)"
								@click="open($event, task)"
								@select="emit('select', task)"
							/>
						</div>

						<p
							v-if="!columns[status].length"
							class="px-1 py-6 text-center text-xs text-ink-gray-5"
						>
							{{ status === 'Done' ? 'Nothing done in the last 7 days' : 'No tasks' }}
						</p>
					</div>
				</section>
			</div>
		</ScrollArea>

		<p
			v-if="selection.size > 1 && !dragging"
			class="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-surface-gray-7 px-3 py-1 text-xs text-white shadow-lg"
		>
			{{ selection.size }} selected — drag them together, or press Esc
		</p>

		<TaskBoardDragPreview
			v-if="dragging"
			:tasks="dragging"
			:assignees="assigneesByTask[dragging[0].name] ?? []"
			:point="point"
			:offset="offset"
			:width="cardWidth"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { Badge, ScrollArea } from 'frappe-ui'
import TaskBoardCard from '@/components/tasks/TaskBoardCard.vue'
import TaskBoardDragPreview from '@/components/tasks/TaskBoardDragPreview.vue'
import { useBoardDrag } from '@/composables/useBoardDrag'
import { useFillViewport } from '@/composables/useFillViewport'
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
	}>(),
	{ assigneesByTask: () => ({}), readonly: false },
)

const emit = defineEmits<{ select: [task: HiveTask]; changed: [] }>()

/** Done is a recency window, not an archive: older cards drop off the board. */
const DONE_WINDOW_DAYS = 7
/** Sorts undated cards after dated ones without a branch per comparison. */
const NO_DATE = '9999-12-31'

const { setStatusMany } = useTaskMutations(props.list)
const { pinned } = usePinnedTasks()

const root = ref<HTMLElement | null>(null)
const { height } = useFillViewport(root)

/** `ScrollArea` hands out its viewport through a plain getter, so read it once
 *  the component is mounted rather than expecting a reactive value. */
const scroller = ref<{ viewportElement: HTMLElement | null } | null>(null)
const viewport = ref<HTMLElement | null>(null)
const { mask } = useScrollFade(viewport, 'horizontal')
onMounted(() => {
	viewport.value = scroller.value?.viewportElement ?? null
})

function emptyColumns(): Record<BoardStatus, HiveTask[]> {
	return { Someday: [], Backlog: [], 'To Do': [], 'In Progress': [], Done: [] }
}

const columns = ref<Record<BoardStatus, HiveTask[]>>(emptyColumns())

const columnEls = ref<Record<string, HTMLElement | null>>({})

function setColumn(status: BoardStatus, el: Element | ComponentPublicInstance | null) {
	columnEls.value[status] = (el as HTMLElement | null) ?? null
}

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

/** Board order, so a multi-card drag stacks in the order the columns read. */
const ordered = computed(() => TASK_STATUSES.flatMap((status) => columns.value[status]))

const {
	selection,
	dragging,
	over,
	point,
	offset,
	width: cardWidth,
	isSelected,
	isDragging,
	press,
	click,
} = useBoardDrag({
	columns: () => columnEls.value,
	scroller: () => viewport.value,
	tasks: () => ordered.value,
	disabled: () => props.readonly,
	onDrop: (picked, status) => move(picked, status as BoardStatus),
})

/** A plain click opens the card; a modifier-click only changes the selection. */
function open(event: MouseEvent, task: HiveTask) {
	if (click(event, task)) emit('select', task)
}

async function move(picked: HiveTask[], status: BoardStatus) {
	try {
		await setStatusMany(picked, status)
		emit('changed')
	} catch {
		// `setStatusMany` already rolled the failed rows back and toasted.
	} finally {
		// Nothing moved in the DOM, so the columns have to be re-derived either
		// way: from the new statuses on success, from the old ones on failure.
		rebuild()
	}
}
</script>
