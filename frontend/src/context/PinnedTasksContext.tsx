import { createContext, use, useState, useCallback, useMemo } from "react"

const STORAGE_KEY = "hive-pinned-tasks"
const MAX_PINNED = 5

interface PinnedTasksContextValue {
  pinnedTaskNames: string[]
  togglePin: (taskName: string) => void
  unpinAll: () => void
  isPinned: (taskName: string) => boolean
}

const PinnedTasksContext = createContext<PinnedTasksContextValue>({
  pinnedTaskNames: [],
  togglePin: () => {},
  unpinAll: () => {},
  isPinned: () => false,
})

function loadPinned(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function savePinned(names: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names))
  } catch {
    /* ignore */
  }
}

export function PinnedTasksProvider({ children }: { children: React.ReactNode }) {
  const [pinnedTaskNames, setPinnedTaskNames] = useState<string[]>(loadPinned)

  const togglePin = useCallback((taskName: string) => {
    setPinnedTaskNames((prev) => {
      let next: string[]
      if (prev.includes(taskName)) {
        // Unpin
        next = prev.filter((n) => n !== taskName)
      } else {
        // Pin — FIFO: if at max, drop the oldest (first) entry
        next = prev.length >= MAX_PINNED ? [...prev.slice(1), taskName] : [...prev, taskName]
      }
      savePinned(next)
      return next
    })
  }, [])

  const unpinAll = useCallback(() => {
    setPinnedTaskNames([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const pinnedSet = useMemo(() => new Set(pinnedTaskNames), [pinnedTaskNames])
  const isPinned = useCallback((taskName: string) => pinnedSet.has(taskName), [pinnedSet])

  const value = useMemo(
    () => ({ pinnedTaskNames, togglePin, unpinAll, isPinned }),
    [pinnedTaskNames, togglePin, unpinAll, isPinned],
  )

  return <PinnedTasksContext value={value}>{children}</PinnedTasksContext>
}

export function usePinnedTasks() {
  return use(PinnedTasksContext)
}
