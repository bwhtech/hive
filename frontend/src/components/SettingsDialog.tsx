import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings01Icon,
  UserGroup03Icon,
  UserCircleIcon,
  Building06Icon,
} from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { ProfileSection } from "@/components/settings/ProfileSection"
import { GeneralSection } from "@/components/settings/GeneralSection"
import { MembersSection } from "@/components/settings/MembersSection"
import { ClientsSection } from "@/components/settings/ClientsSection"

const sections = [
  { id: "profile", label: "Profile", icon: UserCircleIcon },
  { id: "general", label: "General", icon: Settings01Icon },
  { id: "members", label: "Members", icon: UserGroup03Icon },
  { id: "clients", label: "Clients", icon: Building06Icon },
] as const

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <Tabs
          value={activeTab}
          onValueChange={onTabChange}
          orientation={isMobile ? "horizontal" : "vertical"}
          className="flex flex-col md:flex-row h-[min(85vh,750px)] gap-0"
        >
          <div className="shrink-0 border-b border-border bg-muted/30 md:w-48 md:border-b-0 md:border-r">
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
            <TabsList className="w-full rounded-none bg-transparent px-2 pb-2 md:flex-col md:items-stretch md:h-auto">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="gap-2 justify-center md:justify-start"
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

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <TabsContent
              value="profile"
              className="flex flex-1 flex-col overflow-hidden m-0"
            >
              <ProfileSection />
            </TabsContent>
            <TabsContent
              value="general"
              className="flex flex-1 flex-col overflow-hidden m-0"
            >
              <GeneralSection />
            </TabsContent>
            <TabsContent
              value="members"
              className="flex flex-1 flex-col overflow-hidden m-0"
            >
              <MembersSection />
            </TabsContent>
            <TabsContent
              value="clients"
              className="flex flex-1 flex-col overflow-hidden m-0"
            >
              <ClientsSection />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
