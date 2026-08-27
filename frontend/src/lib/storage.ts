/**
 * Typed localStorage access. Every key the app persists is declared here so
 * they can be audited in one place; `theme` is owned by frappe-ui's
 * `useColorScheme` and deliberately absent.
 */
export const STORAGE_KEYS = {
	pinnedTasks: 'hive-pinned-tasks',
	createTaskDraft: 'hive-create-task-draft',
	overdueDialogLastShown: 'hive-overdue-dialog-last-shown',
	projectsStatusFilter: 'hive_projects_status_filter',
	projectsScopeFilter: 'hive_projects_scope_filter',
	projectsMyOnly: 'hive_projects_my_only',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export function readStorage<T>(key: StorageKey, fallback: T): T {
	try {
		const raw = localStorage.getItem(key)
		return raw === null ? fallback : (JSON.parse(raw) as T)
	} catch {
		return fallback
	}
}

export function writeStorage(key: StorageKey, value: unknown): void {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {
		/* quota or private mode — persistence is a convenience, never required */
	}
}

export function removeStorage(key: StorageKey): void {
	try {
		localStorage.removeItem(key)
	} catch {
		/* ignore */
	}
}
