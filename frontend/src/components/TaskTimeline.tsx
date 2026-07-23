import { useMemo } from "react"
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isToday,
  max as maxDate,
  min as minDate,
  startOfDay,
} from "date-fns"
import { cn } from "@/lib/utils"
import { TASK_STATUS_COLOR } from "@/lib/variants"
import type { HiveTask } from "@/types"

interface TaskTimelineProps {
  tasks: HiveTask[]
  /** Map of project name → display title, for group headers. */
  projectTitles: Record<string, string>
  onTaskClick: (task: HiveTask) => void
}

const COL_W = 34 // px per day column
const LABEL_W = 220 // px sticky task-label column

/**
 * Parse a Frappe date-only value ("yyyy-MM-dd") as *local* midnight.
 * `new Date("2024-01-15")` is parsed as UTC midnight, which lands on the
 * previous day for anyone west of UTC — appending a time forces local parsing.
 */
function parseLocalDate(value: string): Date {
  return startOfDay(new Date(`${value.slice(0, 10)}T00:00:00`))
}

/** Resolve a task's [start, end] range from start_date / due_date (either may be missing). */
function taskRange(t: HiveTask): [Date, Date] | null {
  const s = t.start_date ? parseLocalDate(t.start_date) : null
  const d = t.due_date ? parseLocalDate(t.due_date) : null
  const start = s ?? d
  const end = d ?? s
  if (!start || !end) return null
  return start.getTime() <= end.getTime() ? [start, end] : [end, start]
}

/**
 * Gantt-style timeline: each task is a horizontal bar spanning its start_date →
 * due_date on a scrollable day axis, grouped by project. Tasks with no dates are
 * listed in an "Unscheduled" tray so none are hidden.
 */
export function TaskTimeline({ tasks, projectTitles, onTaskClick }: TaskTimelineProps) {
  const { days, groups, unscheduled, rangeStart } = useMemo(() => {
    const scheduled: { task: HiveTask; start: Date; end: Date }[] = []
    const noDates: HiveTask[] = []
    for (const t of tasks) {
      const r = taskRange(t)
      if (!r) {
        noDates.push(t)
        continue
      }
      scheduled.push({ task: t, start: r[0], end: r[1] })
    }
    if (scheduled.length === 0) {
      return { days: [] as Date[], groups: [], unscheduled: noDates, rangeStart: startOfDay(new Date()) }
    }
    const rStart = minDate(scheduled.map((s) => s.start))
    const rEnd = maxDate(scheduled.map((s) => s.end))
    const allDays = eachDayOfInterval({ start: rStart, end: rEnd })
    const byProject = new Map<string, { task: HiveTask; start: Date; end: Date }[]>()
    for (const s of scheduled) {
      const arr = byProject.get(s.task.project) ?? []
      arr.push(s)
      byProject.set(s.task.project, arr)
    }
    const grouped = [...byProject.entries()]
      .map(([project, items]) => ({
        project,
        title: projectTitles[project] ?? project,
        items: items.sort((a, b) => a.start.getTime() - b.start.getTime()),
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
    return { days: allDays, groups: grouped, unscheduled: noDates, rangeStart: rStart }
  }, [tasks, projectTitles])

  if (days.length === 0 && unscheduled.length === 0) {
    return (
      <div className="rounded-md border p-12 text-center text-sm text-muted-foreground">
        No tasks to show.
      </div>
    )
  }

  const gridW = days.length * COL_W
  const offset = (d: Date) => differenceInCalendarDays(d, rangeStart)

  return (
    <div className="space-y-3">
      {days.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <div style={{ width: LABEL_W + gridW }}>
            {/* Header: day axis */}
            <div className="flex border-b bg-muted/40">
              <div className="sticky left-0 z-20 shrink-0 border-r bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground" style={{ width: LABEL_W }}>
                Task
              </div>
              {days.map((d) => (
                <div
                  key={d.toISOString()}
                  className={cn(
                    "shrink-0 border-r py-1 text-center text-[11px] leading-tight",
                    isToday(d) && "bg-primary/10 font-semibold text-primary",
                  )}
                  style={{ width: COL_W }}
                >
                  <div className="text-muted-foreground">{format(d, "EEEEE")}</div>
                  <div>{format(d, "d")}</div>
                </div>
              ))}
            </div>

            {/* Project groups */}
            {groups.map((g) => (
              <div key={g.project}>
                <div className="flex border-b bg-muted/20">
                  <div className="sticky left-0 z-10 shrink-0 bg-muted/20 px-3 py-1 text-xs font-semibold" style={{ width: LABEL_W }}>
                    {g.title}
                  </div>
                  <div style={{ width: gridW }} />
                </div>
                {g.items.map(({ task, start, end }) => {
                  const left = offset(start) * COL_W
                  const width = (offset(end) - offset(start) + 1) * COL_W
                  return (
                    <div key={task.name} className="flex border-b last:border-b-0">
                      <div className="sticky left-0 z-10 flex shrink-0 items-center border-r bg-background px-3 py-1.5 text-xs" style={{ width: LABEL_W }}>
                        <span className="truncate" title={task.title}>{task.title}</span>
                      </div>
                      <div className="relative py-2" style={{ width: gridW }}>
                        <button
                          type="button"
                          onClick={() => onTaskClick(task)}
                          title={`${task.title} · ${format(start, "MMM d")} – ${format(end, "MMM d")}`}
                          className={cn(
                            "absolute top-1/2 flex h-5 -translate-y-1/2 items-center overflow-hidden rounded px-1.5 text-[11px] font-medium text-white shadow-sm transition-opacity hover:opacity-90",
                            TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground",
                          )}
                          style={{ left: left + 2, width: Math.max(width - 4, COL_W - 4) }}
                        >
                          <span className="truncate">{task.title}</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {unscheduled.length > 0 && (
        <div className="rounded-md border p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Unscheduled ({unscheduled.length}) — no start or due date
          </p>
          <div className="flex flex-wrap gap-1.5">
            {unscheduled.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => onTaskClick(t)}
                title={t.title}
                className="flex max-w-[220px] items-center gap-1.5 rounded bg-card px-2 py-1 text-xs shadow-sm ring-1 ring-border transition-colors hover:bg-accent"
              >
                <span className={cn("size-1.5 shrink-0 rounded-full", TASK_STATUS_COLOR[t.status] ?? "bg-muted-foreground/40")} />
                <span className="truncate">{t.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
