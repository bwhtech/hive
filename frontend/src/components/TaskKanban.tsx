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
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TASK_STATUSES, type HiveTask } from "@/types"

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Low: "outline",
  Medium: "secondary",
  High: "default",
  Urgent: "destructive",
}

interface TaskKanbanProps {
  tasksByStatus: Record<string, HiveTask[]>
  onStatusChange: (taskName: string, newStatus: string) => void
}

export function TaskKanban({ tasksByStatus, onStatusChange }: TaskKanbanProps) {
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

    // Only fire if dropped on a column (not another card)
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
      <div className="grid grid-cols-4 gap-4">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status] ?? []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumn({ status, tasks }: { status: string; tasks: HiveTask[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-2 rounded-xl border border-dashed p-3 transition-colors ${
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
          <DraggableTaskCard key={task.name} task={task} />
        ))}
      </div>
    </div>
  )
}

function DraggableTaskCard({ task }: { task: HiveTask }) {
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
      className={isDragging ? "opacity-30" : ""}
    >
      <TaskCard task={task} />
    </div>
  )
}

function TaskCard({ task, isDragOverlay }: { task: HiveTask; isDragOverlay?: boolean }) {
  return (
    <Card
      size="sm"
      className={`cursor-grab active:cursor-grabbing ${isDragOverlay ? "rotate-2 shadow-lg" : ""}`}
    >
      <CardHeader className="gap-1.5">
        <CardTitle className="text-sm leading-snug">{task.title}</CardTitle>
        <div className="flex items-center gap-1.5">
          <Badge variant={priorityVariant[task.priority] ?? "outline"} className="text-[10px] h-4 px-1.5">
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}
