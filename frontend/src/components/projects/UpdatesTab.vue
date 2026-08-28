<template>
	<div class="mx-auto max-w-[770px] space-y-6 pb-10">
		<UpdateComposer
			:project="project"
			:mentions="mentions"
			@posted="onPosted"
			@draft-changed="onDraftChanged"
		/>

		<section v-if="visibleDrafts.length" class="space-y-3">
			<h3 class="text-sm text-ink-gray-5">Your drafts</h3>
			<DraftCard
				v-for="draft in visibleDrafts"
				:key="draft.name"
				:draft="draft"
				:mentions="mentions"
				:publishing="busyDraft === draft.name"
				:saving="busyDraft === draft.name"
				@publish="publishDraft"
				@delete="deleteDraft"
				@save="saveDraft"
			/>
		</section>

		<LoadingText v-if="updates.loading && !updates.data" />

		<EmptyState
			v-else-if="!feed.length"
			title="No updates yet"
			description="Be the first to share a project update."
			icon="lucide-newspaper"
		/>

		<List v-else>
			<UpdateCard
				v-for="update in feed"
				:key="update.name"
				:update="update"
				:unread="unread.has(update.name)"
				:current-user="userId"
				:author-name="displayName(update.posted_by)"
				:author-image="memberImage(update.posted_by)"
				:names="names"
				@react="(emoji) => toggleReaction(update, emoji)"
			/>
		</List>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { LoadingText, toast, useCall, useDoctype, useList } from 'frappe-ui'
import { List } from 'frappe-ui/list'
import EmptyState from '@/components/common/EmptyState.vue'
import DraftCard from '@/components/projects/DraftCard.vue'
import UpdateCard from '@/components/projects/UpdateCard.vue'
import UpdateComposer from '@/components/projects/UpdateComposer.vue'
import { useArchiveWithUndo } from '@/composables/useArchiveWithUndo'
import { useSession } from '@/composables/useSession'
import type { HiveMember, HiveProjectUpdate, HiveUpdateReaction } from '@/types'

const props = defineProps<{
	/** Hive Project docname. */
	project: string
}>()

const emit = defineEmits<{
	/** Unpublished drafts the current user holds, for the tab's count badge. */
	'draft-count': [count: number]
}>()

const { userId } = useSession()

const members = useList<HiveMember>({
	doctype: 'Hive Member',
	fields: ['name', 'user', 'member_name', 'user_image'],
	filters: { is_active: 1 },
	limit: 100,
	cacheKey: 'hive-active-members',
})

const mentions = computed(() =>
	(members.data ?? []).map((member) => ({
		id: member.user,
		label: member.member_name || member.user,
		image: member.user_image || undefined,
	})),
)

const memberByUser = computed(() => {
	const map: Record<string, HiveMember> = {}
	for (const member of members.data ?? []) map[member.user] = member
	return map
})

/** user id → display name, handed to the cards for authors and reactors. */
const names = computed(() => {
	const map: Record<string, string> = {}
	for (const member of members.data ?? []) map[member.user] = member.member_name || member.user
	return map
})

function displayName(user: string): string {
	return names.value[user] || user.split('@')[0]
}

function memberImage(user: string): string | null {
	return memberByUser.value[user]?.user_image || null
}

const updates = useList<HiveProjectUpdate>({
	doctype: 'Hive Project Update',
	fields: [
		'name',
		'project',
		'posted_by',
		'content',
		'is_draft',
		'_seen',
		'creation',
		'modified',
		{ reactions: ['user', 'emoji'] },
	],
	filters: () => ({ project: props.project, is_draft: 0, is_archived: 0 }),
	orderBy: 'creation desc',
	limit: 100,
})

const drafts = useList<HiveProjectUpdate>({
	doctype: 'Hive Project Update',
	fields: ['name', 'project', 'posted_by', 'content', 'is_draft', 'creation', 'modified'],
	filters: () => ({
		project: props.project,
		is_draft: 1,
		is_archived: 0,
		posted_by: userId.value,
	}),
	orderBy: 'modified desc',
	limit: 20,
})

const feed = computed(() => updates.data ?? [])

/** The draft the composer is currently holding — it is on screen there already. */
const composerDraft = ref<string | null>(null)
const visibleDrafts = computed(() =>
	(drafts.data ?? []).filter((draft) => draft.name !== composerDraft.value),
)

watch(
	() => drafts.data?.length ?? 0,
	(count) => emit('draft-count', count),
	{ immediate: true },
)

/*
 * Unread is resolved once per loaded row and then frozen: `mark_updates_seen`
 * makes every row seen server-side straight away, so re-deriving it would wipe
 * the highlight the reader is meant to notice.
 */
const unread = ref(new Set<string>())
const markSeen = useCall<null, { project: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.mark_updates_seen',
	method: 'POST',
	immediate: false,
})
let markedSeen = false

watch(
	() => [updates.data, userId.value] as const,
	([rows, user]) => {
		if (markedSeen || !user || !rows?.length) return
		for (const row of rows) {
			if (!seenBy(row).includes(user)) unread.value.add(row.name)
		}
		if (!unread.value.size) return
		markedSeen = true
		markSeen.submit({ project: props.project }).catch(() => {
			// Nothing to recover: the rows stay unread and the next visit retries.
		})
	},
	{ immediate: true },
)

function seenBy(update: HiveProjectUpdate): string[] {
	try {
		const seen = update._seen ? JSON.parse(update._seen) : []
		return Array.isArray(seen) ? seen : []
	} catch {
		return []
	}
}

const updateDoctype = useDoctype<HiveProjectUpdate>('Hive Project Update')
const publish = useCall<{ name: string }, { update_name: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.publish_update',
	method: 'POST',
	immediate: false,
})
const archiveWithUndo = useArchiveWithUndo('Hive Project Update')

const busyDraft = ref<string | null>(null)

function onPosted() {
	composerDraft.value = null
	updates.reload()
	drafts.reload()
}

function onDraftChanged(name: string | null) {
	composerDraft.value = name
	drafts.reload()
}

async function toggleReaction(update: HiveProjectUpdate, emoji: string) {
	try {
		const reactions = (await updateDoctype.runDocMethod.submit({
			name: update.name,
			method: 'toggle_reaction',
			params: { emoji },
		})) as HiveUpdateReaction[] | null
		// The method answers with the new child table, so the row can be patched
		// without refetching the whole feed.
		updates.updateRow({
			name: update.name,
			reactions: (reactions ?? []).map(({ user, emoji: value }) => ({ user, emoji: value })),
		})
	} catch {
		toast.error('Could not toggle reaction')
	}
}

async function publishDraft(name: string) {
	busyDraft.value = name
	try {
		await publish.submit({ update_name: name })
		updates.reload()
		drafts.reload()
		toast.success('Update published')
	} catch {
		toast.error('Could not publish update')
	} finally {
		busyDraft.value = null
	}
}

async function saveDraft(name: string, content: string) {
	busyDraft.value = name
	try {
		await drafts.setValue.submit({ name, content })
		toast.success('Draft updated')
	} catch {
		toast.error('Could not update draft')
	} finally {
		busyDraft.value = null
	}
}

/** Soft delete — the toast carries the Undo, so there is no confirm step. */
async function deleteDraft(name: string) {
	await archiveWithUndo(name, 'Draft', () => drafts.reload())
}
</script>
