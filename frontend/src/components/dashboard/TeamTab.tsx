import { useMemo } from "react"
import { useFrappeGetDocList, useFrappeGetCall } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserGroup03Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MemberAvatar } from "@/components/MemberAvatar"
import type { HiveMember, HiveProject, HiveTask } from "@/types"

export function TeamTab() {
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

  // Fetch user images from User docs (Hive Member's fetch_from may be stale)
  const { data: userDocs } = useFrappeGetDocList<{ name: string; user_image: string }>("User", {
    fields: ["name", "user_image"],
    filters: [["enabled", "=", 1]],
    limit: 200,
  })
  const userImageMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const u of userDocs ?? []) {
      if (u.user_image) map[u.name] = u.user_image
    }
    return map
  }, [userDocs])

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
                  <MemberAvatar name={member.member_name} image={userImageMap[member.user] ?? member.user_image} />
                  {isStale && (
                    <Tooltip>
                      <TooltipTrigger render={<span className="absolute -right-0.5 -top-0.5 flex size-3.5" />}>
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex size-3.5 rounded-full bg-red-500" />
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
