import { useFrappeGetCall } from "frappe-react-sdk"
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Notification03Icon } from "@hugeicons/core-free-icons"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function Header() {
  const { data } = useFrappeGetCall<{ message: { unread_count: number } }>(
    "bwh_hive.bwh_hive.api.get_my_dashboard",
  )
  const unreadCount = data?.message?.unread_count ?? 0

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/">
                <HugeiconsIcon icon={Notification03Icon} strokeWidth={2} className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {unreadCount > 0 ? `${unreadCount} unread updates` : "No unread updates"}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
