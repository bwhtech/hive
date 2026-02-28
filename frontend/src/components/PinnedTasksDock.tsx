import { useState, useMemo, memo, useCallback, useRef, Fragment } from "react"
import { useFrappeGetDocList } from "frappe-react-sdk"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, PinOffIcon, ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { MemberAvatar } from "@/components/MemberAvatar"
import { TASK_STATUS_COLOR } from "@/lib/variants"
import type { HiveTask, HiveTaskComment, HiveMember } from "@/types"

interface PinnedTasksDockProps {
  pinnedTaskNames: string[]
  tasks: HiveTask[]
  onUnpin: (taskName: string) => void
  onUnpinAll: () => void
}

const MIN_DOCK_HEIGHT = 120
const MAX_DOCK_HEIGHT_RATIO = 0.7
const DEFAULT_DOCK_HEIGHT = 320

export function PinnedTasksDock({ pinnedTaskNames, tasks, onUnpin, onUnpinAll }: PinnedTasksDockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [dockHeight, setDockHeight] = useState(DEFAULT_DOCK_HEIGHT)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const pinnedTasks = useMemo(() => {
    const taskMap = new Map(tasks.map((t) => [t.name, t]))
    return pinnedTaskNames.map((name) => taskMap.get(name)).filter(Boolean) as HiveTask[]
  }, [pinnedTaskNames, tasks])

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    isDragging.current = true
    startY.current = e.clientY
    startHeight.current = dockHeight
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [dockHeight])

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const delta = startY.current - e.clientY
    const maxHeight = window.innerHeight * MAX_DOCK_HEIGHT_RATIO
    setDockHeight(Math.min(maxHeight, Math.max(MIN_DOCK_HEIGHT, startHeight.current + delta)))
  }, [])

  const handleDragEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  if (pinnedTasks.length === 0) return null

  return (
    <div className="sticky bottom-0 z-40 -mx-4 md:-mx-6 -mb-4 md:-mb-6 !mt-0 border-t bg-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-2 duration-200">
      {/* Vertical resize handle */}
      {!isCollapsed && (
        <div
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          className="h-1.5 cursor-row-resize flex items-center justify-center hover:bg-muted/50 transition-colors group"
        >
          <div className="w-8 h-0.5 rounded-full bg-border group-hover:bg-muted-foreground/40 transition-colors" />
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-1.5 border-b bg-muted/30">
        <button
          type="button"
          onClick={() => setIsCollapsed((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={isCollapsed ? ArrowUp01Icon : ArrowDown01Icon} strokeWidth={2} className="size-3" />
          Pinned Tasks ({pinnedTasks.length})
        </button>
        <Button variant="ghost" size="icon-sm" onClick={onUnpinAll} className="text-muted-foreground hover:text-foreground">
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
        </Button>
      </div>
      {!isCollapsed && (
        <ResizablePanelGroup direction="horizontal" style={{ height: dockHeight }}>
          {pinnedTasks.map((task, i) => (
            <Fragment key={task.name}>
              {i > 0 && <ResizableHandle withHandle />}
              <ResizablePanel minSize={15}>
                <PinnedTaskPanel task={task} onUnpin={() => onUnpin(task.name)} />
              </ResizablePanel>
            </Fragment>
          ))}
        </ResizablePanelGroup>
      )}
    </div>
  )
}

const PinnedTaskPanel = memo(function PinnedTaskPanel({
  task,
  onUnpin,
}: {
  task: HiveTask
  onUnpin: () => void
}) {
  const { data: comments } = useFrappeGetDocList<HiveTaskComment>(
    "Hive Task Comment",
    {
      fields: ["name", "task", "posted_by", "content", "creation"],
      filters: [["task", "=", task.name], ["is_archived", "=", 0]],
      orderBy: { field: "creation", order: "asc" },
      limit: 50,
    },
  )

  const { data: members } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: ["name", "user", "member_name", "user_image"],
      filters: [["is_active", "=", 1]],
      limit: 100,
    },
  )

  const memberByEmail = useMemo(() => {
    const map = new Map<string, HiveMember>()
    if (members) {
      for (const m of members) {
        map.set(m.user, m)
      }
    }
    return map
  }, [members])

  return (
    <div className="h-full flex flex-col">
      {/* Panel header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/20 shrink-0">
        <span className={`size-2 rounded-full shrink-0 ${TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40"}`} />
        <span className="text-sm font-medium truncate flex-1">{task.title}</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5 shrink-0">
          {task.status}
        </Badge>
        <Button variant="ghost" size="icon-sm" onClick={onUnpin} className="shrink-0 text-muted-foreground hover:text-foreground">
          <HugeiconsIcon icon={PinOffIcon} strokeWidth={2} className="size-3.5" />
        </Button>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Description */}
          <div>
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Description</h5>
            {task.description ? (
              <div
                className="prose prose-sm max-w-none text-sm [&>p]:my-0.5 break-words"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            ) : (
              <p className="text-sm text-muted-foreground italic">No description</p>
            )}
          </div>

          {/* Comments */}
          <div>
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Comments ({comments?.length ?? 0})
            </h5>
            {comments?.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No comments</p>
            )}
            <div className="space-y-2.5">
              {comments?.map((comment) => {
                const member = memberByEmail.get(comment.posted_by)
                return (
                  <div key={comment.name} className="flex gap-2">
                    <MemberAvatar
                      size="sm"
                      name={member?.member_name || comment.posted_by}
                      image={member?.user_image}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium truncate">
                          {member?.member_name || comment.posted_by}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(comment.creation), { addSuffix: true })}
                        </span>
                      </div>
                      <div
                        className="prose prose-sm max-w-none text-xs [&>p]:my-0 break-words"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})
