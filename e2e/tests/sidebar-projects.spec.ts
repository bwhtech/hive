import { test, expect } from "../helpers/app";
import {
	createTestProject,
	cleanupTestProjects,
	getProject,
	HiveProject,
} from "../helpers/hive";
import { callMethod } from "../helpers/frappe";
import { gotoHive, sidebarProject, sidebarProjectAction } from "../helpers/ui";

/**
 * The sidebar's project rows: pinning to the top, and the row actions that
 * hang off the right-click menu. Pins live server-side (`Hive Pinned
 * Project`), so the checks go through the API to reset and the sidebar to
 * observe.
 */

const PROJECT_PREFIX = "E2E Sidebar Project";
const PIN_API = "bwh_hive.bwh_hive.doctype.hive_pinned_project.hive_pinned_project";

async function pinnedProjects(
	request: import("@playwright/test").APIRequestContext,
): Promise<string[]> {
	return callMethod<string[]>(request, `${PIN_API}.get_pinned_projects`);
}

async function unpinAll(request: import("@playwright/test").APIRequestContext) {
	for (const project of await pinnedProjects(request)) {
		await callMethod(request, `${PIN_API}.toggle_pin`, { project });
	}
}

test.describe("Sidebar projects", () => {
	let older: HiveProject;
	let newer: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);
		older = await createTestProject(request, {
			title: `${PROJECT_PREFIX} Older ${Date.now()}`,
		});
		newer = await createTestProject(request, {
			title: `${PROJECT_PREFIX} Newer ${Date.now()}`,
		});
	});

	test.afterAll(async ({ request }) => {
		await unpinAll(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test.beforeEach(async ({ page, request }) => {
		await unpinAll(request);
		await gotoHive(page, "/");
		await expect(sidebarProject(page, newer.name)).toBeVisible();
	});

	test("pinning from the context menu moves the project to the top", async ({
		page,
		request,
	}) => {
		// The newer project sits above the older one until a pin says otherwise.
		const rows = sidebarProject(page);
		await expect(rows.first()).toHaveAttribute("data-project", newer.name);

		await sidebarProjectAction(page, older.name, "Pin to top");

		await expect(rows.first()).toHaveAttribute("data-project", older.name);
		await expect(sidebarProject(page, older.name)).toHaveAttribute(
			"data-pinned",
			"true",
		);
		expect(await pinnedProjects(request)).toEqual([older.name]);

		// The pin is a server preference, so it is still there after a reload.
		await page.reload();
		await page.waitForLoadState("networkidle");
		await expect(rows.first()).toHaveAttribute("data-project", older.name);

		await sidebarProjectAction(page, older.name, "Unpin");
		await expect(sidebarProject(page, older.name)).not.toHaveAttribute(
			"data-pinned",
			"true",
		);
		await expect(rows.first()).toHaveAttribute("data-project", newer.name);
	});

	test("the project header pins and unpins the same list", async ({ page }) => {
		await gotoHive(page, `/projects/${older.name}`);
		await page.getByRole("button", { name: "Project actions" }).click();
		await page.getByRole("button", { name: "Pin to top of sidebar" }).click();

		await expect(sidebarProject(page, older.name)).toHaveAttribute(
			"data-pinned",
			"true",
		);
		await expect(sidebarProject(page).first()).toHaveAttribute(
			"data-project",
			older.name,
		);
	});

	test("rename from the context menu updates the row and the record", async ({
		page,
		request,
	}) => {
		const title = `${PROJECT_PREFIX} Renamed ${Date.now()}`;
		await sidebarProjectAction(page, older.name, "Rename");

		const dialog = page.getByRole("dialog", { name: "Rename project" });
		await expect(dialog).toBeVisible();
		await dialog.getByLabel("Title").fill(title);
		await dialog.getByRole("button", { name: "Rename" }).click();

		await expect(sidebarProject(page, older.name)).toContainText(title);
		const doc = await getProject(request, older.name);
		expect(doc.title).toBe(title);
	});

	test("archive from the context menu hides the row and can be undone", async ({
		page,
		request,
	}) => {
		await sidebarProjectAction(page, newer.name, "Archive");

		const confirm = page.getByRole("dialog", { name: "Archive project" });
		await expect(confirm).toBeVisible();
		await confirm.getByRole("button", { name: "Archive" }).click();

		await expect(sidebarProject(page, newer.name)).toHaveCount(0);
		expect((await getProject(request, newer.name)).is_archived).toBe(1);

		await page.getByRole("button", { name: "Undo" }).click();
		await expect(sidebarProject(page, newer.name)).toBeVisible();
		expect((await getProject(request, newer.name)).is_archived).toBe(0);
	});

	test("notifications open from the sidebar", async ({ page }) => {
		await page.getByTestId("sidebar-notifications").click();
		await expect(page.getByRole("heading", { name: "Notifications" })).toBeVisible();
	});
});
