import { NavLink, useLocation } from "react-router"
import { useFrappeAuth } from "frappe-react-sdk"
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
} from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
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
  const { user } = useUser()
  const { setTheme, resolvedTheme } = useTheme()
  const location = useLocation()

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
              {/* Settings button — opens dialog, not a route */}
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
