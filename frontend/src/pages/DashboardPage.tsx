import { useState, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroup03Icon,
  Folder01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { MyWorkTab } from "@/components/dashboard/MyWorkTab"
import { ProjectsTab } from "@/components/dashboard/ProjectsTab"
import { TeamTab } from "@/components/dashboard/TeamTab"

const dashboardTabs = [
  { value: "my", label: "My Work", icon: UserIcon },
  { value: "projects", label: "Projects", icon: Folder01Icon },
  { value: "team", label: "Team", icon: UserGroup03Icon },
] as const

const tabMap = new Map(dashboardTabs.map((t) => [t.value, t]))

export function DashboardPage() {
  const [tab, setTab] = useState("my")
  const isMobile = useIsMobile()
  const activeTab = useMemo(() => tabMap.get(tab) ?? dashboardTabs[0], [tab])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your work, projects, and team.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        {isMobile ? (
          <Select value={tab} onValueChange={setTab}>
            <SelectTrigger className="w-full">
              <span className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={activeTab.icon}
                  strokeWidth={2}
                  className="size-4"
                />
                {activeTab.label}
              </span>
            </SelectTrigger>
            <SelectContent>
              {dashboardTabs.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <HugeiconsIcon icon={t.icon} strokeWidth={2} className="size-4" />
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <TabsList>
            {dashboardTabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                <HugeiconsIcon icon={t.icon} strokeWidth={2} className="size-4" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        <TabsContent value="my" className="mt-4">
          <MyWorkTab />
        </TabsContent>
        <TabsContent value="projects" className="mt-4">
          <ProjectsTab />
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <TeamTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
