<template>
	<div v-if="members.length" class="flex items-center">
		<Tooltip v-for="member in shown" :key="member.user" :text="member.name || member.user">
			<div class="-mr-1.5 rounded-full ring-2 ring-surface-base last:mr-0">
				<Avatar
					:size="size"
					:image="member.image ?? undefined"
					:label="member.name || member.user"
				/>
			</div>
		</Tooltip>
		<Tooltip v-if="overflow.length" :text="overflowNames">
			<div
				class="grid size-6 place-items-center rounded-full bg-surface-gray-3 text-2xs font-medium text-ink-gray-7 ring-2 ring-surface-base"
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
</script>
