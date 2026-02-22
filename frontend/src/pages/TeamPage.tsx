import { useState, useMemo } from "react"
import { useFrappeGetCall } from "frappe-react-sdk"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroup03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface TeamMemberStats {
  user: string
  member_name: string
  user_image: string
  designation: string
  wip_count: number
  backlog_count: number
  blocked_count: number
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function TeamPage() {
  const [search, setSearch] = useState("")

  const { data: teamData, isLoading } = useFrappeGetCall<{
    message: TeamMemberStats[]
  }>("bwh_hive.bwh_hive.api.get_team_dashboard")

  const { data: staleData } = useFrappeGetCall<{ message: string[] }>(
    "bwh_hive.bwh_hive.api.get_stale_members",
  )
  const staleUsers = useMemo(() => new Set(staleData?.message ?? []), [staleData])

  const members = teamData?.message ?? []

  const filteredMembers = useMemo(() => {
    if (!search) return members
    const q = search.toLowerCase()
    return members.filter(
      (m) =>
        (m.member_name ?? "").toLowerCase().includes(q) ||
        (m.designation ?? "").toLowerCase().includes(q) ||
        m.user.toLowerCase().includes(q),
    )
  }, [members, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="mt-1 text-muted-foreground">
          Your team members and their workload.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Team Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <Skeleton className="h-16 flex-1 rounded-lg" />
                  <Skeleton className="h-16 flex-1 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <HugeiconsIcon icon={UserGroup03Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">
            {search ? "No members match your search" : "No team members yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? "Try a different search term." : "Add team members from Settings."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => {
            const isStale = staleUsers.has(member.user)

            return (
              <Card key={member.user} className={isStale ? "border-red-500/40" : ""}>
                <CardContent className="pt-6">
                  {/* Member identity */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="size-12">
                        {member.user_image && <AvatarImage src={member.user_image} />}
                        <AvatarFallback className="text-sm">
                          {member.member_name ? getInitials(member.member_name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      {isStale && (
                        <Tooltip>
                          <TooltipTrigger render={<span className="absolute -right-0.5 -top-0.5 flex size-3.5" />}>
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex size-3.5 rounded-full bg-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>No updates in 7+ days</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{member.member_name}</p>
                      {member.designation && (
                        <p className="text-xs text-muted-foreground truncate">
                          {member.designation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Task counts */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {member.wip_count}
                      </p>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">
                        WIP
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-100 dark:bg-gray-800/50 p-3 text-center">
                      <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                        {member.backlog_count}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400/70 font-medium">
                        Backlog
                      </p>
                    </div>
                  </div>

                  {/* Blocked indicator */}
                  {member.blocked_count > 0 && (
                    <div className="mt-2 rounded-lg bg-red-50 dark:bg-red-950/30 px-3 py-1.5 text-center">
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        {member.blocked_count} blocked
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
