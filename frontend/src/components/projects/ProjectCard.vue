<template>
	<router-link
		:to="`/projects/${project.slug || project.name}`"
		class="flex flex-col gap-2 rounded-4 border border-outline-gray-1 bg-surface-base p-4 transition-colors hover:bg-surface-gray-1"
	>
		<div class="flex min-w-0 items-start gap-2">
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
	</router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Tooltip } from 'frappe-ui'
import { projectStatusTheme } from '@/lib/status'
import { stripHtml } from '@/lib/text'
import type { HiveProject } from '@/types'

/** The fields a card needs — a `useList` row, not necessarily a full document. */
export type ProjectCardProject = Pick<
	HiveProject,
	'name' | 'title' | 'slug' | 'status' | 'project_type' | 'client' | 'description' | 'is_private'
>

const props = defineProps<{ project: ProjectCardProject }>()

/** `type · client`, skipping whichever half is missing. */
const meta = computed(() =>
	[props.project.project_type, props.project.client].filter(Boolean).join(' · '),
)

// Descriptions are stored as rich text; the card shows two lines of plain text.
const summary = computed(() => stripHtml(props.project.description))
</script>
