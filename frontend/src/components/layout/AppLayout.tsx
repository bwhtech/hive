import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router"
import { useFrappeCreateDoc, useFrappeGetDoc } from "frappe-react-sdk"
import { toast } from "sonner"
import { AppSidebar } from "./Sidebar"
import { Header } from "./Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ShortcutHelpDialog } from "@/components/ShortcutHelpDialog"
import { CreateProjectDialog } from "@/components/CreateProjectDialog"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"
import { OnboardingDialog } from "@/components/OnboardingDialog"
import { useHotkey, useChordHotkey } from "@/hooks/use-hotkey"
import { useCommandPalette } from "@/hooks/useCommandPalette"
import { useCelebration } from "@/hooks/useTaskCelebration"
import { PinnedTasksDock } from "@/components/PinnedTasksDock"
import { OverdueTasksDialog } from "@/components/OverdueTasksDialog"
import { lazyWithRetry } from "@/utils/lazyWithRetry"

const SettingsDialog = lazyWithRetry(() =>
  import("@/components/SettingsDialog").then((m) => ({ default: m.SettingsDialog })),
)
const CommandPalette = lazyWithRetry(() =>
  import("@/components/CommandPalette").then((m) => ({ default: m.CommandPalette })),
)
const NotificationSheet = lazyWithRetry(() =>
  import("@/components/NotificationSheet").then((m) => ({ default: m.NotificationSheet })),
)

export function AppLayout() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("profile")
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [globalCreateTaskOpen, setGlobalCreateTaskOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const commandPalette = useCommandPalette()
  const navigate = useNavigate()
  const location = useLocation()
  const { createDoc } = useFrappeCreateDoc()

  // Onboarding: show dialog if not completed
  const { data: hiveSettings, mutate: mutateSettings } = useFrappeGetDoc<{
    onboarding_completed: 0 | 1
  }>("Hive Settings", "Hive Settings", undefined, { revalidateOnFocus: false })
  const [onboardingDismissed, setOnboardingDismissed] = useState(false)
  const showOnboarding = hiveSettings != null && !hiveSettings.onboarding_completed && !onboardingDismissed

  const { celebrate } = useCelebration()
  const toggleShortcuts = useCallback(() => setShortcutsOpen((v) => !v), [])
  useHotkey("?", toggleShortcuts, { capture: true })
  useHotkey("t", celebrate, { shift: true })

  // G then D/P/T/M navigation chord shortcuts
  const navChords = useMemo(
    () => ({
      d: () => navigate("/"),
      p: () => navigate("/projects"),
      t: () => navigate("/tasks"),
      m: () => navigate("/team"),
    }),
    [navigate],
  )
  useChordHotkey("g", navChords)

  // Close modals on route change (browser back/forward)
  useEffect(() => {
    setSettingsOpen(false)
  }, [location.pathname])

  const openSettings = (tab?: string) => {
    if (tab) setSettingsTab(tab)
    setSettingsOpen(true)
  }

  const handleCreateProject = useCallback(async (values: { title: string; project_type?: string; client?: string; is_private?: 0 | 1 }) => {
    try {
      const doc = await createDoc("Hive Project", {
        title: values.title,
        status: "Open",
        ...(values.project_type && { project_type: values.project_type }),
        ...(values.client && { client: values.client }),
        ...(values.is_private && { is_private: values.is_private }),
      })
      setCreateProjectOpen(false)
      toast.success("Project created")
      navigate(`/projects/${doc.name}`)
    } catch {
      toast.error("Failed to create project")
    }
  }, [createDoc, navigate])

  const handleCreateTask = useCallback(async (values: {
    title: string; priority: string; status: string;
    due_date?: string | null; start_date?: string | null;
    is_internal?: 0 | 1; assignees?: { member: string }[];
    project?: string;
  }) => {
    try {
      await createDoc("Hive Task", values)
      setGlobalCreateTaskOpen(false)
      toast.success("Task created")
      // If we're on the project page for this task, reload to show it
      const projectMatch = location.pathname.match(/\/projects\/([^/]+)/)
      const currentProject = projectMatch ? decodeURIComponent(projectMatch[1]) : null
      if (values.project && values.project === currentProject) {
        navigate(0) // refresh page
      }
    } catch {
      toast.error("Failed to create task")
    }
  }, [createDoc, location.pathname, navigate])

  const handleCmdkCreateTask = useCallback((projectId: string | null) => {
    if (projectId) {
      // In a project — use the project page's own dialog via query param
      navigate(`/projects/${projectId}?create_task=1`)
    } else {
      // Global — open the AppLayout-level dialog with project picker
      setGlobalCreateTaskOpen(true)
    }
  }, [navigate])

  const handleCmdkCreateFeatureRequest = useCallback((projectId: string) => {
    navigate(`/projects/${projectId}?tab=requests&create_feature_request=1`)
  }, [navigate])

  return (
    <SidebarProvider>
      <AppSidebar openSettings={openSettings} />
      <SidebarInset>
        <Header onOpenSearch={() => commandPalette.setOpen(true)} onOpenNotifications={() => setNotificationsOpen(true)} />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ openCreateProject: () => setCreateProjectOpen(true) }} />
        </div>
      </SidebarInset>
      <Suspense fallback={null}>
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          activeTab={settingsTab}
          onTabChange={setSettingsTab}
        />
      </Suspense>
      <Suspense fallback={null}>
        <CommandPalette
          open={commandPalette.open}
          onOpenChange={commandPalette.setOpen}
          onOpenSettings={openSettings}
          onCreateProject={() => setCreateProjectOpen(true)}
          onCreateTask={handleCmdkCreateTask}
          onCreateFeatureRequest={handleCmdkCreateFeatureRequest}
        />
      </Suspense>
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onSubmit={handleCreateProject}
      />
      <CreateTaskDialog
        open={globalCreateTaskOpen}
        onOpenChange={setGlobalCreateTaskOpen}
        onSubmit={handleCreateTask}
      />
      <ShortcutHelpDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
      <Suspense fallback={null}>
        <NotificationSheet
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
        />
      </Suspense>
      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={(open) => {
          if (!open) {
            setOnboardingDismissed(true)
            mutateSettings()
          }
        }}
      />
      <PinnedTasksDock />
      <OverdueTasksDialog />
    </SidebarProvider>
  )
}
