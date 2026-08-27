<template>
	<div class="space-y-6">
		<div class="h-80 rounded-4 border border-outline-gray-1 bg-surface-base p-4">
			<AreaChart
				title="Completed tasks"
				:subtitle="periodLabel"
				:data="timeSeries"
				x="date"
				y="completed"
				:x-axis="{ type: 'time' }"
				:y-axis="{ min: 0 }"
				:loading="loading"
				:error="errorMessage"
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

		<div v-if="loading" class="grid gap-4 sm:grid-cols-2">
			<Skeleton v-for="n in 4" :key="n" class="h-48 w-full rounded-4" />
		</div>

		<EmptyState
			v-else-if="!members.length"
			title="No team members yet"
			description="Team members added in Settings show up here."
			icon="lucide-users"
		/>

		<div v-else class="grid gap-4 sm:grid-cols-2">
			<MemberStatsCard v-for="member in members" :key="member.user" :member="member" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Skeleton, TabButtons, useCall } from 'frappe-ui'
import { AreaChart } from 'frappe-ui/charts'
import EmptyState from '@/components/common/EmptyState.vue'
import MemberStatsCard, { type TeamStatsMember } from '@/components/dashboard/MemberStatsCard.vue'

type Period = 'week' | 'month'

interface TeamStatsPoint {
	date: string
	completed: number
}

interface TeamStats {
	time_series: TeamStatsPoint[]
	members: TeamStatsMember[]
}

const periodOptions = [
	{ value: 'week', label: 'Week' },
	{ value: 'month', label: 'Month' },
]

const period = ref<Period>('week')

// `refetch` re-runs the call when the period lands in the query string.
const stats = useCall<TeamStats, { period: Period }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_team_stats',
	method: 'GET',
	params: () => ({ period: period.value }),
	refetch: true,
})

const loading = computed(() => stats.loading && !stats.data)
const errorMessage = computed(() => (stats.error ? 'Could not load team stats.' : null))
const timeSeries = computed(() => stats.data?.time_series ?? [])
const periodLabel = computed(() => (period.value === 'week' ? 'Last 7 days' : 'Last 30 days'))

/** Members needing attention first: most overdue, then most completed. */
const members = computed(() =>
	[...(stats.data?.members ?? [])].sort(
		(a, b) =>
			b.overdue_tasks.length - a.overdue_tasks.length ||
			b.completed_tasks.length - a.completed_tasks.length,
	),
)

function setPeriod(value: string | number) {
	period.value = value === 'month' ? 'month' : 'week'
}
</script>
