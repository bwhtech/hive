import { useState, useMemo, useEffect } from "react"
import { useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TaskDaily01Icon,
  Search01Icon,
  Calendar03Icon,
  ArrowRight01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from "@/components/ui/avatar"
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

export function TasksPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")

  const { data: tasks, isLoading: tasksLoading } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: [
        "name", "title", "project", "status", "priority",
        "assigned_to", "is_client_task", "due_date", "pr_link",
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

  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    return tasks.filter((task) => {
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
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, projectMap])

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

      {/* Task List */}
      {tasksLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 py-4">
                <Skeleton className="size-2 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
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
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            {(search || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all") && " matching filters"}
          </p>
          <div className="space-y-1.5">
            {filteredTasks.map((task) => (
              <TaskRow key={task.name} task={task} projectTitle={projectMap[task.project] ?? task.project} assignees={assigneesByTask[task.name]} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, projectTitle, assignees }: { task: HiveTask; projectTitle: string; assignees?: HiveTaskAssignee[] }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "Done"
  const hasAssignees = assignees && assignees.length > 0
  const legacyInitials = !hasAssignees && task.assigned_to
    ? task.assigned_to.split("@")[0].slice(0, 2).toUpperCase()
    : null

  return (
    <Link to={`/projects/${task.project}`}>
      <Card className="transition-colors hover:bg-muted/30">
        <CardHeader className="flex-row items-center gap-3 py-3 px-4">
          <span className={`size-2 shrink-0 rounded-full ${statusColor[task.status] ?? "bg-muted-foreground/40"}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{task.title}</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">{projectTitle}</span>
              {task.due_date && (
                <>
                  <span className="text-border">|</span>
                  <span className={`flex items-center gap-1 shrink-0 ${isOverdue ? "text-destructive font-medium" : ""}`}>
                    <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3" />
                    {format(new Date(task.due_date), "MMM d")}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={priorityVariant[task.priority] ?? "outline"} className="text-[10px] h-5 px-1.5">
              {task.priority}
            </Badge>
            <Badge variant="outline" className="text-[10px] h-5 px-1.5">
              {task.status}
            </Badge>
            {hasAssignees ? (
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
              </AvatarGroup>
            ) : legacyInitials ? (
              <Avatar size="sm">
                <AvatarFallback className="text-[10px]">{legacyInitials}</AvatarFallback>
              </Avatar>
            ) : null}
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
