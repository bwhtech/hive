import { useState } from "react"
import { Outlet } from "react-router"
import { AppSidebar } from "./Sidebar"
import { Header } from "./Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SettingsDialog } from "@/components/SettingsDialog"

export function AppLayout() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("profile")

  const openSettings = (tab?: string) => {
    if (tab) setSettingsTab(tab)
    setSettingsOpen(true)
  }

  return (
    <SidebarProvider>
      <AppSidebar openSettings={openSettings} />
      <SidebarInset>
        <Header />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        activeTab={settingsTab}
        onTabChange={setSettingsTab}
      />
    </SidebarProvider>
  )
}
