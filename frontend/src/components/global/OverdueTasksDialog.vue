<template>
	<Dialog
		v-model:open="open"
		title="Overdue tasks"
		:icon="{ name: 'lucide-circle-alert', theme: 'red' }"
		size="md"
	>
		<template #default>
			<p class="mb-2 text-p-base text-ink-gray-6">{{ message }}</p>
			<div class="max-h-[50vh] overflow-y-auto">
				<!-- Two lines per task: the dialog is too narrow to put the title
				     and its meta on one row without truncating both. -->
				<List :columns="COLUMNS">
					<ListRow
						v-for="task in tasks"
						:key="task.name"
						:value="task.name"
						@click="openTask(task)"
					>
						<ListCell>
							<div class="min-w-0 py-2">
								<p class="flex min-w-0 items-center gap-2">
									<span
										class="size-2 shrink-0 rounded-full"
										:class="statusDotClass(task.status)"
										aria-hidden="true"
									/>
									<span class="truncate text-base text-ink-gray-8">
										{{ task.title }}
									</span>
								</p>
								<div class="ml-4 mt-1 flex flex-wrap items-center gap-2">
									<span
										v-if="task.project_title"
										class="truncate text-sm text-ink-gray-5"
									>
										{{ task.project_title }}
									</span>
									<Badge
										:label="task.priority"
										:theme="priorityTheme(task.priority)"
										variant="subtle"
									/>
									<span class="whitespace-nowrap text-sm text-ink-red-6">
										{{ dueLabel(task.due_date) }}
									</span>
								</div>
							</div>
						</ListCell>
					</ListRow>
				</List>
			</div>
		</template>

		<template #actions>
			<Button label="Got it" @click="dismiss" />
			<Button variant="solid" theme="gray" label="View all tasks" @click="viewAll" />
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Badge, Button, Dialog, useCall } from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'
import { useSession } from '@/composables/useSession'
import { dueLabel, today } from '@/lib/dates'
import { priorityTheme, statusDotClass } from '@/lib/status'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/lib/storage'
import type { HiveTask } from '@/types'

interface OverdueTask {
	name: string
	title: string
	project: string
	project_title?: string
	project_slug?: string
	status: HiveTask['status']
	priority: HiveTask['priority']
	due_date: string
}

/** One column: the dot rides with the title so the two stay aligned. */
const COLUMNS = ['minmax(0, 1fr)']

/** One per day, picked by the date so the same nudge does not repeat. */
const MESSAGES = [
	'A few tasks need your attention. Let us knock them out.',
	'You have got this — just a few overdue items to tackle.',
	'Small steps lead to big progress. Start with these.',
	'Time to clear the deck. Here is what is waiting.',
]

const router = useRouter()
const { userId } = useSession()

const open = ref(false)

const overdue = useCall<OverdueTask[]>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.get_my_overdue_tasks',
	method: 'GET',
	immediate: false,
})

const tasks = computed(() => overdue.data ?? [])

const message = computed(() => {
	const index = Number(today().slice(-2)) % MESSAGES.length
	return MESSAGES[index]
})

function shownToday(): boolean {
	return readStorage<string>(STORAGE_KEYS.overdueDialogLastShown, '') === today()
}

watch(
	userId,
	(user) => {
		if (user && !shownToday()) overdue.reload()
	},
	{ immediate: true },
)

watch(tasks, (list) => {
	if (list.length && !shownToday()) open.value = true
})

function dismiss() {
	writeStorage(STORAGE_KEYS.overdueDialogLastShown, today())
	open.value = false
}

function openTask(task: OverdueTask) {
	dismiss()
	router.push({
		path: `/projects/${task.project_slug || task.project}`,
		query: { task: task.name },
	})
}

function viewAll() {
	dismiss()
	router.push('/tasks')
}
</script>
