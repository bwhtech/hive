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

	<nav class="mt-0.5 flex flex-col gap-0.5">
		<SidebarItem
			v-for="project in projects.data ?? []"
			:key="project.name"
			:label="project.title"
			:to="`/projects/${project.slug || project.name}`"
			:active="isActive(project)"
			data-testid="sidebar-project"
			:data-project="project.name"
		>
			<template #prefix>
				<ProjectAvatar
					:name="project.name"
					:icon="project.icon"
					:color="project.color"
					size="xs"
					hide-tooltip
				/>
			</template>

			<template #suffix>
				<Badge
					v-if="openCount(project.name)"
					class="mr-1"
					variant="ghost"
					:label="String(openCount(project.name))"
				/>
			</template>
		</SidebarItem>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Badge, Button, SidebarItem, SidebarLabel, useCall, useList } from 'frappe-ui'
import ProjectAvatar from '@/components/common/ProjectAvatar.vue'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import type { HiveProject } from '@/types'

/** A task still counts against its project until it is done or shelved. */
const OPEN_TASK_FILTERS = JSON.stringify({
	is_archived: 0,
	status: ['not in', ['Done', 'Someday']],
})

type SidebarProject = Pick<HiveProject, 'name' | 'title' | 'slug' | 'icon' | 'color'>

const route = useRoute()
const { isClient } = useSession()
const { createProjectOpen } = useOverlays()

const projects = useList<SidebarProject>({
	doctype: 'Hive Project',
	fields: ['name', 'title', 'slug', 'icon', 'color'],
	filters: { is_archived: 0 },
	orderBy: 'modified desc',
	limit: 50,
	cacheKey: 'sidebar-projects',
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
</script>
