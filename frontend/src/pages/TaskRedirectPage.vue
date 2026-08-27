<template>
	<div class="grid h-full place-items-center">
		<Spinner class="size-6 text-ink-gray-5" />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Spinner, useDoc } from 'frappe-ui'
import type { HiveTask } from '@/types'

/** `/tasks/:id` is a deep link — resolve the task's project and hand over. */
const props = defineProps<{ id: string }>()
const router = useRouter()

const task = useDoc<Pick<HiveTask, 'name' | 'project'> & { name: string }>({
	doctype: 'Hive Task',
	name: () => props.id,
})

task.onSuccess((doc) => {
	if (doc.project) {
		router.replace({
			path: `/projects/${doc.project}`,
			query: { tab: 'tasks', task: doc.name },
		})
	} else {
		router.replace({ path: '/tasks', query: { task: doc.name } })
	}
})

onMounted(() => {
	// A task that cannot be read falls back to the list rather than hanging.
	setTimeout(() => {
		if (!task.doc) router.replace('/tasks')
	}, 5000)
})
</script>
