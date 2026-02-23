import { useState, useMemo } from "react"
import { useFrappeGetDocList } from "frappe-react-sdk"
import { Link, useOutletContext } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Folder01Icon, Search01Icon, Add01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
import { PROJECT_STATUSES, type HiveProject } from "@/types"
import { PROJECT_STATUS_VARIANT } from "@/lib/variants"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

export function ProjectsPage() {
  const { openCreateProject } = useOutletContext<{ openCreateProject: () => void }>()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data, isLoading } = useFrappeGetDocList<HiveProject>("Hive Project", {
    fields: ["name", "title", "status", "project_type", "client", "description", "creation", "modified"],
    orderBy: { field: "modified", order: "desc" },
    limit: 100,
  })

  const filteredProjects = useMemo(() => {
    if (!data) return []
    return data.filter((project) => {
      if (search) {
        const q = search.toLowerCase()
        const matchTitle = project.title.toLowerCase().includes(q)
        const matchClient = (project.client ?? "").toLowerCase().includes(q)
        const matchType = (project.project_type ?? "").toLowerCase().includes(q)
        if (!matchTitle && !matchClient && !matchType) return false
      }
      if (statusFilter !== "all" && project.status !== statusFilter) return false
      return true
    })
  }, [data, search, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your projects.</p>
        </div>
        <Button onClick={openCreateProject}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
          New Project
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PROJECT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      ) : filteredProjects.length === 0 ? (
        <Empty className="border rounded-2xl p-12">
          <EmptyHeader>
            <EmptyMedia>
              <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>
              {search || statusFilter !== "all" ? "No projects match your filters" : "No projects yet"}
            </EmptyTitle>
            <EmptyDescription>
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Projects will appear here once created."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
            {(search || statusFilter !== "all") && " matching filters"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link key={project.name} to={`/projects/${project.name}`} className="block">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant={PROJECT_STATUS_VARIANT[project.status] ?? "outline"}>
                        {project.status}
                      </Badge>
                      {project.project_type && (
                        <Badge variant="outline">{project.project_type}</Badge>
                      )}
                      {project.client && (
                        <Badge variant="outline">{project.client}</Badge>
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
        </>
      )}
    </div>
  )
}
