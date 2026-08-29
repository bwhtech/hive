<template>
	<div
		class="group/card rounded-4 border bg-surface-elevation-1 p-3 transition-colors"
		:class="[
			selected
				? 'border-outline-gray-4 ring-2 ring-outline-gray-3'
				: pinned
					? 'border-outline-gray-3'
					: 'border-outline-gray-1',
			dragging ? 'opacity-40' : '',
			preview
				? 'shadow-2xl'
				: draggable
					? 'cursor-grab active:cursor-grabbing'
					: 'cursor-pointer',
		]"
		:role="preview ? undefined : 'button'"
		:tabindex="preview ? undefined : 0"
		draggable="false"
		data-testid="task-card"
		:data-task="task.name"
		:data-selected="selected ? 'true' : undefined"
		@keydown.enter.prevent="emit('select', task)"
		@keydown.space.prevent="emit('select', task)"
	>
		<div class="flex items-start gap-1">
			<p class="min-w-0 flex-1 text-sm font-medium leading-snug text-ink-gray-8">
				{{ task.title }}
			</p>
			<button
				type="button"
				class="shrink-0 rounded-3 p-0.5 text-ink-gray-5 hover:text-ink-gray-8"
				:class="pinned ? 'text-ink-gray-8' : 'opacity-0 group-hover/card:opacity-100'"
				:aria-label="pinned ? 'Unpin task' : 'Pin task'"
				@click.stop="toggle(task.name)"
			>
				<span
					class="size-3.5 block"
					:class="pinned ? 'lucide-pin-off' : 'lucide-pin'"
					aria-hidden="true"
				/>
			</button>
		</div>

		<div class="mt-2 flex flex-wrap items-center gap-1">
			<PriorityBadge :priority="task.priority" />
			<Badge
				v-if="task.size"
				:theme="sizeTheme(task.size)"
				:label="task.size"
				variant="subtle"
			/>
			<a
				v-if="task.pr_link"
				:href="task.pr_link"
				target="_blank"
				rel="noopener noreferrer"
				@click.stop
			>
				<Badge variant="outline" theme="gray" label="PR" />
			</a>
			<Badge
				v-if="task.recurrence_frequency"
				variant="outline"
				theme="gray"
				:label="task.recurrence_frequency"
			/>
		</div>

		<div
			v-if="dependsOn"
			class="mt-2 flex items-center gap-1 text-xs"
			:class="dependsOn.status === 'Done' ? 'text-ink-gray-5' : 'text-ink-amber-7'"
		>
			<span class="lucide-link size-3 shrink-0" aria-hidden="true" />
			<span class="truncate">
				{{ dependsOn.status === 'Done' ? 'Depends on' : 'Blocked by' }}
				{{ dependsOn.title }}
			</span>
		</div>

		<div class="mt-2 flex items-center justify-between gap-2">
			<span
				v-if="task.due_date"
				class="flex items-center gap-1 text-xs"
				:class="overdue ? 'font-medium text-ink-red-6' : 'text-ink-gray-5'"
			>
				<span class="lucide-calendar size-3 shrink-0" aria-hidden="true" />
				{{ formatDate(task.due_date, 'D MMM') }}
			</span>
			<span v-else />
			<AvatarStack :members="stack" :max="3" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from 'frappe-ui'
import AvatarStack from '@/components/common/AvatarStack.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import { usePinnedTasks } from '@/composables/usePinnedTasks'
import { formatDate, today } from '@/lib/dates'
import { sizeTheme } from '@/lib/status'
import type { HiveTask, HiveTaskAssignee } from '@/types'

const props = withDefaults(
	defineProps<{
		task: HiveTask
		assignees?: HiveTaskAssignee[]
		/** The task this one waits on, when it is on the board too. */
		dependsOn?: HiveTask | null
		/** Cursor affordance only — the board owns the drag handle. */
		draggable?: boolean
		/** Part of a Cmd/Ctrl-click multi-selection. */
		selected?: boolean
		/** Being dragged right now, so the card left behind is dimmed. */
		dragging?: boolean
		/** Rendered inside the drag preview: no cursor, no focus, no hit area. */
		preview?: boolean
	}>(),
	{
		assignees: () => [],
		dependsOn: null,
		draggable: true,
		selected: false,
		dragging: false,
		preview: false,
	},
)

const emit = defineEmits<{ select: [task: HiveTask] }>()

const { isPinned, toggle } = usePinnedTasks()

const pinned = computed(() => isPinned(props.task.name))

const overdue = computed(() => {
	const { due_date, status } = props.task
	if (!due_date || status === 'Done' || status === 'Someday') return false
	return due_date < today()
})

const stack = computed(() =>
	props.assignees.map((a) => ({
		user: a.member,
		name: a.member_name || a.member,
		image: a.user_image,
	})),
)
</script>
