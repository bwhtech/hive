<template>
	<SidebarSection v-if="views.length" label="Views" collapsible>
		<SidebarItem
			v-for="view in views"
			:key="view.name"
			:icon="view.emoji || '📋'"
			:label="view.label"
			:to="routeFor(view)"
			:active="activeViewId === view.name"
		>
			<template #suffix>
				<Dropdown
					v-if="view.owner === userId"
					:options="menuFor(view)"
					side="right"
					align="start"
				>
					<button
						type="button"
						class="mr-1 grid size-5 place-items-center rounded-3 text-ink-gray-5 hover:bg-surface-gray-3 hover:text-ink-gray-7"
						:aria-label="`Actions for ${view.label}`"
					>
						<span class="lucide-ellipsis size-3.5" aria-hidden="true" />
					</button>
				</Dropdown>
			</template>
		</SidebarItem>
	</SidebarSection>

	<ViewEditDialog v-model:open="editOpen" :view="editing" @saved="refresh" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import {
	Dropdown,
	SidebarItem,
	SidebarSection,
	dialog,
	toast,
	useDoctype,
	type DropdownOptions,
} from 'frappe-ui'
import ViewEditDialog from '@/components/tasks/ViewEditDialog.vue'
import { useHiveViews } from '@/composables/useHiveViews'
import { useSession } from '@/composables/useSession'
import type { HiveView } from '@/types'

const route = useRoute()
const { userId } = useSession()
const { list: views, refresh } = useHiveViews()
const viewDoctype = useDoctype<HiveView>('Hive View')

const editOpen = ref(false)
const editing = ref<HiveView | null>(null)

const activeViewId = computed(() =>
	route.path === '/tasks' ? ((route.query.view_id as string) ?? '') : '',
)

/** A view whose `filters_json` predates a schema change must not break the nav. */
function parseFilters(json: string): Record<string, unknown> {
	try {
		return JSON.parse(json || '{}')
	} catch {
		return {}
	}
}

/** A view is a saved URL: its filters ride along as query params. */
function routeFor(view: HiveView): RouteLocationRaw {
	const query: Record<string, string> = { view_id: view.name }
	for (const [key, value] of Object.entries(parseFilters(view.filters_json))) {
		if (value) query[key] = String(value)
	}
	if (view.view_type && view.view_type !== 'list') query.view = view.view_type
	return { path: '/tasks', query }
}

function menuFor(view: HiveView): DropdownOptions {
	return [
		{
			label: 'Edit',
			icon: 'lucide-pencil',
			onClick: () => {
				editing.value = view
				editOpen.value = true
			},
		},
		{
			label: 'Delete',
			icon: 'lucide-trash-2',
			theme: 'red',
			onClick: () => confirmDelete(view),
		},
	]
}

function confirmDelete(view: HiveView) {
	dialog.danger({
		title: 'Delete this view?',
		message: `“${view.label}” will be removed for everyone who can see it.`,
		onConfirm: async () => {
			await viewDoctype.delete.submit({ name: view.name })
			toast.success('View deleted')
			refresh()
		},
	})
}
</script>
