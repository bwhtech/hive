import { useState } from "react"
import { useFrappeCreateDoc } from "frappe-react-sdk"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LinkField } from "@/components/LinkField"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { title: string; project_type?: string; client?: string }) => void
}

export function CreateProjectDialog({ open, onOpenChange, onSubmit }: CreateProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [projectType, setProjectType] = useState("")
  const [client, setClient] = useState("")
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [newClientName, setNewClientName] = useState("")

  const { createDoc } = useFrappeCreateDoc()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      ...(projectType && { project_type: projectType }),
      ...(client && { client }),
    })
    setTitle("")
    setProjectType("")
    setClient("")
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName.trim()) return
    try {
      const doc = await createDoc("Hive Client", {
        company_name: newClientName.trim(),
      })
      toast.success("Client created")
      setClient(doc.name)
      setNewClientName("")
      setNewClientOpen(false)
    } catch {
      toast.error("Failed to create client")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>Create a new project.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                placeholder="Project name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>
              <LinkField
                doctype="Hive Project Type"
                value={projectType}
                onChange={setProjectType}
                placeholder="Select type"
                className="w-full justify-between"
              />
            </div>

            <div className="grid gap-2">
              <Label>Client</Label>
              <div className="flex items-center gap-2">
                <LinkField
                  doctype="Hive Client"
                  value={client}
                  onChange={setClient}
                  placeholder="Select client"
                  filters={{ is_active: 1 }}
                  className="w-full flex-1 justify-between"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setNewClientOpen(true)}
                >
                  <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={!title.trim()}>
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={newClientOpen} onOpenChange={setNewClientOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Client</SheetTitle>
            <SheetDescription>Add a new client to your workspace.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleCreateClient} className="grid gap-4 p-6">
            <div className="grid gap-2">
              <Label htmlFor="client-name">Company Name</Label>
              <Input
                id="client-name"
                placeholder="Acme Inc."
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                autoFocus
              />
            </div>
            <SheetFooter>
              <Button type="submit" disabled={!newClientName.trim()}>
                Create Client
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
