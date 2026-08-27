import { ref, type Ref } from 'vue'
import { STORAGE_KEYS, readStorage, writeStorage } from '@/lib/storage'

/** Pinning is capped; pinning past the cap drops the oldest entry (FIFO). */
const MAX_PINNED = 5

const pinned: Ref<string[]> = ref(readStorage<string[]>(STORAGE_KEYS.pinnedTasks, []))

export function usePinnedTasks() {
	function isPinned(name: string) {
		return pinned.value.includes(name)
	}

	function toggle(name: string) {
		if (isPinned(name)) {
			pinned.value = pinned.value.filter((n) => n !== name)
		} else {
			const next = [...pinned.value, name]
			pinned.value = next.length > MAX_PINNED ? next.slice(next.length - MAX_PINNED) : next
		}
		writeStorage(STORAGE_KEYS.pinnedTasks, pinned.value)
	}

	function unpinAll() {
		pinned.value = []
		writeStorage(STORAGE_KEYS.pinnedTasks, pinned.value)
	}

	return { pinned, isPinned, toggle, unpinAll, max: MAX_PINNED as typeof MAX_PINNED }
}
