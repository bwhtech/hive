<template>
	<article class="rounded-4 border border-outline-gray-1 bg-surface-base p-4">
		<button type="button" class="w-full text-left" :aria-expanded="expanded" @click="toggle">
			<header class="flex items-center gap-3">
				<MemberAvatar
					:name="member.member_name"
					:user="member.user"
					:image="member.user_image"
					size="xl"
				/>
				<div class="min-w-0 flex-1">
					<p class="truncate text-base font-medium text-ink-gray-8">
						{{ member.member_name || member.user }}
					</p>
					<p v-if="member.designation" class="truncate text-sm text-ink-gray-5">
						{{ member.designation }}
					</p>
				</div>
				<!-- The two readings that decide whether this member needs looking
				     at. A badge says it on the members it is true of; a tint on the
				     card said it on all of them. -->
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

			<div v-if="member.trend !== 'stable' || member.stale" class="mt-3 space-y-1">
				<Tooltip
					v-if="member.trend !== 'stable'"
					:text="`${member.created_7d} new / ${member.completed_7d} completed in 7 days`"
				>
					<!-- Severity steps, not the -3 tints: at 13px those washed out
					     against a light surface. -->
					<p class="flex items-center gap-1.5 text-sm">
						<span
							:class="[
								member.trend === 'increasing'
									? 'lucide-trending-up text-ink-amber-7'
									: 'lucide-trending-down text-ink-green-6',
								'size-3.5',
							]"
							aria-hidden="true"
						/>
						<span
							:class="
								member.trend === 'increasing'
									? 'text-ink-amber-7'
									: 'text-ink-green-6'
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

				<!-- Quiet, and worded: a red dot on the avatar read as a notification
				     and never said what it was about. -->
				<p v-if="member.stale" class="flex items-center gap-1.5 text-sm text-ink-gray-5">
					<span class="lucide-clock size-3.5" aria-hidden="true" />
					<span>No project update in 7 days</span>
				</p>
			</div>
		</button>

		<!-- Kept mounted once opened, so its tasks are fetched once and its
		     grouping survives a collapse. -->
		<div v-if="everExpanded" v-show="expanded" class="mt-4 border-t border-outline-gray-1 pt-4">
			<MemberTasks :user="member.user" :overdue="overdue" :completed="completed" />
		</div>
	</article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Tooltip } from 'frappe-ui'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import MemberTasks from '@/components/team/MemberTasks.vue'
import type { TeamMemberView } from '@/components/team/types'

const props = defineProps<{ member: TeamMemberView }>()

const expanded = ref(false)
const everExpanded = ref(false)

const overdue = computed(() => props.member.overdue_tasks ?? [])
const completed = computed(() => props.member.completed_tasks ?? [])

function toggle() {
	expanded.value = !expanded.value
	if (expanded.value) everExpanded.value = true
}
</script>
