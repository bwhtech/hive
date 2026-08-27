import { useEffect, useRef } from "react"
import { useSyncExternalStore } from "react"

// ── Types ──────────────────────────────────────────────────────────────

export interface ShortcutConfig {
  /** Shortcut key (e.g. "s", "Escape", "?") */
  key: string
  /** Whether Ctrl (or Cmd on Mac) must be held */
  ctrl?: boolean
  /** Whether Shift must be held */
  shift?: boolean
  /** Human-readable label shown in the shortcuts modal */
  description: string
  /** Group name for categorising in the shortcuts modal */
  group?: string
  /** Handler to execute when the shortcut fires */
  handler: (e: KeyboardEvent) => void
  /** Prevent default browser behaviour (default: true) */
  preventDefault?: boolean
  /** Fire even when an input/textarea is focused (default: false) */
  allowInInput?: boolean
  /** Shortcut only fires when this returns true */
  condition?: () => boolean
}

export interface RegisteredShortcut {
  key: string
  ctrl: boolean
  shift: boolean
  description: string
  group: string
  id: symbol
  condition?: () => boolean
}

// ── Global state ───────────────────────────────────────────────────────

let activeShortcuts: RegisteredShortcut[] = []
const shortcutHandlers = new Map<symbol, ShortcutConfig>()
let listenerAttached = false

// For useSyncExternalStore
const listeners = new Set<() => void>()
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
function notify() {
  for (const l of listeners) l()
}
function getSnapshot(): RegisteredShortcut[] {
  return activeShortcuts
}

// ── Chord state ────────────────────────────────────────────────────────

let pendingLeader: string | null = null
let chordTimer: ReturnType<typeof setTimeout> | undefined

interface ChordEntry {
  leader: string
  follower: string
  config: ShortcutConfig
  id: symbol
}
const chordRegistry: ChordEntry[] = []

// ── Helpers ────────────────────────────────────────────────────────────

function isEditableTarget(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  )
}

function isCtrlOrCmd(e: KeyboardEvent): boolean {
  return e.metaKey || e.ctrlKey
}

function matchesShortcut(e: KeyboardEvent, config: ShortcutConfig): boolean {
  if (e.key.toLowerCase() !== config.key.toLowerCase() && e.key !== config.key) {
    return false
  }

  const wantsCtrl = config.ctrl ?? false
  const wantsShift = config.shift ?? false

  if (wantsCtrl && !isCtrlOrCmd(e)) return false
  if (!wantsCtrl && isCtrlOrCmd(e)) return false

  // For keys produced by Shift (like ? = Shift+/), only enforce the
  // shift check when shift is explicitly specified in the config
  const isShiftProducedKey =
    config.key !== config.key.toLowerCase() ||
    /^[?!@#$%^&*()_+{}|:"<>~]$/.test(config.key)
  if (wantsShift && !e.shiftKey) return false
  if (!wantsShift && e.shiftKey && !isShiftProducedKey) return false

  return true
}

// ── Global keydown handler ─────────────────────────────────────────────

function globalKeydownHandler(e: KeyboardEvent) {
  // Handle chord followers
  if (pendingLeader) {
    const leader = pendingLeader
    pendingLeader = null
    clearTimeout(chordTimer)

    for (const entry of chordRegistry) {
      if (entry.leader !== leader) continue
      if (e.key.toLowerCase() !== entry.follower.toLowerCase()) continue
      if (entry.config.condition && !entry.config.condition()) continue
      if (!entry.config.allowInInput && isEditableTarget(e)) continue

      e.preventDefault()
      e.stopPropagation()
      entry.config.handler(e)
      return
    }
    // No matching chord follower — fall through to normal shortcuts
  }

  // Check for chord leaders
  if (!isCtrlOrCmd(e) && !e.altKey) {
    const key = e.key.toLowerCase()
    const hasChord = chordRegistry.some((c) => c.leader === key)
    if (hasChord && !isEditableTarget(e)) {
      pendingLeader = key
      chordTimer = setTimeout(() => {
        pendingLeader = null
      }, 1000)
      return
    }
  }

  // Normal shortcuts
  for (const [, config] of shortcutHandlers) {
    if (!matchesShortcut(e, config)) continue
    if (config.condition && !config.condition()) continue
    if (!config.allowInInput && isEditableTarget(e)) continue

    if (config.preventDefault !== false) {
      e.preventDefault()
      e.stopPropagation()
    }
    config.handler(e)
    return
  }
}

function attachGlobalListener() {
  if (listenerAttached) return
  listenerAttached = true
  // Use capture phase so we can intercept before Frappe's handler (e.g. for ?)
  document.addEventListener("keydown", globalKeydownHandler, true)
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Register keyboard shortcuts that are automatically cleaned up on unmount.
 *
 * Supports single keys, modifier combos, and two-key chords.
 *
 * @example
 * // Single key
 * useShortcut({ key: "t", description: "Create task", group: "Project", handler: () => create() })
 *
 * // Modifier combo
 * useShortcut({ key: "k", ctrl: true, description: "Command palette", group: "Global", handler: () => open() })
 *
 * // Chord (two-key sequence like G then D)
 * useShortcut({ key: "g d", description: "Go to Dashboard", group: "Navigation", handler: () => navigate("/") })
 */
export function useShortcut(shortcuts: ShortcutConfig | ShortcutConfig[]) {
  const configsRef = useRef(shortcuts)
  configsRef.current = shortcuts

  useEffect(() => {
    attachGlobalListener()

    const configs = Array.isArray(configsRef.current) ? configsRef.current : [configsRef.current]
    const registeredIds: symbol[] = []

    for (const config of configs) {
      const id = Symbol(config.description)
      registeredIds.push(id)

      // Check for chord syntax: "g d" means leader=g, follower=d
      const parts = config.key.split(" ")
      if (parts.length === 2) {
        chordRegistry.push({
          leader: parts[0].toLowerCase(),
          follower: parts[1].toLowerCase(),
          config,
          id,
        })
        // Register in activeShortcuts for the help dialog
        activeShortcuts = [
          ...activeShortcuts,
          {
            key: config.key,
            ctrl: config.ctrl ?? false,
            shift: config.shift ?? false,
            description: config.description,
            group: config.group ?? "General",
            id,
            condition: config.condition,
          },
        ]
      } else {
        shortcutHandlers.set(id, config)
        activeShortcuts = [
          ...activeShortcuts,
          {
            key: config.key,
            ctrl: config.ctrl ?? false,
            shift: config.shift ?? false,
            description: config.description,
            group: config.group ?? "General",
            id,
            condition: config.condition,
          },
        ]
      }
    }

    notify()

    return () => {
      for (const id of registeredIds) {
        shortcutHandlers.delete(id)
        const chordIdx = chordRegistry.findIndex((c) => c.id === id)
        if (chordIdx !== -1) chordRegistry.splice(chordIdx, 1)
      }
      activeShortcuts = activeShortcuts.filter(
        (s) => !registeredIds.includes(s.id),
      )
      notify()
    }
  }, []) // mount/unmount only — handlers read via configsRef
}

/**
 * React hook that returns the current list of active shortcuts.
 * Re-renders when shortcuts are added or removed.
 */
export function useActiveShortcuts(): RegisteredShortcut[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/**
 * Format a shortcut config into display key parts for the Kbd component.
 */
export function formatShortcutKeys(config: {
  key: string
  ctrl?: boolean
  shift?: boolean
}): string[] {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const parts: string[] = []

  if (config.ctrl) parts.push(isMac ? "\u2318" : "Ctrl")
  if (config.shift) parts.push(isMac ? "\u21E7" : "Shift")

  // Chord keys like "g d" → ["G", "D"]
  const keyParts = config.key.split(" ")
  const keyMap: Record<string, string> = {
    arrowup: "\u2191",
    arrowdown: "\u2193",
    arrowleft: "\u2190",
    arrowright: "\u2192",
    escape: "Esc",
    backspace: "\u232B",
    delete: "Del",
    enter: "\u21B5",
    " ": "Space",
  }

  for (const k of keyParts) {
    parts.push(keyMap[k.toLowerCase()] ?? k.toUpperCase())
  }

  return parts
}
