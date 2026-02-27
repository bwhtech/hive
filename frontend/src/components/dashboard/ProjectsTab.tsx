import { useMemo } from "react"
import { useFrappeGetDocList } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Folder01Icon, TaskDaily01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { HiveProject, HiveTask } from "@/types"
import { PROJECT_STATUS_VARIANT } from "@/lib/variants"

export function ProjectsTab() {
  const { data: projects, isLoading: projectsLoading } = useFrappeGetDocList<HiveProject>(
    "Hive Project",
    {
      fields: ["name", "title", "status", "project_type", "client", "creation", "modified"],
      filters: [["is_archived", "=", 0]],
      orderBy: { field: "modified", order: "desc" },
      limit: 100,
    },
  )

  const { data: tasks } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: ["name", "project", "status", "is_internal"],
      filters: [["is_archived", "=", 0]],
      limit: 500,
    },
  )

  const tasksByProject = useMemo(() => {
    const map: Record<string, { total: number; open: number; clientOpen: number }> = {}
    if (tasks) {
      for (const task of tasks) {
        if (!map[task.project]) {
          map[task.project] = { total: 0, open: 0, clientOpen: 0 }
        }
        map[task.project].total++
        if (task.status !== "Done") {
          map[task.project].open++
          if (task.is_internal) {
            map[task.project].clientOpen++
          }
        }
      }
    }
    return map
  }, [tasks])

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
      <Empty className="border rounded-2xl p-12">
        <EmptyHeader>
          <EmptyMedia>
            <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Projects will appear here once created.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
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
