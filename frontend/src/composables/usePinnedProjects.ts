import { ref, watch, type Ref } from 'vue'
import { toast, useCall } from 'frappe-ui'

const PIN_API = 'bwh_hive.bwh_hive.doctype.hive_pinned_project.hive_pinned_project'

/**
 * The session user's pinned projects, in pin order. Stored server-side (`Hive
 * Pinned Project`, one row per user and project) so the sidebar reads the same
 * on every device — unlike task pins, which are a per-browser convenience.
 * A module singleton: the sidebar and the project header share one list.
 */
let state: ReturnType<typeof createState> | null = null

function createState() {
	const pinnedProjects = useCall<string[]>({
		url: `/api/v2/method/${PIN_API}.get_pinned_projects`,
		method: 'GET',
		cacheKey: 'pinned-projects',
	})

	const togglePin = useCall<string[], { project: string }>({
		url: `/api/v2/method/${PIN_API}.toggle_pin`,
		method: 'POST',
		immediate: false,
	})

	// `useCall.data` is a computed, so a toggle's result cannot be written back
	// into it; this ref is the one list, seeded from the fetch (and its cache)
	// and replaced by whatever `toggle_pin` returns.
	const pinned: Ref<string[]> = ref([])
	watch(
		() => pinnedProjects.data,
		(data) => {
			pinned.value = data ?? []
		},
		{ immediate: true },
	)
	const pending: Ref<string | null> = ref(null)

	function isPinned(project: string) {
		return pinned.value.includes(project)
	}

	async function toggle(project: string) {
		if (pending.value) return
		pending.value = project
		try {
			// The response is the whole list, so nothing needs refetching.
			pinned.value = (await togglePin.submit({ project })) ?? []
		} catch {
			toast.error(isPinned(project) ? 'Could not unpin project' : 'Could not pin project')
		} finally {
			pending.value = null
		}
	}

	return { pinned, pending, isPinned, toggle }
}

export function usePinnedProjects() {
	if (!state) state = createState()
	return state
}
