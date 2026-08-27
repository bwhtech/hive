<template>
	<Tooltip :text="tooltip" :disabled="!tooltip">
		<Avatar :size="size" :image="image ?? undefined" :label="name ?? user ?? ''" />
	</Tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, Tooltip, type AvatarProps } from 'frappe-ui'

const props = withDefaults(
	defineProps<{
		/** Display name; falls back to the user id for the fallback initials. */
		name?: string | null
		user?: string | null
		image?: string | null
		size?: AvatarProps['size']
		/** Suppress the hover tooltip (inside an AvatarStack, which owns it). */
		hideTooltip?: boolean
	}>(),
	{ size: 'sm' },
)

const tooltip = computed(() => (props.hideTooltip ? '' : (props.name ?? props.user ?? '')))
</script>
