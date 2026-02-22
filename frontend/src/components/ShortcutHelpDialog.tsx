import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface ShortcutHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcuts = [
  {
    group: "Global",
    items: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["?"], description: "Show keyboard shortcuts" },
    ],
  },
  {
    group: "Project Detail",
    items: [{ keys: ["T"], description: "Create new task" }],
  },
]

export function ShortcutHelpDialog({
  open,
  onOpenChange,
}: ShortcutHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick actions available throughout the app.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((group) => (
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
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
