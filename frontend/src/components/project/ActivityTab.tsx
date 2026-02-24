import { useFrappePostCall } from "frappe-react-sdk"
import { useEffect, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PencilEdit01Icon,
  Task01Icon,
  Target02Icon,
  Add01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { MemberAvatar } from "@/components/MemberAvatar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  type: string
  doctype: string
  docname: string
  label: string
  field?: string
  old_value?: string
  new_value?: string
  user: string
  user_name: string
  user_image?: string | null
  datetime: string
}

// Group activities by date
function groupByDate(activities: ActivityItem[]): Map<string, ActivityItem[]> {
  const groups = new Map<string, ActivityItem[]>()
  for (const a of activities) {
    const date = a.datetime.split(" ")[0] // "2026-02-24"
    if (!groups.has(date)) groups.set(date, [])
    groups.get(date)!.push(a)
  }
  return groups
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.getTime() === today.getTime()) return "Today"
  if (date.getTime() === yesterday.getTime()) return "Yesterday"

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function formatTime(datetimeStr: string): string {
  const date = new Date(datetimeStr.replace(" ", "T"))
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

const FIELD_LABELS: Record<string, string> = {
  status: "status",
  priority: "priority",
  title: "title",
  milestone: "milestone",
  assigned_to: "assignee",
  due_date: "due date",
  start_date: "start date",
  completed_on: "completed date",
  size: "size",
  uat_status: "UAT status",
  project_type: "type",
  client: "client",
  description: "description",
}

function getIcon(type: string) {
  switch (type) {
    case "project_changed":
      return PencilEdit01Icon
    case "task_created":
      return Add01Icon
    case "task_changed":
      return Task01Icon
    case "milestone_created":
      return Target02Icon
    case "milestone_changed":
      return Target02Icon
    default:
      return PencilEdit01Icon
  }
}

function getIconClasses(type: string) {
  switch (type) {
    case "project_changed":
      return "text-blue-500 bg-blue-500/15"
    case "task_created":
      return "text-green-500 bg-green-500/15"
    case "task_changed":
      return "text-amber-500 bg-amber-500/15"
    case "milestone_created":
      return "text-purple-500 bg-purple-500/15"
    case "milestone_changed":
      return "text-purple-500 bg-purple-500/15"
    default:
      return "text-muted-foreground bg-muted"
  }
}

function ActivityDescription({ activity }: { activity: ActivityItem }) {
  const { type, label, field, old_value, new_value } = activity

  if (type === "task_created") {
    return (
      <span>
        created task <span className="font-medium">{label}</span>
      </span>
    )
  }

  if (type === "milestone_created") {
    return (
      <span>
        created milestone <span className="font-medium">{label}</span>
      </span>
    )
  }

  if (type === "task_changed" || type === "project_changed" || type === "milestone_changed") {
    const fieldLabel = FIELD_LABELS[field ?? ""] ?? field
    const docLabel = type === "project_changed" ? "project" : type === "milestone_changed" ? "milestone" : "task"

    return (
      <span>
        changed {fieldLabel} on {docLabel}{" "}
        <span className="font-medium">{label}</span>
        {old_value && new_value && (
          <span className="ml-1 inline-flex items-center gap-1 text-muted-foreground">
            <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-normal">
              {String(old_value).substring(0, 30)}
            </Badge>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" strokeWidth={2} />
            <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-normal">
              {String(new_value).substring(0, 30)}
            </Badge>
          </span>
        )}
      </span>
    )
  }

  return <span>{type}</span>
}

function ActivityEntry({ activity }: { activity: ActivityItem }) {
  const icon = getIcon(activity.type)
  const iconClasses = getIconClasses(activity.type)

  return (
    <div className="flex gap-3 py-2">
      <div className={`mt-0.5 flex-shrink-0 rounded-full p-1.5 ${iconClasses}`}>
        <HugeiconsIcon icon={icon} className="size-3.5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <MemberAvatar name={activity.user_name} image={activity.user_image} size="sm" />
          <p className="text-sm leading-snug">
            <span className="font-medium">{activity.user_name}</span>{" "}
            <ActivityDescription activity={activity} />
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 ml-7">
          {formatTime(activity.datetime)}
        </p>
      </div>
    </div>
  )
}

function DateGroup({ date, activities }: { date: string; activities: ActivityItem[] }) {
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-left group cursor-pointer">
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-0 -rotate-90"
          strokeWidth={2}
        />
        <span className="text-sm font-medium">{formatDate(date)}</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
          {activities.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-2 border-l border-border pl-4 space-y-0.5">
          {activities.map((activity, i) => (
            <ActivityEntry key={`${activity.docname}-${activity.datetime}-${i}`} activity={activity} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function ActivityTab({ projectId }: { projectId: string }) {
  const { call, result, loading } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.get_project_activity",
  )

  useEffect(() => {
    call({ project: projectId, limit: 100 }).catch(() => {})
  }, [projectId, call])

  const activities = (result?.message ?? []) as ActivityItem[]

  const grouped = useMemo(() => groupByDate(activities), [activities])

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">No activity yet for this project.</p>
      </div>
    )
  }

  return (
    <div className="space-y-1 pt-2">
      {Array.from(grouped.entries()).map(([date, items]) => (
        <DateGroup key={date} date={date} activities={items} />
      ))}
    </div>
  )
}
