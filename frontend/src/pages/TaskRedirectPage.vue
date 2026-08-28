<template>
	<!-- A task view's silhouette: the redirect lands on a task panel, so the
	     placeholder is the shape of one. -->
	<div class="flex flex-col gap-4 p-6">
		<Skeleton class="h-6 w-64 rounded-full" />
		<Skeleton class="h-4 w-40 rounded-full" />
		<Skeleton class="h-32 rounded-6" />
	</div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { Skeleton, useDoc, usePageMeta } from 'frappe-ui'
import type { HiveTask } from '@/types'

/** `/tasks/:id` is a deep link — resolve the task's project and hand over. */
const props = defineProps<{ id: string }>()
const router = useRouter()

usePageMeta(() => ({ title: 'Task · Hive' }))

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

// A task that cannot be read (archived, no permission, gone) falls back to the
// list instead of leaving the placeholder up for good.
watch(
	() => task.error,
	(error) => {
		if (error) router.replace('/tasks')
	},
)
</script>
