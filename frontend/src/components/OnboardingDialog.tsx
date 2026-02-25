import { useState } from "react"
import {
  useFrappeGetDocList,
  useFrappeCreateDoc,
  useFrappePostCall,
  useFrappeUpdateDoc,
  useFrappeGetCall,
} from "frappe-react-sdk"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroupIcon,
  Building06Icon,
  Settings01Icon,
  SentIcon,
  Add01Icon,
  Cancel01Icon,
  Tick02Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useIsMobile } from "@/hooks/use-mobile"

const STEPS = [
  {
    id: "members",
    title: "Invite your team",
    description: "Add team members so you can collaborate on projects together.",
    icon: UserGroupIcon,
  },
  {
    id: "clients",
    title: "Add your clients",
    description: "Set up client organizations you work with.",
    icon: Building06Icon,
  },
  {
    id: "project-types",
    title: "Setup project types",
    description: "Categorize your projects to keep things organized.",
    icon: Settings01Icon,
  },
] as const

// --- Step content components ---

function InviteMembersStep() {
  const { call: inviteByEmail, loading: inviting } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.invite_member",
  )
  const {
    data: invitesData,
    mutate: mutateInvites,
  } = useFrappeGetCall<{ name: string; email: string }[]>(
    "frappe.core.api.user_invitation.get_pending_invitations",
    { app_name: "bwh_hive" },
  )
  const pendingInvites = invitesData?.message || []

  const [email, setEmail] = useState("")

  const handleInvite = async () => {
    const trimmed = email.trim()
    if (!trimmed) return
    try {
      await inviteByEmail({ email: trimmed, role: "Hive Team" })
      toast.success(`Invitation sent to ${trimmed}`)
      setEmail("")
      mutateInvites()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to send invitation"
      toast.error(message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="email@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleInvite() }}
          className="flex-1"
          autoFocus
        />
        <Button onClick={handleInvite} disabled={inviting || !email.trim()}>
          {inviting ? (
            <><Spinner className="mr-1.5" /> Sending...</>
          ) : (
            <><HugeiconsIcon icon={SentIcon} strokeWidth={2} className="size-4 mr-1.5" />Invite</>
          )}
        </Button>
      </div>
      {pendingInvites.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Pending invitations</p>
          <div className="flex flex-wrap gap-1.5">
            {pendingInvites.map((invite) => (
              <Badge key={invite.name} variant="secondary" className="text-xs">
                {invite.email}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AddClientsStep() {
  const {
    data: clients,
    mutate,
  } = useFrappeGetDocList<{ name: string; company_name: string }>("Hive Client", {
    fields: ["name", "company_name"],
    orderBy: { field: "creation", order: "asc" },
    limit_page_length: 0,
  })
  const { createDoc, loading: creating } = useFrappeCreateDoc()
  const [newClient, setNewClient] = useState("")

  const handleAdd = async () => {
    const trimmed = newClient.trim()
    if (!trimmed) return
    try {
      await createDoc("Hive Client", { company_name: trimmed })
      toast.success(`Client "${trimmed}" added`)
      setNewClient("")
      mutate()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to add client"
      toast.error(message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Company name..."
          value={newClient}
          onChange={(e) => setNewClient(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
          className="flex-1"
          autoFocus
        />
        <Button onClick={handleAdd} disabled={creating || !newClient.trim()}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4 mr-1.5" />
          Add
        </Button>
      </div>
      {clients && clients.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Your clients</p>
          <div className="flex flex-wrap gap-1.5">
            {clients.map((c) => (
              <Badge key={c.name} variant="secondary" className="text-xs">
                <HugeiconsIcon icon={Building06Icon} strokeWidth={2} className="size-3 mr-1" />
                {c.company_name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProjectTypesStep() {
  const {
    data: projectTypes,
    mutate,
  } = useFrappeGetDocList<{ name: string; type_name: string }>("Hive Project Type", {
    fields: ["name", "type_name"],
    filters: [["is_archived", "=", 0]],
    orderBy: { field: "creation", order: "asc" },
    limit_page_length: 0,
  })
  const { createDoc, loading: creating } = useFrappeCreateDoc()
  const { updateDoc } = useFrappeUpdateDoc()
  const [newType, setNewType] = useState("")

  const handleAdd = async () => {
    const trimmed = newType.trim()
    if (!trimmed) return
    try {
      await createDoc("Hive Project Type", { type_name: trimmed })
      toast.success(`Project type "${trimmed}" added`)
      setNewType("")
      mutate()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to add project type"
      toast.error(message)
    }
  }

  const handleDelete = async (name: string) => {
    try {
      await updateDoc("Hive Project Type", name, { is_archived: 1 })
      mutate()
      toast("Project type removed", {
        action: {
          label: "Undo",
          onClick: async () => {
            await updateDoc("Hive Project Type", name, { is_archived: 0 })
            mutate()
          },
        },
        duration: 6000,
      })
    } catch {
      toast.error("Failed to remove project type")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="e.g. Build, Hiring, Support..."
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
          className="flex-1"
          autoFocus
        />
        <Button onClick={handleAdd} disabled={creating || !newType.trim()}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4 mr-1.5" />
          Add
        </Button>
      </div>
      {projectTypes && projectTypes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Project types</p>
          <div className="flex flex-wrap gap-1.5">
            {projectTypes.map((pt) => (
              <Badge
                key={pt.name}
                variant="secondary"
                className="text-xs gap-1 pr-1"
              >
                {pt.type_name}
                <button
                  type="button"
                  onClick={() => handleDelete(pt.name)}
                  className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Main component ---

function OnboardingContent({
  onComplete,
}: {
  onComplete: () => void
}) {
  const [step, setStep] = useState(0)
  const isLastStep = step === STEPS.length
  const currentStep = STEPS[step]

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? (
                <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
              ) : (
                i + 1
              )}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-8 transition-colors ${
                  i < step ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
        {/* Final dot for "Let's Go" */}
        <div className="flex items-center gap-2">
          <div
            className={`h-px w-8 transition-colors ${
              step >= STEPS.length ? "bg-primary" : "bg-border"
            }`}
          />
          <div
            className={`flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
              isLastStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isLastStep ? (
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
            ) : (
              STEPS.length + 1
            )}
          </div>
        </div>
      </div>

      {/* Step content */}
      {isLastStep ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="text-3xl">🎉</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold">You're all set!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your workspace is ready. Start creating projects and managing tasks with your team.
            </p>
          </div>
          <Button size="lg" onClick={onComplete} className="mt-2 px-8">
            Let's Go!
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={currentStep.icon} strokeWidth={1.5} className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{currentStep.title}</h3>
              <p className="text-sm text-muted-foreground">{currentStep.description}</p>
            </div>
          </div>

          <div className="min-h-[120px]">
            {step === 0 && <InviteMembersStep />}
            {step === 1 && <AddClientsStep />}
            {step === 2 && <ProjectTypesStep />}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4 mr-1" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep((s) => s + 1)}>
                Skip
              </Button>
              <Button onClick={() => setStep((s) => s + 1)}>
                Next
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function OnboardingDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const { updateDoc } = useFrappeUpdateDoc()

  const handleComplete = async () => {
    try {
      await updateDoc("Hive Settings", "Hive Settings", {
        onboarding_completed: 1,
      })
      onOpenChange(false)
      toast.success("Welcome to Hive!")
    } catch {
      // Still close even if save fails — they can redo from settings
      onOpenChange(false)
    }
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Welcome to Hive</DrawerTitle>
            <DrawerDescription className="sr-only">
              Set up your workspace
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8 overflow-y-auto">
            <OnboardingContent onComplete={handleComplete} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to Hive</DialogTitle>
          <DialogDescription>
            Let's get your workspace set up in a few quick steps.
          </DialogDescription>
        </DialogHeader>
        <OnboardingContent onComplete={handleComplete} />
      </DialogContent>
    </Dialog>
  )
}
