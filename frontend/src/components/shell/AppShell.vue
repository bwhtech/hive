<template>
	<div v-if="!ready" class="grid h-screen place-items-center bg-surface-base">
		<Spinner class="size-6 text-ink-gray-5" />
	</div>

	<MobileShell v-else-if="!isDesktop">
		<router-view />
		<template #nav>
			<MobileShellNav />
		</template>
	</MobileShell>

	<!-- A route with a side panel owns its own scrolling: the shell's page
	     scroll would leave the panel unbounded and scroll the whole page
	     instead of the pane the pointer is over. -->
	<DesktopShell v-else :scroll="!splitView">
		<template #sidebar>
			<AppSidebar />
		</template>
		<router-view />
	</DesktopShell>

	<KeyboardShortcutsDialog v-model:open="shortcutsOpen" />
	<CommandPalette />
	<NotificationsSheet />
	<OverdueTasksDialog />
	<HiveSettingsDialog />
	<OnboardingDialog v-if="!isClient" />
	<CreateProjectDialog v-if="!isClient" v-model:open="createProjectOpen" @created="openProject" />
	<CreateTaskDialog
		v-model:open="createTaskOpen"
		:project-id="createTaskContext.projectId"
		:defaults="createTaskContext.defaults"
		@created="createTaskContext.onCreated?.($event)"
	/>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
	DesktopShell,
	KeyboardShortcutsDialog,
	MobileShell,
	Spinner,
	useColorScheme,
	useDoc,
	useKeyboardShortcut,
	usePageMeta,
} from 'frappe-ui'
import CommandPalette from '@/components/global/CommandPalette.vue'
import NotificationsSheet from '@/components/global/NotificationsSheet.vue'
import OnboardingDialog from '@/components/global/OnboardingDialog.vue'
import OverdueTasksDialog from '@/components/global/OverdueTasksDialog.vue'
import CreateProjectDialog from '@/components/projects/CreateProjectDialog.vue'
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog.vue'
import HiveSettingsDialog from '@/components/settings/SettingsDialog.vue'
import AppSidebar from '@/components/shell/AppSidebar.vue'
import MobileShellNav from '@/components/shell/MobileShellNav.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useCelebrate } from '@/composables/useCelebrate'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import type { Bool, HiveProject } from '@/types'

// Applies the stored `data-theme` before anything paints.
useColorScheme()
usePageMeta(() => ({ title: 'Hive' }))

const route = useRoute()
const router = useRouter()

/** The routes that render a task panel beside their content. */
const SPLIT_VIEW_ROUTES = ['Tasks', 'ProjectDetail']
const splitView = computed(() => SPLIT_VIEW_ROUTES.includes(String(route.name ?? '')))
const { isDesktop } = useBreakpoint()
const { ready, isClient } = useSession()
const { celebrate } = useCelebrate()
const {
	commandPaletteOpen,
	createProjectOpen,
	createTaskContext,
	createTaskOpen,
	onboardingOpen,
	shortcutsOpen,
	openSettings,
} = useOverlays()

// Creating a project always lands on it, wherever the dialog was opened from.
function openProject(project: HiveProject) {
	router.push(`/projects/${project.slug || project.name}`)
}

// A workspace that has never finished onboarding opens the dialog once per
// session; dismissing it does not come back until the app is reloaded.
const settings = useDoc<{ name: string; onboarding_completed: Bool }>({
	doctype: 'Hive Settings',
	name: 'Hive Settings',
})

let onboardingOffered = false
watch(
	() => [isClient.value, settings.doc] as const,
	([client, doc]) => {
		if (onboardingOffered || client || !doc) return
		onboardingOffered = true
		if (!doc.onboarding_completed) onboardingOpen.value = true
	},
	{ immediate: true },
)

useKeyboardShortcut([
	{
		combo: 'Mod+K',
		description: 'Open command palette',
		group: 'Global',
		allowInInput: true,
		handler: () => {
			commandPaletteOpen.value = !commandPaletteOpen.value
		},
	},
	{
		combo: 'Shift+Slash',
		description: 'Show keyboard shortcuts',
		group: 'Global',
		handler: () => {
			shortcutsOpen.value = !shortcutsOpen.value
		},
	},
	{
		combo: 'Mod+Comma',
		description: 'Open settings',
		group: 'Global',
		allowInInput: true,
		handler: () => openSettings('profile'),
	},
	{
		combo: 'Shift+T',
		description: 'Celebrate',
		group: 'Global',
		handler: () => celebrate(),
	},
])
</script>
