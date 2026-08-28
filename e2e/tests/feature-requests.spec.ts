import { test, expect, Page } from "../helpers/app";
import {
	createTestProject,
	createTestFeatureRequest,
	cleanupTestProjects,
	cleanupTestFeatureRequests,
	HiveProject,
	HiveFeatureRequest,
} from "../helpers/hive";
import { getDoc, updateDoc } from "../helpers/frappe";
import {
	chooseOption,
	expectDialog,
	gotoHive,
	requestRow,
	selectTrigger,
} from "../helpers/ui";

const PROJECT_PREFIX = "E2E FR";
const FR_PREFIX = "E2E FR Req";

/** Navigate to the Requests tab of a project. */
async function gotoRequestsTab(page: Page, projectName: string) {
	await gotoHive(page, `/projects/${projectName}?tab=requests`);
}

/** Open the `…` menu on one request row. */
async function openRowActions(page: Page, fr: HiveFeatureRequest) {
	const row = requestRow(page, fr.name);
	await expect(row).toBeVisible({ timeout: 10000 });
	await page.getByRole("button", { name: `Actions for ${fr.title}` }).click();
	await expect(page.getByRole("menu")).toBeVisible({ timeout: 3000 });
}

/** Open the create dialog. The header and the empty state both offer it. */
async function openCreateDialog(page: Page) {
	await page.getByRole("button", { name: "New request" }).first().click();
	return expectDialog(page, "New feature request");
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
			page.getByText("Submit a request to suggest an improvement."),
		).toBeVisible();
	});

	test("create feature request via UI", async ({ page }) => {
		await gotoRequestsTab(page, project.name);

		const dialog = await openCreateDialog(page);

		const frTitle = `${FR_PREFIX} UI ${Date.now()}`;
		await dialog.getByLabel("Title").fill(frTitle);

		await dialog.getByRole("button", { name: "Submit request" }).click();

		await expect(page.getByText("Feature request created")).toBeVisible({
			timeout: 10000,
		});

		await expect(page.getByText(frTitle)).toBeVisible({ timeout: 10000 });
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

		const row = requestRow(page, fr.name);
		await expect(row).toBeVisible({ timeout: 10000 });
		await expect(row).toContainText(fr.title);
		await expect(row.getByText("Open", { exact: true })).toBeVisible();
		await expect(row.getByText("Important", { exact: true })).toBeVisible();
	});

	test("request count header updates correctly", async ({ page, request }) => {
		await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Count A ${Date.now()}`,
			project: project.name,
		});
		await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Count B ${Date.now()}`,
			project: project.name,
		});

		await gotoRequestsTab(page, project.name);

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
		await openRowActions(page, fr);

		await page.getByRole("menuitem", { name: "Set under review" }).click();

		await expect(page.getByText("Request set to under review")).toBeVisible({
			timeout: 10000,
		});

		const updated = await getDoc<HiveFeatureRequest>(
			request,
			"Hive Feature Request",
			fr.name,
		);
		expect(updated.status).toBe("Under Review");
	});

	test("approve feature request via row actions", async ({ page, request }) => {
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Approve ${Date.now()}`,
			project: project.name,
		});

		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr);

		await page.getByRole("menuitem", { name: "Approve" }).click();

		await expect(page.getByText("Request approved")).toBeVisible({
			timeout: 10000,
		});

		const updated = await getDoc<HiveFeatureRequest>(
			request,
			"Hive Feature Request",
			fr.name,
		);
		expect(updated.status).toBe("Approved");
	});

	test("reject feature request via row actions", async ({ page, request }) => {
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Reject ${Date.now()}`,
			project: project.name,
		});

		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr);

		await page.getByRole("menuitem", { name: "Reject" }).click();

		await expect(page.getByText("Request rejected")).toBeVisible({
			timeout: 10000,
		});

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
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Convert ${Date.now()}`,
			project: project.name,
		});

		await updateDoc(request, "Hive Feature Request", fr.name, {
			status: "Approved",
		});

		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr);

		await page.getByRole("menuitem", { name: "Convert to task" }).click();

		await expect(
			page.getByText("Feature request converted to task"),
		).toBeVisible({ timeout: 10000 });

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
		const fr = await createTestFeatureRequest(request, {
			title: `${FR_PREFIX} Badge ${Date.now()}`,
			project: project.name,
		});

		await updateDoc(request, "Hive Feature Request", fr.name, {
			status: "Approved",
		});

		// Convert through the UI so `converted_task` is set the way the app sets it.
		await gotoRequestsTab(page, project.name);
		await openRowActions(page, fr);
		await page.getByRole("menuitem", { name: "Convert to task" }).click();
		await expect(
			page.getByText("Feature request converted to task"),
		).toBeVisible({ timeout: 10000 });

		await gotoRequestsTab(page, project.name);

		const row = requestRow(page, fr.name);
		await expect(row.getByText("Converted", { exact: true })).toBeVisible({
			timeout: 10000,
		});
		await expect(row.getByText(/^TASK-/)).toBeVisible();
	});

	test("create feature request with priority selection", async ({ page }) => {
		await gotoRequestsTab(page, project.name);

		const dialog = await openCreateDialog(page);

		const frTitle = `${FR_PREFIX} Priority ${Date.now()}`;
		await dialog.getByLabel("Title").fill(frTitle);

		await chooseOption(page, "Priority", "Critical", dialog);

		await dialog.getByRole("button", { name: "Submit request" }).click();

		await expect(page.getByText("Feature request created")).toBeVisible({
			timeout: 10000,
		});

		const row = requestRow(page).filter({ hasText: frTitle });
		await expect(row.getByText("Critical", { exact: true })).toBeVisible({
			timeout: 10000,
		});
	});

	test("default priority is Nice to Have when creating via UI", async ({
		page,
	}) => {
		await gotoRequestsTab(page, project.name);

		const dialog = await openCreateDialog(page);

		await expect(selectTrigger(dialog, "Priority")).toHaveText(
			/Nice to Have/,
		);
	});
});
