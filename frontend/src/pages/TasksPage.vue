<template>
	<AppHeader>
		<template #left>
			<Breadcrumbs :items="crumbs" />
		</template>
		<template #actions>
			<TabButtons
				v-if="isDesktop"
				:model-value="viewMode"
				:options="VIEW_MODES"
				@update:model-value="setViewMode(String($event))"
			/>
			<Dropdown v-if="headerMenu.length" :options="headerMenu" align="end">
				<Button variant="ghost" icon="lucide-ellipsis" aria-label="View actions" />
			</Dropdown>
			<Button
				v-if="!isClient"
				variant="solid"
				theme="gray"
				icon-left="lucide-plus"
				label="Add Task"
				@click="openCreateTask(createTaskContext)"
			/>
		</template>
	</AppHeader>

	<div class="flex min-h-0 flex-1 items-stretch">
		<component :is="Scroller" v-bind="scrollerProps">
			<TaskFilters
				:q="q"
				:status="statusFilter"
				:priority="priorityFilter"
				:project="projectFilter"
				:assignee="assigneeFilter"
				:count="filtered.length"
				:group-by="groupBy"
				:sort-key="sortKey"
				:sort-direction="sortDirection"
				:projects="projects.data ?? []"
				:members="members"
				@update:q="setQuery({ q: $event })"
				@update:status="setQuery({ status: $event })"
				@update:priority="setQuery({ priority: $event })"
				@update:project="setQuery({ project: $event })"
				@update:assignee="setQuery({ assignee: $event })"
				@update:group-by="groupBy = $event"
				@update:sort-key="sortKey = $event"
				@update:sort-direction="sortDirection = $event"
				@reset="resetFilters"
			/>

			<PageSkeleton v-if="tasks.loading && !tasks.data" :rows="6" />

			<EmptyState
				v-else-if="!filtered.length"
				icon="lucide-square-check-big"
				:title="hasFilters ? 'No tasks match your filters' : 'No tasks yet'"
				:description="
					hasFilters
						? 'Try adjusting your search or filters.'
						: 'Tasks appear here once they are created in a project.'
				"
			>
				<template v-if="!hasFilters && !isClient" #action>
					<Button
						variant="solid"
						theme="gray"
						icon-left="lucide-plus"
						label="Add Task"
						@click="openCreateTask(createTaskContext)"
					/>
				</template>
			</EmptyState>

			<TaskBoard
				v-else-if="viewMode === 'kanban'"
				:tasks="filtered"
				:assignees-by-task="assigneesByTask"
				:list="tasks"
				:readonly="isClient"
				@select="openTask"
				@changed="refreshAssignees"
			/>

			<TaskCalendar
				v-else-if="viewMode === 'calendar'"
				:tasks="filtered"
				@select="openTask"
			/>

			<TaskTable
				v-else
				:tasks="filtered"
				:project-titles="projectTitles"
				:milestone-titles="milestoneTitles"
				:assignees-by-task="assigneesByTask"
				:group-by="groupBy"
				:sort-key="sortKey"
				:sort-direction="sortDirection"
				:active-task="activeTaskName"
				:hide-project="hideProject"
				:list="tasks"
				:readonly="isClient"
				@select="openTask"
			/>
		</component>

		<TaskPanel
			v-if="activeTaskName"
			:name="activeTaskName"
			@close="closeTask"
			@changed="refreshTasks"
		/>
	</div>

	<SaveViewDialog
		v-model:open="saveViewOpen"
		:filters="currentFilters"
		:view-type="viewMode"
		@created="onViewCreated"
	/>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import {
	Breadcrumbs,
	Button,
	Dropdown,
	ScrollArea,
	TabButtons,
	toast,
	useCall,
	useDoctype,
	useList,
	usePageMeta,
	type BreadcrumbsProps,
	type DropdownOptions,
} from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PageSkeleton from '@/components/common/PageSkeleton.vue'
import SaveViewDialog from '@/components/tasks/SaveViewDialog.vue'
import TaskBoard from '@/components/tasks/TaskBoard.vue'
import TaskCalendar from '@/components/tasks/TaskCalendar.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskPanel from '@/components/tasks/TaskPanel.vue'
import TaskTable from '@/components/tasks/TaskTable.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useHiveViews } from '@/composables/useHiveViews'
import { useOverlays, type CreateTaskContext } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import type { TaskGroupField, TaskSortDirection, TaskSortKey } from '@/lib/status'
import type { HiveMilestone, HiveProject, HiveTask, HiveTaskAssignee, HiveView } from '@/types'

type ViewMode = HiveView['view_type']

const VIEW_MODES = [
	{ value: 'list', label: 'List', icon: 'lucide-list', tooltip: 'List' },
	{ value: 'kanban', label: 'Board', icon: 'lucide-columns-3', tooltip: 'Board' },
	{ value: 'calendar', label: 'Calendar', icon: 'lucide-calendar', tooltip: 'Calendar' },
]

/** The filter keys a saved view round-trips. Order fixes the summary order. */
const FILTER_KEYS = ['q', 'status', 'priority', 'project', 'assignee'] as const

const route = useRoute()
const router = useRouter()
const { isDesktop } = useBreakpoint()
const { isClient } = useSession()
const { openCreateTask } = useOverlays()
const viewDoctype = useDoctype<HiveView>('Hive View')

function param(key: string): string {
	const value = route.query[key]
	return typeof value === 'string' ? value : ''
}

const q = computed(() => param('q'))
const statusFilter = computed(() => param('status'))
const priorityFilter = computed(() => param('priority'))
const projectFilter = computed(() => param('project'))
const assigneeFilter = computed(() => param('assignee'))
const viewId = computed(() => param('view_id'))
const activeTaskName = computed(() => param('task') || null)

const viewMode = computed<ViewMode>(() => {
	const value = param('view')
	return value === 'kanban' || value === 'calendar' ? value : 'list'
})

/** Filters live in the URL, so a view, a refresh and a shared link agree. */
function setQuery(patch: Record<string, string>) {
	const query: LocationQueryRaw = {}
	for (const [key, value] of Object.entries(route.query)) {
		if (typeof value === 'string' && value) query[key] = value
	}
	for (const [key, value] of Object.entries(patch)) {
		if (value) query[key] = value
		else delete query[key]
	}
	router.replace({ path: '/tasks', query })
}

function setViewMode(mode: string) {
	setQuery({ view: mode === 'list' ? '' : mode })
}

function resetFilters() {
	setQuery({ q: '', status: '', priority: '', project: '', assignee: '' })
}

// -- grouping and sorting ------------------------------------------------

// Not URL state: these say how the list reads, not what it contains, so a
// shared link and a saved view stay about the filters. Grouping is also what
// keeps a long list readable now that the table has no pages.
const groupBy = ref<TaskGroupField>('status')
const sortKey = ref<TaskSortKey>('due_date')
const sortDirection = ref<TaskSortDirection>('asc')

/** A project badge on every row says nothing once every row shares it. */
const hideProject = computed(() => Boolean(projectFilter.value) || groupBy.value === 'project')

// -- data ----------------------------------------------------------------

const tasks = useList<HiveTask>({
	doctype: 'Hive Task',
	fields: [
		'name',
		'title',
		'project',
		'status',
		'priority',
		'size',
		'milestone',
		'depends_on',
		'assigned_to',
		'is_internal',
		'start_date',
		'due_date',
		'completed_on',
		'pr_link',
		'uat_status',
		'recurrence_frequency',
		'recurrence_end_date',
		'creation',
		'modified',
	],
	filters: { is_archived: 0 },
	orderBy: 'due_date asc',
	limit: 500,
	cacheKey: 'tasks-page',
})

const projects = useList<Pick<HiveProject, 'name' | 'title' | 'is_archived'>>({
	doctype: 'Hive Project',
	// `is_archived` is not a filter on the query: archived projects still own
	// tasks that need a title, they just drop out of the toolbar's options.
	fields: ['name', 'title', 'is_archived'],
	limit: 100,
})

const milestones = useList<Pick<HiveMilestone, 'name' | 'title'>>({
	doctype: 'Hive Milestone',
	fields: ['name', 'title'],
	limit: 500,
})

const assignees = useCall<Record<string, HiveTaskAssignee[]>>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_task_assignees',
	method: 'POST',
})

const assigneesByTask = computed(() => assignees.data ?? {})

const projectTitles = computed(() =>
	Object.fromEntries((projects.data ?? []).map((p) => [p.name, p.title])),
)
const milestoneTitles = computed(() =>
	Object.fromEntries((milestones.data ?? []).map((m) => [m.name, m.title])),
)

/**
 * Everyone on at least one task. That is the whole useful vocabulary of the
 * assignee filter, and it comes out of data the page already has — a member
 * list query would only add a round trip.
 */
const members = computed<HiveTaskAssignee[]>(() => {
	const seen = new Map<string, HiveTaskAssignee>()
	for (const list of Object.values(assigneesByTask.value)) {
		for (const assignee of list) {
			if (!seen.has(assignee.member)) seen.set(assignee.member, assignee)
		}
	}
	return [...seen.values()].sort((a, b) =>
		(a.member_name || a.member).localeCompare(b.member_name || b.member),
	)
})

function refreshAssignees() {
	assignees.reload()
}

function refreshTasks() {
	tasks.reload()
	assignees.reload()
}

// -- filtering -----------------------------------------------------------

const hasFilters = computed(() =>
	Boolean(
		q.value ||
			statusFilter.value ||
			priorityFilter.value ||
			projectFilter.value ||
			assigneeFilter.value,
	),
)

const filtered = computed(() => {
	const query = q.value.toLowerCase()
	return (tasks.data ?? []).filter((task) => {
		if (query) {
			const project = (projectTitles.value[task.project] ?? task.project).toLowerCase()
			const haystack = `${task.name} ${task.title} ${project} ${task.assigned_to ?? ''}`
			if (!haystack.toLowerCase().includes(query)) return false
		}
		if (statusFilter.value && task.status !== statusFilter.value) return false
		if (priorityFilter.value && task.priority !== priorityFilter.value) return false
		if (projectFilter.value && task.project !== projectFilter.value) return false
		if (assigneeFilter.value) {
			const list = assigneesByTask.value[task.name] ?? []
			if (!list.some((a) => a.member === assigneeFilter.value)) return false
		}
		return true
	})
})

// -- task panel ----------------------------------------------------------

function openTask(task: HiveTask) {
	// A row that keeps focus swallows the panel's own Escape handling.
	if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
	setQuery({ task: task.name })
}

function closeTask() {
	setQuery({ task: '' })
}

/** The shell owns the dialog; this is everything it needs from this page. */
const createTaskContext = computed<CreateTaskContext>(() => ({
	defaults: projectFilter.value ? { project: projectFilter.value } : {},
	onCreated: refreshTasks,
}))

// -- saved views ---------------------------------------------------------

const { byId: viewById, refresh: refreshViews } = useHiveViews()

const activeView = computed(() => (viewId.value ? viewById(viewId.value) : null))

const crumbs = computed<BreadcrumbsProps['items']>(() => {
	const items: BreadcrumbsProps['items'] = [{ label: 'Tasks', route: { path: '/tasks' } }]
	if (activeView.value) {
		items.push({
			label: `${activeView.value.emoji || '📋'} ${activeView.value.label}`,
		})
	}
	return items
})

/** Only the filters that are actually set; this is what a view stores. */
const currentFilters = computed(() => {
	const values: Record<string, string> = {
		q: q.value,
		status: statusFilter.value,
		priority: priorityFilter.value,
		project: projectFilter.value,
		assignee: assigneeFilter.value,
	}
	const out: Record<string, string> = {}
	for (const key of FILTER_KEYS) {
		if (values[key]) out[key] = values[key]
	}
	return out
})

/** True once the toolbar or the view mode drifts from what the view stored. */
const viewDirty = computed(() => {
	const view = activeView.value
	if (!view) return false
	if (viewMode.value !== (view.view_type || 'list')) return true
	let saved: Record<string, string>
	try {
		saved = JSON.parse(view.filters_json || '{}')
	} catch {
		saved = {}
	}
	const current = currentFilters.value
	const savedKeys = Object.keys(saved).sort()
	const currentKeys = Object.keys(current).sort()
	if (savedKeys.length !== currentKeys.length) return true
	return savedKeys.some((key, i) => currentKeys[i] !== key || saved[key] !== current[key])
})

const saveViewOpen = ref(false)

const viewMenu = computed<DropdownOptions>(() => {
	if (activeView.value && viewDirty.value) {
		return [
			{ label: 'Save changes', icon: 'lucide-save', onClick: saveViewChanges },
			{
				label: 'Save as new view',
				icon: 'lucide-copy-plus',
				onClick: () => (saveViewOpen.value = true),
			},
		]
	}
	return [{ label: 'Save view', icon: 'lucide-save', onClick: () => (saveViewOpen.value = true) }]
})

/**
 * Mobile has no room for the view-mode buttons, so they fold into the same
 * `…` menu — which is why it renders for clients there and nowhere else.
 */
const headerMenu = computed<DropdownOptions>(() => {
	const items: DropdownOptions = []
	if (!isDesktop.value) {
		items.push(
			...VIEW_MODES.map((mode) => ({
				label: mode.label,
				icon: mode.icon,
				onClick: () => setViewMode(mode.value),
			})),
		)
	}
	if (!isClient.value) items.push(...viewMenu.value)
	return items
})

async function saveViewChanges() {
	const view = activeView.value
	if (!view) return
	try {
		await viewDoctype.setValue.submit({
			name: view.name,
			filters_json: JSON.stringify(currentFilters.value),
			view_type: viewMode.value,
		})
		refreshViews()
		toast.success('View updated')
	} catch {
		toast.error('Could not update the view')
	}
}

function onViewCreated(view: HiveView) {
	refreshViews()
	const query: LocationQueryRaw = { view_id: view.name, ...currentFilters.value }
	if (viewMode.value !== 'list') query.view = viewMode.value
	router.replace({ path: '/tasks', query })
}

usePageMeta(() => ({
	title: activeView.value ? `${activeView.value.label} · Hive` : 'Tasks · Hive',
}))

// On desktop the page owns its scrolling (see `AppShell`), so the content
// column is its own scroll region and the task panel is another. On mobile the
// shell still page-scrolls and the panel is a bottom sheet, so a nested scroll
// region here would collapse to nothing.
const Scroller = computed(() => (isDesktop.value ? ScrollArea : 'div'))
const scrollerProps = computed(() =>
	isDesktop.value
		? {
				class: 'min-h-0 min-w-0 flex-1',
				viewportClass: 'space-y-4 px-3 py-5 pb-10 sm:px-5',
			}
		: { class: 'min-w-0 flex-1 space-y-4 px-3 py-5 pb-10 sm:px-5' },
)
</script>
