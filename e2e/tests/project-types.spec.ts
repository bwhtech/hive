import { test, expect, Page } from "../helpers/app";
import { createDoc, deleteDoc, getList } from "../helpers/frappe";
import { openSettings } from "../helpers/ui";

const TEST_PREFIX = "E2E PT";

/**
 * Open Settings dialog and switch to the General tab.
 */
async function openGeneralSettings(page: Page) {
	const dialog = await openSettings(page, "General");
	await expect(dialog.getByText("Project types")).toBeVisible({
		timeout: 10000,
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
			timeout: 10000,
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
		await dialog.getByLabel("New project type").fill(typeName);
		await dialog.getByRole("button", { name: "Add" }).click();

		// Wait for success toast
		await expect(
			page.getByText(`Added "${typeName}"`),
		).toBeVisible({ timeout: 10000 });

		// Verify it appears in the list
		await expect(dialog.getByText(typeName)).toBeVisible({ timeout: 10000 });
	});

	test("should add a project type via Enter key", async ({
		page,
		request,
	}) => {
		await cleanupTestProjectTypes(request);

		const typeName = `${TEST_PREFIX} Enter ${Date.now()}`;
		const dialog = await openGeneralSettings(page);

		const input = dialog.getByLabel("New project type");
		await input.fill(typeName);
		await input.press("Enter");

		// Wait for success toast
		await expect(
			page.getByText(`Added "${typeName}"`),
		).toBeVisible({ timeout: 10000 });

		// Verify it appears in the list
		await expect(dialog.getByText(typeName)).toBeVisible({ timeout: 10000 });
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
		await expect(dialog.getByText(typeName)).toBeVisible({ timeout: 10000 });

		await dialog.getByRole("button", { name: `Remove ${typeName}` }).click();

		// Removal is a soft archive, and the toast carries the Undo.
		await expect(page.getByText(`${typeName} archived`)).toBeVisible({
			timeout: 10000,
		});

		await expect(dialog.getByText(typeName)).toHaveCount(0, {
			timeout: 10000,
		});
	});

	test("should not add empty project type", async ({ page }) => {
		const dialog = await openGeneralSettings(page);

		const addButton = dialog.getByRole("button", { name: "Add" });

		// Add button should be disabled when input is empty
		await expect(addButton).toBeDisabled();

		// Type spaces only — should still be disabled
		await dialog.getByLabel("New project type").fill("   ");
		await expect(addButton).toBeDisabled();
	});
});
