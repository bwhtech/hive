import { test, expect, Page, Locator } from "@playwright/test";
import {
	createTestProject,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { createDoc, deleteDoc, getList, updateDoc } from "../helpers/frappe";

const PROJECT_PREFIX = "E2E Lock Due Date";
const TASK_PREFIX = "E2E LockDD Task";
const OVERDUE_KEY = "hive-overdue-dialog-last-shown";

function todayISO(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Return a yyyy-MM-dd string offset by N days from today (positive = future, negative = past). */
function daysFromNow(n: number): string {
	const d = new Date();
	d.setDate(d.getDate() + n);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Navigate to project tasks tab, suppressing the overdue dialog. */
async function goToProjectTasks(page: Page, projectName: string) {
	await page.addInitScript(
		({ overdueKey, todayStr }) => {
			localStorage.setItem(overdueKey, todayStr);
		},
		{ overdueKey: OVERDUE_KEY, todayStr: todayISO() },
	);
	await page.goto(`/hive/projects/${projectName}?tab=tasks`);
	await page.waitForLoadState("domcontentloaded");
}

/** Open task detail sheet by clicking on the task title. */
async function openTaskSheet(page: Page, taskTitle: string) {
	await expect(page.getByText(taskTitle).first()).toBeVisible({
		timeout: 15000,
	});
	await page.getByText(taskTitle).first().click();
	const sheet = page.locator('[role="dialog"]');
	await expect(sheet.getByText("Task Details")).toBeVisible({
		timeout: 5000,
	});
	return sheet;
}

/** Open the Settings dialog from the sidebar. */
async function openSettings(page: Page) {
	const settingsBtn = page
		.locator('[data-slot="sidebar-menu-button"]')
		.filter({ hasText: "Settings" });
	await settingsBtn.click();
	await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
}

/** Switch to the General tab inside the Settings dialog. */
async function switchToGeneralTab(page: Page) {
	await page.getByRole("tab", { name: "General" }).click();
	await expect(page.getByRole("heading", { name: "Due Dates" })).toBeVisible({ timeout: 5000 });
}

/** Locate the lock due date switch in the Settings dialog. */
function lockDueDateSwitch(page: Page): Locator {
	return page
		.locator(".flex.items-center")
		.filter({ hasText: "Lock due date on or after due date" })
		.locator('[data-slot="switch"]');
}

async function cleanupTestTasks(
	request: import("@playwright/test").APIRequestContext,
) {
	try {
		const tasks = await getList<{ name: string }>(request, "Hive Task", {
			fields: ["name"],
			filters: { title: ["like", `${TASK_PREFIX}%`] },
			limit: 100,
		});
		for (const task of tasks) {
			try {
				await deleteDoc(request, "Hive Task", task.name);
			} catch {
				// Ignore cleanup errors
			}
		}
	} catch {
		// Ignore cleanup errors
	}
}

test.describe("Lock Due Date Config", () => {
	let testProject: HiveProject;
	let pastDueTask: HiveTask;
	let futureDueTask: HiveTask;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Ensure the setting is ON (default)
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			lock_due_date_on_or_after: 1,
		});

		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});

		// Task with due date in the past (should be locked)
		pastDueTask = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} Past ${Date.now()}`,
			project: testProject.name,
			status: "In Progress",
			due_date: daysFromNow(-3),
		});

		// Task with due date in the future (should NOT be locked)
		futureDueTask = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} Future ${Date.now()}`,
			project: testProject.name,
			status: "In Progress",
			due_date: daysFromNow(7),
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Restore the default setting
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			lock_due_date_on_or_after: 1,
		});
	});

	test("settings toggle is visible in General tab and defaults to ON", async ({
		page,
	}) => {
		await page.addInitScript(
			({ overdueKey, todayStr }) => {
				localStorage.setItem(overdueKey, todayStr);
			},
			{ overdueKey: OVERDUE_KEY, todayStr: todayISO() },
		);
		await page.goto("/hive");
		await page.waitForLoadState("domcontentloaded");
		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible({ timeout: 15000 });

		await openSettings(page);
		await switchToGeneralTab(page);

		const toggle = lockDueDateSwitch(page);
		await expect(toggle).toBeVisible();
		await expect(toggle).toHaveAttribute("data-checked", "");
	});

	test("due date is locked (read-only) for task with past due date", async ({
		page,
	}) => {
		await goToProjectTasks(page, testProject.name);
		const sheet = await openTaskSheet(page, pastDueTask.title);

		// Due date should be rendered as plain text (not a button/DatePicker)
		const dueDateLabel = sheet.locator(".grid.gap-2").filter({ has: page.getByText("Due Date", { exact: true }) });
		const lockedText = dueDateLabel.locator("p.text-sm.text-muted-foreground");
		await expect(lockedText).toBeVisible();
		await expect(lockedText).toHaveAttribute(
			"title",
			"Due date is locked on or after the due date",
		);

		// There should be no DatePicker button in the Due Date section
		const datePickerBtn = dueDateLabel.locator("button");
		await expect(datePickerBtn).toHaveCount(0);
	});

	test("due date is editable for task with future due date", async ({
		page,
	}) => {
		await goToProjectTasks(page, testProject.name);
		const sheet = await openTaskSheet(page, futureDueTask.title);

		// Due date should be rendered as a DatePicker (button)
		const dueDateLabel = sheet.locator(".grid.gap-2").filter({ has: page.getByText("Due Date", { exact: true }) });

		// Should NOT have the locked text with title attribute
		const lockedText = dueDateLabel.locator('p[title="Due date is locked on or after the due date"]');
		await expect(lockedText).toHaveCount(0);

		// Should have a clickable button (the DatePicker trigger)
		const datePickerBtn = dueDateLabel.locator("button");
		await expect(datePickerBtn).toBeVisible();
	});

	test("due date is editable when lock setting is disabled", async ({
		page,
		request,
	}) => {
		// Disable the lock setting
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			lock_due_date_on_or_after: 0,
		});

		await goToProjectTasks(page, testProject.name);
		const sheet = await openTaskSheet(page, pastDueTask.title);

		// Even though due date is in the past, it should be editable because the setting is OFF
		const dueDateLabel = sheet.locator(".grid.gap-2").filter({ has: page.getByText("Due Date", { exact: true }) });

		// Should NOT have the locked title
		const lockedText = dueDateLabel.locator('p[title="Due date is locked on or after the due date"]');
		await expect(lockedText).toHaveCount(0);

		// Should have a clickable DatePicker button
		const datePickerBtn = dueDateLabel.locator("button");
		await expect(datePickerBtn).toBeVisible();

		// Re-enable the setting for subsequent tests
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			lock_due_date_on_or_after: 1,
		});
	});

	test("toggling setting OFF in UI disables the lock", async ({
		page,
	}) => {
		await page.addInitScript(
			({ overdueKey, todayStr }) => {
				localStorage.setItem(overdueKey, todayStr);
			},
			{ overdueKey: OVERDUE_KEY, todayStr: todayISO() },
		);
		await page.goto("/hive");
		await page.waitForLoadState("domcontentloaded");
		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible({ timeout: 15000 });

		await openSettings(page);
		await switchToGeneralTab(page);

		const toggle = lockDueDateSwitch(page);
		await expect(toggle).toHaveAttribute("data-checked", "");

		// Toggle OFF
		await toggle.click();
		await expect(toggle).toHaveAttribute("data-unchecked", "");

		// Toggle back ON
		await toggle.click();
		await expect(toggle).toHaveAttribute("data-checked", "");
	});
});
