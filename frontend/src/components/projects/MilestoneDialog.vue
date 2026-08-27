<template>
	<Dialog
		:open="open"
		:title="milestone ? 'Edit milestone' : 'New milestone'"
		@update:open="emit('update:open', $event)"
	>
		<template #default="{ close }">
			<form class="space-y-4" @submit.prevent="submit" @keydown.meta.enter.prevent="submit">
				<TextInput
					v-model="title"
					label="Title"
					placeholder="e.g. Beta release"
					required
					autofocus
				/>

				<DatePicker
					:model-value="targetDate"
					label="Target date"
					placeholder="Not set"
					clearable
					@update:model-value="targetDate = $event || ''"
				/>

				<Textarea
					v-model="description"
					label="Description"
					placeholder="Optional description…"
					:rows="3"
				/>

				<ErrorMessage :message="error" />

				<div class="flex justify-end gap-2 pt-2">
					<Button label="Cancel" @click="close" />
					<Button
						type="submit"
						variant="solid"
						theme="gray"
						:label="milestone ? 'Save changes' : 'Create milestone'"
						:loading="saving"
						:disabled="!title.trim()"
					>
						<template #suffix>
							<KeyboardShortcut combo="Mod+Enter" />
						</template>
					</Button>
				</div>
			</form>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
	Button,
	DatePicker,
	Dialog,
	ErrorMessage,
	KeyboardShortcut,
	Textarea,
	TextInput,
	toast,
	useDoctype,
	useNewDoc,
} from 'frappe-ui'
import type { HiveMilestone } from '@/types'

const props = defineProps<{
	open: boolean
	/** Hive Project docname the new milestone belongs to. */
	project: string
	/** `null` creates; a milestone edits it. */
	milestone: HiveMilestone | null
}>()

const emit = defineEmits<{
	'update:open': [open: boolean]
	saved: []
}>()

const milestoneDoctype = useDoctype<HiveMilestone>('Hive Milestone')

const title = ref('')
const targetDate = ref('')
const description = ref('')
const saving = ref(false)
const error = ref('')

watch(
	() => [props.open, props.milestone] as const,
	([open, milestone]) => {
		if (!open) return
		title.value = milestone?.title ?? ''
		targetDate.value = milestone?.target_date ?? ''
		description.value = milestone?.description ?? ''
		error.value = ''
	},
	{ immediate: true },
)

async function submit() {
	const milestoneTitle = title.value.trim()
	if (!milestoneTitle || saving.value) return

	saving.value = true
	error.value = ''
	const values = {
		title: milestoneTitle,
		target_date: targetDate.value || null,
		description: description.value,
	}
	try {
		if (props.milestone) {
			await milestoneDoctype.setValue.submit({ name: props.milestone.name, ...values })
			toast.success('Milestone updated')
		} else {
			await useNewDoc<HiveMilestone>('Hive Milestone', {
				...values,
				project: props.project,
			}).submit()
			toast.success('Milestone created')
		}
		emit('saved')
		emit('update:open', false)
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'Could not save the milestone'
	} finally {
		saving.value = false
	}
}
</script>
