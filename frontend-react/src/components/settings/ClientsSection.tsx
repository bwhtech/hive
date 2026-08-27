import {
  useFrappeGetDocList,
  useFrappeCreateDoc,
  useFrappeUpdateDoc,
  useFrappePostCall,
} from "frappe-react-sdk"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  ArrowLeft01Icon,
  Building06Icon,
  Cancel01Icon,
  SentIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item"
import { MemberAvatar } from "@/components/MemberAvatar"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
          <ItemGroup className="rounded-lg border border-border divide-y divide-border">
            {clients.map((client) => (
              <Item
                key={client.name}
                render={<button type="button" />}
                variant="default"
                className="px-4 py-3 text-left hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedClient(client.name)}
              >
                <ItemMedia>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                    <HugeiconsIcon
                      icon={Building06Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{client.company_name}</ItemTitle>
                </ItemContent>
                {!client.is_active && (
                  <ItemActions>
                    <Badge variant="secondary" className="text-[10px]">
                      Inactive
                    </Badge>
                  </ItemActions>
                )}
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <HugeiconsIcon icon={Building06Icon} strokeWidth={1.5} className="size-8 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No clients yet</EmptyTitle>
              <EmptyDescription>Add a client organization above to get started.</EmptyDescription>
            </EmptyHeader>
          </Empty>
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
  const {
    data: members,
    isLoading,
    mutate: mutateMembers,
  } = useFrappeGetDocList<HiveMember>(
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

  const {
    data: allMembers,
    mutate: mutateAll,
  } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: ["name", "user", "member_name", "user_image", "type", "designation"],
      filters: [["is_active", "=", 1]],
      limit_page_length: 0,
    },
  )

  const assignedNames = useMemo(() => new Set(members?.map((m) => m.name) ?? []), [members])
  const availableMembers = useMemo(() => allMembers?.filter((m) => !assignedNames.has(m.name)) ?? [], [allMembers, assignedNames])

  const { updateDoc } = useFrappeUpdateDoc()
  const { call: inviteClientMember, loading: inviting } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.invite_client_member",
  )

  const [inviteEmail, setInviteEmail] = useState("")

  const refreshAll = () => {
    mutateMembers()
    mutateAll()
  }

  const handleInvite = async () => {
    const trimmed = inviteEmail.trim()
    if (!trimmed) return
    try {
      await inviteClientMember({ email: trimmed, client: clientName })
      toast.success(`Invitation sent to ${trimmed}`)
      setInviteEmail("")
      refreshAll()
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to send invitation"
      toast.error(message)
    }
  }

  const handleAssign = async (memberName: string) => {
    try {
      await updateDoc("Hive Member", memberName, {
        type: "Client",
        client: clientName,
      })
      toast.success("Member assigned to client")
      refreshAll()
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to assign member"
      toast.error(message)
    }
  }

  const handleRemove = async (memberName: string) => {
    try {
      await updateDoc("Hive Member", memberName, { client: "" })
      toast.success("Member removed from client")
      refreshAll()
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to remove member"
      toast.error(message)
    }
  }

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

      {/* Invite new member to this client */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Invite New Member
        </h4>
        <div className="flex gap-2">
          <Input
            placeholder="email@example.com"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleInvite()
            }}
            className="flex-1"
          />
          <Button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail.trim()}
            size="sm"
          >
            {inviting ? (
              <>
                <Spinner className="mr-1.5" /> Sending...
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={SentIcon}
                  strokeWidth={2}
                  className="size-4 mr-1.5"
                />
                Invite
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Invited members will be auto-assigned to this client when they accept.
        </p>
      </div>

      {/* Assign existing members to this client */}
      {availableMembers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Add Existing Member
          </h4>
          <Select onValueChange={handleAssign}>
            <SelectTrigger>
              <SelectValue placeholder="Select a member to assign..." />
            </SelectTrigger>
            <SelectContent>
              {availableMembers.map((m) => (
                <SelectItem key={m.name} value={m.name}>
                  {m.member_name || m.user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
          <ItemGroup className="rounded-lg border border-border divide-y divide-border">
            {members.map((member) => (
              <Item key={member.name} variant="default" className="px-4 py-3">
                <ItemMedia>
                  <MemberAvatar name={member.member_name || member.user} image={member.user_image} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{member.member_name || member.user}</ItemTitle>
                  <ItemDescription className="text-xs">
                    {member.user}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(member.name)}
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.5} className="size-8 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No members assigned</EmptyTitle>
              <EmptyDescription>Use the dropdown above to assign members to this client.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  )
}
