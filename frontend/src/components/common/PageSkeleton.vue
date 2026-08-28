<template>
	<div class="space-y-3 px-3 py-5 sm:px-5">
		<Skeleton class="h-6 w-48 rounded-full" />
		<Skeleton v-for="n in rows" :key="n" class="h-11 w-full rounded-5" />
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from 'frappe-ui'

withDefaults(defineProps<{ rows?: number }>(), { rows: 6 })
</script>
