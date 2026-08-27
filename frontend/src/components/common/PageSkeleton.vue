<template>
	<div class="space-y-3 p-4 md:p-6">
		<Skeleton class="h-6 w-48" />
		<Skeleton v-for="n in rows" :key="n" class="h-11 w-full" />
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from 'frappe-ui'

withDefaults(defineProps<{ rows?: number }>(), { rows: 6 })
</script>
