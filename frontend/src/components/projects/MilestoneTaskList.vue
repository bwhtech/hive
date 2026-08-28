<template>
	<p v-if="!tasks.length" class="py-1 text-xs text-ink-gray-5">No tasks in this milestone</p>
	<div v-else class="divide-y divide-outline-gray-1">
		<button
			v-for="task in tasks"
			:key="task.name"
			type="button"
			class="flex w-full items-center gap-2 rounded-2 px-1 py-1.5 text-left hover:bg-surface-gray-2"
			@click="emit('select', task)"
		>
			<span
				class="size-1.5 shrink-0 rounded-full"
				:class="statusDotClass(task.status)"
				aria-hidden="true"
			/>
			<span class="min-w-0 flex-1 truncate text-sm text-ink-gray-8">{{ task.title }}</span>
			<span
				v-if="task.due_date"
				class="shrink-0 text-xs"
				:class="
					isOverdue(task.due_date) && task.status !== 'Done'
						? 'text-ink-red-6'
						: 'text-ink-gray-5'
				"
			>
				{{ formatDate(task.due_date, 'D MMM') }}
			</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import { formatDate, isOverdue } from '@/lib/dates'
import { statusDotClass } from '@/lib/status'
import type { HiveTask } from '@/types'

defineProps<{ tasks: HiveTask[] }>()

const emit = defineEmits<{ select: [task: HiveTask] }>()
</script>
