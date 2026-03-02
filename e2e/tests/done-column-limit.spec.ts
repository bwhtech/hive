import { test, expect, Page } from "@playwright/test";
import {
	createTestProject,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { createDoc, deleteDoc, getList, updateDoc } from "../helpers/frappe";

const PROJECT_PREFIX = "E2E Done Column";
const TASK_PREFIX = "E2E DoneCol Task";
const OVERDUE_KEY = "hive-overdue-dialog-last-shown";

function todayISO(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysFromNow(n: number): string {
	const d = new Date();
	d.setDate(d.getDate() + n);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Navigate to project tasks tab, suppressing the overdue dialog. */
async function goToProjectTasks(page: Page, projectName: string) {
	await page.addInitScript(
		({ overdueKey, todayStr }) => {
			localStorage.setItem(overdueKey, todayStr);
		},
		{ overdueKey: OVERDUE_KEY, todayStr: todayISO() },
	);
	await page.goto(`/hive/projects/${projectName}?tab=tasks`);
	await page.waitForLoadState("domcontentloaded");
	// Wait for kanban columns to appear
	await expect(page.getByText("To Do").first()).toBeVisible({ timeout: 15000 });
}

/** Navigate to cross-project tasks page in kanban view, suppressing the overdue dialog. */
async function goToTasksKanban(page: Page) {
	await page.addInitScript(
		({ overdueKey, todayStr }) => {
			localStorage.setItem(overdueKey, todayStr);
		},
		{ overdueKey: OVERDUE_KEY, todayStr: todayISO() },
	);
	await page.goto("/hive/tasks?view=kanban");
	await page.waitForLoadState("domcontentloaded");
	await expect(page.getByText("To Do").first()).toBeVisible({ timeout: 15000 });
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

test.describe("Done Column 7-Day Limit", () => {
	let testProject: HiveProject;
	let recentDoneTask: HiveTask;
	let oldDoneTask: HiveTask;
	let todoTask: HiveTask;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);

		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});

		// Task completed today (within 7 days — should appear in Done column)
		recentDoneTask = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} Recent ${Date.now()}`,
			project: testProject.name,
			status: "Done",
			due_date: daysFromNow(-1),
		});

		// Task completed 10 days ago (outside 7 days — should be hidden)
		oldDoneTask = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} Old ${Date.now()}`,
			project: testProject.name,
			status: "Done",
			due_date: daysFromNow(-15),
		});
		// Manually set completed_on to 10 days ago so it falls outside the 7-day window
		await updateDoc(request, "Hive Task", oldDoneTask.name, {
			completed_on: daysFromNow(-10),
		});

		// A To Do task (should always appear in its column, unaffected by the filter)
		todoTask = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} Todo ${Date.now()}`,
			project: testProject.name,
			status: "To Do",
			due_date: daysFromNow(5),
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("recently completed task appears in Done column on project page", async ({
		page,
	}) => {
		await goToProjectTasks(page, testProject.name);

		// The recent Done task should be visible
		await expect(page.getByText(recentDoneTask.title)).toBeVisible({ timeout: 10000 });

		// The To Do task should also be visible in its own column
		await expect(page.getByText(todoTask.title)).toBeVisible();
	});

	test("task completed more than 7 days ago is hidden from Done column on project page", async ({
		page,
	}) => {
		await goToProjectTasks(page, testProject.name);

		// Wait for the kanban to fully render by checking that a known visible task appears
		await expect(page.getByText(recentDoneTask.title)).toBeVisible({ timeout: 10000 });

		// The old Done task should NOT be visible
		await expect(page.getByText(oldDoneTask.title)).not.toBeVisible();
	});

	test("empty Done column shows 'Nothing done in the last 7 days' message", async ({
		page,
		request,
	}) => {
		// Create a project with no recently-completed tasks
		const emptyProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} Empty ${Date.now()}`,
		});

		// Add a Done task with old completed_on so Done column is empty
		const staleTask = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} Stale ${Date.now()}`,
			project: emptyProject.name,
			status: "Done",
			due_date: daysFromNow(-20),
		});
		await updateDoc(request, "Hive Task", staleTask.name, {
			completed_on: daysFromNow(-15),
		});

		await goToProjectTasks(page, emptyProject.name);

		await expect(
			page.getByText("Nothing done in the last 7 days"),
		).toBeVisible({ timeout: 10000 });

		// Cleanup the extra project and task
		try {
			await deleteDoc(request, "Hive Task", staleTask.name);
			await deleteDoc(request, "Hive Project", emptyProject.name);
		} catch {
			// Ignore cleanup errors
		}
	});

	test("Done column filtering also applies on cross-project tasks kanban", async ({
		page,
	}) => {
		await goToTasksKanban(page);

		// The recent Done task should be visible
		await expect(page.getByText(recentDoneTask.title)).toBeVisible({ timeout: 10000 });

		// The old Done task should NOT be visible
		await expect(page.getByText(oldDoneTask.title)).not.toBeVisible();
	});

	test("non-Done columns are unaffected by the 7-day filter", async ({
		page,
	}) => {
		await goToProjectTasks(page, testProject.name);

		// The To Do task should always be visible regardless of any date logic
		await expect(page.getByText(todoTask.title)).toBeVisible({ timeout: 10000 });
	});
});
