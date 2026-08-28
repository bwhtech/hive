<template>
	<Tooltip :text="tooltip" :disabled="!tooltip">
		<Avatar :size="size" shape="square" :theme="theme" :label="title ?? ''">
			<!-- The icon is decorative: every call site puts the project title
			     next to it, and the tooltip carries it when one does not. -->
			<span :class="[iconClass, 'size-full']" aria-hidden="true" />
		</Avatar>
	</Tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, Tooltip, type AvatarProps } from 'frappe-ui'
import { projectColorTheme, projectIconClass } from '@/lib/project'

/**
 * A project's icon on its tinted square. Props are flat rather than a whole
 * project object so the dashboard rows — which carry `project`, `project_title`
 * and friends as separate fields — can use it without reshaping their payload.
 */
const props = withDefaults(
	defineProps<{
		/** Project docname. Seeds the colour when `color` is empty, so it must
		 *  be the id and not the title — see `projectColorTheme`. */
		name?: string | null
		title?: string | null
		/** Lucide icon name, e.g. `rocket`. Empty falls back to a folder. */
		icon?: string | null
		/** One of `PROJECT_COLORS`. Empty derives a colour from `name`. */
		color?: string | null
		size?: AvatarProps['size']
		/** Suppress the hover tooltip where the title is already on screen. */
		hideTooltip?: boolean
	}>(),
	{ size: 'sm' },
)

const theme = computed(() => projectColorTheme(props.color, props.name))
const iconClass = computed(() => projectIconClass(props.icon))
const tooltip = computed(() => (props.hideTooltip ? '' : (props.title ?? '')))
</script>
