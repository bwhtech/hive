<template>
	<div class="space-y-6">
		<!-- KPI strip: one row of four, divided rather than boxed. -->
		<div
			class="grid grid-cols-2 divide-outline-gray-1 rounded-5 border border-outline-gray-1 sm:grid-cols-4 sm:divide-x"
		>
			<div v-for="stat in stats" :key="stat.label" class="px-4 py-3">
				<p class="text-sm text-ink-gray-5">{{ stat.label }}</p>
				<p
					class="mt-1 text-2xl font-semibold"
					:class="stat.alert ? 'text-ink-red-6' : 'text-ink-gray-9'"
				>
					{{ stat.value }}
				</p>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<section class="space-y-3">
				<h2 class="flex items-center gap-2 text-base font-medium text-ink-gray-8">
					<span class="lucide-target size-4 text-ink-gray-5" aria-hidden="true" />
					Active milestones
				</h2>

				<EmptyState
					v-if="!activeMilestones.length"
					icon="lucide-target"
					title="No active milestones"
					description="Create milestones to track project progress."
				/>

				<div v-else class="space-y-3">
					<div
						v-for="milestone in activeMilestones"
						:key="milestone.name"
						class="space-y-1.5"
					>
						<div class="flex items-center justify-between gap-2">
							<button
								type="button"
								class="flex min-w-0 items-center gap-1.5 text-sm text-ink-gray-8"
								:aria-expanded="expanded.has(milestone.name)"
								@click="toggle(milestone.name)"
							>
								<span
									class="lucide-chevron-down size-3 shrink-0 text-ink-gray-5 transition-transform"
									:class="{ '-rotate-90': !expanded.has(milestone.name) }"
									aria-hidden="true"
								/>
								<span class="truncate">{{ milestone.title }}</span>
							</button>
							<Badge
								:label="milestone.status"
								:theme="milestoneStatusTheme(milestone.status)"
								variant="subtle"
							/>
						</div>

						<template v-if="progress[milestone.name]?.tasks">
							<Progress :value="progress[milestone.name].percent" size="sm" />
							<div class="flex items-center justify-between text-xs text-ink-gray-5">
								<span>
									{{ progress[milestone.name].doneTasks }}/{{
										progress[milestone.name].tasks
									}}
									tasks
								</span>
								<span>{{ progress[milestone.name].percent }}%</span>
							</div>
						</template>
						<p v-else class="text-xs text-ink-gray-5">No tasks linked</p>

						<div
							v-if="expanded.has(milestone.name)"
							class="border-t border-outline-gray-1 pt-1.5"
						>
							<MilestoneTaskList
								:tasks="tasksByMilestone[milestone.name] ?? []"
								@select="emit('select-task', $event)"
							/>
						</div>
					</div>
				</div>
			</section>

			<section class="space-y-3">
				<div class="flex items-center justify-between gap-2">
					<h2 class="flex items-center gap-2 text-base font-medium text-ink-gray-8">
						<span class="lucide-users size-4 text-ink-gray-5" aria-hidden="true" />
						Team
					</h2>
					<MultiSelect
						v-if="!isClient"
						class="w-52"
						:model-value="memberIds"
						:options="memberOptions"
						placeholder="Add members"
						aria-label="Project members"
						@update:model-value="setMembers($event as (string | number)[])"
					/>
				</div>

				<EmptyState
					v-if="!members.length"
					icon="lucide-users"
					title="No team members"
					:description="
						isClient
							? 'Nobody has been added to this project yet.'
							: 'Add members with the picker above.'
					"
				/>

				<ul v-else class="space-y-2">
					<li
						v-for="member in members"
						:key="member.member"
						class="flex items-center gap-2 text-sm"
					>
						<MemberAvatar
							:name="member.member_name || member.member"
							:image="memberImages[member.member]"
						/>
						<span class="min-w-0 flex-1 truncate text-ink-gray-8">
							{{ member.member_name || member.member }}
						</span>
						<Badge
							v-if="isClient"
							:label="member.role"
							theme="gray"
							variant="outline"
						/>
						<template v-else>
							<Select
								class="w-32"
								:model-value="member.role"
								:options="ROLE_OPTIONS"
								size="sm"
								aria-label="Project role"
								@update:model-value="setRole(member.member, String($event))"
							/>
							<Button
								variant="ghost"
								size="sm"
								icon="lucide-x"
								aria-label="Remove member"
								@click="removeMember(member.member)"
							/>
						</template>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
	Badge,
	Button,
	MultiSelect,
	Progress,
	Select,
	toast,
	useCall,
	useDoctype,
	useList,
} from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import MilestoneTaskList from '@/components/projects/MilestoneTaskList.vue'
import { useSession } from '@/composables/useSession'
import { groupTasksByMilestone, milestoneProgress } from '@/lib/milestones'
import { milestoneStatusTheme } from '@/lib/status'
import type { HiveMember, HiveMilestone, HiveProject, HiveProjectMember, HiveTask } from '@/types'

const props = defineProps<{
	/** Hive Project docname. */
	project: string
	milestones: HiveMilestone[]
	tasks: HiveTask[]
}>()

const emit = defineEmits<{ 'select-task': [task: HiveTask] }>()

const ROLE_OPTIONS = ['Member', 'Champion', 'Stakeholder'].map((role) => ({
	label: role,
	value: role,
}))

const { isClient } = useSession()
const projectDoctype = useDoctype<HiveProject>('Hive Project')

// -- stats ---------------------------------------------------------------

const stats = computed(() => {
	let inProgress = 0
	let done = 0
	let blocked = 0
	for (const task of props.tasks) {
		if (task.status === 'In Progress') inProgress += 1
		else if (task.status === 'Done') done += 1
		else if (task.status === 'Blocked') blocked += 1
	}
	return [
		{ label: 'Total tasks', value: props.tasks.length, alert: false },
		{ label: 'In progress', value: inProgress, alert: false },
		{ label: 'Completed', value: done, alert: false },
		{ label: 'Blocked', value: blocked, alert: blocked > 0 },
	]
})

// -- milestones ----------------------------------------------------------

const tasksByMilestone = computed(() => groupTasksByMilestone(props.tasks))
const progress = computed(() => milestoneProgress(props.tasks))

/** The overview only carries what is still open, capped so it stays a summary. */
const ACTIVE_MILESTONE_LIMIT = 5
const activeMilestones = computed(() =>
	props.milestones.filter((m) => m.status !== 'Completed').slice(0, ACTIVE_MILESTONE_LIMIT),
)

const expanded = ref(new Set<string>())

function toggle(name: string) {
	const next = new Set(expanded.value)
	if (!next.delete(name)) next.add(name)
	expanded.value = next
}

// -- team ----------------------------------------------------------------

// The member rows come from the dashboard call because the child table stores
// only ids; the call resolves the names in one round trip.
const dashboard = useCall<{ members: HiveProjectMember[] }, { project: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_project_dashboard',
	method: 'POST',
	params: () => ({ project: props.project }),
	immediate: false,
})

watch(
	() => props.project,
	() => props.project && dashboard.reload(),
	{ immediate: true },
)

const members = computed(() => dashboard.data?.members ?? [])
const memberIds = computed(() => members.value.map((m) => m.member))

const allMembers = useList<HiveMember>({
	doctype: 'Hive Member',
	fields: ['name', 'user', 'member_name', 'user_image', 'type', 'is_active'],
	filters: { is_active: 1 },
	orderBy: 'member_name asc',
	limit: 100,
	cacheKey: 'hive-active-members',
})

const memberOptions = computed(() =>
	(allMembers.data ?? []).map((member) => ({
		label: member.member_name || member.name,
		value: member.name,
	})),
)

const memberImages = computed(() =>
	Object.fromEntries((allMembers.data ?? []).map((m) => [m.name, m.user_image])),
)

async function saveMembers(rows: { member: string; role: string }[]) {
	try {
		// The child table only needs the link and the role; Frappe fetches the name.
		await projectDoctype.setValue.submit({
			name: props.project,
			members: rows as HiveProject['members'],
		})
		dashboard.reload()
	} catch {
		toast.error('Could not update the team')
	}
}

function setMembers(next: (string | number)[]) {
	const ids = next.map(String)
	const existing = new Map(members.value.map((m) => [m.member, m.role]))
	saveMembers(ids.map((id) => ({ member: id, role: existing.get(id) ?? 'Member' })))
}

function setRole(member: string, role: string) {
	saveMembers(
		members.value.map((m) => ({ member: m.member, role: m.member === member ? role : m.role })),
	)
}

function removeMember(member: string) {
	saveMembers(
		members.value
			.filter((m) => m.member !== member)
			.map((m) => ({ member: m.member, role: m.role })),
	)
}
</script>
