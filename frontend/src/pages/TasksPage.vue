<template>
	<AppHeader title="Tasks" />
	<div class="p-4 md:p-6">
		<EmptyState
			title="Tasks is being rebuilt"
			description="This screen lands with its workstream. The shell, routing and shared contracts are in place."
			icon="lucide-construction"
		/>
	</div>
</template>

<script setup lang="ts">
import { usePageMeta } from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'

usePageMeta(() => ({ title: 'Tasks · Hive' }))
</script>
