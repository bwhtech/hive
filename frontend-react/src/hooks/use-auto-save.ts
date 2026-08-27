import { useState, useEffect, useRef, useCallback } from "react"

type AutoSaveStatus = "idle" | "saving" | "saved"

interface UseAutoSaveOptions {
  /** The content to auto-save (debounced). */
  content: string
  /** Debounce delay in milliseconds. Defaults to 3000. */
  debounceMs?: number
  /**
   * Called when the debounce fires. Receives current content and the existing
   * draft ID (null on first save). Return the new draft ID when creating,
   * or void/undefined when updating an existing draft.
   */
  onSave: (
    content: string,
    existingDraftId: string | null,
  ) => Promise<string | void>
}

interface UseAutoSaveReturn {
  /** Current auto-save status for UI display. */
  status: AutoSaveStatus
  /** The draft ID created by the first save, or null. */
  draftId: string | null
  /** Manually set the draft ID (e.g. when resuming an existing draft). */
  setDraftId: (id: string | null) => void
  /** Reset all auto-save state (status, draftId, pending timer). */
  clear: () => void
}

export function useAutoSave({
  content,
  debounceMs = 3000,
  onSave,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [draftId, setDraftId] = useState<string | null>(null)
  const [status, setStatus] = useState<AutoSaveStatus>("idle")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSavingRef = useRef(false)

  const doSave = useCallback(
    async (text: string) => {
      if (!text.trim() || isSavingRef.current) return
      isSavingRef.current = true
      setStatus("saving")
      try {
        const result = await onSave(text, draftId)
        if (result) setDraftId(result)
        setStatus("saved")
      } catch {
        setStatus("idle")
      } finally {
        isSavingRef.current = false
      }
    },
    [draftId, onSave],
  )

  useEffect(() => {
    if (!content.trim()) {
      setStatus("idle")
      return
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSave(content), debounceMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [content, debounceMs, doSave])

  const clear = useCallback(() => {
    setDraftId(null)
    setStatus("idle")
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return { status, draftId, setDraftId, clear }
}
