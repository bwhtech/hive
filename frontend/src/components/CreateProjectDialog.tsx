import { useState } from "react"
import { useFrappeGetDocList, useFrappeCreateDoc } from "frappe-react-sdk"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import type { HiveClient } from "@/types"

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

  const { data: projectTypes } = useFrappeGetDocList("Hive Project Type", {
    fields: ["name", "type_name"],
    limit: 50,
    orderBy: { field: "type_name", order: "asc" },
  })

  const { data: clients, mutate: mutateClients } = useFrappeGetDocList<HiveClient>(
    "Hive Client",
    {
      fields: ["name", "company_name", "is_active"],
      filters: [["is_active", "=", 1]],
      limit: 100,
      orderBy: { field: "company_name", order: "asc" },
    },
  )

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
      await mutateClients()
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
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger className="w-full">
                  <span className={projectType ? "" : "text-muted-foreground"}>
                    {projectType
                      ? (projectTypes?.find((t) => t.name === projectType) as { type_name: string } | undefined)?.type_name ?? projectType
                      : "Select type"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {projectTypes?.map((t) => (
                    <SelectItem key={t.name} value={t.name}>
                      {(t as { type_name: string }).type_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Client</Label>
              <div className="flex items-center gap-2">
                <Select value={client} onValueChange={setClient}>
                  <SelectTrigger className="w-full flex-1">
                    <span className={client ? "" : "text-muted-foreground"}>
                      {client
                        ? clients?.find((c) => c.name === client)?.company_name ?? client
                        : "Select client"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
