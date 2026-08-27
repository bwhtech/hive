<template>
	<RichEditor
		v-model="content"
		kit="comment"
		:mentions="mentions"
		:placeholder="placeholder"
		content-class="min-h-28 px-3 py-2"
		submit-on-mod-enter
		@submit="post"
	>
		<template #actions>
			<div class="flex items-center gap-2">
				<span class="text-xs text-ink-gray-5">{{ hint }}</span>
				<Button
					label="Save draft"
					:loading="savingDraft"
					:disabled="isEmpty"
					@click="saveDraft"
				/>
				<Button
					variant="solid"
					theme="gray"
					label="Post"
					icon-left="lucide-send-horizontal"
					:loading="posting"
					:disabled="isEmpty"
					@click="post"
				/>
			</div>
		</template>
	</RichEditor>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Button, toast, useCall, useDoctype, useNewDoc } from 'frappe-ui'
import RichEditor, { type MentionItem } from '@/components/common/RichEditor.vue'
import { dayjs } from '@/lib/dates'
import { isEmptyHtml } from '@/lib/text'
import type { HiveProjectUpdate } from '@/types'

/** How long typing has to pause before the draft is written to the server. */
const AUTOSAVE_DELAY = 3000

const props = withDefaults(
	defineProps<{
		/** Hive Project docname the update belongs to. */
		project: string
		mentions?: MentionItem[]
		placeholder?: string
	}>(),
	{ placeholder: 'Share an update with the team…' },
)

const emit = defineEmits<{
	/** An update was published — the feed and the draft list are both stale. */
	posted: []
	/**
	 * The draft this composer owns, or `null` when it owns none. The tab keeps
	 * that draft out of the draft list so the same text is never on screen twice.
	 */
	'draft-changed': [name: string | null]
}>()

const updates = useDoctype<HiveProjectUpdate>('Hive Project Update')
const publish = useCall<{ name: string }, { update_name: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.publish_update',
	method: 'POST',
	immediate: false,
})

const content = ref('')
const draftName = ref<string | null>(null)
const savedAt = ref<Date | null>(null)
const autosaving = ref(false)
const savingDraft = ref(false)
const posting = ref(false)

const isEmpty = computed(() => isEmptyHtml(content.value))

const hint = computed(() => {
	if (autosaving.value) return 'Saving…'
	if (savedAt.value) return `Draft saved · ${dayjs(savedAt.value).format('HH:mm')}`
	return ''
})

let timer: ReturnType<typeof setTimeout> | null = null

function cancelAutosave() {
	if (!timer) return
	clearTimeout(timer)
	timer = null
}

watch(content, () => {
	cancelAutosave()
	if (isEmpty.value) return
	timer = setTimeout(() => void autosave(), AUTOSAVE_DELAY)
})

onBeforeUnmount(cancelAutosave)

/** Insert or update the backing draft and return its name. */
async function writeDraft(): Promise<string> {
	const text = content.value
	if (draftName.value) {
		await updates.setValue.submit({ name: draftName.value, content: text })
		return draftName.value
	}
	const draft = useNewDoc<HiveProjectUpdate>('Hive Project Update', {
		project: props.project,
		content: text,
		is_draft: 1,
	})
	const created = await draft.submit()
	return created.name
}

/**
 * The autosave in flight. Save Draft and Post wait on it, so a click landing
 * mid-autosave can never insert a second draft for the same text.
 */
let inflight: Promise<void> | null = null

/**
 * Silent save. A failure is deliberately swallowed: the text is still in the
 * editor and the next pause tries again — a toast here would fire on every
 * flaky keystroke.
 */
function autosave() {
	if (inflight || savingDraft.value || posting.value || isEmpty.value) return
	autosaving.value = true
	inflight = writeDraft()
		.then((name) => {
			draftName.value = name
			savedAt.value = new Date()
			emit('draft-changed', name)
		})
		.catch(() => {
			// Retried on the next pause in typing.
		})
		.finally(() => {
			inflight = null
			autosaving.value = false
		})
}

function reset() {
	cancelAutosave()
	content.value = ''
	draftName.value = null
	savedAt.value = null
	emit('draft-changed', null)
}

async function saveDraft() {
	if (isEmpty.value || savingDraft.value) return
	cancelAutosave()
	if (inflight) await inflight
	savingDraft.value = true
	try {
		await writeDraft()
		reset()
		toast.success('Draft saved')
	} catch {
		toast.error('Could not save draft')
	} finally {
		savingDraft.value = false
	}
}

async function post() {
	if (isEmpty.value || posting.value) return
	cancelAutosave()
	if (inflight) await inflight
	posting.value = true
	try {
		if (draftName.value) {
			// The autosaved draft is the document: update it, then flip it live so
			// the mention notifications fire off the published version.
			await writeDraft()
			await publish.submit({ update_name: draftName.value })
		} else {
			const update = useNewDoc<HiveProjectUpdate>('Hive Project Update', {
				project: props.project,
				content: content.value,
				is_draft: 0,
			})
			await update.submit()
		}
		reset()
		emit('posted')
		toast.success('Update posted')
	} catch {
		toast.error('Could not post update')
	} finally {
		posting.value = false
	}
}
</script>
