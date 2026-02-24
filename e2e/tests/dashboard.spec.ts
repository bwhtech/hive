import { test, expect } from "@playwright/test";
import {
	createTestProject,
	createTestTask,
	createTestUpdate,
	cleanupTestProjects,
	cleanupTestUpdates,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { callMethod, deleteDoc, getList } from "../helpers/frappe";

const PROJECT_PREFIX = "E2E Dashboard Project";
const TASK_PREFIX = "E2E Dashboard Task";

/**
 * Cleanup test tasks matching a title pattern.
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

test.describe("Dashboard", () => {
	let testProject: HiveProject;
	let assignedTask: HiveTask;
	let inProgressTask: HiveTask;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Create a test project
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});

		// Create tasks assigned to current user (Administrator)
		assignedTask = await createTestTask(request, {
			title: `${TASK_PREFIX} Backlog ${Date.now()}`,
			project: testProject.name,
			status: "Backlog",
			priority: "Medium",
		});

		inProgressTask = await createTestTask(request, {
			title: `${TASK_PREFIX} InProgress ${Date.now()}`,
			project: testProject.name,
			status: "In Progress",
			priority: "High",
		});

		// Assign tasks to Administrator via the legacy assigned_to field
		// (The dashboard API uses assigned_to to find user's tasks)
		const { updateDoc } = await import("../helpers/frappe");
		await updateDoc(request, "Hive Task", assignedTask.name, {
			assigned_to: "Administrator",
		});
		await updateDoc(request, "Hive Task", inProgressTask.name, {
			assigned_to: "Administrator",
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestUpdates(request, testProject.name);
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should display dashboard page with three tabs", async ({ page }) => {
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// Verify dashboard heading
		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible({ timeout: 10000 });

		// Verify subtitle
		await expect(
			page.getByText("Overview of your work, projects, and team."),
		).toBeVisible();

		// Verify all three tabs are present
		await expect(
			page.getByRole("tab", { name: /My Work/ }),
		).toBeVisible();
		await expect(
			page.getByRole("tab", { name: /Projects/ }),
		).toBeVisible();
		await expect(page.getByRole("tab", { name: /Team/ })).toBeVisible();
	});

	test("should show correct summary cards with task counts", async ({
		page,
	}) => {
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// My Work tab should be active by default
		// The summary cards show: Open tasks, In progress, Unread updates
		await expect(page.getByText("Open tasks")).toBeVisible({
			timeout: 10000,
		});
		await expect(page.getByText("In progress")).toBeVisible();
		await expect(page.getByText("Unread updates")).toBeVisible();

		// Verify there's at least 1 open task (we created 2)
		// The "Open tasks" card should have a number ≥ 2
		const openTasksCard = page
			.locator('[data-slot="card"]')
			.filter({ hasText: "Open tasks" });
		const openCount = openTasksCard.locator("p.text-3xl");
		await expect(openCount).toBeVisible({ timeout: 10000 });
		const openCountText = await openCount.textContent();
		expect(Number(openCountText)).toBeGreaterThanOrEqual(2);

		// The "In progress" card should have at least 1
		const inProgressCard = page
			.locator('[data-slot="card"]')
			.filter({ hasText: "In progress" });
		const inProgressCount = inProgressCard.locator("p.text-3xl");
		await expect(inProgressCount).toBeVisible();
		const inProgressCountText = await inProgressCount.textContent();
		expect(Number(inProgressCountText)).toBeGreaterThanOrEqual(1);
	});

	test("should display my tasks grouped by project", async ({ page }) => {
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// The "My Tasks" section should be visible
		await expect(page.getByText("My Tasks")).toBeVisible({
			timeout: 10000,
		});

		// Our test project title should appear as a group header
		await expect(
			page.getByText(testProject.title).first(),
		).toBeVisible({ timeout: 10000 });

		// Both assigned tasks should be listed
		await expect(
			page.getByText(assignedTask.title).first(),
		).toBeVisible({ timeout: 10000 });
		await expect(
			page.getByText(inProgressTask.title).first(),
		).toBeVisible({ timeout: 10000 });
	});

	test("should show my projects section", async ({ page }) => {
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// My Projects section should be visible
		await expect(page.getByText("My Projects")).toBeVisible({
			timeout: 10000,
		});

		// Scope to the My Projects card (the one with "My Projects" heading)
		const myProjectsCard = page
			.locator('[data-slot="card"]')
			.filter({ hasText: "My Projects" });

		// Our test project should appear inside the My Projects card
		await expect(
			myProjectsCard.getByText(testProject.title),
		).toBeVisible({ timeout: 10000 });

		// Project entry should show status badge
		await expect(
			myProjectsCard.getByText("Open").first(),
		).toBeVisible();
	});

	test("should switch to Projects tab and show project list", async ({
		page,
	}) => {
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// Switch to Projects tab
		await page.getByRole("tab", { name: /Projects/ }).click();

		// Wait for projects to load
		await page.waitForLoadState("networkidle");

		// Our test project should be visible as a project card
		await expect(
			page.getByText(testProject.title).first(),
		).toBeVisible({ timeout: 10000 });

		// Project card should display status badge
		await expect(
			page
				.locator('[data-slot="card"]')
				.filter({ hasText: testProject.title })
				.getByText("Open")
				.first(),
		).toBeVisible();
	});
});
