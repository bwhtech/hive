import { useState } from "react"
import {
  useFrappeGetDocList,
  useFrappeCreateDoc,
  useFrappePostCall,
} from "frappe-react-sdk"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Idea01Icon,
  ArrowTurnForwardIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  FEATURE_REQUEST_PRIORITIES,
  type HiveFeatureRequest,
} from "@/types"

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Open: "outline",
  "Under Review": "default",
  Approved: "secondary",
  Rejected: "destructive",
  Converted: "secondary",
}

const priorityVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  "Nice to Have": "outline",
  Important: "default",
  Critical: "destructive",
}

interface FeatureRequestSectionProps {
  projectId: string
}

export function FeatureRequestSection({ projectId }: FeatureRequestSectionProps) {
  const [createOpen, setCreateOpen] = useState(false)

  const { data: requests, mutate } = useFrappeGetDocList<HiveFeatureRequest>(
    "Hive Feature Request",
    {
      fields: [
        "name",
        "title",
        "project",
        "requested_by",
        "status",
        "priority",
        "description",
        "converted_task",
        "creation",
        "modified",
      ],
      filters: [["project", "=", projectId]],
      orderBy: { field: "creation", order: "desc" },
      limit: 100,
    },
  )

  const { createDoc } = useFrappeCreateDoc()
  const { call: callReview } = useFrappePostCall(
    "run_doc_method",
  )

  const handleCreate = async (values: {
    title: string
    description: string
    priority: string
  }) => {
    try {
      await createDoc("Hive Feature Request", {
        ...values,
        project: projectId,
      })
      mutate()
      setCreateOpen(false)
      toast.success("Feature request created")
    } catch {
      toast.error("Failed to create feature request")
    }
  }

  const handleReview = async (name: string, action: string) => {
    try {
      await callReview({
        dt: "Hive Feature Request",
        dn: name,
        method: "review",
        args: JSON.stringify({ action }),
      })
      mutate()
      toast.success(
        action === "approve"
          ? "Request approved"
          : action === "reject"
            ? "Request rejected"
            : "Request set to under review",
      )
    } catch {
      toast.error("Failed to update request")
    }
  }

  const handleConvert = async (name: string) => {
    try {
      await callReview({
        dt: "Hive Feature Request",
        dn: name,
        method: "convert_to_task",
      })
      mutate()
      toast.success("Feature request converted to task")
    } catch {
      toast.error("Failed to convert request")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {requests?.length ?? 0} request{requests?.length !== 1 ? "s" : ""}
        </h3>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          New Request
        </Button>
      </div>

      {!requests?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <HugeiconsIcon
            icon={Idea01Icon}
            strokeWidth={1.5}
            className="size-10 text-muted-foreground/50 mb-3"
          />
          <p className="text-sm text-muted-foreground">No feature requests yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Submit a feature request to suggest improvements
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {requests.map((req) => (
            <Card key={req.name} size="sm">
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <CardTitle className="text-sm">{req.title}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={statusVariant[req.status] ?? "outline"}
                      className="text-[10px] h-4 px-1.5"
                    >
                      {req.status}
                    </Badge>
                    <Badge
                      variant={priorityVariant[req.priority] ?? "outline"}
                      className="text-[10px] h-4 px-1.5"
                    >
                      {req.priority}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      by {req.requested_by} &middot;{" "}
                      {format(new Date(req.creation), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                {/* Action buttons for team members */}
                {req.status === "Open" && (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Set Under Review"
                      onClick={() => handleReview(req.name, "under_review")}
                    >
                      <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Approve"
                      onClick={() => handleReview(req.name, "approve")}
                    >
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-3.5 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Reject"
                      onClick={() => handleReview(req.name, "reject")}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5 text-red-600" />
                    </Button>
                  </div>
                )}
                {req.status === "Under Review" && (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Approve"
                      onClick={() => handleReview(req.name, "approve")}
                    >
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-3.5 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Reject"
                      onClick={() => handleReview(req.name, "reject")}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5 text-red-600" />
                    </Button>
                  </div>
                )}
                {req.status === "Approved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConvert(req.name)}
                  >
                    <HugeiconsIcon icon={ArrowTurnForwardIcon} strokeWidth={2} data-icon="inline-start" />
                    Convert to Task
                  </Button>
                )}
                {req.status === "Converted" && req.converted_task && (
                  <Badge variant="secondary" className="text-[10px] h-5 px-2">
                    {req.converted_task}
                  </Badge>
                )}
              </CardHeader>
              {req.description && (
                <CardContent>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {stripHtml(req.description)}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <CreateFeatureRequestDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />
    </div>
  )
}

function stripHtml(html: string): string {
  const tmp = document.createElement("div")
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ""
}

function CreateFeatureRequestDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { title: string; description: string; priority: string }) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Nice to Have")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description,
      priority,
    })
    setTitle("")
    setDescription("")
    setPriority("Nice to Have")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Feature Request</DialogTitle>
          <DialogDescription>
            Submit a feature request for this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fr-title">Title</Label>
            <Input
              id="fr-title"
              placeholder="What feature would you like?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FEATURE_REQUEST_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fr-description">Description</Label>
            <Textarea
              id="fr-description"
              placeholder="Describe the feature in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!title.trim()}>
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
