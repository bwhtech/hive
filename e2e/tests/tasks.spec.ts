import { test, expect } from "../helpers/app";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { getDoc, getList, deleteDoc } from "../helpers/frappe";
import {
	chooseOption,
	expectDialog,
	gotoHive,
	selectTrigger,
	showTaskBoard,
	taskCard,
	taskPanel,
} from "../helpers/ui";

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

/** Open a project's Tasks tab, where the board lives. */
async function gotoProjectTasks(page: import("../helpers/app").Page, project: string) {
	await gotoHive(page, `/projects/${project}?tab=tasks`);
	await expect(page.getByRole("tab", { name: /Tasks/ })).toBeVisible({
		timeout: 10000,
	});
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

	test("should create a task via the Add Task button", async ({ page }) => {
		await gotoProjectTasks(page, testProject.name);

		await page.getByRole("button", { name: "Add Task" }).first().click();

		const dialog = await expectDialog(page, "New task");
		const taskTitle = `${TEST_PREFIX} Button ${Date.now()}`;
		await dialog.getByLabel("Title").fill(taskTitle);
		await dialog.getByRole("button", { name: "Create task" }).click();

		await expect(page.getByText("Task created")).toBeVisible({
			timeout: 10000,
		});

		await expect(page.getByText(taskTitle).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should create a task via T keyboard shortcut", async ({ page }) => {
		await gotoProjectTasks(page, testProject.name);

		await page.keyboard.press("t");

		const dialog = await expectDialog(page, "New task");

		const taskTitle = `${TEST_PREFIX} Shortcut ${Date.now()}`;
		await dialog.getByLabel("Title").fill(taskTitle);
		await dialog.getByRole("button", { name: "Create task" }).click();

		await expect(page.getByText("Task created")).toBeVisible({
			timeout: 10000,
		});
	});

	test("should display API-created task on the kanban board", async ({
		page,
		request,
	}) => {
		const taskTitle = `${TEST_PREFIX} Kanban ${Date.now()}`;
		const task = await createTestTask(request, {
			title: taskTitle,
			project: testProject.name,
			status: "Backlog",
		});

		await gotoProjectTasks(page, testProject.name);
		await showTaskBoard(page);

		await expect(taskCard(page, task.name)).toBeVisible({ timeout: 10000 });
		await expect(taskCard(page, task.name)).toContainText(taskTitle);
	});

	test("should open the task panel and update the title", async ({
		page,
		request,
	}) => {
		const originalTitle = `${TEST_PREFIX} Update ${Date.now()}`;
		const task = await createTestTask(request, {
			title: originalTitle,
			project: testProject.name,
			status: "Backlog",
		});

		await gotoProjectTasks(page, testProject.name);
		await showTaskBoard(page);

		await taskCard(page, task.name).click();

		const panel = taskPanel(page);
		await expect(panel).toBeVisible({ timeout: 10000 });

		const titleInput = panel.getByLabel("Title");
		await expect(titleInput).toHaveValue(originalTitle, { timeout: 10000 });

		const updatedTitle = `${TEST_PREFIX} Updated ${Date.now()}`;
		await titleInput.fill(updatedTitle);

		// The panel autosaves; Mod+Enter flushes it immediately.
		await page.keyboard.press("Control+Enter");

		await expect(page.getByText("Task updated", { exact: true })).toBeVisible({
			timeout: 10000,
		});

		const updatedTask = await getDoc<HiveTask>(request, "Hive Task", task.name);
		expect(updatedTask.title).toBe(updatedTitle);
	});

	test("should update task priority via the task panel", async ({
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

		await gotoProjectTasks(page, testProject.name);
		await showTaskBoard(page);

		await taskCard(page, task.name).click();

		const panel = taskPanel(page);
		await expect(panel).toBeVisible({ timeout: 10000 });
		await expect(panel.getByLabel("Title")).toHaveValue(taskTitle, {
			timeout: 10000,
		});

		await expect(selectTrigger(panel, "Priority")).toHaveText(/Low/);

		await chooseOption(page, "Priority", "High", panel);

		await expect(selectTrigger(panel, "Priority")).toHaveText(/High/);

		// Field edits autosave silently after a debounce — the footer is the only
		// signal, so wait for it rather than for a toast (which only the explicit
		// Mod+Enter save raises).
		await expect(panel.getByText("Saved")).toBeVisible({ timeout: 10000 });

		const updated = await getDoc<HiveTask>(request, "Hive Task", task.name);
		expect(updated.priority).toBe("High");
	});
});
