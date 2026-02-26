import { useEffect, useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"

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
 * Skips when modifier keys (Cmd/Ctrl/Alt) are held (unless shift is specified).
 */
export function useHotkey(
  key: string,
  callback: () => void,
  options?: { enabled?: boolean; capture?: boolean; shift?: boolean },
) {
  // capture: true needs a manual listener (react-hotkeys-hook doesn't support capture phase).
  // This is used for ? to intercept before Frappe's own shortcut handler.
  const capture = options?.capture ?? false

  useEffect(() => {
    if (capture) {
      if (options?.enabled === false) return
      const requireShift = options?.shift

      const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditableTarget(e)) return
        if (e.metaKey || e.ctrlKey || e.altKey) return
        if (requireShift !== undefined && e.shiftKey !== requireShift) return
        if (e.key.toLowerCase() === key.toLowerCase()) {
          e.preventDefault()
          e.stopPropagation()
          callback()
        }
      }

      document.addEventListener("keydown", handleKeyDown, true)
      return () => document.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [key, callback, capture, options?.enabled, options?.shift])

  const hotkey = options?.shift ? `shift+${key}` : key === "?" ? "shift+/" : key

  useHotkeys(
    hotkey,
    () => callback(),
    {
      enabled: !capture && (options?.enabled ?? true),
      preventDefault: true,
    },
    [callback, capture],
  )
}

/**
 * Register a Cmd/Ctrl + key keyboard shortcut.
 */
export function useMetaHotkey(
  key: string,
  callback: () => void,
  options?: { enabled?: boolean },
) {
  useHotkeys(
    `mod+${key}`,
    () => callback(),
    {
      enabled: options?.enabled ?? true,
      preventDefault: true,
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
    [callback],
  )
}

/**
 * Register a two-key chord shortcut (e.g. G then D).
 * Press the leader key, then the second key within 1 second.
 *
 * Note: react-hotkeys-hook does not support key sequences,
 * so this remains a custom implementation.
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
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      )
        return
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
