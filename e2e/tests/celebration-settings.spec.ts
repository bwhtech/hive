import { test, expect, Page, Locator } from "../helpers/app";
import {
	createTestProject,
	createTestTask,
	cleanupTestProjects,
	HiveProject,
} from "../helpers/hive";

const PROJECT_PREFIX = "E2E Celebration";

/** Locate the switch button next to a given label text. */
function celebrationSwitch(page: Page, labelText: string): Locator {
	return page
		.locator(".flex.items-center")
		.filter({ hasText: labelText })
		.locator('[data-slot="switch"]');
}

/** Open the Settings dialog by clicking the sidebar Settings button. */
async function openSettings(page: Page) {
	const settingsBtn = page
		.locator('[data-slot="sidebar-menu-button"]')
		.filter({ hasText: "Settings" });
	await settingsBtn.click();
	await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
}

/** Switch to the General tab inside the Settings dialog. */
async function switchToGeneralTab(page: Page) {
	await page.getByRole("tab", { name: "General" }).click();
	await expect(page.getByText("Task Completion")).toBeVisible({
		timeout: 5000,
	});
}

/** Clear celebration localStorage keys so tests start from a known state. */
async function resetCelebrationSettings(page: Page) {
	await page.evaluate(() => {
		localStorage.removeItem("hive:celebration-animation");
		localStorage.removeItem("hive:celebration-sound");
	});
}

/** Open settings and navigate to the General tab. */
async function gotoGeneralSettings(page: Page) {
	await openSettings(page);
	await switchToGeneralTab(page);
}

test.describe("Celebration Settings", () => {
	let project: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);
		project = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("settings dialog shows celebration toggle switches", async ({
		page,
	}) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		await gotoGeneralSettings(page);

		// Both switches should be present
		const animSwitch = celebrationSwitch(page, "Play animation on task done");
		const soundSwitch = celebrationSwitch(page, "Play sound on task done");
		await expect(animSwitch).toBeVisible();
		await expect(soundSwitch).toBeVisible();

		// Labels should be visible
		await expect(
			page.getByText("Play animation on task done"),
		).toBeVisible();
		await expect(page.getByText("Play sound on task done")).toBeVisible();
	});

	test("both toggles default to ON when no localStorage values set", async ({
		page,
	}) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");

		// Clear any existing localStorage values before opening settings
		await resetCelebrationSettings(page);

		await gotoGeneralSettings(page);

		// Both switches should be checked (data-checked attribute present)
		const animSwitch = celebrationSwitch(page, "Play animation on task done");
		const soundSwitch = celebrationSwitch(page, "Play sound on task done");
		await expect(animSwitch).toHaveAttribute("data-checked", "");
		await expect(soundSwitch).toHaveAttribute("data-checked", "");
	});

	test("toggle animation OFF updates switch state", async ({ page }) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");
		await resetCelebrationSettings(page);

		await gotoGeneralSettings(page);

		const animSwitch = celebrationSwitch(page, "Play animation on task done");

		// Verify initially checked
		await expect(animSwitch).toHaveAttribute("data-checked", "");

		// Click to toggle OFF
		await animSwitch.click();

		// Should now be unchecked
		await expect(animSwitch).toHaveAttribute("data-unchecked", "");

		// Verify localStorage was updated
		const value = await page.evaluate(() =>
			localStorage.getItem("hive:celebration-animation"),
		);
		expect(value).toBe("false");
	});

	test("toggle sound OFF updates switch state", async ({ page }) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");
		await resetCelebrationSettings(page);

		await gotoGeneralSettings(page);

		const soundSwitch = celebrationSwitch(page, "Play sound on task done");

		// Verify initially checked
		await expect(soundSwitch).toHaveAttribute("data-checked", "");

		// Click to toggle OFF
		await soundSwitch.click();

		// Should now be unchecked
		await expect(soundSwitch).toHaveAttribute("data-unchecked", "");

		// Verify localStorage was updated
		const value = await page.evaluate(() =>
			localStorage.getItem("hive:celebration-sound"),
		);
		expect(value).toBe("false");
	});

	test("settings persist after closing and reopening dialog", async ({
		page,
	}) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");
		await resetCelebrationSettings(page);

		// Open settings and toggle animation OFF
		await gotoGeneralSettings(page);
		const animSwitch = celebrationSwitch(page, "Play animation on task done");
		await animSwitch.click();
		await expect(animSwitch).toHaveAttribute("data-unchecked", "");

		// Close dialog by pressing Escape
		await page.keyboard.press("Escape");
		await expect(page.getByRole("dialog")).not.toBeVisible({
			timeout: 3000,
		});

		// Reopen settings and verify the toggle is still OFF
		await gotoGeneralSettings(page);
		const animSwitch2 = celebrationSwitch(
			page,
			"Play animation on task done",
		);
		await expect(animSwitch2).toHaveAttribute("data-unchecked", "");

		// Sound should still be ON (we only toggled animation)
		const soundSwitch = celebrationSwitch(page, "Play sound on task done");
		await expect(soundSwitch).toHaveAttribute("data-checked", "");
	});

	test("celebration overlay appears when task marked as Done", async ({
		page,
		request,
	}) => {
		const task = await createTestTask(request, {
			title: `${PROJECT_PREFIX} Task Done ${Date.now()}`,
			project: project.name,
			status: "To Do",
		});

		await page.goto(`/hive/projects/${project.name}?tab=tasks`);
		await page.waitForLoadState("networkidle");

		// Ensure celebration animation is enabled
		await resetCelebrationSettings(page);

		// Click the task to open the detail sheet
		await expect(page.getByText(task.title).first()).toBeVisible({
			timeout: 10000,
		});
		await page.getByText(task.title).first().click();
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet).toBeVisible({ timeout: 5000 });

		// Change status to "Done"
		await sheet
			.locator('[data-slot="select-trigger"]')
			.filter({ hasText: "To Do" })
			.click();
		await page.getByRole("option", { name: "Done" }).click();

		// The celebration overlay (fixed z-[9999] portal) should become visible
		const overlay = page.locator(".pointer-events-none.fixed.inset-0");
		await expect(overlay).toHaveCSS("visibility", "visible", {
			timeout: 3000,
		});
	});

	test("celebration does NOT show when animation is disabled", async ({
		page,
		request,
	}) => {
		const task = await createTestTask(request, {
			title: `${PROJECT_PREFIX} No Anim ${Date.now()}`,
			project: project.name,
			status: "To Do",
		});

		await page.goto(`/hive/projects/${project.name}?tab=tasks`);
		await page.waitForLoadState("networkidle");

		// Disable both animation and sound via localStorage
		await page.evaluate(() => {
			localStorage.setItem("hive:celebration-animation", "false");
			localStorage.setItem("hive:celebration-sound", "false");
		});

		// Click the task to open the detail sheet
		await expect(page.getByText(task.title).first()).toBeVisible({
			timeout: 10000,
		});
		await page.getByText(task.title).first().click();
		const sheet = page.locator('[role="dialog"]');
		await expect(sheet).toBeVisible({ timeout: 5000 });

		// Change status to "Done"
		await sheet
			.locator('[data-slot="select-trigger"]')
			.filter({ hasText: "To Do" })
			.click();
		await page.getByRole("option", { name: "Done" }).click();

		// Wait a moment — overlay should NOT become visible
		await page.waitForTimeout(1500);
		const overlay = page.locator(".pointer-events-none.fixed.inset-0");
		await expect(overlay).toHaveCSS("visibility", "hidden");
	});

	test("toggle both settings OFF independently", async ({ page }) => {
		await page.goto("/hive/tasks");
		await page.waitForLoadState("networkidle");
		await resetCelebrationSettings(page);

		await gotoGeneralSettings(page);

		const animSwitch = celebrationSwitch(page, "Play animation on task done");
		const soundSwitch = celebrationSwitch(page, "Play sound on task done");

		// Toggle animation OFF
		await animSwitch.click();
		await expect(animSwitch).toHaveAttribute("data-unchecked", "");

		// Sound should still be ON
		await expect(soundSwitch).toHaveAttribute("data-checked", "");

		// Toggle sound OFF
		await soundSwitch.click();
		await expect(soundSwitch).toHaveAttribute("data-unchecked", "");

		// Both should be OFF now
		const animValue = await page.evaluate(() =>
			localStorage.getItem("hive:celebration-animation"),
		);
		const soundValue = await page.evaluate(() =>
			localStorage.getItem("hive:celebration-sound"),
		);
		expect(animValue).toBe("false");
		expect(soundValue).toBe("false");
	});
});
