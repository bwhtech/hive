<template>
	<div class="space-y-3">
		<div v-if="milestones.length" class="flex items-center gap-2">
			<span class="lucide-filter size-3.5 text-ink-gray-5" aria-hidden="true" />
			<Select
				v-model="milestoneFilter"
				class="w-48"
				size="sm"
				:options="milestoneOptions"
				aria-label="Filter by milestone"
			/>
			<span v-if="milestoneFilter !== 'all'" class="text-xs text-ink-gray-5">
				{{ filtered.length }} of {{ tasks.length }} tasks
			</span>
		</div>

		<PageSkeleton v-if="loading" :rows="5" />

		<EmptyState
			v-else-if="!filtered.length"
			icon="lucide-square-check-big"
			:title="milestoneFilter === 'all' ? 'No tasks yet' : 'No tasks in this milestone'"
			:description="
				milestoneFilter === 'all'
					? 'Add the first task to get this project moving.'
					: 'Pick another milestone, or move a task into this one.'
			"
		/>

		<TaskBoard
			v-else
			:tasks="filtered"
			:assignees-by-task="assigneesByTask"
			:list="list"
			:readonly="readonly"
			@select="emit('select', $event)"
			@changed="emit('changed')"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Select } from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import PageSkeleton from '@/components/common/PageSkeleton.vue'
import TaskBoard from '@/components/tasks/TaskBoard.vue'
import type { TaskListHandle } from '@/composables/useTaskMutations'
import type { HiveMilestone, HiveTask, HiveTaskAssignee } from '@/types'

const props = withDefaults(
	defineProps<{
		tasks: HiveTask[]
		milestones: HiveMilestone[]
		/** The `useList` result the tasks came from, so a drop can be optimistic. */
		list?: TaskListHandle
		assigneesByTask?: Record<string, HiveTaskAssignee[]>
		loading?: boolean
		readonly?: boolean
	}>(),
	{ assigneesByTask: () => ({}), loading: false, readonly: false },
)

const emit = defineEmits<{ select: [task: HiveTask]; changed: [] }>()

/** Sentinel filter values; a milestone docname can never collide with these. */
const ALL = 'all'
const NONE = 'none'

const milestoneFilter = ref<string>(ALL)

const milestoneOptions = computed(() => [
	{ label: 'All tasks', value: ALL },
	{ label: 'No milestone', value: NONE },
	...props.milestones.map((milestone) => ({ label: milestone.title, value: milestone.name })),
])

const filtered = computed(() => {
	if (milestoneFilter.value === ALL) return props.tasks
	if (milestoneFilter.value === NONE) return props.tasks.filter((task) => !task.milestone)
	return props.tasks.filter((task) => task.milestone === milestoneFilter.value)
})
</script>
