<template>
	<PageHeader>
		<div class="flex min-w-0 flex-1 items-center gap-2">
			<slot name="left">
				<!-- The page title is this view's h1: the shell renders no other
				     heading, so screen readers and tests both look for it here. -->
				<PageHeaderTitle>
					<h1 class="truncate">{{ title }}</h1>
				</PageHeaderTitle>
			</slot>
		</div>

		<div class="flex shrink-0 items-center gap-2">
			<slot name="actions" />
			<!-- On desktop the sidebar carries Notifications; the bell stays only
			     where there is no sidebar to put it in. -->
			<div v-if="!isDesktop" class="relative">
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
import { Button, PageHeader, PageHeaderTitle } from 'frappe-ui'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useOverlays } from '@/composables/useOverlays'
import { useUnreadCount } from '@/composables/useUnreadCount'

defineProps<{
	/** Plain-text title. Ignored when the `left` slot is used. */
	title?: string
}>()

defineSlots<{
	/** Replaces the title region — breadcrumbs, a back button, an inline editor. */
	left?: () => unknown
	/** Page-specific actions, at the trailing end of the header. */
	actions?: () => unknown
}>()

const { isDesktop } = useBreakpoint()
const { notificationsOpen } = useOverlays()
const unreadCount = useUnreadCount()
</script>
