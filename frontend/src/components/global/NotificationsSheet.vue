<template>
	<Dialog v-model:open="open" size="md" position="top" bare>
		<template #default>
			<div class="flex max-h-[70vh] flex-col">
				<header
					class="flex shrink-0 items-center gap-2 border-b border-outline-gray-1 px-4 py-3"
				>
					<div class="min-w-0 flex-1">
						<h2 class="text-lg font-semibold text-ink-gray-8">Notifications</h2>
						<p class="text-sm text-ink-gray-5">
							{{ unreadCount ? `${unreadCount} unread` : 'All caught up' }}
						</p>
					</div>
					<Button
						v-if="unreadCount"
						icon-left="lucide-check-check"
						label="Mark all read"
						:loading="markAll.loading"
						@click="markAllRead"
					/>
					<Button
						variant="ghost"
						icon="lucide-x"
						aria-label="Close"
						@click="open = false"
					/>
				</header>

				<ScrollArea class="min-h-0 flex-1" viewport-class="px-2 py-2">
					<div v-if="notifications.loading && !notifications.data" class="space-y-2 p-2">
						<Skeleton v-for="n in 4" :key="n" class="h-14 w-full rounded-5" />
					</div>

					<EmptyState
						v-else-if="!rows.length"
						icon="lucide-bell"
						title="No notifications yet"
						description="Mentions and assignments show up here."
					/>

					<button
						v-for="row in rows"
						v-else
						:key="row.name"
						type="button"
						class="flex w-full items-start gap-3 rounded-3 px-3 py-2.5 text-left hover:bg-surface-gray-2"
						:class="{ 'bg-surface-gray-1': !row.read }"
						@click="openNotification(row)"
					>
						<MemberAvatar
							:name="userName(row.from_user)"
							:user="row.from_user"
							:image="userImage(row.from_user)"
						/>
						<div class="min-w-0 flex-1">
							<p
								class="text-sm leading-snug"
								:class="
									row.read ? 'text-ink-gray-6' : 'font-medium text-ink-gray-8'
								"
							>
								{{ stripHtml(row.subject) }}
							</p>
							<p class="mt-0.5 text-xs text-ink-gray-5">
								{{ fromNow(row.creation) }}
							</p>
						</div>
						<span
							v-if="!row.read"
							class="mt-1.5 size-2 shrink-0 rounded-full bg-surface-blue-3"
							aria-label="Unread"
						/>
					</button>
				</ScrollArea>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Dialog, ScrollArea, Skeleton, toast, useCall, useList } from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import { fromNow } from '@/lib/dates'
import { stripHtml } from '@/lib/text'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import type { Bool } from '@/types'

interface NotificationRow {
	name: string
	subject: string
	type: string
	document_type: string
	document_name: string
	from_user: string
	read: Bool
	creation: string
}

const NOTIFICATION_LIMIT = 50

const router = useRouter()
const { userId } = useSession()
const { notificationsOpen: open } = useOverlays()

const notifications = useList<NotificationRow>({
	doctype: 'Notification Log',
	fields: [
		'name',
		'subject',
		'type',
		'document_type',
		'document_name',
		'from_user',
		'read',
		'creation',
	],
	filters: () => ({ for_user: userId.value }),
	orderBy: 'creation desc',
	limit: NOTIFICATION_LIMIT,
	immediate: false,
})

// Only fetched while the sheet is open; the bell's unread count is its own,
// cheaper poll in `AppHeader`.
watch(open, (isOpen) => {
	if (isOpen && userId.value) notifications.reload()
})

const rows = computed(() => notifications.data ?? [])
const unreadCount = computed(() => rows.value.filter((row) => !row.read).length)

const senders = useList<{ name: string; full_name: string; user_image: string }>({
	doctype: 'User',
	fields: ['name', 'full_name', 'user_image'],
	filters: () => ({ name: ['in', [...new Set(rows.value.map((row) => row.from_user))]] }),
	limit: NOTIFICATION_LIMIT,
	immediate: false,
})

watch(rows, (list) => {
	if (list.length) senders.reload()
})

function userName(user: string): string {
	return senders.data?.find((row) => row.name === user)?.full_name ?? user
}

function userImage(user: string): string {
	return senders.data?.find((row) => row.name === user)?.user_image ?? ''
}

const markRead = useCall<unknown, { docname: string }>({
	url: '/api/v2/method/frappe.desk.doctype.notification_log.notification_log.mark_as_read',
	method: 'POST',
	immediate: false,
})

const markAll = useCall({
	url: '/api/v2/method/frappe.desk.doctype.notification_log.notification_log.mark_all_as_read',
	method: 'POST',
	immediate: false,
})

async function markAllRead() {
	try {
		await markAll.submit()
		notifications.reload()
	} catch {
		toast.error('Could not mark them read')
	}
}

async function openNotification(row: NotificationRow) {
	if (!row.read) {
		markRead.submit({ docname: row.name }).then(
			() => notifications.reload(),
			() => {},
		)
	}
	if (row.document_type === 'Hive Task' && row.document_name) {
		open.value = false
		router.push(`/tasks/${encodeURIComponent(row.document_name)}`)
	} else if (row.document_type === 'Hive Project' && row.document_name) {
		open.value = false
		router.push({ path: `/projects/${row.document_name}`, query: { tab: 'updates' } })
	}
}
</script>
