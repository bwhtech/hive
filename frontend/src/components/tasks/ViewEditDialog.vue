<template>
	<Dialog
		:open="open"
		title="Edit view"
		size="md"
		:actions="actions"
		@update:open="emit('update:open', $event)"
	>
		<template #default>
			<div class="space-y-4">
				<div class="flex items-end gap-3">
					<div>
						<FormLabel label="Emoji" />
						<EmojiPicker v-model="emoji">
							<button
								type="button"
								class="mt-1.5 grid h-8 w-14 place-items-center rounded-4 border border-outline-gray-2 bg-surface-base text-lg hover:bg-surface-gray-2"
								aria-label="Pick an emoji for this view"
							>
								{{ emoji || '📋' }}
							</button>
						</EmojiPicker>
					</div>
					<FormControl
						v-model="label"
						class="flex-1"
						type="text"
						label="Name"
						required
						@keydown.enter="save"
					/>
				</div>

				<Checkbox v-model="isPublic" label="Public — visible to all team members" />

				<ErrorMessage :message="views.setValue.error?.message" />
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
	Checkbox,
	Dialog,
	ErrorMessage,
	FormControl,
	FormLabel,
	toast,
	useDoctype,
	type DialogAction,
} from 'frappe-ui'
import EmojiPicker from '@/components/common/EmojiPicker.vue'
import type { HiveView } from '@/types'

/** Renames a saved view. Its filters are updated from the tasks page instead. */
const props = defineProps<{ open: boolean; view: HiveView | null }>()

const emit = defineEmits<{ 'update:open': [value: boolean]; saved: [] }>()

const views = useDoctype<HiveView>('Hive View')

const label = ref('')
const emoji = ref('')
const isPublic = ref(false)

watch(
	() => [props.open, props.view] as const,
	([open, view]) => {
		if (!open || !view) return
		label.value = view.label
		emoji.value = view.emoji || ''
		isPublic.value = view.is_public === 1
	},
	{ immediate: true },
)

const actions = computed<DialogAction[]>(() => [
	{
		label: 'Save',
		variant: 'solid',
		theme: 'gray',
		disabled: !label.value.trim(),
		onClick: save,
	},
])

async function save() {
	const view = props.view
	const trimmed = label.value.trim()
	if (!view || !trimmed || views.setValue.loading) return
	try {
		await views.setValue.submit({
			name: view.name,
			label: trimmed,
			emoji: emoji.value || '',
			is_public: isPublic.value ? 1 : 0,
		})
		toast.success('View updated')
		emit('saved')
		emit('update:open', false)
	} catch {
		toast.error('Could not update the view')
	}
}
</script>
