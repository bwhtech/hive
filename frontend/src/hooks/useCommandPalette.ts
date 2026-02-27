import { useCallback, useRef, useState } from "react"
import { useMetaHotkey } from "@/hooks/use-hotkey"

/**
 * Hook to register Cmd+K keyboard shortcut for the command palette.
 * Extracted from CommandPalette so the component can be lazy-loaded
 * while the hotkey stays registered eagerly.
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false)
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen

  const toggle = useCallback(() => setOpenRef.current((prev) => !prev), [])
  useMetaHotkey("k", toggle)

  return { open, setOpen }
}
