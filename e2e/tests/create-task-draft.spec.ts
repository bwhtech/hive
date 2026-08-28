import { test, expect } from "../helpers/app";
import {
	createTestProject,
	cleanupTestProjects,
	HiveProject,
} from "../helpers/hive";
import { getList, deleteDoc } from "../helpers/frappe";

const TEST_PREFIX = "E2E Draft";
const PROJECT_PREFIX = "E2E Draft Project";
const DRAFT_KEY = "hive-create-task-draft";

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
 * Clear the create task draft from localStorage.
 */
async function clearDraft(page: import("@playwright/test").Page) {
	await page.evaluate(
		(key) => localStorage.removeItem(key),
		DRAFT_KEY,
	);
}

/**
 * Get draft from localStorage.
 */
async function getDraft(page: import("@playwright/test").Page) {
	return page.evaluate((key) => {
		try {
			const raw = localStorage.getItem(key);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}, DRAFT_KEY);
}

test.describe("Create Task Draft Persistence", () => {
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

	test.beforeEach(async ({ page }) => {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await clearDraft(page);
	});

	test("should save form data to localStorage when dialog closes", async ({
		page,
	}) => {
		// Open create task dialog via T shortcut
		await page.keyboard.press("t");
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Fill in the title
		const taskTitle = `${TEST_PREFIX} Draft Save ${Date.now()}`;
		await dialog
			.locator('input[placeholder="What needs to be done?"]')
			.fill(taskTitle);

		// Change priority to "High"
		const priorityTrigger = dialog
			.locator('[data-slot="select-trigger"]')
			.first();
		await priorityTrigger.click();
		await page
			.locator('[data-slot="select-item"]')
			.filter({ hasText: "High" })
			.click();

		// Close the dialog by pressing Escape
		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden({ timeout: 5000 });

		// Verify localStorage has the draft
		const draft = await getDraft(page);
		expect(draft).not.toBeNull();
		expect(draft.title).toBe(taskTitle);
		expect(draft.priority).toBe("High");
	});

	test("should restore form data when dialog reopens", async ({ page }) => {
		const taskTitle = `${TEST_PREFIX} Restore ${Date.now()}`;

		// Pre-seed a draft in localStorage
		await page.evaluate(
			({ key, title }) => {
				localStorage.setItem(
					key,
					JSON.stringify({
						title,
						description: "",
						priority: "Urgent",
						status: "In Progress",
						dueDate: null,
						startDate: null,
						isInternal: false,
						assignees: [],
						selectedMilestone: "",
						selectedProject: "",
					}),
				);
			},
			{ key: DRAFT_KEY, title: taskTitle },
		);

		// Reload so the component reads the fresh draft
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Open create task dialog
		await page.keyboard.press("t");
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Verify the title field is restored
		const titleInput = dialog.locator(
			'input[placeholder="What needs to be done?"]',
		);
		await expect(titleInput).toHaveValue(taskTitle);

		// Verify priority is restored to "Urgent"
		const priorityTrigger = dialog
			.locator('[data-slot="select-trigger"]')
			.first();
		await expect(priorityTrigger).toContainText("Urgent");

		// Verify status is restored to "In Progress"
		const statusTrigger = dialog
			.locator('[data-slot="select-trigger"]')
			.nth(1);
		await expect(statusTrigger).toContainText("In Progress");
	});

	test("should clear draft from localStorage after successful task creation", async ({
		page,
	}) => {
		const taskTitle = `${TEST_PREFIX} ClearDraft ${Date.now()}`;

		// Open dialog and fill the form
		await page.keyboard.press("t");
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		await dialog
			.locator('input[placeholder="What needs to be done?"]')
			.fill(taskTitle);

		// Verify draft exists before submission
		const draftBefore = await getDraft(page);
		expect(draftBefore).not.toBeNull();
		expect(draftBefore.title).toBe(taskTitle);

		// Submit the task
		await dialog.getByRole("button", { name: "Create Task" }).click();

		// Wait for success toast
		await expect(page.getByText("Task created")).toBeVisible({
			timeout: 10000,
		});

		// Verify draft is cleared
		const draftAfter = await getDraft(page);
		expect(draftAfter).toBeNull();
	});

	test("should not persist draft when form is empty", async ({ page }) => {
		// Open create task dialog
		await page.keyboard.press("t");
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Don't fill anything — defaults are title="" priority="Medium" status="To Do"
		// Close the dialog
		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden({ timeout: 5000 });

		// No draft should be saved for an empty form
		const draft = await getDraft(page);
		expect(draft).toBeNull();
	});

	test("should persist draft across page navigation", async ({ page }) => {
		const taskTitle = `${TEST_PREFIX} Navigate ${Date.now()}`;

		// Open dialog and fill the title
		await page.keyboard.press("t");
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		await dialog
			.locator('input[placeholder="What needs to be done?"]')
			.fill(taskTitle);

		// Close dialog
		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden({ timeout: 5000 });

		// Navigate away
		await page.goto("/hive");
		await page.waitForLoadState("networkidle");

		// Navigate back
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");

		// Draft should still exist in localStorage
		const draft = await getDraft(page);
		expect(draft).not.toBeNull();
		expect(draft.title).toBe(taskTitle);

		// Open dialog and verify field is restored
		await page.keyboard.press("t");
		const dialogAfterNav = page.getByRole("dialog");
		await expect(dialogAfterNav).toBeVisible({ timeout: 5000 });

		const titleInput = dialogAfterNav.locator(
			'input[placeholder="What needs to be done?"]',
		);
		await expect(titleInput).toHaveValue(taskTitle);
	});
});
