import type { AgentStatus } from "@/types"

/**
 * Presentation metadata for each agent lifecycle state (specs/v2 09 — surface 1).
 *
 * `className` — badge palette per the spec: neutral for queued/provisioning,
 *   blue for in-progress work, amber for "needs you" states, green for merged,
 *   red/grey for failed/cancelled.
 * `caption` — a subtle "what's happening" line under the badge.
 * `needsYou` — the state is waiting on a human reviewer (amber).
 */
export interface AgentStatusMeta {
  className: string
  caption: string
  needsYou?: boolean
}

const NEUTRAL = "bg-muted text-muted-foreground"
const BLUE = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
const AMBER = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
const GREEN = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
const RED = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"

export const AGENT_STATUS_META: Record<AgentStatus, AgentStatusMeta> = {
  Queued: { className: NEUTRAL, caption: "Waiting for a free agent slot." },
  Provisioning: { className: NEUTRAL, caption: "Spinning up a dev box…" },
  "Spec In Progress": { className: BLUE, caption: "The agent is writing a spec." },
  "Spec Created": { className: AMBER, caption: "Spec ready for your review.", needsYou: true },
  "Spec Approved": { className: BLUE, caption: "Spec approved — starting implementation." },
  Implementing: { className: BLUE, caption: "The agent is writing code." },
  "PR Ready": { className: AMBER, caption: "A pull request is ready for your review.", needsYou: true },
  "Changes Requested": { className: BLUE, caption: "Re-running with your feedback." },
  Merged: { className: GREEN, caption: "Merged — the box has been torn down." },
  Cancelled: { className: NEUTRAL, caption: "Cancelled." },
  Failed: { className: RED, caption: "The agent run failed." },
}

/** Terminal states carry no further reviewer actions. */
export const AGENT_TERMINAL_STATES: AgentStatus[] = ["Merged", "Cancelled"]

/** Documented `{tokens}` available in each prompt template (specs/v2 §5.1 / box agent.py). */
export const PROMPT_TOKENS: Record<"spec" | "implement" | "changes", string[]> = {
  spec: ["title", "description", "spec_path"],
  implement: ["title", "description", "spec_path", "branch", "spec"],
  changes: ["title", "spec_path", "branch", "comments"],
}

export function isAgentStatus(value: unknown): value is AgentStatus {
  return typeof value === "string" && value in AGENT_STATUS_META
}
