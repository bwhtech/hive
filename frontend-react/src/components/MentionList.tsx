import { useImperativeHandle, useState } from "react"
import { MemberAvatar } from "@/components/MemberAvatar"

export interface MentionItem {
  id: string
  label: string
  image?: string | null
}

interface MentionListProps {
  items: MentionItem[]
  command: (item: MentionItem) => void
  ref?: React.Ref<MentionListRef>
}

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export function MentionList({ items, command, ref }: MentionListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Clamp index to valid range when items shrink
  const safeIndex = items.length > 0 ? selectedIndex % items.length : 0

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => (i + items.length - 1) % items.length)
        return true
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % items.length)
        return true
      }
      if (event.key === "Enter") {
        const idx = items.length > 0 ? selectedIndex % items.length : -1
        if (idx >= 0 && items[idx]) {
          command(items[idx])
        }
        return true
      }
      return false
    },
  }))

  if (!items.length) {
    return (
      <div className="rounded-md border bg-popover p-2 text-sm text-muted-foreground shadow-md">
        No members found
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-popover shadow-md overflow-hidden">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={`flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm ${
            index === safeIndex
              ? "bg-accent text-accent-foreground"
              : "text-popover-foreground hover:bg-muted"
          }`}
          onClick={() => command(item)}
        >
          <MemberAvatar size="sm" name={item.label} image={item.image} />
          {item.label}
        </button>
      ))}
    </div>
  )
}
