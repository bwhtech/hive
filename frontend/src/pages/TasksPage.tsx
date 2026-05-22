import { useState, useMemo, useEffect, useCallback } from "react"
import { useFrappeGetDocList, useFrappeGetDoc, useFrappePostCall, useFrappeCreateDoc, useFrappeUpdateDoc, useSWRConfig } from "frappe-react-sdk"
import { useNavigate, useSearchParams, Link } from "react-router"
import { toast } from "sonner"
import { LazyEmojiPicker } from "@/components/LazyEmojiPicker"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TaskDaily01Icon,
  Search01Icon,
  FilterIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  SortingIcon,
  Add01Icon,
  LeftToRightListBulletIcon,
  DashboardSquare01Icon,
  FloppyDiskIcon,
  MoreHorizontalIcon,
  RepeatIcon,
} from "@hugeicons/core-free-icons"
import { format } from "date-fns"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LinkField } from "@/components/LinkField"
import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { MemberAvatar } from "@/components/MemberAvatar"
import { TASK_STATUSES, TASK_PRIORITIES, type HiveTask, type HiveProject, type HiveMilestone, type HiveTaskAssignee, type HiveView } from "@/types"
import { TASK_PRIORITY_VARIANT, TASK_SIZE_VARIANT, TASK_STATUS_COLOR, PRIORITY_ORDER } from "@/lib/variants"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useTheme } from "@/components/theme-provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"
import { TaskKanban } from "@/components/TaskKanban"
import { TaskDetailSheet } from "@/components/TaskDetailSheet"
import { usePinnedTasks } from "@/context/PinnedTasksContext"
import { useCelebration } from "@/hooks/useTaskCelebration"

interface TaskRow {
  task: HiveTask
  projectTitle: string
  milestoneTitle: string
  assignees: HiveTaskAssignee[]
}

const EMPTY_ASSIGNEES: Record<string, HiveTaskAssignee[]> = {}

function SortHeader({ label, column }: { label: string; column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc?: boolean) => void } }) {
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" ? (
        <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="ml-1 size-3.5" />
      ) : sorted === "desc" ? (
        <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="ml-1 size-3.5" />
      ) : (
        <HugeiconsIcon icon={SortingIcon} strokeWidth={2} className="ml-1 size-3.5 opacity-50" />
      )}
    </Button>
  )
}

const columns: ColumnDef<TaskRow>[] = [
  {
    id: "title",
    accessorFn: (row) => row.task.title,
    header: ({ column }) => <SortHeader label="Task" column={column} />,
    cell: ({ row }) => {
      const { task } = row.original
      return (
        <div className="flex items-center gap-2 min-w-0">
          <span className={`size-2 shrink-0 rounded-full ${TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40"}`} />
          <span className="truncate font-medium">{task.title}</span>
          {task.recurrence_frequency && (
            <HugeiconsIcon
              icon={RepeatIcon}
              strokeWidth={2}
              className="size-3 shrink-0 text-muted-foreground"
              title={`Recurs ${task.recurrence_frequency}`}
            />
          )}
        </div>
      )
    },
  },
  {
    id: "project",
    accessorFn: (row) => row.projectTitle,
    header: ({ column }) => <SortHeader label="Project" column={column} />,
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate">{row.original.projectTitle}</span>
    ),
  },
  {
    id: "status",
    accessorFn: (row) => row.task.status,
    header: ({ column }) => <SortHeader label="Status" column={column} />,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-[10px] h-5 px-1.5">
        {row.original.task.status}
      </Badge>
    ),
  },
  {
    id: "priority",
    accessorFn: (row) => PRIORITY_ORDER[row.task.priority] ?? 99,
    header: ({ column }) => <SortHeader label="Priority" column={column} />,
    cell: ({ row }) => (
      <Badge variant={TASK_PRIORITY_VARIANT[row.original.task.priority] ?? "outline"} className="text-[10px] h-5 px-1.5">
        {row.original.task.priority}
      </Badge>
    ),
  },
  {
    id: "size",
    accessorFn: (row) => row.task.size ?? "",
    header: ({ column }) => <SortHeader label="Size" column={column} />,
    cell: ({ row }) => {
      const size = row.original.task.size
      if (!size) return <span className="text-muted-foreground">-</span>
      return (
        <Badge variant={TASK_SIZE_VARIANT[size] ?? "outline"} className="text-[10px] h-5 px-1.5">
          {size}
        </Badge>
      )
    },
  },
  {
    id: "milestone",
    accessorFn: (row) => row.milestoneTitle,
    header: ({ column }) => <SortHeader label="Milestone" column={column} />,
    cell: ({ row }) => {
      const title = row.original.milestoneTitle
      if (!title) return <span className="text-muted-foreground">-</span>
      return <span className="truncate text-muted-foreground">{title}</span>
    },
  },
  {
    id: "start_date",
    accessorFn: (row) => row.task.start_date || "9999-12-31",
    header: ({ column }) => <SortHeader label="Start Date" column={column} />,
    cell: ({ row }) => {
      const { task } = row.original
      if (!task.start_date) return <span className="text-muted-foreground">-</span>
      return (
        <span className="text-muted-foreground">
          {format(new Date(task.start_date), "MMM d, yyyy")}
        </span>
      )
    },
  },
  {
    id: "due_date",
    accessorFn: (row) => row.task.due_date || "9999-12-31",
    header: ({ column }) => <SortHeader label="Due Date" column={column} />,
    cell: ({ row }) => {
      const { task } = row.original
      if (!task.due_date) return <span className="text-muted-foreground">-</span>
      const isOverdue = new Date(task.due_date) < new Date() && task.status !== "Done" && task.status !== "Someday"
      return (
        <span className={isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}>
          {format(new Date(task.due_date), "MMM d, yyyy")}
        </span>
      )
    },
  },
  {
    id: "assignees",
    header: "Assignees",
    cell: ({ row }) => {
      const { assignees, task } = row.original
      if (assignees.length > 0) {
        return (
          <AvatarGroup>
            {assignees.slice(0, 3).map((a) => (
              <MemberAvatar key={a.member} size="sm" name={a.member_name || a.member} image={a.user_image} />
            ))}
            {assignees.length > 3 && (
              <AvatarGroupCount className="text-[10px]">
                +{assignees.length - 3}
              </AvatarGroupCount>
            )}
          </AvatarGroup>
        )
      }
      if (task.assigned_to) {
        return (
          <MemberAvatar size="sm" name={task.assigned_to.split("@")[0]} />
        )
      }
      return <span className="text-muted-foreground">-</span>
    },
  },
]

export function TasksPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const viewId = searchParams.get("view_id") ?? ""
  const search = searchParams.get("q") ?? ""
  const statusFilter = searchParams.get("status") ?? "all"
  const priorityFilter = searchParams.get("priority") ?? "all"
  const projectFilter = searchParams.get("project") ?? "all"
  const assigneeFilter = searchParams.get("assignee") ?? "all"
  const viewMode = (searchParams.get("view") ?? "list") as "list" | "kanban"

  const { data: activeView } = useFrappeGetDoc<HiveView>(
    "Hive View",
    viewId || null,
  )

  const setFilter = useCallback((key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === "all" || value === "") {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setSearch = useCallback((value: string) => setFilter("q", value), [setFilter])
  const setStatusFilter = useCallback((value: string) => setFilter("status", value), [setFilter])
  const setPriorityFilter = useCallback((value: string) => setFilter("priority", value), [setFilter])
  const setProjectFilter = useCallback((value: string) => setFilter("project", value), [setFilter])
  const setAssigneeFilter = useCallback((value: string) => setFilter("assignee", value), [setFilter])
  const setViewMode = useCallback((value: string) => setFilter("view", value === "list" ? "" : value), [setFilter])

  const [sorting, setSorting] = useState<SortingState>([{ id: "due_date", desc: false }])
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<HiveTask | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [saveViewOpen, setSaveViewOpen] = useState(false)
  const [saveViewLabel, setSaveViewLabel] = useState("")
  const [saveViewEmoji, setSaveViewEmoji] = useState("")
  const [saveViewPublic, setSaveViewPublic] = useState(false)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const { createDoc } = useFrappeCreateDoc()
  const { updateDoc } = useFrappeUpdateDoc()
  const { mutate: globalMutate } = useSWRConfig()
  const { resolvedTheme } = useTheme()
  const { celebrate } = useCelebration()
  const { pinnedTaskNames, togglePin, isPinned } = usePinnedTasks()

  const { data: tasks, isLoading: tasksLoading, mutate: tasksMutate } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: [
        "name", "title", "project", "status", "priority", "size", "milestone",
        "depends_on", "assigned_to", "is_internal", "description", "start_date", "due_date", "pr_link",
        "completed_on", "uat_status", "recurrence_frequency", "recurrence_end_date", "creation", "modified",
      ],
      filters: [["is_archived", "=", 0]],
      orderBy: { field: "due_date", order: "asc" },
      limit: 500,
    },
  )

  const { data: projects } = useFrappeGetDocList<HiveProject>(
    "Hive Project",
    {
      fields: ["name", "title"],
      limit: 100,
    },
  )

  const { data: milestones } = useFrappeGetDocList<HiveMilestone>(
    "Hive Milestone",
    {
      fields: ["name", "title"],
      limit: 500,
    },
  )

  const { call: callAssignees, result: assigneesResult } = useFrappePostCall<{
    message: Record<string, HiveTaskAssignee[]>
  }>("bwh_hive.bwh_hive.api.get_task_assignees")

  useEffect(() => {
    callAssignees({})
  }, [callAssignees])

  const assigneesByTask = (assigneesResult?.message ?? EMPTY_ASSIGNEES) as Record<string, HiveTaskAssignee[]>

  const { call: callAssign } = useFrappePostCall("frappe.desk.form.assign_to.add")

  const handleCreateTask = useCallback(async (values: {
    title: string; priority: string; status: string;
    due_date?: string | null; start_date?: string | null;
    is_internal?: 0 | 1; _assign_users?: string[];
    project?: string; milestone?: string | null;
    recurrence_frequency?: string | null;
    recurrence_end_date?: string | null;
  }) => {
    const { _assign_users, ...taskValues } = values
    let doc
    try {
      doc = await createDoc("Hive Task", taskValues)
    } catch {
      toast.error("Failed to create task")
      return
    }
    setCreateOpen(false)
    toast.success("Task created")
    if (_assign_users?.length) {
      try {
        await callAssign({ doctype: "Hive Task", name: doc.name, assign_to: _assign_users })
      } catch {
        toast.error("Task created, but failed to assign users")
      }
    }
    tasksMutate()
    callAssignees({})
  }, [createDoc, callAssign, callAssignees, tasksMutate])

  const buildCurrentFilters = useCallback(() => {
    const filters: Record<string, string> = {}
    if (statusFilter !== "all") filters.status = statusFilter
    if (priorityFilter !== "all") filters.priority = priorityFilter
    if (projectFilter !== "all") filters.project = projectFilter
    if (assigneeFilter !== "all") filters.assignee = assigneeFilter
    if (search) filters.q = search
    return filters
  }, [statusFilter, priorityFilter, projectFilter, assigneeFilter, search])

  const handleSaveView = useCallback(async () => {
    if (!saveViewLabel.trim()) return
    const filters = buildCurrentFilters()
    try {
      const doc = await createDoc("Hive View", {
        label: saveViewLabel.trim(),
        emoji: saveViewEmoji || "",
        view_type: viewMode,
        filters_json: JSON.stringify(filters),
        is_public: saveViewPublic ? 1 : 0,
      })
      toast.success("View saved")
      setSaveViewOpen(false)
      setSaveViewLabel("")
      setSaveViewEmoji("")
      setSaveViewPublic(false)
      // Revalidate sidebar views
      globalMutate((key: unknown) => typeof key === "string" && key.includes("Hive View"), undefined, { revalidate: true })
      // Navigate to the newly created view
      const params = new URLSearchParams()
      params.set("view_id", doc.name)
      for (const [k, v] of Object.entries(filters)) {
        if (v) params.set(k, v)
      }
      if (viewMode === "kanban") params.set("view", "kanban")
      navigate(`/tasks?${params.toString()}`, { replace: true })
    } catch {
      toast.error("Failed to save view")
    }
  }, [saveViewLabel, saveViewEmoji, saveViewPublic, viewMode, buildCurrentFilters, createDoc, globalMutate, navigate])

  const handleSaveViewChanges = useCallback(async () => {
    if (!activeView) return
    const filters = buildCurrentFilters()
    try {
      await updateDoc("Hive View", activeView.name, {
        filters_json: JSON.stringify(filters),
        view_type: viewMode,
      })
      toast.success("View updated")
      globalMutate((key: unknown) => typeof key === "string" && key.includes("Hive View"), undefined, { revalidate: true })
    } catch {
      toast.error("Failed to update view")
    }
  }, [activeView, viewMode, buildCurrentFilters, updateDoc, globalMutate])

  const projectMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (projects) {
      for (const p of projects) {
        map[p.name] = p.title
      }
    }
    return map
  }, [projects])

  const milestoneMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (milestones) {
      for (const m of milestones) {
        map[m.name] = m.title
      }
    }
    return map
  }, [milestones])

  // Shared filter function used by both list and kanban views
  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    return tasks.filter((task) => {
      if (search) {
        const q = search.toLowerCase()
        const matchName = task.name.toLowerCase().includes(q)
        const matchTitle = task.title.toLowerCase().includes(q)
        const matchProject = (projectMap[task.project] ?? task.project).toLowerCase().includes(q)
        const matchAssignee = (task.assigned_to ?? "").toLowerCase().includes(q)
        if (!matchName && !matchTitle && !matchProject && !matchAssignee) return false
      }
      if (statusFilter !== "all" && task.status !== statusFilter) return false
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
      if (projectFilter !== "all" && task.project !== projectFilter) return false
      if (assigneeFilter !== "all") {
        const taskAssignees = assigneesByTask[task.name] ?? []
        if (!taskAssignees.some((a) => a.member === assigneeFilter)) return false
      }
      return true
    })
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, assigneeFilter, projectMap, assigneesByTask])

  // Group filtered tasks by status for kanban view, sorted by due date ascending (nulls last)
  // Done column only shows tasks completed in the last 7 days (#143)
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, HiveTask[]> = {}
    for (const status of TASK_STATUSES) {
      grouped[status] = []
    }
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoff = sevenDaysAgo.toISOString().split("T")[0]
    for (const task of filteredTasks) {
      if (grouped[task.status]) {
        if (task.status === "Done" && (!task.completed_on || task.completed_on < cutoff)) {
          continue
        }
        grouped[task.status].push(task)
      }
    }
    for (const status of TASK_STATUSES) {
      grouped[status].sort((a, b) => {
        const da = a.due_date || "9999-12-31"
        const db = b.due_date || "9999-12-31"
        return da < db ? -1 : da > db ? 1 : 0
      })
    }
    return grouped
  }, [filteredTasks])

  const handleStatusChange = useCallback(async (taskName: string, newStatus: string) => {
    const today = new Date().toISOString().split("T")[0]
    const optimistic = (current: HiveTask[] | undefined) =>
      current?.map((t) =>
        t.name === taskName ? {
          ...t,
          status: newStatus as HiveTask["status"],
          completed_on: newStatus === "Done" ? (t.completed_on || today) : null,
        } : t
      )
    try {
      await tasksMutate(
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
  }, [updateDoc, tasksMutate, celebrate])

  const handleTaskClick = useCallback((task: HiveTask) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setSelectedTask(task)
    setSheetOpen(true)
  }, [])

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setSheetOpen(open)
    if (!open) setSelectedTask(null)
  }, [])

  const handleTaskUpdated = useCallback(() => {
    tasksMutate()
    callAssignees({})
  }, [tasksMutate, callAssignees])

  const tableData = useMemo<TaskRow[]>(
    () => filteredTasks.map((task) => ({
      task,
      projectTitle: projectMap[task.project] ?? task.project,
      milestoneTitle: task.milestone ? (milestoneMap[task.milestone] ?? "") : "",
      assignees: assigneesByTask[task.name] ?? [],
    })),
    [filteredTasks, projectMap, milestoneMap, assigneesByTask],
  )

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  const activeFilterCount = [statusFilter, priorityFilter, projectFilter, assigneeFilter].filter(f => f !== "all").length

  // Detect if the user has modified filters or view type from the saved view's originals
  const viewFiltersModified = useMemo(() => {
    if (!activeView) return false
    // Check view type change (list vs kanban)
    const savedViewType = activeView.view_type || "list"
    if (viewMode !== savedViewType) return true
    // Check filter changes
    const saved: Record<string, string> = (() => {
      try { return JSON.parse(activeView.filters_json || "{}") } catch { return {} }
    })()
    const current: Record<string, string> = {}
    if (statusFilter !== "all") current.status = statusFilter
    if (priorityFilter !== "all") current.priority = priorityFilter
    if (projectFilter !== "all") current.project = projectFilter
    if (assigneeFilter !== "all") current.assignee = assigneeFilter
    if (search) current.q = search
    const savedKeys = Object.keys(saved).sort()
    const currentKeys = Object.keys(current).sort()
    if (savedKeys.length !== currentKeys.length) return true
    return savedKeys.some((k, i) => currentKeys[i] !== k || saved[k] !== current[k])
  }, [activeView, statusFilter, priorityFilter, projectFilter, assigneeFilter, search, viewMode])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {activeView ? (
            <>
              <Breadcrumb className="mb-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/tasks" />}>
                      Tasks
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{activeView.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 truncate">
                {activeView.emoji && <span className="text-xl">{activeView.emoji}</span>}
                <span className="truncate">{activeView.label}</span>
              </h1>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
              <p className="mt-1 text-muted-foreground">
                All tasks across your projects.
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-md border p-0.5">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("list")}
            >
              <HugeiconsIcon icon={LeftToRightListBulletIcon} strokeWidth={2} className="size-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("kanban")}
            >
              <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} className="size-4" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" className="h-8 w-8" aria-label="View actions" />}
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {activeView && viewFiltersModified ? (
                <>
                  <DropdownMenuItem onClick={handleSaveViewChanges}>
                    <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
                    Save Changes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSaveViewOpen(true)}>
                    Save as New View
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => setSaveViewOpen(true)}>
                  <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
                  Save View
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setCreateOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="gap-1">
              <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3" />
              {activeFilterCount}
            </Badge>
          )}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-fit">
              <span className="text-muted-foreground">Status:</span>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
              <SelectItem value="Blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-fit">
              <span className="text-muted-foreground">Priority:</span>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <LinkField
            doctype="Hive Project"
            value={projectFilter === "all" ? "" : projectFilter}
            onChange={(v) => setProjectFilter(v || "all")}
            label="Project:"
            placeholder="All"
            filters={{ is_archived: 0 }}
          />
          <LinkField
            doctype="Hive Member"
            value={assigneeFilter === "all" ? "" : assigneeFilter}
            onChange={(v) => setAssigneeFilter(v || "all")}
            label="Assignee:"
            placeholder="All"
          />
        </div>
      </div>

      {/* Data View */}
      {tasksLoading ? (
        viewMode === "kanban" ? (
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[220px] space-y-3 md:min-w-0">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Task", "Project", "Status", "Priority", "Size", "Milestone", "Start Date", "Due Date", "Assignees"].map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="size-6 rounded-full" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : filteredTasks.length === 0 ? (
        <Empty className="border rounded-2xl p-12">
          <EmptyHeader>
            <EmptyMedia>
              <HugeiconsIcon icon={TaskDaily01Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>
              {search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all" || assigneeFilter !== "all"
                ? "No tasks match your filters"
                : "No tasks yet"}
            </EmptyTitle>
            <EmptyDescription>
              {search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all" || assigneeFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Tasks will appear here once created in a project."}
            </EmptyDescription>
          </EmptyHeader>
          {!(search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all" || assigneeFilter !== "all") && (
            <Button onClick={() => setCreateOpen(true)} className="mt-4">
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
              Add Task
            </Button>
          )}
        </Empty>
      ) : viewMode === "kanban" ? (
        <div className="space-y-2">
          <TaskKanban
            tasksByStatus={tasksByStatus}
            onStatusChange={handleStatusChange}
            onTaskClick={handleTaskClick}
            assigneesByTask={assigneesByTask}
            pinnedTaskNames={pinnedTaskNames}
            onTogglePin={togglePin}
          />
          <p className="text-xs text-muted-foreground">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            {(search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all" || assigneeFilter !== "all") && " matching filters"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/projects/${row.original.task.project}?tab=tasks&task=${row.original.task.name}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {tableData.length} task{tableData.length !== 1 ? "s" : ""}
              {(search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all" || assigneeFilter !== "all") && " matching filters"}
            </p>
            {table.getPageCount() > 1 && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <TaskDetailSheet
        task={selectedTask}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        onUpdated={handleTaskUpdated}
        isPinned={selectedTask ? isPinned(selectedTask.name) : false}
        onTogglePin={togglePin}
        initialAssignees={selectedTask ? assigneesByTask[selectedTask.name] : undefined}
      />

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTask}
      />

      <Dialog open={saveViewOpen} onOpenChange={(open) => {
        setSaveViewOpen(open)
        if (!open) {
          setSaveViewLabel("")
          setSaveViewEmoji("")
          setSaveViewPublic(false)
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div>
                <Label>Emoji</Label>
                <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        className="mt-1.5 flex h-9 w-16 items-center justify-center rounded-md border border-input bg-background text-lg hover:bg-accent transition-colors"
                      >
                        {saveViewEmoji || "📋"}
                      </button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" side="bottom" align="start">
                    <LazyEmojiPicker
                      onEmojiClick={(emojiData) => {
                        setSaveViewEmoji(emojiData.emoji)
                        setEmojiPickerOpen(false)
                      }}
                      theme={resolvedTheme === "dark" ? "dark" : "light"}
                      skinTonesDisabled
                      height={400}
                      width={350}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Label htmlFor="save-view-label">Name</Label>
                <Input
                  id="save-view-label"
                  value={saveViewLabel}
                  onChange={(e) => setSaveViewLabel(e.target.value)}
                  placeholder="My urgent tasks"
                  className="mt-1.5"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && saveViewLabel.trim()) handleSaveView()
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="save-view-public"
                checked={saveViewPublic}
                onCheckedChange={(checked) => setSaveViewPublic(checked === true)}
              />
              <Label htmlFor="save-view-public" className="text-sm font-normal">
                Public — visible to all team members
              </Label>
            </div>
            {(statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all" || assigneeFilter !== "all" || search) && (
              <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Current filters:</p>
                {search && <p>Search: {search}</p>}
                {statusFilter !== "all" && <p>Status: {statusFilter}</p>}
                {priorityFilter !== "all" && <p>Priority: {priorityFilter}</p>}
                {projectFilter !== "all" && <p>Project: {projectFilter}</p>}
                {assigneeFilter !== "all" && <p>Assignee: {assigneeFilter}</p>}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              View type: {viewMode === "kanban" ? "Kanban" : "List"}
            </p>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleSaveView} disabled={!saveViewLabel.trim()}>
              Save View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
