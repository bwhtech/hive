<template>
	<Dialog :open="open" title="Related links" @update:open="emit('update:open', $event)">
		<template #default>
			<div class="space-y-4">
				<div v-if="draft.length" class="space-y-2">
					<div
						v-for="(link, index) in draft"
						:key="index"
						class="flex items-center gap-2 rounded-3 border border-outline-gray-1 px-3 py-2"
					>
						<template v-if="editIndex === index">
							<TextInput
								v-model="editTitle"
								class="flex-1"
								placeholder="Title"
								aria-label="Link title"
							/>
							<TextInput
								v-model="editUrl"
								class="flex-1"
								placeholder="https://…"
								aria-label="Link URL"
							/>
							<Button
								variant="solid"
								theme="gray"
								label="Save"
								:disabled="!editTitle.trim() || !editUrl.trim()"
								@click="commitEdit"
							/>
							<Button label="Cancel" @click="editIndex = null" />
						</template>
						<template v-else>
							<span
								class="lucide-link size-4 shrink-0 text-ink-gray-5"
								aria-hidden="true"
							/>
							<span class="min-w-0 flex-1 truncate text-sm text-ink-gray-8">
								{{ link.title }}
								<span class="ml-2 text-xs text-ink-gray-5">{{ link.url }}</span>
							</span>
							<Button
								variant="ghost"
								icon="lucide-pencil"
								aria-label="Edit link"
								@click="startEdit(index)"
							/>
							<Button
								variant="ghost"
								icon="lucide-trash-2"
								aria-label="Remove link"
								@click="remove(index)"
							/>
						</template>
					</div>
				</div>

				<div class="space-y-2">
					<p class="text-sm font-medium text-ink-gray-6">Add a link</p>
					<div class="flex items-end gap-2">
						<TextInput
							v-model="newTitle"
							class="flex-1"
							placeholder="Title"
							aria-label="New link title"
							@keydown.enter.prevent="add"
						/>
						<TextInput
							v-model="newUrl"
							class="flex-1"
							placeholder="https://…"
							aria-label="New link URL"
							@keydown.enter.prevent="add"
						/>
						<Button
							variant="solid"
							theme="gray"
							label="Add"
							:disabled="!newTitle.trim() || !newUrl.trim()"
							@click="add"
						/>
					</div>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Dialog, TextInput } from 'frappe-ui'
import type { HiveProjectLink } from '@/types'

const props = defineProps<{
	open: boolean
	links: HiveProjectLink[]
}>()

const emit = defineEmits<{
	'update:open': [open: boolean]
	/** The whole child table, which is how Frappe wants it written back. */
	save: [links: HiveProjectLink[]]
}>()

// Edits apply straight away — the dialog is a live editor, not a form with an
// OK button, so every change goes out as a full child-table write.
const draft = ref<HiveProjectLink[]>([])

const newTitle = ref('')
const newUrl = ref('')
const editIndex = ref<number | null>(null)
const editTitle = ref('')
const editUrl = ref('')

watch(
	() => [props.open, props.links] as const,
	([open, links]) => {
		if (!open) return
		draft.value = links.map((link) => ({ ...link }))
		editIndex.value = null
	},
	{ immediate: true, deep: true },
)

function commit() {
	emit('save', draft.value)
}

function add() {
	const title = newTitle.value.trim()
	const url = newUrl.value.trim()
	if (!title || !url) return
	draft.value = [...draft.value, { title, url }]
	newTitle.value = ''
	newUrl.value = ''
	commit()
}

function remove(index: number) {
	draft.value = draft.value.filter((_, i) => i !== index)
	commit()
}

function startEdit(index: number) {
	editIndex.value = index
	editTitle.value = draft.value[index].title
	editUrl.value = draft.value[index].url
}

function commitEdit() {
	const index = editIndex.value
	if (index === null) return
	const title = editTitle.value.trim()
	const url = editUrl.value.trim()
	if (!title || !url) return
	draft.value = draft.value.map((link, i) => (i === index ? { ...link, title, url } : link))
	editIndex.value = null
	commit()
}
</script>
