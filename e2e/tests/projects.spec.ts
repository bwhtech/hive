import { test, expect } from "@playwright/test";
import {
	createTestProject,
	deleteTestProject,
	cleanupTestProjects,
	HiveProject,
} from "../helpers/hive";
import { docExists } from "../helpers/frappe";

test.describe("Projects", () => {
	let testProject: HiveProject;

	test.afterAll(async ({ request }) => {
		await cleanupTestProjects(request);
	});

	test("should display the projects page", async ({ page }) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveURL(/\/hive\/projects/);
	});

	test("should create a new project via command palette", async ({ page }) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Open command palette with Cmd+K
		await page.keyboard.press("Meta+k");
		const dialog = page.locator("div[role='dialog']:has([cmdk-input])");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Search for and select "New Project"
		const input = page.locator("[cmdk-input]");
		await input.fill("new project");
		await page.locator("[cmdk-item]:has-text('New Project')").click();

		// Fill in the project title in the dialog
		const projectTitle = `E2E Test Project ${Date.now()}`;
		const titleInput = page.locator('input[placeholder="Project name"]');
		await expect(titleInput).toBeVisible({ timeout: 5000 });
		await titleInput.fill(projectTitle);

		// Submit the form
		const submitBtn = page.locator(
			'button:has-text("Create Project"), button:has-text("Create")',
		);
		await submitBtn.first().click();

		// Verify project was created by checking it appears in the list
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");
		await expect(
			page.locator(`text=${projectTitle}`).first(),
		).toBeVisible({ timeout: 10000 });
	});

	test("should create a project via API and see it in the list", async ({
		page,
		request,
	}) => {
		testProject = await createTestProject(request, {
			title: `E2E Test Project API ${Date.now()}`,
		});

		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// The API-created project should appear in the list
		await expect(
			page.locator(`text=${testProject.title}`).first(),
		).toBeVisible({ timeout: 10000 });
	});

	test("should navigate to project detail page", async ({
		page,
		request,
	}) => {
		if (!testProject) {
			testProject = await createTestProject(request, {
				title: `E2E Test Project Nav ${Date.now()}`,
			});
		}

		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Click on the project
		await page.locator(`text=${testProject.title}`).first().click();

		// Should navigate to the project detail page
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(/\/hive\/projects\//);
	});

	test("should delete a project via API", async ({ request }) => {
		const tempProject = await createTestProject(request, {
			title: `E2E Test Project Delete ${Date.now()}`,
		});

		// Delete and verify
		await deleteTestProject(request, tempProject.name);

		// Verify it's gone
		const exists = await docExists(
			request,
			"Hive Project",
			tempProject.name,
		);
		expect(exists).toBe(false);
	});
});
