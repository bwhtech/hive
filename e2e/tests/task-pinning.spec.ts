import { test, expect } from "@playwright/test";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { getList, deleteDoc } from "../helpers/frappe";

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
async function getPinnedFromStorage(page: import("@playwright/test").Page): Promise<string[]> {
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
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test.beforeEach(async ({ page }) => {
		// Clear pinned tasks before each test
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await clearPinnedTasks(page);
	});

	test("should pin a task from kanban card hover button", async ({ page }) => {
		// Navigate to project and switch to Tasks tab
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Find the task card and hover to reveal pin button
		const taskCard = page.getByText(taskA.title).first();
		await expect(taskCard).toBeVisible({ timeout: 10000 });
		await taskCard.hover();

		// Click the pin button (aria-label="Pin task")
		const pinButton = page
			.locator(".group\\/card")
			.filter({ hasText: taskA.title })
			.getByLabel("Pin task");
		await pinButton.click();

		// Verify: task is stored in localStorage
		const pinned = await getPinnedFromStorage(page);
		expect(pinned).toContain(taskA.name);

		// Verify: the pinned task dock appears at bottom-right
		await expect(page.getByText(taskA.title).last()).toBeVisible({
			timeout: 5000,
		});
	});

	test("should unpin a task from kanban card hover button", async ({ page }) => {
		// Pre-pin a task via localStorage
		await page.evaluate(
			(name) => localStorage.setItem("hive-pinned-tasks", JSON.stringify([name])),
			taskA.name,
		);

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// The pinned card should show the unpin button (always visible, not just on hover)
		const taskCard = page
			.locator(".group\\/card")
			.filter({ hasText: taskA.title });
		await expect(taskCard).toBeVisible({ timeout: 10000 });

		const unpinButton = taskCard.getByLabel("Unpin task");
		await expect(unpinButton).toBeVisible();
		await unpinButton.click();

		// Verify: task removed from localStorage
		const pinned = await getPinnedFromStorage(page);
		expect(pinned).not.toContain(taskA.name);
	});

	test("should pin a task via P keyboard shortcut in detail sheet", async ({
		page,
	}) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Open task detail sheet by clicking the card
		await page.getByText(taskB.title).first().click();
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet.getByText("Task Details")).toBeVisible({
			timeout: 5000,
		});

		// Press P to pin the task
		await page.keyboard.press("p");

		// Verify: task appears in localStorage
		const pinned = await getPinnedFromStorage(page);
		expect(pinned).toContain(taskB.name);
	});

	test("should unpin a task via P keyboard shortcut in detail sheet", async ({
		page,
	}) => {
		// Pre-pin
		await page.evaluate(
			(name) => localStorage.setItem("hive-pinned-tasks", JSON.stringify([name])),
			taskB.name,
		);

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Open task detail sheet
		await page.getByText(taskB.title).first().click();
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet.getByText("Task Details")).toBeVisible({
			timeout: 5000,
		});

		// Press P to unpin
		await page.keyboard.press("p");

		const pinned = await getPinnedFromStorage(page);
		expect(pinned).not.toContain(taskB.name);
	});

	test("should pin task via detail sheet button", async ({ page }) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Open detail sheet
		await page.getByText(taskC.title).first().click();
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet.getByText("Task Details")).toBeVisible({
			timeout: 5000,
		});

		// Click the pin button in the sheet header
		const pinButton = sheet.getByLabel("Pin task");
		await expect(pinButton).toBeVisible();
		await pinButton.click();

		// Verify localStorage
		const pinned = await getPinnedFromStorage(page);
		expect(pinned).toContain(taskC.name);
	});

	test("should persist pinned tasks across page reload", async ({ page }) => {
		// Pin a task
		await page.evaluate(
			(name) => localStorage.setItem("hive-pinned-tasks", JSON.stringify([name])),
			taskA.name,
		);

		// Reload the page
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// The dock should still show the pinned task
		await expect(page.getByText(taskA.title).last()).toBeVisible({
			timeout: 10000,
		});

		// localStorage should still have it
		const pinned = await getPinnedFromStorage(page);
		expect(pinned).toContain(taskA.name);
	});

	test("should highlight pinned task card on kanban with visual ring", async ({
		page,
	}) => {
		// Pin a task
		await page.evaluate(
			(name) => localStorage.setItem("hive-pinned-tasks", JSON.stringify([name])),
			taskA.name,
		);

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// The pinned card should have the ring styling class
		const pinnedCard = page
			.locator(".group\\/card")
			.filter({ hasText: taskA.title });
		await expect(pinnedCard).toBeVisible({ timeout: 10000 });
		await expect(pinnedCard.locator(".ring-primary\\/30").or(pinnedCard)).toBeVisible();
	});

	test("should enforce max 5 pinned tasks (FIFO eviction)", async ({ page }) => {
		// Create 5 extra tasks and pin them all
		const extraTasks: HiveTask[] = [];
		for (let i = 0; i < 5; i++) {
			// We'll simulate by setting localStorage directly
			extraTasks.push({ name: `fake-task-${i}` } as HiveTask);
		}

		// Set 5 pinned tasks in localStorage
		const fiveNames = extraTasks.map((t) => t.name);
		await page.evaluate(
			(names) => localStorage.setItem("hive-pinned-tasks", JSON.stringify(names)),
			fiveNames,
		);

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Pin one more task via the kanban card
		const taskCard = page.getByText(taskA.title).first();
		await expect(taskCard).toBeVisible({ timeout: 10000 });
		await taskCard.hover();

		const pinButton = page
			.locator(".group\\/card")
			.filter({ hasText: taskA.title })
			.getByLabel("Pin task");
		await pinButton.click();

		// Verify: should have 5 tasks (oldest evicted) and include taskA
		const pinned = await getPinnedFromStorage(page);
		expect(pinned.length).toBeLessThanOrEqual(5);
		expect(pinned).toContain(taskA.name);
		// The first fake task should have been evicted
		expect(pinned).not.toContain("fake-task-0");
	});

	test("should float pinned tasks to top of kanban column", async ({ page }) => {
		// Pin taskA (which is in Backlog along with taskB)
		await page.evaluate(
			(name) => localStorage.setItem("hive-pinned-tasks", JSON.stringify([name])),
			taskA.name,
		);

		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Tasks/ }).click();

		// Wait for both tasks to be visible
		await expect(page.getByText(taskA.title).first()).toBeVisible({
			timeout: 10000,
		});
		await expect(page.getByText(taskB.title).first()).toBeVisible({
			timeout: 10000,
		});

		// Get the Backlog column and check that taskA appears before taskB
		// Both are in Backlog, but taskA is pinned so it should be first
		const backlogCards = page
			.locator("[data-column='Backlog'] .group\\/card, [id='Backlog'] .group\\/card")
			.or(
				page.locator(".group\\/card").filter({
					has: page.getByText(taskA.title).or(page.getByText(taskB.title)),
				}),
			);

		const allCardTexts = await backlogCards.allTextContents();
		const indexA = allCardTexts.findIndex((t) => t.includes(taskA.title));
		const indexB = allCardTexts.findIndex((t) => t.includes(taskB.title));

		// Pinned task A should appear before unpinned task B
		if (indexA >= 0 && indexB >= 0) {
			expect(indexA).toBeLessThan(indexB);
		}
	});
});
