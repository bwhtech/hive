import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div>
      <span className="text-sm font-medium">{label}</span>
      {hint && <p className="text-xs text-muted-foreground font-normal">{hint}</p>}
    </div>
  )
}

export function TextField({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-8 text-sm" />
    </div>
  )
}

export function IntField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  value: number | null
  onChange: (v: number | null) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <Input
        id={id}
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className="h-8 text-sm max-w-32"
      />
    </div>
  )
}

export function SwitchField({
  id,
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  hint?: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id} className="flex flex-col items-start gap-1 cursor-pointer">
        <FieldLabel label={label} hint={hint} />
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

/**
 * A Password field. Frappe never round-trips the real secret to the client — it
 * returns a masked placeholder. So the input starts empty; `isSet` reflects
 * whether a value is stored. A blank submit leaves the stored secret untouched
 * (the parent only writes password fields whose input is non-empty).
 */
export function SecretField({
  id,
  label,
  hint,
  isSet,
  value,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  isSet: boolean
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <Input
        id={id}
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isSet ? "•••••••• (leave blank to keep)" : "Not set"}
        className="h-8 text-sm"
        autoComplete="new-password"
      />
    </div>
  )
}

export function PromptField({
  id,
  label,
  hint,
  tokens,
  value,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  tokens: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="font-mono text-xs"
        placeholder="Blank = inherit the box default."
        spellCheck={false}
      />
      <p className="text-[11px] text-muted-foreground">
        Tokens:{" "}
        {tokens.map((t, i) => (
          <span key={t}>
            <code className="rounded bg-muted px-1 py-0.5 font-mono">{`{${t}}`}</code>
            {i < tokens.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </div>
  )
}
