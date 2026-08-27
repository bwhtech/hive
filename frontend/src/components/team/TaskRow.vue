<template>
	<router-link
		class="flex items-center gap-2 rounded-2 px-2 py-1.5 hover:bg-surface-gray-2"
		:to="{ path: `/projects/${task.project}`, query: { task: task.name } }"
	>
		<span
			class="size-1.5 shrink-0 rounded-full"
			:class="statusDotClass(task.status)"
			aria-hidden="true"
		/>
		<span class="min-w-0 flex-1 truncate text-sm text-ink-gray-8">{{ task.title }}</span>
		<Badge
			v-if="showProject && task.project_title"
			:label="task.project_title"
			theme="gray"
			variant="subtle"
		/>
		<span v-else class="shrink-0 text-xs text-ink-gray-5">{{ task.status }}</span>
	</router-link>
</template>

<script setup lang="ts">
import { Badge } from 'frappe-ui'
import { statusDotClass } from '@/lib/status'
import type { MemberTask } from '@/components/team/types'

defineProps<{
	task: MemberTask
	/** Status grouping already says the status, so it shows the project instead. */
	showProject?: boolean
}>()
</script>
