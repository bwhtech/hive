import { useState, useCallback } from "react"
import { NavLink, useLocation, useNavigate } from "react-router"
import { useFrappeAuth, useFrappeGetDocList, useFrappeDeleteDoc, useFrappeUpdateDoc } from "frappe-react-sdk"
import { toast } from "sonner"
import { LazyEmojiPicker } from "@/components/LazyEmojiPicker"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare02Icon,
  Folder01Icon,
  TaskDaily01Icon,
  UserGroup03Icon,
  Settings01Icon,
  LogoutIcon,
  Sun02Icon,
  Moon02Icon,
  ArrowUp01Icon,
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  Bug01Icon,
} from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { HiveView } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { MemberAvatar } from "@/components/MemberAvatar"
import { useUser } from "@/context/UserContext"
import { useTheme } from "@/components/theme-provider"
import { Kbd } from "@/components/ui/kbd"

const navItems = [
  { to: "/", label: "Dashboard", icon: DashboardSquare02Icon, keys: ["G", "D"] },
  { to: "/projects", label: "Projects", icon: Folder01Icon, keys: ["G", "P"] },
  { to: "/tasks", label: "Tasks", icon: TaskDaily01Icon, keys: ["G", "T"] },
  { to: "/team", label: "Team", icon: UserGroup03Icon, keys: ["G", "M"] },
]

export function AppSidebar({
  openSettings,
}: {
  openSettings: (tab?: string) => void
}) {
  const { setOpenMobile } = useSidebar()
  const { logout } = useFrappeAuth()
  const { user, isClient } = useUser()
  const { setTheme, resolvedTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { deleteDoc } = useFrappeDeleteDoc()
  const { updateDoc } = useFrappeUpdateDoc()

  const [editingView, setEditingView] = useState<HiveView | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [editEmoji, setEditEmoji] = useState("")
  const [editPublic, setEditPublic] = useState(false)
  const [editEmojiPickerOpen, setEditEmojiPickerOpen] = useState(false)

  const { data: savedViews, mutate: mutateSavedViews } = useFrappeGetDocList<HiveView>(
    "Hive View",
    {
      fields: ["name", "label", "emoji", "view_type", "filters_json", "is_public", "owner"],
      filters: [["is_public", "=", 1]],
      orderBy: { field: "creation", order: "asc" },
      limit: 50,
    },
  )

  const { data: myViews, mutate: mutateMyViews } = useFrappeGetDocList<HiveView>(
    "Hive View",
    {
      fields: ["name", "label", "emoji", "view_type", "filters_json", "is_public", "owner"],
      filters: [["is_public", "=", 0], ["owner", "=", user?.email || ""]],
      orderBy: { field: "creation", order: "asc" },
      limit: 50,
    },
    user?.email ? undefined : null,
  )

  const openEditDialog = useCallback((view: HiveView) => {
    setEditingView(view)
    setEditLabel(view.label)
    setEditEmoji(view.emoji || "")
    setEditPublic(view.is_public === 1)
  }, [])

  const handleEditView = useCallback(async () => {
    if (!editingView || !editLabel.trim()) return
    try {
      await updateDoc("Hive View", editingView.name, {
        label: editLabel.trim(),
        emoji: editEmoji || "",
        is_public: editPublic ? 1 : 0,
      })
      toast.success("View updated")
      setEditingView(null)
      mutateSavedViews()
      mutateMyViews()
    } catch {
      toast.error("Failed to update view")
    }
  }, [editingView, editLabel, editEmoji, editPublic, updateDoc, mutateSavedViews, mutateMyViews])

  const allViews = [...(savedViews ?? []), ...(myViews ?? [])]
  // Deduplicate by name
  const viewMap = new Map<string, HiveView>()
  for (const v of allViews) viewMap.set(v.name, v)
  const views = Array.from(viewMap.values())

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-14 shrink-0 flex-row items-center border-b border-sidebar-border px-4">
        <span className="text-lg font-bold text-sidebar-foreground">Hive</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const hasViewId = new URLSearchParams(location.search).get("view_id")
                const isActive =
                  item.to === "/"
                    ? location.pathname === "/"
                    : item.to === "/tasks" && hasViewId
                      ? false
                      : location.pathname.startsWith(item.to)

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={
                        <NavLink
                          to={item.to}
                          end={item.to === "/"}
                          onClick={() => setOpenMobile(false)}
                        />
                      }
                      tooltip={`${item.label} (${item.keys.join(" ")})`}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        strokeWidth={2}
                        className="size-5"
                      />
                      <span>{item.label}</span>
                      <Kbd
                        keys={item.keys}
                        className="pointer-events-none ml-auto hidden opacity-40 group-data-[collapsible=icon]:hidden lg:inline-flex"
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              {/* Settings button — opens dialog, not a route (hidden for client users) */}
              {!isClient && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Settings"
                  onClick={() => {
                    setOpenMobile(false)
                    openSettings("profile")
                  }}
                >
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {views.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Views</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {views.map((view) => {
                  const filters = (() => {
                    try { return JSON.parse(view.filters_json || "{}") } catch { return {} }
                  })()
                  const params = new URLSearchParams()
                  params.set("view_id", view.name)
                  for (const [k, v] of Object.entries(filters)) {
                    if (v) params.set(k, v as string)
                  }
                  if (view.view_type === "kanban") params.set("view", "kanban")
                  const to = `/tasks?${params.toString()}`
                  const isActive = location.pathname === "/tasks" && new URLSearchParams(location.search).get("view_id") === view.name

                  const canDelete = view.owner === user?.email

                  return (
                    <SidebarMenuItem key={view.name}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={view.label}
                        onClick={() => {
                          setOpenMobile(false)
                          navigate(to)
                        }}
                      >
                        <span className="text-base leading-none">{view.emoji || "📋"}</span>
                        <span className="truncate">{view.label}</span>
                      </SidebarMenuButton>
                      {canDelete && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <SidebarMenuAction
                                showOnHover
                                className="text-muted-foreground"
                              />
                            }
                          >
                            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditDialog(view)
                              }}
                            >
                              <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={async (e) => {
                                e.stopPropagation()
                                try {
                                  await deleteDoc("Hive View", view.name)
                                  toast.success("View deleted")
                                  mutateSavedViews()
                                  mutateMyViews()
                                } catch {
                                  toast.error("Failed to delete view")
                                }
                              }}
                            >
                              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton size="lg" />}
              >
                <MemberAvatar size="sm" name={user?.full_name} image={user?.user_image} />
                <span className="truncate text-sm">{user?.full_name}</span>
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--anchor-width]"
              >
                <DropdownMenuItem
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                >
                  <HugeiconsIcon
                    icon={resolvedTheme === "dark" ? Sun02Icon : Moon02Icon}
                    strokeWidth={2}
                  />
                  {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open("https://github.com/BuildWithHussain/hive/issues/new", "_blank")}
                >
                  <HugeiconsIcon icon={Bug01Icon} strokeWidth={2} />
                  Raise an issue
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Dialog open={!!editingView} onOpenChange={(open) => {
        if (!open) {
          setEditingView(null)
          setEditEmojiPickerOpen(false)
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div>
                <Label>Emoji</Label>
                <Popover open={editEmojiPickerOpen} onOpenChange={setEditEmojiPickerOpen}>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        className="mt-1.5 flex h-9 w-16 items-center justify-center rounded-md border border-input bg-background text-lg hover:bg-accent transition-colors"
                      >
                        {editEmoji || "📋"}
                      </button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" side="bottom" align="start">
                    <LazyEmojiPicker
                      onEmojiClick={(emojiData) => {
                        setEditEmoji(emojiData.emoji)
                        setEditEmojiPickerOpen(false)
                      }}
                      theme={resolvedTheme === "dark" ? "dark" : "light"}
                      skinTonesDisabled
                      height={400}
                      width={350}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Label htmlFor="edit-view-label">Name</Label>
                <Input
                  id="edit-view-label"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="My urgent tasks"
                  className="mt-1.5"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editLabel.trim()) handleEditView()
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-view-public"
                checked={editPublic}
                onCheckedChange={(checked) => setEditPublic(checked === true)}
              />
              <Label htmlFor="edit-view-public" className="text-sm font-normal">
                Public — visible to all team members
              </Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleEditView} disabled={!editLabel.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
