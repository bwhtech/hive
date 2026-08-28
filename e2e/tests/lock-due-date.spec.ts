import { test, expect, Page, Locator } from "../helpers/app";
import {
	createTestProject,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { createDoc, deleteDoc, getList, updateDoc } from "../helpers/frappe";
import { openSettings, taskPanel } from "../helpers/ui";

const PROJECT_PREFIX = "E2E Lock Due Date";
const TASK_PREFIX = "E2E LockDD Task";

/** Return a yyyy-MM-dd string offset by N days from today (positive = future, negative = past). */
function daysFromNow(n: number): string {
	const d = new Date();
	d.setDate(d.getDate() + n);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Navigate to project tasks tab, suppressing the overdue dialog. */
async function goToProjectTasks(page: Page, projectName: string) {
	await page.goto(`/hive/projects/${projectName}?tab=tasks`);
	await page.waitForLoadState("domcontentloaded");
}

/**
 * Open the task panel by clicking the task title.
 *
 * On desktop the panel is a pane beside the board, not a dialog — it only
 * becomes a `BottomSheet` on a phone — so it is located by its testid.
 */
async function openTaskSheet(page: Page, taskTitle: string) {
	await expect(page.getByText(taskTitle).first()).toBeVisible({
		timeout: 15000,
	});
	await page.getByText(taskTitle).first().click();
	const panel = taskPanel(page);
	await expect(panel).toBeVisible({ timeout: 5000 });
	return panel;
}

/** Switch to the General tab inside the Settings dialog. */
async function switchToGeneralTab(page: Page) {
	await page.getByRole("tab", { name: "General" }).click();
	await expect(page.getByRole("heading", { name: "Due dates" })).toBeVisible({
		timeout: 5000,
	});
}

/**
 * The panel no longer swaps the picker for plain text when the date is locked:
 * it disables the `DatePicker` and hangs this note off it as a description.
 */
const LOCKED_NOTE = "Locked on or after the due date";

/** The Due date field inside the task panel. */
function dueDateInput(scope: Locator): Locator {
	return scope.getByRole("textbox", { name: "Due date" });
}

/** Locate the lock due date switch in the Settings dialog. */
function lockDueDateSwitch(page: Page): Locator {
	return page.getByRole("switch", {
		name: "Lock the due date once it arrives",
	});
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
		await page.goto("/hive");
		await page.waitForLoadState("domcontentloaded");
		await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
			timeout: 15000,
		});

		await openSettings(page);
		await switchToGeneralTab(page);

		const toggle = lockDueDateSwitch(page);
		await expect(toggle).toBeVisible();
		await expect(toggle).toBeChecked();
	});

	test("due date is locked (read-only) for task with past due date", async ({
		page,
	}) => {
		await goToProjectTasks(page, testProject.name);
		const sheet = await openTaskSheet(page, pastDueTask.title);

		await expect(sheet.getByText(LOCKED_NOTE)).toBeVisible();
		await expect(dueDateInput(sheet)).toBeDisabled();
	});

	test("due date is editable for task with future due date", async ({
		page,
	}) => {
		await goToProjectTasks(page, testProject.name);
		const sheet = await openTaskSheet(page, futureDueTask.title);

		await expect(sheet.getByText(LOCKED_NOTE)).toHaveCount(0);
		await expect(dueDateInput(sheet)).toBeEnabled();
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

		// The due date is in the past, so only the setting keeps it editable.
		await expect(sheet.getByText(LOCKED_NOTE)).toHaveCount(0);
		await expect(dueDateInput(sheet)).toBeEnabled();

		// Re-enable the setting for subsequent tests
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			lock_due_date_on_or_after: 1,
		});
	});

	test("toggling setting OFF in UI disables the lock", async ({ page }) => {
		await page.goto("/hive");
		await page.waitForLoadState("domcontentloaded");
		await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
			timeout: 15000,
		});

		await openSettings(page);
		await switchToGeneralTab(page);

		const toggle = lockDueDateSwitch(page);
		await expect(toggle).toBeChecked();

		// Toggle OFF
		await toggle.click();
		await expect(toggle).not.toBeChecked();

		// Toggle back ON
		await toggle.click();
		await expect(toggle).toBeChecked();
	});
});
