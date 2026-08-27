<template>
	<PageHeader>
		<div class="flex min-w-0 flex-1 items-center gap-2">
			<slot name="left">
				<PageHeaderTitle :title="title" />
			</slot>
		</div>

		<div class="flex shrink-0 items-center gap-2">
			<slot name="actions" />
			<Button
				class="hidden md:flex"
				variant="ghost"
				icon-left="lucide-search"
				label="Search"
				@click="commandPaletteOpen = true"
			>
				<template #suffix>
					<KeyboardShortcut combo="Mod+K" />
				</template>
			</Button>
			<Button
				class="md:hidden"
				variant="ghost"
				icon="lucide-search"
				tooltip="Search"
				aria-label="Search"
				@click="commandPaletteOpen = true"
			/>
			<div class="relative">
				<Button
					variant="ghost"
					icon="lucide-bell"
					:tooltip="
						unreadCount ? `${unreadCount} unread notifications` : 'No notifications'
					"
					aria-label="Notifications"
					@click="notificationsOpen = true"
				/>
				<span
					v-if="unreadCount"
					class="pointer-events-none absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-surface-red-6 px-1 text-2xs font-medium text-white"
				>
					{{ unreadCount > 9 ? '9+' : unreadCount }}
				</span>
			</div>
		</div>
	</PageHeader>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { Button, KeyboardShortcut, PageHeader, PageHeaderTitle, useCall } from 'frappe-ui'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'

defineProps<{
	/** Plain-text title. Ignored when the `left` slot is used. */
	title?: string
}>()

defineSlots<{
	/** Replaces the title region — breadcrumbs, a back button, an inline editor. */
	left?: () => unknown
	/** Page-specific actions, placed before the global search and bell. */
	actions?: () => unknown
}>()

const POLL_INTERVAL = 30_000

const { userId } = useSession()
const { commandPaletteOpen, notificationsOpen } = useOverlays()

const unread = useCall<number, { doctype: string; filters: string }>({
	url: '/api/v2/method/frappe.client.get_count',
	method: 'GET',
	params: () => ({
		doctype: 'Notification Log',
		filters: JSON.stringify({ read: 0, for_user: userId.value }),
	}),
	immediate: false,
})

const unreadCount = computed(() => unread.data ?? 0)

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
	if (userId.value) unread.reload()
	timer = setInterval(() => {
		if (userId.value) unread.reload()
	}, POLL_INTERVAL)
})
onBeforeUnmount(() => clearInterval(timer))
</script>
