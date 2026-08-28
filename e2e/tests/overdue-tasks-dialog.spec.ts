import {
	test,
	expect,
	allowOverdueDialog,
	readStoredValue,
	todayISO,
	STORAGE_KEYS,
	Page,
} from "../helpers/app";
import {
	createTestProject,
	cleanupTestProjects,
	HiveProject,
	HiveTask,
} from "../helpers/hive";
import { callMethod, createDoc, deleteDoc, getList } from "../helpers/frappe";
import { dialog, gotoHive } from "../helpers/ui";

const PROJECT_PREFIX = "E2E Overdue Dialog";
const TASK_PREFIX = "E2E Overdue Task";

/** Return a yyyy-MM-dd string for N days ago. */
function daysAgo(n: number): string {
	const d = new Date();
	d.setDate(d.getDate() - n);
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${month}-${day}`;
}

/** The dialog itself, so assertions never match the dashboard behind it. */
function overdueDialog(page: Page) {
	return dialog(page, "Overdue tasks");
}

/** Land on the dashboard with the once-a-day dialog allowed through. */
async function goToDashboardAllowDialog(page: Page) {
	await allowOverdueDialog(page);
	await gotoHive(page, "/");
	await expect(overdueDialog(page)).toBeVisible({ timeout: 15000 });
}

async function cleanupTestTasks(
	request: import("@playwright/test").APIRequestContext,
) {
	try {
		const tasks = await getList<{ name: string }>(request, "Hive Task", {
			fields: ["name"],
			filters: { title: ["like", `${TASK_PREFIX}%`] },
			limit: 100,
		});
		for (const task of tasks) {
			try {
				await deleteDoc(request, "Hive Task", task.name);
			} catch {
				// Ignore cleanup errors
			}
		}
	} catch {
		// Ignore cleanup errors
	}
}

test.describe("Overdue Tasks Dialog", () => {
	let testProject: HiveProject;
	let overdueTask1: HiveTask;
	let overdueTask2: HiveTask;

	test.beforeAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);

		// Create a test project
		testProject = await createTestProject(request, {
			title: `${PROJECT_PREFIX} ${Date.now()}`,
		});

		// Create overdue tasks (due_date in the past) assigned to Administrator
		overdueTask1 = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} High ${Date.now()}`,
			project: testProject.name,
			status: "In Progress",
			priority: "High",
			due_date: daysAgo(3),
		});

		overdueTask2 = await createDoc<HiveTask>(request, "Hive Task", {
			title: `${TASK_PREFIX} Medium ${Date.now()}`,
			project: testProject.name,
			status: "To Do",
			priority: "Medium",
			due_date: daysAgo(5),
		});

		// Assign both tasks to Administrator
		await callMethod(request, "frappe.desk.form.assign_to.add", {
			doctype: "Hive Task",
			name: overdueTask1.name,
			assign_to: ["Administrator"],
		});
		await callMethod(request, "frappe.desk.form.assign_to.add", {
			doctype: "Hive Task",
			name: overdueTask2.name,
			assign_to: ["Administrator"],
		});
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestTasks(request);
		await cleanupTestProjects(request, PROJECT_PREFIX);
	});

	test("should show overdue tasks dialog when user has overdue tasks", async ({
		page,
	}) => {
		await goToDashboardAllowDialog(page);

		const overdue = overdueDialog(page);

		// Both overdue tasks are listed, each with its own priority badge. The
		// list also holds whatever else is overdue on the site, so every
		// assertion is scoped to the row of the task it is about.
		const row1 = overdue.getByRole("listitem").filter({
			hasText: overdueTask1.title,
		});
		const row2 = overdue.getByRole("listitem").filter({
			hasText: overdueTask2.title,
		});
		await expect(row1).toBeVisible();
		await expect(row2).toBeVisible();
		await expect(row1.getByText("High", { exact: true })).toBeVisible();
		await expect(row2.getByText("Medium", { exact: true })).toBeVisible();

		await expect(overdue.getByRole("button", { name: "Got it" })).toBeVisible();
		await expect(
			overdue.getByRole("button", { name: "View all tasks" }),
		).toBeVisible();
	});

	test("should not show dialog if already shown today", async ({ page }) => {
		// The fixture already stamped today's date, so the dialog stays away
		await gotoHive(page, "/");
		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible({ timeout: 15000 });

		// Give the overdue call the time it would need to open the dialog
		await page.waitForTimeout(2000);
		await expect(overdueDialog(page)).toBeHidden();
	});

	test("should dismiss dialog and stamp today on 'Got it' click", async ({
		page,
	}) => {
		await goToDashboardAllowDialog(page);

		await overdueDialog(page).getByRole("button", { name: "Got it" }).click();
		await expect(overdueDialog(page)).toBeHidden();

		expect(
			await readStoredValue(page, STORAGE_KEYS.overdueDialogLastShown),
		).toBe(todayISO());

		await expect(
			page.getByRole("heading", { name: "Dashboard" }),
		).toBeVisible();
	});

	test("should navigate to /tasks on 'View all tasks' click", async ({
		page,
	}) => {
		await goToDashboardAllowDialog(page);

		await overdueDialog(page)
			.getByRole("button", { name: "View all tasks" })
			.click();

		await page.waitForURL("**/hive/tasks", { timeout: 10000 });
		await expect(page).toHaveURL(/\/hive\/tasks/);
	});

	test("should navigate to project on task click", async ({ page }) => {
		await goToDashboardAllowDialog(page);

		await overdueDialog(page)
			.getByRole("listitem")
			.filter({ hasText: overdueTask2.title })
			.click();

		// The route uses the project slug, falling back to its docname
		const slug = testProject.slug || testProject.name;
		await page.waitForURL(`**/hive/projects/${slug}**`, { timeout: 10000 });
		await expect(page).toHaveURL(new RegExp(`/hive/projects/${slug}`));
	});
});
