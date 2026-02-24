import { test, expect } from "@playwright/test";
import {
	createTestProject,
	createTestUpdate,
	cleanupTestProjects,
	cleanupTestUpdates,
	HiveProject,
	HiveProjectUpdate,
} from "../helpers/hive";
import { getDoc, deleteDoc } from "../helpers/frappe";

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
	async function goToUpdatesTab(page: import("@playwright/test").Page) {
		await page.goto(`/hive/projects/${testProject.name}`);
		await page.waitForLoadState("networkidle");
		await page.getByRole("tab", { name: /Updates/ }).click();
		// Wait for updates section to load
		await page.waitForLoadState("networkidle");
	}

	test("should show empty state when no updates exist", async ({ page }) => {
		await goToUpdatesTab(page);

		await expect(page.getByText("No updates yet")).toBeVisible({
			timeout: 10000,
		});
		await expect(
			page.getByText("Be the first to share a project update"),
		).toBeVisible();
	});

	test("should post an update and see it in the feed", async ({
		page,
		request,
	}) => {
		await goToUpdatesTab(page);

		// Type into the Tiptap editor (contenteditable div)
		const editor = page.locator(".tiptap-content[contenteditable]").first();
		await editor.click();
		await editor.fill("This is a test update from E2E");

		// Click Post Update
		await page.getByRole("button", { name: "Post Update" }).click();

		// Verify success toast
		await expect(page.getByText("Update posted")).toBeVisible({
			timeout: 10000,
		});

		// Verify update appears in the feed
		await expect(
			page.getByText("This is a test update from E2E"),
		).toBeVisible({ timeout: 10000 });

		// Verify the empty state is gone
		await expect(page.getByText("No updates yet")).not.toBeVisible();
	});

	test("should save a draft and display it in drafts section", async ({
		page,
		request,
	}) => {
		await goToUpdatesTab(page);

		// Type into the editor
		const editor = page.locator(".tiptap-content[contenteditable]").first();
		await editor.click();
		await editor.fill("This is a draft update from E2E");

		// Click Save Draft
		await page.getByRole("button", { name: "Save Draft" }).click();

		// Verify success toast
		await expect(page.getByText("Draft saved")).toBeVisible({
			timeout: 10000,
		});

		// Verify drafts section appears with "Your Drafts" heading
		await expect(page.getByText("Your Drafts")).toBeVisible({
			timeout: 10000,
		});

		// Verify draft content is visible
		await expect(
			page.getByText("This is a draft update from E2E"),
		).toBeVisible();

		// Verify Draft badge is shown
		await expect(page.locator("text=Draft").first()).toBeVisible();
	});

	test("should publish a draft and move it to the feed", async ({
		page,
		request,
	}) => {
		// Create a draft via API
		const draft = await createTestUpdate(request, {
			project: testProject.name,
			content: "<p>Draft to publish via E2E</p>",
			is_draft: 1,
		});

		await goToUpdatesTab(page);

		// Wait for draft to appear
		await expect(
			page.getByText("Draft to publish via E2E"),
		).toBeVisible({ timeout: 10000 });

		// Click Publish on the draft card
		const draftCard = page
			.locator('[data-slot="card"]')
			.filter({ hasText: "Draft to publish via E2E" });
		await draftCard.getByRole("button", { name: "Publish" }).click();

		// Verify success toast
		await expect(page.getByText("Update published")).toBeVisible({
			timeout: 10000,
		});

		// Verify the update is now in the feed (no longer in drafts section with Draft badge)
		await expect(
			page.getByText("Draft to publish via E2E"),
		).toBeVisible({ timeout: 10000 });

		// Verify via API that is_draft is now 0
		const updated = await getDoc<HiveProjectUpdate>(
			request,
			"Hive Project Update",
			draft.name,
		);
		expect(updated.is_draft).toBe(0);
	});

	test("should delete a draft via confirmation dialog", async ({
		page,
		request,
	}) => {
		// Create a draft via API
		const draft = await createTestUpdate(request, {
			project: testProject.name,
			content: "<p>Draft to delete via E2E</p>",
			is_draft: 1,
		});

		await goToUpdatesTab(page);

		// Wait for draft to appear
		await expect(
			page.getByText("Draft to delete via E2E"),
		).toBeVisible({ timeout: 10000 });

		// Click Delete on the draft card
		const draftCard = page
			.locator('[data-slot="card"]')
			.filter({ hasText: "Draft to delete via E2E" });
		await draftCard.getByRole("button", { name: "Delete" }).click();

		// Confirm deletion in the alert dialog
		const dialog = page.getByRole("alertdialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });
		await expect(dialog.getByText("Delete draft?")).toBeVisible();
		await dialog.getByRole("button", { name: "Delete" }).click();

		// Verify success toast
		await expect(page.getByText("Draft deleted")).toBeVisible({
			timeout: 10000,
		});

		// Verify draft is gone from the page
		await expect(
			page.getByText("Draft to delete via E2E"),
		).not.toBeVisible({ timeout: 10000 });
	});
});
