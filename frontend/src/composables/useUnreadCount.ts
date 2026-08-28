import { computed, watch } from 'vue'
import { useCall } from 'frappe-ui'
import { useSession } from '@/composables/useSession'

/**
 * Unread Notification Log count for the logged-in user.
 *
 * A module singleton so the header bell and the sidebar's Dashboard row read
 * one poll between them instead of two. The interval is never cleared — it
 * lives as long as the shell does, the same way `useSession` does.
 */
let unreadCount: ReturnType<typeof createUnreadCount> | null = null

const POLL_INTERVAL = 30_000

function createUnreadCount() {
	const { userId } = useSession()

	const unread = useCall<number, { doctype: string; filters: string }>({
		url: '/api/v2/method/frappe.client.get_count',
		method: 'GET',
		params: () => ({
			doctype: 'Notification Log',
			filters: JSON.stringify({ read: 0, for_user: userId.value }),
		}),
		immediate: false,
		cacheKey: 'unread-notifications',
	})

	function reload() {
		if (userId.value) unread.reload()
	}

	// The singleton can be built before the session resolves, so the first
	// fetch waits for a user rather than firing against an empty filter.
	watch(userId, reload, { immediate: true })
	setInterval(reload, POLL_INTERVAL)

	return computed(() => unread.data ?? 0)
}

export function useUnreadCount() {
	if (!unreadCount) unreadCount = createUnreadCount()
	return unreadCount
}
