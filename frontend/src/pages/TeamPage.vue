<template>
	<AppHeader title="Team" />

	<div class="space-y-4 px-3 py-5 pb-10 sm:px-5">
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

		<div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<div
				v-for="n in 3"
				:key="n"
				class="space-y-4 rounded-4 border border-outline-gray-1 p-4"
			>
				<div class="flex items-center gap-3">
					<Skeleton class="size-10 rounded-full" />
					<div class="flex-1 space-y-1.5">
						<Skeleton class="h-4 w-24" />
						<Skeleton class="h-3 w-16" />
					</div>
				</div>
				<Skeleton class="h-16 w-full" />
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

		<div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<MemberCard
				v-for="member in filtered"
				:key="member.user"
				:member="member"
				:stale="staleUsers.has(member.user)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ErrorMessage, Skeleton, TextInput, useCall, usePageMeta } from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import MemberCard from '@/components/team/MemberCard.vue'
import type { TeamMemberStats } from '@/components/team/types'

usePageMeta(() => ({ title: 'Team · Hive' }))

const team = useCall<TeamMemberStats[]>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_team_dashboard',
	method: 'GET',
	cacheKey: 'team-dashboard',
})

const stale = useCall<string[]>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_stale_members',
	method: 'GET',
	cacheKey: 'stale-members',
})

const staleUsers = computed(() => new Set(stale.data ?? []))
const loading = computed(() => team.loading && !team.data)

const search = ref('')

const filtered = computed(() => {
	const needle = search.value.trim().toLowerCase()
	const members = team.data ?? []
	if (!needle) return members
	return members.filter((member) =>
		[member.member_name, member.designation, member.user].some((value) =>
			(value ?? '').toLowerCase().includes(needle),
		),
	)
})
</script>
