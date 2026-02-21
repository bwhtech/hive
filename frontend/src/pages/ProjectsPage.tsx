import { useFrappeGetDocList } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Folder01Icon } from "@hugeicons/core-free-icons"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { HiveProject } from "@/types"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Open: "default",
  Completed: "secondary",
  "On Hold": "outline",
}

export function ProjectsPage() {
  const { data, isLoading } = useFrappeGetDocList<HiveProject>("Hive Project", {
    fields: ["name", "title", "status", "project_type", "description", "creation", "modified"],
    orderBy: { field: "modified", order: "desc" },
    limit: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="mt-1 text-muted-foreground">Manage your projects.</p>
      </div>

      {isLoading ? (
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
      ) : !data?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Projects will appear here once created.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((project) => (
            <Link key={project.name} to={`/projects/${project.name}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant={statusVariant[project.status] ?? "outline"}>
                      {project.status}
                    </Badge>
                    {project.project_type && (
                      <Badge variant="outline">{project.project_type}</Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                {project.description && (
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground"
                       dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
