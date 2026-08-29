import { test, expect } from "../helpers/app";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { getList, deleteDoc } from "../helpers/frappe";
import {
	boardColumn,
	showTaskBoard,
	sidebarPinned,
	taskCard,
	taskPanel,
} from "../helpers/ui";

/**
 * Pinning flows, not pinning markup.
 *
 * These used to reach for `.group/card` and a `.ring-primary/30` class — how
 * the deleted React app painted a pinned card, not anything a user does. Pinned
 * work is meant to be reachable from the sidebar wherever you are, to float to
 * the top of its column, and to survive a reload; that is what these check.
 * `localStorage` is asserted only where the rule under test is about the store
 * itself, such as the five-pin cap.
 */

const TEST_PREFIX = "E2E Pin";
const PROJECT_PREFIX = "E2E Pin Project";

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
 * Clear pinned tasks from localStorage so tests start fresh.
 */
async function clearPinnedTasks(page: import("@playwright/test").Page) {
	await page.evaluate(() => localStorage.removeItem("hive-pinned-tasks"));
}

/**
 * Get pinned task names from localStorage.
 */
async function getPinnedFromStorage(
	page: import("@playwright/test").Page,
): Promise<string[]> {
	return page.evaluate(() => {
		try {
			return JSON.parse(localStorage.getItem("hive-pinned-tasks") || "[]");
		} catch {
			return [];
		}
	});
}

test.describe("Task Pinning", () => {
	let testProject: HiveProject;
	let taskA: HiveTask;
	let taskB: HiveTask;
	let taskC: HiveTask;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
		taskA = await createTestTask(request, {
			title: `${TEST_PREFIX} Alpha ${Date.now()}`,
			project: testProject.name,
			status: "Backlog",
		});
		taskB = await createTestTask(request, {
			title: `${TEST_PREFIX} Beta ${Date.now()}`,
			project: testProject.name,
			status: "Backlog",
		});
		taskC = await createTestTask(request, {
			title: `${TEST_PREFIX} Gamma ${Date.now()}`,
			project: testProject.name,
			status: "To Do",
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);
		await cleanupTestTasks(request);
	});

	test.beforeEach(async ({ page }) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await clearPinnedTasks(page);
	});

	/** Open the project's board. */
	async function openBoard(page: import("@playwright/test").Page) {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();
		await showTaskBoard(page);
	}

	test("pinning a task puts it in the sidebar", async ({ page }) => {
		await openBoard(page);

		const card = taskCard(page, taskA.name);
		await expect(card).toBeVisible({ timeout: 10000 });
		await card.hover();
		await card.getByLabel("Pin task").click();

		await expect(sidebarPinned(page, taskA.name)).toBeVisible({
			timeout: 10000,
		});

		// Pinned work follows you around the app, not just this board.
		await page.goto("/hive/");
		await page.waitForLoadState("networkidle");
		await expect(sidebarPinned(page, taskA.name)).toBeVisible();
	});

	test("unpinning takes it back out", async ({ page }) => {
		await page.evaluate(
			(name) =>
				localStorage.setItem("hive-pinned-tasks", JSON.stringify([name])),
			taskA.name,
		);
		await openBoard(page);

		await expect(sidebarPinned(page, taskA.name)).toBeVisible({
			timeout: 10000,
		});

		const card = taskCard(page, taskA.name);
		await card.getByLabel("Unpin task").click();

		await expect(sidebarPinned(page, taskA.name)).toHaveCount(0);
	});

	test("the task panel pins and unpins the open task", async ({ page }) => {
		await openBoard(page);
		await taskCard(page, taskC.name).click();

		const panel = taskPanel(page);
		await expect(panel).toBeVisible({ timeout: 10000 });

		await panel.getByLabel("Pin task").click();
		await expect(sidebarPinned(page, taskC.name)).toBeVisible({
			timeout: 10000,
		});

		await panel.getByLabel("Unpin task").click();
		await expect(sidebarPinned(page, taskC.name)).toHaveCount(0);
	});

	test("a pin survives a reload", async ({ page }) => {
		await openBoard(page);

		const card = taskCard(page, taskA.name);
		await card.hover();
		await card.getByLabel("Pin task").click();
		await expect(sidebarPinned(page, taskA.name)).toBeVisible({
			timeout: 10000,
		});

		await page.reload();
		await page.waitForLoadState("networkidle");
		await expect(sidebarPinned(page, taskA.name)).toBeVisible({
			timeout: 10000,
		});
	});

	test("a pinned task floats to the top of its column", async ({ page }) => {
		await page.evaluate(
			(name) =>
				localStorage.setItem("hive-pinned-tasks", JSON.stringify([name])),
			taskB.name,
		);
		await openBoard(page);

		// Alpha and Beta are both in Backlog; Beta is pinned, so it leads.
		const backlog = boardColumn(page, "Backlog");
		await expect(backlog.locator('[data-testid="task-card"]')).toHaveCount(2, {
			timeout: 10000,
		});

		const order = await backlog
			.locator('[data-testid="task-card"]')
			.evaluateAll((cards) =>
				cards.map((c) => c.getAttribute("data-task") || ""),
			);
		expect(order.indexOf(taskB.name)).toBeLessThan(order.indexOf(taskA.name));
	});

	test("only five tasks stay pinned, oldest first out", async ({ page }) => {
		const existing = ["pin-1", "pin-2", "pin-3", "pin-4", "pin-5"];
		await page.evaluate(
			(names) =>
				localStorage.setItem("hive-pinned-tasks", JSON.stringify(names)),
			existing,
		);
		await openBoard(page);

		const card = taskCard(page, taskA.name);
		await expect(card).toBeVisible({ timeout: 10000 });
		await card.hover();
		await card.getByLabel("Pin task").click();

		await expect
			.poll(() => getPinnedFromStorage(page))
			.toEqual(["pin-2", "pin-3", "pin-4", "pin-5", taskA.name]);
	});
});
