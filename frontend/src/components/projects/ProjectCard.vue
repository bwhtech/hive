<template>
	<router-link
		:to="`/projects/${project.slug || project.name}`"
		data-testid="project-card"
		:data-project="project.name"
		class="flex flex-col gap-2 rounded-4 border border-outline-gray-1 bg-surface-base p-4 transition-colors hover:bg-surface-gray-1"
	>
		<div class="flex min-w-0 items-start gap-2">
			<ProjectAvatar
				:name="project.name"
				:title="project.title"
				:icon="project.icon"
				:color="project.color"
				size="lg"
				hide-tooltip
			/>
			<span class="min-w-0 flex-1 truncate text-base-semibold text-ink-gray-8">
				{{ project.title }}
			</span>
			<Tooltip v-if="project.is_private" text="Private project">
				<span class="lucide-lock size-3.5 shrink-0 text-ink-gray-5" aria-label="Private" />
			</Tooltip>
			<Badge
				:label="project.status"
				:theme="projectStatusTheme(project.status)"
				variant="subtle"
			/>
		</div>

		<p v-if="meta" class="truncate text-sm text-ink-gray-5">{{ meta }}</p>

		<p v-if="summary" class="line-clamp-2 text-p-sm text-ink-gray-6">{{ summary }}</p>

		<slot />
	</router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Tooltip } from 'frappe-ui'
import ProjectAvatar from '@/components/common/ProjectAvatar.vue'
import { projectStatusTheme } from '@/lib/status'
import { stripHtml } from '@/lib/text'
import type { Bool, ProjectStatus } from '@/types'

/**
 * The fields a card needs. A `useList` row carries all of them; anything
 * optional simply does not render its line. `icon` and `color` are optional
 * twice over — a project may also have neither, and `ProjectAvatar` falls back.
 */
export interface ProjectCardProject {
	name: string
	title: string
	slug: string
	status: ProjectStatus
	icon?: string
	color?: string
	project_type?: string
	client?: string
	description?: string
	is_private?: Bool
}

const props = defineProps<{ project: ProjectCardProject }>()

defineSlots<{
	/** Extra meta under the description — task counts, for instance. */
	default?: () => unknown
}>()

/** `type · client`, skipping whichever half is missing. */
const meta = computed(() =>
	[props.project.project_type, props.project.client].filter(Boolean).join(' · '),
)

// Descriptions are stored as rich text; the card shows two lines of plain text.
const summary = computed(() => stripHtml(props.project.description))
</script>
