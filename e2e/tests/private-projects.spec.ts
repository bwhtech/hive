import { test, expect, Page } from "../helpers/app";
import {
	createTestProject,
	cleanupTestProjects,
	createTestTask,
	HiveProject,
} from "../helpers/hive";
import { getDoc } from "../helpers/frappe";
import {
	chooseOption,
	expectDialog,
	gotoHive,
	projectCard,
	runCommand,
	selectTrigger,
} from "../helpers/ui";

const PROJECT_PREFIX = "E2E Priv";

/**
 * The projects page defaults to "All projects" scope, so nothing needs
 * switching — this just waits for the grid to be there.
 */
async function gotoProjects(page: Page) {
	await gotoHive(page, "/projects");
	await expect(selectTrigger(page, "Filter by scope")).toBeVisible({
		timeout: 10000,
	});
}

/** The lock marker a private project card renders. */
function lockIcon(card: ReturnType<typeof projectCard>) {
	return card.getByLabel("Private");
}

test.describe("Private Projects", () => {
	let publicProject: HiveProject;
	let privateProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);

		publicProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} Public ${Date.now()}`,
			is_private: 0,
		});
		privateProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} Private ${Date.now()}`,
			is_private: 1,
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("private project shows lock badge on projects page", async ({
		page,
	}) => {
		await gotoProjects(page);

		const card = projectCard(page, privateProject.name);
		await expect(card).toBeVisible({ timeout: 10000 });
		await expect(lockIcon(card)).toBeVisible();
	});

	test("public project does not show lock badge", async ({ page }) => {
		await gotoProjects(page);

		const card = projectCard(page, publicProject.name);
		await expect(card).toBeVisible({ timeout: 10000 });
		await expect(lockIcon(card)).toHaveCount(0);
	});

	test("create private project via UI with visibility selector", async ({
		page,
	}) => {
		await gotoProjects(page);

		await runCommand(page, "new project", "New project");
		const dialog = await expectDialog(page, "New Project");

		const projectTitle = `${PROJECT_PREFIX} UI Private ${Date.now()}`;
		await dialog.getByLabel("Title").fill(projectTitle);

		await chooseOption(page, "Visibility", "Private", dialog);

		// The private choice explains itself before you commit to it.
		await expect(
			dialog.getByText("Only you will be able to see this project"),
		).toBeVisible();

		await dialog.getByRole("button", { name: "Create Project" }).click();

		await page.waitForURL(/\/hive\/projects\/.+/, { timeout: 10000 });

		await gotoProjects(page);
		const card = page
			.locator('[data-testid="project-card"]')
			.filter({ hasText: projectTitle });
		await expect(card).toBeVisible({ timeout: 10000 });
		await expect(card.getByLabel("Private")).toBeVisible();
	});

	test("private project detail page is accessible to owner", async ({
		page,
	}) => {
		await gotoProjects(page);

		await projectCard(page, privateProject.name).click();

		await expect(page).toHaveURL(
			new RegExp(
				`/hive/projects/${privateProject.slug || privateProject.name}`,
			),
			{ timeout: 10000 },
		);
	});

	test("tasks in private project are visible to owner", async ({
		page,
		request,
	}) => {
		const task = await createTestTask(request, {
			title: `${PROJECT_PREFIX} Task ${Date.now()}`,
			project: privateProject.name,
		});

		await gotoHive(
			page,
			`/tasks?project=${encodeURIComponent(privateProject.name)}`,
		);

		await expect(page.getByText(task.title).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("API-created private project has is_private=1", async ({ request }) => {
		const project = await getDoc<HiveProject>(
			request,
			"Hive Project",
			privateProject.name,
		);
		expect(project.is_private).toBe(1);
	});

	test("default visibility is Public when creating via UI", async ({
		page,
	}) => {
		await gotoProjects(page);

		await runCommand(page, "new project", "New project");
		const dialog = await expectDialog(page, "New Project");

		await expect(selectTrigger(dialog, "Visibility")).toHaveText(/Public/);

		await expect(
			dialog.getByText("Only you will be able to see this project"),
		).toHaveCount(0);
	});
});
