import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useSearchParams, Link } from "react-router"
import {
  useFrappeAuth,
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeCreateDoc,
  useFrappePostCall,
} from "frappe-react-sdk"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft02Icon,
  Add01Icon,
  Task01Icon,
  Target02Icon,
  DashboardSquare01Icon,
  UserGroupIcon,
  UserAdd01Icon,
  CheckmarkCircle02Icon,
  Cancel02Icon,
  Idea01Icon,
  News01Icon,
  Link04Icon,
  Delete02Icon,
  PencilEdit01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { HiveProject, HiveTask, HiveMilestone, HiveTaskAssignee, HiveMember, HiveProjectUpdate, HiveProjectLink } from "@/types"
import { TASK_STATUSES } from "@/types"
import { TaskKanban } from "@/components/TaskKanban"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"
import { TaskDetailSheet } from "@/components/TaskDetailSheet"
import { MilestoneSection } from "@/components/MilestoneSection"
import { FeatureRequestSection } from "@/components/FeatureRequestSection"
import { UpdatesSection } from "@/components/UpdatesSection"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useHotkey } from "@/hooks/use-hotkey"
import { Kbd } from "@/components/ui/kbd"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Open: "secondary",
  Completed: "secondary",
  "On Hold": "outline",
}

const TASK_FIELDS = [
  "name",
  "title",
  "project",
  "status",
  "priority",
  "assigned_to",
  "is_internal",
  "description",
  "due_date",
  "start_date",
  "pr_link",
  "uat_status",
  "uat_approved_by",
  "uat_date",
  "creation",
  "modified",
] as const

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<HiveTask | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // "T" keyboard shortcut to open create task dialog
  const openCreateDialog = useCallback(() => setCreateOpen(true), [])
  useHotkey("t", openCreateDialog)

  // Sync active tab from URL (e.g. ?tab=updates from dashboard click)
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(
    tabParam && ["overview", "tasks", "milestones", "updates", "requests"].includes(tabParam)
      ? tabParam
      : "overview",
  )

  // Auto-open create task dialog from ?create_task=1 (e.g. from CMD K)
  useEffect(() => {
    if (searchParams.get("create_task") === "1") {
      setCreateOpen(true)
      setSearchParams({}, { replace: true })
    }
    // Clear tab param from URL after consuming it
    if (searchParams.get("tab")) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete("tab")
        return next
      }, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const { currentUser } = useFrappeAuth()

  // Fetch draft count for the Updates tab badge
  const { data: myDrafts, mutate: mutateDraftCount } = useFrappeGetDocList<HiveProjectUpdate>(
    "Hive Project Update",
    {
      fields: ["name"],
      filters: [
        ["project", "=", id ?? ""],
        ["is_draft", "=", 1],
        ["posted_by", "=", currentUser ?? ""],
      ],
      limit: 100,
    },
    id && currentUser ? undefined : null,
  )
  const draftCount = myDrafts?.length ?? 0

  const [linksDialogOpen, setLinksDialogOpen] = useState(false)

  const { data: project, isLoading: projectLoading, mutate: mutateProject } = useFrappeGetDoc<HiveProject>(
    "Hive Project",
    id ?? "",
    id ? undefined : null,
  )

  const {
    data: tasks,
    isLoading: tasksLoading,
    mutate: mutateTasks,
  } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: TASK_FIELDS as unknown as (keyof HiveTask)[],
      filters: [["project", "=", id ?? ""]],
      orderBy: { field: "modified", order: "desc" },
      limit: 200,
    },
    id ? undefined : null,
  )

  const { data: milestones } = useFrappeGetDocList<HiveMilestone>(
    "Hive Milestone",
    {
      fields: ["name", "title", "status", "target_date"],
      filters: [["project", "=", id ?? ""]],
      limit: 50,
    },
    id ? undefined : null,
  )

  const { updateDoc } = useFrappeUpdateDoc()
  const { createDoc } = useFrappeCreateDoc()
  const { call: callDashboard, result: dashboardResult } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.get_project_dashboard",
  )
  const { call: callAssignees, result: assigneesResult } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.get_task_assignees",
  )

  // Fetch all active members for the team member picker
  const { data: allMembers } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: ["name", "user", "member_name", "user_image", "type", "is_active"],
      filters: [["is_active", "=", 1]],
      limit: 100,
    },
  )

  const [teamMembers, setTeamMembers] = useState<
    { member: string; member_name: string; role: string }[]
  >([])

  // Fetch dashboard stats and assignees when project loads
  useEffect(() => {
    if (id) {
      callDashboard({ project: id }).catch(() => {})
      callAssignees({ project: id }).catch(() => {})
    }
  }, [id, callDashboard, callAssignees])

  // Sync team members from dashboard data
  useEffect(() => {
    const members = (
      dashboardResult?.message as {
        members?: { member: string; member_name: string; role: string }[]
      }
    )?.members
    if (members) {
      setTeamMembers(members)
    }
  }, [dashboardResult])

  const handleStatusChange = async (taskName: string, newStatus: string) => {
    try {
      await updateDoc("Hive Task", taskName, { status: newStatus })
      mutateTasks()
    } catch {
      toast.error("Failed to update task status")
    }
  }

  const handleCreateTask = async (values: {
    title: string
    priority: string
    status: string
    due_date?: string | null
    start_date?: string | null
    pr_link?: string | null
    is_internal?: 0 | 1
    assignees?: { member: string }[]
    project?: string
  }) => {
    try {
      await createDoc("Hive Task", {
        ...values,
        project: values.project || id,
      })
      mutateTasks()
      callAssignees({ project: id }).catch(() => {})
      setCreateOpen(false)
      toast.success("Task created")
    } catch {
      toast.error("Failed to create task")
    }
  }

  const handleTaskClick = (task: HiveTask) => {
    setSelectedTask(task)
    setSheetOpen(true)
  }

  const handleTaskUpdated = () => {
    mutateTasks()
    callAssignees({ project: id }).catch(() => {})
    // Refresh the selected task from the list
    if (selectedTask && tasks) {
      const updated = tasks.find((t) => t.name === selectedTask.name)
      if (updated) setSelectedTask(updated)
    }
  }

  // -- Team member management --
  const saveProjectMembers = async (
    members: { member: string; member_name: string; role: string }[],
  ) => {
    try {
      await updateDoc("Hive Project", id!, {
        members: members.map((m) => ({ member: m.member, role: m.role })),
      })
      callDashboard({ project: id }).catch(() => {})
    } catch {
      toast.error("Failed to update team")
    }
  }

  const toggleTeamMember = (member: HiveMember) => {
    const exists = teamMembers.some((m) => m.member === member.name)
    const next = exists
      ? teamMembers.filter((m) => m.member !== member.name)
      : [
          ...teamMembers,
          { member: member.name, member_name: member.member_name, role: "Member" },
        ]
    setTeamMembers(next)
    saveProjectMembers(next)
  }

  const changeTeamMemberRole = (memberName: string, role: string) => {
    const next = teamMembers.map((m) =>
      m.member === memberName ? { ...m, role } : m,
    )
    setTeamMembers(next)
    saveProjectMembers(next)
  }

  const removeTeamMember = (memberName: string) => {
    const next = teamMembers.filter((m) => m.member !== memberName)
    setTeamMembers(next)
    saveProjectMembers(next)
  }

  // -- Related links management --
  const saveProjectLinks = async (links: HiveProjectLink[]) => {
    try {
      await updateDoc("Hive Project", id!, {
        links: links.map((l) => ({ title: l.title, url: l.url })),
      })
      mutateProject()
    } catch {
      toast.error("Failed to update links")
    }
  }

  const addLink = (title: string, url: string) => {
    const current = project?.links ?? []
    saveProjectLinks([...current, { title, url }])
  }

  const removeLink = (idx: number) => {
    const current = [...(project?.links ?? [])]
    current.splice(idx, 1)
    saveProjectLinks(current)
  }

  const updateLink = (idx: number, title: string, url: string) => {
    const current = [...(project?.links ?? [])]
    current[idx] = { ...current[idx], title, url }
    saveProjectLinks(current)
  }

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 sm:w-96" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-sm text-muted-foreground">Project not found.</p>
        <Button variant="link" render={<Link to="/projects" />} className="mt-2">
          Back to projects
        </Button>
      </div>
    )
  }

  // Group tasks by status
  const tasksByStatus: Record<string, HiveTask[]> = {}
  for (const status of TASK_STATUSES) {
    tasksByStatus[status] = []
  }
  if (tasks) {
    for (const task of tasks) {
      if (tasksByStatus[task.status]) {
        tasksByStatus[task.status].push(task)
      }
    }
  }

  // Compute stats
  const totalTasks = tasks?.length ?? 0
  const doneTasks = tasksByStatus["Done"]?.length ?? 0
  const inProgressTasks = tasksByStatus["In Progress"]?.length ?? 0
  const blockedTasks = tasks?.filter((t) => t.status === "Blocked").length ?? 0
  const activeMilestones = milestones?.filter((m) => m.status === "In Progress").length ?? 0

  // Assignees data
  const assigneesByTask = (assigneesResult?.message ?? {}) as Record<string, HiveTaskAssignee[]>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon-sm" render={<Link to="/projects" />} className="mt-0.5">
            <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={statusVariant[project.status] ?? "outline"}>
                {project.status}
              </Badge>
              {project.project_type && (
                <Badge variant="outline">{project.project_type}</Badge>
              )}
              {project.client && (
                <Badge variant="outline">{project.client}</Badge>
              )}
            </div>
            {/* Related Links */}
            {(project.links?.length ?? 0) > 0 && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {project.links!.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3" />
                    {link.title}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => setLinksDialogOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3" />
                  Manage
                </button>
              </div>
            )}
            {(project.links?.length ?? 0) === 0 && (
              <button
                type="button"
                onClick={() => setLinksDialogOpen(true)}
                className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <HugeiconsIcon icon={Link04Icon} strokeWidth={2} className="size-3" />
                Add link
              </button>
            )}
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button onClick={() => setCreateOpen(true)} />
            }
          >
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
            Add Task
            <Kbd keys={["T"]} className="pointer-events-none ml-1 hidden sm:inline-flex" />
          </TooltipTrigger>
          <TooltipContent>Create a new task (T)</TooltipContent>
        </Tooltip>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="overview">
            <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <HugeiconsIcon icon={Task01Icon} strokeWidth={2} className="size-4" />
            Tasks
            <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1.5">
              {totalTasks}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="milestones">
            <HugeiconsIcon icon={Target02Icon} strokeWidth={2} className="size-4" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="updates">
            <HugeiconsIcon icon={News01Icon} strokeWidth={2} className="size-4" />
            Updates
            {draftCount > 0 && (
              <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1.5 border-amber-400 text-amber-600">
                {draftCount} {draftCount === 1 ? "draft" : "drafts"}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            <HugeiconsIcon icon={Idea01Icon} strokeWidth={2} className="size-4" />
            Requests
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="space-y-6 pt-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard label="Total Tasks" value={totalTasks} />
              <StatCard label="In Progress" value={inProgressTasks} />
              <StatCard label="Completed" value={doneTasks} />
              <StatCard label="Blocked" value={blockedTasks} variant={blockedTasks > 0 ? "destructive" : undefined} />
            </div>

            {/* Active Milestones & Team */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Active Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HugeiconsIcon icon={Target02Icon} strokeWidth={2} className="size-4" />
                    Active Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeMilestones > 0 ? (
                    <div className="space-y-2">
                      {milestones
                        ?.filter((m) => m.status !== "Completed")
                        .slice(0, 5)
                        .map((ms) => (
                          <div key={ms.name} className="flex items-center justify-between text-sm">
                            <span>{ms.title}</span>
                            <Badge
                              variant={ms.status === "In Progress" ? "secondary" : "outline"}
                              className="text-[10px] h-4 px-1.5"
                            >
                              {ms.status}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No active milestones</p>
                  )}
                </CardContent>
              </Card>

              {/* Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-4" />
                    Team
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" className="ml-auto" />
                        }
                      >
                        <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="end">
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {allMembers?.length ? (
                            allMembers.map((m) => {
                              const isAssigned = teamMembers.some(
                                (tm) => tm.member === m.name,
                              )
                              return (
                                <button
                                  key={m.name}
                                  type="button"
                                  onClick={() => toggleTeamMember(m)}
                                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors ${
                                    isAssigned ? "bg-muted" : ""
                                  }`}
                                >
                                  <Avatar size="sm">
                                    {m.user_image ? (
                                      <AvatarImage
                                        src={m.user_image}
                                        alt={m.member_name}
                                      />
                                    ) : (
                                      <AvatarFallback className="text-[10px]">
                                        {(m.member_name || m.name)
                                          .slice(0, 2)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  <span className="flex-1 truncate text-left">
                                    {m.member_name || m.name}
                                  </span>
                                  {isAssigned && (
                                    <HugeiconsIcon
                                      icon={CheckmarkCircle02Icon}
                                      strokeWidth={2}
                                      className="size-4 text-primary"
                                    />
                                  )}
                                </button>
                              )
                            })
                          ) : (
                            <p className="text-xs text-muted-foreground px-2 py-1">
                              No members found
                            </p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teamMembers.length ? (
                    <div className="space-y-2">
                      {teamMembers.map((m) => {
                        const memberData = allMembers?.find(
                          (am) => am.name === m.member,
                        )
                        return (
                          <div
                            key={m.member}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Avatar size="sm">
                              {memberData?.user_image ? (
                                <AvatarImage
                                  src={memberData.user_image}
                                  alt={m.member_name}
                                />
                              ) : (
                                <AvatarFallback>
                                  {(m.member_name || m.member)
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span className="flex-1 truncate">
                              {m.member_name || m.member}
                            </span>
                            <Select
                              value={m.role}
                              onValueChange={(role) =>
                                changeTeamMemberRole(m.member, role)
                              }
                            >
                              <SelectTrigger className="h-6 w-auto text-[10px] px-2 gap-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Member">Member</SelectItem>
                                <SelectItem value="Champion">Champion</SelectItem>
                                <SelectItem value="Stakeholder">
                                  Stakeholder
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <button
                              type="button"
                              onClick={() => removeTeamMember(m.member)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <HugeiconsIcon
                                icon={Cancel02Icon}
                                strokeWidth={2}
                                className="size-3.5"
                              />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No team members assigned
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Client Info */}
            {project.client && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{project.client}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="pt-2">
            {tasksLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="min-w-[220px] space-y-3 md:min-w-0">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <TaskKanban
                tasksByStatus={tasksByStatus}
                onStatusChange={handleStatusChange}
                onTaskClick={handleTaskClick}
                assigneesByTask={assigneesByTask}
              />
            )}
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones">
          <div className="pt-2">
            {id && <MilestoneSection projectId={id} />}
          </div>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates">
          <div className="pt-2">
            {id && <UpdatesSection projectId={id} onDraftChange={() => mutateDraftCount()} />}
          </div>
        </TabsContent>

        {/* Feature Requests Tab */}
        <TabsContent value="requests">
          <div className="pt-2">
            {id && <FeatureRequestSection projectId={id} />}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTask}
        projectId={id}
      />

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdated={handleTaskUpdated}
      />

      {/* Manage Links Dialog */}
      <ManageLinksDialog
        open={linksDialogOpen}
        onOpenChange={setLinksDialogOpen}
        links={project.links ?? []}
        onAdd={addLink}
        onRemove={removeLink}
        onUpdate={updateLink}
      />
    </div>
  )
}

function ManageLinksDialog({
  open,
  onOpenChange,
  links,
  onAdd,
  onRemove,
  onUpdate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  links: HiveProjectLink[]
  onAdd: (title: string, url: string) => void
  onRemove: (idx: number) => void
  onUpdate: (idx: number, title: string, url: string) => void
}) {
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const titleRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const title = newTitle.trim()
    const url = newUrl.trim()
    if (!title || !url) return
    onAdd(title, url)
    setNewTitle("")
    setNewUrl("")
    titleRef.current?.focus()
  }

  const startEdit = (idx: number) => {
    setEditIdx(idx)
    setEditTitle(links[idx].title)
    setEditUrl(links[idx].url)
  }

  const saveEdit = () => {
    if (editIdx === null) return
    const title = editTitle.trim()
    const url = editUrl.trim()
    if (!title || !url) return
    onUpdate(editIdx, title, url)
    setEditIdx(null)
  }

  const cancelEdit = () => setEditIdx(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Related Links</DialogTitle>
        </DialogHeader>

        {/* Existing links */}
        {links.length > 0 && (
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i}>
                {editIdx === i ? (
                  <div className="space-y-2 rounded-lg border p-3">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <Input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="https://..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                    <HugeiconsIcon icon={Link04Icon} strokeWidth={2} className="size-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{link.title}</span>
                      <span className="text-muted-foreground ml-2 truncate text-xs">{link.url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEdit(i)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add new link */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Add a link</p>
          <div className="flex gap-2">
            <Input
              ref={titleRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={!newTitle.trim() || !newUrl.trim()}>
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string
  value: number
  variant?: "destructive"
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-2xl font-bold mt-1 ${
            variant === "destructive" ? "text-destructive" : ""
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
