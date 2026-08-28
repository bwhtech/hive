import { ref } from 'vue'
import type { CreateTaskValues, HiveTask } from '@/types'

export type SettingsTab = 'profile' | 'appearance' | 'general' | 'members' | 'clients' | 'github'

/** What the shell's create-task dialog needs from whoever opened it. */
export interface CreateTaskContext {
	/** Pre-selects the project and hides the project picker. */
	projectId?: string
	defaults?: Partial<CreateTaskValues>
	/** The opener's own refresh — the shell does not know what to reload. */
	onCreated?: (task: HiveTask) => void
}

/**
 * App-level overlay state. `AppShell` mounts every overlay once and reads its
 * flag from here, so any page — or the command palette, from any route — opens
 * one without props to thread or a dialog of its own to own.
 */
const commandPaletteOpen = ref(false)
const notificationsOpen = ref(false)
const shortcutsOpen = ref(false)
const settingsOpen = ref(false)
const settingsTab = ref<SettingsTab>('profile')
const createTaskOpen = ref(false)
const createTaskContext = ref<CreateTaskContext>({})
const createProjectOpen = ref(false)
const onboardingOpen = ref(false)

export function useOverlays() {
	function openSettings(tab: SettingsTab = 'profile') {
		settingsTab.value = tab
		settingsOpen.value = true
	}

	function openCreateTask(context: CreateTaskContext = {}) {
		createTaskContext.value = context
		createTaskOpen.value = true
	}

	return {
		commandPaletteOpen,
		notificationsOpen,
		shortcutsOpen,
		settingsOpen,
		settingsTab,
		createTaskOpen,
		createTaskContext,
		createProjectOpen,
		onboardingOpen,
		openSettings,
		openCreateTask,
	}
}
