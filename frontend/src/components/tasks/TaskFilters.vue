<template>
	<div class="flex flex-wrap items-center gap-2">
		<TextInput
			class="w-full lg:max-w-56"
			type="text"
			:model-value="q"
			placeholder="Search tasks"
			:debounce="250"
			aria-label="Search tasks"
			@update:model-value="emit('update:q', String($event ?? ''))"
		>
			<template #prefix>
				<span class="lucide-search size-4 text-ink-gray-5" aria-hidden="true" />
			</template>
		</TextInput>

		<Divider class="mx-1 hidden lg:block" orientation="vertical" flex-item />

		<Select
			variant="ghost"
			:model-value="status"
			:options="statusOptions"
			aria-label="Status"
			@update:model-value="emit('update:status', String($event ?? ''))"
		>
			<template #item-prefix="{ item }">
				<span
					v-if="item.value"
					class="size-4 text-ink-gray-6"
					:class="statusIcon(item.value as TaskStatus)"
					aria-hidden="true"
				/>
			</template>
		</Select>

		<Select
			variant="ghost"
			:model-value="priority"
			:options="priorityOptions"
			aria-label="Priority"
			@update:model-value="emit('update:priority', String($event ?? ''))"
		>
			<template #item-prefix="{ item }">
				<span
					v-if="item.value"
					class="size-4"
					:class="[
						priorityIcon(item.value as TaskPriority),
						priorityColor(item.value as TaskPriority),
					]"
					aria-hidden="true"
				/>
			</template>
		</Select>

		<Select
			variant="ghost"
			:model-value="project"
			:options="projectOptions"
			aria-label="Project"
			@update:model-value="emit('update:project', String($event ?? ''))"
		>
			<template #item-prefix="{ item }">
				<span
					v-if="item.value"
					class="lucide-folder size-4 text-ink-gray-6"
					aria-hidden="true"
				/>
			</template>
		</Select>

		<Select
			variant="ghost"
			:model-value="assignee"
			:options="assigneeOptions"
			aria-label="Assignee"
			@update:model-value="emit('update:assignee', String($event ?? ''))"
		>
			<template #item-prefix="{ item }">
				<Avatar
					v-if="item.value"
					size="xs"
					:label="item.label"
					:image="memberImage(String(item.value))"
				/>
			</template>
		</Select>

		<Button
			v-if="hasFilters"
			variant="ghost"
			label="Clear"
			icon-left="lucide-x"
			@click="emit('reset')"
		/>

		<div class="ml-auto flex items-center gap-2">
			<span class="whitespace-nowrap text-sm text-ink-gray-5">
				{{ count }} task{{ count === 1 ? '' : 's' }}
			</span>
			<Dropdown :options="groupOptions" align="end">
				<Button variant="ghost" icon-left="lucide-layers">
					Group: {{ TASK_GROUP_LABELS[groupBy] }}
				</Button>
			</Dropdown>
			<Dropdown :options="sortOptions" align="end">
				<Button variant="ghost" icon-left="lucide-arrow-up-down">
					{{ TASK_SORT_LABELS[sortKey] }}
				</Button>
			</Dropdown>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
	Avatar,
	Button,
	Divider,
	Dropdown,
	Select,
	TextInput,
	type DropdownOptions,
	type SelectOption,
} from 'frappe-ui'
import {
	priorityColor,
	priorityIcon,
	statusIcon,
	TASK_GROUP_FIELDS,
	TASK_GROUP_LABELS,
	TASK_SORT_KEYS,
	TASK_SORT_LABELS,
	TASK_STATUS_ORDER,
	type TaskGroupField,
	type TaskSortDirection,
	type TaskSortKey,
} from '@/lib/status'
import { TASK_PRIORITIES, type HiveTaskAssignee, type TaskPriority, type TaskStatus } from '@/types'

/**
 * The tasks toolbar. Every filter is a plain string owned by the URL — `''`
 * means "all", which is also the value of the reset row in each `Select`, so a
 * ghost trigger with nothing set reads as the attribute's own name.
 *
 * Grouping and sorting are not URL state: they are how you read the list, not
 * what the list contains, so they stay with the page.
 */
const props = defineProps<{
	q: string
	status: string
	priority: string
	project: string
	assignee: string
	/** Rows the list is showing, for the toolbar's count. */
	count: number
	groupBy: TaskGroupField
	sortKey: TaskSortKey
	sortDirection: TaskSortDirection
	/** Filterable projects. The page already loaded them for the row badges. */
	projects: { name: string; title: string; is_archived?: number }[]
	/** Everyone assigned to at least one task — no extra query needed. */
	members: HiveTaskAssignee[]
}>()

const emit = defineEmits<{
	'update:q': [value: string]
	'update:status': [value: string]
	'update:priority': [value: string]
	'update:project': [value: string]
	'update:assignee': [value: string]
	'update:groupBy': [value: TaskGroupField]
	'update:sortKey': [value: TaskSortKey]
	'update:sortDirection': [value: TaskSortDirection]
	reset: []
}>()

const statusOptions = computed<SelectOption[]>(() => [
	{ label: 'Status', value: '' },
	...TASK_STATUS_ORDER.map((s) => ({ label: s, value: s })),
])

const priorityOptions = computed<SelectOption[]>(() => [
	{ label: 'Priority', value: '' },
	...TASK_PRIORITIES.map((p) => ({ label: p, value: p })),
])

/**
 * A saved view can point at a project or a member that has dropped out of the
 * options — an archived project, someone with no tasks left. Keeping the set
 * value in the list is what stops the trigger from going blank.
 */
function withCurrent(options: SelectOption[], value: string): SelectOption[] {
	if (!value || options.some((o) => typeof o === 'object' && o.value === value)) return options
	return [...options, { label: value, value }]
}

const projectOptions = computed<SelectOption[]>(() =>
	withCurrent(
		[
			{ label: 'Project', value: '' },
			...props.projects
				.filter((p) => !p.is_archived)
				.map((p) => ({ label: p.title, value: p.name })),
		],
		props.project,
	),
)

const assigneeOptions = computed<SelectOption[]>(() =>
	withCurrent(
		[
			{ label: 'Assignee', value: '' },
			...props.members.map((m) => ({ label: m.member_name || m.member, value: m.member })),
		],
		props.assignee,
	),
)

function memberImage(member: string): string | undefined {
	return props.members.find((m) => m.member === member)?.user_image || undefined
}

const hasFilters = computed(() =>
	Boolean(props.q || props.status || props.priority || props.project || props.assignee),
)

const groupOptions = computed<DropdownOptions>(() =>
	TASK_GROUP_FIELDS.map((field) => ({
		label: TASK_GROUP_LABELS[field],
		icon: field === props.groupBy ? 'lucide-check' : undefined,
		onClick: () => emit('update:groupBy', field),
	})),
)

const sortOptions = computed<DropdownOptions>(() => [
	...TASK_SORT_KEYS.map((key) => ({
		label: TASK_SORT_LABELS[key],
		icon: key === props.sortKey ? 'lucide-check' : undefined,
		onClick: () => emit('update:sortKey', key),
	})),
	// The column headers used to carry the direction toggle; with them gone it
	// lives at the foot of this menu.
	{
		label: props.sortDirection === 'asc' ? 'Descending' : 'Ascending',
		icon:
			props.sortDirection === 'asc'
				? 'lucide-arrow-down-wide-narrow'
				: 'lucide-arrow-up-narrow-wide',
		onClick: () => emit('update:sortDirection', props.sortDirection === 'asc' ? 'desc' : 'asc'),
	},
])
</script>
