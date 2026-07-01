import { useCallback } from "react"
import { useFrappeEventListener } from "frappe-react-sdk"

/** Payloads pushed from the server (specs/v2 09 realtime). */
export interface AgentUpdateEvent {
  task: string
  project: string
  agent_status: string
}
export interface AgentLogEvent {
  task: string
}

/**
 * Live agent events scoped to a single task. Fires `onUpdate` when the task's
 * `agent_status` transitions (any field it set lands in the same refetch) and
 * `onLog` when a new agent log line is appended. Pass stable callbacks (SWR
 * `mutate` fns are stable) so the socket subscription isn't churned each render.
 */
export function useAgentTaskEvents(
  taskName: string | undefined | null,
  opts: { onUpdate?: () => void; onLog?: () => void },
) {
  const { onUpdate, onLog } = opts

  useFrappeEventListener<AgentUpdateEvent>(
    "hive_agent_update",
    useCallback(
      (e) => {
        if (taskName && e?.task === taskName) onUpdate?.()
      },
      [taskName, onUpdate],
    ),
  )

  useFrappeEventListener<AgentLogEvent>(
    "hive_agent_log",
    useCallback(
      (e) => {
        if (taskName && e?.task === taskName) onLog?.()
      },
      [taskName, onLog],
    ),
  )
}

/** Live agent status changes for any task in a project — refreshes a board/list. */
export function useAgentProjectEvents(
  projectId: string | undefined | null,
  onUpdate: () => void,
) {
  useFrappeEventListener<AgentUpdateEvent>(
    "hive_agent_update",
    useCallback(
      (e) => {
        if (projectId && e?.project === projectId) onUpdate()
      },
      [projectId, onUpdate],
    ),
  )
}
