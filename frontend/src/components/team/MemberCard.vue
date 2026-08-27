<template>
	<article
		class="rounded-4 border bg-surface-base p-4"
		:class="stale ? 'border-outline-red-2' : 'border-outline-gray-1'"
	>
		<button type="button" class="w-full text-left" :aria-expanded="expanded" @click="toggle">
			<header class="flex items-center gap-3">
				<div class="relative shrink-0">
					<MemberAvatar
						:name="member.member_name"
						:user="member.user"
						:image="member.user_image"
						size="xl"
					/>
					<Tooltip v-if="stale" text="No project update in 7 days">
						<span
							class="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-surface-red-5 ring-2 ring-surface-base"
							aria-label="No recent updates"
						/>
					</Tooltip>
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-base font-medium text-ink-gray-8">
						{{ member.member_name || member.user }}
					</p>
					<p v-if="member.designation" class="truncate text-sm text-ink-gray-5">
						{{ member.designation }}
					</p>
				</div>
				<span
					class="lucide-chevron-down size-4 shrink-0 text-ink-gray-5 transition-transform"
					:class="{ 'rotate-180': expanded }"
					aria-hidden="true"
				/>
			</header>

			<div
				class="mt-4 flex divide-x divide-outline-gray-1 rounded-3 border border-outline-gray-1"
			>
				<div class="flex-1 py-2.5 text-center">
					<p class="text-xl font-semibold text-ink-gray-9">{{ member.wip_count }}</p>
					<p class="text-xs text-ink-gray-5">Active</p>
				</div>
				<div class="flex-1 py-2.5 text-center">
					<p class="text-xl font-semibold text-ink-gray-9">{{ member.backlog_count }}</p>
					<p class="text-xs text-ink-gray-5">Backlog</p>
				</div>
				<div v-if="member.blocked_count" class="flex-1 py-2.5 text-center">
					<p class="text-xl font-semibold text-ink-red-6">{{ member.blocked_count }}</p>
					<p class="text-xs text-ink-gray-5">Blocked</p>
				</div>
			</div>

			<Tooltip
				v-if="member.trend !== 'stable'"
				:text="`${member.created_7d} new / ${member.completed_7d} completed in 7 days`"
			>
				<p class="mt-3 flex items-center gap-1.5 text-sm">
					<span
						:class="[
							member.trend === 'increasing'
								? 'lucide-trending-up text-ink-amber-3'
								: 'lucide-trending-down text-ink-green-3',
							'size-3.5',
						]"
						aria-hidden="true"
					/>
					<span
						:class="
							member.trend === 'increasing' ? 'text-ink-amber-3' : 'text-ink-green-3'
						"
					>
						{{
							member.trend === 'increasing'
								? 'Workload increasing'
								: 'Workload easing'
						}}
					</span>
				</p>
			</Tooltip>
		</button>

		<div v-if="expanded" class="mt-4 space-y-3 border-t border-outline-gray-1 pt-4">
			<div v-if="tasks.loading && !tasks.data" class="space-y-2">
				<Skeleton v-for="n in 3" :key="n" class="h-8 w-full" />
			</div>

			<template v-else-if="loaded">
				<TabButtons v-model="groupBy" :options="GROUP_OPTIONS" />

				<template v-if="!total">
					<p class="py-2 text-center text-sm text-ink-gray-5">No active tasks</p>
				</template>

				<template v-else-if="groupBy === 'status'">
					<section v-for="group in statusGroups" :key="group.label" class="space-y-1">
						<p class="text-xs font-medium uppercase tracking-wide text-ink-gray-5">
							{{ group.label }} ({{ group.tasks.length }})
						</p>
						<TaskRow
							v-for="task in group.tasks"
							:key="task.name"
							:task="task"
							show-project
						/>
					</section>
				</template>

				<template v-else>
					<section v-for="group in projectGroups" :key="group.project" class="space-y-1">
						<router-link
							class="text-xs font-medium uppercase tracking-wide text-ink-gray-5 hover:text-ink-gray-7"
							:to="`/projects/${group.project}`"
						>
							{{ group.title }} ({{ group.tasks.length }})
						</router-link>
						<TaskRow v-for="task in group.tasks" :key="task.name" :task="task" />
					</section>
				</template>
			</template>
		</div>
	</article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Skeleton, TabButtons, Tooltip, useCall } from 'frappe-ui'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import TaskRow from '@/components/team/TaskRow.vue'
import type { MemberTask, TeamMemberStats } from '@/components/team/types'

const props = defineProps<{
	member: TeamMemberStats
	/** No project update in the stale window; the card wears a dot for it. */
	stale?: boolean
}>()

const GROUP_OPTIONS = [
	{ label: 'By status', value: 'status' },
	{ label: 'By project', value: 'project' },
]

const expanded = ref(false)
const groupBy = ref('status')

const tasks = useCall<
	{ wip: MemberTask[]; backlog: MemberTask[]; blocked: MemberTask[] },
	{ user: string }
>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_member_tasks',
	method: 'POST',
	params: () => ({ user: props.member.user }),
	immediate: false,
})

const loaded = computed(() => Boolean(tasks.data))

/** The task list is only worth a request once someone opens the card. */
function toggle() {
	expanded.value = !expanded.value
	if (expanded.value && !tasks.data && !tasks.loading) tasks.reload()
}

const statusGroups = computed(() =>
	[
		{ label: 'In progress', tasks: tasks.data?.wip ?? [] },
		{ label: 'Backlog', tasks: tasks.data?.backlog ?? [] },
		{ label: 'Blocked', tasks: tasks.data?.blocked ?? [] },
	].filter((group) => group.tasks.length),
)

const allTasks = computed(() => [
	...(tasks.data?.wip ?? []),
	...(tasks.data?.backlog ?? []),
	...(tasks.data?.blocked ?? []),
])

const total = computed(() => allTasks.value.length)

const projectGroups = computed(() => {
	const groups = new Map<string, { project: string; title: string; tasks: MemberTask[] }>()
	for (const task of allTasks.value) {
		const group = groups.get(task.project)
		if (group) group.tasks.push(task)
		else
			groups.set(task.project, {
				project: task.project,
				title: task.project_title || task.project,
				tasks: [task],
			})
	}
	return [...groups.values()].sort((a, b) => b.tasks.length - a.tasks.length)
})
</script>
