import { test, expect, Page } from "../helpers/app";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import {
	callMethod,
	createDoc,
	deleteDoc,
	getList,
	updateDoc,
} from "../helpers/frappe";
import { tabButton } from "../helpers/ui";

const PROJECT_PREFIX = "E2E TeamTab Project";
const TASK_PREFIX = "E2E TeamTab Task";

function todayISO(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysFromNow(n: number): string {
	const d = new Date();
	d.setDate(d.getDate() + n);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Navigate to Dashboard > Team tab with overdue dialog suppressed.
 */
/**
 * The dashboard's Team tab was folded into the `/team` page, so this is a
 * navigation now rather than a tab click.
 */
async function goToTeamPage(page: Page) {
	await page.goto("/hive/team");
	await page.waitForLoadState("networkidle");
	await expect(page.getByRole("heading", { name: "Team" })).toBeVisible({
		timeout: 15000,
	});
}

/** Open a member's card so its task lists render. */
async function expandMember(page: Page, name: string) {
	const card = page.getByRole("button", { name: new RegExp(`Expand ${name}`) });
	await expect(card.first()).toBeVisible({ timeout: 15000 });
	await card.first().click();
}

/**
 * Cleanup test tasks matching prefix.
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
				// ignore
			}
		}
	} catch {
		// ignore
	}
}

/**
 * Ensure Administrator is an active team member (Hive Member).
 */
async function ensureTeamMember(
	request: import("@playwright/test").APIRequestContext,
) {
	const existing = await getList<{ name: string; is_active: number }>(
		request,
		"Hive Member",
		{
			fields: ["name", "is_active"],
			filters: { user: "Administrator", type: "Team" },
			limit: 1,
		},
	);
	if (existing.length > 0) {
		if (!existing[0].is_active) {
			await updateDoc(request, "Hive Member", existing[0].name, {
				is_active: 1,
			});
		}
		return;
	}
	await createDoc(request, "Hive Member", {
		user: "Administrator",
		type: "Team",
		is_active: 1,
	});
}

test.describe("Team page", () => {
	let testProject: HiveProject;
	let completedTask: HiveTask;
	let overdueTask: HiveTask;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Ensure Administrator is an active team member
		await ensureTeamMember(request);

		// Create test project
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});

		// Create a completed task (Done, completed today)
		completedTask = await createTestTask(request, {
			title: `${TASK_PREFIX} Completed ${Date.now()}`,
			project: testProject.name,
			status: "Done",
			priority: "Medium",
		});
		await updateDoc(request, "Hive Task", completedTask.name, {
			completed_on: todayISO(),
		});

		// Create an overdue task (past due date, not Done)
		overdueTask = await createTestTask(request, {
			title: `${TASK_PREFIX} Overdue ${Date.now()}`,
			project: testProject.name,
			status: "In Progress",
			priority: "High",
		});
		await updateDoc(request, "Hive Task", overdueTask.name, {
			due_date: daysFromNow(-3),
		});

		// Assign both tasks to Administrator
		await callMethod(request, "frappe.desk.form.assign_to.add", {
			doctype: "Hive Task",
			name: completedTask.name,
			assign_to: ["Administrator"],
		});
		await callMethod(request, "frappe.desk.form.assign_to.add", {
			doctype: "Hive Task",
			name: overdueTask.name,
			assign_to: ["Administrator"],
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should display completed tasks chart with weekly/monthly toggle", async ({
		page,
	}) => {
		await goToTeamPage(page);

		// Chart card heading
		await expect(
			page.getByText("Completed tasks", { exact: true }),
		).toBeVisible({ timeout: 10000 });

		// Weekly and Monthly toggle buttons
		await expect(tabButton(page, "Week")).toBeVisible();
		await expect(tabButton(page, "Month")).toBeVisible();
	});

	test("should switch between weekly and monthly chart periods", async ({
		page,
	}) => {
		await goToTeamPage(page);

		// Weekly is default (should have active styling)
		const weeklyBtn = tabButton(page, "Week");
		const monthlyBtn = tabButton(page, "Month");
		await expect(weeklyBtn).toBeVisible();

		// Click Monthly
		await monthlyBtn.click();
		// Chart should still be visible (no crash)
		await expect(
			page.getByText("Completed tasks", { exact: true }),
		).toBeVisible();

		// Click Weekly again
		await weeklyBtn.click();
		await expect(
			page.getByText("Completed tasks", { exact: true }),
		).toBeVisible();
	});

	test("should show member card with overdue badge for member with overdue tasks", async ({
		page,
	}) => {
		await goToTeamPage(page);

		// Administrator member card should be visible
		await expect(page.getByText("Administrator").first()).toBeVisible({
			timeout: 10000,
		});

		// Overdue badge should appear (e.g., "1 overdue")
		await expect(page.getByText(/\d+ overdue/).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should show member card with completed badge for member with completed tasks", async ({
		page,
	}) => {
		await goToTeamPage(page);

		// Done badge should appear (e.g., "1 done")
		await expect(page.getByText(/\d+ done/).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should display overdue task details under member card", async ({
		page,
	}) => {
		await goToTeamPage(page);
		// The per-member task lists now live behind the card's toggle.
		await expandMember(page, "Administrator");

		// "Overdue" section header should be visible
		await expect(page.getByText(/Overdue \(\d+\)/).first()).toBeVisible({
			timeout: 10000,
		});

		// Our overdue task title should appear
		await expect(page.getByText(overdueTask.title).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should display completed task details under member card", async ({
		page,
	}) => {
		await goToTeamPage(page);
		await expandMember(page, "Administrator");

		// "Completed" section header should be visible
		await expect(page.getByText(/Completed \(\d+\)/).first()).toBeVisible({
			timeout: 10000,
		});

		// Our completed task title should appear
		await expect(page.getByText(completedTask.title).first()).toBeVisible({
			timeout: 10000,
		});

		// Project title badge should appear next to completed task
		await expect(page.getByText(testProject.title).first()).toBeVisible({
			timeout: 10000,
		});
	});
});
