<template>
	<article
		class="flex flex-col gap-3 rounded-4 border bg-surface-base p-4"
		:class="overdue.length ? 'border-outline-red-2' : 'border-outline-gray-1'"
	>
		<header class="flex items-center gap-3">
			<MemberAvatar
				:name="member.member_name"
				:user="member.user"
				:image="member.user_image"
			/>
			<div class="min-w-0 flex-1">
				<p class="truncate text-base font-medium text-ink-gray-8">
					{{ member.member_name }}
				</p>
				<p v-if="member.designation" class="truncate text-sm text-ink-gray-5">
					{{ member.designation }}
				</p>
			</div>
			<div class="flex shrink-0 items-center gap-1.5">
				<Badge
					v-if="overdue.length"
					theme="red"
					variant="subtle"
					size="sm"
					:label="`${overdue.length} overdue`"
				/>
				<Badge
					v-if="completed.length"
					theme="green"
					variant="subtle"
					size="sm"
					:label="`${completed.length} done`"
				/>
			</div>
		</header>

		<p v-if="!overdue.length && !completed.length" class="text-p-sm text-ink-gray-5">
			No overdue or completed tasks in this period.
		</p>

		<!-- `list-row-px-2` feeds the one hook the group header and the rows
		     both read, so the section labels line up with the titles under them.
		     No dividers: at five rows in a bordered card the group labels already
		     do the separating, and a rule under every line reads as noise. -->
		<List v-else class="list-row-px-2" divider="none" :row-height="32">
			<ListGroup v-if="overdue.length" :label="`Overdue (${overdue.length})`">
				<ListRow
					v-for="task in overdue.slice(0, TOP_N)"
					:key="task.name"
					:value="task.name"
					:to="taskRoute(task)"
				>
					<!-- A one-letter Badge here read as an avatar, which is what the
					     leading cell of a feed row normally holds. Priority is a signal
					     glyph everywhere else in the app; use the same one. -->
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
					:to="taskRoute(task)"
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
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { Badge, Tooltip } from 'frappe-ui'
import { List, ListCell, ListGroup, ListRow } from 'frappe-ui/list'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import { formatDate } from '@/lib/dates'
import { priorityColor, priorityIcon } from '@/lib/status'
import type { TaskPriority, TaskStatus } from '@/types'

/** A task as `get_team_stats` returns it, enriched with its project title. */
export interface TeamStatsTask {
	name: string
	title: string
	project: string
	project_title: string
	project_slug: string
	priority: TaskPriority
	status?: TaskStatus
	due_date?: string | null
	completed_on?: string | null
}

export interface TeamStatsMember {
	user: string
	member_name: string
	user_image: string
	designation: string
	completed_tasks: TeamStatsTask[]
	overdue_tasks: TeamStatsTask[]
}

/** How many tasks of each kind a card lists before it collapses the rest. */
const TOP_N = 5

const props = defineProps<{ member: TeamStatsMember }>()

const overdue = computed(() => props.member.overdue_tasks ?? [])
const completed = computed(() => props.member.completed_tasks ?? [])

function taskRoute(task: TeamStatsTask): RouteLocationRaw {
	return {
		path: `/projects/${task.project_slug || task.project}`,
		query: { tab: 'tasks', task: task.name },
	}
}
</script>
