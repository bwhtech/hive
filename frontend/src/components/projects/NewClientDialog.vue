<template>
	<Dialog :open="open" title="New Client" size="sm" @update:open="emit('update:open', $event)">
		<template #default="{ close }">
			<form class="space-y-4" @submit.prevent="submit">
				<TextInput
					v-model="companyName"
					label="Company name"
					placeholder="Acme Inc."
					required
					autofocus
				/>
				<ErrorMessage :message="error" />
				<div class="flex justify-end gap-2 pt-2">
					<Button label="Cancel" @click="close" />
					<Button
						type="submit"
						variant="solid"
						theme="gray"
						label="Create Client"
						:loading="saving"
						:disabled="!companyName.trim()"
					/>
				</div>
			</form>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Dialog, ErrorMessage, TextInput, toast, useNewDoc } from 'frappe-ui'
import type { HiveClient } from '@/types'

const props = defineProps<{ open: boolean }>()

const emit = defineEmits<{
	'update:open': [open: boolean]
	/** The inserted client, so the caller can select it straight away. */
	created: [client: HiveClient]
}>()

const companyName = ref('')
const saving = ref(false)
const error = ref('')

watch(
	() => props.open,
	(open) => {
		if (open) return
		companyName.value = ''
		error.value = ''
	},
)

async function submit() {
	const name = companyName.value.trim()
	if (!name || saving.value) return

	saving.value = true
	error.value = ''
	try {
		const newDoc = useNewDoc<HiveClient>('Hive Client', { company_name: name, is_active: 1 })
		const created = await newDoc.submit()
		toast.success('Client created')
		emit('created', created)
		emit('update:open', false)
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'Could not create client'
	} finally {
		saving.value = false
	}
}
</script>
