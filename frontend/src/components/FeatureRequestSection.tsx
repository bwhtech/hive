import { useState, useMemo } from "react"
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
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { LazyTiptapEditor } from "@/components/LazyTiptapEditor"
import {
  FEATURE_REQUEST_PRIORITIES,
  type HiveFeatureRequest,
  type HiveMember,
} from "@/types"
import { FEATURE_REQUEST_STATUS_VARIANT, FEATURE_REQUEST_PRIORITY_VARIANT } from "@/lib/variants"

interface FeatureRequestSectionProps {
  projectId: string
  createOpen?: boolean
  onCreateOpenChange?: (open: boolean) => void
}

export function FeatureRequestSection({
  projectId,
  createOpen: controlledCreateOpen,
  onCreateOpenChange,
}: FeatureRequestSectionProps) {
  const [internalCreateOpen, setInternalCreateOpen] = useState(false)
  const createOpen = controlledCreateOpen ?? internalCreateOpen
  const setCreateOpen = onCreateOpenChange ?? setInternalCreateOpen

  // Fetch members for @mention suggestions
  const { data: allMembers } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: ["name", "user", "member_name", "user_image", "is_active"],
      filters: [["is_active", "=", 1]],
      limit: 100,
    },
  )

  const mentionSuggestions = useMemo(
    () =>
      allMembers?.map((m) => ({
        id: m.user,
        label: m.member_name || m.user,
        image: m.user_image || null,
      })) ?? [],
    [allMembers],
  )

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
        <Button variant="secondary" size="sm" onClick={() => setCreateOpen(true)}>
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
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="hidden sm:table-cell">Requested By</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.name}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate max-w-[300px]">
                        {req.title}
                      </p>
                      {req.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-[300px] mt-0.5">
                          {stripHtml(req.description)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={FEATURE_REQUEST_STATUS_VARIANT[req.status] ?? "outline"}
                      className="text-[10px] h-5 px-1.5"
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={FEATURE_REQUEST_PRIORITY_VARIANT[req.priority] ?? "outline"}
                      className="text-[10px] h-5 px-1.5"
                    >
                      {req.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                    {req.requested_by}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                    {format(new Date(req.creation), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      req={req}
                      onReview={handleReview}
                      onConvert={handleConvert}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateFeatureRequestDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        mentionSuggestions={mentionSuggestions}
      />
    </div>
  )
}

function RowActions({
  req,
  onReview,
  onConvert,
}: {
  req: HiveFeatureRequest
  onReview: (name: string, action: string) => void
  onConvert: (name: string) => void
}) {
  const hasActions =
    req.status === "Open" ||
    req.status === "Under Review" ||
    req.status === "Approved"

  if (!hasActions && !(req.status === "Converted" && req.converted_task)) {
    return null
  }

  if (req.status === "Converted" && req.converted_task) {
    return (
      <Badge variant="secondary" className="text-[10px] h-5 px-2">
        {req.converted_task}
      </Badge>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" />}
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {req.status === "Open" && (
          <>
            <DropdownMenuItem onClick={() => onReview(req.name, "under_review")}>
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
              Set Under Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReview(req.name, "approve")}>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="text-green-600" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onReview(req.name, "reject")}>
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              Reject
            </DropdownMenuItem>
          </>
        )}
        {req.status === "Under Review" && (
          <>
            <DropdownMenuItem onClick={() => onReview(req.name, "approve")}>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="text-green-600" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onReview(req.name, "reject")}>
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              Reject
            </DropdownMenuItem>
          </>
        )}
        {req.status === "Approved" && (
          <DropdownMenuItem onClick={() => onConvert(req.name)}>
            <HugeiconsIcon icon={ArrowTurnForwardIcon} strokeWidth={2} />
            Convert to Task
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
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
  mentionSuggestions,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { title: string; description: string; priority: string }) => void
  mentionSuggestions: { id: string; label: string; image: string | null }[]
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Nice to Have")
  const [editorKey, setEditorKey] = useState(0)

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
    setEditorKey((k) => k + 1)
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
            <Label>Description</Label>
            <LazyTiptapEditor
              key={editorKey}
              content={description}
              onChange={(html) => setDescription(html)}
              placeholder="Describe the feature in detail..."
              mentionSuggestions={mentionSuggestions}
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
