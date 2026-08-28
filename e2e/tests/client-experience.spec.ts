import { test, expect } from "../helpers/app";
import { cleanupTestFeatureRequests, listFeatureRequests } from "../helpers/hive";

const FR_TEST_PREFIX = "E2E Client FR";

test.describe("Client Experience", () => {
	test("should only see projects assigned to their client", async ({
		page,
	}) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Client user (clientuser@example.com) belongs to "Acme Corp"
		// They should see "Website Redesign" (client=Acme Corp)
		// They should NOT see "Mobile App MVP" or "Infrastructure Migration" (no client)
		await expect(
			page.locator("text=Website Redesign").first(),
		).toBeVisible({ timeout: 10000 });

		await expect(page.locator("text=Mobile App MVP")).not.toBeVisible();
		await expect(
			page.locator("text=Infrastructure Migration"),
		).not.toBeVisible();
	});

	test("should not see Settings in sidebar", async ({ page }) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Client users should not have access to Settings in the sidebar
		const sidebar = page.locator("[data-slot='sidebar']");
		await expect(sidebar).toBeVisible({ timeout: 5000 });
		await expect(sidebar.locator("text=Settings")).not.toBeVisible();
	});

	test("should not see Add Task button on project page", async ({
		page,
	}) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Navigate to the client's project
		await page.locator("text=Website Redesign").first().click();
		await page.waitForLoadState("networkidle");

		// Client should NOT see the "+ Add Task" button
		await expect(
			page.locator('button:has-text("Add Task")'),
		).not.toBeVisible({ timeout: 5000 });
	});

	test("should see the Requests tab", async ({ page }) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Navigate to the client's project
		await page.locator("text=Website Redesign").first().click();
		await page.waitForLoadState("networkidle");

		// The tab is called "Requests"
		const requestsTab = page.locator(
			'[role="tab"]:has-text("Requests")',
		);
		await expect(requestsTab.first()).toBeVisible({ timeout: 10000 });
	});

	test("should see tasks in the kanban board", async ({ page }) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Navigate to the client's project
		await page.locator("text=Website Redesign").first().click();
		await page.waitForLoadState("networkidle");

		// Click the Tasks tab
		const tasksTab = page.locator('[role="tab"]:has-text("Tasks")');
		await expect(tasksTab.first()).toBeVisible({ timeout: 10000 });
		await tasksTab.first().click();
		await page.waitForLoadState("networkidle");

		// Should see the kanban board with task columns
		await expect(
			page.locator("text=In Progress").first(),
		).toBeVisible({ timeout: 5000 });
	});

	test("should not see project metadata dropdowns or manage links", async ({
		page,
	}) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Navigate to the client's project
		await page.locator("text=Website Redesign").first().click();
		await page.waitForLoadState("networkidle");

		// Client should NOT see "Set type" or "Set client" dropdowns
		await expect(
			page.locator('text=Set type'),
		).not.toBeVisible({ timeout: 5000 });
		await expect(
			page.locator('text=Set client'),
		).not.toBeVisible({ timeout: 3000 });

		// Client should NOT see "Manage" links button
		await expect(
			page.locator('button:has-text("Manage")'),
		).not.toBeVisible({ timeout: 3000 });

		// Client should NOT see "Add link" button
		await expect(
			page.locator('button:has-text("Add link")'),
		).not.toBeVisible({ timeout: 3000 });
	});

	test("should see team members as read-only (no add/remove/role change)", async ({
		page,
	}) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Navigate to the client's project
		await page.locator("text=Website Redesign").first().click();
		await page.waitForLoadState("networkidle");

		// Overview tab is the default, team section should be visible
		const teamCard = page.locator('text=Team').first();
		await expect(teamCard).toBeVisible({ timeout: 10000 });

		// Client should NOT see the add team member button (UserAdd icon button)
		const teamSection = page.locator('[data-slot="card"]').filter({ hasText: 'Team' });
		await expect(
			teamSection.locator('[data-slot="popover-trigger"]'),
		).not.toBeVisible({ timeout: 3000 });

		// Role dropdowns should NOT be visible (replaced with badges)
		await expect(
			teamSection.locator('[data-slot="select-trigger"]'),
		).not.toBeVisible({ timeout: 3000 });
	});

	test("should see task details as read-only (no Save button)", async ({
		page,
	}) => {
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");

		// Navigate to the client's project
		await page.locator("text=Website Redesign").first().click();
		await page.waitForLoadState("networkidle");

		// Click the Tasks tab
		const tasksTab = page.locator('[role="tab"]:has-text("Tasks")');
		await expect(tasksTab.first()).toBeVisible({ timeout: 10000 });
		await tasksTab.first().click();
		await page.waitForLoadState("networkidle");

		// Click on a task card to open the detail sheet
		const taskCard = page.locator("[data-slot='card']").first();
		await expect(taskCard).toBeVisible({ timeout: 10000 });
		await taskCard.click();

		// The task detail sheet should open
		await expect(
			page.locator("text=Task Details").first(),
		).toBeVisible({ timeout: 5000 });

		// Client should NOT see the "Save Changes" button
		await expect(
			page.locator('button:has-text("Save Changes")'),
		).not.toBeVisible({ timeout: 3000 });

		// Client should NOT see the "Add" assignee button
		await expect(
			page.locator('button:has-text("Add")'),
		).not.toBeVisible({ timeout: 3000 });

		// UAT Approve/Reject buttons should still be visible
		await expect(
			page.locator('button:has-text("Approve")').first(),
		).toBeVisible();
	});

	test("should be able to create a feature request", async ({
		page,
		request,
	}) => {
		const frTitle = `${FR_TEST_PREFIX} ${Date.now()}`;

		// Cleanup any leftover test feature requests (uses admin auth)
		await cleanupTestFeatureRequests(request, FR_TEST_PREFIX);

		// Navigate to the client's project
		await page.goto("/hive/projects");
		await page.waitForLoadState("networkidle");
		await page.locator("text=Website Redesign").first().click();
		await page.waitForLoadState("networkidle");

		// Click the Requests tab
		const requestsTab = page.locator('[role="tab"]:has-text("Requests")');
		await expect(requestsTab.first()).toBeVisible({ timeout: 10000 });
		await requestsTab.first().click();
		await page.waitForLoadState("networkidle");

		// Click "New Request" button
		await page.locator('button:has-text("New Request")').click();

		// Fill in the feature request form
		await expect(page.locator("text=New Feature Request")).toBeVisible({ timeout: 5000 });
		await page.locator("#fr-title").fill(frTitle);

		// Select "Important" priority
		await page.locator('[data-slot="select-trigger"]').click();
		await page.locator('[data-slot="select-item"]:has-text("Important")').click();

		// Submit the request
		await page.locator('button:has-text("Submit Request")').click();

		// Verify the request appears in the table
		await expect(
			page.locator(`text=${frTitle}`).first(),
		).toBeVisible({ timeout: 10000 });

		// Verify the status badge shows "Open"
		const requestRow = page.locator("tr").filter({ hasText: frTitle });
		await expect(requestRow.locator("text=Open")).toBeVisible();
		await expect(requestRow.locator("text=Important")).toBeVisible();

		// Verify the request was created in the backend
		const requests = await listFeatureRequests(request, {
			filters: { title: frTitle },
		});
		expect(requests.length).toBe(1);
		expect(requests[0].status).toBe("Open");
		expect(requests[0].priority).toBe("Important");

		// Cleanup
		await cleanupTestFeatureRequests(request, FR_TEST_PREFIX);
	});
});
