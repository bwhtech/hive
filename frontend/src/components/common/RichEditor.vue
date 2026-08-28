<template>
	<Editor
		v-model="model"
		:extensions="extensions"
		:placeholder="placeholder"
		:editable="editable"
		:autofocus="autofocus"
		:upload-function="uploadFile"
	>
		<template #default="{ editor, isEmpty }">
			<div
				class="flex flex-col rounded-4 border border-outline-gray-2 bg-surface-base focus-within:border-outline-gray-4"
				:class="{ 'border-transparent': !editable }"
				@keydown="onKeydown($event, isEmpty)"
			>
				<EditorContent :editor="editor" :class="contentClass" />
				<div
					v-if="editable"
					class="flex items-center justify-between gap-2 border-t border-outline-gray-2 px-2 py-1.5"
				>
					<EditorFixedMenu :editor="editor" :items="toolbar" button-size="xs" />
					<slot name="actions" :editor="editor" :is-empty="isEmpty" />
				</div>
			</div>
		</template>
	</Editor>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { upload } from 'frappe-ui'
import {
	CommentKit,
	Editor,
	EditorContent,
	EditorFixedMenu,
	RichTextKit,
	articleToolbar,
	commentToolbar,
	type CommentKitOptions,
	type RichTextKitOptions,
	type UploadedFile as EditorUploadedFile,
} from 'frappe-ui/editor'

/** Matches frappe-ui's `MentionSuggestionItem`: free-form beyond id + label. */
export interface MentionItem {
	id: string
	label: string
	image?: string
	[key: string]: unknown
}

const props = withDefaults(
	defineProps<{
		/** `comment` for comments and updates, `rich` for task descriptions. */
		kit?: 'comment' | 'rich'
		placeholder?: string
		editable?: boolean
		autofocus?: boolean
		mentions?: MentionItem[]
		/** Emit `submit` on Cmd/Ctrl+Enter. */
		submitOnModEnter?: boolean
		/** Extra classes for the editable region — usually a min-height. */
		contentClass?: string
	}>(),
	{
		kit: 'comment',
		editable: true,
		autofocus: false,
		submitOnModEnter: false,
		contentClass: 'min-h-24 px-3 py-2',
	},
)

const emit = defineEmits<{ submit: [] }>()

const model = defineModel<string>({ default: '' })

defineSlots<{
	/** Trailing controls on the toolbar row — a Post button, a draft hint. */
	actions?: (props: { editor: unknown; isEmpty: boolean }) => unknown
}>()

const toolbar = computed(() => (props.kit === 'rich' ? articleToolbar : commentToolbar))

const extensions = computed(() => {
	// A getter, so the suggestion list follows `mentions` without rebuilding the
	// extension. Omitted entirely when the caller passes none.
	const mention: Partial<CommentKitOptions> = props.mentions
		? { mention: { items: () => props.mentions ?? [] } }
		: {}
	if (props.kit === 'rich') {
		return [RichTextKit.configure(mention as Partial<RichTextKitOptions>)]
	}
	return [CommentKit.configure(mention)]
})

async function uploadFile(file: File): Promise<EditorUploadedFile> {
	const uploaded = await upload(file, { private: false })
	return { ...uploaded }
}

function onKeydown(event: KeyboardEvent, isEmpty: boolean) {
	if (!props.submitOnModEnter) return
	if (event.key !== 'Enter' || !(event.metaKey || event.ctrlKey)) return
	if (isEmpty) return
	event.preventDefault()
	emit('submit')
}
</script>
