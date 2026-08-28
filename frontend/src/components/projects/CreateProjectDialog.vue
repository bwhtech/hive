<template>
	<Dialog :open="open" title="New Project" @update:open="emit('update:open', $event)">
		<template #default="{ close }">
			<form class="space-y-4" @submit.prevent="submit">
				<!-- The project's mark first, the way it will read everywhere else. -->
				<div class="flex items-end gap-2">
					<ProjectIconPicker
						v-model:icon="icon"
						v-model:color="color"
						v-model:avatar="avatar"
					/>
					<TextInput
						v-model="title"
						class="min-w-0 flex-1"
						label="Title"
						placeholder="Project name"
						required
						autofocus
					/>
				</div>

				<Select
					v-model="visibility"
					label="Visibility"
					:options="VISIBILITY_OPTIONS"
					:description="
						visibility === 'Private'
							? 'Only you will be able to see this project and its tasks.'
							: undefined
					"
				/>

				<LinkPicker
					v-model="projectType"
					doctype="Hive Project Type"
					label="Type"
					placeholder="Select type"
					:filters="{ is_archived: 0 }"
				/>

				<div class="flex items-end gap-2">
					<LinkPicker
						:key="clientPickerKey"
						v-model="client"
						class="min-w-0 flex-1"
						doctype="Hive Client"
						label="Client"
						placeholder="Select client"
						:filters="{ is_active: 1 }"
					/>
					<Button
						icon="lucide-plus"
						tooltip="New client"
						aria-label="New client"
						@click="newClientOpen = true"
					/>
				</div>

				<ErrorMessage :message="error" />

				<div class="flex justify-end gap-2 pt-2">
					<Button label="Cancel" @click="close" />
					<Button
						type="submit"
						variant="solid"
						theme="gray"
						label="Create Project"
						:loading="saving"
						:disabled="!title.trim()"
					/>
				</div>
			</form>
		</template>
	</Dialog>

	<NewClientDialog v-model:open="newClientOpen" @created="selectNewClient" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Dialog, ErrorMessage, Select, TextInput, toast, useNewDoc } from 'frappe-ui'
import LinkPicker from '@/components/common/LinkPicker.vue'
import ProjectIconPicker from '@/components/common/ProjectIconPicker.vue'
import NewClientDialog from '@/components/projects/NewClientDialog.vue'
import type { ProjectAvatarValue } from '@/lib/dicebear'
import type { ProjectColor } from '@/lib/project'
import type { HiveClient, HiveProject } from '@/types'

const props = defineProps<{ open: boolean }>()

const emit = defineEmits<{
	'update:open': [open: boolean]
	/** The inserted project, so the caller can navigate to it. */
	created: [project: HiveProject]
}>()

const VISIBILITY_OPTIONS = [
	{ label: 'Public', value: 'Public' },
	{ label: 'Private', value: 'Private' },
]

const title = ref('')
const icon = ref('')
const color = ref<ProjectColor | ''>('')
const avatar = ref<ProjectAvatarValue | null>(null)
const visibility = ref('Public')
const projectType = ref<string | null>(null)
const client = ref<string | null>(null)
const newClientOpen = ref(false)
const saving = ref(false)
const error = ref('')

// A freshly created client is not in the picker's fetched page yet; remounting
// the picker re-runs its search so the selection has a label to render.
const clientPickerKey = ref(0)

watch(
	() => props.open,
	(open) => {
		if (open) return
		title.value = ''
		icon.value = ''
		color.value = ''
		avatar.value = null
		visibility.value = 'Public'
		projectType.value = null
		client.value = null
		error.value = ''
	},
)

function selectNewClient(created: HiveClient) {
	client.value = created.name
	clientPickerKey.value += 1
}

async function submit() {
	const projectTitle = title.value.trim()
	if (!projectTitle || saving.value) return

	saving.value = true
	error.value = ''
	try {
		const newDoc = useNewDoc<HiveProject>('Hive Project', {
			title: projectTitle,
			status: 'Open',
			is_private: visibility.value === 'Private' ? 1 : 0,
			// Left unset when untouched, so the project keeps the derived
			// colour and the default folder rather than a frozen guess.
			...(icon.value ? { icon: icon.value } : {}),
			...(color.value ? { color: color.value } : {}),
			// The SVG is what gets drawn; the style, seed and options are what
			// let the avatar be rolled again, or rebuilt, later.
			...(avatar.value
				? {
						avatar: avatar.value.svg,
						avatar_style: avatar.value.style,
						avatar_seed: avatar.value.seed,
						avatar_options: JSON.stringify(avatar.value.options),
					}
				: {}),
			...(projectType.value ? { project_type: projectType.value } : {}),
			...(client.value ? { client: client.value } : {}),
		})
		const created = await newDoc.submit()
		toast.success('Project created')
		emit('created', created)
		emit('update:open', false)
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'Could not create project'
	} finally {
		saving.value = false
	}
}
</script>
