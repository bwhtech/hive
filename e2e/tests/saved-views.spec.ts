import { test, expect } from "@playwright/test";
import {
	createTestProject,
	createTestTask,
	createTestView,
	cleanupTestProjects,
	cleanupTestViews,
	HiveProject,
	HiveView,
} from "../helpers/hive";
import { getDoc } from "../helpers/frappe";

const VIEW_PREFIX = "E2E SV";
const PROJECT_PREFIX = "E2E SV Project";

/**
 * Short random suffix for unique, non-truncated sidebar labels.
 */
function rid() {
	return Math.random().toString(36).substring(2, 7);
}

/**
 * Find a sidebar view item by its label text.
 * The Sidebar component renders as a <div data-slot="sidebar">, not <aside>.
 */
function sidebarView(page: import("@playwright/test").Page, label: string) {
	return page
		.locator('[data-slot="sidebar-menu-item"]')
		.filter({ hasText: label });
}

test.describe("Saved Views", () => {
	let testProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestViews(request, VIEW_PREFIX);
		await cleanupTestProjects(request, PROJECT_PREFIX);
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
		await createTestTask(request, {
			title: `E2E SV Task High ${Date.now()}`,
			project: testProject.name,
			status: "To Do",
			priority: "High",
		});
		await createTestTask(request, {
			title: `E2E SV Task Low ${Date.now()}`,
			project: testProject.name,
			status: "Done",
			priority: "Low",
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestViews(request, VIEW_PREFIX);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should create a saved view via UI", async ({ page }) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		// Click "Save View" button in the toolbar
		await page.getByRole("button", { name: "Save View" }).click();

		// Dialog should open with "Save View" heading
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });
		await expect(
			dialog.getByRole("heading", { name: "Save View" }),
		).toBeVisible();

		// Fill in view name
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		await dialog.locator("#save-view-label").fill(viewLabel);

		// Submit via the button inside the dialog footer
		await dialog.getByRole("button", { name: "Save View" }).click();

		// Verify success toast
		await expect(page.getByText("View saved")).toBeVisible({
			timeout: 10000,
		});

		// URL should now contain view_id
		await expect(page).toHaveURL(/view_id=/, { timeout: 5000 });

		// View title should be shown as a heading on the page
		await expect(
			page.getByRole("heading", { name: viewLabel }),
		).toBeVisible({ timeout: 5000 });
	});

	test("should display an API-created view in the sidebar", async ({
		page,
		request,
	}) => {
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		await createTestView(request, {
			label: viewLabel,
			emoji: "🔥",
			is_public: 1,
		});

		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		// The sidebar should show the view
		await expect(sidebarView(page, viewLabel)).toBeVisible({
			timeout: 10000,
		});
	});

	test("should navigate to a saved view via sidebar click", async ({
		page,
		request,
	}) => {
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		const view = await createTestView(request, {
			label: viewLabel,
			emoji: "📌",
			view_type: "list",
			filters_json: JSON.stringify({ status: "Done" }),
			is_public: 1,
		});

		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		// Click the view in the sidebar
		await sidebarView(page, viewLabel).click();

		// URL should contain view_id and the status filter
		await expect(page).toHaveURL(new RegExp(`view_id=${view.name}`), {
			timeout: 5000,
		});
		await expect(page).toHaveURL(/status=Done/);

		// View name should appear on the page (heading)
		await expect(
			page.getByRole("heading", { name: viewLabel }),
		).toBeVisible({ timeout: 5000 });
	});

	test("should show breadcrumb with view name when active", async ({
		page,
		request,
	}) => {
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		const view = await createTestView(request, {
			label: viewLabel,
			emoji: "🍞",
			is_public: 1,
		});

		await page.goto(`/hive/tasks?view_id=${view.name}`);
		await page.waitForLoadState("networkidle");

		// Breadcrumb should contain "Tasks" link and view name
		const breadcrumb = page.locator("nav[aria-label='breadcrumb']");
		await expect(breadcrumb.getByText("Tasks")).toBeVisible({ timeout: 5000 });
		await expect(breadcrumb.getByText(viewLabel)).toBeVisible();

		// View emoji should appear next to title in the main content area
		await expect(
			page.getByRole("main").getByText("🍞"),
		).toBeVisible();
	});

	test("should edit a saved view label via sidebar menu", async ({
		page,
		request,
	}) => {
		const originalLabel = `${VIEW_PREFIX} ${rid()}`;
		const view = await createTestView(request, {
			label: originalLabel,
			is_public: 0,
		});

		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		// Find the view in sidebar and hover to reveal 3-dot menu
		const viewItem = sidebarView(page, originalLabel);
		await expect(viewItem).toBeVisible({ timeout: 10000 });
		await viewItem.hover();

		// Click the 3-dot menu action button (the SidebarMenuAction)
		await viewItem.locator("button").last().click();

		// Click "Edit" in the dropdown
		await page.getByRole("menuitem", { name: "Edit" }).click();

		// Edit dialog should open
		const dialog = page.getByRole("dialog");
		await expect(
			dialog.getByRole("heading", { name: "Edit View" }),
		).toBeVisible({ timeout: 5000 });

		// Update the label
		const updatedLabel = `${VIEW_PREFIX} ${rid()}`;
		const labelInput = dialog.locator("#edit-view-label");
		await labelInput.clear();
		await labelInput.fill(updatedLabel);

		// Save changes
		await dialog.getByRole("button", { name: "Save Changes" }).click();

		// Verify success toast
		await expect(page.getByText("View updated")).toBeVisible({
			timeout: 10000,
		});

		// Verify updated label via API
		const updatedView = await getDoc<HiveView>(
			request,
			"Hive View",
			view.name,
		);
		expect(updatedView.label).toBe(updatedLabel);
	});

	test("should delete a saved view via sidebar menu", async ({
		page,
		request,
	}) => {
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		await createTestView(request, {
			label: viewLabel,
			is_public: 0,
		});

		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		// Find the view in sidebar
		const viewItem = sidebarView(page, viewLabel);
		await expect(viewItem).toBeVisible({ timeout: 10000 });
		await viewItem.hover();

		// Click the 3-dot menu action button
		await viewItem.locator("button").last().click();

		// Click "Delete" in the dropdown
		await page.getByRole("menuitem", { name: "Delete" }).click();

		// Verify success toast
		await expect(page.getByText("View deleted")).toBeVisible({
			timeout: 10000,
		});

		// View should disappear from sidebar
		await expect(sidebarView(page, viewLabel)).toHaveCount(0, {
			timeout: 5000,
		});
	});

	test("should create a saved view with filters", async ({ page }) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		// Apply a status filter
		const statusTrigger = page
			.locator('[data-slot="select-trigger"]')
			.filter({ hasText: "Status:" });
		await statusTrigger.click();
		await page
			.locator('[data-slot="select-item"]')
			.filter({ hasText: "Done" })
			.click();

		// Click "Save View"
		await page.getByRole("button", { name: "Save View" }).click();

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Verify the filters preview is shown
		await expect(dialog.getByText("Status: Done")).toBeVisible();

		// Fill in view name and save
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		await dialog.locator("#save-view-label").fill(viewLabel);
		await dialog.getByRole("button", { name: "Save View" }).click();

		// Verify success
		await expect(page.getByText("View saved")).toBeVisible({
			timeout: 10000,
		});

		// URL should contain both view_id and the status filter
		await expect(page).toHaveURL(/view_id=/);
		await expect(page).toHaveURL(/status=Done/);
	});

	test("should show Save Changes button when view filters are modified", async ({
		page,
		request,
	}) => {
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		const view = await createTestView(request, {
			label: viewLabel,
			view_type: "list",
			filters_json: JSON.stringify({ priority: "High" }),
			is_public: 1,
		});

		// Navigate to the saved view with its filters
		await page.goto(`/hive/tasks?view_id=${view.name}&priority=High`);
		await page.waitForLoadState("networkidle");

		// Initially, "Save Changes" should NOT be visible (filters match saved view)
		await expect(
			page.getByRole("button", { name: "Save Changes" }),
		).not.toBeVisible({ timeout: 3000 });

		// Change the status filter to diverge from the saved view
		const statusTrigger = page
			.locator('[data-slot="select-trigger"]')
			.filter({ hasText: "Status:" });
		await statusTrigger.click();
		await page
			.locator('[data-slot="select-item"]')
			.filter({ hasText: "Done" })
			.click();

		// "Save Changes" and "Save as New View" should now appear
		await expect(
			page.getByRole("button", { name: "Save Changes" }),
		).toBeVisible({ timeout: 5000 });
		await expect(
			page.getByRole("button", { name: "Save as New View" }),
		).toBeVisible();
	});

	test("should update view filters via Save Changes button", async ({
		page,
		request,
	}) => {
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		const view = await createTestView(request, {
			label: viewLabel,
			view_type: "list",
			filters_json: "{}",
			is_public: 1,
		});

		await page.goto(`/hive/tasks?view_id=${view.name}`);
		await page.waitForLoadState("networkidle");

		// Apply a priority filter
		const priorityTrigger = page
			.locator('[data-slot="select-trigger"]')
			.filter({ hasText: "Priority:" });
		await priorityTrigger.click();
		await page
			.locator('[data-slot="select-item"]')
			.filter({ hasText: "High" })
			.click();

		// Click "Save Changes"
		await page.getByRole("button", { name: "Save Changes" }).click();

		// Verify success toast
		await expect(page.getByText("View updated")).toBeVisible({
			timeout: 10000,
		});

		// Verify the view was updated via API
		const updatedView = await getDoc<HiveView>(
			request,
			"Hive View",
			view.name,
		);
		const savedFilters = JSON.parse(updatedView.filters_json);
		expect(savedFilters.priority).toBe("High");
	});

	test("should create a kanban saved view", async ({ page }) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		// Switch to kanban view via the view mode toggle (second button)
		const viewToggle = page.locator(".rounded-md.border.p-0\\.5");
		await viewToggle.locator("button").nth(1).click();

		// Click "Save View"
		await page.getByRole("button", { name: "Save View" }).click();

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Verify view type is shown as Kanban
		await expect(dialog.getByText("View type: Kanban")).toBeVisible();

		// Fill in view name and save
		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		await dialog.locator("#save-view-label").fill(viewLabel);
		await dialog.getByRole("button", { name: "Save View" }).click();

		await expect(page.getByText("View saved")).toBeVisible({
			timeout: 10000,
		});

		// URL should contain view=kanban
		await expect(page).toHaveURL(/view=kanban/);
	});
});
