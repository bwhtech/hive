<template>
	<div class="flex min-h-0 flex-col gap-3">
		<div v-if="tasks.length" class="flex items-center justify-end">
			<TabButtons v-model="view" :options="VIEWS" />
		</div>

		<PageSkeleton v-if="loading" :rows="5" />

		<EmptyState
			v-else-if="!tasks.length"
			icon="lucide-square-check-big"
			title="No tasks yet"
			description="Add the first task to get this project moving."
		/>

		<TaskBoard
			v-else-if="view === 'kanban'"
			:tasks="tasks"
			:assignees-by-task="assigneesByTask"
			:list="list"
			:readonly="readonly"
			@select="emit('select', $event)"
			@changed="emit('changed')"
		/>

		<TaskTable
			v-else
			:tasks="tasks"
			:milestone-titles="milestoneTitles"
			:assignees-by-task="assigneesByTask"
			:active-task="activeTask"
			:list="list"
			:readonly="readonly"
			hide-project
			@select="emit('select', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TabButtons } from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import PageSkeleton from '@/components/common/PageSkeleton.vue'
import TaskBoard from '@/components/tasks/TaskBoard.vue'
import TaskTable from '@/components/tasks/TaskTable.vue'
import type { TaskListHandle } from '@/composables/useTaskMutations'
import type { HiveMilestone, HiveTask, HiveTaskAssignee } from '@/types'

const props = withDefaults(
	defineProps<{
		tasks: HiveTask[]
		milestones: HiveMilestone[]
		/** The `useList` result the tasks came from, so a drop can be optimistic. */
		list?: TaskListHandle
		assigneesByTask?: Record<string, HiveTaskAssignee[]>
		/** Highlights the row whose task panel is open. */
		activeTask?: string | null
		loading?: boolean
		readonly?: boolean
	}>(),
	{ assigneesByTask: () => ({}), activeTask: null, loading: false, readonly: false },
)

const emit = defineEmits<{ select: [task: HiveTask]; changed: [] }>()

const VIEWS = [
	{ value: 'list', label: 'List', icon: 'lucide-list', tooltip: 'List' },
	{ value: 'kanban', label: 'Board', icon: 'lucide-columns-3', tooltip: 'Board' },
]

// Not URL state: the project page's query already carries the tab and the
// open task, and which shape the same task list is drawn in is a per-visit
// preference, not something a shared link should pin down.
const view = ref('list')

const milestoneTitles = computed(() =>
	Object.fromEntries(props.milestones.map((milestone) => [milestone.name, milestone.title])),
)
</script>
