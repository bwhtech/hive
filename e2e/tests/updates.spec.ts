import { test, expect, Page } from "../helpers/app";
import {
	createTestProject,
	createTestUpdate,
	cleanupTestProjects,
	cleanupTestUpdates,
	HiveProject,
	HiveProjectUpdate,
} from "../helpers/hive";
import { getDoc } from "../helpers/frappe";
import { draftCard, gotoHive, openProjectTab, typeInEditor } from "../helpers/ui";

const PROJECT_PREFIX = "E2E Update Project";

test.describe("Updates", () => {
	let testProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestUpdates(request, testProject.name);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	/**
	 * Navigate to the Updates tab for the test project.
	 */
	async function goToUpdatesTab(page: Page) {
		await gotoHive(page, `/projects/${testProject.name}`);
		await openProjectTab(page, "Updates");
	}

	test("should show empty state when no updates exist", async ({ page }) => {
		await goToUpdatesTab(page);

		await expect(page.getByText("No updates yet")).toBeVisible({
			timeout: 10000,
		});
		await expect(
			page.getByText("Be the first to share a project update."),
		).toBeVisible();
	});

	test("should post an update and see it in the feed", async ({ page }) => {
		await goToUpdatesTab(page);

		await typeInEditor(page, "This is a test update from E2E");

		await page.getByRole("button", { name: "Post" }).click();

		await expect(page.getByText("Update posted")).toBeVisible({
			timeout: 10000,
		});

		await expect(
			page.getByText("This is a test update from E2E"),
		).toBeVisible({ timeout: 10000 });

		await expect(page.getByText("No updates yet")).toHaveCount(0);
	});

	test("should save a draft and display it in drafts section", async ({
		page,
	}) => {
		await goToUpdatesTab(page);

		await typeInEditor(page, "This is a draft update from E2E");

		await page.getByRole("button", { name: "Save draft" }).click();

		await expect(page.getByText("Draft saved").first()).toBeVisible({
			timeout: 10000,
		});

		await expect(page.getByText("Your drafts")).toBeVisible({
			timeout: 10000,
		});

		const card = draftCard(page).filter({
			hasText: "This is a draft update from E2E",
		});
		await expect(card).toBeVisible({ timeout: 10000 });
		await expect(card.getByText("Draft", { exact: true })).toBeVisible();
	});

	test("should publish a draft and move it to the feed", async ({
		page,
		request,
	}) => {
		const draft = await createTestUpdate(request, {
			project: testProject.name,
			content: "<p>Draft to publish via E2E</p>",
			is_draft: 1,
		});

		await goToUpdatesTab(page);

		const card = draftCard(page, draft.name);
		await expect(card).toBeVisible({ timeout: 10000 });

		await card.getByRole("button", { name: "Publish" }).click();

		await expect(page.getByText("Update published")).toBeVisible({
			timeout: 10000,
		});

		await expect(page.getByText("Draft to publish via E2E")).toBeVisible({
			timeout: 10000,
		});

		const updated = await getDoc<HiveProjectUpdate>(
			request,
			"Hive Project Update",
			draft.name,
		);
		expect(updated.is_draft).toBe(0);
	});

	test("should delete a draft, offering an undo", async ({ page, request }) => {
		const draft = await createTestUpdate(request, {
			project: testProject.name,
			content: "<p>Draft to delete via E2E</p>",
			is_draft: 1,
		});

		await goToUpdatesTab(page);

		const card = draftCard(page, draft.name);
		await expect(card).toBeVisible({ timeout: 10000 });

		await card.getByRole("button", { name: "Delete" }).click();

		// Deleting is a soft archive: no confirm step, and the toast carries Undo.
		await expect(page.getByText("Draft archived")).toBeVisible({
			timeout: 10000,
		});
		await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();

		await expect(draftCard(page, draft.name)).toHaveCount(0, {
			timeout: 10000,
		});
	});
});
