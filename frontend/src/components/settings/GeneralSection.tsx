import {
  useFrappeGetDocList,
  useFrappeCreateDoc,
  useFrappeUpdateDoc,
} from "frappe-react-sdk"
import { useState, useCallback } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Add01Icon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCelebrationSettings, notify, CELEBRATION_KEYS } from "@/hooks/useCelebrationSettings"

interface HiveProjectType {
  name: string
  type_name: string
}

export function GeneralSection() {
  const { animation, sound } = useCelebrationSettings()

  const setAnimation = useCallback((v: boolean) => {
    localStorage.setItem(CELEBRATION_KEYS.ANIMATION_KEY, String(v))
    notify()
  }, [])

  const setSound = useCallback((v: boolean) => {
    localStorage.setItem(CELEBRATION_KEYS.SOUND_KEY, String(v))
    notify()
  }, [])

  const {
    data: projectTypes,
    isLoading,
    mutate,
  } = useFrappeGetDocList<HiveProjectType>("Hive Project Type", {
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
      const message =
        e instanceof Error ? e.message : "Failed to add project type"
      toast.error(message)
    }
  }

  const handleDelete = async (name: string, typeName: string) => {
    try {
      await updateDoc("Hive Project Type", name, { is_archived: 1 })
      mutate()
      toast(`Project type "${typeName}" removed`, {
        action: {
          label: "Undo",
          onClick: async () => {
            await updateDoc("Hive Project Type", name, { is_archived: 0 })
            mutate()
          },
        },
        duration: 6000,
      })
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to remove project type"
      toast.error(message)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Project Types</h3>
          <p className="text-xs text-muted-foreground">
            Manage the types of projects available in your workspace.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="e.g. Build, Hiring, Support..."
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
            }}
            className="flex-1"
          />
          <Button
            onClick={handleAdd}
            disabled={creating || !newType.trim()}
          >
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              className="size-4 mr-1.5"
            />
            Add
          </Button>
        </div>

        {isLoading ? (
          <div className="divide-y divide-border rounded-lg border border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="size-8 rounded-md" />
              </div>
            ))}
          </div>
        ) : projectTypes && projectTypes.length > 0 ? (
          <div className="divide-y divide-border rounded-lg border border-border">
            {projectTypes.map((pt) => (
              <div
                key={pt.name}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm">{pt.type_name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(pt.name, pt.type_name)}
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No project types yet. Add one above.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Task Completion</h3>
          <p className="text-xs text-muted-foreground">
            Configure what happens when a task is marked as done.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="celebration-animation" className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="text-sm font-medium">Play animation on task done</span>
              <span className="text-xs text-muted-foreground font-normal">
                Show a celebration animation when a task is marked as done
              </span>
            </Label>
            <Switch
              id="celebration-animation"
              checked={animation}
              onCheckedChange={setAnimation}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="celebration-sound" className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="text-sm font-medium">Play sound on task done</span>
              <span className="text-xs text-muted-foreground font-normal">
                Play a celebration sound when a task is marked as done
              </span>
            </Label>
            <Switch
              id="celebration-sound"
              checked={sound}
              onCheckedChange={setSound}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
