import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroup03Icon,
  Folder01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyWorkTab } from "@/components/dashboard/MyWorkTab"
import { ProjectsTab } from "@/components/dashboard/ProjectsTab"
import { TeamTab } from "@/components/dashboard/TeamTab"

export function DashboardPage() {
  const [tab, setTab] = useState("my")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your work, projects, and team.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="my">
            <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4" />
            My Work
          </TabsTrigger>
          <TabsTrigger value="projects">
            <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="team">
            <HugeiconsIcon icon={UserGroup03Icon} strokeWidth={2} className="size-4" />
            Team
          </TabsTrigger>
        </TabsList>

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
