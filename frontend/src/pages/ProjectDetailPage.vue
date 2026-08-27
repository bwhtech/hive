<template>
	<AppHeader :title="id" />
	<div class="p-4 md:p-6">
		<EmptyState
			title="Project detail is being rebuilt"
			:description="`Slug: ${id}`"
			icon="lucide-construction"
		/>
	</div>
</template>

<script setup lang="ts">
import { usePageMeta } from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const props = defineProps<{ id: string }>()

usePageMeta(() => ({ title: `${props.id} · Hive` }))
</script>
