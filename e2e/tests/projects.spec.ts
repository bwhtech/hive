import { test, expect } from "../helpers/app";
import {
	createTestProject,
	deleteTestProject,
	cleanupTestProjects,
	HiveProject,
} from "../helpers/hive";
import { docExists } from "../helpers/frappe";
import { expectDialog, gotoHive, projectCard, runCommand } from "../helpers/ui";

test.describe("Projects", () => {
	let testProject: HiveProject;

	test.afterAll(async ({ request }) => {
		await cleanupTestProjects(request);
	});

	test("should display the projects page", async ({ page }) => {
		await gotoHive(page, "/projects");

		await expect(page).toHaveURL(/\/hive\/projects/);
		// `exact` matters: the sidebar's own "New project" button matches too,
		// because role-name matching ignores case.
		await expect(
			page.getByRole("button", { name: "New Project", exact: true }),
		).toBeVisible();
	});

	test("should create a new project via command palette", async ({ page }) => {
		await gotoHive(page, "/projects");

		await runCommand(page, "new project", "New project");

		const dialog = await expectDialog(page, "New Project");
		const projectTitle = `E2E Test Project ${Date.now()}`;
		await dialog.getByLabel("Title").fill(projectTitle);
		await dialog.getByRole("button", { name: "Create Project" }).click();

		await expect(dialog).not.toBeVisible({ timeout: 10000 });

		await gotoHive(page, "/projects");
		await expect(page.getByText(projectTitle).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should create a project via API and see it in the list", async ({
		page,
		request,
	}) => {
		testProject = await createTestProject(request, {
			title: `E2E Test Project API ${Date.now()}`,
		});

		await gotoHive(page, "/projects");

		await expect(projectCard(page, testProject.name)).toBeVisible({
			timeout: 10000,
		});
	});

	test("should navigate to project detail page", async ({ page, request }) => {
		if (!testProject) {
			testProject = await createTestProject(request, {
				title: `E2E Test Project Nav ${Date.now()}`,
			});
		}

		await gotoHive(page, "/projects");

		await projectCard(page, testProject.name).click();

		await expect(page).toHaveURL(
			new RegExp(`/hive/projects/${testProject.slug || testProject.name}`),
			{ timeout: 10000 },
		);
		await expect(page.getByText(testProject.title).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should delete a project via API", async ({ request }) => {
		const tempProject = await createTestProject(request, {
			title: `E2E Test Project Delete ${Date.now()}`,
		});

		await deleteTestProject(request, tempProject.name);

		const exists = await docExists(request, "Hive Project", tempProject.name);
		expect(exists).toBe(false);
	});
});
