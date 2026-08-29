<template>
	<PageSkeleton v-if="activity.loading && !activity.data" :rows="5" />

	<EmptyState
		v-else-if="!items.length"
		icon="lucide-history"
		title="No activity yet"
		description="Changes to this project, its tasks and its milestones show up here."
	/>

	<div v-else class="space-y-2">
		<section v-for="day in days" :key="day.date">
			<button
				type="button"
				class="flex w-full items-center gap-2 py-2 text-left"
				:aria-expanded="!collapsed.has(day.date)"
				@click="toggle(day.date)"
			>
				<span
					class="lucide-chevron-down size-4 shrink-0 text-ink-gray-5 transition-transform"
					:class="{ '-rotate-90': collapsed.has(day.date) }"
					aria-hidden="true"
				/>
				<span class="text-sm font-medium text-ink-gray-8">{{ day.label }}</span>
				<Badge :label="String(day.items.length)" theme="gray" variant="subtle" />
			</button>

			<ol
				v-if="!collapsed.has(day.date)"
				class="ml-2 space-y-1 border-l border-outline-gray-1 pl-4"
			>
				<li
					v-for="(entry, index) in day.items"
					:key="`${entry.docname}-${index}`"
					class="py-1"
				>
					<div class="flex items-start gap-2">
						<MemberAvatar :name="entry.user_name" :image="entry.user_image" />
						<div class="min-w-0 flex-1">
							<p class="text-sm leading-snug text-ink-gray-7">
								<span class="font-medium text-ink-gray-8">{{
									entry.user_name
								}}</span>
								{{ ' ' }}{{ describe(entry) }}
								<span class="font-medium text-ink-gray-8">{{ entry.label }}</span>
								<span
									v-if="entry.old_value && entry.new_value"
									class="ml-1 inline-flex items-center gap-1 align-middle"
								>
									<Badge
										:label="truncate(entry.old_value, 30)"
										theme="gray"
										variant="outline"
									/>
									<span
										class="lucide-arrow-right size-3 text-ink-gray-5"
										aria-hidden="true"
									/>
									<Badge
										:label="truncate(entry.new_value, 30)"
										theme="gray"
										variant="outline"
									/>
								</span>
							</p>
							<p class="mt-0.5 text-xs text-ink-gray-5">
								{{ formatDate(entry.datetime, 'h:mm A') }}
							</p>
						</div>
					</div>
				</li>
			</ol>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Badge, useCall } from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import PageSkeleton from '@/components/common/PageSkeleton.vue'
import { formatDate, groupByDay } from '@/lib/dates'
import { truncate } from '@/lib/text'

interface ActivityEntry {
	type: string
	doctype: string
	docname: string
	label: string
	field?: string
	old_value?: string
	new_value?: string
	user: string
	user_name: string
	user_image?: string | null
	datetime: string
}

const props = defineProps<{
	/** Hive Project docname. */
	project: string
}>()

const ACTIVITY_LIMIT = 100

/** Frappe field names read as jargon in a sentence; these are the readable ones. */
const FIELD_LABELS: Record<string, string> = {
	client: 'client',
	completed_on: 'completed date',
	description: 'description',
	due_date: 'due date',
	github_repo: 'GitHub repo',
	is_archived: 'archived flag',
	is_private: 'visibility',
	milestone: 'milestone',
	priority: 'priority',
	project_type: 'type',
	size: 'size',
	slug: 'URL slug',
	start_date: 'start date',
	status: 'status',
	target_date: 'target date',
	title: 'title',
}

const DOC_LABELS: Record<string, string> = {
	project_changed: 'project',
	task_changed: 'task',
	milestone_changed: 'milestone',
}

const activity = useCall<ActivityEntry[], { project: string; limit: number }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_project_activity',
	method: 'POST',
	params: () => ({ project: props.project, limit: ACTIVITY_LIMIT }),
	immediate: false,
})

watch(
	() => props.project,
	(project) => project && activity.reload(),
	{ immediate: true },
)

const items = computed(() => activity.data ?? [])
const days = computed(() => groupByDay(items.value, (entry) => entry.datetime))

const collapsed = ref(new Set<string>())

function toggle(date: string) {
	const next = new Set(collapsed.value)
	if (!next.delete(date)) next.add(date)
	collapsed.value = next
}

/** The verb phrase before the document label, e.g. "changed status on task". */
function describe(entry: ActivityEntry): string {
	if (entry.type === 'task_created') return 'created task'
	if (entry.type === 'milestone_created') return 'created milestone'
	const field = FIELD_LABELS[entry.field ?? ''] ?? entry.field ?? 'a field'
	const doc = DOC_LABELS[entry.type] ?? 'record'
	return `changed ${field} on ${doc}`
}
</script>
