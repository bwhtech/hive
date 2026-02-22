import { useEffect } from "react"

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
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return
      }

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
