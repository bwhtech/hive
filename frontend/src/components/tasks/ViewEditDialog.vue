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
					<IdentityPicker
						v-model:icon="icon"
						v-model:color="color"
						v-model:avatar="avatar"
					/>
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
	toast,
	useDoctype,
	type DialogAction,
} from 'frappe-ui'
import IdentityPicker from '@/components/common/IdentityPicker.vue'
import type { ProjectAvatarValue } from '@/lib/dicebear'
import { identityPatch, storedAvatarValue, type ProjectColor } from '@/lib/project'
import type { HiveView } from '@/types'

/**
 * Renames a saved view and re-marks it. Its filters are updated from the tasks
 * page instead.
 */
const props = defineProps<{ open: boolean; view: HiveView | null }>()

const emit = defineEmits<{ 'update:open': [value: boolean]; saved: [] }>()

const views = useDoctype<HiveView>('Hive View')

const label = ref('')
const icon = ref('')
const color = ref<ProjectColor | ''>('')
const avatar = ref<ProjectAvatarValue | null>(null)
const isPublic = ref(false)

watch(
	() => [props.open, props.view] as const,
	([open, view]) => {
		if (!open || !view) return
		label.value = view.label
		icon.value = view.icon || ''
		color.value = view.color || ''
		// A view saved before the identity fields existed has none of them, and
		// this resolves to `null` — the picker opens on the icon tab with the
		// same fallback mark the sidebar is already drawing.
		avatar.value = storedAvatarValue(view)
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
			// Every identity field goes back, empties included: dropping an
			// avatar for an icon has to clear the four avatar columns.
			...identityPatch(icon.value, color.value, avatar.value),
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
