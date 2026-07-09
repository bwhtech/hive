import { useEffect, useMemo, useState } from "react"
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  TextField,
  IntField,
  SwitchField,
  SecretField,
  PromptField,
} from "@/components/settings/agent-fields"
import { PROMPT_TOKENS } from "@/lib/agent"

interface HiveSettings {
  agent_orchestration_enabled?: 0 | 1
  benchspace_api_url?: string | null
  benchspace_api_key?: string | null
  benchspace_api_secret?: string | null
  agent_callback_api_key?: string | null
  agent_callback_api_secret?: string | null
  default_agent_template_slug?: string | null
  skills_repo?: string | null
  anthropic_api_key?: string | null
  claude_code_oauth_token?: string | null
  openai_api_key?: string | null
  agent_spec_prompt?: string | null
  agent_implement_prompt?: string | null
  agent_changes_prompt?: string | null
  max_concurrent_agent_boxes?: number | null
  provisioning_timeout_minutes?: number | null
  spec_timeout_minutes?: number | null
  implement_timeout_minutes?: number | null
  idle_teardown_hours?: number | null
  failed_teardown_grace_hours?: number | null
  notifications_enabled?: 0 | 1
  telegram_bot_token?: string | null
  telegram_default_chat_id?: string | null
}

// Password fields never round-trip their real value; input starts blank and is
// only written when non-empty.
const SECRET_FIELDS = [
  "benchspace_api_secret",
  "agent_callback_api_secret",
  "anthropic_api_key",
  "claude_code_oauth_token",
  "openai_api_key",
  "telegram_bot_token",
] as const

type Form = Record<string, string | number | null>

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

export function AgentSection() {
  const { data, isLoading, mutate } = useFrappeGetDoc<HiveSettings>("Hive Settings", "Hive Settings")
  const { updateDoc, loading: saving } = useFrappeUpdateDoc()
  const [form, setForm] = useState<Form>({})

  const secretsSet = useMemo(() => {
    const set: Record<string, boolean> = {}
    for (const f of SECRET_FIELDS) set[f] = Boolean(data?.[f as keyof HiveSettings])
    return set
  }, [data])

  // Seed the draft once the doc loads. Secrets seed blank (Frappe masks them).
  useEffect(() => {
    if (!data) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      agent_orchestration_enabled: data.agent_orchestration_enabled ?? 0,
      benchspace_api_url: data.benchspace_api_url ?? "",
      benchspace_api_key: data.benchspace_api_key ?? "",
      benchspace_api_secret: "",
      agent_callback_api_key: data.agent_callback_api_key ?? "",
      agent_callback_api_secret: "",
      default_agent_template_slug: data.default_agent_template_slug ?? "",
      skills_repo: data.skills_repo ?? "",
      anthropic_api_key: "",
      claude_code_oauth_token: "",
      openai_api_key: "",
      agent_spec_prompt: data.agent_spec_prompt ?? "",
      agent_implement_prompt: data.agent_implement_prompt ?? "",
      agent_changes_prompt: data.agent_changes_prompt ?? "",
      max_concurrent_agent_boxes: data.max_concurrent_agent_boxes ?? null,
      provisioning_timeout_minutes: data.provisioning_timeout_minutes ?? null,
      spec_timeout_minutes: data.spec_timeout_minutes ?? null,
      implement_timeout_minutes: data.implement_timeout_minutes ?? null,
      idle_teardown_hours: data.idle_teardown_hours ?? null,
      failed_teardown_grace_hours: data.failed_teardown_grace_hours ?? null,
      notifications_enabled: data.notifications_enabled ?? 0,
      telegram_bot_token: "",
      telegram_default_chat_id: data.telegram_default_chat_id ?? "",
    })
  }, [data])

  const set = (key: string) => (value: string | number | boolean | null) =>
    setForm((prev) => ({ ...prev, [key]: typeof value === "boolean" ? (value ? 1 : 0) : value }))

  const handleSave = async () => {
    const payload: Record<string, unknown> = { ...form }
    // Don't wipe stored secrets on a blank submit.
    for (const f of SECRET_FIELDS) {
      if (!String(form[f] ?? "").trim()) delete payload[f]
    }
    try {
      await updateDoc("Hive Settings", "Hive Settings", payload)
      toast.success("Agent settings saved")
      mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save agent settings")
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  const s = (k: string) => String(form[k] ?? "")
  const n = (k: string) => (form[k] === null || form[k] === undefined ? null : Number(form[k]))

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        {/* Orchestration */}
        <div className="space-y-4">
          <SectionHeading title="Orchestration" description="How agent boxes are provisioned and reclaimed." />
          <SwitchField
            id="agent-orch-enabled"
            label="Agent orchestration enabled"
            hint="Master switch — assigning a task to the Agent bot provisions a box."
            checked={form.agent_orchestration_enabled === 1}
            onCheckedChange={set("agent_orchestration_enabled")}
          />
          <TextField id="agent-default-template" label="Default template slug" value={s("default_agent_template_slug")} onChange={set("default_agent_template_slug")} placeholder="agent-v16" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <IntField id="agent-max-boxes" label="Max concurrent boxes" value={n("max_concurrent_agent_boxes")} onChange={set("max_concurrent_agent_boxes")} />
            <IntField id="agent-prov-timeout" label="Provisioning timeout (min)" value={n("provisioning_timeout_minutes")} onChange={set("provisioning_timeout_minutes")} />
            <IntField id="agent-spec-timeout" label="Spec timeout (min)" value={n("spec_timeout_minutes")} onChange={set("spec_timeout_minutes")} />
            <IntField id="agent-impl-timeout" label="Implement timeout (min)" value={n("implement_timeout_minutes")} onChange={set("implement_timeout_minutes")} />
            <IntField id="agent-idle-teardown" label="Idle teardown (hrs)" value={n("idle_teardown_hours")} onChange={set("idle_teardown_hours")} />
            <IntField id="agent-failed-grace" label="Failed grace (hrs)" value={n("failed_teardown_grace_hours")} onChange={set("failed_teardown_grace_hours")} />
          </div>
        </div>

        <Separator />

        {/* Credentials */}
        <div className="space-y-4">
          <SectionHeading title="Credentials" description="BenchSpace + callback auth and the skills source. Secrets are write-only." />
          <TextField id="agent-bs-url" label="BenchSpace API URL" value={s("benchspace_api_url")} onChange={set("benchspace_api_url")} placeholder="https://boxes.example.com" />
          <TextField id="agent-bs-key" label="BenchSpace API Key" value={s("benchspace_api_key")} onChange={set("benchspace_api_key")} />
          <SecretField id="agent-bs-secret" label="BenchSpace API Secret" isSet={secretsSet.benchspace_api_secret} value={s("benchspace_api_secret")} onChange={set("benchspace_api_secret")} />
          <TextField id="agent-cb-key" label="Agent Callback API Key" value={s("agent_callback_api_key")} onChange={set("agent_callback_api_key")} />
          <SecretField id="agent-cb-secret" label="Agent Callback API Secret" isSet={secretsSet.agent_callback_api_secret} value={s("agent_callback_api_secret")} onChange={set("agent_callback_api_secret")} />
          <SecretField id="agent-anthropic-key" label="Anthropic API Key" hint="Claude Code (API billing)." isSet={secretsSet.anthropic_api_key} value={s("anthropic_api_key")} onChange={set("anthropic_api_key")} />
          <SecretField id="agent-claude-oauth" label="Claude Code OAuth Token" hint="claude setup-token — used when no Anthropic API key is set (subscription auth)." isSet={secretsSet.claude_code_oauth_token} value={s("claude_code_oauth_token")} onChange={set("claude_code_oauth_token")} />
          <SecretField id="agent-openai-key" label="OpenAI API Key" hint="Used by projects on the Codex engine." isSet={secretsSet.openai_api_key} value={s("openai_api_key")} onChange={set("openai_api_key")} />
          <TextField id="agent-skills-repo" label="Skills Repo" value={s("skills_repo")} onChange={set("skills_repo")} placeholder="owner/repo" />
        </div>

        <Separator />

        {/* Prompts */}
        <div className="space-y-4">
          <SectionHeading title="Prompt templates" description="Global defaults. Blank = the box's shipped default. A project can override each." />
          <PromptField id="agent-spec-prompt" label="Spec prompt" tokens={PROMPT_TOKENS.spec} value={s("agent_spec_prompt")} onChange={set("agent_spec_prompt")} />
          <PromptField id="agent-impl-prompt" label="Implement prompt" tokens={PROMPT_TOKENS.implement} value={s("agent_implement_prompt")} onChange={set("agent_implement_prompt")} />
          <PromptField id="agent-changes-prompt" label="Changes prompt" tokens={PROMPT_TOKENS.changes} value={s("agent_changes_prompt")} onChange={set("agent_changes_prompt")} />
        </div>

        <Separator />

        {/* Notifications */}
        <div className="space-y-4">
          <SectionHeading title="Notifications" description="Telegram alerts on lifecycle transitions (spec ready, PR ready, failed)." />
          <SwitchField
            id="agent-notif-enabled"
            label="Notifications enabled"
            checked={form.notifications_enabled === 1}
            onCheckedChange={set("notifications_enabled")}
          />
          <SecretField id="agent-tg-token" label="Telegram Bot Token" isSet={secretsSet.telegram_bot_token} value={s("telegram_bot_token")} onChange={set("telegram_bot_token")} />
          <TextField id="agent-tg-chat" label="Telegram Default Chat ID" value={s("telegram_default_chat_id")} onChange={set("telegram_default_chat_id")} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t p-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
