import { test, expect } from "../helpers/app";
import { updateDoc } from "../helpers/frappe";
import { gotoHive } from "../helpers/ui";

test.describe("Onboarding", () => {
	test.beforeAll(async ({ request }) => {
		// Reset onboarding so dialog appears
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			onboarding_completed: 0,
		});
	});

	test.afterAll(async ({ request }) => {
		// Restore onboarding_completed so other tests aren't blocked
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			onboarding_completed: 1,
		});
	});

	test("should show onboarding dialog on fresh state", async ({ page }) => {
		await gotoHive(page, "/");

		// The onboarding dialog should appear
		const dialog = page.getByRole("dialog", { name: "Welcome to Hive" });
		await expect(dialog).toBeVisible({ timeout: 10000 });
		await expect(dialog).toContainText("Invite your team");
	});

	test("should walk through all onboarding steps and complete", async ({
		page,
		request,
	}) => {
		// Ensure onboarding is reset for this test
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			onboarding_completed: 0,
		});

		await gotoHive(page, "/");

		const dialog = page.getByRole("dialog", { name: "Welcome to Hive" });
		await expect(dialog).toBeVisible({ timeout: 10000 });

		// --- Step 1: Invite team members ---
		await expect(dialog.getByText("Invite your team")).toBeVisible();
		await expect(
			dialog.getByPlaceholder("email@example.com"),
		).toBeVisible();

		// Click Next to proceed
		await dialog.getByRole("button", { name: "Next" }).click();

		// --- Step 2: Add clients ---
		await expect(dialog.getByText("Add your clients")).toBeVisible();
		await expect(
			dialog.getByPlaceholder("Company name…"),
		).toBeVisible();

		// Click Next to proceed
		await dialog.getByRole("button", { name: "Next" }).click();

		// --- Step 3: Setup project types ---
		await expect(dialog.getByText("Set up project types")).toBeVisible();
		await expect(
			dialog.getByPlaceholder("e.g. Build, Hiring, Support…"),
		).toBeVisible();

		// Click Next to reach the final step
		await dialog.getByRole("button", { name: "Next" }).click();

		// --- Final step: Let's Go! ---
		await expect(dialog.getByText("You are all set")).toBeVisible();
		await expect(
			dialog.getByText("Your workspace is ready"),
		).toBeVisible();

		// Click "Let's Go!" to complete onboarding
		await dialog.getByRole("button", { name: "Let's go" }).click();

		// Dialog should close
		await expect(dialog).not.toBeVisible({ timeout: 5000 });

		// Verify we're on the Hive page
		await expect(page).toHaveURL(/\/hive/);
	});

	test("should allow skipping steps", async ({ page, request }) => {
		// Reset onboarding again
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			onboarding_completed: 0,
		});

		await gotoHive(page, "/");

		const dialog = page.getByRole("dialog", { name: "Welcome to Hive" });
		await expect(dialog).toBeVisible({ timeout: 10000 });

		// Step 1: Skip
		await expect(dialog.getByText("Invite your team")).toBeVisible();
		await dialog.getByRole("button", { name: "Skip" }).click();

		// Step 2: Skip
		await expect(dialog.getByText("Add your clients")).toBeVisible();
		await dialog.getByRole("button", { name: "Skip" }).click();

		// Step 3: Skip
		await expect(dialog.getByText("Set up project types")).toBeVisible();
		await dialog.getByRole("button", { name: "Skip" }).click();

		// Should reach the final "Let's Go!" step
		await expect(dialog.getByText("You are all set")).toBeVisible();
	});

	test("should allow navigating back to previous steps", async ({
		page,
		request,
	}) => {
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			onboarding_completed: 0,
		});

		await gotoHive(page, "/");

		const dialog = page.getByRole("dialog", { name: "Welcome to Hive" });
		await expect(dialog).toBeVisible({ timeout: 10000 });

		// Step 1 — Back button should be disabled
		await expect(dialog.getByText("Invite your team")).toBeVisible();
		await expect(
			dialog.getByRole("button", { name: "Back" }),
		).toBeDisabled();

		// Go to Step 2
		await dialog.getByRole("button", { name: "Next" }).click();
		await expect(dialog.getByText("Add your clients")).toBeVisible();

		// Go back to Step 1
		await dialog.getByRole("button", { name: "Back" }).click();
		await expect(dialog.getByText("Invite your team")).toBeVisible();
	});

	test("should not show onboarding when already completed", async ({
		page,
		request,
	}) => {
		// Set onboarding as completed
		await updateDoc(request, "Hive Settings", "Hive Settings", {
			onboarding_completed: 1,
		});

		await gotoHive(page, "/");

		// The onboarding dialog specifically should stay away.
		await page.waitForTimeout(2000);
		await expect(
			page.getByRole("dialog", { name: "Welcome to Hive" }),
		).toHaveCount(0);

		// Page should still load normally
		await expect(page).toHaveURL(/\/hive/);
	});
});
