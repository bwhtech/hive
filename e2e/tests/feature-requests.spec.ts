import { test, expect, Page } from "@playwright/test";
import {
	createTestProject,
	createTestFeatureRequest,
	cleanupTestProjects,
	cleanupTestFeatureRequests,
	HiveProject,
	HiveFeatureRequest,
} from "../helpers/hive";
import { getDoc, updateDoc } from "../helpers/frappe";

const PROJECT_PREFIX = "E2E FR";
const FR_PREFIX = "E2E FR Req";

/** Navigate to the Requests tab of a project. */
async function gotoRequestsTab(page: Page, projectName: string) {
	await page.goto(`/hive/projects/${projectName}?tab=requests`);
	await page.waitForLoadState("networkidle");
}

/** Click the row actions (three-dot) menu for a feature request row. */
async function openRowActions(page: Page, title: string) {
	const row = page.locator("tr").filter({ hasText: title });
	await expect(row).toBeVisible({ timeout: 10000 });
	const actionsBtn = row.getByRole("button");
	await actionsBtn.click();
	// Wait for the dropdown menu to appear
	await expect(page.getByRole("menu")).toBeVisible({ timeout: 3000 });
}

test.describe("Feature Requests", () => {
	let project: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestFeatureRequests(request, FR_PREFIX);
		await cleanupTestProjects(request, PROJECT_PREFIX);

		project = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestFeatureRequests(request, FR_PREFIX);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("empty state shows when no feature requests exist", async ({
		page,
	}) => {
		await gotoRequestsTab(page, project.name);

		await expect(page.getByText("No feature requests yet")).toBeVisible({
			timeout: 10000,
		});
		await expect(
			page.getByText("Submit a feature request to suggest improvements"),
		).toBeVisible();
	});

	test("create feature request via UI", async ({ page }) => {
		await gotoRequestsTab(page, project.name);

		// Click "New Request" button
		await page.getByRole("button", { name: "New Request" }).click();

		// Dialog should open
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });
		await expect(dialog.getByText("New Feature Request")).toBeVisible();

		// Fill title
		const frTitle = `${FR_PREFIX} UI ${Date.now()}`;
		await dialog.locator("#fr-title").fill(frTitle);

		// Submit
		await dialog.getByRole("button", { name: "Submit Request" }).click();

		// Toast should appear
		await expect(page.getByText("Feature request created")).toBeVisible({
			timeout: 5000,
		});

		// Feature request should appear in the table
		await expect(page.getByText(frTitle)).toBeVisible({ timeout: 5000 });
	});

	test("API-created feature request appears in table", async ({
		page,
		request,
	}) => {
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} API ${Date.now()}`,
			project: project.name,
			priority: "Important",
		});

		await gotoRequestsTab(page, project.name);

		// Title should be visible
		await expect(page.getByText(fr.title)).toBeVisible({ timeout: 10000 });

		// Status badge should show "Open"
		const row = page.locator("tr").filter({ hasText: fr.title });
		await expect(
			row.locator('[data-slot="badge"]').filter({ hasText: "Open" }),
		).toBeVisible();

		// Priority badge should show "Important"
		await expect(
			row.locator('[data-slot="badge"]').filter({ hasText: "Important" }),
		).toBeVisible();
	});

	test("request count header updates correctly", async ({
		page,
		request,
	}) => {
		// Create two feature requests
		await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Count A ${Date.now()}`,
			project: project.name,
		});
		await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Count B ${Date.now()}`,
			project: project.name,
		});

		await gotoRequestsTab(page, project.name);

		// Header should show the count (at least "requests" plural)
		await expect(page.getByText(/\d+ requests/)).toBeVisible({
			timeout: 10000,
		});
	});

	test("set feature request to Under Review via row actions", async ({
		page,
		request,
	}) => {
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Review ${Date.now()}`,
			project: project.name,
		});

		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr.title);

		// Click "Set Under Review"
		await page.getByRole("menuitem", { name: "Set Under Review" }).click();

		// Toast should confirm
		await expect(
			page.getByText("Request set to under review"),
		).toBeVisible({ timeout: 5000 });

		// Verify via API
		const updated = await getDoc<HiveFeatureRequest>(
			request,
			"Hive Feature Request",
			fr.name,
		);
		expect(updated.status).toBe("Under Review");
	});

	test("approve feature request via row actions", async ({
		page,
		request,
	}) => {
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Approve ${Date.now()}`,
			project: project.name,
		});

		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr.title);

		// Click "Approve"
		await page.getByRole("menuitem", { name: "Approve" }).click();

		// Toast
		await expect(page.getByText("Request approved")).toBeVisible({
			timeout: 5000,
		});

		// Verify via API
		const updated = await getDoc<HiveFeatureRequest>(
			request,
			"Hive Feature Request",
			fr.name,
		);
		expect(updated.status).toBe("Approved");
	});

	test("reject feature request via row actions", async ({
		page,
		request,
	}) => {
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Reject ${Date.now()}`,
			project: project.name,
		});

		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr.title);

		// Click "Reject"
		await page.getByRole("menuitem", { name: "Reject" }).click();

		// Toast
		await expect(page.getByText("Request rejected")).toBeVisible({
			timeout: 5000,
		});

		// Verify via API
		const updated = await getDoc<HiveFeatureRequest>(
			request,
			"Hive Feature Request",
			fr.name,
		);
		expect(updated.status).toBe("Rejected");
	});

	test("convert approved request to task via row actions", async ({
		page,
		request,
	}) => {
		// Create a feature request and approve it via API
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Convert ${Date.now()}`,
			project: project.name,
		});

		// Approve via direct status update
		await updateDoc(request, "Hive Feature Request", fr.name, {
			status: "Approved",
		});

		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr.title);

		// Click "Convert to Task"
		await page.getByRole("menuitem", { name: "Convert to Task" }).click();

		// Toast
		await expect(
			page.getByText("Feature request converted to task"),
		).toBeVisible({ timeout: 5000 });

		// Verify via API that status is Converted and converted_task is set
		const updated = await getDoc<HiveFeatureRequest>(
			request,
			"Hive Feature Request",
			fr.name,
		);
		expect(updated.status).toBe("Converted");
		expect(updated.converted_task).toBeTruthy();
	});

	test("converted request shows task badge instead of actions", async ({
		page,
		request,
	}) => {
		// Create and approve via API
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Badge ${Date.now()}`,
			project: project.name,
		});

		await updateDoc(request, "Hive Feature Request", fr.name, {
			status: "Approved",
		});

		// Convert via UI to get the converted_task set properly
		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr.title);
		await page.getByRole("menuitem", { name: "Convert to Task" }).click();
		await expect(
			page.getByText("Feature request converted to task"),
		).toBeVisible({ timeout: 5000 });

		// Reload to get fresh state
		await gotoRequestsTab(page, project.name);

		// Find the row — should show "Converted" status badge
		const row = page.locator("tr").filter({ hasText: fr.title });
		await expect(
			row.locator('[data-slot="badge"]').filter({ hasText: "Converted" }),
		).toBeVisible({ timeout: 10000 });

		// The task name badge (e.g. "TASK-00001") should be visible
		const taskBadge = row
			.locator('[data-slot="badge"]')
			.filter({ hasText: /TASK-/ });
		await expect(taskBadge).toBeVisible();
	});

	test("create feature request with priority selection", async ({
		page,
	}) => {
		await gotoRequestsTab(page, project.name);

		await page.getByRole("button", { name: "New Request" }).click();

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Fill title
		const frTitle = `${FR_PREFIX} Priority ${Date.now()}`;
		await dialog.locator("#fr-title").fill(frTitle);

		// Change priority to "Critical"
		await dialog
			.locator('[data-slot="select-trigger"]')
			.filter({ hasText: "Nice to Have" })
			.click();
		await page.getByRole("option", { name: "Critical" }).click();

		// Submit
		await dialog.getByRole("button", { name: "Submit Request" }).click();

		await expect(page.getByText("Feature request created")).toBeVisible({
			timeout: 5000,
		});

		// Verify the row shows Critical priority badge
		const row = page.locator("tr").filter({ hasText: frTitle });
		await expect(
			row.locator('[data-slot="badge"]').filter({ hasText: "Critical" }),
		).toBeVisible({ timeout: 5000 });
	});

	test("default priority is Nice to Have when creating via UI", async ({
		page,
	}) => {
		await gotoRequestsTab(page, project.name);

		await page.getByRole("button", { name: "New Request" }).click();

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: 5000 });

		// Default priority should be "Nice to Have"
		await expect(
			dialog
				.locator('[data-slot="select-trigger"]')
				.filter({ hasText: "Nice to Have" }),
		).toBeVisible();
	});
});
