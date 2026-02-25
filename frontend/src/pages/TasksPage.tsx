import { useState, useMemo, useEffect, useCallback } from "react"
import { useFrappeGetDocList, useFrappePostCall, useFrappeCreateDoc } from "frappe-react-sdk"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TaskDaily01Icon,
  Search01Icon,
  FilterIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  SortingIcon,
  Add01Icon,
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
import { TASK_STATUSES, TASK_PRIORITIES, type HiveTask, type HiveProject, type HiveMilestone, type HiveTaskAssignee } from "@/types"
import { TASK_PRIORITY_VARIANT, TASK_SIZE_VARIANT, TASK_STATUS_COLOR, PRIORITY_ORDER } from "@/lib/variants"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"

interface TaskRow {
  task: HiveTask
  projectTitle: string
  milestoneTitle: string
  assignees: HiveTaskAssignee[]
}

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
    id: "due_date",
    accessorFn: (row) => row.task.due_date ?? "",
    header: ({ column }) => <SortHeader label="Due Date" column={column} />,
    cell: ({ row }) => {
      const { task } = row.original
      if (!task.due_date) return <span className="text-muted-foreground">-</span>
      const isOverdue = new Date(task.due_date) < new Date() && task.status !== "Done"
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

  const search = searchParams.get("q") ?? ""
  const statusFilter = searchParams.get("status") ?? "all"
  const priorityFilter = searchParams.get("priority") ?? "all"
  const projectFilter = searchParams.get("project") ?? "all"
  const assigneeFilter = searchParams.get("assignee") ?? "all"

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

  const [sorting, setSorting] = useState<SortingState>([])
  const [createOpen, setCreateOpen] = useState(false)
  const { createDoc } = useFrappeCreateDoc()

  const { data: tasks, isLoading: tasksLoading, mutate: tasksMutate } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: [
        "name", "title", "project", "status", "priority", "size", "milestone",
        "depends_on", "assigned_to", "is_internal", "due_date", "pr_link",
        "uat_status", "creation", "modified",
      ],
      filters: [["is_archived", "=", 0]],
      orderBy: { field: "modified", order: "desc" },
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

  const assigneesByTask = (assigneesResult?.message ?? {}) as Record<string, HiveTaskAssignee[]>

  const handleCreateTask = useCallback(async (values: {
    title: string; priority: string; status: string;
    due_date?: string | null; start_date?: string | null;
    is_internal?: 0 | 1; assignees?: { member: string }[];
    project?: string; milestone?: string | null;
  }) => {
    try {
      await createDoc("Hive Task", values)
      setCreateOpen(false)
      toast.success("Task created")
      tasksMutate()
      callAssignees({})
    } catch {
      toast.error("Failed to create task")
    }
  }, [createDoc, callAssignees, tasksMutate])

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

  const tableData = useMemo<TaskRow[]>(() => {
    if (!tasks) return []
    return tasks
      .filter((task) => {
        if (search) {
          const q = search.toLowerCase()
          const matchTitle = task.title.toLowerCase().includes(q)
          const matchProject = (projectMap[task.project] ?? task.project).toLowerCase().includes(q)
          const matchAssignee = (task.assigned_to ?? "").toLowerCase().includes(q)
          if (!matchTitle && !matchProject && !matchAssignee) return false
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
      .map((task) => ({
        task,
        projectTitle: projectMap[task.project] ?? task.project,
        milestoneTitle: task.milestone ? (milestoneMap[task.milestone] ?? "") : "",
        assignees: assigneesByTask[task.name] ?? [],
      }))
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, assigneeFilter, projectMap, milestoneMap, assigneesByTask])

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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-muted-foreground">
            All tasks across your projects.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Add Task
        </Button>
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

      {/* Data Table */}
      {tasksLoading ? (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {["Task", "Project", "Status", "Priority", "Size", "Milestone", "Due Date", "Assignees"].map((h) => (
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
                  <TableCell><Skeleton className="size-6 rounded-full" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : tableData.length === 0 ? (
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
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border">
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

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTask}
      />
    </div>
  )
}
