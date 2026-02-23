import { useState, useMemo } from "react"
import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeUpdateDoc } from "frappe-react-sdk"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Calendar03Icon, Target02Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { MILESTONE_STATUSES, TASK_SIZE_WEIGHT, type HiveMilestone, type HiveTask } from "@/types"

const milestoneStatusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Upcoming: "outline",
  "In Progress": "secondary",
  Completed: "secondary",
}

interface MilestoneSectionProps {
  projectId: string
  tasks?: HiveTask[]
}

function getWeight(size: string | null | undefined): number {
  return TASK_SIZE_WEIGHT[size ?? ""] ?? 1
}

export function MilestoneSection({ projectId, tasks }: MilestoneSectionProps) {
  const [createOpen, setCreateOpen] = useState(false)

  const { data: milestones, mutate } = useFrappeGetDocList<HiveMilestone>(
    "Hive Milestone",
    {
      fields: ["name", "title", "project", "status", "target_date", "description", "creation", "modified"],
      filters: [["project", "=", projectId]],
      orderBy: { field: "target_date", order: "asc" },
      limit: 50,
    },
  )

  // Compute weighted progress per milestone
  const progressByMilestone = useMemo(() => {
    const map: Record<string, { total: number; done: number; taskCount: number; doneCount: number }> = {}
    if (!tasks) return map
    for (const task of tasks) {
      if (!task.milestone) continue
      if (!map[task.milestone]) {
        map[task.milestone] = { total: 0, done: 0, taskCount: 0, doneCount: 0 }
      }
      const w = getWeight(task.size)
      map[task.milestone].total += w
      map[task.milestone].taskCount += 1
      if (task.status === "Done") {
        map[task.milestone].done += w
        map[task.milestone].doneCount += 1
      }
    }
    return map
  }, [tasks])

  const { createDoc } = useFrappeCreateDoc()
  const { updateDoc } = useFrappeUpdateDoc()

  const handleCreate = async (values: { title: string; target_date: string | null; description: string }) => {
    try {
      await createDoc("Hive Milestone", {
        ...values,
        project: projectId,
      })
      mutate()
      setCreateOpen(false)
      toast.success("Milestone created")
    } catch {
      toast.error("Failed to create milestone")
    }
  }

  const handleStatusChange = async (name: string, status: string) => {
    try {
      await updateDoc("Hive Milestone", name, { status })
      mutate()
    } catch {
      toast.error("Failed to update milestone")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {milestones?.length ?? 0} milestone{milestones?.length !== 1 ? "s" : ""}
        </h3>
        <Button variant="secondary" size="sm" onClick={() => setCreateOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Add Milestone
        </Button>
      </div>

      {!milestones?.length ? (
        <Empty className="border rounded-xl py-12">
          <EmptyHeader>
            <EmptyMedia>
              <HugeiconsIcon icon={Target02Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No milestones yet</EmptyTitle>
            <EmptyDescription>Create a milestone to track project progress</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-3">
          {milestones.map((ms) => (
            <Card key={ms.name} size="sm">
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-sm">{ms.title}</CardTitle>
                  {ms.target_date && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
                      {format(new Date(ms.target_date), "MMM d, yyyy")}
                    </div>
                  )}
                </div>
                <Select
                  value={ms.status}
                  onValueChange={(val) => handleStatusChange(ms.name, val)}
                >
                  <SelectTrigger className="w-auto h-7 text-xs gap-1.5 px-2">
                    <Badge variant={milestoneStatusVariant[ms.status] ?? "outline"} className="text-[10px] h-4 px-1.5">
                      {ms.status}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {MILESTONE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {(() => {
                  const progress = progressByMilestone[ms.name]
                  if (!progress || progress.total === 0) {
                    if (ms.description) {
                      return <p className="text-xs text-muted-foreground line-clamp-2">{stripHtml(ms.description)}</p>
                    }
                    return <p className="text-xs text-muted-foreground">No tasks linked</p>
                  }
                  const pct = Math.round((progress.done / progress.total) * 100)
                  return (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{progress.doneCount}/{progress.taskCount} tasks</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateMilestoneDialog
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

function CreateMilestoneDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { title: string; target_date: string | null; description: string }) => void
}) {
  const [title, setTitle] = useState("")
  const [targetDate, setTargetDate] = useState<Date | undefined>()
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      target_date: targetDate ? format(targetDate, "yyyy-MM-dd") : null,
      description,
    })
    setTitle("")
    setTargetDate(undefined)
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Milestone</DialogTitle>
          <DialogDescription>Add a milestone to track project progress.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ms-title">Title</Label>
            <Input
              id="ms-title"
              placeholder="e.g. Beta Release"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label>Target Date</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="outline" className="w-full justify-start text-left font-normal" />
                }
              >
                <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="mr-2 size-4" />
                {targetDate ? format(targetDate, "MMM d, yyyy") : <span className="text-muted-foreground">Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-description">Description</Label>
            <Textarea
              id="ms-description"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!title.trim()}>
              Create Milestone
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
