<template>
	<!-- frappe-ui's `Avatar` publishes no `data-slot`, so the stack carries the
	     testid: it is the thing a spec means by "who is on this task". -->
	<div v-if="members.length" class="flex items-center" data-testid="avatar-stack">
		<Tooltip v-for="member in shown" :key="member.user" :text="member.name || member.user">
			<div class="-mr-1 last:mr-0">
				<Avatar
					:size="size"
					:image="member.image ?? undefined"
					:label="member.name || member.user"
				/>
			</div>
		</Tooltip>
		<Tooltip v-if="overflow.length" :text="overflowNames">
			<div
				class="grid shrink-0 place-items-center rounded-full bg-surface-gray-3 font-medium text-ink-gray-7"
				:class="overflowClasses"
			>
				+{{ overflow.length }}
			</div>
		</Tooltip>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, Tooltip, type AvatarProps } from 'frappe-ui'

export interface StackMember {
	user: string
	name?: string
	image?: string | null
}

/**
 * Mirrors `Avatar`'s own size scale so the overflow chip lines up with the
 * faces beside it. Avatar renders only the first character of its label, so
 * "+2" cannot go through it.
 */
const OVERFLOW_SIZES: Record<string, string> = {
	xs: 'size-4 text-2xs',
	sm: 'size-5 text-2xs',
	md: 'size-6 text-2xs',
	lg: 'size-7 text-xs',
	xl: 'size-8 text-xs',
	'2xl': 'size-10 text-sm',
	'3xl': 'size-11.5 text-sm',
}

const props = withDefaults(
	defineProps<{
		members: StackMember[]
		max?: number
		size?: AvatarProps['size']
	}>(),
	{ max: 3, size: 'sm' },
)

const shown = computed(() => props.members.slice(0, props.max))
const overflow = computed(() => props.members.slice(props.max))
const overflowNames = computed(() => overflow.value.map((m) => m.name || m.user).join(', '))
const overflowClasses = computed(() => OVERFLOW_SIZES[props.size ?? 'sm'] ?? OVERFLOW_SIZES.sm)
</script>
