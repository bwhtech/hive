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
</template>

<script setup lang="ts">
import {
	DesktopShell,
	KeyboardShortcutsDialog,
	MobileShell,
	Spinner,
	useColorScheme,
	useKeyboardShortcut,
	usePageMeta,
} from 'frappe-ui'
import AppSidebar from '@/components/shell/AppSidebar.vue'
import MobileShellNav from '@/components/shell/MobileShellNav.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useCelebrate } from '@/composables/useCelebrate'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'

// Applies the stored `data-theme` before anything paints.
useColorScheme()
usePageMeta(() => ({ title: 'Hive' }))

const { isDesktop } = useBreakpoint()
const { ready } = useSession()
const { celebrate } = useCelebrate()
const { commandPaletteOpen, shortcutsOpen, openSettings } = useOverlays()

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
