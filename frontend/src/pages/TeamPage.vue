<template>
	<AppHeader title="Team" />

	<!-- Dashboard geometry: this is the team's dashboard now that the Dashboard
	     page no longer carries one. -->
	<div class="mx-auto w-full max-w-4xl space-y-6 px-3 py-5 pb-10 sm:px-5">
		<div class="h-80 rounded-5 border border-outline-gray-1 bg-surface-base p-4">
			<AreaChart
				title="Completed tasks"
				:subtitle="periodLabel"
				:data="timeSeries"
				x="date"
				y="completed"
				:x-axis="{ type: 'time' }"
				:y-axis="{ min: 0 }"
				:loading="statsLoading"
				:error="statsError"
			>
				<template #actions>
					<TabButtons
						:options="periodOptions"
						:model-value="period"
						size="sm"
						@update:model-value="setPeriod"
					/>
				</template>
			</AreaChart>
		</div>

		<div class="space-y-4">
			<TextInput
				v-model="search"
				class="w-full sm:max-w-xs"
				placeholder="Search members…"
				aria-label="Search members"
			>
				<template #prefix>
					<span class="lucide-search size-4 text-ink-gray-5" aria-hidden="true" />
				</template>
			</TextInput>

			<div v-if="loading" class="grid gap-4 sm:grid-cols-2">
				<div
					v-for="n in 4"
					:key="n"
					class="space-y-4 rounded-5 border border-outline-gray-1 p-4"
				>
					<div class="flex items-center gap-3">
						<Skeleton class="size-10 rounded-full" />
						<div class="flex-1 space-y-1.5">
							<Skeleton class="h-4 w-24 rounded-full" />
							<Skeleton class="h-3 w-16 rounded-full" />
						</div>
					</div>
					<Skeleton class="h-16 w-full rounded-6" />
				</div>
			</div>

			<ErrorMessage v-else-if="team.error" message="Could not load the team." />

			<EmptyState
				v-else-if="!filtered.length"
				icon="lucide-users"
				:title="search ? 'No members match your search' : 'No team members yet'"
				:description="
					search ? 'Try a different search term.' : 'Invite team members from Settings.'
				"
			/>

			<!-- `items-start` so the card beside an opened one keeps its own height
			     instead of stretching to match it. -->
			<div v-else class="grid items-start gap-4 sm:grid-cols-2">
				<MemberCard v-for="member in filtered" :key="member.user" :member="member" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ErrorMessage, Skeleton, TabButtons, TextInput, useCall, usePageMeta } from 'frappe-ui'
import { AreaChart } from 'frappe-ui/charts'
import AppHeader from '@/components/shell/AppHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import MemberCard from '@/components/team/MemberCard.vue'
import type { TeamMemberStats, TeamMemberView, TeamStatsMember } from '@/components/team/types'

type Period = 'week' | 'month'

interface TeamStatsPoint {
	date: string
	completed: number
}

interface TeamStats {
	time_series: TeamStatsPoint[]
	members: TeamStatsMember[]
}

usePageMeta(() => ({ title: 'Team · Hive' }))

const periodOptions = [
	{ value: 'week', label: 'Week' },
	{ value: 'month', label: 'Month' },
]

const period = ref<Period>('week')
const search = ref('')

const team = useCall<TeamMemberStats[]>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_team_dashboard',
	method: 'GET',
	cacheKey: 'team-dashboard',
})

// One call feeds both the chart and every card's overdue/completed list, so the
// period toggle moves the whole page. `refetch` re-runs it on that change.
const stats = useCall<TeamStats, { period: Period }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_team_stats',
	method: 'GET',
	params: () => ({ period: period.value }),
	refetch: true,
})

const stale = useCall<string[]>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_stale_members',
	method: 'GET',
	cacheKey: 'stale-members',
})

const staleUsers = computed(() => new Set(stale.data ?? []))
const statsLoading = computed(() => stats.loading && !stats.data)
const statsError = computed(() => (stats.error ? 'Could not load team stats.' : null))
const loading = computed(() => (team.loading && !team.data) || statsLoading.value)

const timeSeries = computed(() => stats.data?.time_series ?? [])
const periodLabel = computed(() => (period.value === 'week' ? 'Last 7 days' : 'Last 30 days'))

const statsByUser = computed(
	() => new Map((stats.data?.members ?? []).map((member) => [member.user, member])),
)

/** The three team calls keyed by user, so a card holds one whole member. */
const members = computed<TeamMemberView[]>(() =>
	(team.data ?? []).map((member) => ({
		...member,
		overdue_tasks: statsByUser.value.get(member.user)?.overdue_tasks ?? [],
		completed_tasks: statsByUser.value.get(member.user)?.completed_tasks ?? [],
		stale: staleUsers.value.has(member.user),
	})),
)

/** Members needing attention first: most overdue, then most completed, then by name. */
const filtered = computed(() => {
	const needle = search.value.trim().toLowerCase()
	const matched = needle
		? members.value.filter((member) =>
				[member.member_name, member.designation, member.user].some((value) =>
					(value ?? '').toLowerCase().includes(needle),
				),
			)
		: members.value
	return [...matched].sort(
		(a, b) =>
			b.overdue_tasks.length - a.overdue_tasks.length ||
			b.completed_tasks.length - a.completed_tasks.length ||
			(a.member_name || a.user).localeCompare(b.member_name || b.user),
	)
})

function setPeriod(value: string | number) {
	period.value = value === 'month' ? 'month' : 'week'
}
</script>
