import { useState } from "react"
import { useParams, Link } from "react-router"
import { useFrappeGetDoc, useFrappeGetDocList, useFrappeUpdateDoc, useFrappeCreateDoc } from "frappe-react-sdk"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon, Add01Icon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import type { HiveProject, HiveTask } from "@/types"
import { TASK_STATUSES } from "@/types"
import { TaskKanban } from "@/components/TaskKanban"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Open: "default",
  Completed: "secondary",
  "On Hold": "outline",
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [createOpen, setCreateOpen] = useState(false)

  const { data: project, isLoading: projectLoading } = useFrappeGetDoc<HiveProject>(
    "Hive Project",
    id ?? "",
    id ? undefined : null,
  )

  const { data: tasks, isLoading: tasksLoading, mutate: mutateTasks } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: ["name", "title", "project", "status", "priority", "assigned_to", "description", "creation", "modified"],
      filters: [["project", "=", id ?? ""]],
      orderBy: { field: "modified", order: "desc" },
      limit: 200,
    },
    id ? undefined : null,
  )

  const { updateDoc } = useFrappeUpdateDoc()
  const { createDoc } = useFrappeCreateDoc()

  const handleStatusChange = async (taskName: string, newStatus: string) => {
    try {
      await updateDoc("Hive Task", taskName, { status: newStatus })
      mutateTasks()
    } catch {
      toast.error("Failed to update task status")
    }
  }

  const handleCreateTask = async (values: { title: string; priority: string; status: string }) => {
    try {
      await createDoc("Hive Task", {
        ...values,
        project: id,
      })
      mutateTasks()
      setCreateOpen(false)
      toast.success("Task created")
    } catch {
      toast.error("Failed to create task")
    }
  }

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-4 gap-4">
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

      {/* Kanban */}
      {tasksLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
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
        />
      )}

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTask}
      />
    </div>
  )
}
