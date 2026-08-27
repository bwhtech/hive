<template>
	<CommandPalette
		v-model:open="open"
		v-model:query="query"
		:filterable="false"
		title="Command palette"
		@select="onSelect"
	>
		<CommandPaletteInput :placeholder="placeholder" />

		<p v-if="search.loading" class="px-4 py-6 text-center text-sm text-ink-gray-5">
			Searching…
		</p>

		<CommandPaletteList>
			<CommandPaletteGroup
				v-if="tasks.length"
				:label="projectId ? 'Tasks in project' : 'Tasks'"
			>
				<CommandPaletteItem
					v-for="task in tasks"
					:key="task.name"
					:value="{ kind: 'task', task }"
				>
					<template #prefix>
						<span
							class="lucide-square-check-big mr-1.5 size-4 text-ink-gray-5"
							aria-hidden="true"
						/>
					</template>
					{{ task.title }}
					<template v-if="!projectId && task.project_title" #suffix>
						<span class="text-xs text-ink-gray-5">{{ task.project_title }}</span>
					</template>
				</CommandPaletteItem>
			</CommandPaletteGroup>

			<CommandPaletteGroup v-if="projects.length" label="Projects">
				<CommandPaletteItem
					v-for="project in projects"
					:key="project.name"
					:value="{ kind: 'project', project }"
				>
					<template #prefix>
						<span
							class="lucide-folder mr-1.5 size-4 text-ink-gray-5"
							aria-hidden="true"
						/>
					</template>
					{{ project.title }}
					<template #suffix>
						<span class="text-xs text-ink-gray-5">{{ project.status }}</span>
					</template>
				</CommandPaletteItem>
			</CommandPaletteGroup>

			<CommandPaletteGroup
				v-for="group in commandGroups"
				:key="group.label"
				:label="group.label"
			>
				<CommandPaletteItem
					v-for="command in group.commands"
					:key="command.id"
					:value="{ kind: 'command', id: command.id }"
				>
					<template #prefix>
						<span
							:class="[command.icon, 'mr-1.5 size-4 text-ink-gray-5']"
							aria-hidden="true"
						/>
					</template>
					{{ command.label }}
					<template v-if="command.shortcut" #suffix>
						<KeyboardShortcut :combo="command.shortcut" />
					</template>
				</CommandPaletteItem>
			</CommandPaletteGroup>
		</CommandPaletteList>

		<CommandPaletteEmpty>
			{{ query.trim().length === 1 ? 'Keep typing…' : 'Nothing matches that.' }}
		</CommandPaletteEmpty>

		<CommandPaletteFooter>
			<KeyboardShortcut combo="Enter" /> to run · <KeyboardShortcut combo="Esc" /> to close
		</CommandPaletteFooter>
	</CommandPalette>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KeyboardShortcut, useCall } from 'frappe-ui'
import {
	CommandPalette,
	CommandPaletteEmpty,
	CommandPaletteFooter,
	CommandPaletteGroup,
	CommandPaletteInput,
	CommandPaletteItem,
	CommandPaletteList,
} from 'frappe-ui/experimental'
import { useCelebrate } from '@/composables/useCelebrate'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'

interface TaskResult {
	name: string
	title: string
	project: string
	project_title?: string
	status: string
}

interface ProjectResult {
	name: string
	title: string
	slug: string
	status: string
}

interface Command {
	id: string
	label: string
	icon: string
	keywords: string[]
	shortcut?: string
	run: () => void
}

/** Below this the server search is noise, so only the commands show. */
const MIN_QUERY = 2
const SEARCH_DEBOUNCE = 250
const SEARCH_LIMIT = 8

const route = useRoute()
const router = useRouter()
const { isClient } = useSession()
const { celebrate } = useCelebrate()
const { commandPaletteOpen: open, createProjectOpen, openCreateTask, openSettings } = useOverlays()

const query = ref('')

/** A project route puts the palette in that project's context, as in the React app. */
const projectId = computed(() => {
	const match = /^\/projects\/([^/]+)/.exec(route.path)
	return match ? decodeURIComponent(match[1]) : null
})

const placeholder = computed(() =>
	projectId.value
		? 'Search tasks in this project, or type a command…'
		: 'Search projects and tasks, or type a command…',
)

const search = useCall<
	{ projects: ProjectResult[]; tasks: TaskResult[] },
	{ query: string; project?: string; limit: number }
>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.search',
	method: 'GET',
	params: () => ({
		query: query.value.trim(),
		...(projectId.value ? { project: projectId.value } : {}),
		limit: SEARCH_LIMIT,
	}),
	immediate: false,
})

const results = ref<{ projects: ProjectResult[]; tasks: TaskResult[] }>({ projects: [], tasks: [] })

let debounce: ReturnType<typeof setTimeout> | undefined

watch(query, (text) => {
	clearTimeout(debounce)
	if (text.trim().length < MIN_QUERY) {
		results.value = { projects: [], tasks: [] }
		return
	}
	debounce = setTimeout(() => {
		search.reload().then(() => {
			results.value = search.data ?? { projects: [], tasks: [] }
		})
	}, SEARCH_DEBOUNCE)
})

watch(open, (isOpen) => {
	if (isOpen) return
	clearTimeout(debounce)
	query.value = ''
	results.value = { projects: [], tasks: [] }
})

const tasks = computed(() => results.value.tasks)
/** Inside a project the palette is scoped to it, so project hits are noise. */
const projects = computed(() => (projectId.value ? [] : results.value.projects))

// -- commands ------------------------------------------------------------

function go(path: string) {
	router.push(path)
}

// The shell mounts both create dialogs, so they open in place. A task created
// inside a project still routes through the page, which alone knows the
// docname behind the slug and has the list to refresh.
function createTask() {
	if (projectId.value) {
		router.push({ path: `/projects/${projectId.value}`, query: { create_task: '1' } })
		return
	}
	openCreateTask()
}

function createProject() {
	createProjectOpen.value = true
}

function createFeatureRequest() {
	router.push({
		path: `/projects/${projectId.value}`,
		query: { tab: 'requests', create_feature_request: '1' },
	})
}

const allCommands = computed<{ label: string; commands: Command[] }[]>(() => {
	const create: Command[] = [
		{
			id: 'new-task',
			label: projectId.value ? 'New task in this project' : 'New task',
			icon: 'lucide-plus',
			keywords: ['new', 'create', 'add', 'task'],
			shortcut: projectId.value ? 'T' : undefined,
			run: createTask,
		},
	]
	if (!isClient.value) {
		create.push({
			id: 'new-project',
			label: 'New project',
			icon: 'lucide-folder-plus',
			keywords: ['new', 'create', 'add', 'project'],
			run: createProject,
		})
	}
	if (projectId.value) {
		create.push({
			id: 'new-feature-request',
			label: 'New feature request',
			icon: 'lucide-lightbulb',
			keywords: ['new', 'create', 'add', 'feature', 'request', 'idea'],
			run: createFeatureRequest,
		})
	}

	const groups: { label: string; commands: Command[] }[] = [
		{ label: 'Create', commands: create },
		{
			label: 'Navigation',
			commands: [
				{
					id: 'go-dashboard',
					label: 'Go to Dashboard',
					icon: 'lucide-layout-dashboard',
					keywords: ['home', 'overview'],
					run: () => go('/'),
				},
				{
					id: 'go-projects',
					label: 'Go to Projects',
					icon: 'lucide-folder',
					keywords: ['folders'],
					run: () => go('/projects'),
				},
				{
					id: 'go-tasks',
					label: 'Go to Tasks',
					icon: 'lucide-square-check-big',
					keywords: ['todos', 'board', 'kanban'],
					run: () => go('/tasks'),
				},
				{
					id: 'go-team',
					label: 'Go to Team',
					icon: 'lucide-users',
					keywords: ['members', 'people'],
					run: () => go('/team'),
				},
			],
		},
	]

	if (!isClient.value) {
		groups.push({
			label: 'Actions',
			commands: [
				{
					id: 'settings',
					label: 'Open settings',
					icon: 'lucide-settings',
					keywords: ['preferences', 'config'],
					shortcut: 'Mod+Comma',
					run: () => openSettings('profile'),
				},
			],
		})
	}

	groups.push({
		label: 'Fun',
		commands: [
			{
				id: 'celebrate',
				label: 'Celebrate',
				icon: 'lucide-party-popper',
				keywords: ['confetti', 'party'],
				shortcut: 'Shift+T',
				run: () => celebrate(),
			},
		],
	})

	return groups
})

// The palette's own filter is off because the search rows come pre-ranked from
// the server, so the command rows filter here instead.
const commandGroups = computed(() => {
	const needle = query.value.trim().toLowerCase()
	if (!needle) return allCommands.value
	return allCommands.value
		.map((group) => ({
			label: group.label,
			commands: group.commands.filter((command) =>
				[command.label, ...command.keywords].some((text) =>
					text.toLowerCase().includes(needle),
				),
			),
		}))
		.filter((group) => group.commands.length > 0)
})

// -- selection -----------------------------------------------------------

type Selection =
	| { kind: 'task'; task: TaskResult }
	| { kind: 'project'; project: ProjectResult }
	| { kind: 'command'; id: string }

function onSelect(value: unknown) {
	const selection = value as Selection
	if (selection.kind === 'task') {
		router.push({
			path: `/projects/${selection.task.project}`,
			query: { task: selection.task.name },
		})
		return
	}
	if (selection.kind === 'project') {
		go(`/projects/${selection.project.slug || selection.project.name}`)
		return
	}
	const command = allCommands.value
		.flatMap((group) => group.commands)
		.find((item) => item.id === selection.id)
	command?.run()
}
</script>
