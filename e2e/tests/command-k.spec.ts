import { test, expect } from "../helpers/app";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
} from "../helpers/hive";
import { callMethodGet, getList, deleteDoc } from "../helpers/frappe";
import {
	commandGroupLabel,
	commandInput,
	commandItem,
	expectDialog,
	gotoHive,
	openCommandPalette,
	runCommand,
} from "../helpers/ui";

const PROJECT_PREFIX = "E2E CmdK Project";
const TASK_PREFIX = "E2E CmdK Task";

/**
 * Cleanup test tasks created during Command K tests.
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
				// Ignore cleanup errors
			}
		}
	} catch {
		// Ignore cleanup errors
	}
}

test.describe("Command K", () => {
	let testProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
		await createTestTask(request, {
			title: `${TASK_PREFIX} Searchable ${Date.now()}`,
			project: testProject.name,
			status: "Backlog",
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should open and close the command palette with its shortcut", async ({
		page,
	}) => {
		await gotoHive(page, "/");

		const palette = await openCommandPalette(page);
		await expect(commandInput(page)).toBeVisible();

		// The groups the palette offers with an empty query.
		await expect(palette.getByText("Create")).toBeVisible();
		await expect(palette.getByText("Navigation")).toBeVisible();
		await expect(palette.getByText("Actions")).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(palette).not.toBeVisible({ timeout: 3000 });
	});

	test("should create a new task via Command K", async ({ page }) => {
		await gotoHive(page, `/projects/${testProject.name}`);

		await runCommand(page, "new task", "New task in this project");

		const createDialog = await expectDialog(page, "New task");

		const taskTitle = `${TASK_PREFIX} CmdK ${Date.now()}`;
		await createDialog.getByLabel("Title").fill(taskTitle);
		await createDialog.getByRole("button", { name: "Create task" }).click();

		await expect(page.getByText("Task created")).toBeVisible({
			timeout: 10000,
		});
	});

	test("should search for and navigate to an existing project", async ({
		page,
		request,
	}) => {
		// Search is full-text, and Frappe only feeds its index from a five-minute
		// cron — a project created in `beforeAll` is not findable yet. So drive the
		// palette with a project the index already holds: what is under test here
		// is the palette's wiring, not how fast indexing catches up.
		const hits = await callMethodGet<{
			projects: { name: string; title: string; slug: string }[];
		}>(request, "bwh_hive.bwh_hive.api.search", { query: "e2e", limit: 8 });
		const indexed = hits.projects?.[0];
		test.skip(!indexed, "search index holds no projects on this site");

		await gotoHive(page, "/");

		await openCommandPalette(page);
		// Whole words — full-text search does not match a truncated one.
		await commandInput(page).fill(indexed.title);

		// The group heading, not any item — "Go to Projects" also says "Projects".
		await expect(commandGroupLabel(page, "Projects")).toBeVisible({
			timeout: 10000,
		});

		await commandItem(page, indexed.title).first().click();

		await expect(page).toHaveURL(
			new RegExp(`/hive/projects/${indexed.slug || indexed.name}`),
			{ timeout: 10000 },
		);
	});

	test("should open settings from Command K", async ({ page }) => {
		await gotoHive(page, "/");

		await runCommand(page, "settings", "Open settings");

		const settingsDialog = await expectDialog(page, /Settings/);
		await expect(settingsDialog.getByText("Profile").first()).toBeVisible();
	});

	test("should navigate to Dashboard via Command K", async ({ page }) => {
		await gotoHive(page, "/projects");

		await runCommand(page, "dashboard", "Go to Dashboard");

		await expect(page).toHaveURL(/\/hive\/?(\?.*)?$/, { timeout: 10000 });
	});
});
