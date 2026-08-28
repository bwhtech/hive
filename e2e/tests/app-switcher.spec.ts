import { test, expect } from "../helpers/app";
import { callMethodGet } from "../helpers/frappe";
import { gotoHive } from "../helpers/ui";

/**
 * The switcher is fed by `frappe.apps.get_apps` — the site-wide apps-screen
 * list — so what it offers depends on which apps the site has installed. The
 * one row it always has is Desk, added client-side for System Managers.
 */
test.describe("App switcher", () => {
	test("lists Desk and the site's other apps, but not Hive itself", async ({
		page,
		request,
	}) => {
		const apps = await callMethodGet<
			{ name: string; title: string; route: string }[]
		>(request, "frappe.apps.get_apps");

		await gotoHive(page, "/");

		await page.locator('[data-slot="sidebar-header"] button').click();
		await page.getByRole("menuitem", { name: "Switch app" }).hover();

		const desk = page.getByRole("menuitem", { name: "Desk" });
		await expect(desk).toBeVisible({ timeout: 10000 });
		await expect(page.getByRole("menuitem", { name: "Hive" })).toHaveCount(0);

		for (const app of apps.filter((app) => app.name !== "bwh_hive")) {
			await expect(page.getByRole("menuitem", { name: app.title })).toBeVisible();
		}

		await desk.click();
		await expect(page).toHaveURL(/\/desk/);
	});
});
