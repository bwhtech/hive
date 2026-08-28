import { test, expect } from "../helpers/app";
import {
	cleanupTestFeatureRequests,
	listFeatureRequests,
} from "../helpers/hive";
import {
	chooseOption,
	expectDialog,
	projectCard,
	taskCard,
	taskPanel,
} from "../helpers/ui";

const FR_TEST_PREFIX = "E2E Client FR";

/** The one project the seeded client belongs to. */
const CLIENT_PROJECT = "Website Redesign";

/** Projects seeded without a client, which this user must never see. */
const OTHER_PROJECTS = ["Mobile App MVP", "Infrastructure Migration"];

/** Open the client's own project from the grid. */
async function openClientProject(page: import("@playwright/test").Page) {
	await page.goto("/hive/projects");
	await page.waitForLoadState("networkidle");
	await projectCard(page).filter({ hasText: CLIENT_PROJECT }).first().click();
	await page.waitForLoadState("networkidle");
}

test.describe("Client Experience", () => {
	test("should only see projects assigned to their client", async ({
		page,
	}) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Assert the grid rendered before asserting anything is missing from it:
		// a bare `not.toBeVisible` also passes on a page that failed to load.
		await expect(
			projectCard(page).filter({ hasText: CLIENT_PROJECT }),
		).toBeVisible({ timeout: 10000 });

		for (const title of OTHER_PROJECTS) {
			await expect(projectCard(page).filter({ hasText: title })).toHaveCount(0);
		}
	});

	test("should not see Settings in sidebar", async ({ page }) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Client users should not have access to Settings in the sidebar
		const sidebar = page.locator('[data-slot="sidebar"]');
		await expect(sidebar).toBeVisible({ timeout: 5000 });
		await expect(sidebar.getByText("Settings")).not.toBeVisible();
	});

	test("should not see Add Task button on project page", async ({ page }) => {
		await openClientProject(page);

		// Client should NOT see the "+ Add Task" button
		await expect(
			page.getByRole("button", { name: "Add Task" }),
		).not.toBeVisible({
			timeout: 5000,
		});
	});

	test("should see the Requests tab", async ({ page }) => {
		await openClientProject(page);

		// The tab is called "Requests"
		const requestsTab = page.getByRole("tab", { name: /Requests/ });
		await expect(requestsTab.first()).toBeVisible({ timeout: 10000 });
	});

	test("should see tasks in the kanban board", async ({ page }) => {
		await openClientProject(page);

		// Click the Tasks tab
		const tasksTab = page.getByRole("tab", { name: /Tasks/ });
		await expect(tasksTab.first()).toBeVisible({ timeout: 10000 });
		await tasksTab.first().click();
		await page.waitForLoadState("networkidle");

		// Should see the kanban board with task columns
		await expect(page.locator("text=In Progress").first()).toBeVisible({
			timeout: 5000,
		});
	});

	test("should not see project metadata dropdowns or manage links", async ({
		page,
	}) => {
		await openClientProject(page);

		// Client should NOT see "Set type" or "Set client" dropdowns
		await expect(page.locator("text=Set type")).not.toBeVisible({
			timeout: 5000,
		});
		await expect(page.locator("text=Set client")).not.toBeVisible({
			timeout: 3000,
		});

		// Client should NOT see "Manage" links button
		await expect(
			page.getByRole("button", { name: "Manage links" }),
		).not.toBeVisible({
			timeout: 3000,
		});

		// Client should NOT see "Add link" button
		await expect(
			page.getByRole("button", { name: "Add link" }),
		).not.toBeVisible({
			timeout: 3000,
		});
	});

	test("a client sees the team but cannot change it", async ({ page }) => {
		await openClientProject(page);

		// Ask for Overview rather than trusting it to be the default: the tab is
		// URL state, and a test that assumes it passes or fails on run order.
		await page.getByRole("tab", { name: /Overview/ }).click();

		// Prove the section rendered before asserting its controls are absent.
		const team = page.getByRole("heading", { name: "Team" });
		await expect(team).toBeVisible({ timeout: 10000 });

		// Both controls are labelled, and both are `v-if="!isClient"`.
		await expect(
			page.getByRole("combobox", { name: "Project members" }),
		).toHaveCount(0);
		await expect(
			page.getByRole("combobox", { name: "Project role" }),
		).toHaveCount(0);
	});

	test("a client can read a task but not edit it", async ({ page }) => {
		await openClientProject(page);
		await page.getByRole("tab", { name: /Tasks/ }).click();

		const card = taskCard(page).first();
		await expect(card).toBeVisible({ timeout: 10000 });
		await card.click();

		const panel = taskPanel(page);
		await expect(panel).toBeVisible({ timeout: 10000 });

		// Read-only means the fields are there but disabled, not that the panel
		// is missing — asserting only on absence would pass on a blank panel.
		await expect(panel.getByLabel("Title")).toBeVisible();
		await expect(panel.getByLabel("Title")).toBeDisabled();
		await expect(panel.getByLabel("Assignees")).toBeDisabled();

		// UAT is the one thing a client is meant to act on.
		await expect(
			panel.getByRole("button", { name: /Approve/ }).first(),
		).toBeVisible();
	});

	test("a client can raise a feature request", async ({ page, request }) => {
		const frTitle = `${FR_TEST_PREFIX} ${Date.now()}`;
		await cleanupTestFeatureRequests(request, FR_TEST_PREFIX);

		await openClientProject(page);
		await page.getByRole("tab", { name: /Requests/ }).click();
		await page.getByRole("button", { name: "New request" }).click();

		const dialog = await expectDialog(page, /Feature Request/i);
		await dialog.getByLabel("Title").fill(frTitle);
		await chooseOption(page, "Priority", "Important", dialog);
		await dialog.getByRole("button", { name: "Submit request" }).click();

		// The server is the proof it was raised, not a toast.
		await expect
			.poll(
				async () => {
					const rows = await listFeatureRequests(request, FR_TEST_PREFIX);
					return rows.some((r) => r.title === frTitle);
				},
				{ timeout: 15000 },
			)
			.toBe(true);

		await cleanupTestFeatureRequests(request, FR_TEST_PREFIX);
	});
});
