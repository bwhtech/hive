import { useState, useMemo } from "react"
import { useFrappeGetCall } from "frappe-react-sdk"
import { Link } from "react-router"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroup03Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { MemberAvatar } from "@/components/MemberAvatar"
import { TASK_PRIORITY_COLOR } from "@/lib/variants"

interface TaskItem {
  name: string
  title: string
  project: string
  project_title: string
  priority: string
  due_date?: string | null
  completed_on?: string | null
  status?: string
}

interface MemberDetail {
  user: string
  member_name: string
  user_image: string
  designation: string
  completed_tasks: TaskItem[]
  overdue_tasks: TaskItem[]
}

interface ChartDataPoint {
  member_name: string
  user: string
  completed: number
  overdue: number
}

interface TeamStatsResponse {
  chart_data: ChartDataPoint[]
  members: MemberDetail[]
}

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  overdue: {
    label: "Overdue",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function TeamTab() {
  const [period, setPeriod] = useState<"week" | "month">("week")

  const { data, isLoading } = useFrappeGetCall<{ message: TeamStatsResponse }>(
    "bwh_hive.bwh_hive.api.get_team_stats",
    { period },
  )

  const stats = data?.message
  const chartData = stats?.chart_data ?? []

  // Sort members: those with overdue tasks first, then by completed desc
  const sortedMembers = useMemo(() => {
    const members = stats?.members ?? []
    return [...members].sort(
      (a, b) =>
        b.overdue_tasks.length - a.overdue_tasks.length ||
        b.completed_tasks.length - a.completed_tasks.length,
    )
  }, [stats?.members])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!chartData.length) {
    return (
      <Empty className="border rounded-2xl p-12">
        <EmptyHeader>
          <EmptyMedia>
            <HugeiconsIcon
              icon={UserGroup03Icon}
              strokeWidth={1.5}
              className="size-10 text-muted-foreground"
            />
          </EmptyMedia>
          <EmptyTitle>No team members yet</EmptyTitle>
          <EmptyDescription>Add team members from Settings.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chart card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task completions</CardTitle>
            <div className="flex gap-1 rounded-md bg-muted p-0.5">
              <button
                type="button"
                onClick={() => setPeriod("week")}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  period === "week"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setPeriod("month")}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  period === "month"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="member_name"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) =>
                  v.length > 10 ? v.slice(0, 10) + "..." : v
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="completed"
                fill="var(--color-completed)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="overdue"
                fill="var(--color-overdue)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Member detail cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sortedMembers.map((member) => (
          <MemberStatsCard key={member.user} member={member} />
        ))}
      </div>
    </div>
  )
}

function MemberStatsCard({ member }: { member: MemberDetail }) {
  const hasOverdue = member.overdue_tasks.length > 0
  const hasCompleted = member.completed_tasks.length > 0

  return (
    <Card className={hasOverdue ? "border-red-500/20" : ""}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <MemberAvatar
            name={member.member_name}
            image={member.user_image}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">
              {member.member_name}
            </p>
            {member.designation && (
              <p className="text-xs text-muted-foreground truncate">
                {member.designation}
              </p>
            )}
          </div>
          <div className="flex gap-2 text-xs shrink-0">
            {hasOverdue && (
              <Badge variant="destructive" className="text-[10px]">
                {member.overdue_tasks.length} overdue
              </Badge>
            )}
            {hasCompleted && (
              <Badge variant="secondary" className="text-[10px]">
                {member.completed_tasks.length} done
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overdue tasks */}
        {hasOverdue && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                strokeWidth={2}
                className="size-3.5 text-destructive"
              />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-destructive">
                Overdue ({member.overdue_tasks.length})
              </p>
            </div>
            <div className="space-y-1">
              {member.overdue_tasks.slice(0, 5).map((task) => (
                <Link
                  key={task.name}
                  to={`/projects/${task.project}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors"
                >
                  <span
                    className={`text-[10px] font-medium shrink-0 ${TASK_PRIORITY_COLOR[task.priority] ?? "text-muted-foreground"}`}
                  >
                    {task.priority?.[0]}
                  </span>
                  <span className="text-sm truncate flex-1">{task.title}</span>
                  {task.due_date && (
                    <span className="text-[10px] text-destructive/70 shrink-0">
                      {task.due_date}
                    </span>
                  )}
                </Link>
              ))}
              {member.overdue_tasks.length > 5 && (
                <p className="text-xs text-muted-foreground px-2">
                  +{member.overdue_tasks.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Completed tasks */}
        {hasCompleted && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                strokeWidth={2}
                className="size-3.5 text-green-500"
              />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Completed ({member.completed_tasks.length})
              </p>
            </div>
            <div className="space-y-1">
              {member.completed_tasks.slice(0, 5).map((task) => (
                <Link
                  key={task.name}
                  to={`/projects/${task.project}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm truncate flex-1 text-muted-foreground line-through decoration-muted-foreground/30">
                    {task.title}
                  </span>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {task.project_title}
                  </Badge>
                </Link>
              ))}
              {member.completed_tasks.length > 5 && (
                <p className="text-xs text-muted-foreground px-2">
                  +{member.completed_tasks.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* No tasks */}
        {!hasOverdue && !hasCompleted && (
          <p className="text-xs text-muted-foreground text-center py-2">
            No overdue or completed tasks
          </p>
        )}
      </CardContent>
    </Card>
  )
}
