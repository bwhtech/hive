import { test as base, expect, type Locator, type Page } from "@playwright/test";

/**
 * localStorage keys the app owns. Mirrors `frontend/src/lib/storage.ts` —
 * keep the two in sync.
 */
export const STORAGE_KEYS = {
	pinnedTasks: "hive-pinned-tasks",
	createTaskDraft: "hive-create-task-draft",
	overdueDialogLastShown: "hive-overdue-dialog-last-shown",
	projectsStatusFilter: "hive_projects_status_filter",
	projectsScopeFilter: "hive_projects_scope_filter",
	projectsMyOnly: "hive_projects_my_only",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** Local calendar date as `YYYY-MM-DD`, matching the app's `today()`. */
export function todayISO(): string {
	const d = new Date();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * Suppress the once-a-day overdue dialog. Its overlay covers the viewport and
 * swallows every click, so without this almost any test that navigates to the
 * app fails on an intercepted pointer event.
 *
 * The app reads this key through `readStorage`, which `JSON.parse`s the value —
 * a bare date string throws and falls back to "not seen today", so the value
 * must be JSON-encoded.
 */
export async function suppressOverdueDialog(page: Page): Promise<void> {
	await page.addInitScript(
		({ key, value }) => {
			try {
				localStorage.setItem(key, JSON.stringify(value));
			} catch {
				/* private mode — the dialog just shows, and the test deals with it */
			}
		},
		{ key: STORAGE_KEYS.overdueDialogLastShown, value: todayISO() },
	);
}

/**
 * Let the overdue dialog through on this page, undoing the fixture below.
 * Init scripts run in registration order, so this one wins.
 */
export async function allowOverdueDialog(page: Page): Promise<void> {
	await page.addInitScript((key) => {
		try {
			localStorage.removeItem(key);
		} catch {
			/* private mode — nothing was stored to begin with */
		}
	}, STORAGE_KEYS.overdueDialogLastShown as string);
}

/**
 * Seed localStorage before the app boots. Values are JSON-encoded, the way
 * `writeStorage` stores them; `null` removes the key.
 */
export async function seedStorage(
	page: Page,
	entries: Record<string, unknown>,
): Promise<void> {
	await page.addInitScript((items) => {
		for (const [key, value] of Object.entries(items)) {
			try {
				if (value === null) localStorage.removeItem(key);
				else localStorage.setItem(key, JSON.stringify(value));
			} catch {
				/* private mode — the test asserts on the UI, not the store */
			}
		}
	}, entries);
}

/** Read a key the app wrote, decoded. `null` when it is unset. */
export async function readStoredValue<T>(
	page: Page,
	key: StorageKey,
): Promise<T | null> {
	return page.evaluate((k) => {
		const raw = localStorage.getItem(k);
		return raw === null ? null : (JSON.parse(raw) as T);
	}, key as string);
}

/**
 * The suite's `test`. Identical to Playwright's, except every page starts with
 * the overdue dialog suppressed. Import this instead of `@playwright/test` in
 * specs; the auth setup files keep the base `test`.
 */
export const test = base.extend({
	page: async ({ page }, use) => {
		await suppressOverdueDialog(page);
		await use(page);
	},
});

export { expect };
export type { Page, Locator };
