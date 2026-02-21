import { useState } from "react"
import { useFrappeGetDocList, useFrappeGetCall } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroup03Icon,
  Folder01Icon,
  TaskDaily01Icon,
  UserIcon,
  AlertCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { HiveMember, HiveProject, HiveTask } from "@/types"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Open: "default",
  Completed: "secondary",
  "On Hold": "outline",
}

const priorityColor: Record<string, string> = {
  Urgent: "text-red-500",
  High: "text-orange-500",
  Medium: "text-yellow-500",
  Low: "text-muted-foreground",
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
  const [tab, setTab] = useState("my")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your work, projects, and team.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="my">
            <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4" />
            My Work
          </TabsTrigger>
          <TabsTrigger value="projects">
            <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="team">
            <HugeiconsIcon icon={UserGroup03Icon} strokeWidth={2} className="size-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="mt-4">
          <MyWorkTab />
        </TabsContent>
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

/* ─── My Work Tab ─── */

interface MyDashboardData {
  tasks_by_project: {
    project: string
    project_title: string
    project_status: string
    tasks: {
      name: string
      title: string
      project: string
      status: string
      priority: string
      due_date: string | null
      is_client_task: 0 | 1
    }[]
  }[]
  my_projects: {
    name: string
    title: string
    status: string
    project_type: string
    client: string
    modified: string
  }[]
  unread_count: number
  recent_updates: {
    name: string
    project: string
    project_title: string
    posted_by: string
    posted_by_name: string
    content: string
    creation: string
    is_unread: boolean
  }[]
}

function MyWorkTab() {
  const { data, isLoading } = useFrappeGetCall<{ message: MyDashboardData }>(
    "bwh_hive.bwh_hive.api.get_my_dashboard",
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-2 h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent><Skeleton className="h-32 w-full" /></CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent><Skeleton className="h-32 w-full" /></CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const dashboard = data?.message
  if (!dashboard) return null

  const totalTasks = dashboard.tasks_by_project.reduce(
    (sum, g) => sum + g.tasks.length, 0
  )
  const inProgressTasks = dashboard.tasks_by_project.reduce(
    (sum, g) => sum + g.tasks.filter((t) => t.status === "In Progress").length, 0
  )

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold">{totalTasks}</p>
            <p className="text-sm text-muted-foreground">Open tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold">{inProgressTasks}</p>
            <p className="text-sm text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold">{dashboard.unread_count}</p>
            <p className="text-sm text-muted-foreground">Unread updates</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My tasks grouped by project */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={TaskDaily01Icon} strokeWidth={2} className="size-5" />
              My Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.tasks_by_project.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open tasks assigned to you.</p>
            ) : (
              <div className="space-y-5">
                {dashboard.tasks_by_project.map((group) => (
                  <div key={group.project}>
                    <Link
                      to={`/projects/${group.project}`}
                      className="group mb-2 flex items-center gap-1.5 text-sm font-medium hover:underline"
                    >
                      {group.project_title}
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        strokeWidth={2}
                        className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                    <ul className="space-y-1.5">
                      {group.tasks.map((task) => (
                        <li key={task.name} className="flex items-center gap-2 text-sm">
                          <span
                            className={`size-2 shrink-0 rounded-full ${
                              task.status === "In Progress"
                                ? "bg-blue-500"
                                : task.status === "Blocked"
                                  ? "bg-red-500"
                                  : task.status === "To Do"
                                    ? "bg-yellow-500"
                                    : "bg-muted-foreground/40"
                            }`}
                          />
                          <span className="truncate flex-1">{task.title}</span>
                          <span className={`text-xs shrink-0 ${priorityColor[task.priority] ?? ""}`}>
                            {task.priority}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-5" />
              Recent Updates
              {dashboard.unread_count > 0 && (
                <Badge variant="default" className="ml-auto text-xs">
                  {dashboard.unread_count} unread
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.recent_updates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent updates.</p>
            ) : (
              <ul className="space-y-3">
                {dashboard.recent_updates.map((upd) => (
                  <li key={upd.name} className="relative">
                    {upd.is_unread && (
                      <span className="absolute -left-3 top-1.5 size-1.5 rounded-full bg-blue-500" />
                    )}
                    <Link to={`/projects/${upd.project}`} className="block hover:bg-muted/50 rounded-md p-1 -m-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{upd.posted_by_name}</span>
                        <span>in</span>
                        <span className="font-medium">{upd.project_title}</span>
                        <span className="ml-auto">
                          {new Date(upd.creation).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        className="mt-0.5 text-sm line-clamp-2 text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: upd.content.replace(/<[^>]*>/g, " ").slice(0, 120),
                        }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My projects */}
      {dashboard.my_projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-5" />
              My Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dashboard.my_projects.map((project) => (
                <Link
                  key={project.name}
                  to={`/projects/${project.name}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{project.title}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant={statusVariant[project.status] ?? "outline"} className="text-xs">
                        {project.status}
                      </Badge>
                      {project.project_type && (
                        <Badge variant="outline" className="text-xs">{project.project_type}</Badge>
                      )}
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/* ─── Projects Tab ─── */

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

/* ─── Team Tab ─── */

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

  // Fetch stale members
  const { data: staleData } = useFrappeGetCall<{ message: string[] }>(
    "bwh_hive.bwh_hive.api.get_stale_members",
  )
  const staleUsers = new Set(staleData?.message ?? [])

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
        const isStale = staleUsers.has(member.user)

        return (
          <Card key={member.name} className={isStale ? "border-red-500/40" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    {member.user_image && <AvatarImage src={member.user_image} />}
                    <AvatarFallback>
                      {member.member_name ? getInitials(member.member_name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  {isStale && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="absolute -right-0.5 -top-0.5 flex size-3.5">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex size-3.5 rounded-full bg-red-500" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>No updates in 7+ days</TooltipContent>
                    </Tooltip>
                  )}
                </div>
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
