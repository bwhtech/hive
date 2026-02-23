import {
  useFrappeGetDocList,
  useFrappePostCall,
  useFrappeGetCall,
} from "frappe-react-sdk"
import { useState } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, SentIcon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HiveMember {
  name: string
  user: string
  member_name: string
  user_image: string | null
  type: "Team" | "Client"
  designation: string
  is_active: number
}

interface PendingInvitation {
  name: string
  email: string
  roles: string[]
}

export function MembersSection() {
  const {
    data: members,
    isLoading: membersLoading,
    mutate: mutateMembers,
  } = useFrappeGetDocList<HiveMember>("Hive Member", {
    fields: [
      "name",
      "user",
      "member_name",
      "user_image",
      "type",
      "designation",
      "is_active",
    ],
    filters: [["is_active", "=", 1]],
    orderBy: { field: "creation", order: "asc" },
    limit_page_length: 0,
  })

  const { call: inviteByEmail, loading: inviting } = useFrappePostCall(
    "frappe.core.api.user_invitation.invite_by_email",
  )
  const { call: cancelInvitation } = useFrappePostCall(
    "frappe.core.api.user_invitation.cancel_invitation",
  )
  const {
    data: invitesData,
    isLoading: invitesLoading,
    error: invitesError,
    mutate: mutateInvites,
  } = useFrappeGetCall<PendingInvitation[]>(
    "frappe.core.api.user_invitation.get_pending_invitations",
    { app_name: "bwh_hive" },
  )

  const pendingInvites = invitesData?.message || []
  const isAdmin = !invitesError
  const loading = membersLoading || invitesLoading

  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>("Hive Team")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const refreshAll = () => {
    mutateMembers()
    mutateInvites()
  }

  const handleInvite = async () => {
    const trimmed = email.trim()
    if (!trimmed) return
    try {
      await inviteByEmail({
        emails: trimmed,
        roles: [role],
        redirect_to_path: "/frontend",
        app_name: "bwh_hive",
      })
      toast.success(`Invitation sent to ${trimmed}`)
      setEmail("")
      refreshAll()
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to send invitation"
      toast.error(message)
    }
  }

  const handleCancel = async (inviteName: string, inviteEmail: string) => {
    try {
      await cancelInvitation({ name: inviteName, app_name: "bwh_hive" })
      toast.success(`Invitation to ${inviteEmail} cancelled`)
      refreshAll()
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to cancel invitation"
      toast.error(message)
    }
  }

  const filteredMembers = members?.filter((m) =>
    typeFilter === "all" ? true : m.type === typeFilter,
  )

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Invite */}
      {isAdmin && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Invite Member</h3>
            <p className="text-xs text-muted-foreground">
              Send an invitation email to add a new member.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="email@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInvite()
              }}
              className="flex-1"
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[140px]">
                <span data-slot="select-value" className="flex flex-1 text-left">
                  {role === "Hive Client" ? "Client" : "Team"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hive Team">Team</SelectItem>
                <SelectItem value="Hive Client">Client</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleInvite}
              disabled={inviting || !email.trim()}
            >
              <HugeiconsIcon
                icon={SentIcon}
                strokeWidth={2}
                className="size-4 mr-1.5"
              />
              {inviting ? "Sending..." : "Invite"}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="divide-y divide-border rounded-lg border border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Pending Invitations */}
          {isAdmin && pendingInvites.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Pending Invitations</h3>
              <ItemGroup className="rounded-lg border border-border divide-y divide-border">
                {pendingInvites.map((invite) => (
                  <Item key={invite.name} variant="default" className="px-4 py-3">
                    <ItemMedia>
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {invite.email[0].toUpperCase()}
                      </div>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{invite.email}</ItemTitle>
                      <ItemDescription>
                        <Badge
                          variant="secondary"
                          className="text-[10px]"
                        >
                          Pending
                        </Badge>
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCancel(invite.name, invite.email)
                        }
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
            </div>
          )}

          {/* Active Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Members
                {filteredMembers && filteredMembers.length > 0 &&
                  ` (${filteredMembers.length})`}
              </h3>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[100px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Team">Team</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filteredMembers && filteredMembers.length > 0 ? (
              <ItemGroup className="rounded-lg border border-border divide-y divide-border">
                {filteredMembers.map((member) => (
                  <Item key={member.name} variant="default" className="px-4 py-3">
                    <ItemMedia>
                      <MemberAvatar name={member.member_name || member.user} image={member.user_image} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{member.member_name || member.user}</ItemTitle>
                      <ItemDescription className="text-xs">
                        {member.user}
                        {member.designation && ` · ${member.designation}`}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="secondary" className="text-[10px]">
                        {member.type}
                      </Badge>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            ) : (
              <p className="text-sm text-muted-foreground">
                No members found.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
