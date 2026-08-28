<template>
	<span class="flex items-center whitespace-nowrap text-sm text-ink-gray-5">
		<span
			class="mr-1 size-4 shrink-0"
			:class="[priorityIcon(priority), priorityColor(priority)]"
			aria-hidden="true"
		/>
		{{ priority }}
	</span>
</template>

<script setup lang="ts">
import { priorityColor, priorityIcon } from '@/lib/status'
import type { TaskPriority } from '@/types'

/**
 * Priority as a signal-bar glyph plus its name — no longer a `Badge`, since a
 * row of coloured pills fights the title for attention. The name stays so the
 * board card and the list read the same.
 */
defineProps<{ priority: TaskPriority | null | undefined }>()
</script>
