import { useState, useEffect } from "react"
import { useFrappeUpdateDoc, useFrappePostCall, useFrappeGetDocList, useFrappeGetDoc } from "frappe-react-sdk"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Link04Icon,
  UserAdd01Icon,
  Cancel02Icon,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { TASK_STATUSES, TASK_PRIORITIES, type HiveTask, type HiveMember } from "@/types"

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

interface TaskAssigneeRow {
  member: string
  member_name?: string
  user_image?: string
}

export function TaskDetailSheet({ task, open, onOpenChange, onUpdated }: TaskDetailSheetProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Backlog")
  const [priority, setPriority] = useState("Medium")
  const [prLink, setPrLink] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [assignees, setAssignees] = useState<TaskAssigneeRow[]>([])
  const [saving, setSaving] = useState(false)

  const { updateDoc } = useFrappeUpdateDoc()
  const { call: approveUat, loading: approvingUat } = useFrappePostCall("frappe.client.run_doc_method")
  const { call: rejectUat, loading: rejectingUat } = useFrappePostCall("frappe.client.run_doc_method")

  // Fetch full task doc (with child tables) when task changes
  const { data: taskDoc } = useFrappeGetDoc<HiveTask & { assignees?: TaskAssigneeRow[] }>(
    "Hive Task",
    task?.name ?? "",
    task?.name ? undefined : null,
  )

  // Fetch all active members for the picker
  const { data: allMembers } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: ["name", "user", "member_name", "user_image", "type", "is_active"],
      filters: [["is_active", "=", 1]],
      limit: 100,
    },
  )

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

  // Sync assignees from fetched task doc
  useEffect(() => {
    if (taskDoc?.assignees) {
      setAssignees(taskDoc.assignees.map((a) => ({
        member: a.member,
        member_name: a.member_name,
        user_image: a.user_image,
      })))
    } else {
      setAssignees([])
    }
  }, [taskDoc])

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
        assignees: assignees.map((a) => ({ member: a.member })),
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

  const toggleAssignee = (member: HiveMember) => {
    setAssignees((prev) => {
      const exists = prev.some((a) => a.member === member.name)
      if (exists) {
        return prev.filter((a) => a.member !== member.name)
      }
      return [...prev, { member: member.name, member_name: member.member_name, user_image: member.user_image }]
    })
  }

  const removeAssignee = (memberName: string) => {
    setAssignees((prev) => prev.filter((a) => a.member !== memberName))
  }

  const assignedMemberNames = new Set(assignees.map((a) => a.member))

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

            {/* Assignees */}
            <div className="grid gap-2">
              <Label>Assignees</Label>
              <div className="flex flex-wrap items-center gap-2">
                {assignees.map((a) => (
                  <div
                    key={a.member}
                    className="flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2 text-sm"
                  >
                    <Avatar size="sm">
                      {a.user_image ? (
                        <AvatarImage src={a.user_image} alt={a.member_name} />
                      ) : (
                        <AvatarFallback className="text-[10px]">
                          {(a.member_name || a.member).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="truncate max-w-[120px]">{a.member_name || a.member}</span>
                    <button
                      type="button"
                      onClick={() => removeAssignee(a.member)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Cancel02Icon} strokeWidth={2} className="size-3.5" />
                    </button>
                  </div>
                ))}
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" />
                    }
                  >
                    <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-3.5" />
                    Add
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="start">
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {allMembers?.length ? (
                        allMembers.map((m) => (
                          <button
                            key={m.name}
                            type="button"
                            onClick={() => toggleAssignee(m)}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors ${
                              assignedMemberNames.has(m.name) ? "bg-muted" : ""
                            }`}
                          >
                            <Avatar size="sm">
                              {m.user_image ? (
                                <AvatarImage src={m.user_image} alt={m.member_name} />
                              ) : (
                                <AvatarFallback className="text-[10px]">
                                  {(m.member_name || m.name).slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span className="flex-1 truncate text-left">{m.member_name || m.name}</span>
                            {assignedMemberNames.has(m.name) && (
                              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 text-primary" />
                            )}
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground px-2 py-1">No members found</p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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
