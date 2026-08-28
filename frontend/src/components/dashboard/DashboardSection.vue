<template>
	<section class="rounded-5 border border-outline-gray-1 bg-surface-base">
		<header class="flex h-11 items-center gap-2 border-b border-outline-gray-1 px-4">
			<span
				v-if="icon"
				:class="[icon, 'size-4 shrink-0 text-ink-gray-5']"
				aria-hidden="true"
			/>
			<h2 class="truncate text-base font-medium text-ink-gray-8">{{ title }}</h2>
			<div v-if="$slots.actions" class="ml-auto flex shrink-0 items-center gap-2">
				<slot name="actions" />
			</div>
		</header>
		<div :class="bodyClass">
			<slot />
		</div>
	</section>
</template>

<script setup lang="ts">
/**
 * The bordered card every dashboard block sits in: a titled header row and a
 * body the caller pads to suit its content (`p-2` for a List, `p-4` for a grid).
 */
withDefaults(
	defineProps<{
		title: string
		/** A `lucide-*` class name. */
		icon?: string
		/** Padding for the body region. */
		bodyClass?: string
	}>(),
	{ bodyClass: 'p-2' },
)

defineSlots<{
	default?: () => unknown
	/** Trailing controls in the header row. */
	actions?: () => unknown
}>()
</script>
