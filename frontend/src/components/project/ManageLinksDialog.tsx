import { useState, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Link04Icon,
  Delete02Icon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { HiveProjectLink } from "@/types"

interface ManageLinksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  links: HiveProjectLink[]
  onAdd: (title: string, url: string) => void
  onRemove: (idx: number) => void
  onUpdate: (idx: number, title: string, url: string) => void
}

export function ManageLinksDialog({
  open,
  onOpenChange,
  links,
  onAdd,
  onRemove,
  onUpdate,
}: ManageLinksDialogProps) {
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const titleRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const title = newTitle.trim()
    const url = newUrl.trim()
    if (!title || !url) return
    onAdd(title, url)
    setNewTitle("")
    setNewUrl("")
    titleRef.current?.focus()
  }

  const startEdit = (idx: number) => {
    setEditIdx(idx)
    setEditTitle(links[idx].title)
    setEditUrl(links[idx].url)
  }

  const saveEdit = () => {
    if (editIdx === null) return
    const title = editTitle.trim()
    const url = editUrl.trim()
    if (!title || !url) return
    onUpdate(editIdx, title, url)
    setEditIdx(null)
  }

  const cancelEdit = () => setEditIdx(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Related Links</DialogTitle>
        </DialogHeader>

        {/* Existing links */}
        {links.length > 0 && (
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i}>
                {editIdx === i ? (
                  <div className="space-y-2 rounded-lg border p-3">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <Input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="https://..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                    <HugeiconsIcon icon={Link04Icon} strokeWidth={2} className="size-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{link.title}</span>
                      <span className="text-muted-foreground ml-2 truncate text-xs">{link.url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEdit(i)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add new link */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Add a link</p>
          <div className="flex gap-2">
            <Input
              ref={titleRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={!newTitle.trim() || !newUrl.trim()}>
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
