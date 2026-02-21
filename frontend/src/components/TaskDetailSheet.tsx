import { useState, useEffect } from "react"
import { useFrappeUpdateDoc, useFrappePostCall } from "frappe-react-sdk"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Link04Icon,
} from "@hugeicons/core-free-icons"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { TASK_STATUSES, TASK_PRIORITIES, type HiveTask } from "@/types"

interface TaskDetailSheetProps {
  task: HiveTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

const uatVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "outline",
  Approved: "default",
  Rejected: "destructive",
}

export function TaskDetailSheet({ task, open, onOpenChange, onUpdated }: TaskDetailSheetProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Backlog")
  const [priority, setPriority] = useState("Medium")
  const [prLink, setPrLink] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [saving, setSaving] = useState(false)

  const { updateDoc } = useFrappeUpdateDoc()
  const { call: approveUat, loading: approvingUat } = useFrappePostCall("frappe.client.run_doc_method")
  const { call: rejectUat, loading: rejectingUat } = useFrappePostCall("frappe.client.run_doc_method")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setPriority(task.priority)
      setPrLink(task.pr_link || "")
      setDueDate(task.due_date ? new Date(task.due_date) : undefined)
      setStartDate(task.start_date ? new Date(task.start_date) : undefined)
    }
  }, [task])

  if (!task) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateDoc("Hive Task", task.name, {
        title,
        description,
        status,
        priority,
        pr_link: prLink || null,
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
      })
      toast.success("Task updated")
      onUpdated()
    } catch {
      toast.error("Failed to update task")
    } finally {
      setSaving(false)
    }
  }

  const handleApproveUat = async () => {
    try {
      await approveUat({
        dt: "Hive Task",
        dn: task.name,
        method: "approve_uat",
      })
      toast.success("UAT approved")
      onUpdated()
    } catch {
      toast.error("Failed to approve UAT")
    }
  }

  const handleRejectUat = async () => {
    try {
      await rejectUat({
        dt: "Hive Task",
        dn: task.name,
        method: "reject_uat",
      })
      toast.success("UAT rejected")
      onUpdated()
    } catch {
      toast.error("Failed to reject UAT")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
          <SheetDescription>{task.name}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="grid gap-5 px-6 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="task-detail-title">Title</Label>
              <Input
                id="task-detail-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                    <SelectItem value="Blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <DatePicker date={startDate} onSelect={setStartDate} />
              </div>
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <DatePicker date={dueDate} onSelect={setDueDate} />
              </div>
            </div>

            {/* PR Link */}
            <div className="grid gap-2">
              <Label htmlFor="task-pr-link">PR Link</Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Link04Icon}
                  strokeWidth={2}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                />
                <Input
                  id="task-pr-link"
                  placeholder="https://github.com/..."
                  value={prLink}
                  onChange={(e) => setPrLink(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* UAT Section */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">UAT Status</Label>
                <Badge variant={uatVariant[task.uat_status] ?? "outline"}>
                  {task.uat_status || "Pending"}
                </Badge>
              </div>
              {task.uat_approved_by && (
                <p className="text-xs text-muted-foreground">
                  {task.uat_status === "Approved" ? "Approved" : "Rejected"} by{" "}
                  {task.uat_approved_by} on {task.uat_date}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleApproveUat}
                  disabled={approvingUat || task.uat_status === "Approved"}
                  className="flex-1"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} data-icon="inline-start" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRejectUat}
                  disabled={rejectingUat || task.uat_status === "Rejected"}
                  className="flex-1"
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} data-icon="inline-start" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function DatePicker({
  date,
  onSelect,
}: {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-start text-left font-normal" />
        }
      >
        <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="mr-2 size-4" />
        {date ? format(date, "MMM d, yyyy") : <span className="text-muted-foreground">Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
