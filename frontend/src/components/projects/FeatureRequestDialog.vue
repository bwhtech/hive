<template>
	<Dialog
		v-model:open="isOpen"
		title="New feature request"
		message="Suggest an improvement for this project."
		size="xl"
	>
		<template #default>
			<div class="space-y-4">
				<FormControl
					v-model="title"
					label="Title"
					placeholder="What would you like to see?"
					required
					:error="error"
					@keydown.enter.prevent="submit"
				/>
				<FormControl
					v-model="priority"
					type="select"
					label="Priority"
					:options="PRIORITY_OPTIONS"
				/>
				<div class="space-y-1.5">
					<FormLabel label="Description" />
					<RichEditor
						v-model="description"
						kit="comment"
						:mentions="mentions"
						placeholder="Describe the feature in detail…"
						content-class="min-h-32 px-3 py-2"
						submit-on-mod-enter
						@submit="submit"
					/>
				</div>
			</div>
		</template>

		<template #actions>
			<div class="flex justify-end gap-2">
				<Button label="Cancel" @click="isOpen = false" />
				<Button
					variant="solid"
					theme="gray"
					label="Submit request"
					:loading="saving"
					@click="submit"
				/>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Dialog, FormControl, FormLabel, toast, useNewDoc } from 'frappe-ui'
import RichEditor, { type MentionItem } from '@/components/common/RichEditor.vue'
import { FEATURE_REQUEST_PRIORITIES, type HiveFeatureRequest } from '@/types'

const PRIORITY_OPTIONS = FEATURE_REQUEST_PRIORITIES.map((value) => ({ label: value, value }))

const props = defineProps<{
	/** Hive Project docname the request is filed against. */
	project: string
	mentions?: MentionItem[]
}>()

const emit = defineEmits<{ created: [name: string] }>()

const isOpen = defineModel<boolean>('open', { default: false })

const title = ref('')
const description = ref('')
const priority = ref<string>(FEATURE_REQUEST_PRIORITIES[0])
const error = ref('')
const saving = ref(false)

watch(isOpen, (open) => {
	if (open) return
	title.value = ''
	description.value = ''
	priority.value = FEATURE_REQUEST_PRIORITIES[0]
	error.value = ''
})

async function submit() {
	if (saving.value) return
	if (!title.value.trim()) {
		error.value = 'A title is required'
		return
	}
	error.value = ''
	saving.value = true
	try {
		const request = useNewDoc<HiveFeatureRequest>('Hive Feature Request', {
			project: props.project,
			title: title.value.trim(),
			description: description.value,
			priority: priority.value as HiveFeatureRequest['priority'],
		})
		const created = await request.submit()
		isOpen.value = false
		emit('created', created.name)
		toast.success('Feature request created')
	} catch {
		toast.error('Could not create feature request')
	} finally {
		saving.value = false
	}
}
</script>
