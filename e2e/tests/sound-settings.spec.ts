import { expect, test } from "../helpers/app";
import { openSettings } from "../helpers/ui";

/**
 * Replaces `celebration-settings.spec.ts`. The Lottie animation and the
 * celebration sound, with their `hive:celebration-*` keys and their "Task
 * Completion" settings block, were cut in the frappe-ui rewrite. What survived
 * is a single opt-in sound setting on the Appearance panel, so that is what
 * this covers.
 */

const ENABLED_KEY = "hive-sound-enabled";
const VOLUME_KEY = "hive-sound-volume";

test.describe("Sound settings", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/hive/");
		await page.evaluate(
			([enabled, volume]) => {
				localStorage.removeItem(enabled);
				localStorage.removeItem(volume);
			},
			[ENABLED_KEY, VOLUME_KEY],
		);
	});

	test("interaction sounds are off until asked for", async ({ page }) => {
		const settings = await openSettings(page, "Appearance");
		const toggle = settings.getByRole("switch", { name: "Interaction sounds" });

		await expect(toggle).toBeVisible();
		await expect(toggle).not.toBeChecked();

		// The volume row only exists once there is sound to set a level for.
		await expect(settings.getByRole("slider")).toBeHidden();
	});

	test("turning sound on reveals volume and persists", async ({ page }) => {
		const settings = await openSettings(page, "Appearance");
		const toggle = settings.getByRole("switch", { name: "Interaction sounds" });

		await toggle.click();
		await expect(toggle).toBeChecked();
		await expect(settings.getByRole("slider")).toBeVisible();

		await expect
			.poll(() =>
				page.evaluate((key) => localStorage.getItem(key), ENABLED_KEY),
			)
			.toBe("true");

		// The setting has to survive a reload, not just a re-render.
		await page.reload();
		await page.waitForLoadState("networkidle");
		const reopened = await openSettings(page, "Appearance");
		await expect(
			reopened.getByRole("switch", { name: "Interaction sounds" }),
		).toBeChecked();
	});
});
