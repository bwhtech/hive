import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams, Link, useNavigate } from "react-router"
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
  Idea01Icon,
  News01Icon,
  Link04Icon,
  PencilEdit01Icon,
  ArrowUpRight01Icon,
  FilterIcon,
  Clock01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { HiveProject, HiveTask, HiveMilestone, HiveTaskAssignee, HiveProjectUpdate, HiveProjectLink, HiveClient } from "@/types"
import { TASK_STATUSES } from "@/types"
import { TaskKanban } from "@/components/TaskKanban"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"
import { TaskDetailSheet } from "@/components/TaskDetailSheet"
import { MilestoneSection } from "@/components/MilestoneSection"
import { FeatureRequestSection } from "@/components/FeatureRequestSection"
import { UpdatesSection } from "@/components/UpdatesSection"
import { OverviewTab } from "@/components/project/OverviewTab"
import { ActivityTab } from "@/components/project/ActivityTab"
import { ManageLinksDialog } from "@/components/project/ManageLinksDialog"
import { useUser } from "@/context/UserContext"
import { useCelebration } from "@/hooks/useTaskCelebration"
import { useHotkey } from "@/hooks/use-hotkey"
import { Kbd } from "@/components/ui/kbd"
import { PROJECT_STATUS_VARIANT } from "@/lib/variants"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

const TASK_FIELDS = [
  "name",
  "title",
  "project",
  "status",
  "priority",
  "size",
  "milestone",
  "depends_on",
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
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { isClient } = useUser()
  const { celebrate } = useCelebration()
  const [searchParams, setSearchParams] = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)
  const [createFeatureRequestOpen, setCreateFeatureRequestOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<HiveTask | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [milestoneFilter, setMilestoneFilter] = useState<string>("all")

  // "T" keyboard shortcut to open create task dialog (not for client users)
  const openCreateDialog = useCallback(() => {
    if (!isClient) setCreateOpen(true)
  }, [isClient])
  useHotkey("t", openCreateDialog)

  // Tab-switching shortcuts (disabled when dialogs/sheets are open)
  const dialogOpen = sheetOpen || createOpen || createFeatureRequestOpen
  const goOverview = useCallback(() => setActiveTab("overview"), [])
  const goMilestones = useCallback(() => setActiveTab("milestones"), [])
  const goUpdates = useCallback(() => setActiveTab("updates"), [])
  const goRequests = useCallback(() => setActiveTab("requests"), [])
  const goActivity = useCallback(() => setActiveTab("activity"), [])
  useHotkey("o", goOverview, { enabled: !dialogOpen })
  useHotkey("m", goMilestones, { enabled: !dialogOpen })
  useHotkey("u", goUpdates, { enabled: !dialogOpen })
  useHotkey("r", goRequests, { enabled: !dialogOpen })
  useHotkey("a", goActivity, { enabled: !dialogOpen })

  // Sync active tab from URL (e.g. ?tab=updates from dashboard click)
  const tabParam = searchParams.get("tab")
  const taskParam = searchParams.get("task")
  const [activeTab, setActiveTab] = useState(() => {
    if (taskParam) return "tasks"
    if (tabParam && ["overview", "tasks", "milestones", "updates", "requests", "activity"].includes(tabParam))
      return tabParam
    return "overview"
  })

  // Track task name from URL that needs to be opened once tasks load
  const [pendingTaskName, setPendingTaskName] = useState<string | null>(taskParam)

  // Auto-open create dialogs from query params (e.g. from CMD K)
  useEffect(() => {
    if (searchParams.get("create_task") === "1") {
      setCreateOpen(true)
      setSearchParams({}, { replace: true })
    }
    if (searchParams.get("create_feature_request") === "1") {
      setActiveTab("requests")
      setCreateFeatureRequestOpen(true)
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete("create_feature_request")
        next.delete("tab")
        return next
      }, { replace: true })
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
        ["is_archived", "=", 0],
        ["posted_by", "=", currentUser ?? ""],
      ],
      limit: 100,
    },
    id && currentUser ? undefined : null,
  )
  const draftCount = myDrafts?.length ?? 0

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [linksDialogOpen, setLinksDialogOpen] = useState(false)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [newClientName, setNewClientName] = useState("")
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState("")

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
      filters: [["project", "=", id ?? ""], ["is_archived", "=", 0]],
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

  const { data: projectTypes } = useFrappeGetDocList("Hive Project Type", {
    fields: ["name", "type_name"],
    filters: [["is_archived", "=", 0]],
    limit: 50,
    orderBy: { field: "type_name", order: "asc" },
  })

  const { data: clients, mutate: mutateClients } = useFrappeGetDocList<HiveClient>(
    "Hive Client",
    {
      fields: ["name", "company_name", "is_active"],
      filters: [["is_active", "=", 1]],
      limit: 100,
      orderBy: { field: "company_name", order: "asc" },
    },
  )

  const { updateDoc } = useFrappeUpdateDoc()
  const { createDoc } = useFrappeCreateDoc()
  const { call: callAssignees, result: assigneesResult } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.get_task_assignees",
  )

  // Fetch task assignees when project loads
  useEffect(() => {
    if (id) {
      callAssignees({ project: id }).catch(() => {})
    }
  }, [id, callAssignees])

  // Open task from URL param once tasks are loaded
  useEffect(() => {
    if (pendingTaskName && tasks) {
      const task = tasks.find((t) => t.name === pendingTaskName)
      if (task) {
        setSelectedTask(task)
        setSheetOpen(true)
      }
      setPendingTaskName(null)
    }
  }, [pendingTaskName, tasks])

  const handleStatusChange = async (taskName: string, newStatus: string) => {
    const optimistic = (current: HiveTask[] | undefined) =>
      current?.map((t) =>
        t.name === taskName ? { ...t, status: newStatus as HiveTask["status"] } : t
      )
    try {
      await mutateTasks(
        async (current) => {
          await updateDoc("Hive Task", taskName, { status: newStatus })
          return optimistic(current)
        },
        { optimisticData: optimistic, rollbackOnError: true, revalidate: true },
      )
      if (newStatus === "Done") celebrate()
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
    // Blur the draggable card so the sheet's focus manager doesn't
    // conflict with aria-hidden applied to the kanban board
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setSelectedTask(task)
    setSheetOpen(true)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("task", task.name)
      return next
    }, { replace: true })
  }

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete("task")
        return next
      }, { replace: true })
    }
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

  const handleTypeChange = async (value: string) => {
    try {
      await updateDoc("Hive Project", id!, { project_type: value || null })
      mutateProject()
    } catch {
      toast.error("Failed to update project type")
    }
  }

  const handleClientChange = async (value: string) => {
    try {
      await updateDoc("Hive Project", id!, { client: value || null })
      mutateProject()
    } catch {
      toast.error("Failed to update client")
    }
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName.trim()) return
    try {
      const doc = await createDoc("Hive Client", {
        company_name: newClientName.trim(),
      })
      toast.success("Client created")
      await mutateClients()
      await updateDoc("Hive Project", id!, { client: doc.name })
      mutateProject()
      setNewClientName("")
      setNewClientOpen(false)
    } catch {
      toast.error("Failed to create client")
    }
  }

  const handleTitleSave = async () => {
    const trimmed = titleDraft.trim()
    if (!trimmed || trimmed === project?.title) {
      setEditingTitle(false)
      return
    }
    try {
      await updateDoc("Hive Project", id!, { title: trimmed })
      mutateProject()
      toast.success("Project renamed")
    } catch {
      toast.error("Failed to rename project")
    }
    setEditingTitle(false)
  }

  const handleArchiveProject = async () => {
    try {
      await updateDoc("Hive Project", id!, { is_archived: 1 })
      setDeleteDialogOpen(false)
      setDeleteConfirmText("")
      navigate("/projects")
      toast("Project deleted", {
        duration: 6000,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await updateDoc("Hive Project", id!, { is_archived: 0 })
              navigate(`/projects/${id}`)
            } catch {
              toast.error("Failed to restore project")
            }
          },
        },
      })
    } catch {
      toast.error("Failed to delete project")
    }
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

  // Filter tasks by milestone (for kanban view)
  const filteredTasks = tasks?.filter((task) => {
    if (milestoneFilter === "all") return true
    if (milestoneFilter === "none") return !task.milestone
    return task.milestone === milestoneFilter
  })

  // Group filtered tasks by status
  const tasksByStatus: Record<string, HiveTask[]> = {}
  for (const status of TASK_STATUSES) {
    tasksByStatus[status] = []
  }
  if (filteredTasks) {
    for (const task of filteredTasks) {
      if (tasksByStatus[task.status]) {
        tasksByStatus[task.status].push(task)
      }
    }
  }

  // Compute stats (always from all tasks, not filtered)
  const totalTasks = tasks?.length ?? 0
  const doneTasks = tasks?.filter((t) => t.status === "Done").length ?? 0
  const inProgressTasks = tasks?.filter((t) => t.status === "In Progress").length ?? 0
  const blockedTasks = tasks?.filter((t) => t.status === "Blocked").length ?? 0

  // Assignees data
  const assigneesByTask = (assigneesResult?.message ?? {}) as Record<string, HiveTaskAssignee[]>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Button variant="ghost" size="icon-sm" render={<Link to="/projects" />} className="mt-0.5">
            <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />
          </Button>
          <div>
            {editingTitle && !isClient ? (
              <input
                className="text-2xl font-bold tracking-tight bg-transparent border-b border-foreground/20 focus:border-foreground/50 outline-none w-full"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave()
                  if (e.key === "Escape") setEditingTitle(false)
                }}
                autoFocus
              />
            ) : (
              <h1
                className={`text-2xl font-bold tracking-tight truncate ${!isClient ? "cursor-pointer hover:text-foreground/80" : ""}`}
                onClick={() => {
                  if (!isClient) {
                    setTitleDraft(project.title)
                    setEditingTitle(true)
                  }
                }}
              >
                {project.title}
              </h1>
            )}
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={PROJECT_STATUS_VARIANT[project.status] ?? "outline"}>
                {project.status}
              </Badge>
              {isClient ? (
                <>
                  {project.project_type && (
                    <Badge variant="outline" className="text-[11px] h-5 px-2.5 rounded-full font-medium">
                      {(projectTypes?.find((t) => t.name === project.project_type) as { type_name: string } | undefined)?.type_name ?? project.project_type}
                    </Badge>
                  )}
                  {project.client && (
                    <Badge variant="outline" className="text-[11px] h-5 px-2.5 rounded-full font-medium">
                      {clients?.find((c) => c.name === project.client)?.company_name ?? project.client}
                    </Badge>
                  )}
                </>
              ) : (
                <>
                  <Select value={project.project_type || ""} onValueChange={handleTypeChange}>
                    <SelectTrigger
                      className={`h-5 w-auto text-[11px] px-2.5 gap-1 rounded-full font-medium ${
                        !project.project_type ? "border-dashed text-muted-foreground" : ""
                      }`}
                    >
                      {project.project_type
                        ? (projectTypes?.find((t) => t.name === project.project_type) as { type_name: string } | undefined)?.type_name ?? project.project_type
                        : "Set type"}
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes?.map((t) => (
                        <SelectItem key={t.name} value={t.name}>
                          {(t as { type_name: string }).type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Select value={project.client || ""} onValueChange={handleClientChange}>
                      <SelectTrigger
                        className={`h-5 w-auto text-[11px] px-2.5 gap-1 rounded-full font-medium ${
                          !project.client ? "border-dashed text-muted-foreground" : ""
                        }`}
                      >
                        {project.client
                          ? clients?.find((c) => c.name === project.client)?.company_name ?? project.client
                          : "Set client"}
                      </SelectTrigger>
                      <SelectContent>
                        {clients?.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      onClick={() => setNewClientOpen(true)}
                      className="inline-flex items-center justify-center size-5 rounded-full border border-dashed text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3" />
                    </button>
                  </div>
                </>
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
                {!isClient && (
                  <button
                    type="button"
                    onClick={() => setLinksDialogOpen(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3" />
                    Manage
                  </button>
                )}
              </div>
            )}
            {!isClient && (project.links?.length ?? 0) === 0 && (
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
        {!isClient && (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteDialogOpen(true)} />
              }
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Delete project</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button onClick={() => setCreateOpen(true)} />
              }
            >
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
              <span className="hidden sm:inline">Add Task</span>
              <Kbd keys={["T"]} className="pointer-events-none ml-1 hidden sm:inline-flex" />
            </TooltipTrigger>
            <TooltipContent>Create a new task (T)</TooltipContent>
          </Tooltip>
        </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {isMobile ? (
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <span className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={
                    { overview: DashboardSquare01Icon, tasks: Task01Icon, milestones: Target02Icon, updates: News01Icon, requests: Idea01Icon, activity: Clock01Icon }[activeTab] ?? DashboardSquare01Icon
                  }
                  strokeWidth={2}
                  className="size-4"
                />
                {{ overview: "Overview", tasks: "Tasks", milestones: "Milestones", updates: "Updates", requests: "Requests", activity: "Activity" }[activeTab]}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">
                <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} className="size-4" />
                Overview
              </SelectItem>
              <SelectItem value="tasks">
                <HugeiconsIcon icon={Task01Icon} strokeWidth={2} className="size-4" />
                Tasks
              </SelectItem>
              <SelectItem value="milestones">
                <HugeiconsIcon icon={Target02Icon} strokeWidth={2} className="size-4" />
                Milestones
              </SelectItem>
              <SelectItem value="updates">
                <HugeiconsIcon icon={News01Icon} strokeWidth={2} className="size-4" />
                Updates
              </SelectItem>
              <SelectItem value="requests">
                <HugeiconsIcon icon={Idea01Icon} strokeWidth={2} className="size-4" />
                Requests
              </SelectItem>
              <SelectItem value="activity">
                <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-4" />
                Activity
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <TabsList variant="line" className="w-full">
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
            <TabsTrigger value="activity">
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-4" />
              Activity
            </TabsTrigger>
          </TabsList>
        )}

        {/* Overview Tab */}
        <TabsContent value="overview">
          <OverviewTab
            projectId={id!}
            project={project}
            stats={{ totalTasks, inProgressTasks, doneTasks, blockedTasks }}
            milestones={milestones}
            tasks={tasks}
          />
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="pt-2 space-y-3">
            {/* Milestone filter */}
            {milestones && milestones.length > 0 && (
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                <Select value={milestoneFilter} onValueChange={setMilestoneFilter}>
                  <SelectTrigger className="h-7 w-auto text-xs px-2.5 gap-1.5">
                    <span>
                      {milestoneFilter === "all"
                        ? "All tasks"
                        : milestoneFilter === "none"
                          ? "No milestone"
                          : milestones.find((m) => m.name === milestoneFilter)?.title ?? milestoneFilter}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tasks</SelectItem>
                    <SelectItem value="none">No milestone</SelectItem>
                    {milestones.map((m) => (
                      <SelectItem key={m.name} value={m.name}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {milestoneFilter !== "all" && (
                  <span className="text-xs text-muted-foreground">
                    {filteredTasks?.length ?? 0} of {tasks?.length ?? 0} tasks
                  </span>
                )}
              </div>
            )}
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
                hasClient={!!project?.client}
              />
            )}
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones">
          <div className="pt-2">
            {id && <MilestoneSection projectId={id} tasks={tasks} />}
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
            {id && (
              <FeatureRequestSection
                projectId={id}
                createOpen={createFeatureRequestOpen}
                onCreateOpenChange={setCreateFeatureRequestOpen}
              />
            )}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <div className="pt-2">
            {id && <ActivityTab projectId={id} />}
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
        onOpenChange={handleSheetOpenChange}
        onUpdated={handleTaskUpdated}
        hasClient={!!project?.client}
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

      {/* New Client Sheet */}
      <Sheet open={newClientOpen} onOpenChange={setNewClientOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Client</SheetTitle>
            <SheetDescription>Add a new client to your workspace.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleCreateClient} className="grid gap-4 p-6">
            <div className="grid gap-2">
              <Label htmlFor="detail-client-name">Company Name</Label>
              <Input
                id="detail-client-name"
                placeholder="Acme Inc."
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                autoFocus
              />
            </div>
            <SheetFooter>
              <Button type="submit" disabled={!newClientName.trim()}>
                Create Client
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open)
        if (!open) setDeleteConfirmText("")
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the project and all its data. Type <span className="font-semibold text-foreground">{project?.title}</span> to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Type the project title"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== project?.title}
              onClick={handleArchiveProject}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
