import { test, expect } from "../helpers/app";
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
import {
	chooseOption,
	expectDialog,
	gotoHive,
	milestoneCard,
	openProjectTab,
	selectTrigger,
} from "../helpers/ui";

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
		await gotoHive(page, `/projects/${testProject.name}`);
		await openProjectTab(page, "Milestones");

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
		await gotoHive(page, `/projects/${testProject.name}`);
		await openProjectTab(page, "Milestones");

		// The header and the empty state both offer this; either will do.
		await page.getByRole("button", { name: "Add Milestone" }).first().click();

		const dialog = await expectDialog(page, "New milestone");

		const milestoneTitle = `${TEST_PREFIX} UI ${Date.now()}`;
		await dialog.getByLabel("Title").fill(milestoneTitle);

		await dialog.getByRole("button", { name: "Create milestone" }).click();

		await expect(page.getByText("Milestone created")).toBeVisible({
			timeout: 10000,
		});

		await expect(page.getByText(milestoneTitle)).toBeVisible({
			timeout: 10000,
		});
	});

	test("should display an API-created milestone with correct details", async ({
		page,
		request,
	}) => {
		const milestoneTitle = `${TEST_PREFIX} Display ${Date.now()}`;
		const milestone = await createTestMilestone(request, {
			title: milestoneTitle,
			project: testProject.name,
			status: "In Progress",
			target_date: "2026-06-15",
		});

		await gotoHive(page, `/projects/${testProject.name}`);
		await openProjectTab(page, "Milestones");

		const card = milestoneCard(page, milestone.name);
		await expect(card).toBeVisible({ timeout: 10000 });
		await expect(card).toContainText(milestoneTitle);
		await expect(selectTrigger(card, "Milestone status")).toHaveText(
			/In Progress/,
		);
		await expect(card.getByText("15 Jun 2026")).toBeVisible();
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

		await gotoHive(page, `/projects/${testProject.name}`);
		await openProjectTab(page, "Milestones");

		const card = milestoneCard(page, milestone.name);
		await expect(card).toBeVisible({ timeout: 10000 });

		const status = selectTrigger(card, "Milestone status");
		await expect(status).toHaveText(/Upcoming/);

		await chooseOption(page, "Milestone status", "Completed", card);

		await expect(status).toHaveText(/Completed/, { timeout: 10000 });

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

		// Two of three linked tasks done, so the card should read 2/3 and 67%.
		for (const [title, status] of [
			[`${TEST_PREFIX} Task Done 1`, "Done"],
			[`${TEST_PREFIX} Task Done 2`, "Done"],
			[`${TEST_PREFIX} Task Backlog`, "Backlog"],
		]) {
			const task = await createTestTask(request, {
				title,
				project: testProject.name,
				status,
			});
			await updateDoc(request, "Hive Task", task.name, {
				milestone: milestone.name,
			});
		}

		await gotoHive(page, `/projects/${testProject.name}`);
		await openProjectTab(page, "Milestones");

		const card = milestoneCard(page, milestone.name);
		await expect(card).toBeVisible({ timeout: 10000 });
		await expect(card.getByText("2/3 tasks")).toBeVisible({ timeout: 10000 });
		await expect(card.getByText("67%")).toBeVisible();
	});
});
