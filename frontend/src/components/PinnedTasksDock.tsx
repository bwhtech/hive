import { useMemo, memo } from "react"
import { useFrappeGetDocList } from "frappe-react-sdk"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, PinOffIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MemberAvatar } from "@/components/MemberAvatar"
import { TASK_STATUS_COLOR } from "@/lib/variants"
import type { HiveTask, HiveTaskComment, HiveMember } from "@/types"

interface PinnedTasksDockProps {
  pinnedTaskNames: string[]
  tasks: HiveTask[]
  onUnpin: (taskName: string) => void
  onUnpinAll: () => void
}

export function PinnedTasksDock({ pinnedTaskNames, tasks, onUnpin, onUnpinAll }: PinnedTasksDockProps) {
  const pinnedTasks = useMemo(() => {
    const taskMap = new Map(tasks.map((t) => [t.name, t]))
    return pinnedTaskNames.map((name) => taskMap.get(name)).filter(Boolean) as HiveTask[]
  }, [pinnedTaskNames, tasks])

  if (pinnedTasks.length === 0) return null

  return (
    <div className="border-t bg-background animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between px-4 py-1.5 border-b bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Pinned Tasks ({pinnedTasks.length})
        </span>
        <Button variant="ghost" size="icon-sm" onClick={onUnpinAll} className="text-muted-foreground hover:text-foreground">
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
        </Button>
      </div>
      <div className="flex divide-x" style={{ height: "38vh" }}>
        {pinnedTasks.map((task) => (
          <PinnedTaskPanel key={task.name} task={task} onUnpin={() => onUnpin(task.name)} />
        ))}
      </div>
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
    <div className="flex-1 min-w-[280px] flex flex-col">
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
