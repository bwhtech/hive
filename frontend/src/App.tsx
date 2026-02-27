import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router"
import { useFrappeAuth } from "frappe-react-sdk"
import { UserProvider } from "@/context/UserContext"
import { CelebrationProvider } from "@/hooks/useTaskCelebration"
import { AppLayout } from "@/components/layout/AppLayout"
import { Spinner } from "@/components/ui/spinner"

const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
)
const ProjectsPage = lazy(() =>
  import("@/pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage })),
)
const TasksPage = lazy(() =>
  import("@/pages/TasksPage").then((m) => ({ default: m.TasksPage })),
)
const TeamPage = lazy(() =>
  import("@/pages/TeamPage").then((m) => ({ default: m.TeamPage })),
)
const ProjectDetailPage = lazy(() =>
  import("@/pages/ProjectDetailPage").then((m) => ({ default: m.ProjectDetailPage })),
)
const TaskRedirectPage = lazy(() =>
  import("@/pages/TaskRedirectPage").then((m) => ({ default: m.TaskRedirectPage })),
)

function PageSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useFrappeAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (!currentUser || currentUser === "Guest") {
    window.location.href = "/login"
    return null
  }

  return (
    <UserProvider>
      <CelebrationProvider>{children}</CelebrationProvider>
    </UserProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Suspense fallback={<PageSpinner />}><DashboardPage /></Suspense>} />
        <Route path="projects" element={<Suspense fallback={<PageSpinner />}><ProjectsPage /></Suspense>} />
        <Route path="projects/:id" element={<Suspense fallback={<PageSpinner />}><ProjectDetailPage /></Suspense>} />
        <Route path="tasks" element={<Suspense fallback={<PageSpinner />}><TasksPage /></Suspense>} />
        <Route path="tasks/:id" element={<Suspense fallback={<PageSpinner />}><TaskRedirectPage /></Suspense>} />
        <Route path="team" element={<Suspense fallback={<PageSpinner />}><TeamPage /></Suspense>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
