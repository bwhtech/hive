import { useEffect, useMemo, useState } from "react"
import { useFrappeGetDoc, useFrappeUpdateDoc, useFrappeGetCall } from "frappe-react-sdk"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  TextField,
  SwitchField,
  SecretField,
  PromptField,
} from "@/components/settings/agent-fields"
import { PROMPT_TOKENS } from "@/lib/agent"
import type { HiveProject } from "@/types"

interface AgentSettingsTabProps {
  projectId: string
  onSaved?: () => void
}

type Form = Record<string, string | number | null>

type ResolvedPrompts = { spec?: string; implement?: string; changes?: string }

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

/** Shows the global default a blank override inherits, previewable in a popover. */
function GlobalDefaultHint({ value }: { value?: string }) {
  if (!value) {
    return <p className="text-[11px] text-muted-foreground">Blank = inherit — no global default set, so the box uses its shipped prompt.</p>
  }
  const lines = value.split("\n").length
  return (
    <p className="text-[11px] text-muted-foreground">
      Blank = inherit the global default ({lines} {lines === 1 ? "line" : "lines"}).{" "}
      <Popover>
        <PopoverTrigger render={<button type="button" className="text-primary underline underline-offset-2" />}>
          View global
        </PopoverTrigger>
        <PopoverContent className="w-96 max-w-[90vw] p-0" align="start">
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-[11px]">{value}</pre>
        </PopoverContent>
      </Popover>
    </p>
  )
}

export function AgentSettingsTab({ projectId, onSaved }: AgentSettingsTabProps) {
  const { data, isLoading, mutate } = useFrappeGetDoc<HiveProject>("Hive Project", projectId)
  const { updateDoc, loading: saving } = useFrappeUpdateDoc()
  // Global-only resolution (no project) — the defaults a blank override inherits.
  const { data: globalPrompts } = useFrappeGetCall<{ message: ResolvedPrompts }>(
    "bwh_hive.bwh_hive.api.resolved_prompts",
  )
  const globals = globalPrompts?.message ?? {}

  const [form, setForm] = useState<Form>({})
  const patSet = useMemo(() => Boolean(data?.github_pat), [data])

  useEffect(() => {
    if (!data) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      agent_enabled: data.agent_enabled ?? 0,
      agent_template_slug: data.agent_template_slug ?? "",
      target_app_name: data.target_app_name ?? "",
      target_app_repo: data.target_app_repo ?? "",
      target_app_branch: data.target_app_branch ?? "",
      github_repo: data.github_repo ?? "",
      github_pat: "",
      skills_repo_override: data.skills_repo_override ?? "",
      agent_spec_prompt: data.agent_spec_prompt ?? "",
      agent_implement_prompt: data.agent_implement_prompt ?? "",
      agent_changes_prompt: data.agent_changes_prompt ?? "",
    })
  }, [data])

  const set = (key: string) => (value: string | number | boolean | null) =>
    setForm((prev) => ({ ...prev, [key]: typeof value === "boolean" ? (value ? 1 : 0) : value }))
  const s = (k: string) => String(form[k] ?? "")

  const handleSave = async () => {
    const payload: Record<string, unknown> = { ...form }
    if (!String(form.github_pat ?? "").trim()) delete payload.github_pat
    try {
      await updateDoc("Hive Project", projectId, payload)
      toast.success("Agent settings saved")
      mutate()
      onSaved?.()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save agent settings")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 pt-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  const enabled = form.agent_enabled === 1

  return (
    <div className="space-y-8 pt-2">
      <div className="space-y-4">
        <SectionHeading title="Agent" description="Run this project's tasks as autonomous coding agents." />
        <SwitchField
          id="proj-agent-enabled"
          label="Agent enabled"
          hint="Allow tasks in this project to be handed to the Agent bot."
          checked={enabled}
          onCheckedChange={set("agent_enabled")}
        />
      </div>

      {enabled && (
        <>
          <div className="space-y-4">
            <TextField id="proj-agent-template" label="Template slug" hint="Blank = the global default template." value={s("agent_template_slug")} onChange={set("agent_template_slug")} placeholder="Inherit global default" />
          </div>

          <Separator />

          <div className="space-y-4">
            <SectionHeading title="Target app" description="The Frappe app + repo the agent works against." />
            <TextField id="proj-app-name" label="Target App Name" value={s("target_app_name")} onChange={set("target_app_name")} />
            <TextField id="proj-app-repo" label="Target App Repo" value={s("target_app_repo")} onChange={set("target_app_repo")} placeholder="owner/repo" />
            <TextField id="proj-app-branch" label="Target App Branch" value={s("target_app_branch")} onChange={set("target_app_branch")} placeholder="develop" />
            <TextField id="proj-github-repo" label="GitHub Repo" hint="Also set via the repo picker in the project header." value={s("github_repo")} onChange={set("github_repo")} placeholder="owner/repo" />
          </div>

          <Separator />

          <div className="space-y-4">
            <SectionHeading title="Credentials" description="A project-scoped PAT authenticates gh + git pushes inside the box." />
            <SecretField id="proj-github-pat" label="GitHub PAT" isSet={patSet} value={s("github_pat")} onChange={set("github_pat")} />
            <TextField id="proj-skills-override" label="Skills Repo Override" hint="Blank = the global skills repo." value={s("skills_repo_override")} onChange={set("skills_repo_override")} placeholder="owner/repo" />
          </div>

          <Separator />

          <div className="space-y-4">
            <SectionHeading title="Prompt overrides" description="Override the global prompt templates for this project. Blank = inherit." />
            <div className="grid gap-1">
              <PromptField id="proj-spec-prompt" label="Spec prompt" tokens={PROMPT_TOKENS.spec} value={s("agent_spec_prompt")} onChange={set("agent_spec_prompt")} />
              <GlobalDefaultHint value={globals.spec} />
            </div>
            <div className="grid gap-1">
              <PromptField id="proj-impl-prompt" label="Implement prompt" tokens={PROMPT_TOKENS.implement} value={s("agent_implement_prompt")} onChange={set("agent_implement_prompt")} />
              <GlobalDefaultHint value={globals.implement} />
            </div>
            <div className="grid gap-1">
              <PromptField id="proj-changes-prompt" label="Changes prompt" tokens={PROMPT_TOKENS.changes} value={s("agent_changes_prompt")} onChange={set("agent_changes_prompt")} />
              <GlobalDefaultHint value={globals.changes} />
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
