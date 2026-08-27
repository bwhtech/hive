import { useState } from "react"
import { useFrappePostCall } from "frappe-react-sdk"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SourceCodeIcon,
  ArrowUpRight01Icon,
  GitBranchIcon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  MoreHorizontalIcon,
  ArrowTurnForwardIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AGENT_STATUS_META, isAgentStatus } from "@/lib/agent"
import type { HiveTask } from "@/types"

interface AgentPanelProps {
  task: HiveTask
  projectAgentEnabled: boolean
  isClient: boolean
  onChanged: () => void
}

/** Actions that pop a modal to collect text or a confirmation before firing. */
type ActionKind = "approve" | "changes" | "merge" | "cancel" | "teardown" | "retry" | "handoff"

interface ActionConfig {
  title: string
  description: string
  /** A text field: `optional` = note (approve), `required` = comment (changes). */
  input?: "optional" | "required"
  inputLabel?: string
  inputPlaceholder?: string
  confirmLabel: string
  destructive?: boolean
  success: string
}

const ACTIONS: Record<ActionKind, ActionConfig> = {
  approve: {
    title: "Approve spec",
    description: "Approve the agent's spec and start the implementation run.",
    input: "optional",
    inputLabel: "Note (optional)",
    inputPlaceholder: "Looks good — go ahead…",
    confirmLabel: "Approve spec",
    success: "Spec approved",
  },
  changes: {
    title: "Request changes",
    description: "Send feedback; the agent re-runs on the same PR branch.",
    input: "required",
    inputLabel: "What should change?",
    inputPlaceholder: "Please add a Code Style section…",
    confirmLabel: "Request changes",
    success: "Changes requested",
  },
  merge: {
    title: "Mark merged",
    description: "Record that the PR was merged on GitHub. The box will be torn down.",
    confirmLabel: "Mark merged",
    success: "Marked merged",
  },
  cancel: {
    title: "Cancel agent",
    description: "Stop this agent task and tear down its box. This can't be undone.",
    confirmLabel: "Cancel task",
    destructive: true,
    success: "Agent cancelled",
  },
  teardown: {
    title: "Tear down box now",
    description: "Force-deprovision the box ahead of the automatic sweep.",
    confirmLabel: "Tear down now",
    destructive: true,
    success: "Box torn down",
  },
  retry: {
    title: "Retry agent",
    description: "Provision a fresh box and re-run this task from the start.",
    confirmLabel: "Retry",
    success: "Retrying — a fresh box is being provisioned",
  },
  handoff: {
    title: "Hand to agent",
    description: "Assign this task to the Agent bot to start the autonomous loop.",
    confirmLabel: "Hand to agent",
    success: "Handed to the agent",
  },
}

/** In-flight (non-terminal, non-Failed) states can be cancelled. */
const CANCELLABLE = new Set([
  "Queued",
  "Provisioning",
  "Spec In Progress",
  "Spec Created",
  "Spec Approved",
  "Implementing",
  "PR Ready",
  "Changes Requested",
])

function errorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error && e.message) return e.message
  const maybe = e as { message?: string; exc?: string } | null
  return maybe?.message || fallback
}

export function AgentPanel({ task, projectAgentEnabled, isClient, onChanged }: AgentPanelProps) {
  const status = task.agent_status || ""
  const hasLifecycle = isAgentStatus(status)

  const [action, setAction] = useState<ActionKind | null>(null)
  const [text, setText] = useState("")
  const [busy, setBusy] = useState(false)

  const { call: approveSpec } = useFrappePostCall("bwh_hive.bwh_hive.api.agent_approve_spec")
  const { call: requestChanges } = useFrappePostCall("bwh_hive.bwh_hive.api.agent_request_changes")
  const { call: markMerged } = useFrappePostCall("bwh_hive.bwh_hive.api.agent_mark_merged")
  const { call: retryAgent } = useFrappePostCall("bwh_hive.bwh_hive.api.agent_retry")
  const { call: cancelAgent } = useFrappePostCall("bwh_hive.bwh_hive.api.agent_cancel")
  const { call: teardownNow } = useFrappePostCall("bwh_hive.bwh_hive.api.agent_teardown_now")
  const { call: handoff } = useFrappePostCall("bwh_hive.bwh_hive.api.agent_handoff")

  // Nothing to show: no lifecycle and the project can't start one.
  if (!hasLifecycle && !projectAgentEnabled) return null
  // Client users only ever see the read-only view; a fresh (no-lifecycle) task
  // has nothing to read, so hide it from them entirely.
  if (!hasLifecycle && isClient) return null

  const meta = hasLifecycle ? AGENT_STATUS_META[status] : null

  const openAction = (kind: ActionKind) => {
    setText("")
    setAction(kind)
  }

  const runAction = async () => {
    if (!action) return
    const cfg = ACTIONS[action]
    if (cfg.input === "required" && !text.trim()) return
    setBusy(true)
    try {
      switch (action) {
        case "approve":
          await approveSpec({ task: task.name, note: text.trim() || null })
          break
        case "changes":
          await requestChanges({ task: task.name, comment: text.trim() })
          break
        case "merge":
          await markMerged({ task: task.name })
          break
        case "cancel":
          await cancelAgent({ task: task.name })
          break
        case "teardown":
          await teardownNow({ task: task.name })
          break
        case "retry":
          await retryAgent({ task: task.name })
          break
        case "handoff":
          await handoff({ task: task.name })
          break
      }
      toast.success(cfg.success)
      setAction(null)
      setText("")
      onChanged()
    } catch (e) {
      toast.error(errorMessage(e, `Failed to ${cfg.title.toLowerCase()}`))
    } finally {
      setBusy(false)
    }
  }

  const deepLink = (url: string | null | undefined, label: string, icon: typeof SourceCodeIcon) =>
    url ? (
      <Button
        key={label}
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
      >
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3.5" />
        {label}
      </Button>
    ) : null

  const links = [
    deepLink(task.agent_code_url, "Code server", SourceCodeIcon),
    deepLink(task.agent_site_url, "Site", ArrowUpRight01Icon),
    deepLink(task.pr_link, "Pull request", GitBranchIcon),
  ].filter(Boolean)

  // Reviewer actions are team-only; the server re-asserts the reviewer guard.
  const canAct = !isClient
  const activeCfg = action ? ACTIONS[action] : null

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SourceCodeIcon} strokeWidth={2} className="size-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Agent</Label>
        </div>
        {meta && (
          <Badge variant="secondary" className={meta.className}>
            {status}
          </Badge>
        )}
      </div>

      {meta && <p className="text-xs text-muted-foreground">{meta.caption}</p>}

      {/* Deep links */}
      {links.length > 0 && <div className="flex flex-wrap gap-1.5">{links}</div>}

      {/* Spec path hint */}
      {task.agent_spec_path && (
        <p className="text-xs text-muted-foreground">
          Spec: <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">{task.agent_spec_path}</code>
        </p>
      )}

      {/* Error callout */}
      {status === "Failed" && task.agent_last_error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="mt-0.5 size-3.5 shrink-0" />
          <span className="whitespace-pre-wrap break-words">{task.agent_last_error}</span>
        </div>
      )}

      {/* Reviewer actions */}
      {canAct && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Hand to agent — no lifecycle yet */}
          {!hasLifecycle && projectAgentEnabled && (
            <Button size="sm" onClick={() => openAction("handoff")}>
              <HugeiconsIcon icon={ArrowTurnForwardIcon} strokeWidth={2} data-icon="inline-start" />
              Hand to agent
            </Button>
          )}

          {status === "Spec Created" && (
            <Button size="sm" onClick={() => openAction("approve")}>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} data-icon="inline-start" />
              Approve spec
            </Button>
          )}

          {status === "PR Ready" && (
            <>
              <Button size="sm" onClick={() => openAction("merge")}>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} data-icon="inline-start" />
                Mark merged
              </Button>
              <Button size="sm" variant="outline" onClick={() => openAction("changes")}>
                Request changes
              </Button>
            </>
          )}

          {status === "Failed" && (
            <Button size="sm" onClick={() => openAction("retry")}>
              <HugeiconsIcon icon={ArrowTurnForwardIcon} strokeWidth={2} data-icon="inline-start" />
              Retry
            </Button>
          )}

          {/* Overflow: destructive / lifecycle controls */}
          {(CANCELLABLE.has(status) || status === "Failed") && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button size="icon-sm" variant="ghost" className="text-muted-foreground" />}
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {CANCELLABLE.has(status) && (
                  <DropdownMenuItem variant="destructive" onClick={() => openAction("cancel")}>
                    Cancel task
                  </DropdownMenuItem>
                )}
                {status === "Failed" && (
                  <DropdownMenuItem variant="destructive" onClick={() => openAction("teardown")}>
                    Tear down box now
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Action modal (note / comment / confirm) */}
      <Dialog open={action !== null} onOpenChange={(o) => { if (!o) { setAction(null); setText("") } }}>
        <DialogContent className="sm:max-w-md">
          {activeCfg && (
            <>
              <DialogHeader>
                <DialogTitle>{activeCfg.title}</DialogTitle>
                <DialogDescription>{activeCfg.description}</DialogDescription>
              </DialogHeader>
              {activeCfg.input && (
                <div className="grid gap-2">
                  <Label htmlFor="agent-action-input">{activeCfg.inputLabel}</Label>
                  <Textarea
                    id="agent-action-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={activeCfg.inputPlaceholder}
                    rows={4}
                    autoFocus
                  />
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => { setAction(null); setText("") }} disabled={busy}>
                  Cancel
                </Button>
                <Button
                  variant={activeCfg.destructive ? "destructive" : "default"}
                  onClick={runAction}
                  disabled={busy || (activeCfg.input === "required" && !text.trim())}
                >
                  {busy ? "Working…" : activeCfg.confirmLabel}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
