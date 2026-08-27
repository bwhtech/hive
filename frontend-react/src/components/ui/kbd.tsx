import { cn } from "@/lib/utils"

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  keys: string[]
  ref?: React.Ref<HTMLElement>
}

function Kbd({ keys, className, ref, ...props }: KbdProps) {
  return (
    <span ref={ref} className={cn("inline-flex items-center gap-0.5", className)} {...props}>
      {keys.map((key, i) => (
        <kbd
          key={i}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 text-[11px] font-medium text-muted-foreground"
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}

export { Kbd }
