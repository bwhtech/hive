export interface ShortcutEntry {
  /** Display keys for the Kbd component (e.g. ["⌘", "K"]) */
  keys: string[]
  /** Human-readable description */
  description: string
  /** Group name (e.g. "Global", "Navigation") */
  group: string
}

export const SHORTCUT_REGISTRY: ShortcutEntry[] = [
  // Global
  { keys: ["⌘", "K"], description: "Open command palette", group: "Global" },
  { keys: ["?"], description: "Show keyboard shortcuts", group: "Global" },
  { keys: ["⇧", "T"], description: "Celebrate", group: "Global" },

  // Navigation
  { keys: ["G", "D"], description: "Go to Dashboard", group: "Navigation" },
  { keys: ["G", "P"], description: "Go to Projects", group: "Navigation" },
  { keys: ["G", "T"], description: "Go to Tasks", group: "Navigation" },
  { keys: ["G", "M"], description: "Go to Team", group: "Navigation" },

  // Project Detail
  { keys: ["T"], description: "Create new task", group: "Project Detail" },
  { keys: ["O"], description: "Overview tab", group: "Project Detail" },
  { keys: ["M"], description: "Milestones tab", group: "Project Detail" },
  { keys: ["U"], description: "Updates tab", group: "Project Detail" },
  { keys: ["R"], description: "Requests tab", group: "Project Detail" },
  { keys: ["A"], description: "Activity tab", group: "Project Detail" },

  // Task Detail
  { keys: ["A"], description: "Add assignee", group: "Task Detail" },
]

/** Group shortcuts by their group name, preserving registry order. */
export function getShortcutsByGroup(): { group: string; items: ShortcutEntry[] }[] {
  const groupMap = new Map<string, ShortcutEntry[]>()
  for (const entry of SHORTCUT_REGISTRY) {
    let items = groupMap.get(entry.group)
    if (!items) {
      items = []
      groupMap.set(entry.group, items)
    }
    items.push(entry)
  }
  return Array.from(groupMap, ([group, items]) => ({ group, items }))
}
