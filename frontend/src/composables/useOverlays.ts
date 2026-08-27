import { ref } from 'vue'

export type SettingsTab = 'profile' | 'general' | 'members' | 'clients' | 'github'

/**
 * App-level overlay state. The shell owns the flags; the streams that build
 * each overlay mount their component and read the flag from here, so nothing
 * has to be threaded through props or edited into `AppShell`.
 */
const commandPaletteOpen = ref(false)
const notificationsOpen = ref(false)
const shortcutsOpen = ref(false)
const settingsOpen = ref(false)
const settingsTab = ref<SettingsTab>('profile')
const createTaskOpen = ref(false)
const createProjectOpen = ref(false)
const onboardingOpen = ref(false)

export function useOverlays() {
	function openSettings(tab: SettingsTab = 'profile') {
		settingsTab.value = tab
		settingsOpen.value = true
	}

	return {
		commandPaletteOpen,
		notificationsOpen,
		shortcutsOpen,
		settingsOpen,
		settingsTab,
		createTaskOpen,
		createProjectOpen,
		onboardingOpen,
		openSettings,
	}
}
