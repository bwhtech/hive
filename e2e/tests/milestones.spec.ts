import { test, expect } from "@playwright/test";
import {
	createTestProject,
	createTestMilestone,
	createTestTask,
	cleanupTestProjects,
	cleanupTestMilestones,
	HiveProject,
	HiveMilestone,
} from "../helpers/hive";
import { getDoc, getList, deleteDoc, updateDoc } from "../helpers/frappe";

const TEST_PREFIX = "E2E Milestone";
const PROJECT_PREFIX = "E2E Milestone Project";

/**
 * Cleanup test tasks created during milestone tests.
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

test.describe("Milestones", () => {
	let testProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestMilestones(request, TEST_PREFIX);
		await cleanupTestProjects(request, PROJECT_PREFIX);
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestMilestones(request, TEST_PREFIX);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should show empty state when no milestones exist", async ({
		page,
	}) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Navigate to Milestones tab
		await page.getByRole("tab", { name: /Milestones/ }).click();

		// Verify empty state
		await expect(page.getByText("No milestones yet")).toBeVisible({
			timeout: 10000,
		});
		await expect(
			page.getByText("Create a milestone to track project progress"),
		).toBeVisible();
	});

	test("should create a milestone via the Add Milestone button", async ({
		page,
	}) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Navigate to Milestones tab
		await page.getByRole("tab", { name: /Milestones/ }).click();

		// Click Add Milestone
		await page.getByRole("button", { name: "Add Milestone" }).click();

		// Dialog should open
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });
		await expect(dialog.getByText("New Milestone")).toBeVisible();

		// Fill in title
		const milestoneTitle = `${TEST_PREFIX} UI ${Date.now()}`;
		await dialog
			.locator('input[placeholder="e.g. Beta Release"]')
			.fill(milestoneTitle);

		// Submit
		await dialog
			.getByRole("button", { name: "Create Milestone" })
			.click();

		// Verify success toast
		await expect(page.getByText("Milestone created")).toBeVisible({
			timeout: 10000,
		});

		// Verify milestone appears in the list
		await expect(page.getByText(milestoneTitle)).toBeVisible({
			timeout: 10000,
		});
	});

	test("should display an API-created milestone with correct details", async ({
		page,
		request,
	}) => {
		const milestoneTitle = `${TEST_PREFIX} Display ${Date.now()}`;
		await createTestMilestone(request, {
			title: milestoneTitle,
			project: testProject.name,
			status: "In Progress",
			target_date: "2026-06-15",
		});

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Navigate to Milestones tab
		await page.getByRole("tab", { name: /Milestones/ }).click();

		// Verify milestone title is visible
		await expect(page.getByText(milestoneTitle)).toBeVisible({
			timeout: 10000,
		});

		// Verify the status badge shows "In Progress"
		await expect(page.getByText("In Progress").first()).toBeVisible();

		// Verify the target date is displayed (formatted as "Jun 15, 2026")
		await expect(page.getByText("Jun 15, 2026")).toBeVisible();
	});

	test("should change milestone status via the status selector", async ({
		page,
		request,
	}) => {
		const milestoneTitle = `${TEST_PREFIX} Status ${Date.now()}`;
		const milestone = await createTestMilestone(request, {
			title: milestoneTitle,
			project: testProject.name,
			status: "Upcoming",
		});

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Navigate to Milestones tab
		await page.getByRole("tab", { name: /Milestones/ }).click();

		// Wait for milestone to appear
		await expect(page.getByText(milestoneTitle)).toBeVisible({
			timeout: 10000,
		});

		// Find the milestone card (data-slot="card") containing our title
		const card = page
			.locator('[data-slot="card"]')
			.filter({ hasText: milestoneTitle });
		const statusTrigger = card.locator('[data-slot="select-trigger"]');

		await expect(statusTrigger).toContainText("Upcoming");
		await statusTrigger.click();

		// Wait for dropdown content to appear, then select "Completed"
		const completedOption = page
			.locator('[data-slot="select-item"]')
			.filter({ hasText: "Completed" });
		await expect(completedOption).toBeVisible({ timeout: 5000 });
		await completedOption.click();

		// Wait for the status badge to reflect the change
		await expect(statusTrigger).toContainText("Completed", {
			timeout: 10000,
		});

		// Verify via API that status was updated
		const updated = await getDoc<HiveMilestone>(
			request,
			"Hive Milestone",
			milestone.name,
		);
		expect(updated.status).toBe("Completed");
	});

	test("should show milestone progress when tasks are linked", async ({
		page,
		request,
	}) => {
		const milestoneTitle = `${TEST_PREFIX} Progress ${Date.now()}`;
		const milestone = await createTestMilestone(request, {
			title: milestoneTitle,
			project: testProject.name,
			status: "In Progress",
		});

		// Create 3 tasks linked to this milestone: 2 Done, 1 Backlog
		await createTestTask(request, {
			title: `${TEST_PREFIX} Task Done 1`,
			project: testProject.name,
			status: "Done",
		}).then((t) =>
			updateDoc(request, "Hive Task", t.name, {
				milestone: milestone.name,
			}),
		);

		await createTestTask(request, {
			title: `${TEST_PREFIX} Task Done 2`,
			project: testProject.name,
			status: "Done",
		}).then((t) =>
			updateDoc(request, "Hive Task", t.name, {
				milestone: milestone.name,
			}),
		);

		await createTestTask(request, {
			title: `${TEST_PREFIX} Task Backlog`,
			project: testProject.name,
			status: "Backlog",
		}).then((t) =>
			updateDoc(request, "Hive Task", t.name, {
				milestone: milestone.name,
			}),
		);

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Navigate to Milestones tab
		await page.getByRole("tab", { name: /Milestones/ }).click();

		// Wait for milestone to appear
		await expect(page.getByText(milestoneTitle)).toBeVisible({
			timeout: 10000,
		});

		// Verify progress text shows "2/3 tasks"
		await expect(page.getByText("2/3 tasks")).toBeVisible({
			timeout: 10000,
		});

		// Verify progress percentage shows "67%"
		await expect(page.getByText("67%")).toBeVisible();
	});
});
