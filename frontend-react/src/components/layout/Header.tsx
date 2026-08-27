import { useFrappeAuth, useFrappeGetDocCount } from "frappe-react-sdk"
import { HugeiconsIcon } from "@hugeicons/react"
import { Notification01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"

interface HeaderProps {
  onOpenSearch: () => void
  onOpenNotifications: () => void
}

export function Header({ onOpenSearch, onOpenNotifications }: HeaderProps) {
  const { currentUser } = useFrappeAuth()
  const { data: unreadCount } = useFrappeGetDocCount(
    "Notification Log",
    [["read", "=", 0], ["for_user", "=", currentUser ?? ""]],
    undefined,
    currentUser ? undefined : null,
    { refreshInterval: 30000 },
  )

  const count = unreadCount ?? 0

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          className="hidden h-8 gap-2 rounded-lg px-2 text-muted-foreground md:flex"
          onClick={onOpenSearch}
        >
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
          <span className="text-sm">Search...</span>
          <Kbd keys={["⌘", "K"]} className="pointer-events-none" />
        </Button>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSearch} />
            }
          >
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-5" />
          </TooltipTrigger>
          <TooltipContent>Search (⌘K)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" className="relative" onClick={onOpenNotifications} />
            }
          >
            <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {count > 0 ? `${count} unread notifications` : "No notifications"}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
