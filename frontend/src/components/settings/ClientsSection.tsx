import {
  useFrappeGetDocList,
  useFrappeCreateDoc,
} from "frappe-react-sdk"
import { useState } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  ArrowLeft01Icon,
  Building06Icon,
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface HiveClient {
  name: string
  company_name: string
  is_active: number
}

interface HiveMember {
  name: string
  user: string
  member_name: string
  user_image: string | null
  type: string
  designation: string
}

export function ClientsSection() {
  const {
    data: clients,
    isLoading,
    mutate,
  } = useFrappeGetDocList<HiveClient>("Hive Client", {
    fields: ["name", "company_name", "is_active"],
    orderBy: { field: "creation", order: "asc" },
    limit_page_length: 0,
  })
  const { createDoc, loading: creating } = useFrappeCreateDoc()

  const [newClient, setNewClient] = useState("")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  const handleAdd = async () => {
    const trimmed = newClient.trim()
    if (!trimmed) return
    try {
      await createDoc("Hive Client", { company_name: trimmed })
      toast.success(`Client "${trimmed}" added`)
      setNewClient("")
      mutate()
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to add client"
      toast.error(message)
    }
  }

  if (selectedClient) {
    return (
      <ClientMembersView
        clientName={selectedClient}
        onBack={() => setSelectedClient(null)}
      />
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Client Organizations</h3>
          <p className="text-xs text-muted-foreground">
            Manage client organizations and their members.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Company name..."
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
            }}
            className="flex-1"
          />
          <Button
            onClick={handleAdd}
            disabled={creating || !newClient.trim()}
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
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-4 w-32 flex-1" />
              </div>
            ))}
          </div>
        ) : clients && clients.length > 0 ? (
          <div className="divide-y divide-border rounded-lg border border-border">
            {clients.map((client) => (
              <button
                key={client.name}
                type="button"
                onClick={() => setSelectedClient(client.name)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                  <HugeiconsIcon
                    icon={Building06Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {client.company_name}
                  </p>
                </div>
                {!client.is_active && (
                  <Badge variant="secondary" className="text-[10px]">
                    Inactive
                  </Badge>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No clients yet. Add one above.
          </p>
        )}
      </div>
    </div>
  )
}

function ClientMembersView({
  clientName,
  onBack,
}: {
  clientName: string
  onBack: () => void
}) {
  const { data: members, isLoading } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: [
        "name",
        "user",
        "member_name",
        "user_image",
        "type",
        "designation",
      ],
      filters: [
        ["type", "=", "Client"],
        ["client", "=", clientName],
        ["is_active", "=", 1],
      ],
      limit_page_length: 0,
    },
  )

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            className="size-4"
          />
        </Button>
        <h3 className="text-sm font-semibold">{clientName}</h3>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Client Members
        </h4>
        {isLoading ? (
          <div className="divide-y divide-border rounded-lg border border-border">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="divide-y divide-border rounded-lg border border-border">
            {members.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 px-4 py-3"
              >
                {member.user_image ? (
                  <img
                    src={member.user_image}
                    alt={member.member_name}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {(member.member_name || member.user)[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.member_name || member.user}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No members assigned to this client yet.
          </p>
        )}
      </div>
    </div>
  )
}
