import { useState, useMemo } from "react"
import { useFrappeGetCall, useFrappePostCall } from "frappe-react-sdk"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroup03Icon,
  Search01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { MemberAvatar } from "@/components/MemberAvatar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Link } from "react-router"
import { TASK_STATUS_COLOR } from "@/lib/variants"

interface TeamMemberStats {
  user: string
  member_name: string
  user_image: string
  designation: string
  wip_count: number
  backlog_count: number
  blocked_count: number
  trend: "increasing" | "decreasing" | "stable"
  completed_7d: number
  created_7d: number
}

interface MemberTask {
  name: string
  title: string
  project: string
  project_title: string
  status: string
  priority: string
  due_date: string | null
}

interface MemberTasksResponse {
  wip: MemberTask[]
  backlog: MemberTask[]
  blocked: MemberTask[]
}

function MemberCard({
  member,
  isStale,
}: {
  member: TeamMemberStats
  isStale: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [groupBy, setGroupBy] = useState<"status" | "project">("status")
  const { call, result, loading } = useFrappePostCall<{
    message: MemberTasksResponse
  }>("bwh_hive.bwh_hive.api.get_member_tasks")

  const tasks = result?.message

  // Group tasks by project
  const tasksByProject = useMemo(() => {
    if (!tasks) return []
    const allTasks = [...tasks.wip, ...tasks.backlog, ...tasks.blocked]
    const grouped: Record<string, { project: string; project_title: string; tasks: MemberTask[] }> = {}
    for (const task of allTasks) {
      if (!grouped[task.project]) {
        grouped[task.project] = { project: task.project, project_title: task.project_title, tasks: [] }
      }
      grouped[task.project].tasks.push(task)
    }
    return Object.values(grouped).sort((a, b) => b.tasks.length - a.tasks.length)
  }, [tasks])

  function handleToggle(open: boolean) {
    setExpanded(open)
    if (open && !result && !loading) {
      call({ user: member.user })
    }
  }

  return (
    <Collapsible open={expanded} onOpenChange={handleToggle}>
      <Card className={isStale ? "border-red-500/40" : ""}>
        <CardContent className="pt-6">
          <CollapsibleTrigger className="w-full text-left cursor-pointer">
            {/* Member identity */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <MemberAvatar name={member.member_name} image={member.user_image} className="size-12" fallbackClassName="text-sm" />
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
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{member.member_name}</p>
                {member.designation && (
                  <p className="text-xs text-muted-foreground truncate">
                    {member.designation}
                  </p>
                )}
              </div>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </div>

            {/* Task counts */}
            <div className="mt-4 flex divide-x rounded-lg border">
              <div className="flex-1 py-2.5 text-center">
                <p className="text-xl font-semibold">{member.wip_count}</p>
                <p className="text-[11px] text-muted-foreground">Active</p>
              </div>
              <div className="flex-1 py-2.5 text-center">
                <p className="text-xl font-semibold">{member.backlog_count}</p>
                <p className="text-[11px] text-muted-foreground">Backlog</p>
              </div>
              {member.blocked_count > 0 && (
                <div className="flex-1 py-2.5 text-center">
                  <p className="text-xl font-semibold text-destructive">{member.blocked_count}</p>
                  <p className="text-[11px] text-destructive/70">Blocked</p>
                </div>
              )}
            </div>

            {/* Trend indicator */}
            {member.trend !== "stable" && (
              <div className="mt-3 flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={member.trend === "increasing" ? ArrowUp01Icon : ArrowDown01Icon}
                  strokeWidth={2}
                  className={`size-3.5 ${member.trend === "increasing" ? "text-amber-500" : "text-green-500"}`}
                />
                <Tooltip>
                  <TooltipTrigger render={
                    <span className={`text-xs font-medium ${member.trend === "increasing" ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}`}>
                      {member.trend === "increasing" ? "Workload increasing" : "Workload decreasing"}
                    </span>
                  } />
                  <TooltipContent>
                    {member.created_7d} new / {member.completed_7d} completed in 7 days
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="mt-4 border-t pt-4 space-y-3">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : tasks ? (
                <>
                  {/* Group toggle */}
                  <div className="flex gap-1 rounded-md bg-muted p-0.5 w-fit">
                    <button
                      type="button"
                      onClick={() => setGroupBy("status")}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                        groupBy === "status" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      By Status
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupBy("project")}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                        groupBy === "project" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      By Project
                    </button>
                  </div>

                  {groupBy === "status" ? (
                    <>
                      <TaskGroup label="WIP" tasks={tasks.wip} />
                      <TaskGroup label="Backlog" tasks={tasks.backlog} />
                      <TaskGroup label="Blocked" tasks={tasks.blocked} />
                    </>
                  ) : (
                    <>
                      {tasksByProject.map((group) => (
                        <ProjectGroup key={group.project} group={group} />
                      ))}
                    </>
                  )}

                  {tasks.wip.length === 0 && tasks.backlog.length === 0 && tasks.blocked.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No active tasks
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  )
}

function TaskGroup({ label, tasks }: { label: string; tasks: MemberTask[] }) {
  if (tasks.length === 0) return null

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label} ({tasks.length})
      </p>
      <div className="space-y-1">
        {tasks.map((task) => (
          <Link
            key={task.name}
            to={`/projects/${task.project}`}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors"
          >
            <span
              className={`size-1.5 shrink-0 rounded-full ${TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40"}`}
            />
            <span className="text-sm truncate flex-1">{task.title}</span>
            <Badge variant="secondary" className="text-[10px] shrink-0">
              {task.project_title}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ProjectGroup({
  group,
}: {
  group: { project: string; project_title: string; tasks: MemberTask[] }
}) {
  return (
    <div>
      <Link
        to={`/projects/${group.project}`}
        className="flex items-center gap-1.5 mb-1.5 group"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
          {group.project_title} ({group.tasks.length})
        </p>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </Link>
      <div className="space-y-1">
        {group.tasks.map((task) => (
          <div
            key={task.name}
            className="flex items-center gap-2 rounded-md px-2 py-1.5"
          >
            <span
              className={`size-1.5 shrink-0 rounded-full ${TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40"}`}
            />
            <span className="text-sm truncate flex-1">{task.title}</span>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TeamPage() {
  const [search, setSearch] = useState("")

  const { data: teamData, isLoading } = useFrappeGetCall<{
    message: TeamMemberStats[]
  }>("bwh_hive.bwh_hive.api.get_team_dashboard")

  const { data: staleData } = useFrappeGetCall<{ message: string[] }>(
    "bwh_hive.bwh_hive.api.get_stale_members",
  )
  const staleUsers = useMemo(() => new Set(staleData?.message ?? []), [staleData])

  const members = teamData?.message ?? []

  const filteredMembers = useMemo(() => {
    if (!search) return members
    const q = search.toLowerCase()
    return members.filter(
      (m) =>
        (m.member_name ?? "").toLowerCase().includes(q) ||
        (m.designation ?? "").toLowerCase().includes(q) ||
        m.user.toLowerCase().includes(q),
    )
  }, [members, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="mt-1 text-muted-foreground">
          Your team members and their workload.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Team Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <Skeleton className="h-16 flex-1 rounded-lg" />
                  <Skeleton className="h-16 flex-1 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <HugeiconsIcon icon={UserGroup03Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">
            {search ? "No members match your search" : "No team members yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? "Try a different search term." : "Add team members from Settings."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.user}
              member={member}
              isStale={staleUsers.has(member.user)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
