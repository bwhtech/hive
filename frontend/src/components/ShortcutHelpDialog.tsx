import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import {
  useActiveShortcuts,
  formatShortcutKeys,
  type RegisteredShortcut,
} from "@/hooks/useShortcut"
import { useMemo } from "react"

interface ShortcutHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function groupShortcuts(
  shortcuts: RegisteredShortcut[],
): { group: string; items: RegisteredShortcut[] }[] {
  const groupMap = new Map<string, RegisteredShortcut[]>()
  for (const s of shortcuts) {
    if (!s.condition || s.condition()) {
      let items = groupMap.get(s.group)
      if (!items) {
        items = []
        groupMap.set(s.group, items)
      }
      items.push(s)
    }
  }
  return Array.from(groupMap, ([group, items]) => ({ group, items }))
}

export function ShortcutHelpDialog({
  open,
  onOpenChange,
}: ShortcutHelpDialogProps) {
  const activeShortcuts = useActiveShortcuts()
  const shortcutGroups = useMemo(
    () => groupShortcuts(activeShortcuts),
    [activeShortcuts],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick actions available on this page.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {shortcutGroups.map((group) => (
            <div key={group.group}>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.group}
              </h4>
              <div className="space-y-2">
                {group.items.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <Kbd keys={formatShortcutKeys(shortcut)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {shortcutGroups.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No keyboard shortcuts available on this page.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
