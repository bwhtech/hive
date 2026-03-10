import { test, expect } from "@playwright/test";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
} from "../helpers/hive";
import { getList, deleteDoc } from "../helpers/frappe";

const PROJECT_PREFIX = "E2E CmdK Project";
const TASK_PREFIX = "E2E CmdK Task";

/**
 * Cleanup test tasks created during Command K tests.
 */
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

/** Open Command K palette and wait for it to be visible. */
async function openCommandPalette(page: import("@playwright/test").Page) {
	await page.keyboard.press("Meta+k");
	const dialog = page.locator("div[role='dialog']:has([cmdk-input])");
	await expect(dialog).toBeVisible({ timeout: 5000 });
	return dialog;
}

test.describe("Command K", () => {
	let testProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
		// Create a task so we can search for it
		await createTestTask(request, {
			title: `${TASK_PREFIX} Searchable ${Date.now()}`,
			project: testProject.name,
			status: "Backlog",
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should open and close the command palette with Cmd+K", async ({
		page,
	}) => {
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// Open palette
		const dialog = await openCommandPalette(page);

		// Verify input placeholder
		const input = dialog.locator("[cmdk-input]");
		await expect(input).toBeVisible();

		// Verify default groups are visible
		await expect(dialog.getByText("Create")).toBeVisible();
		await expect(dialog.getByText("Navigation")).toBeVisible();
		await expect(dialog.getByText("Actions")).toBeVisible();

		// Close with Escape
		await page.keyboard.press("Escape");
		await expect(dialog).not.toBeVisible({ timeout: 3000 });
	});

	test("should create a new task via Command K", async ({
		page,
	}) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Open palette
		const dialog = await openCommandPalette(page);

		// Search for new task
		const input = dialog.locator("[cmdk-input]");
		await input.fill("new task");

		// Select "New Task in This Project"
		await page
			.locator("[cmdk-item]:has-text('New Task in This Project')")
			.click();

		// Create Task dialog should appear
		const createDialog = page.getByRole("dialog");
		await expect(createDialog).toBeVisible({ timeout: 5000 });

		// Fill in task title and submit
		const taskTitle = `${TASK_PREFIX} CmdK ${Date.now()}`;
		await createDialog
			.locator('input[placeholder="What needs to be done?"]')
			.fill(taskTitle);
		await createDialog
			.getByRole("button", { name: "Create Task" })
			.click();

		// Verify success toast
		await expect(page.getByText("Task created")).toBeVisible({
			timeout: 10000,
		});
	});

	test("should search for and navigate to an existing project", async ({
		page,
	}) => {
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// Open palette
		const dialog = await openCommandPalette(page);

		// Search for our test project (need at least 2 chars)
		const input = dialog.locator("[cmdk-input]");
		await input.fill(PROJECT_PREFIX);

		// Wait for search results to appear (Projects group)
		await expect(dialog.getByText("Projects")).toBeVisible({
			timeout: 10000,
		});

		// Click the project result
		await page
			.locator("[cmdk-item]")
			.filter({ hasText: testProject.title })
			.click();

		// Should navigate to the project detail page (URL uses slug)
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(
			new RegExp(`/hive/projects/${testProject.slug || testProject.name}`),
		);
	});

	test("should open settings from Command K", async ({ page }) => {
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// Open palette
		const dialog = await openCommandPalette(page);

		// Search for settings
		const input = dialog.locator("[cmdk-input]");
		await input.fill("settings");

		// Select "Open Settings"
		await page
			.locator("[cmdk-item]:has-text('Open Settings')")
			.click();

		// Settings dialog should open
		const settingsDialog = page.getByRole("dialog");
		await expect(settingsDialog).toBeVisible({ timeout: 5000 });
		await expect(
			settingsDialog.getByText("Profile").first(),
		).toBeVisible();
	});

	test("should navigate to Dashboard via Command K", async ({ page }) => {
		// Start from projects page
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Open palette
		const dialog = await openCommandPalette(page);

		// Search for dashboard
		const input = dialog.locator("[cmdk-input]");
		await input.fill("dashboard");

		// Select "Go to Dashboard"
		await page
			.locator("[cmdk-item]:has-text('Go to Dashboard')")
			.click();

		// Should navigate to dashboard
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/hive\/?$/);
	});
});
