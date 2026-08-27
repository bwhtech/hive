<template>
	<Dialog :open="open" size="4xl" title="New task" @update:open="emit('update:open', $event)">
		<template #default>
			<form
				class="grid gap-5 md:grid-cols-[35%_1fr] md:gap-6"
				@submit.prevent="submit"
				@keydown.enter.meta.prevent="submit"
				@keydown.enter.ctrl.prevent="submit"
			>
				<div class="flex flex-col gap-4">
					<Select
						v-if="needsProjectPicker"
						label="Project"
						placeholder="Select a project"
						required
						:model-value="form.project"
						:options="projectOptions"
						@update:model-value="setProject"
					/>

					<div class="grid grid-cols-2 gap-3">
						<Select
							label="Status"
							:model-value="form.status"
							:options="statusOptions"
							@update:model-value="setStatus"
						/>
						<Select
							label="Priority"
							:model-value="form.priority"
							:options="priorityOptions"
							@update:model-value="setPriority"
						/>
					</div>

					<Select
						label="Size"
						:model-value="form.size"
						:options="sizeOptions"
						@update:model-value="setSize"
					/>

					<LinkPicker
						v-if="resolvedProject"
						doctype="Hive Milestone"
						label="Milestone"
						placeholder="None"
						:model-value="form.milestone"
						:filters="milestoneFilters"
						@update:model-value="setMilestone"
					/>

					<MultiSelect
						v-model:open="assigneePickerOpen"
						label="Assignees"
						placeholder="Unassigned"
						:model-value="form.assignees"
						:options="memberOptions"
						@update:model-value="setAssignees"
					/>

					<div class="grid grid-cols-2 gap-3">
						<DatePicker
							label="Start date"
							placeholder="Not set"
							clearable
							:model-value="form.start_date ?? ''"
							@update:model-value="setDate('start_date', $event)"
						/>
						<DatePicker
							label="Due date"
							placeholder="Not set"
							clearable
							:model-value="form.due_date ?? ''"
							@update:model-value="setDate('due_date', $event)"
						/>
					</div>

					<Select
						label="Recurrence"
						:model-value="form.recurrence_frequency"
						:options="recurrenceOptions"
						@update:model-value="setRecurrence"
					/>

					<DatePicker
						v-if="form.recurrence_frequency"
						label="Repeat until"
						placeholder="Forever"
						clearable
						:model-value="form.recurrence_end_date ?? ''"
						@update:model-value="setDate('recurrence_end_date', $event)"
					/>

					<Checkbox v-model="form.is_internal" label="Internal task" />
				</div>

				<div class="flex min-w-0 flex-col gap-4">
					<FormControl
						type="text"
						label="Title"
						placeholder="What needs to be done?"
						required
						:model-value="form.title"
						@update:model-value="setTitle"
					/>
					<div class="flex min-h-0 flex-1 flex-col gap-1.5">
						<FormLabel label="Description" />
						<RichEditor
							:key="editorKey"
							:model-value="form.description"
							kit="rich"
							placeholder="Add a description…"
							content-class="min-h-40 px-3 py-2"
							:mentions="mentions"
							@update:model-value="setDescription"
						/>
					</div>
				</div>
			</form>
		</template>

		<template #actions="{ close }">
			<div class="flex items-center justify-end gap-2">
				<span v-if="hasDraft" class="mr-auto text-sm text-ink-gray-5">Draft saved</span>
				<Button label="Cancel" @click="close()" />
				<Button
					variant="solid"
					theme="gray"
					label="Create task"
					:loading="creating"
					:disabled="!canSubmit"
					@click="submit"
				>
					<template #suffix>
						<KeyboardShortcut combo="Mod+Enter" />
					</template>
				</Button>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
	Button,
	Checkbox,
	DatePicker,
	Dialog,
	FormControl,
	FormLabel,
	KeyboardShortcut,
	MultiSelect,
	Select,
	toast,
	useList,
} from 'frappe-ui'
import LinkPicker from '@/components/common/LinkPicker.vue'
import RichEditor from '@/components/common/RichEditor.vue'
import { useSession } from '@/composables/useSession'
import { useTaskMutations } from '@/composables/useTaskMutations'
import { STORAGE_KEYS, readStorage, removeStorage, writeStorage } from '@/lib/storage'
import {
	TASK_PRIORITIES,
	TASK_RECURRENCE_FREQUENCIES,
	TASK_SIZES,
	TASK_STATUSES,
	type CreateTaskValues,
	type HiveMember,
	type HiveProject,
	type HiveTask,
	type TaskPriority,
	type TaskSize,
	type TaskStatus,
} from '@/types'

const props = defineProps<{
	open: boolean
	/** Pre-selects the project and hides the project picker. */
	projectId?: string
	defaults?: Partial<CreateTaskValues>
}>()

const emit = defineEmits<{ 'update:open': [value: boolean]; created: [task: HiveTask] }>()

interface TaskDraft {
	title: string
	description: string
	status: TaskStatus
	priority: TaskPriority
	size: string
	project: string
	milestone: string | null
	assignees: string[]
	start_date: string | null
	due_date: string | null
	is_internal: boolean
	recurrence_frequency: string
	recurrence_end_date: string | null
}

function emptyDraft(): TaskDraft {
	return {
		title: '',
		description: '',
		status: 'To Do',
		priority: 'Medium',
		size: '',
		project: '',
		milestone: null,
		assignees: [],
		start_date: null,
		due_date: null,
		is_internal: false,
		recurrence_frequency: '',
		recurrence_end_date: null,
	}
}

const { isClient } = useSession()
const { createTask } = useTaskMutations()

// A draft written by an earlier session is restored before anything renders,
// so reopening the dialog picks up exactly where the user left off.
const form = reactive<TaskDraft>({
	...emptyDraft(),
	...readStorage<Partial<TaskDraft>>(STORAGE_KEYS.createTaskDraft, {}),
})

const creating = ref(false)
const hasDraft = ref(false)
const assigneePickerOpen = ref(false)
/** Bumped on reset so the editor drops its old document. */
const editorKey = ref(0)

const needsProjectPicker = computed(() => !props.projectId)
const resolvedProject = computed(() => props.projectId || form.project)
const canSubmit = computed(
	() => !isClient.value && Boolean(form.title.trim()) && Boolean(resolvedProject.value),
)

const projects = useList<Pick<HiveProject, 'name' | 'title'>>({
	doctype: 'Hive Project',
	fields: ['name', 'title'],
	filters: { status: 'Open', is_archived: 0 },
	orderBy: 'modified desc',
	limit: 100,
	immediate: false,
})

const members = useList<HiveMember>({
	doctype: 'Hive Member',
	fields: ['name', 'user', 'member_name', 'user_image', 'type', 'designation', 'is_active'],
	filters: { is_active: 1 },
	orderBy: 'member_name asc',
	limit: 100,
	cacheKey: 'hive-active-members',
})

const statusOptions = TASK_STATUSES.map((value) => ({ label: value, value }))
const priorityOptions = TASK_PRIORITIES.map((value) => ({ label: value, value }))
const sizeOptions = [
	{ label: 'None', value: '' },
	...TASK_SIZES.map((value) => ({ label: value, value })),
]
const recurrenceOptions = [
	{ label: 'None', value: '' },
	...TASK_RECURRENCE_FREQUENCIES.map((value) => ({ label: value, value })),
]

const projectOptions = computed(() =>
	(projects.data ?? []).map((project) => ({ label: project.title, value: project.name })),
)

const memberOptions = computed(() =>
	(members.data ?? []).map((member) => ({
		label: member.member_name || member.user,
		value: member.user,
		description: member.designation || undefined,
	})),
)

const mentions = computed(() =>
	(members.data ?? []).map((member) => ({
		id: member.user,
		label: member.member_name || member.user,
		image: member.user_image || undefined,
	})),
)

const milestoneFilters = computed(() => ({ project: resolvedProject.value }))

watch(
	() => props.open,
	(open) => {
		if (!open) return
		if (needsProjectPicker.value) projects.reload()
		applyDefaults()
	},
	{ immediate: true },
)

// Persist on every change so a navigation away never loses the draft.
watch(
	form,
	(value) => {
		if (isDirty(value)) {
			writeStorage(STORAGE_KEYS.createTaskDraft, value)
			hasDraft.value = true
		} else {
			removeStorage(STORAGE_KEYS.createTaskDraft)
			hasDraft.value = false
		}
	},
	{ deep: true, immediate: true },
)

function isDirty(value: TaskDraft): boolean {
	const empty = emptyDraft()
	return (Object.keys(empty) as Array<keyof TaskDraft>).some(
		(key) => JSON.stringify(value[key]) !== JSON.stringify(empty[key]),
	)
}

/** Caller-supplied defaults win over whatever the draft held. */
function applyDefaults() {
	const defaults = props.defaults
	if (!defaults) return
	if (defaults.title !== undefined) form.title = defaults.title
	if (defaults.description !== undefined) form.description = defaults.description ?? ''
	if (defaults.status !== undefined) form.status = defaults.status
	if (defaults.priority !== undefined) form.priority = defaults.priority
	if (defaults.size !== undefined) form.size = defaults.size ?? ''
	if (defaults.project !== undefined) form.project = defaults.project ?? ''
	if (defaults.milestone !== undefined) form.milestone = defaults.milestone ?? null
	if (defaults.assignees !== undefined) form.assignees = [...(defaults.assignees ?? [])]
	if (defaults.start_date !== undefined) form.start_date = defaults.start_date ?? null
	if (defaults.due_date !== undefined) form.due_date = defaults.due_date ?? null
	if (defaults.is_internal !== undefined) form.is_internal = defaults.is_internal === 1
	if (defaults.recurrence_frequency !== undefined) {
		form.recurrence_frequency = defaults.recurrence_frequency ?? ''
	}
	if (defaults.recurrence_end_date !== undefined) {
		form.recurrence_end_date = defaults.recurrence_end_date ?? null
	}
}

function setProject(value: string | number | undefined) {
	form.project = value == null ? '' : String(value)
	// Milestones belong to a project, so the old pick cannot survive the switch.
	form.milestone = null
}

function setMilestone(value: string | string[] | null) {
	form.milestone = typeof value === 'string' && value ? value : null
}

function setTitle(value: string | number | undefined) {
	form.title = value == null ? '' : String(value)
}

function setDescription(value: string) {
	form.description = value
}

function setStatus(value: string | number | undefined) {
	form.status = (value || 'To Do') as TaskStatus
}

function setPriority(value: string | number | undefined) {
	form.priority = (value || 'Medium') as TaskPriority
}

function setSize(value: string | number | undefined) {
	form.size = value == null ? '' : String(value)
}

function setRecurrence(value: string | number | undefined) {
	form.recurrence_frequency = value == null ? '' : String(value)
}

// `MultiSelect` merges its `defineModel` and typed emits, so the handler
// signature widens to `unknown` — normalize at the boundary.
function setAssignees(value: unknown) {
	form.assignees = Array.isArray(value) ? value.map(String) : []
}

function setDate(field: 'start_date' | 'due_date' | 'recurrence_end_date', value: string) {
	form[field] = value || null
}

function reset() {
	Object.assign(form, emptyDraft())
	removeStorage(STORAGE_KEYS.createTaskDraft)
	hasDraft.value = false
	editorKey.value++
}

async function submit() {
	if (!canSubmit.value || creating.value) return
	creating.value = true
	try {
		const created = await createTask({
			title: form.title.trim(),
			project: resolvedProject.value,
			status: form.status,
			priority: form.priority,
			size: (form.size || '') as TaskSize | '',
			milestone: form.milestone,
			description: form.description || '',
			start_date: form.start_date,
			due_date: form.due_date,
			is_internal: form.is_internal ? 1 : 0,
			recurrence_frequency:
				form.recurrence_frequency as CreateTaskValues['recurrence_frequency'],
			recurrence_end_date: form.recurrence_frequency ? form.recurrence_end_date : null,
			assignees: form.assignees,
		})
		reset()
		toast.success('Task created')
		emit('created', created)
		emit('update:open', false)
	} catch {
		toast.error('Failed to create task')
	} finally {
		creating.value = false
	}
}
</script>
