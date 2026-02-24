import { test, expect } from "@playwright/test";
import { createDoc, deleteDoc, getList } from "../helpers/frappe";

const TEST_PREFIX = "E2E PT";

/**
 * Open Settings dialog and switch to the General tab.
 */
async function openGeneralSettings(page: import("@playwright/test").Page) {
	await page.goto("/hive");
	await page.waitForLoadState("networkidle");

	await page.getByRole("button", { name: "Settings" }).click();

	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible({ timeout: 5000 });

	await dialog.getByRole("tab", { name: "General" }).click();

	// Wait for the Project Types section to load
	await expect(dialog.getByText("Project Types")).toBeVisible({
		timeout: 5000,
	});

	return dialog;
}

/**
 * Cleanup test project types created during tests.
 */
async function cleanupTestProjectTypes(
	request: import("@playwright/test").APIRequestContext,
) {
	try {
		const types = await getList<{ name: string; type_name: string }>(
			request,
			"Hive Project Type",
			{
				fields: ["name", "type_name"],
				filters: { type_name: ["like", `${TEST_PREFIX}%`] },
				limit: 100,
			},
		);

		for (const pt of types) {
			try {
				await deleteDoc(request, "Hive Project Type", pt.name);
			} catch {
				// Ignore cleanup errors
			}
		}
	} catch {
		// Ignore cleanup errors
	}
}

test.describe("Project Types", () => {
	test.afterAll(async ({ request }) => {
		await cleanupTestProjectTypes(request);
	});

	test("should display default project types in General settings", async ({
		page,
	}) => {
		const dialog = await openGeneralSettings(page);

		// The install hook bootstraps these 4 default types
		await expect(dialog.getByText("Development")).toBeVisible({
			timeout: 5000,
		});
		await expect(dialog.getByText("Implementation")).toBeVisible();
		await expect(dialog.getByText("Retainer")).toBeVisible();
		await expect(dialog.getByText("Internal")).toBeVisible();
	});

	test("should add a new project type and see it in the list", async ({
		page,
		request,
	}) => {
		await cleanupTestProjectTypes(request);

		const typeName = `${TEST_PREFIX} ${Date.now()}`;
		const dialog = await openGeneralSettings(page);

		// Fill in the input and click Add
		await dialog
			.getByPlaceholder("e.g. Build, Hiring, Support...")
			.fill(typeName);
		await dialog.getByRole("button", { name: "Add" }).click();

		// Wait for success toast
		await expect(
			page.getByText(`Project type "${typeName}" added`),
		).toBeVisible({ timeout: 10000 });

		// Verify it appears in the list
		await expect(dialog.getByText(typeName)).toBeVisible({ timeout: 5000 });
	});

	test("should add a project type via Enter key", async ({
		page,
		request,
	}) => {
		await cleanupTestProjectTypes(request);

		const typeName = `${TEST_PREFIX} Enter ${Date.now()}`;
		const dialog = await openGeneralSettings(page);

		const input = dialog.getByPlaceholder(
			"e.g. Build, Hiring, Support...",
		);
		await input.fill(typeName);
		await input.press("Enter");

		// Wait for success toast
		await expect(
			page.getByText(`Project type "${typeName}" added`),
		).toBeVisible({ timeout: 10000 });

		// Verify it appears in the list
		await expect(dialog.getByText(typeName)).toBeVisible({ timeout: 5000 });
	});

	test("should delete a project type", async ({ page, request }) => {
		await cleanupTestProjectTypes(request);

		// Create a project type via API first
		const typeName = `${TEST_PREFIX} Del ${Date.now()}`;
		await createDoc(request, "Hive Project Type", {
			type_name: typeName,
		});

		const dialog = await openGeneralSettings(page);

		// Verify it's visible
		await expect(dialog.getByText(typeName)).toBeVisible({ timeout: 5000 });

		// Click the delete button next to this project type
		// Each row has the type name and a ghost delete button
		const row = dialog.locator("div").filter({ hasText: typeName }).locator("button").last();
		await row.click();

		// Wait for success toast
		await expect(
			page.getByText(`Project type "${typeName}" removed`),
		).toBeVisible({ timeout: 10000 });

		// Verify it's no longer in the list
		await expect(dialog.getByText(typeName)).not.toBeVisible({
			timeout: 5000,
		});
	});

	test("should not add empty project type", async ({ page }) => {
		const dialog = await openGeneralSettings(page);

		const addButton = dialog.getByRole("button", { name: "Add" });

		// Add button should be disabled when input is empty
		await expect(addButton).toBeDisabled();

		// Type spaces only — should still be disabled
		await dialog
			.getByPlaceholder("e.g. Build, Hiring, Support...")
			.fill("   ");
		await expect(addButton).toBeDisabled();
	});
});
