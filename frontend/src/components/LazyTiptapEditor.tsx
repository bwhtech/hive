import { lazy, Suspense, type ComponentProps } from "react"

const TiptapEditor = lazy(() =>
  import("@/components/TiptapEditor").then((mod) => ({
    default: mod.TiptapEditor,
  })),
)

type TiptapEditorProps = ComponentProps<typeof TiptapEditor>

export function LazyTiptapEditor(props: TiptapEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-md border border-input bg-background min-h-[80px] flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading editor...</span>
        </div>
      }
    >
      <TiptapEditor {...props} />
    </Suspense>
  )
}
