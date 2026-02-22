import { useState } from "react"
import { useFrappeGetDocList } from "frappe-react-sdk"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  UserAdd01Icon,
  Cancel02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MemberAvatar } from "@/components/MemberAvatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { TASK_PRIORITIES, TASK_STATUSES, type HiveMember } from "@/types"

interface AssigneeRow {
  member: string
  member_name?: string
  user_image?: string
}

interface CreateTaskValues {
  title: string
  priority: string
  status: string
  due_date?: string | null
  start_date?: string | null
  is_internal?: 0 | 1
  assignees?: { member: string }[]
  project?: string
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateTaskValues) => void
  /** When provided, the task is created in this project and no picker is shown. */
  projectId?: string | null
}

export function CreateTaskDialog({ open, onOpenChange, onSubmit, projectId }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [status, setStatus] = useState("Backlog")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [isInternal, setIsInternal] = useState(false)
  const [assignees, setAssignees] = useState<AssigneeRow[]>([])
  const [selectedProject, setSelectedProject] = useState("")

  const needsProjectPicker = !projectId

  const { data: projects } = useFrappeGetDocList<{ name: string; title: string }>(
    "Hive Project",
    {
      fields: ["name", "title"],
      filters: [["status", "=", "Open"]],
      orderBy: { field: "modified", order: "desc" },
      limit: 100,
    },
    needsProjectPicker ? undefined : null,
  )

  const { data: allMembers } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: ["name", "user", "member_name", "user_image", "type", "is_active"],
      filters: [["is_active", "=", 1]],
      limit: 100,
    },
  )

  const resolvedProject = projectId || selectedProject
  const canSubmit = title.trim() && resolvedProject

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      title: title.trim(),
      priority,
      status,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
      is_internal: isInternal ? 1 : 0,
      assignees: assignees.map((a) => ({ member: a.member })),
      project: resolvedProject,
    })
    setTitle("")
    setPriority("Medium")
    setStatus("Backlog")
    setDueDate(undefined)
    setStartDate(undefined)
    setIsInternal(false)
    setAssignees([])
    setSelectedProject("")
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Add a task to this project.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {needsProjectPicker && (
            <div className="grid gap-2">
              <Label>Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((p) => (
                    <SelectItem key={p.name} value={p.name}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  <MemberAvatar size="sm" name={a.member_name || a.member} image={a.user_image} />
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
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" />
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
                          <MemberAvatar size="sm" name={m.member_name || m.name} image={m.user_image} />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline" className="w-full justify-start text-left font-normal" />
                  }
                >
                  <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="mr-2 size-4" />
                  {startDate ? (
                    format(startDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">Pick date</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline" className="w-full justify-start text-left font-normal" />
                  }
                >
                  <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="mr-2 size-4" />
                  {dueDate ? (
                    format(dueDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">Pick date</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="size-4 rounded border accent-primary"
            />
            <span className="text-sm">Internal task</span>
          </label>

          <DialogFooter>
            <Button type="submit" disabled={!canSubmit}>
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
