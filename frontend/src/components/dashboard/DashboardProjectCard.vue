<template>
	<RouterLink
		:to="`/projects/${project.slug || project.name}`"
		class="flex flex-col gap-2 rounded-5 border border-outline-gray-1 bg-surface-base p-4 transition-colors hover:bg-surface-gray-1"
	>
		<p class="truncate text-base font-medium text-ink-gray-8">{{ project.title }}</p>
		<div class="flex flex-wrap items-center gap-1.5">
			<Badge
				:theme="projectStatusTheme(project.status)"
				variant="subtle"
				size="sm"
				:label="project.status"
			/>
			<Badge
				v-if="project.project_type"
				variant="outline"
				size="sm"
				:label="project.project_type"
			/>
		</div>
		<p v-if="project.client" class="truncate text-sm text-ink-gray-5">{{ project.client }}</p>
		<slot />
	</RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Badge } from 'frappe-ui'
import { projectStatusTheme } from '@/lib/status'
import type { ProjectStatus } from '@/types'

/** The fields a dashboard card needs — a subset of `HiveProject`. */
export interface DashboardProject {
	name: string
	title: string
	slug: string
	status: ProjectStatus
	project_type: string
	client: string
}

defineProps<{ project: DashboardProject }>()

defineSlots<{
	/** Extra meta under the client line — task counts, for instance. */
	default?: () => unknown
}>()
</script>
