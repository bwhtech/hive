<template>
	<div class="mt-4 flex h-7 items-center justify-between">
		<SidebarLabel>
			<!-- The label doubles as the link to the full grid: with Projects out
			     of the nav block, this is the sidebar's only route to /projects. -->
			<RouterLink
				to="/projects"
				accesskey="p"
				class="rounded-3 focus-visible:focus-ring"
				:class="isProjectsRoute ? 'text-ink-gray-7' : 'hover:text-ink-gray-7'"
				:aria-current="isProjectsRoute ? 'page' : undefined"
			>
				Projects
			</RouterLink>
		</SidebarLabel>
		<Button
			v-if="!isClient"
			variant="ghost"
			icon="lucide-plus text-ink-gray-5"
			label="New project"
			@click="createProjectOpen = true"
		/>
	</div>

	<!-- Rows the height of a SidebarItem, so the list does not jump when the
	     real projects land. -->
	<div
		v-if="showSkeleton"
		class="mt-0.5 flex flex-col gap-0.5"
		data-testid="sidebar-projects-skeleton"
	>
		<div v-for="n in 4" :key="n" class="flex h-7 items-center gap-2 px-2">
			<Skeleton class="size-4 shrink-0 rounded-1" />
			<Skeleton class="h-3 rounded-full" :style="{ width: `${skeletonWidths[n - 1]}%` }" />
		</div>
	</div>

	<nav v-else class="mt-0.5 flex flex-col gap-0.5">
		<!-- Every row action lives in a right-click menu, so the row itself is
		     nothing but the link: no hover buttons taking up the trailing zone. -->
		<ContextMenu
			v-for="project in orderedProjects"
			:key="project.name"
			:options="menuFor(project)"
		>
			<SidebarItem
				:label="project.title"
				:to="`/projects/${project.slug || project.name}`"
				:active="isActive(project)"
				data-testid="sidebar-project"
				:data-project="project.name"
				:data-pinned="isPinned(project.name) ? 'true' : undefined"
			>
				<template #prefix>
					<IdentityAvatar
						:name="project.name"
						:icon="project.icon"
						:color="project.color"
						:avatar="project.avatar"
						size="xs"
						hide-tooltip
					/>
				</template>

				<template #suffix>
					<span class="mr-1.5 flex items-center gap-1 text-ink-gray-4">
						<span
							v-if="isPinned(project.name)"
							class="lucide-pin size-3 shrink-0"
							aria-label="Pinned"
							role="img"
						/>
						<span
							v-if="openCount(project.name)"
							class="min-w-4 text-center text-xs tabular-nums leading-none"
							:aria-label="`${openCount(project.name)} open tasks`"
						>
							{{ openCount(project.name) }}
						</span>
					</span>
				</template>
			</SidebarItem>
		</ContextMenu>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
	Button,
	ContextMenu,
	SidebarItem,
	SidebarLabel,
	Skeleton,
	dialog,
	toast,
	useCall,
	useDoctype,
	useList,
	type ContextMenuOptions,
} from 'frappe-ui'
import IdentityAvatar from '@/components/common/IdentityAvatar.vue'
import { useArchiveWithUndo } from '@/composables/useArchiveWithUndo'
import { useOverlays } from '@/composables/useOverlays'
import { usePinnedProjects } from '@/composables/usePinnedProjects'
import { useSession } from '@/composables/useSession'
import type { HiveProject } from '@/types'

/** A task still counts against its project until it is done or shelved. */
const OPEN_TASK_FILTERS = JSON.stringify({
	is_archived: 0,
	status: ['not in', ['Done', 'Someday']],
})

/** Varied so the placeholder reads as a list of titles, not a barcode. */
const skeletonWidths = [62, 44, 70, 52]

type SidebarProject = Pick<HiveProject, 'name' | 'title' | 'slug' | 'icon' | 'color' | 'avatar'>

const route = useRoute()
const router = useRouter()
const { isClient } = useSession()
const { createProjectOpen } = useOverlays()
const { pinned, isPinned, toggle: togglePin } = usePinnedProjects()

const projects = useList<SidebarProject>({
	doctype: 'Hive Project',
	fields: ['name', 'title', 'slug', 'icon', 'color', 'avatar'],
	filters: { is_archived: 0 },
	orderBy: 'modified desc',
	limit: 50,
	cacheKey: 'sidebar-projects',
})

// Only the very first load has nothing to show; a reload keeps the old rows.
const showSkeleton = computed(() => projects.loading && !projects.data)

/** Pinned projects first, in pin order; everything else keeps the query's order. */
const orderedProjects = computed<SidebarProject[]>(() => {
	const rows = projects.data ?? []
	const byName = new Map(rows.map((project) => [project.name, project]))
	const top = pinned.value
		.map((name) => byName.get(name))
		.filter((project): project is SidebarProject => project !== undefined)
	const rest = rows.filter((project) => !isPinned(project.name))
	return [...top, ...rest]
})

// One grouped aggregate for every badge — Frappe's own list-view counter, so
// the sidebar never pulls a task row just to count it. It reads through
// `frappe.get_list`, so a client only ever counts what they can already see.
const openCounts = useCall<
	Array<{ name: string; count: number }>,
	{ doctype: string; current_filters: string; field: string }
>({
	url: '/api/v2/method/frappe.desk.listview.get_group_by_count',
	method: 'GET',
	params: {
		doctype: 'Hive Task',
		current_filters: OPEN_TASK_FILTERS,
		field: 'project',
	},
	cacheKey: 'sidebar-project-open-counts',
})

const countByProject = computed(() => {
	const map = new Map<string, number>()
	for (const row of openCounts.data ?? []) map.set(row.name, row.count)
	return map
})

function openCount(project: string): number {
	return countByProject.value.get(project) ?? 0
}

const isProjectsRoute = computed(() => route.path === '/projects')

/** `/projects/:id` takes a slug or a name, so the active row matches either. */
const activeProjectId = computed(() =>
	route.name === 'ProjectDetail' ? String(route.params.id ?? '') : '',
)

function isActive(project: SidebarProject): boolean {
	if (!activeProjectId.value) return false
	return activeProjectId.value === project.slug || activeProjectId.value === project.name
}

// -- row actions ---------------------------------------------------------

const projectDoctype = useDoctype<HiveProject>('Hive Project')
const archiveProject = useArchiveWithUndo('Hive Project')

/** Pinning is per user, so a client gets it too; editing stays with the team. */
function menuFor(project: SidebarProject): ContextMenuOptions {
	const pinnedRow = isPinned(project.name)
	const options: ContextMenuOptions = [
		{
			label: pinnedRow ? 'Unpin' : 'Pin to top',
			icon: pinnedRow ? 'lucide-pin-off' : 'lucide-pin',
			onClick: () => togglePin(project.name),
		},
	]
	if (isClient.value) return options

	options.push(
		{ label: 'Rename', icon: 'lucide-pencil', onClick: () => rename(project) },
		{
			label: 'Archive',
			icon: 'lucide-archive',
			theme: 'red',
			onClick: () => confirmArchive(project),
		},
	)
	return options
}

function rename(project: SidebarProject) {
	dialog.prompt({
		title: 'Rename project',
		confirmLabel: 'Rename',
		fields: [{ name: 'title', label: 'Title', required: true, defaultValue: project.title }],
		onConfirm: async ({ values }) => {
			const title = String(values.title ?? '').trim()
			if (!title || title === project.title) return
			try {
				await projectDoctype.setValue.submit({ name: project.name, title })
			} catch {
				toast.error('Could not rename the project')
				return
			}
			projects.reload()
		},
	})
}

function confirmArchive(project: SidebarProject) {
	dialog.confirm({
		title: 'Archive project',
		message: `Archive "${project.title}"? Its tasks stay put, and you can undo this from the toast.`,
		confirmLabel: 'Archive',
		theme: 'red',
		onConfirm: () => archiveProject(project.name, project.title, () => onArchived(project)),
	})
}

// Runs on archive and again on undo: the list refetches either way, and a
// page that was showing the archived project has nowhere to stand.
function onArchived(project: SidebarProject) {
	projects.reload()
	if (isActive(project) && !projectStillOpen(project)) router.push('/projects')
}

function projectStillOpen(project: SidebarProject) {
	return (projects.data ?? []).some((row) => row.name === project.name)
}
</script>
