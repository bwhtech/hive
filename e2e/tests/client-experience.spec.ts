import { test, expect } from "@playwright/test";

test.describe("Client Experience", () => {
	test("should only see projects assigned to their client", async ({
		page,
	}) => {
		await page.goto("/frontend/projects");
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
		await page.goto("/frontend/projects");
		await page.waitForLoadState("networkidle");

		// Client users should not have access to Settings in the sidebar
		const sidebar = page.locator("[data-slot='sidebar']");
		await expect(sidebar).toBeVisible({ timeout: 5000 });
		await expect(sidebar.locator("text=Settings")).not.toBeVisible();
	});

	test("should not see Add Task button on project page", async ({
		page,
	}) => {
		await page.goto("/frontend/projects");
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
		await page.goto("/frontend/projects");
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
		await page.goto("/frontend/projects");
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

	test("should see task details as read-only (no Save button)", async ({
		page,
	}) => {
		await page.goto("/frontend/projects");
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
});
