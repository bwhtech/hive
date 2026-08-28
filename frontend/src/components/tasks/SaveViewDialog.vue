<template>
	<Dialog
		:open="open"
		title="Save view"
		size="md"
		:actions="actions"
		@update:open="emit('update:open', $event)"
	>
		<template #default>
			<div class="space-y-4">
				<!-- The view's mark first, the way a project's reads in its own
				     create dialog — same picker, same storage. -->
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
						placeholder="My urgent tasks"
						required
						@keydown.enter="save"
					/>
				</div>

				<Checkbox v-model="isPublic" label="Public — visible to all team members" />

				<div
					v-if="summary.length"
					class="space-y-1 rounded-4 bg-surface-gray-1 p-3 text-xs text-ink-gray-6"
				>
					<p class="font-medium text-ink-gray-8">Current filters</p>
					<p v-for="line in summary" :key="line">{{ line }}</p>
				</div>

				<p class="text-xs text-ink-gray-5">View type: {{ VIEW_TYPE_LABEL[viewType] }}</p>

				<ErrorMessage :message="views.insert.error?.message" />
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
import { identityPatch, type ProjectColor } from '@/lib/project'
import type { HiveView } from '@/types'

/** `list` | `kanban` | `calendar`, as stored on the view. */
type ViewType = HiveView['view_type']

const props = defineProps<{
	open: boolean
	/** The filter set the view will replay, already stripped of empty values. */
	filters: Record<string, string>
	viewType: ViewType
}>()

const emit = defineEmits<{ 'update:open': [value: boolean]; created: [view: HiveView] }>()

const VIEW_TYPE_LABEL: Record<ViewType, string> = {
	list: 'List',
	kanban: 'Kanban',
	calendar: 'Calendar',
}

const FILTER_LABEL: Record<string, string> = {
	q: 'Search',
	status: 'Status',
	priority: 'Priority',
	project: 'Project',
	assignee: 'Assignee',
}

const views = useDoctype<HiveView>('Hive View')

const label = ref('')
const icon = ref('')
const color = ref<ProjectColor | ''>('')
const avatar = ref<ProjectAvatarValue | null>(null)
const isPublic = ref(false)

// A dialog that keeps the last attempt's text would silently re-save it.
watch(
	() => props.open,
	(open) => {
		if (open) return
		label.value = ''
		icon.value = ''
		color.value = ''
		avatar.value = null
		isPublic.value = false
	},
)

const summary = computed(() =>
	Object.entries(props.filters).map(([key, value]) => `${FILTER_LABEL[key] ?? key}: ${value}`),
)

const actions = computed<DialogAction[]>(() => [
	{
		label: 'Save view',
		variant: 'solid',
		theme: 'gray',
		disabled: !label.value.trim(),
		onClick: save,
	},
])

async function save() {
	const trimmed = label.value.trim()
	if (!trimmed || views.insert.loading) return
	try {
		const view = await views.insert.submit({
			label: trimmed,
			...identityPatch(icon.value, color.value, avatar.value),
			view_type: props.viewType,
			filters_json: JSON.stringify(props.filters),
			is_public: isPublic.value ? 1 : 0,
		})
		if (!view) throw new Error('insert returned no document')
		toast.success('View saved')
		emit('created', view)
		emit('update:open', false)
	} catch {
		toast.error('Could not save the view')
	}
}
</script>
