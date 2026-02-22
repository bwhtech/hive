import { useCallback, useState } from "react"
import { Outlet } from "react-router"
import { AppSidebar } from "./Sidebar"
import { Header } from "./Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SettingsDialog } from "@/components/SettingsDialog"
import { CommandPalette, useCommandPalette } from "@/components/CommandPalette"
import { ShortcutHelpDialog } from "@/components/ShortcutHelpDialog"
import { useHotkey } from "@/hooks/use-hotkey"

export function AppLayout() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("profile")
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const commandPalette = useCommandPalette()

  const toggleShortcuts = useCallback(() => setShortcutsOpen((v) => !v), [])
  useHotkey("?", toggleShortcuts, { capture: true })

  const openSettings = (tab?: string) => {
    if (tab) setSettingsTab(tab)
    setSettingsOpen(true)
  }

  return (
    <SidebarProvider>
      <AppSidebar openSettings={openSettings} />
      <SidebarInset>
        <Header onOpenSearch={() => commandPalette.setOpen(true)} />
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
      <CommandPalette
        open={commandPalette.open}
        onOpenChange={commandPalette.setOpen}
        onOpenSettings={openSettings}
      />
      <ShortcutHelpDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </SidebarProvider>
  )
}
