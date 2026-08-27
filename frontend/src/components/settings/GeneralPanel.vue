<template>
	<SettingsHeader title="General" description="Workspace-wide defaults." />
	<SettingsBody>
		<div class="flex flex-col gap-8 pt-6">
			<section class="space-y-3">
				<div>
					<h3 class="text-base font-semibold text-ink-gray-8">Project types</h3>
					<p class="text-sm text-ink-gray-5">
						The categories a project can be filed under.
					</p>
				</div>

				<div class="flex gap-2">
					<TextInput
						v-model="newType"
						class="flex-1"
						placeholder="e.g. Build, Hiring, Support…"
						aria-label="New project type"
						@keydown.enter.prevent="addType"
					/>
					<Button
						variant="solid"
						theme="gray"
						icon-left="lucide-plus"
						label="Add"
						:loading="adding"
						:disabled="!newType.trim()"
						@click="addType"
					/>
				</div>

				<div v-if="types.loading && !types.data" class="space-y-2">
					<Skeleton v-for="n in 3" :key="n" class="h-9 w-full" />
				</div>
				<ul
					v-else-if="types.data?.length"
					class="divide-y divide-outline-gray-1 rounded-4 border border-outline-gray-1"
				>
					<li
						v-for="type in types.data"
						:key="type.name"
						class="flex items-center justify-between px-4 py-2.5"
					>
						<span class="text-sm text-ink-gray-8">{{ type.type_name }}</span>
						<Button
							variant="ghost"
							icon="lucide-x"
							:aria-label="`Remove ${type.type_name}`"
							@click="removeType(type)"
						/>
					</li>
				</ul>
				<p v-else class="text-sm text-ink-gray-5">No project types yet. Add one above.</p>
			</section>

			<section>
				<h3 class="text-base font-semibold text-ink-gray-8">Due dates</h3>
				<div class="mt-2 divide-y divide-outline-gray-1">
					<SettingsRow
						title="Lock the due date once it arrives"
						description="Stops anyone moving a task's due date on or after that date."
					>
						<Switch
							:model-value="lockDueDate"
							:disabled="!settings.doc"
							@update:model-value="setLockDueDate"
						/>
					</SettingsRow>
				</div>
			</section>
		</div>
	</SettingsBody>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	Button,
	SettingsBody,
	SettingsHeader,
	SettingsRow,
	Skeleton,
	Switch,
	TextInput,
	toast,
	useDoc,
	useList,
	useNewDoc,
} from 'frappe-ui'
import { useArchiveWithUndo } from '@/composables/useArchiveWithUndo'
import type { Bool } from '@/types'

interface HiveProjectType {
	name: string
	type_name: string
}

const types = useList<HiveProjectType>({
	doctype: 'Hive Project Type',
	fields: ['name', 'type_name'],
	filters: { is_archived: 0 },
	orderBy: 'creation asc',
	limit: 100,
	cacheKey: 'hive-project-types',
})

const newType = ref('')
const adding = ref(false)

async function addType() {
	const typeName = newType.value.trim()
	if (!typeName || adding.value) return
	adding.value = true
	try {
		await useNewDoc<HiveProjectType>('Hive Project Type', { type_name: typeName }).submit()
		newType.value = ''
		types.reload()
		toast.success(`Added "${typeName}"`)
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Could not add the project type')
	} finally {
		adding.value = false
	}
}

const archiveType = useArchiveWithUndo('Hive Project Type')

function removeType(type: HiveProjectType) {
	archiveType(type.name, type.type_name, () => types.reload())
}

const settings = useDoc<{ name: string; lock_due_date_on_or_after: Bool }>({
	doctype: 'Hive Settings',
	name: 'Hive Settings',
})

const lockDueDate = computed(() => settings.doc?.lock_due_date_on_or_after === 1)

async function setLockDueDate(value: boolean) {
	try {
		await settings.setValue.submit({ lock_due_date_on_or_after: value ? 1 : 0 })
		toast.success(value ? 'Due dates lock on the due date' : 'Due dates stay editable')
	} catch {
		toast.error('Could not update the setting')
	}
}
</script>
