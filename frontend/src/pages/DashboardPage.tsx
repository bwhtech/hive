import { useState } from "react"
import { useFrappeGetDocList } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroup03Icon,
  Folder01Icon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { HiveMember, HiveProject, HiveTask } from "@/types"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Open: "default",
  Completed: "secondary",
  "On Hold": "outline",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function DashboardPage() {
  const [tab, setTab] = useState("projects")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your projects and team.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="projects">
            <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="team">
            <HugeiconsIcon icon={UserGroup03Icon} strokeWidth={2} className="size-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-4">
          <ProjectsTab />
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <TeamTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectsTab() {
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
      fields: ["name", "project", "status", "is_client_task"],
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
        if (task.is_client_task) {
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
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={statusVariant[project.status] ?? "outline"}>
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

function TeamTab() {
  const { data: members, isLoading: membersLoading } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: ["name", "user", "member_name", "user_image", "type", "designation", "is_active"],
      filters: [["type", "=", "Team"], ["is_active", "=", 1]],
      orderBy: { field: "member_name", order: "asc" },
      limit: 100,
    },
  )

  const { data: tasks } = useFrappeGetDocList<HiveTask>(
    "Hive Task",
    {
      fields: ["name", "title", "project", "status", "priority", "assigned_to"],
      filters: [["status", "not in", ["Done"]]],
      orderBy: { field: "modified", order: "desc" },
      limit: 500,
    },
  )

  const { data: projects } = useFrappeGetDocList<HiveProject>(
    "Hive Project",
    {
      fields: ["name", "title", "status"],
      filters: [["status", "=", "Open"]],
      limit: 100,
    },
  )

  if (membersLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!members?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <HugeiconsIcon icon={UserGroup03Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">No team members yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add team members from Settings.
        </p>
      </div>
    )
  }

  // Group tasks and projects by user
  const tasksByUser: Record<string, HiveTask[]> = {}
  const projectsByUser: Record<string, Set<string>> = {}

  if (tasks) {
    for (const task of tasks) {
      if (!task.assigned_to) continue
      if (!tasksByUser[task.assigned_to]) {
        tasksByUser[task.assigned_to] = []
      }
      tasksByUser[task.assigned_to].push(task)
      if (!projectsByUser[task.assigned_to]) {
        projectsByUser[task.assigned_to] = new Set()
      }
      projectsByUser[task.assigned_to].add(task.project)
    }
  }

  // Build project name lookup
  const projectMap: Record<string, HiveProject> = {}
  if (projects) {
    for (const p of projects) {
      projectMap[p.name] = p
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => {
        const memberTasks = tasksByUser[member.user] ?? []
        const memberProjectIds = projectsByUser[member.user] ?? new Set()

        return (
          <Card key={member.name}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  {member.user_image && <AvatarImage src={member.user_image} />}
                  <AvatarFallback>
                    {member.member_name ? getInitials(member.member_name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{member.member_name}</p>
                  {member.designation && (
                    <p className="text-xs text-muted-foreground truncate">
                      {member.designation}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Projects */}
              {memberProjectIds.size > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Projects ({memberProjectIds.size})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(memberProjectIds).map((pid) => (
                      <Link key={pid} to={`/projects/${pid}`}>
                        <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                          {projectMap[pid]?.title ?? pid}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Current tasks */}
              {memberTasks.length > 0 ? (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Active tasks ({memberTasks.length})
                  </p>
                  <ul className="space-y-1">
                    {memberTasks.slice(0, 4).map((task) => (
                      <li key={task.name} className="flex items-center gap-2 text-xs">
                        <span
                          className={`size-1.5 rounded-full shrink-0 ${
                            task.status === "In Progress"
                              ? "bg-blue-500"
                              : task.status === "Blocked"
                                ? "bg-red-500"
                                : "bg-muted-foreground/50"
                          }`}
                        />
                        <span className="truncate">{task.title}</span>
                      </li>
                    ))}
                    {memberTasks.length > 4 && (
                      <li className="text-xs text-muted-foreground">
                        +{memberTasks.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No active tasks</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
