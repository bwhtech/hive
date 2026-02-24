import { test, expect } from "@playwright/test";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { getDoc, getList, deleteDoc } from "../helpers/frappe";

const TEST_PREFIX = "E2E Task";
const PROJECT_PREFIX = "E2E Task Project";

/**
 * Cleanup test tasks matching a title pattern.
 */
async function cleanupTestTasks(
	request: import("@playwright/test").APIRequestContext,
) {
	try {
		const tasks = await getList<{ name: string }>(request, "Hive Task", {
			fields: ["name"],
			filters: { title: ["like", `${TEST_PREFIX}%`] },
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

test.describe("Tasks", () => {
	let testProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should create a task via the Add Task button", async ({
		page,
	}) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Click "Add Task" button
		await page.locator('button:has-text("Add Task")').click();

		// Fill in the task title
		const taskTitle = `${TEST_PREFIX} Button ${Date.now()}`;
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });
		await dialog
			.locator('input[placeholder="What needs to be done?"]')
			.fill(taskTitle);

		// Submit
		await dialog.getByRole("button", { name: "Create Task" }).click();

		// Verify success toast
		await expect(page.getByText("Task created")).toBeVisible({
			timeout: 10000,
		});

		// Switch to Tasks tab and verify the task appears on the kanban
		await page.getByRole("tab", { name: /Tasks/ }).click();
		await expect(page.getByText(taskTitle).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should create a task via T keyboard shortcut", async ({ page }) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Press T to open create task dialog
		await page.keyboard.press("t");

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });
		await expect(dialog.getByText("New Task")).toBeVisible();

		const taskTitle = `${TEST_PREFIX} Shortcut ${Date.now()}`;
		await dialog
			.locator('input[placeholder="What needs to be done?"]')
			.fill(taskTitle);

		await dialog.getByRole("button", { name: "Create Task" }).click();

		await expect(page.getByText("Task created")).toBeVisible({
			timeout: 10000,
		});
	});

	test("should display API-created task on the kanban board", async ({
		page,
		request,
	}) => {
		const taskTitle = `${TEST_PREFIX} Kanban ${Date.now()}`;
		await createTestTask(request, {
			title: taskTitle,
			project: testProject.name,
			status: "Backlog",
		});

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Switch to Tasks tab
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// The task should appear in the Backlog column
		await expect(page.getByText(taskTitle).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should open task detail sheet and update the title", async ({
		page,
		request,
	}) => {
		const originalTitle = `${TEST_PREFIX} Update ${Date.now()}`;
		const task = await createTestTask(request, {
			title: originalTitle,
			project: testProject.name,
			status: "Backlog",
		});

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Switch to Tasks tab
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Click the task card to open the detail sheet
		await page.getByText(originalTitle).first().click();

		// Task detail sheet should open
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet.getByText("Task Details")).toBeVisible({
			timeout: 5000,
		});

		// Update the title
		const updatedTitle = `${TEST_PREFIX} Updated ${Date.now()}`;
		const titleInput = sheet.locator("#task-detail-title");
		await expect(titleInput).toBeVisible({ timeout: 5000 });
		await titleInput.clear();
		await titleInput.fill(updatedTitle);

		// Save via Ctrl+Enter (task detail sheet uses autosave, no Save button)
		await page.keyboard.press("Control+Enter");

		// Verify success toast (exact match to avoid matching the updated title)
		await expect(
			page.getByText("Task updated", { exact: true }),
		).toBeVisible({ timeout: 10000 });

		// Verify updated title via API
		const updatedTask = await getDoc<HiveTask>(
			request,
			"Hive Task",
			task.name,
		);
		expect(updatedTask.title).toBe(updatedTitle);
	});

	test("should update task priority via the detail sheet", async ({
		page,
		request,
	}) => {
		const taskTitle = `${TEST_PREFIX} Priority ${Date.now()}`;
		const task = await createTestTask(request, {
			title: taskTitle,
			project: testProject.name,
			status: "Backlog",
			priority: "Low",
		});

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Switch to Tasks tab
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Click the task card
		await page.getByText(taskTitle).first().click();

		// Wait for detail sheet
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet.getByText("Task Details")).toBeVisible({
			timeout: 5000,
		});

		// Wait for the sheet to populate with task data
		await expect(sheet.locator("#task-detail-title")).toHaveValue(
			taskTitle,
			{ timeout: 5000 },
		);

		// The Status/Priority/Size selects are in a 3-column grid
		// Priority is the 2nd column (index 1)
		const priorityContainer = sheet.locator(".grid-cols-3 > div").nth(1);
		const priorityTrigger = priorityContainer.locator(
			'[data-slot="select-trigger"]',
		);
		await expect(priorityTrigger).toContainText("Low");

		// Open the priority select and pick "High"
		await priorityTrigger.click();
		await page
			.locator('[data-slot="select-item"]')
			.filter({ hasText: "High" })
			.click();

		// Wait for the trigger to reflect the new value
		await expect(priorityTrigger).toContainText("High");

		// Save via Ctrl+Enter (task detail sheet uses autosave, no Save button)
		await page.keyboard.press("Control+Enter");

		// Verify success toast (exact match to avoid matching task card titles)
		await expect(
			page.getByText("Task updated", { exact: true }),
		).toBeVisible({ timeout: 10000 });

		// Verify via API
		const updated = await getDoc<HiveTask>(
			request,
			"Hive Task",
			task.name,
		);
		expect(updated.priority).toBe("High");
	});
});
