<template>
	<component :is="Wrapper" v-bind="wrapperProps" @update:open="onSheetOpenChange">
		<div
			v-if="name"
			class="flex min-h-0 flex-col"
			:class="isDesktop ? 'h-full' : ''"
			data-testid="task-panel"
			:data-task="name"
		>
			<header
				class="flex shrink-0 items-center gap-1 border-b border-outline-gray-2 px-4 py-2.5"
			>
				<h2 class="min-w-0 flex-1 truncate text-lg font-semibold text-ink-gray-8">
					{{ form.title || 'Task' }}
				</h2>
				<Button
					variant="ghost"
					:icon="pinned ? 'lucide-pin-off' : 'lucide-pin'"
					:aria-label="pinned ? 'Unpin task' : 'Pin task'"
					:tooltip="pinned ? 'Unpin task' : 'Pin task'"
					@click="togglePin"
				/>
				<Button
					variant="ghost"
					icon="lucide-x"
					aria-label="Close panel"
					@click="emit('close')"
				/>
			</header>

			<component :is="Scroller" v-bind="scrollerProps">
				<div v-if="!task.doc && task.loading" class="space-y-3 py-2">
					<Skeleton class="h-8 w-full" />
					<Skeleton v-for="n in 5" :key="n" class="h-9 w-full" />
				</div>

				<div v-else-if="task.doc" class="space-y-4">
					<FormControl
						type="text"
						label="Title"
						:model-value="form.title"
						:disabled="!canEdit"
						@update:model-value="setText('title', $event)"
					/>

					<div class="grid grid-cols-2 gap-3">
						<Select
							label="Status"
							:model-value="form.status"
							:options="statusOptions"
							:disabled="!canEdit"
							@update:model-value="setStatus"
						/>
						<Select
							label="Priority"
							:model-value="form.priority"
							:options="priorityOptions"
							:disabled="!canEdit"
							@update:model-value="setPriority"
						/>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<Select
							label="Size"
							:model-value="form.size"
							:options="sizeOptions"
							:disabled="!canEdit"
							@update:model-value="setSize"
						/>
						<Select
							label="Recurrence"
							:model-value="form.recurrence_frequency"
							:options="recurrenceOptions"
							:disabled="!canEdit"
							@update:model-value="setRecurrence"
						/>
					</div>

					<DatePicker
						v-if="form.recurrence_frequency"
						label="Repeat until"
						placeholder="Forever"
						:model-value="form.recurrence_end_date ?? ''"
						:disabled="!canEdit"
						clearable
						@update:model-value="setDate('recurrence_end_date', $event)"
					/>

					<LinkPicker
						doctype="Hive Milestone"
						label="Milestone"
						placeholder="None"
						:model-value="form.milestone"
						:filters="milestoneFilters"
						:disabled="!canEdit"
						@update:model-value="setLink('milestone', $event)"
					/>

					<LinkPicker
						doctype="Hive Task"
						label="Depends on"
						placeholder="None"
						:model-value="form.depends_on"
						:filters="dependsOnFilters"
						:disabled="!canEdit"
						@update:model-value="setLink('depends_on', $event)"
					/>

					<MultiSelect
						v-model:open="assigneePickerOpen"
						label="Assignees"
						placeholder="Unassigned"
						:model-value="assignees"
						:options="memberOptions"
						:disabled="!canEdit"
						@update:model-value="onAssigneesChange"
					/>

					<div class="grid grid-cols-2 gap-3">
						<DatePicker
							label="Start date"
							placeholder="Not set"
							:model-value="form.start_date ?? ''"
							:disabled="!canEdit"
							clearable
							@update:model-value="setDate('start_date', $event)"
						/>
						<DatePicker
							label="Due date"
							placeholder="Not set"
							:model-value="form.due_date ?? ''"
							:disabled="!canEdit || isDueDateLocked"
							:description="
								isDueDateLocked ? 'Locked on or after the due date' : undefined
							"
							clearable
							@update:model-value="setDate('due_date', $event)"
						/>
					</div>

					<DatePicker
						v-if="form.status === 'Done'"
						label="Completed on"
						placeholder="Not set"
						:model-value="form.completed_on ?? ''"
						:disabled="!canEdit"
						clearable
						@update:model-value="setDate('completed_on', $event)"
					/>

					<FormControl
						type="text"
						label="PR link"
						placeholder="https://github.com/…"
						:model-value="form.pr_link"
						:disabled="!canEdit"
						@update:model-value="setText('pr_link', $event)"
					>
						<template #prefix>
							<span class="lucide-link size-4 text-ink-gray-5" aria-hidden="true" />
						</template>
					</FormControl>

					<div v-if="showGithubIssue" class="space-y-1.5">
						<FormLabel label="GitHub issue" />
						<a
							v-if="task.doc.github_issue_url"
							:href="task.doc.github_issue_url"
							target="_blank"
							rel="noopener noreferrer"
							class="block truncate text-base text-ink-blue-link hover:underline"
						>
							{{ task.doc.github_issue_url }}
						</a>
						<Button
							v-else
							label="Convert to GitHub issue"
							icon-left="lucide-git-branch"
							:loading="createIssue.loading"
							@click="convertToIssue"
						/>
					</div>

					<div class="space-y-1.5">
						<FormLabel label="Description" />
						<RichEditor
							v-if="canEdit"
							:key="task.doc.name"
							:model-value="form.description"
							kit="rich"
							placeholder="Add a description…"
							content-class="min-h-24 px-3 py-2"
							:mentions="mentions"
							@update:model-value="setDescription"
						/>
						<!-- eslint-disable vue/no-v-html -- stored editor output, rendered the same way everywhere in the app -->
						<div
							v-else-if="task.doc.description"
							class="hive-prose"
							v-html="task.doc.description"
						/>
						<!-- eslint-enable vue/no-v-html -->
						<p v-else class="text-sm text-ink-gray-5">No description</p>
					</div>

					<div class="space-y-1.5">
						<FormLabel label="Attachments" />
						<TaskAttachments :task-name="task.doc.name" :read-only="!canEdit" />
					</div>

					<section
						v-if="hasClient"
						class="space-y-3 rounded-4 border border-outline-gray-2 p-3"
					>
						<div class="flex items-center justify-between gap-2">
							<span class="text-sm font-medium text-ink-gray-6">UAT status</span>
							<Badge
								:label="task.doc.uat_status || 'Pending'"
								:theme="uatStatusTheme(task.doc.uat_status)"
								variant="subtle"
							/>
						</div>
						<p v-if="task.doc.uat_approved_by" class="text-sm text-ink-gray-5">
							{{ task.doc.uat_status === 'Approved' ? 'Approved' : 'Rejected' }} by
							{{ task.doc.uat_approved_by }}
							<template v-if="task.doc.uat_date">
								on {{ formatDate(task.doc.uat_date) }}
							</template>
						</p>
						<div class="flex gap-2">
							<Button
								class="flex-1"
								variant="solid"
								theme="green"
								label="Approve"
								icon-left="lucide-circle-check"
								:loading="task.approveUat.loading"
								:disabled="task.doc.uat_status === 'Approved'"
								@click="reviewUat('approve')"
							/>
							<Button
								class="flex-1"
								variant="outline"
								theme="red"
								label="Reject"
								icon-left="lucide-circle-x"
								:loading="task.rejectUat.loading"
								:disabled="task.doc.uat_status === 'Rejected'"
								@click="reviewUat('reject')"
							/>
						</div>
					</section>

					<!-- Clients comment too; only their own comment can be deleted. -->
					<TaskComments :task-name="task.doc.name" :members="members.data ?? []" />
				</div>

				<EmptyState
					v-else
					title="Task not available"
					description="It may have been archived, or you may not have access to it."
					icon="lucide-circle-slash"
				/>
			</component>

			<footer
				v-if="canEdit && task.doc"
				class="flex shrink-0 items-center gap-2 border-t border-outline-gray-2 px-4 py-2"
			>
				<Button
					variant="ghost"
					theme="red"
					icon="lucide-trash-2"
					aria-label="Archive task"
					tooltip="Archive task"
					@click="archiveTask"
				/>
				<div class="flex flex-1 items-center justify-end gap-1.5 text-sm text-ink-gray-5">
					<template v-if="autosave === 'saving'">
						<Spinner class="size-3" />
						<span>Saving…</span>
					</template>
					<template v-else-if="autosave === 'saved'">
						<span class="lucide-check size-4 text-ink-green-6" aria-hidden="true" />
						<span>Saved</span>
					</template>
				</div>
			</footer>
		</div>
	</component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import {
	Badge,
	BottomSheet,
	Button,
	DatePicker,
	FormControl,
	FormLabel,
	MultiSelect,
	ScrollArea,
	Select,
	Skeleton,
	Spinner,
	toast,
	useCall,
	useDoc,
	useKeyboardShortcut,
	useList,
} from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import LinkPicker from '@/components/common/LinkPicker.vue'
import RichEditor from '@/components/common/RichEditor.vue'
import TaskAttachments from '@/components/tasks/TaskAttachments.vue'
import TaskComments from '@/components/tasks/TaskComments.vue'
import { useArchiveWithUndo } from '@/composables/useArchiveWithUndo'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useCelebrate } from '@/composables/useCelebrate'
import { usePinnedTasks } from '@/composables/usePinnedTasks'
import { useSession } from '@/composables/useSession'
import { useTaskMutations } from '@/composables/useTaskMutations'
import { formatDate, today } from '@/lib/dates'
import { uatStatusTheme } from '@/lib/status'
import {
	TASK_PRIORITIES,
	TASK_RECURRENCE_FREQUENCIES,
	TASK_SIZES,
	TASK_STATUSES,
	type Bool,
	type HiveMember,
	type HiveProject,
	type HiveTask,
	type TaskPriority,
	type TaskStatus,
} from '@/types'

/** Opened by `?task=<name>` on the tasks and project screens; `null` closes it. */
const props = defineProps<{ name: string | null }>()
const emit = defineEmits<{ close: []; changed: [] }>()

/** Autosave debounce, matching the sheet this panel replaces. */
const AUTOSAVE_DELAY = 1500
const DESKTOP_PANEL_CLASS =
	'flex h-full w-[28rem] shrink-0 flex-col border-l border-outline-gray-2 bg-surface-base'

const { isDesktop } = useBreakpoint()
const { isClient } = useSession()
const { celebrate } = useCelebrate()
const { isPinned, toggle: togglePinned } = usePinnedTasks()
const { assign, unassign } = useTaskMutations()
const archive = useArchiveWithUndo('Hive Task')

interface TaskDocMethods {
	approveUat: () => void
	rejectUat: () => void
}

const task = useDoc<HiveTask, TaskDocMethods>({
	doctype: 'Hive Task',
	name: () => props.name ?? '',
	methods: { approveUat: 'approve_uat', rejectUat: 'reject_uat' },
})

const project = useDoc<Pick<HiveProject, 'name' | 'client' | 'github_repo'>>({
	doctype: 'Hive Project',
	name: () => task.doc?.project ?? '',
})

// Clients cannot read Hive Settings; a failed request just leaves the lock off.
const settings = useDoc<{ name: string; lock_due_date_on_or_after: Bool }>({
	doctype: 'Hive Settings',
	name: 'Hive Settings',
})

const members = useList<HiveMember>({
	doctype: 'Hive Member',
	fields: ['name', 'user', 'member_name', 'user_image', 'type', 'designation', 'is_active'],
	filters: { is_active: 1 },
	orderBy: 'member_name asc',
	limit: 100,
	cacheKey: 'hive-active-members',
})

// `_assign` is Frappe's own assignment column. It is read through a one-row
// list because the document endpoint does not reliably return it.
const assignRow = useList<{ name: string; _assign: string | null }>({
	doctype: 'Hive Task',
	fields: ['name', '_assign'],
	filters: () => ({ name: props.name ?? '' }),
	limit: 1,
	// Driven only by the `name` watcher below, so opening a task never fires
	// the same request twice.
	immediate: false,
	refetch: false,
})

const ghStatus = useCall<{ app_configured: boolean; connected: boolean }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.status',
	method: 'GET',
	cacheKey: 'github-status',
	immediate: false,
})

const createIssue = useCall<{ issue_url: string }, { task_name: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.create_issue',
	method: 'POST',
	immediate: false,
})

const canEdit = computed(() => !isClient.value)
const pinned = computed(() => Boolean(props.name && isPinned(props.name)))
const hasClient = computed(() => Boolean(project.doc?.client))

const form = reactive({
	title: '',
	description: '',
	status: 'Backlog' as TaskStatus,
	priority: 'Medium' as TaskPriority,
	size: '',
	milestone: null as string | null,
	depends_on: null as string | null,
	pr_link: '',
	start_date: null as string | null,
	due_date: null as string | null,
	completed_on: null as string | null,
	recurrence_frequency: '',
	recurrence_end_date: null as string | null,
})

const saving = ref(false)
const autosave = ref<'idle' | 'saving' | 'saved'>('idle')
const assignees = ref<string[]>([])
const assigneePickerOpen = ref(false)
let autosaveTimer: ReturnType<typeof setTimeout> | undefined

const statusOptions = [...TASK_STATUSES, 'Blocked'].map((value) => ({ label: value, value }))
const priorityOptions = TASK_PRIORITIES.map((value) => ({ label: value, value }))
const sizeOptions = [
	{ label: 'None', value: '' },
	...TASK_SIZES.map((value) => ({ label: value, value })),
]
const recurrenceOptions = [
	{ label: 'None', value: '' },
	...TASK_RECURRENCE_FREQUENCIES.map((value) => ({ label: value, value })),
]

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

const milestoneFilters = computed(() => ({ project: task.doc?.project ?? '' }))
const dependsOnFilters = computed(() => ({ project: task.doc?.project ?? '', is_archived: 0 }))

const showGithubIssue = computed(
	() =>
		canEdit.value &&
		Boolean(project.doc?.github_repo) &&
		Boolean(ghStatus.data?.app_configured) &&
		Boolean(ghStatus.data?.connected),
)

/** Hive Settings can freeze the due date from the due day onwards. */
const isDueDateLocked = computed(() => {
	if (!settings.doc?.lock_due_date_on_or_after || !form.due_date) return false
	return form.due_date <= today()
})

const Wrapper = computed(() => (isDesktop.value ? 'aside' : BottomSheet))
const wrapperProps = computed(() =>
	isDesktop.value
		? { class: props.name ? DESKTOP_PANEL_CLASS : 'hidden' }
		: { open: Boolean(props.name) },
)
const Scroller = computed(() => (isDesktop.value ? ScrollArea : 'div'))
const scrollerProps = computed(() =>
	isDesktop.value
		? { class: 'min-h-0 flex-1', viewportClass: 'px-4 pb-16 pt-3' }
		: // `BottomSheet` already owns the scroll region, so the sheet body is
			// a plain padded block.
			{ class: 'px-4 pb-8 pt-3' },
)

function onSheetOpenChange(open: boolean) {
	if (!open) emit('close')
}

// A different task resets the form; a refetch of the same one must never stomp
// on what the user is typing.
let loadedName = ''
watch(
	() => task.doc,
	(doc) => {
		if (!doc || doc.name === loadedName) return
		loadedName = doc.name
		cancelAutosave()
		autosave.value = 'idle'
		form.title = doc.title ?? ''
		form.description = doc.description ?? ''
		form.status = doc.status
		form.priority = doc.priority
		form.size = doc.size ?? ''
		form.milestone = doc.milestone ?? null
		form.depends_on = doc.depends_on ?? null
		form.pr_link = doc.pr_link ?? ''
		form.start_date = doc.start_date ?? null
		form.due_date = doc.due_date ?? null
		form.completed_on = doc.completed_on ?? null
		form.recurrence_frequency = doc.recurrence_frequency ?? ''
		form.recurrence_end_date = doc.recurrence_end_date ?? null
	},
	{ immediate: true },
)

watch(
	() => props.name,
	(name) => {
		cancelAutosave()
		assignees.value = []
		if (name) assignRow.reload()
	},
	{ immediate: true },
)

watch(
	() => assignRow.data,
	(rows) => {
		assignees.value = parseAssign(rows?.[0]?._assign)
	},
)

// The GitHub status call is only worth making for a team member on a project
// that is actually linked to a repository.
let githubStatusRequested = false
watch(
	() => canEdit.value && Boolean(project.doc?.github_repo),
	(needed) => {
		if (!needed || githubStatusRequested) return
		githubStatusRequested = true
		ghStatus.reload()
	},
	{ immediate: true },
)

function parseAssign(raw: string | null | undefined): string[] {
	if (!raw) return []
	try {
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? (parsed as string[]) : []
	} catch {
		return []
	}
}

function cancelAutosave() {
	clearTimeout(autosaveTimer)
	autosaveTimer = undefined
}

function markEdited() {
	if (!canEdit.value) return
	autosave.value = 'idle'
	cancelAutosave()
	autosaveTimer = setTimeout(() => save(true), AUTOSAVE_DELAY)
}

function setText(field: 'title' | 'pr_link', value: string | number | undefined) {
	form[field] = value == null ? '' : String(value)
	markEdited()
}

function setDescription(value: string) {
	form.description = value
	markEdited()
}

function setDate(
	field: 'start_date' | 'due_date' | 'completed_on' | 'recurrence_end_date',
	value: string,
) {
	form[field] = value || null
	markEdited()
}

function setLink(field: 'milestone' | 'depends_on', value: string | string[] | null) {
	form[field] = typeof value === 'string' && value ? value : null
	markEdited()
}

function setPriority(value: string | number | undefined) {
	form.priority = (value || 'Medium') as TaskPriority
	markEdited()
}

function setSize(value: string | number | undefined) {
	form.size = value == null ? '' : String(value)
	markEdited()
}

function setRecurrence(value: string | number | undefined) {
	form.recurrence_frequency = value == null ? '' : String(value)
	markEdited()
}

function setStatus(value: string | number | undefined) {
	form.status = (value || 'Backlog') as TaskStatus
	if (form.status === 'Done') {
		if (!form.completed_on) {
			form.completed_on = today()
			celebrate()
		}
	} else {
		form.completed_on = null
	}
	markEdited()
}

async function save(silent = false) {
	if (!props.name || saving.value || !form.title.trim()) return
	cancelAutosave()
	saving.value = true
	if (silent) autosave.value = 'saving'
	try {
		await task.setValue.submit({
			title: form.title,
			description: form.description,
			status: form.status,
			priority: form.priority,
			size: (form.size || null) as HiveTask['size'],
			milestone: form.milestone,
			depends_on: form.depends_on,
			pr_link: form.pr_link || null,
			start_date: form.start_date,
			due_date: form.due_date,
			completed_on: form.completed_on,
			recurrence_frequency: (form.recurrence_frequency ||
				null) as HiveTask['recurrence_frequency'],
			recurrence_end_date: form.recurrence_frequency ? form.recurrence_end_date : null,
		})
		autosave.value = silent ? 'saved' : 'idle'
		if (!silent) toast.success('Task updated')
		emit('changed')
	} catch {
		if (silent) autosave.value = 'idle'
		toast.error('Failed to save task')
	} finally {
		saving.value = false
	}
}

// `MultiSelect` merges its `defineModel` and typed emits, so the handler
// signature widens to `unknown` — normalize at the boundary.
async function onAssigneesChange(next: unknown) {
	if (!props.name || !Array.isArray(next)) return
	const wanted = next.map(String)
	const current = assignees.value
	const added = wanted.filter((user) => !current.includes(user))
	const removed = current.filter((user) => !wanted.includes(user))
	assignees.value = wanted
	try {
		if (added.length) await assign(props.name, added)
		for (const user of removed) await unassign(props.name, user)
		emit('changed')
	} catch {
		toast.error('Failed to update assignees')
	} finally {
		assignRow.reload()
	}
}

async function reviewUat(action: 'approve' | 'reject') {
	try {
		if (action === 'approve') await task.approveUat.submit()
		else await task.rejectUat.submit()
		task.reload()
		emit('changed')
		toast.success(action === 'approve' ? 'UAT approved' : 'UAT rejected')
	} catch {
		toast.error(action === 'approve' ? 'Failed to approve UAT' : 'Failed to reject UAT')
	}
}

async function convertToIssue() {
	if (!props.name) return
	try {
		const result = await createIssue.submit({ task_name: props.name })
		task.reload()
		emit('changed')
		const url = result?.issue_url
		if (url) {
			toast.success('GitHub issue created', {
				action: { label: 'Open', onClick: () => window.open(url, '_blank') },
			})
		}
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Failed to create GitHub issue')
	}
}

function togglePin() {
	if (props.name) togglePinned(props.name)
}

function archiveTask() {
	if (!props.name) return
	archive(props.name, 'Task', () => emit('changed'))
	emit('close')
}

useKeyboardShortcut([
	{
		combo: 'Mod+Enter',
		description: 'Save task',
		group: 'Task panel',
		allowInInput: true,
		allowInDialog: true,
		enabled: () => Boolean(props.name) && canEdit.value,
		handler: () => save(false),
	},
	{
		combo: 'A',
		description: 'Add assignee',
		group: 'Task panel',
		allowInDialog: true,
		enabled: () => Boolean(props.name) && canEdit.value,
		handler: () => {
			assigneePickerOpen.value = true
		},
	},
	{
		combo: 'P',
		description: 'Pin or unpin task',
		group: 'Task panel',
		allowInDialog: true,
		enabled: () => Boolean(props.name) && canEdit.value,
		handler: togglePin,
	},
])

onBeforeUnmount(cancelAutosave)
</script>
