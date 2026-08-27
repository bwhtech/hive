<template>
	<AppHeader title="Projects">
		<template #actions>
			<Button
				v-if="!isClient"
				variant="solid"
				theme="gray"
				icon-left="lucide-plus"
				label="New Project"
				@click="createProjectOpen = true"
			/>
		</template>
	</AppHeader>

	<div class="space-y-4 px-3 py-5 pb-10 sm:px-5">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<TextInput
				v-model="search"
				class="w-full sm:max-w-xs"
				placeholder="Search projects…"
				aria-label="Search projects"
			>
				<template #prefix>
					<span class="lucide-search size-4 text-ink-gray-5" aria-hidden="true" />
				</template>
			</TextInput>

			<Select
				v-model="statusFilter"
				class="sm:w-40"
				:options="STATUS_OPTIONS"
				aria-label="Filter by status"
			/>

			<Select
				v-model="scopeFilter"
				class="sm:w-40"
				:options="SCOPE_OPTIONS"
				aria-label="Filter by scope"
			/>

			<TabButtons
				:model-value="myOnly ? 'mine' : 'all'"
				:options="OWNER_OPTIONS"
				@update:model-value="myOnly = $event === 'mine'"
			/>
		</div>

		<div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<div
				v-for="n in 6"
				:key="n"
				class="space-y-3 rounded-4 border border-outline-gray-1 p-4"
			>
				<Skeleton class="h-5 w-3/4" />
				<Skeleton class="h-4 w-1/2" />
				<Skeleton class="h-4 w-full" />
			</div>
		</div>

		<ErrorMessage v-else-if="projects.error" :message="projects.error.message" />

		<EmptyState
			v-else-if="!filtered.length"
			icon="lucide-folder"
			:title="hasFilters ? 'No projects match your filters' : 'No projects yet'"
			:description="
				hasFilters
					? 'Try adjusting your search or filters.'
					: 'Projects will appear here once created.'
			"
		>
			<template v-if="!hasFilters && !isClient" #action>
				<Button
					variant="solid"
					theme="gray"
					icon-left="lucide-plus"
					label="New Project"
					@click="createProjectOpen = true"
				/>
			</template>
		</EmptyState>

		<template v-else>
			<p class="text-sm text-ink-gray-5">
				{{ filtered.length }} {{ filtered.length === 1 ? 'project' : 'projects' }}
				<span v-if="hasFilters">matching filters</span>
			</p>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<ProjectCard v-for="project in filtered" :key="project.name" :project="project" />
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
	Button,
	ErrorMessage,
	Select,
	Skeleton,
	TabButtons,
	TextInput,
	useCall,
	useList,
	usePageMeta,
} from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/lib/storage'
import { PROJECT_STATUSES, type HiveProject } from '@/types'

usePageMeta(() => ({ title: 'Projects · Hive' }))

const ALL_STATUSES = 'all'
const ALL_SCOPES = 'All'

const STATUS_OPTIONS = [
	{ label: 'All statuses', value: ALL_STATUSES },
	...PROJECT_STATUSES.map((status) => ({ label: status, value: status })),
]

/** Membership filter. A pair of buttons reads faster here than a switch. */
const OWNER_OPTIONS = [
	{ label: 'All', value: 'all' },
	{ label: 'My projects', value: 'mine' },
]

const SCOPE_OPTIONS = [
	{ label: 'All projects', value: ALL_SCOPES },
	{ label: 'Internal', value: 'Internal' },
	{ label: 'External', value: 'External' },
]

const { isClient } = useSession()
const { createProjectOpen } = useOverlays()

const search = ref('')
const statusFilter = ref(readStorage(STORAGE_KEYS.projectsStatusFilter, ALL_STATUSES))
const scopeFilter = ref(readStorage(STORAGE_KEYS.projectsScopeFilter, ALL_SCOPES))
const myOnly = ref(readStorage(STORAGE_KEYS.projectsMyOnly, false))

watch(statusFilter, (value) => writeStorage(STORAGE_KEYS.projectsStatusFilter, value))
watch(scopeFilter, (value) => writeStorage(STORAGE_KEYS.projectsScopeFilter, value))
watch(myOnly, (value) => writeStorage(STORAGE_KEYS.projectsMyOnly, value))

const projects = useList<HiveProject>({
	doctype: 'Hive Project',
	fields: [
		'name',
		'title',
		'slug',
		'status',
		'project_type',
		'client',
		'description',
		'is_private',
		'creation',
		'modified',
	],
	filters: { is_archived: 0 },
	orderBy: 'modified desc',
	limit: 100,
	cacheKey: 'projects-list',
})

/** Project names the current user is a member of — drives the "My projects" switch. */
const memberships = useCall<string[]>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_my_project_memberships',
	method: 'GET',
	cacheKey: 'my-project-memberships',
})

const myProjectNames = computed(() => new Set(memberships.data ?? []))

// The memberships call only matters while "My projects" is on — without it the
// grid would flash an empty state before the names arrive.
const loading = computed(
	() =>
		(projects.loading && !projects.data) ||
		(myOnly.value && memberships.loading && !memberships.data),
)

const hasFilters = computed(
	() =>
		Boolean(search.value) ||
		statusFilter.value !== ALL_STATUSES ||
		scopeFilter.value !== ALL_SCOPES ||
		myOnly.value,
)

const filtered = computed(() => {
	const query = search.value.trim().toLowerCase()
	return (projects.data ?? []).filter((project) => {
		if (myOnly.value && !myProjectNames.value.has(project.name)) return false
		if (query) {
			const haystack = [project.title, project.client, project.project_type]
				.filter(Boolean)
				.join(' ')
				.toLowerCase()
			if (!haystack.includes(query)) return false
		}
		if (statusFilter.value !== ALL_STATUSES && project.status !== statusFilter.value)
			return false
		if (scopeFilter.value === 'Internal' && project.client) return false
		if (scopeFilter.value === 'External' && !project.client) return false
		return true
	})
})
</script>
