import { test, expect, Page } from "../helpers/app";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	cleanupTestUpdates,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { callMethod, deleteDoc, getList } from "../helpers/frappe";
import { gotoHive, kpi, kpiValue, projectCard, section } from "../helpers/ui";

const PROJECT_PREFIX = "E2E Dashboard Project";
const TASK_PREFIX = "E2E Dashboard Task";

/** Open the dashboard and wait for its tabs to be interactive. */
async function goToDashboard(page: Page) {
	await gotoHive(page, "/");
	await expect(page.getByRole("tab", { name: /My work/ })).toBeVisible({
		timeout: 15000,
	});
}

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

		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});

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

		// The dashboard finds a user's tasks through Frappe's `_assign`.
		await callMethod(request, "frappe.desk.form.assign_to.add", {
			doctype: "Hive Task",
			name: assignedTask.name,
			assign_to: ["Administrator"],
		});
		await callMethod(request, "frappe.desk.form.assign_to.add", {
			doctype: "Hive Task",
			name: inProgressTask.name,
			assign_to: ["Administrator"],
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestUpdates(request, testProject.name);
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("the dashboard has a My work and a Projects tab", async ({ page }) => {
		await goToDashboard(page);

		await expect(page.getByRole("tab", { name: /My work/ })).toBeVisible();
		await expect(page.getByRole("tab", { name: /Projects/ })).toBeVisible();

		// Team moved out to its own page; a tab here would be a second home for
		// the same information, which is the duplication that removed it.
		await expect(page.getByRole("tab", { name: /Team/ })).toHaveCount(0);
	});

	test("should show correct summary cards with task counts", async ({
		page,
	}) => {
		await goToDashboard(page);

		await expect(kpi(page, "Open tasks")).toBeVisible({ timeout: 10000 });
		await expect(kpi(page, "In progress")).toBeVisible();
		await expect(kpi(page, "Unread updates")).toBeVisible();

		// Two tasks were assigned above, one of them in progress.
		await expect
			.poll(() => kpiValue(page, "Open tasks"), { timeout: 10000 })
			.toBeGreaterThanOrEqual(2);
		await expect
			.poll(() => kpiValue(page, "In progress"), { timeout: 10000 })
			.toBeGreaterThanOrEqual(1);
	});

	test("should display my tasks grouped by project", async ({ page }) => {
		await goToDashboard(page);

		const myTasks = section(page, "My tasks");
		await expect(myTasks).toBeVisible({ timeout: 10000 });

		await expect(myTasks.getByText(testProject.title).first()).toBeVisible({
			timeout: 10000,
		});
		await expect(myTasks.getByText(assignedTask.title)).toBeVisible({
			timeout: 10000,
		});
		await expect(myTasks.getByText(inProgressTask.title)).toBeVisible({
			timeout: 10000,
		});
	});

	test("should switch to Projects tab and show project list", async ({
		page,
	}) => {
		await goToDashboard(page);

		await page.getByRole("tab", { name: /Projects/ }).click();

		const card = projectCard(page, testProject.name);
		await expect(card).toBeVisible({ timeout: 10000 });
		await expect(card).toContainText(testProject.title);
		// Exact, or this also matches the "N open" task count in the card footer.
		await expect(card.getByText("Open", { exact: true })).toBeVisible();
	});
});
