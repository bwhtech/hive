import { useFrappeGetCall } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TaskDaily01Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
  Folder01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item"
import { PROJECT_STATUS_VARIANT, TASK_PRIORITY_COLOR } from "@/lib/variants"

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
      is_internal: 0 | 1
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

export function MyWorkTab() {
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
                        <li key={task.name}>
                          <Link
                            to={`/projects/${task.project}?tab=tasks&task=${task.name}`}
                            className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded-md px-1 py-0.5 -mx-1 transition-colors"
                          >
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
                            <span className={`text-xs shrink-0 ${TASK_PRIORITY_COLOR[task.priority] ?? ""}`}>
                              {task.priority}
                            </span>
                          </Link>
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
                    <Link to={`/projects/${upd.project}?tab=updates`} className="block hover:bg-muted/50 rounded-md p-1 -m-1">
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
                <Item
                  key={project.name}
                  render={<Link to={`/projects/${project.name}`} />}
                  variant="outline"
                  className="p-3 hover:bg-muted/50"
                >
                  <ItemContent>
                    <ItemTitle>{project.title}</ItemTitle>
                    <ItemDescription className="flex items-center gap-1.5">
                      <Badge variant={PROJECT_STATUS_VARIANT[project.status] ?? "outline"} className="text-xs">
                        {project.status}
                      </Badge>
                      {project.project_type && (
                        <Badge variant="outline" className="text-xs">{project.project_type}</Badge>
                      )}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                  </ItemActions>
                </Item>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
