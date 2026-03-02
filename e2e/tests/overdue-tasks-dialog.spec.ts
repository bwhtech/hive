import { test, expect, Page } from "@playwright/test";
import {
	createTestProject,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { callMethod, createDoc, deleteDoc, getList } from "../helpers/frappe";

const PROJECT_PREFIX = "E2E Overdue Dialog";
const TASK_PREFIX = "E2E Overdue Task";
const OVERDUE_KEY = "hive-overdue-dialog-last-shown";

function todayISO(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Return a yyyy-MM-dd string for N days ago. */
function daysAgo(n: number): string {
	const d = new Date();
	d.setDate(d.getDate() - n);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}


/**
 * Navigate to the dashboard WITHOUT suppressing the overdue dialog.
 */
async function goToDashboardAllowDialog(page: Page) {
	// Remove the overdue key so the dialog can appear
	await page.addInitScript(
		({ overdueKey }) => {
			localStorage.removeItem(overdueKey);
		},
		{ overdueKey: OVERDUE_KEY },
	);
	await page.goto("/hive");
	await page.waitForLoadState("domcontentloaded");
}

/**
 * Navigate to the dashboard with the overdue dialog suppressed.
 */
async function goToDashboardSuppressed(page: Page) {
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

test.describe("Overdue Tasks Dialog", () => {
	let testProject: HiveProject;
	let overdueTask1: HiveTask;
	let overdueTask2: HiveTask;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Create a test project
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});

		// Create overdue tasks (due_date in the past) assigned to Administrator
		overdueTask1 = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} High ${Date.now()}`,
			project: testProject.name,
			status: "In Progress",
			priority: "High",
			due_date: daysAgo(3),
		});

		overdueTask2 = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} Medium ${Date.now()}`,
			project: testProject.name,
			status: "To Do",
			priority: "Medium",
			due_date: daysAgo(5),
		});

		// Assign both tasks to Administrator
		await callMethod(request, "frappe.desk.form.assign_to.add", {
			doctype: "Hive Task",
			name: overdueTask1.name,
			assign_to: ["Administrator"],
		});
		await callMethod(request, "frappe.desk.form.assign_to.add", {
			doctype: "Hive Task",
			name: overdueTask2.name,
			assign_to: ["Administrator"],
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should show overdue tasks dialog when user has overdue tasks", async ({
		page,
	}) => {
		await goToDashboardAllowDialog(page);

		// The dialog should appear with the "Overdue Tasks" title
		await expect(
			page.getByRole("heading", { name: "Overdue Tasks" }),
		).toBeVisible({ timeout: 15000 });

		// Both overdue tasks should be listed
		await expect(page.getByText(overdueTask1.title)).toBeVisible();
		await expect(page.getByText(overdueTask2.title)).toBeVisible();

		// Priority badges should be visible
		await expect(
			page.locator('[role="dialog"] [data-slot="badge"]').filter({ hasText: "High" }).first(),
		).toBeVisible();
		await expect(
			page.locator('[role="dialog"] [data-slot="badge"]').filter({ hasText: "Medium" }).first(),
		).toBeVisible();

		// Footer buttons should be present
		await expect(
			page.getByRole("button", { name: "Got it" }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "View All Tasks" }),
		).toBeVisible();
	});

	test("should not show dialog if already shown today", async ({ page }) => {
		// Pre-set localStorage to today's date
		await goToDashboardSuppressed(page);

		// Dashboard should load but dialog should NOT appear
		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible({ timeout: 15000 });

		// Wait a moment for any dialog to potentially appear
		await page.waitForTimeout(2000);

		// Dialog should not be visible
		await expect(
			page.getByRole("heading", { name: "Overdue Tasks" }),
		).toBeHidden();
	});

	test("should dismiss dialog and set localStorage on 'Got it' click", async ({
		page,
	}) => {
		await goToDashboardAllowDialog(page);

		// Wait for dialog
		await expect(
			page.getByRole("heading", { name: "Overdue Tasks" }),
		).toBeVisible({ timeout: 15000 });

		// Click "Got it"
		await page.getByRole("button", { name: "Got it" }).click();

		// Dialog should close
		await expect(
			page.getByRole("heading", { name: "Overdue Tasks" }),
		).toBeHidden();

		// localStorage should be set to today
		const stored = await page.evaluate(
			(key) => localStorage.getItem(key),
			OVERDUE_KEY,
		);
		expect(stored).toBe(todayISO());

		// Dashboard should be visible
		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible();
	});

	test("should navigate to /tasks on 'View All Tasks' click", async ({
		page,
	}) => {
		await goToDashboardAllowDialog(page);

		// Wait for dialog
		await expect(
			page.getByRole("heading", { name: "Overdue Tasks" }),
		).toBeVisible({ timeout: 15000 });

		// Click "View All Tasks"
		await page.getByRole("button", { name: "View All Tasks" }).click();

		// Should navigate to /tasks
		await page.waitForURL("**/hive/tasks", { timeout: 10000 });
		await expect(page).toHaveURL(/\/hive\/tasks/);
	});

	test("should navigate to project on task click", async ({ page }) => {
		await goToDashboardAllowDialog(page);

		// Wait for dialog
		await expect(
			page.getByRole("heading", { name: "Overdue Tasks" }),
		).toBeVisible({ timeout: 15000 });

		// Click on the first overdue task
		await page.getByText(overdueTask2.title).click();

		// Should navigate to the project page with task query param
		await page.waitForURL(`**/hive/projects/${testProject.name}**`, {
			timeout: 10000,
		});
		await expect(page).toHaveURL(
			new RegExp(`/hive/projects/${testProject.name}`),
		);
	});
});

