<template>
	<div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<Skeleton v-for="n in 6" :key="n" class="h-32 w-full rounded-4" />
	</div>

	<ErrorMessage v-else-if="projects.error" :message="projects.error" />

	<EmptyState
		v-else-if="!projectList.length"
		title="No projects yet"
		description="Projects appear here once they are created."
		icon="lucide-folder"
	/>

	<div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<ProjectCard v-for="project in projectList" :key="project.name" :project="project">
			<div
				class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-gray-5"
			>
				<span class="flex items-center gap-1">
					<span class="lucide-list-checks size-3.5" aria-hidden="true" />
					{{ counts(project.name).open }} open
				</span>
				<span v-if="counts(project.name).internal">
					{{ counts(project.name).internal }} internal
				</span>
				<span>{{ counts(project.name).total }} total</span>
			</div>
		</ProjectCard>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ErrorMessage, Skeleton, useList } from 'frappe-ui'
import ProjectCard, { type ProjectCardProject } from '@/components/projects/ProjectCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { HiveProject, HiveTask } from '@/types'

/** Enough projects and tasks for an overview; the Projects page paginates. */
const PROJECT_LIMIT = 100
const TASK_LIMIT = 500

interface TaskCounts {
	total: number
	open: number
	/** Open tasks flagged internal — not visible to client members. */
	internal: number
}

const EMPTY_COUNTS: TaskCounts = { total: 0, open: 0, internal: 0 }

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
		'modified',
	],
	filters: { is_archived: 0 },
	orderBy: 'modified desc',
	limit: PROJECT_LIMIT,
	cacheKey: 'dashboard-projects',
})

const tasks = useList<HiveTask>({
	doctype: 'Hive Task',
	fields: ['name', 'project', 'status', 'is_internal'],
	filters: { is_archived: 0 },
	limit: TASK_LIMIT,
	cacheKey: 'dashboard-project-tasks',
})

const loading = computed(() => projects.loading && !projects.data)
const projectList = computed<ProjectCardProject[]>(() => projects.data ?? [])

const countsByProject = computed(() => {
	const map: Record<string, TaskCounts> = {}
	for (const task of tasks.data ?? []) {
		const entry = (map[task.project] ??= { total: 0, open: 0, internal: 0 })
		entry.total++
		if (task.status === 'Done') continue
		entry.open++
		if (task.is_internal) entry.internal++
	}
	return map
})

function counts(project: string): TaskCounts {
	return countsByProject.value[project] ?? EMPTY_COUNTS
}
</script>
