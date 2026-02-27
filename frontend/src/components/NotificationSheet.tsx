import { useFrappeAuth, useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, UserAdd01Icon, Notification01Icon } from "@hugeicons/core-free-icons"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useNavigate } from "react-router"

interface NotificationLog {
  name: string
  subject: string
  type: "Mention" | "Assignment" | "Share" | "Alert"
  document_type: string
  document_name: string
  from_user: string
  read: 0 | 1
  creation: string
}

interface NotificationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

export function NotificationSheet({ open, onOpenChange }: NotificationSheetProps) {
  const navigate = useNavigate()
  const { currentUser } = useFrappeAuth()
  const { call: markAllRead } = useFrappePostCall("frappe.desk.doctype.notification_log.notification_log.mark_all_as_read")
  const { call: markRead } = useFrappePostCall("frappe.desk.doctype.notification_log.notification_log.mark_as_read")

  const { data: notifications, isLoading, mutate } = useFrappeGetDocList<NotificationLog>(
    "Notification Log",
    {
      fields: ["name", "subject", "type", "document_type", "document_name", "from_user", "read", "creation"],
      filters: [["for_user", "=", currentUser ?? ""]],
      orderBy: { field: "creation", order: "desc" },
      limit: 50,
    },
    open && currentUser ? undefined : null,
  )

  const { data: userInfo } = useFrappeGetDocList<{ name: string; full_name: string; user_image: string }>(
    "User",
    {
      fields: ["name", "full_name", "user_image"],
      filters: [["name", "in", [...new Set((notifications ?? []).map((n) => n.from_user).filter(Boolean))]]],
    },
    notifications && notifications.length > 0 ? undefined : null,
  )

  const userMap = new Map((userInfo ?? []).map((u) => [u.name, u]))
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length

  const handleMarkAllRead = async () => {
    await markAllRead({})
    mutate()
  }

  const handleClick = async (notification: NotificationLog) => {
    if (!notification.read) {
      await markRead({ docname: notification.name })
      mutate()
    }
    // Navigate based on notification document type
    if (notification.document_type === "Hive Task" && notification.document_name) {
      onOpenChange(false)
      navigate(`/tasks/${encodeURIComponent(notification.document_name)}`)
    } else if (notification.document_type === "Hive Project" && notification.document_name) {
      onOpenChange(false)
      navigate(`/projects/${notification.document_name}?tab=updates`)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "Mention":
        return Notification01Icon
      case "Assignment":
        return UserAdd01Icon
      default:
        return Notification01Icon
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between gap-2 space-y-0 pr-10">
          <div>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </SheetDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="mr-1 size-4" />
              Mark all read
            </Button>
          )}
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="size-5 text-muted-foreground" />
              </div>
            ) : !notifications?.length ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <HugeiconsIcon icon={Notification01Icon} strokeWidth={1.5} className="size-8" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const user = userMap.get(notification.from_user)
                const initials = (user?.full_name ?? notification.from_user ?? "?")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <button
                    key={notification.name}
                    onClick={() => handleClick(notification)}
                    className={`flex items-start gap-3 px-6 py-3 text-left transition-colors hover:bg-muted/50 [content-visibility:auto] [contain-intrinsic-size:auto_64px] ${
                      !notification.read ? "bg-muted/30" : ""
                    }`}
                  >
                    <div className="relative mt-0.5 shrink-0">
                      <Avatar size="sm">
                        {user?.user_image && <AvatarImage src={user.user_image} />}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-background">
                        <HugeiconsIcon
                          icon={getIcon(notification.type)}
                          strokeWidth={2.5}
                          className="size-2.5 text-muted-foreground"
                        />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm leading-snug ${!notification.read ? "font-medium" : "text-muted-foreground"}`}>
                        {stripHtml(notification.subject)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.creation), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
