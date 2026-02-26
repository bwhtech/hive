export interface ShortcutDef {
  id: string
  keys: string[]
  description: string
  group: "Global" | "Navigation" | "Project Detail" | "Task Detail"
}

export const SHORTCUT_REGISTRY: ShortcutDef[] = [
  // Global
  { id: "cmd-k", keys: ["\u2318", "K"], description: "Open command palette", group: "Global" },
  { id: "help", keys: ["?"], description: "Show keyboard shortcuts", group: "Global" },
  { id: "celebrate", keys: ["\u21e7", "T"], description: "Celebrate", group: "Global" },

  // Navigation
  { id: "go-dashboard", keys: ["G", "D"], description: "Go to Dashboard", group: "Navigation" },
  { id: "go-projects", keys: ["G", "P"], description: "Go to Projects", group: "Navigation" },
  { id: "go-tasks", keys: ["G", "T"], description: "Go to Tasks", group: "Navigation" },
  { id: "go-team", keys: ["G", "M"], description: "Go to Team", group: "Navigation" },

  // Project Detail
  { id: "tab-overview", keys: ["O"], description: "Switch to Overview tab", group: "Project Detail" },
  { id: "tab-milestones", keys: ["M"], description: "Switch to Milestones tab", group: "Project Detail" },
  { id: "tab-updates", keys: ["U"], description: "Switch to Updates tab", group: "Project Detail" },
  { id: "tab-requests", keys: ["R"], description: "Switch to Requests tab", group: "Project Detail" },
  { id: "tab-activity", keys: ["A"], description: "Switch to Activity tab", group: "Project Detail" },
  { id: "create-task", keys: ["T"], description: "Create new task", group: "Project Detail" },

  // Task Detail
  { id: "add-assignee", keys: ["A"], description: "Add assignee", group: "Task Detail" },
]

export function groupShortcuts(): { group: string; items: ShortcutDef[] }[] {
  const groups = new Map<string, ShortcutDef[]>()
  for (const shortcut of SHORTCUT_REGISTRY) {
    const list = groups.get(shortcut.group)
    if (list) {
      list.push(shortcut)
    } else {
      groups.set(shortcut.group, [shortcut])
    }
  }
  return Array.from(groups, ([group, items]) => ({ group, items }))
}
