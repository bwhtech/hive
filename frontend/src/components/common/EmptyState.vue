<template>
	<div class="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
		<span v-if="icon" :class="[icon, 'size-6 text-ink-gray-4']" aria-hidden="true" />
		<p class="text-base font-medium text-ink-gray-7">{{ title }}</p>
		<p v-if="description" class="max-w-sm text-sm text-ink-gray-5">{{ description }}</p>
		<div v-if="$slots.action" class="mt-2">
			<slot name="action" />
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	description?: string
	/** A `lucide-*` class name. */
	icon?: string
}>()

defineSlots<{
	/** The single primary action for the empty state. */
	action?: () => unknown
}>()
</script>
