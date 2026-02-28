import { useState, useMemo, memo, useCallback } from "react"
import { useNavigate } from "react-router"
import { useFrappeGetDoc, useFrappeGetDocList } from "frappe-react-sdk"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  PinOffIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MemberAvatar } from "@/components/MemberAvatar"
import { TASK_STATUS_COLOR } from "@/lib/variants"
import { usePinnedTasks } from "@/context/PinnedTasksContext"
import type { HiveTask, HiveTaskComment, HiveMember } from "@/types"

const EXPANDED_HEIGHT = 360

export function PinnedTasksDock() {
  const { pinnedTaskNames, togglePin } = usePinnedTasks()

  if (pinnedTaskNames.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-40 flex items-end gap-2 p-3 pointer-events-none">
      {pinnedTaskNames.map((taskName) => (
        <PinnedTaskCard key={taskName} taskName={taskName} onUnpin={() => togglePin(taskName)} />
      ))}
    </div>
  )
}

const PinnedTaskCard = memo(function PinnedTaskCard({
  taskName,
  onUnpin,
}: {
  taskName: string
  onUnpin: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()

  const { data: task } = useFrappeGetDoc<HiveTask>("Hive Task", taskName)

  const handleNavigate = useCallback(() => {
    if (task) {
      navigate(`/projects/${task.project}?tab=tasks&task=${task.name}`)
    }
  }, [task, navigate])

  if (!task) {
    return (
      <div className="pointer-events-auto w-72 rounded-t-lg border bg-background shadow-lg animate-in fade-in duration-200">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-auto w-80 rounded-t-lg border bg-background shadow-lg animate-in slide-in-from-bottom-2 duration-200 flex flex-col">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 border-b hover:bg-muted/30 transition-colors cursor-pointer w-full text-left"
      >
        <span
          className={`size-2 rounded-full shrink-0 ${TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40"}`}
        />
        <span className="text-sm font-medium truncate flex-1">{task.title}</span>
        <HugeiconsIcon
          icon={isExpanded ? ArrowDown01Icon : ArrowUp01Icon}
          strokeWidth={2}
          className="size-3.5 text-muted-foreground shrink-0"
        />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{ height: EXPANDED_HEIGHT }} className="flex flex-col">
          {/* Action bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/20 shrink-0">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                {task.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                {task.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleNavigate}
                className="text-muted-foreground hover:text-foreground"
                title="Open in project"
              >
                <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onUnpin}
                className="text-muted-foreground hover:text-foreground"
                title="Unpin"
              >
                <HugeiconsIcon icon={PinOffIcon} strokeWidth={2} className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground"
                title="Minimize"
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Scrollable body */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {/* Description */}
              {task.description && (
                <div>
                  <h5 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Description
                  </h5>
                  <div
                    className="prose prose-sm max-w-none text-xs [&>p]:my-0.5 break-words"
                    dangerouslySetInnerHTML={{ __html: task.description }}
                  />
                </div>
              )}

              {/* Comments */}
              <TaskComments taskName={task.name} />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
})

const TaskComments = memo(function TaskComments({ taskName }: { taskName: string }) {
  const { data: comments } = useFrappeGetDocList<HiveTaskComment>("Hive Task Comment", {
    fields: ["name", "task", "posted_by", "content", "creation"],
    filters: [
      ["task", "=", taskName],
      ["is_archived", "=", 0],
    ],
    orderBy: { field: "creation", order: "asc" },
    limit: 50,
  })

  const { data: members } = useFrappeGetDocList<HiveMember>("Hive Member", {
    fields: ["name", "user", "member_name", "user_image"],
    filters: [["is_active", "=", 1]],
    limit: 100,
  })

  const memberByEmail = useMemo(() => {
    const map = new Map<string, HiveMember>()
    if (members) {
      for (const m of members) {
        map.set(m.user, m)
      }
    }
    return map
  }, [members])

  if (!comments || comments.length === 0) return null

  return (
    <div>
      <h5 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
        Comments ({comments.length})
      </h5>
      <div className="space-y-2">
        {comments.map((comment) => {
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
                  <span className="text-[11px] font-medium truncate">
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
  )
})
