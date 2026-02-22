import { useState, useMemo, useEffect } from "react"
import { useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk"
import { useNavigate } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TaskDaily01Icon,
  Search01Icon,
  FilterIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  SortingIcon,
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
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { TASK_STATUSES, TASK_PRIORITIES, type HiveTask, type HiveProject, type HiveTaskAssignee } from "@/types"

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Low: "outline",
  Medium: "secondary",
  High: "default",
  Urgent: "destructive",
}

const statusColor: Record<string, string> = {
  Backlog: "bg-muted-foreground/40",
  "To Do": "bg-yellow-500",
  "In Progress": "bg-blue-500",
  Done: "bg-green-500",
  Blocked: "bg-red-500",
}

const priorityOrder: Record<string, number> = {
  Urgent: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

interface TaskRow {
  task: HiveTask
  projectTitle: string
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
          <span className={`size-2 shrink-0 rounded-full ${statusColor[task.status] ?? "bg-muted-foreground/40"}`} />
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
    accessorFn: (row) => priorityOrder[row.task.priority] ?? 99,
    header: ({ column }) => <SortHeader label="Priority" column={column} />,
    cell: ({ row }) => (
      <Badge variant={priorityVariant[row.original.task.priority] ?? "outline"} className="text-[10px] h-5 px-1.5">
        {row.original.task.priority}
      </Badge>
    ),
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
              <Avatar key={a.member} size="sm">
                {a.user_image ? (
                  <AvatarImage src={a.user_image} alt={a.member_name} />
                ) : (
                  <AvatarFallback className="text-[10px]">
                    {(a.member_name || a.member).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
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
          <Avatar size="sm">
            <AvatarFallback className="text-[10px]">
              {task.assigned_to.split("@")[0].slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )
      }
      return <span className="text-muted-foreground">-</span>
    },
  },
]

export function TasksPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [sorting, setSorting] = useState<SortingState>([])

  const { data: tasks, isLoading: tasksLoading } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: [
        "name", "title", "project", "status", "priority",
        "assigned_to", "is_internal", "due_date", "pr_link",
        "uat_status", "creation", "modified",
      ],
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

  const { call: callAssignees, result: assigneesResult } = useFrappePostCall<{
    message: Record<string, HiveTaskAssignee[]>
  }>("bwh_hive.bwh_hive.api.get_task_assignees")

  useEffect(() => {
    callAssignees({})
  }, [callAssignees])

  const assigneesByTask = (assigneesResult?.message ?? {}) as Record<string, HiveTaskAssignee[]>

  const projectMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (projects) {
      for (const p of projects) {
        map[p.name] = p.title
      }
    }
    return map
  }, [projects])

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
        return true
      })
      .map((task) => ({
        task,
        projectTitle: projectMap[task.project] ?? task.project,
        assignees: assigneesByTask[task.name] ?? [],
      }))
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, projectMap, assigneesByTask])

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

  const activeFilterCount = [statusFilter, priorityFilter, projectFilter].filter(f => f !== "all").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="mt-1 text-muted-foreground">
          All tasks across your projects.
        </p>
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
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
              <SelectItem value="Blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects?.map((p) => (
                <SelectItem key={p.name} value={p.name}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      {tasksLoading ? (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {["Task", "Project", "Status", "Priority", "Due Date", "Assignees"].map((h) => (
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
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="size-6 rounded-full" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : tableData.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <HugeiconsIcon icon={TaskDaily01Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">
            {search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all"
              ? "No tasks match your filters"
              : "No tasks yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Tasks will appear here once created in a project."}
          </p>
        </div>
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
                    onClick={() => navigate(`/projects/${row.original.task.project}`)}
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
              {(search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all") && " matching filters"}
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
    </div>
  )
}
