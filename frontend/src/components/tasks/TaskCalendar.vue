<template>
	<div class="space-y-3">
		<div class="h-[36rem] rounded-5 border border-outline-gray-1 p-3">
			<Calendar :events="events" :config="CONFIG" :on-click="onEventClick" />
		</div>

		<section v-if="undated.length" class="rounded-5 border border-outline-gray-1 p-3">
			<p class="mb-2 text-sm text-ink-gray-5">No due date ({{ undated.length }})</p>
			<div class="flex flex-wrap gap-1.5">
				<button
					v-for="task in undated"
					:key="task.name"
					type="button"
					class="flex max-w-[16rem] items-center gap-1.5 rounded-3 border border-outline-gray-1 bg-surface-base px-2 py-1 text-xs text-ink-gray-8 hover:bg-surface-gray-2"
					:title="task.title"
					@click="emit('select', task)"
				>
					<span
						class="size-1.5 shrink-0 rounded-full"
						:class="statusDotClass(task.status)"
						aria-hidden="true"
					/>
					<span class="truncate">{{ task.title }}</span>
				</button>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, type CalendarEvent } from 'frappe-ui/experimental'
import { statusDotClass } from '@/lib/status'
import type { HiveTask, TaskStatus } from '@/types'

/**
 * Tasks laid out on their due date. Wrapped once so the parked experimental
 * `Calendar` can be swapped without touching the page.
 */
const props = defineProps<{ tasks: HiveTask[] }>()

const emit = defineEmits<{ select: [task: HiveTask] }>()

const CONFIG = {
	defaultMode: 'Month' as const,
	isEditMode: false,
	// `m` / `w` / `d` / `t` would collide with the app's own page shortcuts.
	enableShortcuts: false,
}

/** The calendar's palette has no gray or red; these are the nearest reads. */
const STATUS_COLOR: Record<TaskStatus, string> = {
	Someday: 'violet',
	Backlog: 'cyan',
	'To Do': 'amber',
	'In Progress': 'blue',
	Done: 'green',
	Blocked: 'orange',
}

const dated = computed(() => props.tasks.filter((task) => Boolean(task.due_date)))
const undated = computed(() => props.tasks.filter((task) => !task.due_date))

const events = computed<CalendarEvent[]>(() =>
	dated.value.map((task) => {
		const date = (task.due_date as string).slice(0, 10)
		return {
			id: task.name,
			title: task.title,
			participant: '',
			fromDate: date,
			toDate: date,
			fromTime: '00:00',
			toTime: '23:59',
			isFullDay: true,
			color: STATUS_COLOR[task.status] ?? 'blue',
		}
	}),
)

const byName = computed(() => {
	const map: Record<string, HiveTask> = {}
	for (const task of props.tasks) map[task.name] = task
	return map
})

/** Replaces the built-in event popover — a click opens the task panel instead. */
function onEventClick({ calendarEvent }: { calendarEvent: CalendarEvent }) {
	const task = byName.value[String(calendarEvent.id)]
	if (task) emit('select', task)
}
</script>
