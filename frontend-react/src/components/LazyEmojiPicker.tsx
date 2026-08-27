import { lazy, Suspense } from "react"

const EmojiPicker = lazy(() => import("emoji-picker-react"))

interface LazyEmojiPickerProps {
  onEmojiClick: (emojiData: { emoji: string }) => void
  theme?: "light" | "dark" | "auto"
  skinTonesDisabled?: boolean
  height?: number
  width?: number
}

export function LazyEmojiPicker(props: LazyEmojiPickerProps) {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center"
          style={{ height: props.height, width: props.width }}
        >
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      }
    >
      <EmojiPicker {...props} />
    </Suspense>
  )
}
