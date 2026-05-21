import { useState, useMemo, useEffect } from "react"
import { useFrappeGetDocList } from "frappe-react-sdk"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  UserAdd01Icon,
  Cancel02Icon,
} from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
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
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { LinkField } from "@/components/LinkField"
import { TASK_PRIORITIES, TASK_RECURRENCE_FREQUENCIES, TASK_STATUSES, type HiveMember } from "@/types"
import { useUser } from "@/context/UserContext"
import { LazyTiptapEditor } from "@/components/LazyTiptapEditor"

interface AssigneeRow {
  member: string
  member_name?: string
  user_image?: string
}

interface CreateTaskValues {
  title: string
  description?: string
  priority: string
  status: string
  due_date?: string | null
  start_date?: string | null
  is_internal?: 0 | 1
  milestone?: string | null
  _assign_users?: string[]
  project?: string
  recurrence_frequency?: string | null
  recurrence_end_date?: string | null
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateTaskValues) => void
  /** When provided, the task is created in this project and no picker is shown. */
  projectId?: string | null
}

const DRAFT_KEY = "hive-create-task-draft"

interface TaskDraft {
  title: string
  description: string
  priority: string
  status: string
  dueDate: string | null
  startDate: string | null
  isInternal: boolean
  assignees: AssigneeRow[]
  selectedMilestone: string
  selectedProject: string
  recurrenceFrequency: string
  recurrenceEndDate: string | null
}

function loadDraft(): Partial<TaskDraft> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupted data
  }
  return {}
}

export function CreateTaskDialog({ open, onOpenChange, onSubmit, projectId }: CreateTaskDialogProps) {
  const [initialDraft] = useState<Partial<TaskDraft>>(() => loadDraft())
  const [title, setTitle] = useState(initialDraft.title ?? "")
  const [description, setDescription] = useState(initialDraft.description ?? "")
  const [editorInitialContent, setEditorInitialContent] = useState(initialDraft.description ?? "")
  const [editorKey, setEditorKey] = useState(0)
  const [priority, setPriority] = useState(initialDraft.priority ?? "Medium")
  const [status, setStatus] = useState(initialDraft.status ?? "To Do")
  const [dueDate, setDueDate] = useState<Date | undefined>(initialDraft.dueDate ? new Date(initialDraft.dueDate) : undefined)
  const [startDate, setStartDate] = useState<Date | undefined>(initialDraft.startDate ? new Date(initialDraft.startDate) : undefined)
  const [isInternal, setIsInternal] = useState(initialDraft.isInternal ?? false)
  const [assignees, setAssignees] = useState<AssigneeRow[]>(initialDraft.assignees ?? [])
  const [selectedMilestone, setSelectedMilestone] = useState(initialDraft.selectedMilestone ?? "")
  const [selectedProject, setSelectedProject] = useState(initialDraft.selectedProject ?? "")
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(initialDraft.recurrenceFrequency ?? "")
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(
    initialDraft.recurrenceEndDate ? new Date(initialDraft.recurrenceEndDate) : undefined,
  )

  const isMobile = useIsMobile()

  // Sync form state to localStorage so drafts survive page navigations
  useEffect(() => {
    const hasContent =
      title || description || priority !== "Medium" || status !== "To Do" ||
      dueDate || startDate || isInternal || assignees.length > 0 ||
      selectedMilestone || selectedProject || recurrenceFrequency || recurrenceEndDate
    if (hasContent) {
      const draft: TaskDraft = {
        title, description, priority, status,
        dueDate: dueDate?.toISOString() ?? null,
        startDate: startDate?.toISOString() ?? null,
        isInternal, assignees, selectedMilestone, selectedProject,
        recurrenceFrequency,
        recurrenceEndDate: recurrenceEndDate?.toISOString() ?? null,
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } else {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [title, description, priority, status, dueDate, startDate, isInternal, assignees, selectedMilestone, selectedProject, recurrenceFrequency, recurrenceEndDate])

  const { user } = useUser()
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

  const mentionSuggestions = useMemo(
    () =>
      allMembers?.map((m) => ({
        id: m.user,
        label: m.member_name || m.user,
        image: m.user_image || null,
      })) ?? [],
    [allMembers],
  )

  // Sort members: current user first
  const sortedMembers = useMemo(() => {
    if (!allMembers) return []
    if (!user?.email) return allMembers
    return [...allMembers].sort((a, b) => {
      const aIsCurrent = a.user === user.email ? -1 : 0
      const bIsCurrent = b.user === user.email ? -1 : 0
      return aIsCurrent - bIsCurrent
    })
  }, [allMembers, user?.email])

  const resolvedProject = projectId || selectedProject

  const canSubmit = title.trim() && resolvedProject

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      title: title.trim(),
      description: description || undefined,
      priority,
      status,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
      is_internal: isInternal ? 1 : 0,
      milestone: selectedMilestone || null,
      _assign_users: assignees.map((a) => a.member),
      project: resolvedProject,
      recurrence_frequency: recurrenceFrequency || null,
      recurrence_end_date: recurrenceFrequency && recurrenceEndDate ? format(recurrenceEndDate, "yyyy-MM-dd") : null,
    })
    localStorage.removeItem(DRAFT_KEY)
    setTitle("")
    setDescription("")
    setEditorInitialContent("")
    setEditorKey((k) => k + 1)
    setPriority("Medium")
    setStatus("To Do")
    setDueDate(undefined)
    setStartDate(undefined)
    setIsInternal(false)
    setAssignees([])
    setSelectedMilestone("")
    setSelectedProject("")
    setRecurrenceFrequency("")
    setRecurrenceEndDate(undefined)
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

  const assignedMemberNames = useMemo(() => new Set(assignees.map((a) => a.member)), [assignees])

  const milestoneFilters = useMemo(() => ({ project: resolvedProject }), [resolvedProject])

  // --- Shared form field renderers ---

  const projectPickerField = needsProjectPicker && (
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
  )

  const priorityStatusFields = (
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
  )

  const milestoneField = resolvedProject && (
    <div className="grid gap-2">
      <Label>Milestone</Label>
      <LinkField
        doctype="Hive Milestone"
        value={selectedMilestone}
        onChange={setSelectedMilestone}
        placeholder="None"
        filters={milestoneFilters}
        className="w-full"
      />
    </div>
  )

  const assigneesField = (
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
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search members..." />
              <CommandList>
                <CommandEmpty>No members found</CommandEmpty>
                <CommandGroup>
                  {sortedMembers.map((m) => (
                    <CommandItem
                      key={m.name}
                      value={m.member_name || m.name}
                      data-checked={assignedMemberNames.has(m.name)}
                      onSelect={() => toggleAssignee(m)}
                    >
                      <MemberAvatar size="sm" name={m.member_name || m.name} image={m.user_image} />
                      <span className="flex-1 truncate">
                        {m.member_name || m.name}
                        {m.user === user?.email && <span className="text-muted-foreground ml-1">(you)</span>}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )

  const dateFields = (
    <div className="grid grid-cols-2 gap-4">
      <DatePickerField date={startDate} onSelect={setStartDate} label="Start Date" />
      <DatePickerField date={dueDate} onSelect={setDueDate} label="Due Date" />
    </div>
  )

  const recurrenceFields = (
    <div className="grid gap-2">
      <Label>Recurrence</Label>
      <Select value={recurrenceFrequency || "none"} onValueChange={(v) => setRecurrenceFrequency(v === "none" ? "" : v)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {TASK_RECURRENCE_FREQUENCIES.map((f) => (
            <SelectItem key={f} value={f}>{f}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {recurrenceFrequency && (
        <DatePickerField date={recurrenceEndDate} onSelect={setRecurrenceEndDate} label="Repeat Until" />
      )}
    </div>
  )

  const internalCheckbox = (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isInternal}
        onChange={(e) => setIsInternal(e.target.checked)}
        className="size-4 rounded border accent-primary"
      />
      <span className="text-sm">Internal task</span>
    </label>
  )

  // Mobile: keep existing Dialog layout
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>Add a task to this project.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {projectPickerField}
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
            <div className="grid gap-2">
              <Label>Description</Label>
              <LazyTiptapEditor
                key={editorKey}
                content={editorInitialContent}
                onChange={setDescription}
                placeholder="Add a description..."
                className="max-h-[200px] overflow-y-auto [&_.tiptap-content]:min-h-[60px]"
                mentionSuggestions={mentionSuggestions}
              />
            </div>
            {priorityStatusFields}
            {milestoneField}
            {assigneesField}
            {dateFields}
            {recurrenceFields}
            {internalCheckbox}
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

  // Desktop: centered Dialog with two-column layout
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="grid w-full max-w-5xl gap-0 p-0 sm:max-w-5xl max-h-[85vh] overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex max-h-[85vh] flex-col">
          <DialogHeader className="flex-row items-center justify-between space-y-0 border-b px-6 py-4">
            <div className="flex flex-col gap-1">
              <DialogTitle>New Task</DialogTitle>
              <DialogDescription>Add a task to this project.</DialogDescription>
            </div>
            <Button type="submit" disabled={!canSubmit}>
              Create Task
            </Button>
          </DialogHeader>

          <div className="flex flex-1 gap-6 overflow-y-auto p-6 min-h-0">
            {/* Left column – options (35%) */}
            <div className="flex w-[35%] shrink-0 flex-col gap-4">
              {projectPickerField}
              {priorityStatusFields}
              {milestoneField}
              {assigneesField}
              {dateFields}
              {recurrenceFields}
              {internalCheckbox}
            </div>

            {/* Right column – data fields (65%) */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-title-desktop">Title</Label>
                <Input
                  id="task-title-desktop"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid flex-1 gap-2">
                <Label>Description</Label>
                <LazyTiptapEditor
                  key={editorKey}
                  content={editorInitialContent}
                  onChange={setDescription}
                  placeholder="Add a description..."
                  className="min-h-[200px] flex-1 overflow-y-auto [&_.tiptap-content]:min-h-[160px]"
                  mentionSuggestions={mentionSuggestions}
                />
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DatePickerField({
  date,
  onSelect,
  label,
}: {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button type="button" variant="outline" className="w-full justify-start text-left font-normal" />
          }
        >
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="mr-2 size-4" />
          {date ? (
            format(date, "MMM d, yyyy")
          ) : (
            <span className="text-muted-foreground">Pick date</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={(d) => { onSelect(d); setOpen(false) }} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
