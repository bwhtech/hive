<template>
	<AppHeader title="Dev sandbox" />
	<div class="mx-auto max-w-2xl space-y-8 px-3 py-5 pb-10 sm:px-5">
		<section class="space-y-2">
			<h2 class="text-base font-medium text-ink-gray-8">LinkPicker (single)</h2>
			<LinkPicker v-model="project" doctype="Hive Project" label="Project" />
			<p class="text-sm text-ink-gray-5">Value: {{ project ?? '—' }}</p>
		</section>

		<section class="space-y-2">
			<h2 class="text-base font-medium text-ink-gray-8">LinkPicker (multiple)</h2>
			<LinkPicker v-model="members" doctype="Hive Member" label="Members" multiple />
			<p class="text-sm text-ink-gray-5">Value: {{ members.join(', ') || '—' }}</p>
		</section>

		<section class="space-y-2">
			<h2 class="text-base font-medium text-ink-gray-8">RichEditor (comment)</h2>
			<RichEditor v-model="comment" placeholder="Write a comment…" submit-on-mod-enter />
			<!-- eslint-disable-next-line vue/no-v-html -- editor output, same as every rendered comment in the app -->
			<div class="hive-prose rounded-4 border border-outline-gray-2 p-3" v-html="comment" />
		</section>

		<section class="space-y-2">
			<h2 class="text-base font-medium text-ink-gray-8">Badges and pickers</h2>
			<div class="flex flex-wrap items-center gap-2">
				<StatusBadge v-for="s in TASK_STATUSES" :key="s" :status="s" />
				<PriorityBadge v-for="p in TASK_PRIORITIES" :key="p" :priority="p" />
				<EmojiPicker v-model="emoji" />
				<AvatarStack :members="stackMembers" />
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePageMeta } from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import AvatarStack from '@/components/common/AvatarStack.vue'
import EmojiPicker from '@/components/common/EmojiPicker.vue'
import LinkPicker from '@/components/common/LinkPicker.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import RichEditor from '@/components/common/RichEditor.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { TASK_PRIORITIES, TASK_STATUSES } from '@/types'

usePageMeta(() => ({ title: 'Dev · Hive' }))

const project = ref<string | null>(null)
const members = ref<string[]>([])
const comment = ref('')
const emoji = ref('🎉')
const stackMembers = [
	{ user: 'a@example.com', name: 'Ada Lovelace' },
	{ user: 'b@example.com', name: 'Grace Hopper' },
	{ user: 'c@example.com', name: 'Alan Turing' },
	{ user: 'd@example.com', name: 'Edsger Dijkstra' },
]
</script>
