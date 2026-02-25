import { useState, useEffect, useRef, useMemo } from "react"
import { useFrappeUpdateDoc, useFrappePostCall, useFrappeGetDocList, useFrappeGetDoc } from "frappe-react-sdk"
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
} from "@hugeicons/core-free-icons"
import {
  Sheet,
  SheetContent,
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
import { TiptapEditor } from "@/components/TiptapEditor"
import { useUser } from "@/context/UserContext"
import { TaskCommentsSection } from "@/components/TaskCommentsSection"
import { TASK_STATUSES, TASK_PRIORITIES, TASK_SIZES, type HiveTask, type HiveMember, type HiveMilestone } from "@/types"

interface TaskDetailSheetProps {
  task: HiveTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
  hasClient?: boolean
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

export function TaskDetailSheet({ task, open, onOpenChange, onUpdated, hasClient = true }: TaskDetailSheetProps) {
  const isMobile = useIsMobile()
  const { isClient, user } = useUser()
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
  const [assignees, setAssignees] = useState<TaskAssigneeRow[]>([])
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
  const { call: approveUat, loading: approvingUat } = useFrappePostCall("frappe.client.run_doc_method")
  const { call: rejectUat, loading: rejectingUat } = useFrappePostCall("frappe.client.run_doc_method")

  // Fetch full task doc (with child tables) when task changes
  const { data: taskDoc } = useFrappeGetDoc<HiveTask & { assignees?: TaskAssigneeRow[] }>(
    "Hive Task",
    task?.name ?? "",
    task?.name ? undefined : null,
  )

  // Fetch milestones for the task's project
  const { data: projectMilestones } = useFrappeGetDocList<HiveMilestone>(
    "Hive Milestone",
    {
      fields: ["name", "title", "status", "target_date"] as (keyof HiveMilestone)[],
      filters: [["project", "=", task?.project ?? ""]],
      orderBy: { field: "target_date", order: "asc" },
      limit: 50,
    },
    task?.project ? undefined : null,
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

  // Fetch tasks in the same project (for depends_on picker)
  const { data: projectTasks } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: ["name", "title", "status"] as (keyof HiveTask)[],
      filters: [["project", "=", task?.project ?? ""], ["is_archived", "=", 0]],
      orderBy: { field: "title", order: "asc" },
      limit: 200,
    },
    task?.project ? undefined : null,
  )

  // Filter out the current task from depends_on options
  const dependsOnOptions = useMemo(() => {
    if (!projectTasks || !task) return []
    return projectTasks.filter((t) => t.name !== task.name)
  }, [projectTasks, task])

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
    }
  }, [task?.name])

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

  // Ref to hold latest save function for keyboard shortcut
  const saveRef = useRef<() => void>(() => {})

  // Cmd+Enter (Mac) / Ctrl+Enter (Windows/Linux) to save
  // 'A' key to open assignee popover (when not typing in an input)
  useEffect(() => {
    if (!open || isClient) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        saveRef.current()
      }
      if (e.key === "a" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return
        e.preventDefault()
        setAssigneePopoverOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, isClient])

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
  }, [title, description, status, priority, size, milestone, dependsOn, prLink, dueDate, startDate, completedOn, assignees, open, isClient])

  if (!task) return null

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    if (newStatus === "Done" && !completedOn) {
      setCompletedOn(new Date())
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
        assignees: assignees.map((a) => ({ member: a.member })),
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

  const toggleAssignee = (member: HiveMember) => {
    setAssignees((prev) => {
      const exists = prev.some((a) => a.member === member.name)
      if (exists) {
        return prev.filter((a) => a.member !== member.name)
      }
      return [...prev, { member: member.name, member_name: member.member_name, user_image: member.user_image }]
    })
    markEdited()
  }

  const removeAssignee = (memberName: string) => {
    setAssignees((prev) => prev.filter((a) => a.member !== memberName))
    markEdited()
  }

  const assignedMemberNames = new Set(assignees.map((a) => a.member))

  const formContent = (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="grid gap-5 px-6 py-4">
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
              {milestone ? (projectMilestones?.find((ms) => ms.name === milestone)?.title ?? milestone) : "None"}
            </p>
          ) : (
            <Select value={milestone} onValueChange={(v) => { setMilestone(v); markEdited() }}>
              <SelectTrigger className="w-full">
                <span>{milestone ? (projectMilestones?.find((ms) => ms.name === milestone)?.title ?? milestone) : "None"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {projectMilestones?.map((ms) => (
                  <SelectItem key={ms.name} value={ms.name}>{ms.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Depends On */}
        <div className="grid gap-2">
          <Label>Depends On</Label>
          {isClient ? (
            <p className="text-sm text-muted-foreground py-1">
              {dependsOn ? (dependsOnOptions.find((t) => t.name === dependsOn)?.title ?? dependsOn) : "None"}
            </p>
          ) : (
            <Select value={dependsOn} onValueChange={(v) => { setDependsOn(v); markEdited() }}>
              <SelectTrigger className="w-full">
                <span>{dependsOn ? (dependsOnOptions.find((t) => t.name === dependsOn)?.title ?? dependsOn) : "None"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {dependsOnOptions.map((t) => (
                  <SelectItem key={t.name} value={t.name}>
                    <span className="truncate">{t.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{t.status}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {isClient ? (
              <p className="text-sm text-muted-foreground py-1">
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

        {/* Description */}
        <div className="grid gap-2">
          <Label>Description</Label>
          {isClient ? (
            task.description ? (
              <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: task.description }} />
            ) : (
              <p className="text-sm text-muted-foreground py-1">No description</p>
            )
          ) : (
            <TiptapEditor
              key={task.name}
              content={task.description || ""}
              onChange={(v) => { setDescription(v); markEdited() }}
              placeholder="Add a description..."
            />
          )}
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
            <DrawerTitle>Task Details</DrawerTitle>
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
      <SheetContent side="right" className="data-[side=right]:sm:w-[40vw] data-[side=right]:sm:max-w-[40vw]">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
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
