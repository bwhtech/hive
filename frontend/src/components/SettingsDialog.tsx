import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings01Icon,
  UserGroup03Icon,
  UserCircleIcon,
  Building06Icon,
  GitBranchIcon,
} from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUser } from "@/context/UserContext"
import { ProfileSection } from "@/components/settings/ProfileSection"
import { GeneralSection } from "@/components/settings/GeneralSection"
import { MembersSection } from "@/components/settings/MembersSection"
import { ClientsSection } from "@/components/settings/ClientsSection"
import { GitHubSection } from "@/components/settings/GitHubSection"

const allSections = [
  { id: "profile", label: "Profile", icon: UserCircleIcon, teamOnly: false },
  { id: "general", label: "General", icon: Settings01Icon, teamOnly: true },
  { id: "members", label: "Members", icon: UserGroup03Icon, teamOnly: true },
  { id: "clients", label: "Clients", icon: Building06Icon, teamOnly: true },
  { id: "github", label: "GitHub", icon: GitBranchIcon, teamOnly: true },
] as const

function SettingsContent({
  activeTab,
  onTabChange,
  isMobile,
}: {
  activeTab: string
  onTabChange?: (tab: string) => void
  isMobile: boolean
}) {
  const { isClient } = useUser()
  const sections = allSections.filter((s) => !s.teamOnly || !isClient)
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      orientation={isMobile ? "horizontal" : "vertical"}
      className={
        isMobile
          ? "flex flex-col min-h-0 flex-1 gap-0"
          : "flex flex-row h-[min(85vh,750px)] gap-0"
      }
    >
      {!isMobile && (
        <div className="shrink-0 border-r border-border bg-muted/30 w-48">
          <div className="p-4 pb-2">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Settings
              </DialogTitle>
              <DialogDescription className="sr-only">
                Application settings
              </DialogDescription>
            </DialogHeader>
          </div>
          <TabsList className="w-full rounded-none bg-transparent px-2 pb-2 flex-col items-stretch h-auto">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="gap-2 justify-start"
              >
                <HugeiconsIcon
                  icon={section.icon}
                  strokeWidth={2}
                  className="size-4"
                />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      )}

      {isMobile && (
        <div className="shrink-0 border-b border-border">
          <TabsList className="w-full rounded-none bg-transparent px-2 pb-2 overflow-x-auto [scrollbar-width:none]">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="gap-2 justify-center shrink-0"
              >
                <HugeiconsIcon
                  icon={section.icon}
                  strokeWidth={2}
                  className="size-4"
                />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      )}

      {isMobile ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="profile" className="flex flex-col m-0">
            <ProfileSection />
          </TabsContent>
          {!isClient && (
            <>
              <TabsContent value="general" className="flex flex-col m-0">
                <GeneralSection />
              </TabsContent>
              <TabsContent value="members" className="flex flex-col m-0">
                <MembersSection />
              </TabsContent>
              <TabsContent value="clients" className="flex flex-col m-0">
                <ClientsSection />
              </TabsContent>
              <TabsContent value="github" className="flex flex-col m-0">
                <GitHubSection />
              </TabsContent>
            </>
          )}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <TabsContent value="profile" className="flex flex-1 flex-col overflow-hidden m-0">
            <ProfileSection />
          </TabsContent>
          {!isClient && (
            <>
              <TabsContent value="general" className="flex flex-1 flex-col overflow-hidden m-0">
                <GeneralSection />
              </TabsContent>
              <TabsContent value="members" className="flex flex-1 flex-col overflow-hidden m-0">
                <MembersSection />
              </TabsContent>
              <TabsContent value="clients" className="flex flex-1 flex-col overflow-hidden m-0">
                <ClientsSection />
              </TabsContent>
              <TabsContent value="github" className="flex flex-1 flex-col overflow-hidden m-0">
                <GitHubSection />
              </TabsContent>
            </>
          )}
        </div>
      )}
    </Tabs>
  )
}

export function SettingsDialog({
  open,
  onOpenChange,
  activeTab = "profile",
  onTabChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription className="sr-only">
              Application settings
            </DrawerDescription>
          </DrawerHeader>
          <SettingsContent
            activeTab={activeTab}
            onTabChange={onTabChange}
            isMobile={true}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <SettingsContent
          activeTab={activeTab}
          onTabChange={onTabChange}
          isMobile={false}
        />
      </DialogContent>
    </Dialog>
  )
}
