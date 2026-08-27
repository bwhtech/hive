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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import {
	Dropdown,
	SidebarItem,
	SidebarSection,
	dialog,
	toast,
	useDoctype,
	useList,
	type DropdownOptions,
} from 'frappe-ui'
import ViewEditDialog from '@/components/tasks/ViewEditDialog.vue'
import { useSession } from '@/composables/useSession'
import type { HiveView } from '@/types'

/**
 * Saved `Hive View` links. Public views are visible to everyone; private ones
 * only to their owner, so they come back as two queries — one list filtered on
 * `is_public` cannot express "public OR mine".
 *
 * A view created on the tasks page announces itself with this event; edits and
 * deletes go through this component and refresh in place.
 */
const VIEWS_CHANGED_EVENT = 'hive:views-changed'

const FIELDS = [
	'name',
	'label',
	'emoji',
	'view_type',
	'filters_json',
	'is_public',
	'owner',
] as const

const route = useRoute()
const { userId, isClient } = useSession()
const viewDoctype = useDoctype<HiveView>('Hive View')

const publicViews = useList<HiveView>({
	doctype: 'Hive View',
	fields: [...FIELDS],
	filters: { is_public: 1 },
	orderBy: 'creation asc',
	limit: 50,
	immediate: false,
})

const myViews = useList<HiveView>({
	doctype: 'Hive View',
	fields: [...FIELDS],
	filters: () => ({ is_public: 0, owner: userId.value }),
	orderBy: 'creation asc',
	limit: 50,
	immediate: false,
})

const editOpen = ref(false)
const editing = ref<HiveView | null>(null)

const views = computed(() => {
	const seen = new Map<string, HiveView>()
	for (const view of [...(publicViews.data ?? []), ...(myViews.data ?? [])]) {
		seen.set(view.name, view)
	}
	return [...seen.values()]
})

const activeViewId = computed(() =>
	route.path === '/tasks' ? (route.query.view_id as string) ?? '' : '',
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

function refresh() {
	// `Hive View` is readable by the team roles only — a client would just get
	// a 403 for every poll.
	if (!userId.value || isClient.value) return
	publicViews.reload()
	myViews.reload()
}

watch([userId, isClient], refresh, { immediate: true })

onMounted(() => window.addEventListener(VIEWS_CHANGED_EVENT, refresh))

onBeforeUnmount(() => window.removeEventListener(VIEWS_CHANGED_EVENT, refresh))
</script>
