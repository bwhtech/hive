<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<p class="text-sm text-ink-gray-5">
				{{ milestones.length }} {{ milestones.length === 1 ? 'milestone' : 'milestones' }}
			</p>
			<Button
				v-if="!isClient"
				icon-left="lucide-plus"
				label="Add Milestone"
				@click="openCreate"
			/>
		</div>

		<PageSkeleton v-if="loading" :rows="3" />

		<EmptyState
			v-else-if="!milestones.length"
			icon="lucide-target"
			title="No milestones yet"
			description="Create a milestone to track project progress."
		>
			<template v-if="!isClient" #action>
				<Button
					variant="solid"
					theme="gray"
					icon-left="lucide-plus"
					label="Add Milestone"
					@click="openCreate"
				/>
			</template>
		</EmptyState>

		<div v-else class="grid gap-3">
			<section
				v-for="milestone in milestones"
				:key="milestone.name"
				class="rounded-4 border border-outline-gray-1 bg-surface-base p-4"
			>
				<div class="flex items-start justify-between gap-4">
					<div class="min-w-0 space-y-1">
						<div class="flex items-center gap-1">
							<button
								type="button"
								class="flex min-w-0 items-center gap-1.5 text-ink-gray-8"
								:aria-expanded="expanded.has(milestone.name)"
								@click="toggle(milestone.name)"
							>
								<span
									class="lucide-chevron-down size-3.5 shrink-0 text-ink-gray-5 transition-transform"
									:class="{ '-rotate-90': !expanded.has(milestone.name) }"
									aria-hidden="true"
								/>
								<span class="truncate text-base font-medium">{{
									milestone.title
								}}</span>
							</button>
							<Button
								v-if="!isClient"
								variant="ghost"
								size="sm"
								icon="lucide-pencil"
								aria-label="Edit milestone"
								@click="openEdit(milestone)"
							/>
						</div>
						<p
							v-if="milestone.target_date"
							class="flex items-center gap-1.5 text-xs text-ink-gray-5"
						>
							<span class="lucide-calendar size-3.5" aria-hidden="true" />
							{{ formatDate(milestone.target_date) }}
						</p>
					</div>

					<Select
						v-if="!isClient"
						class="w-36 shrink-0"
						:model-value="milestone.status"
						:options="MILESTONE_STATUS_OPTIONS"
						aria-label="Milestone status"
						@update:model-value="setStatus(milestone, String($event))"
					/>
					<Badge
						v-else
						:label="milestone.status"
						:theme="milestoneStatusTheme(milestone.status)"
						variant="subtle"
					/>
				</div>

				<div class="mt-3">
					<div v-if="progress[milestone.name]?.tasks" class="space-y-1.5">
						<div class="flex items-center justify-between text-xs text-ink-gray-5">
							<span>
								{{ progress[milestone.name].doneTasks }}/{{
									progress[milestone.name].tasks
								}}
								tasks
							</span>
							<span>{{ progress[milestone.name].percent }}%</span>
						</div>
						<Progress :value="progress[milestone.name].percent" size="sm" />
					</div>
					<p v-else-if="summary(milestone)" class="line-clamp-2 text-sm text-ink-gray-6">
						{{ summary(milestone) }}
					</p>
					<p v-else class="text-xs text-ink-gray-5">No tasks linked</p>
				</div>

				<div
					v-if="expanded.has(milestone.name)"
					class="mt-3 border-t border-outline-gray-1 pt-2"
				>
					<MilestoneTaskList
						:tasks="tasksByMilestone[milestone.name] ?? []"
						@select="emit('select-task', $event)"
					/>
				</div>
			</section>
		</div>
	</div>

	<MilestoneDialog
		v-model:open="dialogOpen"
		:project="project"
		:milestone="editing"
		@saved="emit('changed')"
	/>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, Progress, Select, toast, useDoctype } from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import PageSkeleton from '@/components/common/PageSkeleton.vue'
import MilestoneDialog from '@/components/projects/MilestoneDialog.vue'
import MilestoneTaskList from '@/components/projects/MilestoneTaskList.vue'
import { useSession } from '@/composables/useSession'
import { formatDate } from '@/lib/dates'
import { groupTasksByMilestone, milestoneProgress } from '@/lib/milestones'
import { milestoneStatusTheme } from '@/lib/status'
import { stripHtml } from '@/lib/text'
import {
	MILESTONE_STATUSES,
	type HiveMilestone,
	type HiveTask,
	type MilestoneStatus,
} from '@/types'

const props = defineProps<{
	/** Hive Project docname. */
	project: string
	milestones: HiveMilestone[]
	tasks: HiveTask[]
	loading?: boolean
}>()

const emit = defineEmits<{
	'select-task': [task: HiveTask]
	/** A milestone was created, edited or moved; the page reloads its list. */
	changed: []
}>()

const MILESTONE_STATUS_OPTIONS = MILESTONE_STATUSES.map((status) => ({
	label: status,
	value: status,
}))

const { isClient } = useSession()
const milestoneDoctype = useDoctype<HiveMilestone>('Hive Milestone')

const tasksByMilestone = computed(() => groupTasksByMilestone(props.tasks))
const progress = computed(() => milestoneProgress(props.tasks))

const expanded = ref(new Set<string>())

function toggle(name: string) {
	const next = new Set(expanded.value)
	if (!next.delete(name)) next.add(name)
	expanded.value = next
}

function summary(milestone: HiveMilestone): string {
	return stripHtml(milestone.description)
}

const dialogOpen = ref(false)
const editing = ref<HiveMilestone | null>(null)

function openCreate() {
	editing.value = null
	dialogOpen.value = true
}

function openEdit(milestone: HiveMilestone) {
	editing.value = milestone
	dialogOpen.value = true
}

async function setStatus(milestone: HiveMilestone, status: string) {
	if (status === milestone.status) return
	try {
		await milestoneDoctype.setValue.submit({
			name: milestone.name,
			status: status as MilestoneStatus,
		})
		emit('changed')
	} catch {
		toast.error('Could not update the milestone')
	}
}
</script>
