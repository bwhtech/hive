<template>
	<Tooltip :text="tooltip" :disabled="!tooltip">
		<!-- One Avatar, two identities. frappe-ui draws `image` when it has one
		     and the default slot when it does not, so the icon is both the
		     no-avatar case and the fallback if the data URI ever fails to
		     decode — a record is never left as a bare initial. -->
		<Avatar
			:size="size"
			shape="square"
			:theme="theme"
			:image="avatarSrc || undefined"
			:label="title ?? ''"
		>
			<!-- The icon is decorative: every call site puts the title next to
			     it, and the tooltip carries it when one does not. -->
			<span :class="[iconClass, 'size-full']" aria-hidden="true" />
		</Avatar>
	</Tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, Tooltip, type AvatarProps } from 'frappe-ui'
import { projectAvatarSrc, projectColorTheme, projectIconClass } from '@/lib/project'

/**
 * A record's icon on its tinted square, or its generated avatar. Used for a
 * `Hive Project` and a `Hive View` alike — the two store the same six fields,
 * so a reader cannot tell from the mark which one they are looking at.
 *
 * Props are flat rather than a whole document object so the dashboard rows —
 * which carry `project`, `project_title` and friends as separate fields — can
 * use it without reshaping their payload.
 */
const props = withDefaults(
	defineProps<{
		/** Docname. Seeds the colour when `color` is empty, so it must be the
		 *  id and not the title — see `projectColorTheme`. */
		name?: string | null
		title?: string | null
		/** Lucide icon name, e.g. `rocket`. Empty falls back to a folder. */
		icon?: string | null
		/** One of `PROJECT_COLORS`. Empty derives a colour from `name`. */
		color?: string | null
		/**
		 * The stored `avatar` field: a DiceBear SVG as a `data:` URI. Set means
		 * an avatar was chosen over an icon, and it wins. Untrusted — it goes
		 * through `projectAvatarSrc`, never to the DOM as markup.
		 */
		avatar?: string | null
		size?: AvatarProps['size']
		/** Suppress the hover tooltip where the title is already on screen. */
		hideTooltip?: boolean
	}>(),
	{ size: 'sm' },
)

const theme = computed(() => projectColorTheme(props.color, props.name))
const iconClass = computed(() => projectIconClass(props.icon))
const avatarSrc = computed(() => projectAvatarSrc(props.avatar))
const tooltip = computed(() => (props.hideTooltip ? '' : (props.title ?? '')))
</script>
