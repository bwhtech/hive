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

	<DesktopShell v-else>
		<template #sidebar>
			<AppSidebar />
		</template>
		<router-view />
	</DesktopShell>

	<KeyboardShortcutsDialog v-model:open="shortcutsOpen" />
	<HiveSettingsDialog />
	<OnboardingDialog v-if="!isClient" />
</template>

<script setup lang="ts">
import { watch } from 'vue'
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
import OnboardingDialog from '@/components/global/OnboardingDialog.vue'
import HiveSettingsDialog from '@/components/settings/SettingsDialog.vue'
import AppSidebar from '@/components/shell/AppSidebar.vue'
import MobileShellNav from '@/components/shell/MobileShellNav.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useCelebrate } from '@/composables/useCelebrate'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import type { Bool } from '@/types'

// Applies the stored `data-theme` before anything paints.
useColorScheme()
usePageMeta(() => ({ title: 'Hive' }))

const { isDesktop } = useBreakpoint()
const { ready, isClient } = useSession()
const { celebrate } = useCelebrate()
const { commandPaletteOpen, onboardingOpen, shortcutsOpen, openSettings } = useOverlays()

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
