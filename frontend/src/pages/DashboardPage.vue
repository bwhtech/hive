<template>
	<AppHeader title="Dashboard" />
	<div class="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
		<!-- Underline tabs read as page sections on desktop; on a phone the same
		     choice is a one-line Select, per DESIGN.md. -->
		<Tabs v-if="isDesktop" :model-value="tab" @update:model-value="setTab">
			<TabList variant="underline">
				<TabTrigger
					v-for="item in tabs"
					:key="item.value"
					:value="item.value"
					:label="item.label"
					:icon-left="item.icon"
				/>
			</TabList>
			<TabPanel v-for="item in tabs" :key="item.value" :value="item.value" class="pt-4">
				<component :is="panels[item.value]" />
			</TabPanel>
		</Tabs>

		<template v-else>
			<Select
				:model-value="tab"
				:options="tabs"
				aria-label="Dashboard section"
				@update:model-value="setTab"
			/>
			<div class="pt-4">
				<component :is="panels[tab]" />
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Select, TabList, TabPanel, Tabs, TabTrigger, usePageMeta } from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import MyWorkTab from '@/components/dashboard/MyWorkTab.vue'
import ProjectsTab from '@/components/dashboard/ProjectsTab.vue'
import TeamTab from '@/components/dashboard/TeamTab.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'

usePageMeta(() => ({ title: 'Dashboard · Hive' }))

const DEFAULT_TAB = 'my'

const tabs = [
	{ value: 'my', label: 'My work', icon: 'lucide-user' },
	{ value: 'projects', label: 'Projects', icon: 'lucide-folder' },
	{ value: 'team', label: 'Team', icon: 'lucide-users' },
]

const panels: Record<string, Component> = {
	my: MyWorkTab,
	projects: ProjectsTab,
	team: TeamTab,
}

const route = useRoute()
const router = useRouter()
const { isDesktop } = useBreakpoint()

/** `?tab=` is the source of truth, so a shared link opens the same section. */
const tab = computed(() => {
	const value = route.query.tab
	return typeof value === 'string' && tabs.some((item) => item.value === value)
		? value
		: DEFAULT_TAB
})

function setTab(value: string | number | undefined) {
	const next = value == null ? DEFAULT_TAB : String(value)
	if (next === tab.value) return
	const query = { ...route.query, tab: next === DEFAULT_TAB ? undefined : next }
	router.replace({ query })
}
</script>
