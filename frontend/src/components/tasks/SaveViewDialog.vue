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
	FormLabel,
	toast,
	useDoctype,
	type DialogAction,
} from 'frappe-ui'
import EmojiPicker from '@/components/common/EmojiPicker.vue'
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
const emoji = ref('')
const isPublic = ref(false)

// A dialog that keeps the last attempt's text would silently re-save it.
watch(
	() => props.open,
	(open) => {
		if (open) return
		label.value = ''
		emoji.value = ''
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
			emoji: emoji.value || '',
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
