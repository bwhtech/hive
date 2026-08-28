import {
	test,
	expect,
	readStoredValue,
	seedStorage,
	STORAGE_KEYS,
	Page,
} from "../helpers/app";
import {
	createTestProject,
	cleanupTestProjects,
	HiveProject,
} from "../helpers/hive";
import { createDoc, getList } from "../helpers/frappe";
import { gotoHive, projectCard, tabButton } from "../helpers/ui";

const PROJECT_PREFIX = "E2E MyProj";

/** The membership filter is a `TabButtons` pair, not a pressed button. */
function myProjectsTab(page: Page) {
	return tabButton(page, "My projects");
}

/**
 * Land on the projects page, optionally with the membership filter already on.
 * Presetting it avoids a race between the click and the memberships call.
 */
async function goToProjects(
	page: Page,
	options: { myProjectsOnly?: boolean } = {},
) {
	await seedStorage(page, {
		[STORAGE_KEYS.projectsMyOnly]:
			options.myProjectsOnly === undefined ? null : options.myProjectsOnly,
	});

	await gotoHive(page, "/projects");
	await expect(myProjectsTab(page)).toBeVisible({ timeout: 15000 });
}

test.describe("My Projects Filter Toggle", () => {
	let memberProject: HiveProject;
	let nonMemberProject: HiveProject;

	test.beforeAll(async ({ request }) => {
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Create project WITH member in one shot (child table in the create payload)
		memberProject = await createDoc<HiveProject>(request, "Hive Project", {
			title: `${PROJECT_PREFIX} Member ${Date.now()}`,
			status: "Open",
			members: [{ member: "Administrator", role: "Member" }],
		});
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

	test("should show the My projects tab unselected by default", async ({
		page,
	}) => {
		await goToProjects(page);

		await expect(myProjectsTab(page)).not.toBeChecked();
		await expect(tabButton(page, "All")).toBeChecked();
	});

	test("should filter to only member projects when My projects is on", async ({
		page,
	}) => {
		await goToProjects(page, { myProjectsOnly: true });

		await expect(myProjectsTab(page)).toBeChecked();

		await expect(projectCard(page, memberProject.name)).toBeVisible({
			timeout: 10000,
		});
		await expect(projectCard(page, nonMemberProject.name)).toBeHidden();

		// The count line calls out that a filter is narrowing the list
		await expect(page.getByText("matching filters")).toBeVisible();
	});

	test("should persist the filter across page reload", async ({ page }) => {
		await goToProjects(page, { myProjectsOnly: true });

		await expect(myProjectsTab(page)).toBeChecked();
		expect(
			await readStoredValue(page, STORAGE_KEYS.projectsMyOnly),
		).toBe(true);

		// Reload without reseeding: the app has to restore this itself
		await page.reload();
		await page.waitForLoadState("networkidle");

		await expect(myProjectsTab(page)).toBeChecked({ timeout: 15000 });
		await expect(projectCard(page, nonMemberProject.name)).toBeHidden();
	});

	test("should unfilter when All is selected", async ({ page }) => {
		await goToProjects(page, { myProjectsOnly: true });

		await expect(myProjectsTab(page)).toBeChecked();
		await expect(projectCard(page, nonMemberProject.name)).toBeHidden();

		await tabButton(page, "All").click();
		await expect(tabButton(page, "All")).toBeChecked();

		await expect(projectCard(page, memberProject.name)).toBeVisible();
		await expect(projectCard(page, nonMemberProject.name)).toBeVisible();

		expect(
			await readStoredValue(page, STORAGE_KEYS.projectsMyOnly),
		).toBe(false);
	});
});
