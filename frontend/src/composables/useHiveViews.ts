import { computed, watch } from 'vue'
import { useList } from 'frappe-ui'
import { useSession } from '@/composables/useSession'
import type { HiveView } from '@/types'

/**
 * Saved `Hive View` links, shared by the sidebar and the tasks page.
 *
 * Public views are visible to everyone; private ones only to their owner, so
 * they come back as two queries — one list filtered on `is_public` cannot
 * express "public OR mine".
 *
 * A module singleton so that saving a view on the tasks page shows up in the
 * sidebar: frappe-ui's list store does not propagate inserts across instances.
 */
let views: ReturnType<typeof createHiveViews> | null = null

const FIELDS = [
	'name',
	'label',
	// The identity a view draws with — the same fields a project stores.
	'icon',
	'color',
	'avatar',
	'avatar_style',
	'avatar_seed',
	'avatar_options',
	'view_type',
	'filters_json',
	'is_public',
	'owner',
] as const

function createHiveViews() {
	const { userId, isClient } = useSession()

	const publicViews = useList<HiveView>({
		doctype: 'Hive View',
		fields: [...FIELDS],
		filters: { is_public: 1 },
		orderBy: 'creation asc',
		limit: 50,
		immediate: false,
	})

	const myViews = useList<HiveView>({
		doctype: 'Hive View',
		fields: [...FIELDS],
		filters: () => ({ is_public: 0, owner: userId.value }),
		orderBy: 'creation asc',
		limit: 50,
		immediate: false,
	})

	const list = computed(() => {
		const seen = new Map<string, HiveView>()
		for (const view of [...(publicViews.data ?? []), ...(myViews.data ?? [])]) {
			seen.set(view.name, view)
		}
		return [...seen.values()]
	})

	function byId(id: string): HiveView | null {
		return list.value.find((view) => view.name === id) ?? null
	}

	function refresh() {
		// `Hive View` is readable by the team roles only — a client would just
		// get a 403 for every poll.
		if (!userId.value || isClient.value) return
		publicViews.reload()
		myViews.reload()
	}

	watch([userId, isClient], refresh, { immediate: true })

	return { list, byId, refresh }
}

export function useHiveViews() {
	if (!views) views = createHiveViews()
	return views
}
