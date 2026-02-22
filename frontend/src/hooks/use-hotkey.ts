import { useEffect, useRef } from "react"

function isEditableTarget(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  )
}

/**
 * Register a single-key keyboard shortcut.
 * Skips when focus is inside an input, textarea, select, or contenteditable.
 * Skips when modifier keys (Cmd/Ctrl/Alt) are held.
 */
export function useHotkey(
  key: string,
  callback: () => void,
  options?: { enabled?: boolean; capture?: boolean },
) {
  useEffect(() => {
    if (options?.enabled === false) return
    const capture = options?.capture ?? false

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault()
        e.stopPropagation()
        callback()
      }
    }

    document.addEventListener("keydown", handleKeyDown, capture)
    return () => document.removeEventListener("keydown", handleKeyDown, capture)
  }, [key, callback, options?.enabled, options?.capture])
}

/**
 * Register a two-key chord shortcut (e.g. G then D).
 * Press the leader key, then the second key within 1 second.
 */
export function useChordHotkey(
  leader: string,
  chords: Record<string, () => void>,
) {
  const pendingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const keys = Object.keys(chords)
    if (keys.length === 0) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const key = e.key.toLowerCase()

      if (pendingRef.current) {
        pendingRef.current = false
        clearTimeout(timerRef.current)
        const cb = chords[key]
        if (cb) {
          e.preventDefault()
          e.stopPropagation()
          cb()
        }
        return
      }

      if (key === leader.toLowerCase()) {
        pendingRef.current = true
        timerRef.current = setTimeout(() => {
          pendingRef.current = false
        }, 1000)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      clearTimeout(timerRef.current)
    }
  }, [leader, chords])
}
