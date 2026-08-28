<template>
	<ListRow :value="update.name" class="items-start py-4">
		<div class="mt-0.5">
			<MemberAvatar
				:name="authorName"
				:user="update.posted_by"
				:image="authorImage"
				size="md"
				hide-tooltip
			/>
		</div>

		<div class="min-w-0">
			<div class="flex items-center gap-2">
				<span
					class="truncate text-base text-ink-gray-8"
					:class="{ 'font-semibold text-ink-gray-9': unread }"
				>
					{{ authorName }}
				</span>
				<span class="shrink-0 text-xs text-ink-gray-5">{{ fromNow(update.creation) }}</span>
				<span
					v-if="unread"
					class="size-1.5 shrink-0 rounded-full bg-surface-amber-7"
					aria-label="Unread"
				/>
			</div>

			<!-- eslint-disable-next-line vue/no-v-html -- editor output, sanitised server-side like every rendered update -->
			<div class="hive-prose mt-1.5" v-html="update.content" />

			<div class="mt-3 flex flex-wrap items-center gap-1.5">
				<Tooltip v-for="group in groups" :key="group.emoji" :text="group.tooltip">
					<button
						type="button"
						:aria-pressed="group.mine"
						@click="emit('react', group.emoji)"
					>
						<Badge :theme="group.mine ? 'blue' : 'gray'" variant="outline" size="lg">
							<span>{{ group.emoji }}</span>
							<span class="tabular-nums">{{ group.users.length }}</span>
						</Badge>
					</button>
				</Tooltip>

				<Popover v-model:open="pickerOpen">
					<template #trigger>
						<Button
							variant="ghost"
							size="sm"
							icon="lucide-smile-plus"
							aria-label="Add reaction"
						/>
					</template>
					<template #default>
						<div class="flex items-center gap-0.5">
							<button
								v-for="emoji in REACTION_EMOJIS"
								:key="emoji"
								type="button"
								class="grid size-7 place-items-center rounded-3 text-base hover:bg-surface-gray-2"
								:aria-label="emoji"
								@click="pick(emoji)"
							>
								{{ emoji }}
							</button>
						</div>
					</template>
				</Popover>
			</div>
		</div>
	</ListRow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, Popover, Tooltip } from 'frappe-ui'
import { ListRow } from 'frappe-ui/list'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import { fromNow } from '@/lib/dates'
import type { HiveProjectUpdate } from '@/types'

/** The six reactions the picker offers — the same set the React app shipped. */
const REACTION_EMOJIS = ['👍', '❤️', '🎉', '🚀', '👀', '🙏']

const props = defineProps<{
	update: HiveProjectUpdate
	/** Highlights the row until the reader leaves the tab. */
	unread?: boolean
	/** The logged-in user id, to mark their own reactions. */
	currentUser: string
	authorName: string
	authorImage?: string | null
	/** user id → display name, for the reaction tooltips. */
	names?: Record<string, string>
}>()

const emit = defineEmits<{ react: [emoji: string] }>()

const pickerOpen = ref(false)

const groups = computed(() => {
	const byEmoji = new Map<string, string[]>()
	for (const reaction of props.update.reactions ?? []) {
		const users = byEmoji.get(reaction.emoji)
		if (users) users.push(reaction.user)
		else byEmoji.set(reaction.emoji, [reaction.user])
	}
	return [...byEmoji.entries()].map(([emoji, users]) => ({
		emoji,
		users,
		mine: users.includes(props.currentUser),
		tooltip: reactorNames(users),
	}))
})

function displayName(user: string): string {
	if (user === props.currentUser) return 'You'
	return props.names?.[user] || user.split('@')[0]
}

/** `Ada, Grace and You` — the reader always reads last. */
function reactorNames(users: string[]): string {
	const names = users.map(displayName)
	const you = names.indexOf('You')
	if (you > -1) {
		names.splice(you, 1)
		names.push('You')
	}
	if (names.length < 3) return names.join(' and ')
	return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

function pick(emoji: string) {
	pickerOpen.value = false
	emit('react', emoji)
}
</script>
