import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Locators and flows for the frappe-ui shell.
 *
 * Specs go through these instead of reaching for markup so a frappe-ui bump
 * changes one file rather than twenty. Where the library publishes a
 * `data-slot`, that is the contract we use; where it does not, the app carries
 * a `data-testid`.
 */

/** Wait for a page to be loaded and its data settled. */
export async function gotoHive(page: Page, path: string): Promise<void> {
	await page.goto(path.startsWith("/hive") ? path : `/hive${path}`);
	await page.waitForLoadState("networkidle");
}

/* -------------------------------------------------------------------------- */
/* Command palette                                                            */
/* -------------------------------------------------------------------------- */

export function commandPalette(page: Page): Locator {
	return page.getByRole("dialog", { name: "Command palette" });
}

export function commandInput(page: Page): Locator {
	// The slot is the bordered row; the field itself sits inside it.
	return page.locator('[data-slot="command-palette-input"] input');
}

export function commandItems(page: Page): Locator {
	return page.locator('[data-slot="command-palette-item"]');
}

/** A command palette group heading, by label. */
export function commandGroupLabel(page: Page, label: string): Locator {
	return page
		.locator('[data-slot="command-palette-group-label"]')
		.filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) });
}

/** Command palette item by its visible label. */
export function commandItem(page: Page, label: string | RegExp): Locator {
	return commandItems(page).filter({ hasText: label });
}

/**
 * Open the palette with its keyboard shortcut and wait for it.
 *
 * frappe-ui resolves `Mod` from what the browser reports, and headless Chromium
 * on macOS reports a non-Mac platform — so the app listens for Ctrl+K there
 * while a real Mac user presses Cmd+K. Playwright's `ControlOrMeta` maps to the
 * host OS, which is the opposite of what the page expects. Try Ctrl first and
 * fall back to Meta so this works either way.
 */
export async function openCommandPalette(page: Page): Promise<Locator> {
	// The shortcut is bound by the app shell, so a keypress sent before it
	// mounts goes nowhere. Waiting for the header's Search button proves the
	// shell is listening.
	await expect(page.getByRole("button", { name: "Search" }).first()).toBeVisible(
		{ timeout: 15000 },
	);

	const palette = commandPalette(page);
	await page.keyboard.press("Control+k");
	if (!(await palette.isVisible().catch(() => false))) {
		await page.keyboard.press("Meta+k");
	}
	await expect(palette).toBeVisible({ timeout: 5000 });
	return palette;
}

/** Open the palette, type a query, and run the first matching item. */
export async function runCommand(
	page: Page,
	query: string,
	label: string | RegExp,
): Promise<void> {
	await openCommandPalette(page);
	await commandInput(page).fill(query);
	const item = commandItem(page, label).first();
	await expect(item).toBeVisible({ timeout: 10000 });
	await item.click();
}

/* -------------------------------------------------------------------------- */
/* Selects                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * frappe-ui's `Select` is a reka-ui listbox, not a native `<select>`: the
 * trigger is a combobox button and the options live in a portal outside the
 * component. So this opens the trigger and clicks the option by role.
 *
 * `scope` narrows which trigger is meant (a dialog, a toolbar); the option
 * itself is always looked up on the page, since the portal renders at the body.
 */
export async function selectOption(
	page: Page,
	trigger: Locator,
	option: string | RegExp,
): Promise<void> {
	await trigger.click();
	const item = page.getByRole("option", { name: option, exact: true });
	await expect(item.first()).toBeVisible({ timeout: 5000 });
	await item.first().click();
}

/** A `Select` trigger by its accessible name (`label` or `aria-label`). */
export function selectTrigger(
	scope: Page | Locator,
	name: string | RegExp,
): Locator {
	return scope.getByRole("combobox", { name });
}

/** Open the select named `name` within `scope` and pick `option`. */
export async function chooseOption(
	page: Page,
	name: string | RegExp,
	option: string | RegExp,
	scope: Page | Locator = page,
): Promise<void> {
	await selectOption(page, selectTrigger(scope, name), option);
}

/* -------------------------------------------------------------------------- */
/* Tab buttons                                                                */
/* -------------------------------------------------------------------------- */

/**
 * One option of a `TabButtons` group. The component wraps reka-ui's
 * `RadioGroup`, so an option is a radio rather than a button, and its selected
 * state is `aria-checked` (`toBeChecked()`), not `aria-pressed`.
 */
export function tabButton(scope: Page | Locator, label: string): Locator {
	return scope.getByRole("radio", { name: label, exact: true });
}

/* -------------------------------------------------------------------------- */
/* Dialogs                                                                    */
/* -------------------------------------------------------------------------- */

/** A dialog by its accessible name. */
export function dialog(page: Page, name: string | RegExp): Locator {
	return page.getByRole("dialog", { name });
}

/** Wait for a named dialog to be visible and return it. */
export async function expectDialog(
	page: Page,
	name: string | RegExp,
): Promise<Locator> {
	const d = dialog(page, name);
	await expect(d).toBeVisible({ timeout: 10000 });
	return d;
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                      */
/* -------------------------------------------------------------------------- */

/** A kanban column, by the status it holds. */
export function boardColumn(page: Page, status: string): Locator {
	return page.locator(`[data-testid="board-column"][data-status="${status}"]`);
}

/** A kanban card. Pass a task docname to pick one out. */
export function taskCard(page: Page, name?: string): Locator {
	return name
		? page.locator(`[data-testid="task-card"][data-task="${name}"]`)
		: page.locator('[data-testid="task-card"]');
}

/** A task table row. Pass a task docname to pick one out. */
export function taskRow(page: Page, name?: string): Locator {
	return name
		? page.locator(`[data-testid="task-row"][data-task="${name}"]`)
		: page.locator('[data-testid="task-row"]');
}

/** The task detail panel (desktop pane or mobile sheet). */
export function taskPanel(page: Page): Locator {
	return page.locator('[data-testid="task-panel"]');
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

/** A project card. Pass a docname to pick one out. */
export function projectCard(page: Page, name?: string): Locator {
	return name
		? page.locator(`[data-testid="project-card"][data-project="${name}"]`)
		: page.locator('[data-testid="project-card"]');
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

/** A dashboard KPI reading, by its title. */
export function kpi(page: Page, title: string): Locator {
	return page.locator(`[data-testid="kpi"][data-kpi="${title}"]`);
}

/** The number a KPI shows. */
export async function kpiValue(page: Page, title: string): Promise<number> {
	const text = await kpi(page, title).innerText();
	const digits = text.replace(title, "").match(/-?\d[\d,]*/);
	return digits ? Number(digits[0].replace(/,/g, "")) : NaN;
}

/** A dashboard section card, by its heading. */
export function section(page: Page, title: string): Locator {
	return page.locator("section").filter({
		has: page.getByRole("heading", { name: title, exact: true }),
	});
}

/* -------------------------------------------------------------------------- */
/* Project detail tabs                                                        */
/* -------------------------------------------------------------------------- */

/** Switch to a tab on the project detail page. */
export async function openProjectTab(page: Page, name: string): Promise<void> {
	const tab = page.getByRole("tab", { name: new RegExp(name) });
	await expect(tab).toBeVisible({ timeout: 10000 });
	await tab.click();
}

/** A feature request row. Pass a docname to pick one out. */
export function requestRow(page: Page, name?: string): Locator {
	return name
		? page.locator(`[data-testid="request-row"][data-request="${name}"]`)
		: page.locator('[data-testid="request-row"]');
}

/** A milestone card. Pass a docname to pick one out. */
export function milestoneCard(page: Page, name?: string): Locator {
	return name
		? page.locator(`[data-testid="milestone-card"][data-milestone="${name}"]`)
		: page.locator('[data-testid="milestone-card"]');
}

/** A draft update card. Pass a docname to pick one out. */
export function draftCard(page: Page, name?: string): Locator {
	return name
		? page.locator(`[data-testid="draft-card"][data-draft="${name}"]`)
		: page.locator('[data-testid="draft-card"]');
}

/* -------------------------------------------------------------------------- */
/* Rich text                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A rich-text editing surface. These are Tiptap `contenteditable` regions, not
 * inputs, so `fill` needs the textbox role rather than a form control.
 */
export function richEditor(scope: Page | Locator): Locator {
	return scope.getByRole("textbox").first();
}

/** Replace a rich editor's content. */
export async function typeInEditor(
	scope: Page | Locator,
	text: string,
): Promise<void> {
	const editor = richEditor(scope);
	await editor.click();
	await editor.fill(text);
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

/** A pinned task in the sidebar. Pass a docname to pick one out. */
export function sidebarPinned(page: Page, name?: string): Locator {
	return name
		? page.locator(`[data-testid="sidebar-pinned"][data-task="${name}"]`)
		: page.locator('[data-testid="sidebar-pinned"]');
}

/** A saved view in the sidebar, by label. */
export function sidebarView(page: Page, label: string): Locator {
	return page.locator('[data-testid="sidebar-view"]').filter({ hasText: label });
}

/* -------------------------------------------------------------------------- */
/* Settings                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Open Settings from the command palette and switch to a panel.
 *
 * The panel nav is a reka-ui tablist, so each entry is a `tab`, not a button.
 */
export async function openSettings(page: Page, panel?: string): Promise<Locator> {
	// Settings is reachable from anywhere in the app, but the palette needs the
	// app to be loaded — so land on it first if the test has not navigated yet.
	if (!page.url().includes("/hive")) await gotoHive(page, "/");
	await runCommand(page, "settings", "Open settings");
	const settings = await expectDialog(page, "Settings");
	if (panel) {
		await settings.getByRole("tab", { name: panel, exact: true }).click();
	}
	return settings;
}

/** A project row in the sidebar. Pass a docname to pick one out. */
export function sidebarProject(page: Page, name?: string): Locator {
	return name
		? page.locator(`[data-testid="sidebar-project"][data-project="${name}"]`)
		: page.locator('[data-testid="sidebar-project"]');
}

/** Right-click a sidebar project row and pick an item from its context menu. */
export async function sidebarProjectAction(
	page: Page,
	name: string,
	item: string | RegExp,
): Promise<void> {
	await sidebarProject(page, name).click({ button: "right" });
	await page.getByRole("menuitem", { name: item }).click();
}
