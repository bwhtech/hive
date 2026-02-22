import { useState } from "react"
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
import { Calendar03Icon, GitBranchIcon } from "@hugeicons/core-free-icons"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { MemberAvatar } from "@/components/MemberAvatar"
import { TASK_STATUSES, type HiveTask, type HiveTaskAssignee } from "@/types"
import { TASK_PRIORITY_VARIANT } from "@/lib/variants"

interface TaskKanbanProps {
  tasksByStatus: Record<string, HiveTask[]>
  onStatusChange: (taskName: string, newStatus: string) => void
  onTaskClick?: (task: HiveTask) => void
  assigneesByTask?: Record<string, HiveTaskAssignee[]>
}

export function TaskKanban({ tasksByStatus, onStatusChange, onTaskClick, assigneesByTask }: TaskKanbanProps) {
  const [activeTask, setActiveTask] = useState<HiveTask | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = findTask(String(event.active.id))
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskName = String(active.id)
    const newStatus = String(over.id)

    if (TASK_STATUSES.includes(newStatus as typeof TASK_STATUSES[number])) {
      const task = findTask(taskName)
      if (task && task.status !== newStatus) {
        onStatusChange(taskName, newStatus)
      }
    }
  }

  const handleDragOver = (_event: DragOverEvent) => {
    // Could be used for live reorder within columns later
  }

  const findTask = (id: string): HiveTask | undefined => {
    for (const tasks of Object.values(tasksByStatus)) {
      const found = tasks.find((t) => t.name === id)
      if (found) return found
    }
    return undefined
  }

  return (
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
            tasks={tasksByStatus[status] ?? []}
            onTaskClick={onTaskClick}
            assigneesByTask={assigneesByTask}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCard task={activeTask} isDragOverlay assignees={assigneesByTask?.[activeTask.name]} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumn({
  status,
  tasks,
  onTaskClick,
  assigneesByTask,
}: {
  status: string
  tasks: HiveTask[]
  onTaskClick?: (task: HiveTask) => void
  assigneesByTask?: Record<string, HiveTaskAssignee[]>
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

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
        {tasks.map((task) => (
          <DraggableTaskCard key={task.name} task={task} onTaskClick={onTaskClick} assignees={assigneesByTask?.[task.name]} />
        ))}
      </div>
    </div>
  )
}

function DraggableTaskCard({
  task,
  onTaskClick,
  assignees,
}: {
  task: HiveTask
  onTaskClick?: (task: HiveTask) => void
  assignees?: HiveTaskAssignee[]
}) {
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
      className={isDragging ? "opacity-0" : ""}
      onClick={() => onTaskClick?.(task)}
    >
      <TaskCard task={task} assignees={assignees} />
    </div>
  )
}

function TaskCard({ task, isDragOverlay, assignees }: { task: HiveTask; isDragOverlay?: boolean; assignees?: HiveTaskAssignee[] }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "Done"

  // Use new assignees if available, fall back to legacy assigned_to
  const hasAssignees = assignees && assignees.length > 0
  const legacyInitials = !hasAssignees && task.assigned_to
    ? task.assigned_to.split("@")[0].slice(0, 2).toUpperCase()
    : null

  return (
    <Card
      size="sm"
      className={`cursor-grab active:cursor-grabbing ${isDragOverlay ? "rotate-2 shadow-lg" : ""}`}
    >
      <CardHeader className="gap-2">
        <CardTitle className="text-sm leading-snug">{task.title}</CardTitle>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={TASK_PRIORITY_VARIANT[task.priority] ?? "outline"} className="text-[10px] h-4 px-1.5">
            {task.priority}
          </Badge>
          {task.pr_link && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5 gap-0.5">
              <HugeiconsIcon icon={GitBranchIcon} strokeWidth={2} className="size-2.5" />
              PR
            </Badge>
          )}
          {task.uat_status && task.uat_status !== "Pending" && (
            <Badge
              variant={task.uat_status === "Approved" ? "default" : "destructive"}
              className="text-[10px] h-4 px-1.5"
            >
              UAT {task.uat_status}
            </Badge>
          )}
        </div>
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
}
