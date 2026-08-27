import { useMemo, useState } from "react"
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TASK_STATUS_COLOR, TASK_PRIORITY_VARIANT } from "@/lib/variants"
import type { HiveTask } from "@/types"

type CalendarMode = "month" | "week" | "day"

interface TaskCalendarProps {
  tasks: HiveTask[]
  onTaskClick: (task: HiveTask) => void
  /** How many task chips to show per day in month view before "+N more". */
  maxPerDay?: number
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MODES: CalendarMode[] = ["month", "week", "day"]

/**
 * Task calendar with Month / Week / Day modes. Tasks are laid out on their due
 * date; tasks without a due date are surfaced in a tray beneath the grid so
 * they aren't silently hidden.
 */
export function TaskCalendar({ tasks, onTaskClick, maxPerDay = 3 }: TaskCalendarProps) {
  const [mode, setMode] = useState<CalendarMode>("month")
  const [cursor, setCursor] = useState<Date>(() => new Date())

  const { tasksByDay, undated } = useMemo(() => {
    const byDay = new Map<string, HiveTask[]>()
    const noDate: HiveTask[] = []
    for (const task of tasks) {
      if (!task.due_date) {
        noDate.push(task)
        continue
      }
      const key = task.due_date.slice(0, 10)
      const list = byDay.get(key)
      if (list) list.push(task)
      else byDay.set(key, [task])
    }
    return { tasksByDay: byDay, undated: noDate }
  }, [tasks])

  const dayTasks = (day: Date) => tasksByDay.get(format(day, "yyyy-MM-dd")) ?? []

  const goToday = () => setCursor(new Date())
  const goPrev = () =>
    setCursor((c) => (mode === "month" ? subMonths(c, 1) : mode === "week" ? subWeeks(c, 1) : subDays(c, 1)))
  const goNext = () =>
    setCursor((c) => (mode === "month" ? addMonths(c, 1) : mode === "week" ? addWeeks(c, 1) : addDays(c, 1)))

  const title =
    mode === "month"
      ? format(cursor, "MMMM yyyy")
      : mode === "week"
        ? `${format(startOfWeek(cursor), "MMM d")} – ${format(endOfWeek(cursor), "MMM d, yyyy")}`
        : format(cursor, "EEEE, MMM d, yyyy")

  const monthDays = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(startOfMonth(cursor)), end: endOfWeek(endOfMonth(cursor)) }),
    [cursor],
  )
  const weekDays = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(cursor), end: endOfWeek(cursor) }),
    [cursor],
  )

  const chip = (task: HiveTask) => (
    <button
      key={task.name}
      type="button"
      onClick={() => onTaskClick(task)}
      title={task.title}
      className="flex w-full items-center gap-1.5 rounded bg-card px-1.5 py-1 text-left text-xs shadow-sm ring-1 ring-border transition-colors hover:bg-accent"
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40")} />
      <span className="truncate">{task.title}</span>
    </button>
  )

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border p-0.5">
            {MODES.map((m) => (
              <Button
                key={m}
                variant={mode === m ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 capitalize"
                onClick={() => setMode(m)}
              >
                {m}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Previous" onClick={goPrev}>
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Next" onClick={goNext}>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </div>
      </div>

      {/* Month view */}
      {mode === "month" && (
        <div className="overflow-hidden rounded-md border">
          <div className="grid grid-cols-7 border-b bg-muted/40">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map((day) => {
              const list = dayTasks(day)
              const inMonth = isSameMonth(day, cursor)
              return (
                <div
                  key={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "min-h-[104px] border-b border-r p-1.5 last:border-r-0 [&:nth-child(7n)]:border-r-0",
                    !inMonth && "bg-muted/20 text-muted-foreground",
                  )}
                >
                  <div className="mb-1 flex justify-end">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs",
                        isToday(day) && "bg-primary font-semibold text-primary-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {list.slice(0, maxPerDay).map(chip)}
                    {list.length > maxPerDay && (
                      <div className="px-1.5 text-[11px] text-muted-foreground">+{list.length - maxPerDay} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Week view */}
      {mode === "week" && (
        <div className="overflow-hidden rounded-md border">
          <div className="grid grid-cols-7">
            {weekDays.map((day) => (
              <div key={format(day, "yyyy-MM-dd")} className="border-r p-2 last:border-r-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{format(day, "EEE")}</span>
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs",
                      isToday(day) && "bg-primary font-semibold text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="max-h-[440px] space-y-1 overflow-y-auto">
                  {dayTasks(day).length === 0 ? (
                    <p className="px-1 text-[11px] text-muted-foreground/60">—</p>
                  ) : (
                    dayTasks(day).map(chip)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day view */}
      {mode === "day" && (
        <div className="rounded-md border">
          <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-2">
            <span className="text-sm font-medium">{format(cursor, "EEEE")}</span>
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-sm",
                isToday(cursor) && "bg-primary font-semibold text-primary-foreground",
              )}
            >
              {format(cursor, "d")}
            </span>
          </div>
          <div className="divide-y">
            {dayTasks(cursor).length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">No tasks due on this day.</p>
            ) : (
              dayTasks(cursor).map((task) => (
                <button
                  key={task.name}
                  type="button"
                  onClick={() => onTaskClick(task)}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  <span className={cn("size-2 shrink-0 rounded-full", TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40")} />
                  <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{task.status}</span>
                  {task.priority && (
                    <Badge variant={TASK_PRIORITY_VARIANT[task.priority] ?? "outline"} className="shrink-0">
                      {task.priority}
                    </Badge>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tasks with no due date */}
      {undated.length > 0 && (
        <div className="rounded-md border p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">No due date ({undated.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {undated.map((task) => (
              <button
                key={task.name}
                type="button"
                onClick={() => onTaskClick(task)}
                title={task.title}
                className="flex max-w-[220px] items-center gap-1.5 rounded bg-card px-2 py-1 text-xs shadow-sm ring-1 ring-border transition-colors hover:bg-accent"
              >
                <span className={cn("size-1.5 shrink-0 rounded-full", TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40")} />
                <span className="truncate">{task.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
