<template>
	<div class="space-y-4">
		<!-- Overdue and completed arrive with the page's stats call, so they
		     paint the instant the card opens; only the workload below needs a
		     request of its own. `list-row-px-2` is the one hook the group
		     headers and the rows both read, so labels line up with titles. -->
		<List
			v-if="overdue.length || completed.length"
			class="list-row-px-2"
			divider="none"
			:row-height="32"
		>
			<ListGroup v-if="overdue.length" :label="`Overdue (${overdue.length})`">
				<ListRow
					v-for="task in overdue.slice(0, TOP_N)"
					:key="task.name"
					:value="task.name"
					:to="statsTaskRoute(task)"
				>
					<!-- Priority is the signal glyph everywhere else in the app, so
					     the leading cell carries it here too. -->
					<ListCell>
						<Tooltip :text="task.priority ?? 'No priority'">
							<span
								class="size-4 shrink-0"
								:class="[priorityIcon(task.priority), priorityColor(task.priority)]"
								:aria-label="`Priority: ${task.priority ?? 'none'}`"
							/>
						</Tooltip>
					</ListCell>
					<ListCell>
						<span class="truncate text-base text-ink-gray-8">{{ task.title }}</span>
					</ListCell>
					<ListCell class="justify-end">
						<span v-if="task.due_date" class="shrink-0 text-sm text-ink-red-6">
							{{ formatDate(task.due_date, 'D MMM') }}
						</span>
					</ListCell>
				</ListRow>
				<p v-if="overdue.length > TOP_N" class="px-2 py-1.5 text-sm text-ink-gray-5">
					+{{ overdue.length - TOP_N }} more
				</p>
			</ListGroup>

			<ListGroup v-if="completed.length" :label="`Completed (${completed.length})`">
				<ListRow
					v-for="task in completed.slice(0, TOP_N)"
					:key="task.name"
					:value="task.name"
					:to="statsTaskRoute(task)"
				>
					<ListCell>
						<span class="lucide-check size-4 text-ink-green-6" aria-hidden="true" />
					</ListCell>
					<ListCell>
						<span class="truncate text-base text-ink-gray-5 line-through">
							{{ task.title }}
						</span>
					</ListCell>
					<ListCell class="justify-end">
						<Badge
							v-if="task.project_title"
							variant="outline"
							size="sm"
							:label="task.project_title"
						/>
					</ListCell>
				</ListRow>
				<p v-if="completed.length > TOP_N" class="px-2 py-1.5 text-sm text-ink-gray-5">
					+{{ completed.length - TOP_N }} more
				</p>
			</ListGroup>
		</List>

		<div class="space-y-2">
			<TabButtons v-model="groupBy" :options="GROUP_OPTIONS" />

			<div v-if="tasks.loading && !tasks.data" class="space-y-2">
				<Skeleton v-for="n in 3" :key="n" class="h-8 w-full rounded-4" />
			</div>

			<ErrorMessage v-else-if="tasks.error" message="Could not load these tasks." />

			<p v-else-if="!groups.length" class="py-2 text-center text-sm text-ink-gray-5">
				No open tasks
			</p>

			<List v-else class="list-row-px-2" divider="none" :row-height="32">
				<ListGroup
					v-for="group in groups"
					:key="group.key"
					:label="`${group.label} (${group.tasks.length})`"
				>
					<template #header>
						<!-- Grouped by project, the label is also the way into it. -->
						<RouterLink
							v-if="group.route"
							class="truncate hover:text-ink-gray-7"
							:to="group.route"
						>
							{{ group.label }} ({{ group.tasks.length }})
						</RouterLink>
						<span v-else class="truncate">
							{{ group.label }} ({{ group.tasks.length }})
						</span>
					</template>
					<ListRow
						v-for="task in group.tasks"
						:key="task.name"
						:value="task.name"
						:to="memberTaskRoute(task)"
					>
						<ListCell>
							<span
								class="size-2 rounded-full"
								:class="statusDotClass(task.status)"
								aria-hidden="true"
							/>
						</ListCell>
						<ListCell>
							<span class="truncate text-base text-ink-gray-8">{{ task.title }}</span>
						</ListCell>
						<ListCell class="justify-end">
							<!-- Grouping by status already says the status, so the row
							     spends its trailing cell on the project instead. -->
							<Badge
								v-if="groupBy === 'status' && task.project_title"
								variant="outline"
								size="sm"
								:label="task.project_title"
							/>
							<span v-else class="shrink-0 text-sm text-ink-gray-5">
								{{ task.status }}
							</span>
						</ListCell>
					</ListRow>
				</ListGroup>
			</List>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Badge, ErrorMessage, Skeleton, TabButtons, Tooltip, useCall } from 'frappe-ui'
import { List, ListCell, ListGroup, ListRow } from 'frappe-ui/list'
import { formatDate } from '@/lib/dates'
import { priorityColor, priorityIcon, statusDotClass } from '@/lib/status'
import type { MemberTask, TeamStatsTask } from '@/components/team/types'

/**
 * Everything a member card reveals when it is opened: the period's overdue and
 * completed tasks (handed down), and their current open workload (fetched).
 */
const props = defineProps<{
	user: string
	overdue: TeamStatsTask[]
	completed: TeamStatsTask[]
}>()

const GROUP_OPTIONS = [
	{ label: 'By status', value: 'status' },
	{ label: 'By project', value: 'project' },
]

/** How many tasks of each kind the period lists show before collapsing the rest. */
const TOP_N = 5

const groupBy = ref('status')

// The card only mounts this component the first time it is opened, so fetching
// on mount is what keeps a page of members down to one request per opened card.
const tasks = useCall<
	{ wip: MemberTask[]; backlog: MemberTask[]; blocked: MemberTask[] },
	{ user: string }
>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_member_tasks',
	method: 'POST',
	params: () => ({ user: props.user }),
})

interface TaskGroup {
	key: string
	label: string
	/** Set when the group stands for a project the reader can open. */
	route: RouteLocationRaw | null
	tasks: MemberTask[]
}

const statusGroups = computed<TaskGroup[]>(() =>
	[
		{ key: 'wip', label: 'In progress', route: null, tasks: tasks.data?.wip ?? [] },
		{ key: 'backlog', label: 'Backlog', route: null, tasks: tasks.data?.backlog ?? [] },
		{ key: 'blocked', label: 'Blocked', route: null, tasks: tasks.data?.blocked ?? [] },
	].filter((group) => group.tasks.length),
)

const allTasks = computed(() => [
	...(tasks.data?.wip ?? []),
	...(tasks.data?.backlog ?? []),
	...(tasks.data?.blocked ?? []),
])

const projectGroups = computed<TaskGroup[]>(() => {
	const groups = new Map<string, TaskGroup>()
	for (const task of allTasks.value) {
		const group = groups.get(task.project)
		if (group) group.tasks.push(task)
		else
			groups.set(task.project, {
				key: task.project,
				label: task.project_title || task.project,
				route: `/projects/${task.project}`,
				tasks: [task],
			})
	}
	return [...groups.values()].sort((a, b) => b.tasks.length - a.tasks.length)
})

const groups = computed(() =>
	groupBy.value === 'status' ? statusGroups.value : projectGroups.value,
)

/** `?task=` alone opens the task panel; the project page picks the tab itself. */
function memberTaskRoute(task: MemberTask): RouteLocationRaw {
	return { path: `/projects/${task.project}`, query: { task: task.name } }
}

function statsTaskRoute(task: TeamStatsTask): RouteLocationRaw {
	return {
		path: `/projects/${task.project_slug || task.project}`,
		query: { tab: 'tasks', task: task.name },
	}
}
</script>
