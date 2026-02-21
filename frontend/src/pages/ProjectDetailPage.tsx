import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import {
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
  Idea01Icon,
  News01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import type { HiveProject, HiveTask, HiveMilestone, HiveTaskAssignee } from "@/types"
import { TASK_STATUSES } from "@/types"
import { TaskKanban } from "@/components/TaskKanban"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"
import { TaskDetailSheet } from "@/components/TaskDetailSheet"
import { MilestoneSection } from "@/components/MilestoneSection"
import { FeatureRequestSection } from "@/components/FeatureRequestSection"
import { UpdatesSection } from "@/components/UpdatesSection"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Open: "default",
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
  "is_client_task",
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
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<HiveTask | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data: project, isLoading: projectLoading } = useFrappeGetDoc<HiveProject>(
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

  // Fetch dashboard stats and assignees when project loads
  useEffect(() => {
    if (id) {
      callDashboard({ project: id }).catch(() => {})
      callAssignees({ project: id }).catch(() => {})
    }
  }, [id, callDashboard, callAssignees])

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
    is_client_task?: 0 | 1
    assignees?: { member: string }[]
  }) => {
    try {
      await createDoc("Hive Task", {
        ...values,
        project: id,
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

  // Dashboard data from API (if loaded)
  const dashboardData = dashboardResult?.message as
    | { members?: { member: string; member_name: string; role: string }[] }
    | undefined

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
          </div>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Add Task
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
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
                              variant={ms.status === "In Progress" ? "default" : "outline"}
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
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.members?.length ? (
                    <div className="space-y-2">
                      {dashboardData.members.map((m) => (
                        <div key={m.member} className="flex items-center gap-2 text-sm">
                          <Avatar size="sm">
                            <AvatarFallback>
                              {(m.member_name || m.member).slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 truncate">{m.member_name || m.member}</span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                            {m.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No team members assigned</p>
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
            {id && <UpdatesSection projectId={id} />}
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
      />

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdated={handleTaskUpdated}
      />
    </div>
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
