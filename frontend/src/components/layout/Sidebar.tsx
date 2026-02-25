import { NavLink, useLocation, useNavigate } from "react-router"
import { useFrappeAuth, useFrappeGetDocList, useFrappeDeleteDoc } from "frappe-react-sdk"
import { toast } from "sonner"
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
                const isActive =
                  item.to === "/"
                    ? location.pathname === "/"
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
                  for (const [k, v] of Object.entries(filters)) {
                    if (v) params.set(k, v as string)
                  }
                  if (view.view_type === "kanban") params.set("view", "kanban")
                  const to = `/tasks${params.toString() ? `?${params.toString()}` : ""}`
                  const isActive = location.pathname === "/tasks" && location.search === `?${params.toString()}`

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
                        <SidebarMenuAction
                          showOnHover
                          className="text-muted-foreground hover:text-destructive"
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
                          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4" />
                        </SidebarMenuAction>
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
    </Sidebar>
  )
}
