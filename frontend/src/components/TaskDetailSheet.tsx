import { useState, useEffect, useRef, useMemo } from "react"
import { useShortcut } from "@/hooks/useShortcut"
import { useFrappeUpdateDoc, useFrappePostCall, useFrappeGetDocList, useFrappeGetDoc, useFrappeGetCall } from "frappe-react-sdk"
import { startOfDay, isBefore } from "date-fns"
import { Spinner } from "@/components/ui/spinner"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Link04Icon,
  UserAdd01Icon,
  Cancel02Icon,
  Delete02Icon,
  PinIcon,
  PinOffIcon,
} from "@hugeicons/core-free-icons"
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { toast } from "sonner"
import { LazyTiptapEditor } from "@/components/LazyTiptapEditor"
import { useUser } from "@/context/UserContext"
import { TaskCommentsSection } from "@/components/TaskCommentsSection"
import { TaskAttachments } from "@/components/TaskAttachments"
import { LinkField } from "@/components/LinkField"
import { useCelebration } from "@/hooks/useTaskCelebration"
import { TASK_STATUSES, TASK_PRIORITIES, TASK_SIZES, TASK_RECURRENCE_FREQUENCIES, type HiveTask, type HiveMember } from "@/types"

interface TaskDetailSheetProps {
  task: HiveTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
  hasClient?: boolean
  isPinned?: boolean
  onTogglePin?: (taskName: string) => void
  initialAssignees?: AssigneeDisplay[]
}

const uatVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "outline",
  Approved: "default",
  Rejected: "destructive",
}

interface AssigneeDisplay {
  member: string
  member_name?: string
  user_image?: string
}

export function TaskDetailSheet({ task, open, onOpenChange, onUpdated, hasClient = true, isPinned, onTogglePin, initialAssignees }: TaskDetailSheetProps) {
  const isMobile = useIsMobile()
  const { isClient, user } = useUser()
  const { celebrate } = useCelebration()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Backlog")
  const [priority, setPriority] = useState("Medium")
  const [size, setSize] = useState("")
  const [milestone, setMilestone] = useState("")
  const [dependsOn, setDependsOn] = useState("")
  const [prLink, setPrLink] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [completedOn, setCompletedOn] = useState<Date | undefined>()
  const [recurrenceFrequency, setRecurrenceFrequency] = useState("")
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>()
  const [assignees, setAssignees] = useState<AssigneeDisplay[]>([])
  const [saving, setSaving] = useState(false)
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const userEditedRef = useRef(false)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const autosaveRef = useRef<() => void>(() => {})

  const markEdited = () => {
    userEditedRef.current = true
    setAutosaveStatus("idle")
  }

  const { updateDoc } = useFrappeUpdateDoc()
  const { call: approveUat, loading: approvingUat } = useFrappePostCall("run_doc_method")
  const { call: rejectUat, loading: rejectingUat } = useFrappePostCall("run_doc_method")
  const { call: callAssign } = useFrappePostCall("frappe.desk.form.assign_to.add")
  const { call: callUnassign } = useFrappePostCall("frappe.desk.form.assign_to.remove")
  const { call: callCreateIssue } = useFrappePostCall("bwh_hive.bwh_hive.github.create_issue")
  const [creatingIssue, setCreatingIssue] = useState(false)

  // Fetch full task doc when task changes
  const { data: taskDoc, mutate: mutateTaskDoc } = useFrappeGetDoc<HiveTask>(
    "Hive Task",
    task?.name ?? "",
    task?.name ? undefined : null,
  )

  // Fetch project to check github_repo
  const { data: projectDoc } = useFrappeGetDoc<{ github_repo: string | null }>(
    "Hive Project",
    task?.project ?? "",
    task?.project ? undefined : null,
  )

  // Fetch GitHub connection status
  const { data: ghStatus } = useFrappeGetCall<{ message: { app_configured: boolean; connected: boolean } }>(
    "bwh_hive.bwh_hive.github.status",
  )

  // Fetch Hive Settings (single doctype) for due date lock config
  const { data: hiveSettings } = useFrappeGetDoc<{ lock_due_date_on_or_after: 0 | 1 }>(
    "Hive Settings",
    "Hive Settings",
  )

  const isDueDateLocked = useMemo(() => {
    if (!hiveSettings?.lock_due_date_on_or_after || !dueDate) return false
    return !isBefore(startOfDay(new Date()), startOfDay(dueDate))
  }, [hiveSettings?.lock_due_date_on_or_after, dueDate])

  // Fetch all active members for the picker
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

  const milestoneFilters = useMemo(() => ({ project: task?.project }), [task?.project])
  const dependsOnFilters = useMemo(() => ({ project: task?.project, is_archived: 0 }), [task?.project])

  const [assigneePopoverOpen, setAssigneePopoverOpen] = useState(false)

  // Only reset form when a different task opens (not on refetch of same task)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (task) {
      userEditedRef.current = false
      setAutosaveStatus("idle")
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setPriority(task.priority)
      setSize(task.size || "")
      setMilestone(task.milestone || "")
      setDependsOn(task.depends_on || "")
      setPrLink(task.pr_link || "")
      setDueDate(task.due_date ? new Date(task.due_date) : undefined)
      setStartDate(task.start_date ? new Date(task.start_date) : undefined)
      setCompletedOn(task.completed_on ? new Date(task.completed_on) : undefined)
      setRecurrenceFrequency(task.recurrence_frequency || "")
      setRecurrenceEndDate(task.recurrence_end_date ? new Date(task.recurrence_end_date) : undefined)
    }
  }, [task?.name])

  // Sync assignees from initialAssignees prop (REST API strips _assign field)
  useEffect(() => {
    setAssignees(initialAssignees ?? [])
  }, [task?.name, initialAssignees])

  // Ref to hold latest save function for keyboard shortcut
  const saveRef = useRef<() => void>(() => {})

  // Task-level keyboard shortcuts (only when sheet is open and not client)
  useShortcut([
    {
      key: "Enter",
      ctrl: true,
      description: "Save task",
      group: "Task Detail",
      handler: () => saveRef.current(),
      allowInInput: true,
      condition: () => open && !isClient,
    },
    {
      key: "a",
      description: "Add assignee",
      group: "Task Detail",
      handler: () => setAssigneePopoverOpen(true),
      condition: () => open && !isClient,
    },
    {
      key: "p",
      description: "Pin / unpin task",
      group: "Task Detail",
      handler: () => { if (onTogglePin && task) onTogglePin(task.name) },
      condition: () => open && !isClient,
    },
  ])

  // Autosave: debounce 1.5s after user edits
  useEffect(() => {
    if (!open || isClient || !userEditedRef.current) return

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => {
      autosaveRef.current()
    }, 1500)

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
        autosaveTimerRef.current = undefined
      }
    }
  }, [title, description, status, priority, size, milestone, dependsOn, prLink, dueDate, startDate, completedOn, recurrenceFrequency, recurrenceEndDate, open, isClient])

  const assignedMemberNames = useMemo(() => new Set(assignees.map((a) => a.member)), [assignees])

  if (!task) return null

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    if (newStatus === "Done" && !completedOn) {
      setCompletedOn(new Date())
      celebrate()
    } else if (newStatus !== "Done") {
      setCompletedOn(undefined)
    }
  }

  const handleSave = async (silent = false) => {
    if (saving || !title.trim()) return
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
      autosaveTimerRef.current = undefined
    }
    setSaving(true)
    if (silent) setAutosaveStatus("saving")
    try {
      await updateDoc("Hive Task", task.name, {
        title,
        description,
        status,
        priority,
        size: size || null,
        milestone: milestone || null,
        depends_on: dependsOn || null,
        pr_link: prLink || null,
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
        completed_on: completedOn ? format(completedOn, "yyyy-MM-dd") : null,
        recurrence_frequency: recurrenceFrequency || null,
        recurrence_end_date: recurrenceFrequency && recurrenceEndDate ? format(recurrenceEndDate, "yyyy-MM-dd") : null,
      })
      userEditedRef.current = false
      if (silent) {
        setAutosaveStatus("saved")
      } else {
        toast.success("Task updated")
      }
      onUpdated()
    } catch {
      toast.error("Failed to save task")
      if (silent) setAutosaveStatus("idle")
    } finally {
      setSaving(false)
    }
  }

  saveRef.current = handleSave
  autosaveRef.current = () => handleSave(true)

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

  const handleArchive = async () => {
    try {
      await updateDoc("Hive Task", task.name, { is_archived: 1 })
      onOpenChange(false)
      onUpdated()
      toast("Task deleted", {
        duration: 6000,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await updateDoc("Hive Task", task.name, { is_archived: 0 })
              onUpdated()
            } catch {
              toast.error("Failed to restore task")
            }
          },
        },
      })
    } catch {
      toast.error("Failed to delete task")
    }
  }

  const handleConvertToIssue = async () => {
    if (creatingIssue || !task) return
    setCreatingIssue(true)
    try {
      const res = await callCreateIssue({ task_name: task.name })
      const issueUrl = res?.message?.issue_url
      if (issueUrl) {
        toast.success("GitHub issue created", {
          action: {
            label: "Open",
            onClick: () => window.open(issueUrl, "_blank"),
          },
        })
        mutateTaskDoc()
        onUpdated()
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create GitHub issue"
      toast.error(msg)
    } finally {
      setCreatingIssue(false)
    }
  }

  const toggleAssignee = async (member: HiveMember) => {
    const exists = assignees.some((a) => a.member === member.name)
    try {
      if (exists) {
        setAssignees((prev) => prev.filter((a) => a.member !== member.name))
        await callUnassign({ doctype: "Hive Task", name: task.name, assign_to: member.name })
      } else {
        setAssignees((prev) => [...prev, { member: member.name, member_name: member.member_name, user_image: member.user_image }])
        await callAssign({ doctype: "Hive Task", name: task.name, assign_to: [member.name] })
      }
      mutateTaskDoc()
      onUpdated()
    } catch {
      toast.error("Failed to update assignee")
      mutateTaskDoc()
    }
  }

  const removeAssignee = async (memberName: string) => {
    setAssignees((prev) => prev.filter((a) => a.member !== memberName))
    try {
      await callUnassign({ doctype: "Hive Task", name: task.name, assign_to: memberName })
      mutateTaskDoc()
      onUpdated()
    } catch {
      toast.error("Failed to remove assignee")
      mutateTaskDoc()
    }
  }

  const formContent = (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="grid gap-5 overflow-hidden px-6 py-4">
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="task-detail-title">Title</Label>
          {isClient ? (
            <p className="text-sm py-1">{title}</p>
          ) : (
            <Input
              id="task-detail-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); markEdited() }}
            />
          )}
        </div>

        {/* Status, Priority & Size */}
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Status</Label>
            {isClient ? (
              <Badge variant="outline" className="w-fit">{status}</Badge>
            ) : (
              <Select value={status} onValueChange={(v) => { handleStatusChange(v); markEdited() }}>
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
            )}
          </div>
          <div className="grid gap-2">
            <Label>Priority</Label>
            {isClient ? (
              <Badge variant="outline" className="w-fit">{priority}</Badge>
            ) : (
              <Select value={priority} onValueChange={(v) => { setPriority(v); markEdited() }}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Size</Label>
            {isClient ? (
              <Badge variant="outline" className="w-fit">{size || "None"}</Badge>
            ) : (
              <Select value={size} onValueChange={(v) => { setSize(v); markEdited() }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {TASK_SIZES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Milestone */}
        <div className="grid gap-2">
          <Label>Milestone</Label>
          {isClient ? (
            <p className="text-sm text-muted-foreground py-1">
              {milestone || "None"}
            </p>
          ) : (
            <LinkField
              doctype="Hive Milestone"
              value={milestone}
              onChange={(v) => { setMilestone(v); markEdited() }}
              placeholder="None"
              filters={milestoneFilters}
              className="w-full"
            />
          )}
        </div>

        {/* Depends On */}
        <div className="grid gap-2">
          <Label>Depends On</Label>
          {isClient ? (
            <p className="text-sm text-muted-foreground py-1">
              {dependsOn || "None"}
            </p>
          ) : (
            <LinkField
              doctype="Hive Task"
              value={dependsOn}
              onChange={(v) => { setDependsOn(v); markEdited() }}
              placeholder="None"
              filters={dependsOnFilters}
              className="w-full"
            />
          )}
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
                {!isClient && (
                  <button
                    type="button"
                    onClick={() => removeAssignee(a.member)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <HugeiconsIcon icon={Cancel02Icon} strokeWidth={2} className="size-3.5" />
                  </button>
                )}
              </div>
            ))}
            {assignees.length === 0 && isClient && (
              <p className="text-sm text-muted-foreground">None</p>
            )}
            {!isClient && (
              <Popover open={assigneePopoverOpen} onOpenChange={setAssigneePopoverOpen}>
                <PopoverTrigger
                  render={
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" />
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
            )}
          </div>
        </div>

        {/* Dates */}
        <div className={`grid gap-4 ${status === "Done" ? "grid-cols-3" : "grid-cols-2"}`}>
          <div className="grid gap-2">
            <Label>Start Date</Label>
            {isClient ? (
              <p className="text-sm text-muted-foreground py-1">
                {startDate ? format(startDate, "MMM d, yyyy") : "Not set"}
              </p>
            ) : (
              <DatePicker date={startDate} onSelect={(d) => { setStartDate(d); markEdited() }} />
            )}
          </div>
          <div className="grid gap-2">
            <Label>Due Date</Label>
            {isClient || isDueDateLocked ? (
              <p className="text-sm text-muted-foreground py-1" title={isDueDateLocked ? "Due date is locked on or after the due date" : undefined}>
                {dueDate ? format(dueDate, "MMM d, yyyy") : "Not set"}
              </p>
            ) : (
              <DatePicker date={dueDate} onSelect={(d) => { setDueDate(d); markEdited() }} />
            )}
          </div>
          {status === "Done" && (
            <div className="grid gap-2">
              <Label>Completed On</Label>
              {isClient ? (
                <p className="text-sm text-muted-foreground py-1">
                  {completedOn ? format(completedOn, "MMM d, yyyy") : "Not set"}
                </p>
              ) : (
                <DatePicker date={completedOn} onSelect={(d) => { setCompletedOn(d); markEdited() }} />
              )}
            </div>
          )}
        </div>

        {/* Recurrence */}
        <div className={`grid gap-4 ${recurrenceFrequency ? "grid-cols-2" : "grid-cols-1"}`}>
          <div className="grid gap-2">
            <Label>Recurrence</Label>
            {isClient ? (
              <p className="text-sm text-muted-foreground py-1">{recurrenceFrequency || "None"}</p>
            ) : (
              <Select
                value={recurrenceFrequency || "none"}
                onValueChange={(v) => { setRecurrenceFrequency(v === "none" ? "" : v); markEdited() }}
              >
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
            )}
          </div>
          {recurrenceFrequency && (
            <div className="grid gap-2">
              <Label>Repeat Until</Label>
              {isClient ? (
                <p className="text-sm text-muted-foreground py-1">
                  {recurrenceEndDate ? format(recurrenceEndDate, "MMM d, yyyy") : "Forever"}
                </p>
              ) : (
                <DatePicker date={recurrenceEndDate} onSelect={(d) => { setRecurrenceEndDate(d); markEdited() }} />
              )}
            </div>
          )}
        </div>

        {/* PR Link */}
        <div className="grid gap-2">
          <Label htmlFor="task-pr-link">PR Link</Label>
          {isClient ? (
            prLink ? (
              <a href={prLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                {prLink}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground py-1">None</p>
            )
          ) : (
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
                onChange={(e) => { setPrLink(e.target.value); markEdited() }}
                className="pl-8"
              />
            </div>
          )}
        </div>

        {/* GitHub Issue */}
        {!isClient && projectDoc?.github_repo && ghStatus?.message?.app_configured && ghStatus?.message?.connected && (
          <div className="grid gap-2">
            <Label>GitHub Issue</Label>
            {taskDoc?.github_issue_url ? (
              <a
                href={taskDoc?.github_issue_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate"
              >
                {taskDoc?.github_issue_url}
              </a>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvertToIssue}
                disabled={creatingIssue}
                className="w-fit"
              >
                {creatingIssue ? "Creating..." : "Convert to GitHub Issue"}
              </Button>
            )}
          </div>
        )}

        {/* Description */}
        <div className="grid gap-2">
          <Label>Description</Label>
          {isClient ? (
            task.description ? (
              <div className="prose prose-sm max-w-none text-sm break-words" dangerouslySetInnerHTML={{ __html: task.description }} />
            ) : (
              <p className="text-sm text-muted-foreground py-1">No description</p>
            )
          ) : (
            <LazyTiptapEditor
              key={task.name}
              content={task.description || ""}
              onChange={(v) => { setDescription(v); markEdited() }}
              placeholder="Add a description..."
              mentionSuggestions={mentionSuggestions}
            />
          )}
        </div>

        {/* Attachments */}
        <div className="grid gap-2">
          <Label>Attachments</Label>
          <TaskAttachments taskName={task.name} readOnly={isClient} />
        </div>

        {/* UAT Section — only shown for projects with a client */}
        {hasClient && (
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
        )}

        {/* Comments Section */}
        <TaskCommentsSection taskName={task.name} members={allMembers} />
      </div>
    </div>
  )

  const footerButtons = isClient ? null : (
    <div className="flex gap-2 w-full">
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 text-destructive hover:text-destructive"
        onClick={handleArchive}
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4" />
      </Button>
      <div className="flex-1 flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
        {autosaveStatus === "saving" && (
          <><Spinner className="size-3" /> <span>Saving...</span></>
        )}
        {autosaveStatus === "saved" && (
          <><HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 text-green-600" /> <span>Saved</span></>
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle>Task Details</DrawerTitle>
              {onTogglePin && (
                <Button variant="ghost" size="icon-sm" onClick={() => onTogglePin(task.name)} className="text-muted-foreground hover:text-foreground">
                  <HugeiconsIcon icon={isPinned ? PinOffIcon : PinIcon} strokeWidth={2} className="size-4" />
                </Button>
              )}
            </div>
            <DrawerDescription>{task.name}</DrawerDescription>
          </DrawerHeader>
          {formContent}
          {footerButtons && (
            <DrawerFooter>
              {footerButtons}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="data-[side=right]:sm:w-[40vw] data-[side=right]:sm:max-w-[40vw]" showCloseButton={false}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Task Details</SheetTitle>
            <div className="flex items-center gap-1">
              {onTogglePin && (
                <Button variant="ghost" size="icon-sm" onClick={() => onTogglePin(task.name)} className="text-muted-foreground hover:text-foreground" aria-label={isPinned ? "Unpin task" : "Pin task"}>
                  <HugeiconsIcon icon={isPinned ? PinOffIcon : PinIcon} strokeWidth={2} className="size-4" />
                </Button>
              )}
              <SheetClose render={<Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground" />}>
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
          </div>
          <SheetDescription>{task.name}</SheetDescription>
        </SheetHeader>
        {formContent}
        {footerButtons && (
          <SheetFooter>
            {footerButtons}
          </SheetFooter>
        )}
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
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
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
          onSelect={(d) => { onSelect(d); setOpen(false) }}
        />
      </PopoverContent>
    </Popover>
  )
}
