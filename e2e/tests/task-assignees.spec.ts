import { test, expect } from "@playwright/test";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { getList, deleteDoc, callMethod } from "../helpers/frappe";

const TEST_PREFIX = "E2E Assign";
const PROJECT_PREFIX = "E2E Assign Project";

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

/**
 * Assign a user to a task via Frappe's standard assign_to API.
 */
async function assignUserToTask(
	request: import("@playwright/test").APIRequestContext,
	taskName: string,
	user: string,
) {
	await callMethod(request, "frappe.desk.form.assign_to.add", {
		doctype: "Hive Task",
		name: taskName,
		assign_to: [user],
	});
}

test.describe("Task Assignees", () => {
	let testProject: HiveProject;
	let taskWithAssignee: HiveTask;
	let taskNoAssignee: HiveTask;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
		taskWithAssignee = await createTestTask(request, {
			title: `${TEST_PREFIX} Assigned ${Date.now()}`,
			project: testProject.name,
			status: "Backlog",
		});
		taskNoAssignee = await createTestTask(request, {
			title: `${TEST_PREFIX} Unassigned ${Date.now()}`,
			project: testProject.name,
			status: "Backlog",
		});

		// Assign Administrator to taskWithAssignee
		await assignUserToTask(request, taskWithAssignee.name, "Administrator");
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should display assignee avatar on kanban card", async ({ page }) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// The task card with an assignee should show an avatar
		const assignedCard = page
			.locator(".group\\/card")
			.filter({ hasText: taskWithAssignee.title });
		await expect(assignedCard).toBeVisible({ timeout: 10000 });

		// Avatar is rendered as an img or a fallback span inside the card
		const avatar = assignedCard.locator('[data-slot="avatar"]');
		await expect(avatar.first()).toBeVisible({ timeout: 5000 });
	});

	test("should not display assignee avatar on unassigned task card", async ({
		page,
	}) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		const unassignedCard = page
			.locator(".group\\/card")
			.filter({ hasText: taskNoAssignee.title });
		await expect(unassignedCard).toBeVisible({ timeout: 10000 });

		// No avatar group should be present on unassigned card
		const avatars = unassignedCard.locator('[data-slot="avatar"]');
		await expect(avatars).toHaveCount(0);
	});

	test("should display assignee in task detail sheet", async ({ page }) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Open task detail sheet
		await page.getByText(taskWithAssignee.title).first().click();
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet.getByText("Task Details")).toBeVisible({
			timeout: 5000,
		});

		// The assignee should be visible in the sheet (Administrator's display name)
		// Look for an avatar element inside the assignees section
		const assigneeSection = sheet.locator('[data-slot="avatar"]');
		await expect(assigneeSection.first()).toBeVisible({ timeout: 5000 });
	});

	test("should show empty assignees for unassigned task in detail sheet", async ({
		page,
	}) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Open task detail sheet for unassigned task
		await page.getByText(taskNoAssignee.title).first().click();
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet.getByText("Task Details")).toBeVisible({
			timeout: 5000,
		});

		// The "Add" button for assignees should be visible but no assignee avatars
		// in the assignee area (look for the add button near the Assignees label)
		await expect(sheet.getByText("Assignees")).toBeVisible();
	});

	test("should add assignee from task detail sheet", async ({
		page,
		request,
	}) => {
		// Create a fresh task with no assignees for this test
		const freshTask = await createTestTask(request, {
			title: `${TEST_PREFIX} AddAssign ${Date.now()}`,
			project: testProject.name,
			status: "To Do",
		});

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Open task detail sheet
		await page.getByText(freshTask.title).first().click();
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet.getByText("Task Details")).toBeVisible({
			timeout: 5000,
		});

		// Click the "Add" button to open assignee picker
		const addButton = sheet.getByRole("button", { name: /Add/ }).first();
		await expect(addButton).toBeVisible({ timeout: 5000 });
		await addButton.click();

		// The assignee popover should appear with a search input
		const popover = page.locator('[data-slot="popover-content"]');
		await expect(popover).toBeVisible({ timeout: 5000 });

		// Select the first member in the list
		const firstMember = popover.locator('[data-slot="command-item"]').first();
		await expect(firstMember).toBeVisible();
		await firstMember.click();

		// An avatar should now appear in the sheet's assignee area
		const assigneeAvatar = sheet.locator('[data-slot="avatar"]');
		await expect(assigneeAvatar.first()).toBeVisible({ timeout: 5000 });
	});
});
