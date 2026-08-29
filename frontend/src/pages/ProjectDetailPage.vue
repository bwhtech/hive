<template>
	<template v-if="project.doc">
		<ProjectHeader
			:project="project.doc"
			@save="saveProject"
			@archive="archiveProject"
			@add-task="addTask"
		/>

		<div class="flex min-h-0 flex-1 items-stretch">
			<component :is="Scroller" v-bind="scrollerProps">
				<Tabs v-if="isDesktop" :model-value="tab" @update:model-value="setTab">
					<TabList variant="underline">
						<TabTrigger
							v-for="item in TABS"
							:key="item.value"
							:value="item.value"
							:label="item.label"
							:icon-left="item.icon"
						>
							<template v-if="badges[item.value]" #suffix>
								<Badge
									:label="badges[item.value]!.label"
									:theme="badges[item.value]!.theme"
									variant="subtle"
								/>
							</template>
						</TabTrigger>
					</TabList>
					<TabPanel
						v-for="item in TABS"
						:key="item.value"
						:value="item.value"
						class="pt-4"
					>
						<component :is="panel" v-bind="panelProps" v-on="panelHandlers" />
					</TabPanel>
				</Tabs>

				<template v-else>
					<Select
						class="w-full"
						:model-value="tab"
						:options="TABS"
						aria-label="Project section"
						@update:model-value="setTab"
					/>
					<div class="pt-4">
						<component :is="panel" v-bind="panelProps" v-on="panelHandlers" />
					</div>
				</template>
			</component>

			<TaskPanel
				v-if="activeTaskName"
				:name="activeTaskName"
				@close="setQuery({ task: '' })"
				@changed="reloadTasks"
			/>
		</div>
	</template>

	<PageSkeleton v-else-if="loading" class="px-3 py-5 sm:px-5" :rows="6" />

	<template v-else>
		<AppHeader title="Project" />
		<EmptyState
			icon="lucide-folder-x"
			title="Project not found"
			description="It may have been archived, or you may not have access to it."
		>
			<template #action>
				<Button variant="solid" theme="gray" label="Back to projects" route="/projects" />
			</template>
		</EmptyState>
	</template>
</template>

<script setup lang="ts">
import { computed, markRaw, ref, watch, type Component } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import {
	Badge,
	Button,
	ScrollArea,
	Select,
	TabList,
	TabPanel,
	Tabs,
	TabTrigger,
	toast,
	useCall,
	useDoc,
	useDoctype,
	useKeyboardShortcut,
	useList,
	usePageMeta,
	type BadgeProps,
} from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PageSkeleton from '@/components/common/PageSkeleton.vue'
import ActivityTab from '@/components/projects/ActivityTab.vue'
import MilestonesTab from '@/components/projects/MilestonesTab.vue'
import OverviewTab from '@/components/projects/OverviewTab.vue'
import ProjectHeader from '@/components/projects/ProjectHeader.vue'
import ProjectTasksTab from '@/components/projects/ProjectTasksTab.vue'
import RequestsTab from '@/components/projects/RequestsTab.vue'
import UpdatesTab from '@/components/projects/UpdatesTab.vue'
import TaskPanel from '@/components/tasks/TaskPanel.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import type { HiveMilestone, HiveProject, HiveTask, HiveTaskAssignee } from '@/types'

const props = defineProps<{ id: string }>()

const DEFAULT_TAB = 'tasks'

/** How long the archive toast keeps its Undo, matching `useArchiveWithUndo`. */
const UNDO_DURATION = 6000

const TABS = [
	{ value: 'overview', label: 'Overview', icon: 'lucide-layout-dashboard' },
	{ value: 'tasks', label: 'Tasks', icon: 'lucide-square-check-big' },
	{ value: 'milestones', label: 'Milestones', icon: 'lucide-target' },
	{ value: 'updates', label: 'Updates', icon: 'lucide-newspaper' },
	{ value: 'requests', label: 'Requests', icon: 'lucide-lightbulb' },
	{ value: 'activity', label: 'Activity', icon: 'lucide-history' },
]

const PANELS: Record<string, Component> = {
	overview: markRaw(OverviewTab),
	tasks: markRaw(ProjectTasksTab),
	milestones: markRaw(MilestonesTab),
	updates: markRaw(UpdatesTab),
	requests: markRaw(RequestsTab),
	activity: markRaw(ActivityTab),
}

const route = useRoute()
const router = useRouter()
const { isDesktop } = useBreakpoint()
const { createTaskOpen, openCreateTask } = useOverlays()
const { isClient } = useSession()

function param(key: string): string {
	const value = route.query[key]
	return typeof value === 'string' ? value : ''
}

const activeTaskName = computed(() => param('task') || null)

/** Only `tasks` differs from the React app's default, and only when a task is open. */
const tab = computed(() => {
	if (activeTaskName.value) return 'tasks'
	const value = param('tab')
	return TABS.some((item) => item.value === value) ? value : DEFAULT_TAB
})

function setQuery(patch: Record<string, string>) {
	const query: LocationQueryRaw = {}
	for (const [key, value] of Object.entries(route.query)) {
		if (typeof value === 'string' && value) query[key] = value
	}
	for (const [key, value] of Object.entries(patch)) {
		if (value) query[key] = value
		else delete query[key]
	}
	router.replace({ path: route.path, query })
}

function setTab(value: string | number | undefined) {
	const next = value == null ? DEFAULT_TAB : String(value)
	if (next === tab.value) return
	setQuery({ tab: next === DEFAULT_TAB ? '' : next, task: '' })
}

// -- the project ---------------------------------------------------------

// Frappe names projects `PROJ-#####`; anything else in the URL is a slug and
// costs one extra call to resolve. The URL keeps the slug either way.
const isSlug = computed(() => Boolean(props.id) && !props.id.startsWith('PROJ-'))

const slug = useCall<string, { slug: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.resolve_project_slug',
	method: 'GET',
	params: () => ({ slug: props.id }),
	immediate: false,
})

watch(
	[() => props.id, isSlug],
	([, resolveNeeded]) => {
		if (resolveNeeded) slug.reload()
	},
	{ immediate: true },
)

const projectName = computed(() => (isSlug.value ? (slug.data ?? '') : props.id))

const project = useDoc<HiveProject>({
	doctype: 'Hive Project',
	name: projectName,
})

const loading = computed(
	() =>
		slug.loading ||
		project.loading ||
		(Boolean(projectName.value) && !project.doc && !project.error),
)

async function saveProject(patch: Partial<HiveProject>) {
	try {
		await project.setValue.submit(patch)
	} catch {
		toast.error('Could not update the project')
	}
}

// The undo runs after this page has navigated away, so the write goes through
// the doctype handle rather than this component's own document.
const projectDoctype = useDoctype<HiveProject>('Hive Project')

async function archiveProject() {
	const name = projectName.value
	const path = `/projects/${props.id}`
	try {
		await projectDoctype.setValue.submit({ name, is_archived: 1 })
	} catch {
		toast.error('Could not archive the project')
		return
	}
	router.push('/projects')
	toast.success('Project archived', {
		duration: UNDO_DURATION,
		action: {
			label: 'Undo',
			onClick: async () => {
				try {
					await projectDoctype.setValue.submit({ name, is_archived: 0 })
					router.push(path)
				} catch {
					toast.error('Could not restore the project')
				}
			},
		},
	})
}

// -- tasks and milestones ------------------------------------------------

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
		'is_internal',
		'start_date',
		'due_date',
		'completed_on',
		'pr_link',
		'recurrence_frequency',
		'recurrence_end_date',
		'creation',
		'modified',
	],
	filters: () => ({ project: projectName.value, is_archived: 0 }),
	orderBy: 'due_date asc',
	limit: 500,
	immediate: false,
})

const milestones = useList<HiveMilestone>({
	doctype: 'Hive Milestone',
	fields: ['name', 'title', 'project', 'status', 'target_date', 'description'],
	filters: () => ({ project: projectName.value }),
	orderBy: 'target_date asc',
	limit: 100,
	immediate: false,
})

const assignees = useCall<Record<string, HiveTaskAssignee[]>, { project: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_task_assignees',
	method: 'POST',
	params: () => ({ project: projectName.value }),
	immediate: false,
})

watch(
	projectName,
	(name) => {
		if (!name) return
		tasks.reload()
		milestones.reload()
		assignees.reload()
	},
	{ immediate: true },
)

function reloadTasks() {
	tasks.reload()
	assignees.reload()
}

// -- panels --------------------------------------------------------------

const draftCount = ref(0)
const requestCount = ref(0)

const badges = computed<Record<string, { label: string; theme: BadgeProps['theme'] } | undefined>>(
	() => ({
		tasks: tasks.data?.length
			? { label: String(tasks.data.length), theme: 'gray' as const }
			: undefined,
		updates: draftCount.value
			? {
					label: `${draftCount.value} ${draftCount.value === 1 ? 'draft' : 'drafts'}`,
					theme: 'amber' as const,
				}
			: undefined,
		requests: requestCount.value
			? { label: String(requestCount.value), theme: 'gray' as const }
			: undefined,
	}),
)

const createRequestOpen = ref(false)

/** The shell owns the dialog; this page only supplies the project and reload. */
function addTask() {
	openCreateTask({ projectId: projectName.value, onCreated: reloadTasks })
}

const panel = computed(() => PANELS[tab.value])

/** One props/handlers pair per tab keeps the template to a single `component`. */
const panelProps = computed<Record<string, unknown>>(() => {
	switch (tab.value) {
		case 'overview':
			return {
				project: projectName.value,
				milestones: milestones.data ?? [],
				tasks: tasks.data ?? [],
			}
		case 'milestones':
			return {
				project: projectName.value,
				milestones: milestones.data ?? [],
				tasks: tasks.data ?? [],
				loading: milestones.loading && !milestones.data,
			}
		case 'updates':
			return { project: projectName.value }
		case 'requests':
			return { project: projectName.value, createOpen: createRequestOpen.value }
		case 'activity':
			return { project: projectName.value }
		default:
			return {
				tasks: tasks.data ?? [],
				list: tasks,
				milestones: milestones.data ?? [],
				assigneesByTask: assignees.data ?? {},
				activeTask: activeTaskName.value,
				loading: tasks.loading && !tasks.data,
				readonly: isClient.value,
			}
	}
})

const panelHandlers = computed(() => {
	switch (tab.value) {
		case 'overview':
		case 'milestones':
			return { 'select-task': openTask, changed: () => milestones.reload() }
		case 'updates':
			return { 'draft-count': (count: number) => (draftCount.value = count) }
		case 'requests':
			return {
				count: (count: number) => (requestCount.value = count),
				'update:createOpen': (open: boolean) => (createRequestOpen.value = open),
			}
		case 'activity':
			return {}
		default:
			return { select: openTask, changed: reloadTasks }
	}
})

function openTask(task: HiveTask) {
	// A row that keeps focus swallows the panel's own Escape handling.
	if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
	setQuery({ task: task.name })
}

// -- query-param entry points --------------------------------------------

// `create_task` waits for the docname: on a slug URL it is one request away,
// and the dialog is handed the project once, when it opens.
watch(
	() => [param('create_task'), param('create_feature_request'), projectName.value] as const,
	([task, request, project]) => {
		if (task === '1' && project) {
			addTask()
			setQuery({ create_task: '' })
		}
		if (request === '1') {
			createRequestOpen.value = true
			setQuery({ create_feature_request: '', tab: 'requests' })
		}
	},
	{ immediate: true },
)

// -- shortcuts -----------------------------------------------------------

/** Tab letters only fire on the page itself, never behind the open task panel. */
const shortcutsEnabled = () => !activeTaskName.value && !createTaskOpen.value

useKeyboardShortcut([
	{
		combo: 'T',
		description: 'Add task',
		group: 'Project',
		enabled: () => shortcutsEnabled() && !isClient.value,
		handler: addTask,
	},
	...(
		[
			['O', 'overview', 'Overview tab'],
			['M', 'milestones', 'Milestones tab'],
			['U', 'updates', 'Updates tab'],
			['R', 'requests', 'Requests tab'],
			['A', 'activity', 'Activity tab'],
		] as const
	).map(([combo, value, description]) => ({
		combo,
		description,
		group: 'Project',
		enabled: shortcutsEnabled,
		handler: () => setTab(value),
	})),
])

usePageMeta(() => ({ title: `${project.doc?.title ?? 'Project'} · Hive` }))

// The panel beside this content scrolls on its own, so this column does too —
// see the `scroll` prop on `DesktopShell` in `AppShell`. Mobile still page
// scrolls, where a nested region would have no height to work with.
const Scroller = computed(() => (isDesktop.value ? ScrollArea : 'div'))
const scrollerProps = computed(() =>
	isDesktop.value
		? { class: 'min-h-0 min-w-0 flex-1', viewportClass: 'px-3 py-5 pb-10 sm:px-5' }
		: { class: 'min-w-0 flex-1 px-3 py-5 pb-10 sm:px-5' },
)
</script>
