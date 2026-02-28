import { useState, useMemo, memo, createContext, use } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { useDroppable } from "@dnd-kit/core"
import { useDraggable } from "@dnd-kit/core"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, GitBranchIcon, LinkBackwardIcon, PinIcon, PinOffIcon } from "@hugeicons/core-free-icons"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { MemberAvatar } from "@/components/MemberAvatar"
import { TASK_STATUSES, type HiveTask, type HiveTaskAssignee } from "@/types"
import { TASK_PRIORITY_VARIANT, TASK_SIZE_VARIANT } from "@/lib/variants"

// Lifted state: eliminates hasClient / taskMap / onTaskClick prop drilling
// through KanbanColumn → DraggableTaskCard → TaskCard (4 levels)
interface KanbanContextValue {
  hasClient: boolean
  taskMap: Record<string, HiveTask>
  onTaskClick?: (task: HiveTask) => void
  pinnedTaskNames?: string[]
  onTogglePin?: (taskName: string) => void
}

const KanbanContext = createContext<KanbanContextValue>({
  hasClient: true,
  taskMap: {},
})

interface TaskKanbanProps {
  tasksByStatus: Record<string, HiveTask[]>
  onStatusChange: (taskName: string, newStatus: string) => void | Promise<void>
  onTaskClick?: (task: HiveTask) => void
  assigneesByTask?: Record<string, HiveTaskAssignee[]>
  hasClient?: boolean
  pinnedTaskNames?: string[]
  onTogglePin?: (taskName: string) => void
}

export function TaskKanban({ tasksByStatus, onStatusChange, onTaskClick, assigneesByTask, hasClient = true, pinnedTaskNames, onTogglePin }: TaskKanbanProps) {
  const [activeTask, setActiveTask] = useState<HiveTask | null>(null)
  const [pendingMoves, setPendingMoves] = useState<Record<string, string>>({})

  // Apply pending moves on top of prop data for instant visual feedback
  const effectiveTasksByStatus = useMemo(() => {
    if (Object.keys(pendingMoves).length === 0) return tasksByStatus

    const result: Record<string, HiveTask[]> = {}
    for (const status of TASK_STATUSES) {
      result[status] = []
    }
    for (const [status, tasks] of Object.entries(tasksByStatus)) {
      for (const task of tasks) {
        const effectiveStatus = pendingMoves[task.name] ?? status
        if (result[effectiveStatus]) {
          result[effectiveStatus].push(
            pendingMoves[task.name]
              ? { ...task, status: effectiveStatus as HiveTask["status"] }
              : task
          )
        }
      }
    }
    return result
  }, [tasksByStatus, pendingMoves])

  const taskMap = useMemo(() => {
    const map: Record<string, HiveTask> = {}
    for (const tasks of Object.values(effectiveTasksByStatus)) {
      for (const t of tasks) {
        map[t.name] = t
      }
    }
    return map
  }, [effectiveTasksByStatus])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = taskMap[String(event.active.id)]
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const taskName = String(active.id)
    const newStatus = String(over.id)

    if (TASK_STATUSES.includes(newStatus as typeof TASK_STATUSES[number])) {
      const task = taskMap[taskName]
      if (task && task.status !== newStatus) {
        // Instant visual update — card appears in new column immediately
        setPendingMoves(prev => ({ ...prev, [taskName]: newStatus }))

        // Fire API call; clear pending on completion (SWR handles cache)
        Promise.resolve(onStatusChange(taskName, newStatus)).finally(() => {
          setPendingMoves(prev => {
            const { [taskName]: _, ...rest } = prev
            return rest
          })
        })
      }
    }
  }

  const handleDragOver = (_event: DragOverEvent) => {
    // Could be used for live reorder within columns later
  }

  const kanbanCtx = useMemo<KanbanContextValue>(
    () => ({ hasClient, taskMap, onTaskClick, pinnedTaskNames, onTogglePin }),
    [hasClient, taskMap, onTaskClick, pinnedTaskNames, onTogglePin],
  )

  return (
    <KanbanContext value={kanbanCtx}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {TASK_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={effectiveTasksByStatus[status] ?? []}
              assigneesByTask={assigneesByTask}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCard task={activeTask} isDragOverlay assignees={assigneesByTask?.[activeTask.name]} /> : null}
        </DragOverlay>
      </DndContext>
    </KanbanContext>
  )
}

const KanbanColumn = memo(function KanbanColumn({
  status,
  tasks,
  assigneesByTask,
}: {
  status: string
  tasks: HiveTask[]
  assigneesByTask?: Record<string, HiveTaskAssignee[]>
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const { pinnedTaskNames } = use(KanbanContext)

  // Float pinned tasks to the top of each column
  const sortedTasks = useMemo(() => {
    if (!pinnedTaskNames?.length) return tasks
    const pinnedSet = new Set(pinnedTaskNames)
    const pinned: HiveTask[] = []
    const rest: HiveTask[] = []
    for (const task of tasks) {
      if (pinnedSet.has(task.name)) pinned.push(task)
      else rest.push(task)
    }
    return pinned.length ? [...pinned, ...rest] : tasks
  }, [tasks, pinnedTaskNames])

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[220px] flex-col gap-2 rounded-xl border border-dashed p-3 transition-colors md:min-w-0 ${
        isOver ? "border-primary bg-primary/5" : "border-transparent bg-muted/40"
      }`}
    >
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {status}
        </span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
          {tasks.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-2 min-h-[60px]">
        {sortedTasks.map((task) => (
          <DraggableTaskCard key={task.name} task={task} assignees={assigneesByTask?.[task.name]} />
        ))}
      </div>
    </div>
  )
})

function DraggableTaskCard({
  task,
  assignees,
}: {
  task: HiveTask
  assignees?: HiveTaskAssignee[]
}) {
  const { onTaskClick } = use(KanbanContext)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.name,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`[content-visibility:auto] [contain-intrinsic-size:auto_120px] ${isDragging ? "opacity-0" : ""}`}
      onClick={() => onTaskClick?.(task)}
    >
      <TaskCard task={task} assignees={assignees} />
    </div>
  )
}

const TaskCard = memo(function TaskCard({ task, isDragOverlay, assignees }: { task: HiveTask; isDragOverlay?: boolean; assignees?: HiveTaskAssignee[] }) {
  const { hasClient, taskMap, pinnedTaskNames, onTogglePin } = use(KanbanContext)
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "Done"
  const isPinned = pinnedTaskNames?.includes(task.name) ?? false

  // Use new assignees if available, fall back to legacy assigned_to
  const hasAssignees = assignees && assignees.length > 0
  const legacyInitials = !hasAssignees && task.assigned_to
    ? task.assigned_to.split("@")[0].slice(0, 2).toUpperCase()
    : null

  return (
    <Card
      size="sm"
      className={`group/card cursor-grab active:cursor-grabbing ${isDragOverlay ? "rotate-2 shadow-lg" : ""} ${isPinned ? "ring-1 ring-primary/30 bg-primary/[0.03]" : ""}`}
    >
      <CardHeader className="gap-2">
        <div className="flex items-start gap-1">
          <CardTitle className="text-sm leading-snug flex-1 min-w-0">{task.title}</CardTitle>
          {onTogglePin && (
            <button
              type="button"
              aria-label={isPinned ? "Unpin task" : "Pin task"}
              className={`shrink-0 p-0.5 rounded transition-opacity ${
                isPinned
                  ? "opacity-100 text-foreground"
                  : "opacity-0 group-hover/card:opacity-100 text-muted-foreground hover:text-foreground"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onTogglePin(task.name)
              }}
            >
              <HugeiconsIcon icon={isPinned ? PinOffIcon : PinIcon} strokeWidth={2} className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={TASK_PRIORITY_VARIANT[task.priority] ?? "outline"} className="text-[10px] h-4 px-1.5">
            {task.priority}
          </Badge>
          {task.size && (
            <Badge variant={TASK_SIZE_VARIANT[task.size] ?? "outline"} className="text-[10px] h-4 px-1.5">
              {task.size}
            </Badge>
          )}
          {task.pr_link && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5 gap-0.5">
              <HugeiconsIcon icon={GitBranchIcon} strokeWidth={2} className="size-2.5" />
              PR
            </Badge>
          )}
          {hasClient && task.uat_status && task.uat_status !== "Pending" && (
            <Badge
              variant={task.uat_status === "Approved" ? "default" : "destructive"}
              className="text-[10px] h-4 px-1.5"
            >
              UAT {task.uat_status}
            </Badge>
          )}
        </div>
        {task.depends_on && taskMap?.[task.depends_on] && (
          <div
            className={`flex items-center gap-1 text-[11px] ${
              taskMap[task.depends_on].status !== "Done"
                ? "text-amber-600 dark:text-amber-500"
                : "text-muted-foreground"
            }`}
          >
            <HugeiconsIcon icon={LinkBackwardIcon} strokeWidth={2} className="size-3 shrink-0" />
            <span className="truncate">
              {taskMap[task.depends_on].status !== "Done" ? "Blocked by" : "Depends on"}{" "}
              {taskMap[task.depends_on].title}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1.5">
            {task.due_date && (
              <span
                className={`flex items-center gap-1 text-[11px] ${
                  isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                }`}
              >
                <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3" />
                {format(new Date(task.due_date), "MMM d")}
              </span>
            )}
          </div>
          {hasAssignees ? (
            <AvatarGroup>
              {assignees.slice(0, 3).map((a) => (
                <MemberAvatar key={a.member} size="sm" name={a.member_name || a.member} image={a.user_image} />
              ))}
              {assignees.length > 3 && (
                <AvatarGroupCount className="text-[10px]">
                  +{assignees.length - 3}
                </AvatarGroupCount>
              )}
            </AvatarGroup>
          ) : legacyInitials ? (
            <MemberAvatar size="sm" name={legacyInitials} />
          ) : null}
        </div>
      </CardHeader>
    </Card>
  )
})
