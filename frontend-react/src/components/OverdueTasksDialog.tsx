import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useFrappeGetCall } from "frappe-react-sdk"
import { format, formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TASK_PRIORITY_VARIANT, TASK_STATUS_COLOR } from "@/lib/variants"

interface OverdueTask {
  name: string
  title: string
  project: string
  project_title?: string
  project_slug?: string
  status: string
  priority: string
  due_date: string
}

const STORAGE_KEY = "hive-overdue-dialog-last-shown"

const MESSAGES = [
  "A few tasks need your attention. Let's knock them out!",
  "You've got this — just a few overdue items to tackle.",
  "Small steps lead to big progress. Let's start with these.",
  "Time to clear the deck. Here's what's waiting for you.",
]

function getMotivationalMessage(): string {
  const dayIndex = new Date().getDate() % MESSAGES.length
  return MESSAGES[dayIndex]
}

function wasShownToday(): boolean {
  const last = localStorage.getItem(STORAGE_KEY)
  if (!last) return false
  return last === format(new Date(), "yyyy-MM-dd")
}

function markShownToday() {
  localStorage.setItem(STORAGE_KEY, format(new Date(), "yyyy-MM-dd"))
}

export function OverdueTasksDialog() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const { data } = useFrappeGetCall<OverdueTask[]>(
    "bwh_hive.bwh_hive.api.get_my_overdue_tasks",
    undefined,
    undefined,
    { revalidateOnFocus: false },
  )
  const tasks = data?.message || []

  // Open dialog once when data arrives, if not already shown today
  useEffect(() => {
    if (data && tasks.length > 0 && !wasShownToday()) {
      setOpen(true)
    }
  }, [data, tasks.length])

  const dismiss = () => {
    markShownToday()
    setOpen(false)
  }

  const handleGoToTask = (task: OverdueTask) => {
    dismiss()
    navigate(`/projects/${task.project_slug || task.project}?task=${task.name}`)
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) dismiss() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
            </div>
            <DialogTitle>Overdue Tasks</DialogTitle>
          </div>
          <DialogDescription>
            {getMotivationalMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto -mx-1 px-1 space-y-1">
          {tasks.map((task) => (
            <button
              key={task.name}
              type="button"
              onClick={() => handleGoToTask(task)}
              className="w-full flex items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus:outline-none group"
            >
              <div className={`mt-1.5 size-2 shrink-0 rounded-full ${TASK_STATUS_COLOR[task.status] ?? "bg-muted-foreground/40"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {task.project_title && (
                    <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {task.project_title}
                    </span>
                  )}
                  <Badge variant={TASK_PRIORITY_VARIANT[task.priority] ?? "outline"} className="text-[10px] h-4 px-1.5">
                    {task.priority}
                  </Badge>
                  {task.due_date && (
                    <span className="text-xs text-red-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(task.due_date + "T00:00:00"), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1"
              />
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={dismiss}>
            Got it
          </Button>
          <Button
            onClick={() => {
              dismiss()
              navigate("/tasks")
            }}
          >
            View All Tasks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
