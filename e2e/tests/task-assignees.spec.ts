import { test, expect, Page } from "../helpers/app";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { showTaskBoard, taskCard, taskPanel } from "../helpers/ui";
import { getList, deleteDoc, callMethod } from "../helpers/frappe";

const TEST_PREFIX = "E2E Assign";
const PROJECT_PREFIX = "E2E Assign Project";

/**
 * Assignment flows, not assignment markup.
 *
 * These used to assert that an avatar element existed, keyed off a Tailwind
 * `group/card` class and a shadcn `data-slot`, both of which described how the
 * old React app painted a card rather than anything a user does. What matters
 * is that assigning somebody sticks, and that a board tells you at a glance
 * which work is claimed — so that is what these check, with the server as the
 * source of truth rather than the DOM.
 */

async function goToProjectTasks(page: Page, projectName: string) {
	await page.goto(`/hive/projects/${projectName}`);
	await page.waitForLoadState("domcontentloaded");

	const tasksTab = page.getByRole("tab", { name: /Tasks/ });
	await expect(tasksTab).toBeVisible({ timeout: 15000 });
	await tasksTab.click();
	await showTaskBoard(page);
}

/** Open a task's panel from the board. */
async function openTaskPanel(page: Page, title: string) {
	await page.getByText(title).first().click();
	const panel = taskPanel(page);
	await expect(panel).toBeVisible({ timeout: 10000 });
	return panel;
}

/**
 * Who the server thinks a task belongs to.
 *
 * Read through a list query naming `_assign`, the way the app itself reads it —
 * the single-document REST endpoint does not return that field.
 */
async function assigneesOf(
	request: import("@playwright/test").APIRequestContext,
	taskName: string,
): Promise<string[]> {
	const [row] = await getList<{ _assign?: string }>(request, "Hive Task", {
		fields: ["name", "_assign"],
		filters: { name: taskName },
		limit: 1,
	});
	try {
		return JSON.parse(row?._assign || "[]") as string[];
	} catch {
		return [];
	}
}

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

		await assignUserToTask(request, taskWithAssignee.name, "Administrator");
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("the board shows which work is claimed", async ({ page }) => {
		await goToProjectTasks(page, testProject.name);

		const assigned = taskCard(page).filter({ hasText: taskWithAssignee.title });
		await expect(assigned).toBeVisible({ timeout: 10000 });
		await expect(
			assigned.locator('[data-testid="avatar-stack"]'),
		).toBeVisible();

		const unassigned = taskCard(page).filter({ hasText: taskNoAssignee.title });
		await expect(unassigned).toBeVisible();
		await expect(
			unassigned.locator('[data-testid="avatar-stack"]'),
		).toHaveCount(0);
	});

	test("assigning from the task panel sticks", async ({ page, request }) => {
		const task = await createTestTask(request, {
			title: `${TEST_PREFIX} AddAssign ${Date.now()}`,
			project: testProject.name,
			status: "To Do",
		});

		await expect(await assigneesOf(request, task.name)).toEqual([]);

		await goToProjectTasks(page, testProject.name);
		const panel = await openTaskPanel(page, task.title);

		// The control is labelled, so the flow does not care what it is built from.
		await panel.getByLabel("Assignees").click();
		// Name the member rather than taking whichever option sorts first: the
		// site carries `_Test` users that `assign_to.add` rejects, and the app
		// would correctly toast that failure instead of assigning anyone.
		const member = page.getByRole("option", { name: /Administrator/ }).first();
		await expect(member).toBeVisible({ timeout: 10000 });
		await member.click();

		// Poll before closing the picker: `Escape` dismisses the popover, and
		// dismissing it before the change has been sent loses the selection.
		await expect
			.poll(() => assigneesOf(request, task.name), { timeout: 15000 })
			.not.toEqual([]);
		await page.keyboard.press("Escape");

		const assigned = await assigneesOf(request, task.name);
		await page.reload();
		await page.waitForLoadState("networkidle");
		const reopened = await openTaskPanel(page, task.title);
		await expect(reopened.getByLabel("Assignees")).toContainText(
			assigned[0].split("@")[0],
			{ ignoreCase: true },
		);
	});

	test("an unassigned task reads as unassigned", async ({ page }) => {
		await goToProjectTasks(page, testProject.name);
		const panel = await openTaskPanel(page, taskNoAssignee.title);

		await expect(panel.getByLabel("Assignees")).toContainText("Unassigned");
	});
});
