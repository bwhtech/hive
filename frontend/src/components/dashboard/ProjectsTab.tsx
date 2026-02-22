import { useFrappeGetDocList } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Folder01Icon, TaskDaily01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { HiveProject, HiveTask } from "@/types"
import { PROJECT_STATUS_VARIANT } from "@/lib/variants"

export function ProjectsTab() {
  const { data: projects, isLoading: projectsLoading } = useFrappeGetDocList<HiveProject>(
    "Hive Project",
    {
      fields: ["name", "title", "status", "project_type", "client", "creation", "modified"],
      orderBy: { field: "modified", order: "desc" },
      limit: 100,
    },
  )

  const { data: tasks } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: ["name", "project", "status", "is_internal"],
      limit: 500,
    },
  )

  if (projectsLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">No projects yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Projects will appear here once created.
        </p>
      </div>
    )
  }

  // Group tasks by project
  const tasksByProject: Record<string, { total: number; open: number; clientOpen: number }> = {}
  if (tasks) {
    for (const task of tasks) {
      if (!tasksByProject[task.project]) {
        tasksByProject[task.project] = { total: 0, open: 0, clientOpen: 0 }
      }
      tasksByProject[task.project].total++
      if (task.status !== "Done") {
        tasksByProject[task.project].open++
        if (task.is_internal) {
          tasksByProject[task.project].clientOpen++
        }
      }
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const stats = tasksByProject[project.name] ?? { total: 0, open: 0, clientOpen: 0 }
        return (
          <Link key={project.name} to={`/projects/${project.name}`} className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={PROJECT_STATUS_VARIANT[project.status] ?? "outline"}>
                    {project.status}
                  </Badge>
                  {project.project_type && (
                    <Badge variant="outline">{project.project_type}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.client && (
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={TaskDaily01Icon} strokeWidth={2} className="size-3.5" />
                      {stats.open} open
                    </span>
                    {stats.clientOpen > 0 && (
                      <span>{stats.clientOpen} client</span>
                    )}
                    <span>{stats.total} total</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
