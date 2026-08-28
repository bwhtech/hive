import { test, expect, Page } from "../helpers/app";
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
import {
	chooseOption,
	expectDialog,
	gotoHive,
	sidebarView,
} from "../helpers/ui";

const VIEW_PREFIX = "E2E SV";
const PROJECT_PREFIX = "E2E SV Project";

/**
 * Short random suffix for unique, non-truncated sidebar labels.
 */
function rid() {
	return Math.random().toString(36).substring(2, 7);
}

/** Open the `…` menu in the tasks header, where the view actions live. */
async function openViewActionsMenu(page: Page) {
	await page.getByRole("button", { name: "View actions" }).click();
}

/** The `…` menu on one sidebar view row. */
async function openSidebarViewMenu(page: Page, label: string) {
	const item = sidebarView(page, label);
	await expect(item).toBeVisible({ timeout: 10000 });
	await item.hover();
	await page.getByRole("button", { name: `Actions for ${label}` }).click();
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
		await gotoHive(page, "/tasks");

		await openViewActionsMenu(page);
		await page.getByRole("menuitem", { name: "Save view" }).click();

		const dialog = await expectDialog(page, "Save view");

		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		await dialog.getByLabel("Name").fill(viewLabel);

		await dialog.getByRole("button", { name: "Save view" }).click();

		await expect(page.getByText("View saved")).toBeVisible({ timeout: 10000 });

		await expect(page).toHaveURL(/view_id=/, { timeout: 5000 });

		// The active view names itself in the breadcrumb trail.
		await expect(page.getByText(viewLabel).first()).toBeVisible({
			timeout: 5000,
		});
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

		await gotoHive(page, "/tasks");

		await expect(sidebarView(page, viewLabel)).toBeVisible({ timeout: 10000 });
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

		await gotoHive(page, "/tasks");

		await sidebarView(page, viewLabel).click();

		await expect(page).toHaveURL(new RegExp(`view_id=${view.name}`), {
			timeout: 5000,
		});
		await expect(page).toHaveURL(/status=Done/);
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

		await gotoHive(page, `/tasks?view_id=${view.name}`);

		// The trail is "Tasks › 🍞 <label>", emoji included.
		const header = page.getByRole("banner");
		const trail = (await header.count())
			? header
			: page.locator("header").first();
		await expect(trail.getByText("Tasks", { exact: true })).toBeVisible({
			timeout: 10000,
		});
		await expect(trail.getByText(`🍞 ${viewLabel}`)).toBeVisible();
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

		await gotoHive(page, "/tasks");

		await openSidebarViewMenu(page, originalLabel);
		await page.getByRole("menuitem", { name: "Edit" }).click();

		const dialog = await expectDialog(page, "Edit view");

		const updatedLabel = `${VIEW_PREFIX} ${rid()}`;
		await dialog.getByLabel("Name").fill(updatedLabel);
		await dialog.getByRole("button", { name: "Save", exact: true }).click();

		await expect(page.getByText("View updated")).toBeVisible({
			timeout: 10000,
		});

		const updatedView = await getDoc<HiveView>(request, "Hive View", view.name);
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

		await gotoHive(page, "/tasks");

		await openSidebarViewMenu(page, viewLabel);
		await page.getByRole("menuitem", { name: "Delete" }).click();

		// Deleting a view now asks first.
		const confirm = await expectDialog(page, "Delete this view?");
		await confirm.getByRole("button", { name: /Delete|Confirm/ }).click();

		await expect(page.getByText("View deleted")).toBeVisible({
			timeout: 10000,
		});

		await expect(sidebarView(page, viewLabel)).toHaveCount(0, {
			timeout: 5000,
		});
	});

	test("should create a saved view with filters", async ({ page }) => {
		await gotoHive(page, "/tasks");

		await chooseOption(page, "Status", "Done");

		await openViewActionsMenu(page);
		await page.getByRole("menuitem", { name: "Save view" }).click();

		const dialog = await expectDialog(page, "Save view");

		await expect(dialog.getByText("Status: Done")).toBeVisible();

		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		await dialog.getByLabel("Name").fill(viewLabel);
		await dialog.getByRole("button", { name: "Save view" }).click();

		await expect(page.getByText("View saved")).toBeVisible({ timeout: 10000 });

		await expect(page).toHaveURL(/view_id=/);
		await expect(page).toHaveURL(/status=Done/);
	});

	test("should offer Save changes once view filters are modified", async ({
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

		await gotoHive(page, `/tasks?view_id=${view.name}&priority=High`);

		// Filters still match what the view stores, so it only offers "Save view".
		await openViewActionsMenu(page);
		await expect(
			page.getByRole("menuitem", { name: "Save view" }),
		).toBeVisible({ timeout: 3000 });
		await page.keyboard.press("Escape");

		await chooseOption(page, "Status", "Done");

		await openViewActionsMenu(page);
		await expect(
			page.getByRole("menuitem", { name: "Save changes" }),
		).toBeVisible({ timeout: 5000 });
		await expect(
			page.getByRole("menuitem", { name: "Save as new view" }),
		).toBeVisible();
	});

	test("should update view filters via Save changes", async ({
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

		await gotoHive(page, `/tasks?view_id=${view.name}`);

		await chooseOption(page, "Priority", "High");

		await openViewActionsMenu(page);
		await page.getByRole("menuitem", { name: "Save changes" }).click();

		await expect(page.getByText("View updated")).toBeVisible({
			timeout: 10000,
		});

		const updatedView = await getDoc<HiveView>(request, "Hive View", view.name);
		const savedFilters = JSON.parse(updatedView.filters_json);
		expect(savedFilters.priority).toBe("High");
	});

	test("should create a kanban saved view", async ({ page }) => {
		await gotoHive(page, "/tasks");

		await page.getByRole("radio", { name: "Board" }).click();

		await openViewActionsMenu(page);
		await page.getByRole("menuitem", { name: "Save view" }).click();

		const dialog = await expectDialog(page, "Save view");

		await expect(dialog.getByText("View type: Kanban")).toBeVisible();

		const viewLabel = `${VIEW_PREFIX} ${rid()}`;
		await dialog.getByLabel("Name").fill(viewLabel);
		await dialog.getByRole("button", { name: "Save view" }).click();

		await expect(page.getByText("View saved")).toBeVisible({ timeout: 10000 });

		await expect(page).toHaveURL(/view=kanban/);
	});
});
