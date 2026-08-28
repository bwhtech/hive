<template>
	<div class="space-y-6">
		<!-- KPI strip: one bordered box, the three readings divided inside it. -->
		<div
			class="grid grid-cols-1 divide-y divide-outline-gray-2 rounded-4 border border-outline-gray-1 bg-surface-base sm:grid-cols-3 sm:divide-x sm:divide-y-0"
		>
			<div
				v-for="kpi in kpis"
				:key="kpi.title"
				class="p-4"
				data-testid="kpi"
				:data-kpi="kpi.title"
			>
				<NumberCard
					:title="kpi.title"
					:value="kpi.value"
					:loading="loading"
					:error="errorMessage"
					:card="false"
				/>
			</div>
		</div>

		<!-- `items-start` so a short list does not stretch to match the tall one. -->
		<div class="grid items-start gap-6 lg:grid-cols-2">
			<DashboardSection title="My tasks" icon="lucide-list-checks">
				<div v-if="loading" class="space-y-2 p-2">
					<Skeleton v-for="n in 5" :key="n" class="h-8 w-full" />
				</div>
				<EmptyState
					v-else-if="!taskGroups.length"
					title="No open tasks"
					description="Tasks assigned to you show up here."
					icon="lucide-list-checks"
				/>
				<!-- Without explicit tracks and a row height, rows collapse to the
				     height of their text and the status dot claims a third of the
				     row. -->
				<List v-else :columns="TASK_COLUMNS" :row-height="36">
					<ListGroup v-for="group in taskGroups" :key="group.project">
						<template #header>
							<RouterLink
								:to="`/projects/${group.project}`"
								class="truncate hover:text-ink-gray-7"
							>
								{{ group.project_title }}
							</RouterLink>
						</template>
						<ListRow
							v-for="task in group.tasks"
							:key="task.name"
							:value="task.name"
							:to="taskRoute(task)"
						>
							<ListCell>
								<span
									:class="['size-2 rounded-full', statusDotClass(task.status)]"
									aria-hidden="true"
								/>
							</ListCell>
							<ListCell>
								<span class="truncate text-base text-ink-gray-8">{{
									task.title
								}}</span>
							</ListCell>
							<ListCell class="justify-end">
								<span
									v-if="task.due_date"
									:class="[
										'shrink-0 text-sm',
										isOverdue(task.due_date)
											? 'text-ink-red-6'
											: 'text-ink-gray-5',
									]"
								>
									{{ dueLabel(task.due_date) }}
								</span>
							</ListCell>
						</ListRow>
					</ListGroup>
				</List>
			</DashboardSection>

			<DashboardSection title="Recent updates" icon="lucide-megaphone">
				<template v-if="unreadCount" #actions>
					<Badge
						theme="blue"
						variant="subtle"
						size="sm"
						:label="`${unreadCount} unread`"
					/>
				</template>
				<div v-if="loading" class="space-y-2 p-2">
					<Skeleton v-for="n in 4" :key="n" class="h-12 w-full" />
				</div>
				<EmptyState
					v-else-if="!updates.length"
					title="No recent updates"
					description="Updates from your projects show up here."
					icon="lucide-megaphone"
				/>
				<!-- No `columns`: the default feed template is leading media,
				     content, trailing, and it is also what makes the divider inset to
				     the text edge. Passing explicit tracks opts the whole list into a
				     full-width divider that cuts straight through the avatar. -->
				<List v-else>
					<ListRow
						v-for="update in updates"
						:key="update.name"
						:value="update.name"
						class="h-auto py-2"
						:to="{ path: `/projects/${update.project}`, query: { tab: 'updates' } }"
					>
						<!-- The project's avatar, not the author's: the row is read as
						     "which project is this from", and the author's name is
						     already the first thing in the text. -->
						<ListCell class="self-start">
							<ProjectAvatar
								:name="update.project"
								:title="update.project_title"
								:icon="update.project_icon"
								:color="update.project_color"
								size="xl"
								hide-tooltip
							/>
						</ListCell>

						<ListCell>
							<div class="min-w-0 flex-1">
								<!-- Each span truncates on its own; `truncate` on the flex
								     parent alone lets a long author name push the project
								     name out of the row entirely. -->
								<div class="flex min-w-0 items-center gap-1.5 text-sm">
									<span
										class="truncate"
										:class="
											update.is_unread
												? 'font-semibold text-ink-gray-9'
												: 'font-medium text-ink-gray-8'
										"
									>
										{{ update.posted_by_name }}
									</span>
									<span class="shrink-0 text-ink-gray-5">in</span>
									<span class="truncate font-medium text-ink-gray-7">
										{{ update.project_title }}
									</span>
								</div>
								<p class="mt-0.5 line-clamp-2 text-p-sm text-ink-gray-6">
									{{ preview(update.content) }}
								</p>
							</div>
						</ListCell>

						<!-- The unread dot rides with the timestamp. As a leading cell it
						     cost an always-there empty track and pushed the avatar out of
						     the media slot the divider insets past. -->
						<ListCell class="items-start justify-end gap-1.5 self-start pt-0.5">
							<span class="shrink-0 whitespace-nowrap text-sm text-ink-gray-5">
								{{ fromNow(update.creation) }}
							</span>
							<span
								v-if="update.is_unread"
								class="mt-1.5 size-2 shrink-0 rounded-full bg-surface-blue-3"
								:aria-label="`Unread update in ${update.project_title}`"
							/>
						</ListCell>
					</ListRow>
				</List>
			</DashboardSection>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Badge, Skeleton, useCall } from 'frappe-ui'
import { List, ListCell, ListGroup, ListRow } from 'frappe-ui/list'
import { NumberCard } from 'frappe-ui/charts'
import DashboardSection from '@/components/dashboard/DashboardSection.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ProjectAvatar from '@/components/common/ProjectAvatar.vue'
import { dueLabel, fromNow, isOverdue } from '@/lib/dates'
import { statusDotClass } from '@/lib/status'
import { stripHtml, truncate } from '@/lib/text'
import type { Bool, TaskPriority, TaskStatus } from '@/types'

/** Shape of `bwh_hive.bwh_hive.api.get_my_dashboard`. */
interface DashboardTask {
	name: string
	title: string
	project: string
	status: TaskStatus
	priority: TaskPriority
	due_date: string | null
	is_internal: Bool
}

interface DashboardTaskGroup {
	project: string
	project_title: string
	project_status: string
	tasks: DashboardTask[]
}

interface DashboardUpdate {
	name: string
	project: string
	project_title: string
	project_icon: string | null
	project_color: string | null
	posted_by: string
	posted_by_name: string
	content: string
	creation: string
	is_unread: boolean
}

interface MyDashboard {
	tasks_by_project: DashboardTaskGroup[]
	unread_count: number
	recent_updates: DashboardUpdate[]
}

/** Status dot, title, then the due date pinned to the right. */
const TASK_COLUMNS = ['1rem', 'minmax(0, 1fr)', 'auto']

/** Unread dot, project avatar, the update itself, then its age. */

/** Characters of stripped update text shown in the feed. */
const PREVIEW_LENGTH = 120

const dashboard = useCall<MyDashboard>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_my_dashboard',
	method: 'GET',
	cacheKey: 'my-dashboard',
})

const loading = computed(() => dashboard.loading && !dashboard.data)
const errorMessage = computed(() => (dashboard.error ? 'Could not load your dashboard.' : null))

const taskGroups = computed(() => dashboard.data?.tasks_by_project ?? [])
const updates = computed(() => dashboard.data?.recent_updates ?? [])
const unreadCount = computed(() => dashboard.data?.unread_count ?? 0)

const openTasks = computed(() =>
	taskGroups.value.reduce((total, group) => total + group.tasks.length, 0),
)
const inProgressTasks = computed(() =>
	taskGroups.value.reduce(
		(total, group) =>
			total + group.tasks.filter((task) => task.status === 'In Progress').length,
		0,
	),
)

const kpis = computed(() => [
	{ title: 'Open tasks', value: openTasks.value },
	{ title: 'In progress', value: inProgressTasks.value },
	{ title: 'Unread updates', value: unreadCount.value },
])

function taskRoute(task: DashboardTask): RouteLocationRaw {
	return { path: `/projects/${task.project}`, query: { tab: 'tasks', task: task.name } }
}

function preview(content: string): string {
	return truncate(stripHtml(content), PREVIEW_LENGTH)
}
</script>
