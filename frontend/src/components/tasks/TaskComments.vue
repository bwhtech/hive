<template>
	<section class="space-y-3">
		<h3 class="text-sm font-medium text-ink-gray-6">Comments ({{ rows.length }})</h3>

		<p v-if="!rows.length && !comments.loading" class="text-sm text-ink-gray-5">
			No comments yet.
		</p>

		<List v-else-if="rows.length" :columns="['auto', 'minmax(0,1fr)']" divider="inset">
			<ListRow v-for="comment in rows" :key="comment.name" :value="comment.name">
				<ListCell class="py-2">
					<MemberAvatar
						:name="authorOf(comment).name"
						:image="authorOf(comment).image"
						size="sm"
					/>
				</ListCell>
				<ListCell>
					<div class="flex w-full min-w-0 flex-col gap-0.5 py-2">
						<div class="flex w-full items-center gap-2">
							<span class="truncate text-base font-medium text-ink-gray-8">
								{{ authorOf(comment).name }}
							</span>
							<span class="shrink-0 text-sm text-ink-gray-5">
								{{ fromNow(comment.creation) }}
							</span>
							<Button
								v-if="canDelete(comment)"
								class="ml-auto shrink-0"
								variant="ghost"
								icon="lucide-trash-2"
								aria-label="Delete comment"
								tooltip="Delete"
								@click="remove(comment)"
							/>
						</div>
						<!-- eslint-disable-next-line vue/no-v-html -- stored editor output, rendered the same way everywhere in the app -->
						<div class="hive-prose min-w-0 break-words" v-html="comment.content" />
					</div>
				</ListCell>
			</ListRow>
		</List>

		<RichEditor
			v-if="!readOnly"
			v-model="draft"
			kit="comment"
			placeholder="Write a comment… (@ to mention)"
			content-class="min-h-16 px-3 py-2"
			:mentions="mentions"
			submit-on-mod-enter
			@submit="post"
		>
			<template #actions>
				<Button
					variant="solid"
					theme="gray"
					label="Comment"
					:loading="posting"
					:disabled="isEmptyHtml(draft)"
					@click="post"
				/>
			</template>
		</RichEditor>
	</section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, toast, useList } from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import RichEditor, { type MentionItem } from '@/components/common/RichEditor.vue'
import { useArchiveWithUndo } from '@/composables/useArchiveWithUndo'
import { useSession } from '@/composables/useSession'
import { fromNow } from '@/lib/dates'
import { isEmptyHtml } from '@/lib/text'
import type { HiveMember, HiveTaskComment } from '@/types'

const props = withDefaults(
	defineProps<{
		taskName: string
		/** Active members, for mentions and for resolving author names. */
		members?: HiveMember[]
		readOnly?: boolean
	}>(),
	{ members: () => [], readOnly: false },
)

const { userId } = useSession()
const archive = useArchiveWithUndo('Hive Task Comment')

const draft = ref('')
const posting = ref(false)

const comments = useList<HiveTaskComment>({
	doctype: 'Hive Task Comment',
	fields: ['name', 'task', 'posted_by', 'content', 'is_archived', 'creation', 'modified'],
	filters: () => ({ task: props.taskName, is_archived: 0 }),
	orderBy: 'creation asc',
	limit: 100,
})

const rows = computed(() => comments.data ?? [])

const memberByUser = computed(() => {
	const map = new Map<string, HiveMember>()
	for (const member of props.members) map.set(member.user, member)
	return map
})

const mentions = computed<MentionItem[]>(() =>
	props.members.map((member) => ({
		id: member.user,
		label: member.member_name || member.user,
		image: member.user_image || undefined,
	})),
)

function authorOf(comment: HiveTaskComment) {
	const member = memberByUser.value.get(comment.posted_by)
	return {
		name: member?.member_name || comment.posted_by,
		image: member?.user_image || null,
	}
}

function canDelete(comment: HiveTaskComment) {
	return !props.readOnly && comment.posted_by === userId.value
}

async function post() {
	if (posting.value || isEmptyHtml(draft.value)) return
	posting.value = true
	try {
		await comments.insert.submit({ task: props.taskName, content: draft.value })
		draft.value = ''
		comments.reload()
	} catch {
		toast.error('Failed to add comment')
	} finally {
		posting.value = false
	}
}

function remove(comment: HiveTaskComment) {
	archive(comment.name, 'Comment', () => comments.reload())
}
</script>
