import { useState, useEffect, useMemo } from "react"
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappePostCall,
} from "frappe-react-sdk"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Target02Icon,
  UserGroupIcon,
  UserAdd01Icon,
  CheckmarkCircle02Icon,
  Cancel02Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MemberAvatar } from "@/components/MemberAvatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { HiveProject, HiveMilestone, HiveMember, HiveTask } from "@/types"
import { TASK_SIZE_WEIGHT } from "@/types"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

interface OverviewTabProps {
  projectId: string
  project: HiveProject
  stats: {
    totalTasks: number
    inProgressTasks: number
    doneTasks: number
    blockedTasks: number
  }
  milestones: HiveMilestone[] | undefined
  tasks?: HiveTask[]
}

function getWeight(size: string | null | undefined): number {
  return TASK_SIZE_WEIGHT[size ?? ""] ?? 1
}

export function OverviewTab({ projectId, project, stats, milestones, tasks }: OverviewTabProps) {
  const { updateDoc } = useFrappeUpdateDoc()
  const { call: callDashboard, result: dashboardResult } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.get_project_dashboard",
  )

  const { data: allMembers } = useFrappeGetDocList<HiveMember>(
    "Hive Member",
    {
      fields: ["name", "user", "member_name", "user_image", "type", "is_active"],
      filters: [["is_active", "=", 1]],
      limit: 100,
    },
  )

  const [teamMembers, setTeamMembers] = useState<
    { member: string; member_name: string; role: string }[]
  >([])

  useEffect(() => {
    callDashboard({ project: projectId }).catch(() => {})
  }, [projectId, callDashboard])

  useEffect(() => {
    const members = (
      dashboardResult?.message as {
        members?: { member: string; member_name: string; role: string }[]
      }
    )?.members
    if (members) {
      setTeamMembers(members)
    }
  }, [dashboardResult])

  const saveProjectMembers = async (
    members: { member: string; member_name: string; role: string }[],
  ) => {
    try {
      await updateDoc("Hive Project", projectId, {
        members: members.map((m) => ({ member: m.member, role: m.role })),
      })
      callDashboard({ project: projectId }).catch(() => {})
    } catch {
      toast.error("Failed to update team")
    }
  }

  const toggleTeamMember = (member: HiveMember) => {
    const exists = teamMembers.some((m) => m.member === member.name)
    const next = exists
      ? teamMembers.filter((m) => m.member !== member.name)
      : [
          ...teamMembers,
          { member: member.name, member_name: member.member_name, role: "Member" },
        ]
    setTeamMembers(next)
    saveProjectMembers(next)
  }

  const changeTeamMemberRole = (memberName: string, role: string) => {
    const next = teamMembers.map((m) =>
      m.member === memberName ? { ...m, role } : m,
    )
    setTeamMembers(next)
    saveProjectMembers(next)
  }

  const removeTeamMember = (memberName: string) => {
    const next = teamMembers.filter((m) => m.member !== memberName)
    setTeamMembers(next)
    saveProjectMembers(next)
  }

  // Compute weighted progress per milestone
  const progressByMilestone = useMemo(() => {
    const map: Record<string, { total: number; done: number; taskCount: number; doneCount: number }> = {}
    if (!tasks) return map
    for (const task of tasks) {
      if (!task.milestone) continue
      if (!map[task.milestone]) {
        map[task.milestone] = { total: 0, done: 0, taskCount: 0, doneCount: 0 }
      }
      const w = getWeight(task.size)
      map[task.milestone].total += w
      map[task.milestone].taskCount += 1
      if (task.status === "Done") {
        map[task.milestone].done += w
        map[task.milestone].doneCount += 1
      }
    }
    return map
  }, [tasks])

  const { totalTasks, inProgressTasks, doneTasks, blockedTasks } = stats
  const activeMilestones = milestones?.filter((m) => m.status === "In Progress").length ?? 0

  return (
    <div className="space-y-6 pt-2">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Tasks" value={totalTasks} />
        <StatCard label="In Progress" value={inProgressTasks} />
        <StatCard label="Completed" value={doneTasks} />
        <StatCard label="Blocked" value={blockedTasks} variant={blockedTasks > 0 ? "destructive" : undefined} />
      </div>

      {/* Active Milestones & Team */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HugeiconsIcon icon={Target02Icon} strokeWidth={2} className="size-4" />
              Active Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeMilestones > 0 ? (
              <div className="space-y-3">
                {milestones
                  ?.filter((m) => m.status !== "Completed")
                  .slice(0, 5)
                  .map((ms) => {
                    const progress = progressByMilestone[ms.name]
                    const pct = progress && progress.total > 0
                      ? Math.round((progress.done / progress.total) * 100)
                      : 0
                    return (
                      <div key={ms.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span>{ms.title}</span>
                          <Badge
                            variant={ms.status === "In Progress" ? "secondary" : "outline"}
                            className="text-[10px] h-4 px-1.5"
                          >
                            {ms.status}
                          </Badge>
                        </div>
                        {progress && progress.total > 0 ? (
                          <div className="space-y-1">
                            <Progress value={pct} className="h-1.5" />
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>{progress.doneCount}/{progress.taskCount} tasks</span>
                              <span>{pct}%</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted-foreground">No tasks linked</p>
                        )}
                      </div>
                    )
                  })}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <HugeiconsIcon icon={Target02Icon} strokeWidth={1.5} className="size-8 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No active milestones</EmptyTitle>
                  <EmptyDescription>Create milestones to track project progress.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-4" />
              Team
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="ghost" size="icon-sm" className="ml-auto" />
                  }
                >
                  <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4" />
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="end">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {allMembers?.length ? (
                      allMembers.map((m) => {
                        const isAssigned = teamMembers.some(
                          (tm) => tm.member === m.name,
                        )
                        return (
                          <button
                            key={m.name}
                            type="button"
                            onClick={() => toggleTeamMember(m)}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors ${
                              isAssigned ? "bg-muted" : ""
                            }`}
                          >
                            <MemberAvatar size="sm" name={m.member_name || m.name} image={m.user_image} />
                            <span className="flex-1 truncate text-left">
                              {m.member_name || m.name}
                            </span>
                            {isAssigned && (
                              <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                strokeWidth={2}
                                className="size-4 text-primary"
                              />
                            )}
                          </button>
                        )
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground px-2 py-1">
                        No members found
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamMembers.length ? (
              <div className="space-y-2">
                {teamMembers.map((m) => {
                  const memberData = allMembers?.find(
                    (am) => am.name === m.member,
                  )
                  return (
                    <div
                      key={m.member}
                      className="flex items-center gap-2 text-sm"
                    >
                      <MemberAvatar size="sm" name={m.member_name || m.member} image={memberData?.user_image} />
                      <span className="flex-1 truncate">
                        {m.member_name || m.member}
                      </span>
                      <Select
                        value={m.role}
                        onValueChange={(role) =>
                          changeTeamMemberRole(m.member, role)
                        }
                      >
                        <SelectTrigger className="h-6 w-auto text-[10px] px-2 gap-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Member">Member</SelectItem>
                          <SelectItem value="Champion">Champion</SelectItem>
                          <SelectItem value="Stakeholder">
                            Stakeholder
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(m.member)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <HugeiconsIcon
                          icon={Cancel02Icon}
                          strokeWidth={2}
                          className="size-3.5"
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.5} className="size-8 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No team members</EmptyTitle>
                  <EmptyDescription>Add members using the button above.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string
  value: number
  variant?: "destructive"
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-2xl font-bold mt-1 ${
            variant === "destructive" ? "text-destructive" : ""
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
