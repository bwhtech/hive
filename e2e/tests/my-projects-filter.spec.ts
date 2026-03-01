import { test, expect, Page } from "@playwright/test";
import {
	createTestProject,
	cleanupTestProjects,
	HiveProject,
} from "../helpers/hive";
import { createDoc, getList } from "../helpers/frappe";

const PROJECT_PREFIX = "E2E MyProj";
const LS_KEY = "hive_projects_my_only";
const OVERDUE_KEY = "hive-overdue-dialog-last-shown";

/**
 * Get today in yyyy-MM-dd format (matches OverdueTasksDialog's date-fns format).
 */
function todayISO(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Navigate to the projects page with the overdue dialog suppressed.
 */
async function goToProjects(
	page: Page,
	options: { myProjectsOnly?: boolean } = {},
) {
	const today = todayISO();
	const myOnly = options.myProjectsOnly;

	await page.addInitScript(
		({ overdueKey, lsKey, todayStr, myOnlyVal }) => {
			localStorage.setItem(overdueKey, todayStr);
			if (myOnlyVal !== undefined) {
				localStorage.setItem(lsKey, String(myOnlyVal));
			} else {
				localStorage.removeItem(lsKey);
			}
		},
		{ overdueKey: OVERDUE_KEY, lsKey: LS_KEY, todayStr: today, myOnlyVal: myOnly },
	);

	await page.goto("/hive/projects");
	await page.waitForLoadState("domcontentloaded");

	// Wait for the toggle button to confirm the page is interactive
	await expect(
		page.getByRole("button", { name: "My Projects" }),
	).toBeVisible({ timeout: 15000 });
}

test.describe("My Projects Filter Toggle", () => {
	let memberProject: HiveProject;
	let nonMemberProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Create project WITH member in one shot (child table in the create payload)
		memberProject = await createDoc<HiveProject>(
			request,
			"Hive Project",
			{
				title: `${PROJECT_PREFIX} Member ${Date.now()}`,
				status: "Open",
				members: [{ member: "Administrator", role: "Member" }],
			},
		);
		nonMemberProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} NonMember ${Date.now()}`,
		});

		// Verify membership was saved
		const members = await getList<{ parent: string; member: string }>(
			request,
			"Hive Project Member",
			{
				fields: ["parent", "member"],
				filters: { parent: memberProject.name, member: "Administrator" },
			},
		);
		if (members.length === 0) {
			throw new Error(
				`Failed to add Administrator as member of ${memberProject.name}`,
			);
		}
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should show My Projects toggle button unpressed by default", async ({
		page,
	}) => {
		await goToProjects(page);

		const toggle = page.getByRole("button", { name: "My Projects" });
		await expect(toggle).toBeVisible();
		await expect(toggle).toHaveAttribute("aria-pressed", "false");
	});

	test("should filter to only member projects when toggle is pressed", async ({
		page,
	}) => {
		// Start with toggle already pressed to avoid race between toggle click
		// and membership API response
		await goToProjects(page, { myProjectsOnly: true });

		const toggle = page.getByRole("button", { name: "My Projects" });
		await expect(toggle).toHaveAttribute("aria-pressed", "true");

		// Member project should be visible
		await expect(
			page.locator(`text=${memberProject.title}`).first(),
		).toBeVisible({ timeout: 10000 });

		// Non-member project should be hidden
		await expect(
			page.locator(`text=${nonMemberProject.title}`).first(),
		).toBeHidden({ timeout: 5000 });

		// Shows "matching filters" indicator
		await expect(page.locator("text=matching filters")).toBeVisible();
	});

	test("should persist toggle state across page reload", async ({ page }) => {
		// Start with toggle pre-set to true
		await goToProjects(page, { myProjectsOnly: true });

		const toggle = page.getByRole("button", { name: "My Projects" });
		await expect(toggle).toHaveAttribute("aria-pressed", "true");

		// Verify localStorage
		const stored = await page.evaluate(
			(key) => localStorage.getItem(key),
			LS_KEY,
		);
		expect(stored).toBe("true");

		// Reload — only suppress overdue dialog, don't touch toggle key
		const today = todayISO();
		await page.addInitScript(
			({ overdueKey, todayStr }) => {
				localStorage.setItem(overdueKey, todayStr);
			},
			{ overdueKey: OVERDUE_KEY, todayStr: today },
		);

		await page.reload();
		await page.waitForLoadState("domcontentloaded");

		const toggleAfter = page.getByRole("button", { name: "My Projects" });
		await expect(toggleAfter).toHaveAttribute("aria-pressed", "true", {
			timeout: 15000,
		});

		// Non-member project should still be hidden
		await expect(
			page.locator(`text=${nonMemberProject.title}`).first(),
		).toBeHidden({ timeout: 5000 });
	});

	test("should unfilter when toggle is unpressed", async ({ page }) => {
		// Start with toggle pressed
		await goToProjects(page, { myProjectsOnly: true });

		const toggle = page.getByRole("button", { name: "My Projects" });
		await expect(toggle).toHaveAttribute("aria-pressed", "true");

		// Non-member project should be hidden
		await expect(
			page.locator(`text=${nonMemberProject.title}`).first(),
		).toBeHidden({ timeout: 5000 });

		// Unpress the toggle
		await toggle.click();
		await expect(toggle).toHaveAttribute("aria-pressed", "false");

		// Both projects should now be visible
		await expect(
			page.locator(`text=${memberProject.title}`).first(),
		).toBeVisible({ timeout: 5000 });
		await expect(
			page.locator(`text=${nonMemberProject.title}`).first(),
		).toBeVisible({ timeout: 5000 });

		// localStorage should be updated
		const stored = await page.evaluate(
			(key) => localStorage.getItem(key),
			LS_KEY,
		);
		expect(stored).toBe("false");
	});

});
