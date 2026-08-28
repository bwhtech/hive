<template>
	<div
		class="rounded-4 border border-outline-gray-2 bg-surface-gray-1 p-3"
		data-testid="draft-card"
		:data-draft="draft.name"
	>
		<div class="flex items-center gap-2">
			<Badge label="Draft" theme="gray" variant="subtle" size="sm" />
			<span class="text-xs text-ink-gray-5">Edited {{ fromNow(draft.modified) }}</span>
		</div>

		<template v-if="editing">
			<div class="mt-2">
				<RichEditor
					v-model="editContent"
					kit="comment"
					:mentions="mentions"
					placeholder="Edit your draft…"
					content-class="min-h-24 px-3 py-2"
				/>
			</div>
			<div class="mt-3 flex items-center justify-end gap-2">
				<Button label="Cancel" variant="ghost" @click="editing = false" />
				<Button
					variant="solid"
					theme="gray"
					label="Save"
					:loading="saving"
					:disabled="isEmpty"
					@click="save"
				/>
			</div>
		</template>

		<template v-else>
			<!-- eslint-disable-next-line vue/no-v-html -- editor output, same as every rendered update -->
			<div class="hive-prose mt-2" v-html="draft.content" />
			<div class="mt-3 flex items-center justify-end gap-2">
				<Button label="Delete" variant="ghost" @click="emit('delete', draft.name)" />
				<Button label="Edit" icon-left="lucide-pencil" @click="startEditing" />
				<Button
					variant="solid"
					theme="gray"
					label="Publish"
					icon-left="lucide-arrow-up-right"
					:loading="publishing"
					@click="emit('publish', draft.name)"
				/>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button } from 'frappe-ui'
import RichEditor, { type MentionItem } from '@/components/common/RichEditor.vue'
import { fromNow } from '@/lib/dates'
import { isEmptyHtml } from '@/lib/text'
import type { HiveProjectUpdate } from '@/types'

const props = defineProps<{
	draft: HiveProjectUpdate
	mentions?: MentionItem[]
	/** Set while this draft's publish call is in flight. */
	publishing?: boolean
	/** Set while this draft's inline edit is being saved. */
	saving?: boolean
}>()

const emit = defineEmits<{
	publish: [name: string]
	delete: [name: string]
	save: [name: string, content: string]
}>()

const editing = ref(false)
const editContent = ref('')

const isEmpty = computed(() => isEmptyHtml(editContent.value))

function startEditing() {
	editContent.value = props.draft.content
	editing.value = true
}

function save() {
	if (isEmpty.value) return
	emit('save', props.draft.name, editContent.value)
	editing.value = false
}
</script>
