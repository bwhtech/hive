import { ref } from 'vue'
import type { CreateTaskValues, HiveTask } from '@/types'

export const SETTINGS_TABS = [
	'profile',
	'appearance',
	'general',
	'members',
	'clients',
	'github',
] as const

export type SettingsTab = (typeof SETTINGS_TABS)[number]

/** Guards a `?settings=` query value before it is trusted as a tab. */
export function isSettingsTab(value: unknown): value is SettingsTab {
	return typeof value === 'string' && (SETTINGS_TABS as readonly string[]).includes(value)
}

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
/**
 * What a deep link says just happened, for the panel it opened to report.
 * Handed over rather than left in the URL: the shell and the panel would
 * otherwise each strip their own query key from a stale snapshot, and the
 * later `router.replace` would put the other's key back.
 */
const settingsResult = ref<string | null>(null)
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
		settingsResult,
		createTaskOpen,
		createTaskContext,
		createProjectOpen,
		onboardingOpen,
		openSettings,
		openCreateTask,
	}
}
