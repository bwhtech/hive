import { test, expect, Page } from "@playwright/test";
import {
	createTestProject,
	cleanupTestProjects,
	createTestTask,
	HiveProject,
} from "../helpers/hive";
import { getDoc } from "../helpers/frappe";

const PROJECT_PREFIX = "E2E Priv";

/** Navigate to projects page with "All" scope filter so internal projects are visible. */
async function gotoProjects(page: Page) {
	await page.goto("/hive/projects");
	await page.waitForLoadState("networkidle");

	// Switch scope from default "External" to "All projects"
	const scopeTrigger = page
		.locator('[data-slot="select-trigger"]')
		.filter({ hasText: "External" });
	if (await scopeTrigger.isVisible({ timeout: 3000 }).catch(() => false)) {
		await scopeTrigger.click();
		await page.getByRole("option", { name: "All projects" }).click();
		await page.waitForLoadState("networkidle");
	}
}

test.describe("Private Projects", () => {
	let publicProject: HiveProject;
	let privateProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Create a public and a private project for tests
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

		// Find the private project card
		const privateCard = page
			.locator(`a:has-text("${privateProject.title}")`)
			.first();
		await expect(privateCard).toBeVisible({ timeout: 10000 });

		// Should display "Private" badge with lock icon
		await expect(
			privateCard.locator('[data-slot="badge"]').filter({ hasText: "Private" }),
		).toBeVisible();
	});

	test("public project does not show lock badge", async ({ page }) => {
		await gotoProjects(page);

		// Find the public project card
		const publicCard = page
			.locator(`a:has-text("${publicProject.title}")`)
			.first();
		await expect(publicCard).toBeVisible({ timeout: 10000 });

		// Should NOT display "Private" badge
		await expect(publicCard.getByText("Private")).not.toBeVisible();
	});

	test("create private project via UI with visibility selector", async ({
		page,
	}) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Open command palette and create new project
		await page.keyboard.press("Meta+k");
		const cmdDialog = page.locator("div[role='dialog']:has([cmdk-input])");
		await expect(cmdDialog).toBeVisible({ timeout: 5000 });
		await page.locator("[cmdk-input]").fill("new project");
		await page.locator("[cmdk-item]:has-text('New Project')").click();

		// Fill title
		const projectTitle = `${PROJECT_PREFIX} UI Private ${Date.now()}`;
		const titleInput = page.locator('input[placeholder="Project name"]');
		await expect(titleInput).toBeVisible({ timeout: 5000 });
		await titleInput.fill(projectTitle);

		// Change visibility to Private
		const dialog = page.getByRole("dialog").filter({ hasText: "New Project" });
		const visibilityTrigger = dialog
			.locator('[data-slot="select-trigger"]')
			.filter({ hasText: "Public" });
		await visibilityTrigger.click();
		await page.getByRole("option", { name: "Private" }).click();

		// Verify helper text appears
		await expect(
			dialog.getByText("Only you will be able to see this project"),
		).toBeVisible();

		// Submit
		await dialog.getByRole("button", { name: "Create Project" }).click();

		// Verify navigation to new project
		await page.waitForURL(/\/hive\/projects\//, { timeout: 10000 });

		// Go back to projects list and verify badge
		await gotoProjects(page);

		const newCard = page
			.locator(`a:has-text("${projectTitle}")`)
			.first();
		await expect(newCard).toBeVisible({ timeout: 10000 });
		await expect(
			newCard.locator('[data-slot="badge"]').filter({ hasText: "Private" }),
		).toBeVisible();
	});

	test("private project detail page is accessible to owner", async ({
		page,
	}) => {
		await gotoProjects(page);

		// Click on the private project
		await page.locator(`text=${privateProject.title}`).first().click();
		await page.waitForLoadState("networkidle");

		// Should navigate to project detail (URL uses slug)
		await expect(page).toHaveURL(
			new RegExp(`/hive/projects/${privateProject.slug || privateProject.name}`),
		);
	});

	test("tasks in private project are visible to owner", async ({
		page,
		request,
	}) => {
		// Create a task in the private project
		const task = await createTestTask(request, {
			title: `${PROJECT_PREFIX} Task ${Date.now()}`,
			project: privateProject.name,
		});

		// Navigate to tasks page and filter by the private project
		await page.goto(
			`/hive/tasks?project=${encodeURIComponent(privateProject.name)}`,
		);
		await page.waitForLoadState("networkidle");

		// The task should be visible
		await expect(page.locator(`text=${task.title}`).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("API-created private project has is_private=1", async ({
		request,
	}) => {
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
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Open command palette and create new project
		await page.keyboard.press("Meta+k");
		const cmdDialog = page.locator("div[role='dialog']:has([cmdk-input])");
		await expect(cmdDialog).toBeVisible({ timeout: 5000 });
		await page.locator("[cmdk-input]").fill("new project");
		await page.locator("[cmdk-item]:has-text('New Project')").click();

		// Verify dialog is open
		const dialog = page.getByRole("dialog").filter({ hasText: "New Project" });
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Verify default visibility is "Public"
		await expect(
			dialog.locator('[data-slot="select-trigger"]').filter({ hasText: "Public" }),
		).toBeVisible();

		// Verify the private helper text is NOT shown
		await expect(
			dialog.getByText("Only you will be able to see this project"),
		).not.toBeVisible();
	});
});
