import { useState } from "react"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, Link04Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { TASK_PRIORITIES, TASK_STATUSES } from "@/types"

interface CreateTaskValues {
  title: string
  priority: string
  status: string
  due_date?: string | null
  start_date?: string | null
  pr_link?: string | null
  is_client_task?: 0 | 1
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateTaskValues) => void
}

export function CreateTaskDialog({ open, onOpenChange, onSubmit }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [status, setStatus] = useState("Backlog")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [prLink, setPrLink] = useState("")
  const [isClientTask, setIsClientTask] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      priority,
      status,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
      pr_link: prLink || null,
      is_client_task: isClientTask ? 1 : 0,
    })
    setTitle("")
    setPriority("Medium")
    setStatus("Backlog")
    setDueDate(undefined)
    setStartDate(undefined)
    setPrLink("")
    setIsClientTask(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Add a task to this project.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="outline" className="w-full justify-start text-left font-normal" />
                  }
                >
                  <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="mr-2 size-4" />
                  {startDate ? (
                    format(startDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">Pick date</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="outline" className="w-full justify-start text-left font-normal" />
                  }
                >
                  <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="mr-2 size-4" />
                  {dueDate ? (
                    format(dueDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">Pick date</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-pr-link">PR Link</Label>
            <div className="relative">
              <HugeiconsIcon
                icon={Link04Icon}
                strokeWidth={2}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              />
              <Input
                id="task-pr-link"
                placeholder="https://github.com/..."
                value={prLink}
                onChange={(e) => setPrLink(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isClientTask}
              onChange={(e) => setIsClientTask(e.target.checked)}
              className="size-4 rounded border accent-primary"
            />
            <span className="text-sm">Client-facing task</span>
          </label>

          <DialogFooter>
            <Button type="submit" disabled={!title.trim()}>
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
