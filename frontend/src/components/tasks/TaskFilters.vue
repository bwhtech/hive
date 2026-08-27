<template>
	<div class="flex flex-col gap-2 lg:flex-row lg:items-center">
		<TextInput
			class="w-full lg:max-w-xs"
			type="text"
			:model-value="q"
			placeholder="Search tasks"
			:debounce="250"
			aria-label="Search tasks"
			@update:model-value="emit('update:q', $event)"
		>
			<template #prefix>
				<span class="lucide-search size-4 text-ink-gray-5" aria-hidden="true" />
			</template>
		</TextInput>

		<div class="flex flex-wrap items-center gap-2">
			<Badge
				v-if="activeCount"
				theme="blue"
				variant="subtle"
				:label="`${activeCount} filter${activeCount > 1 ? 's' : ''}`"
			/>

			<Select
				:model-value="status"
				:options="statusOptions"
				placeholder="Status"
				aria-label="Status"
				@update:model-value="emit('update:status', String($event))"
			/>

			<Select
				:model-value="priority"
				:options="priorityOptions"
				placeholder="Priority"
				aria-label="Priority"
				@update:model-value="emit('update:priority', String($event))"
			/>

			<div class="flex items-center gap-1">
				<LinkPicker
					doctype="Hive Project"
					:model-value="project || null"
					:filters="PROJECT_FILTERS"
					placeholder="Project"
					@update:model-value="emit('update:project', ($event as string) ?? '')"
				/>
				<Button
					v-if="project"
					variant="ghost"
					icon="lucide-x"
					aria-label="Clear project filter"
					@click="emit('update:project', '')"
				/>
			</div>

			<div class="flex items-center gap-1">
				<LinkPicker
					doctype="Hive Member"
					:model-value="assignee || null"
					placeholder="Assignee"
					@update:model-value="emit('update:assignee', ($event as string) ?? '')"
				/>
				<Button
					v-if="assignee"
					variant="ghost"
					icon="lucide-x"
					aria-label="Clear assignee filter"
					@click="emit('update:assignee', '')"
				/>
			</div>

			<Button
				v-if="activeCount || q"
				variant="ghost"
				label="Reset"
				icon-left="lucide-rotate-ccw"
				@click="emit('reset')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Button, Select, TextInput } from 'frappe-ui'
import LinkPicker from '@/components/common/LinkPicker.vue'
import { TASK_PRIORITIES, TASK_STATUSES } from '@/types'

/**
 * The tasks toolbar. Every value is a plain string owned by the URL — `''`
 * means "all", which is also the value of the reset row in each `Select`.
 */
const props = defineProps<{
	q: string
	status: string
	priority: string
	project: string
	assignee: string
}>()

const emit = defineEmits<{
	'update:q': [value: string]
	'update:status': [value: string]
	'update:priority': [value: string]
	'update:project': [value: string]
	'update:assignee': [value: string]
	reset: []
}>()

/** Archived projects are never a useful filter target. */
const PROJECT_FILTERS = { is_archived: 0 }

const statusOptions = [
	{ label: 'All statuses', value: '' },
	// `Blocked` is filterable even though the board has no column for it.
	...[...TASK_STATUSES, 'Blocked' as const].map((s) => ({ label: s, value: s })),
]

const priorityOptions = [
	{ label: 'All priorities', value: '' },
	...TASK_PRIORITIES.map((p) => ({ label: p, value: p })),
]

const activeCount = computed(
	() => [props.status, props.priority, props.project, props.assignee].filter(Boolean).length,
)
</script>
