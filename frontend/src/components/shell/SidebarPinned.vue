<template>
	<SidebarSection v-if="pinned.length" label="Pinned" collapsible>
		<SidebarItem
			v-for="task in tasks.data ?? []"
			:key="task.name"
			icon="lucide-pin"
			:label="task.title"
			:to="{ path: '/tasks', query: { task: task.name } }"
		/>
	</SidebarSection>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { SidebarItem, SidebarSection, useList } from 'frappe-ui'
import { usePinnedTasks } from '@/composables/usePinnedTasks'
import type { HiveTask } from '@/types'

const { pinned } = usePinnedTasks()

const tasks = useList<Pick<HiveTask, 'name' | 'title' | 'status'>>({
	doctype: 'Hive Task',
	fields: ['name', 'title', 'status'],
	filters: computed(() => ({ name: ['in', pinned.value] })),
	limit: 5,
	immediate: false,
})

// Only fetch once something is actually pinned — `name in []` is a wasted call.
watchEffect(() => {
	if (pinned.value.length) tasks.reload()
})
</script>
