import { test, expect, Page } from "../helpers/app";
import { createDoc, deleteDoc, getList, updateDoc } from "../helpers/frappe";
import { openSettings } from "../helpers/ui";

const TEST_PREFIX = "E2E Client";

/**
 * Open Settings dialog and switch to the Clients tab.
 */
async function openClientsSettings(page: Page) {
	const dialog = await openSettings(page, "Clients");
	await expect(dialog.getByText("The organisations you work with.")).toBeVisible({
		timeout: 10000,
	});
	return dialog;
}

/** Back out of a client's member view to the list of clients. */
async function backToAllClients(page: Page, dialog: ReturnType<Page["getByRole"]>) {
	await dialog.getByRole("button", { name: "All clients" }).click();
	await expect(dialog.getByText("The organisations you work with.")).toBeVisible({
		timeout: 10000,
	});
}

/**
 * Cleanup test clients created during tests.
 * Also unassigns any Hive Members that were assigned to test clients.
 */
async function cleanupTestClients(
	request: import("@playwright/test").APIRequestContext,
) {
	try {
		const clients = await getList<{ name: string; company_name: string }>(
			request,
			"Hive Client",
			{
				fields: ["name", "company_name"],
				filters: { company_name: ["like", `${TEST_PREFIX}%`] },
				limit: 100,
			},
		);

		for (const client of clients) {
			// Unassign any members linked to this client before deleting
			const members = await getList<{ name: string }>(
				request,
				"Hive Member",
				{
					fields: ["name"],
					filters: { client: client.name },
					limit: 100,
				},
			);
			for (const member of members) {
				try {
					await updateDoc(request, "Hive Member", member.name, {
						type: "Team",
						client: "",
					});
				} catch {
					// Ignore
				}
			}

			try {
				await deleteDoc(request, "Hive Client", client.name);
			} catch {
				// Ignore cleanup errors
			}
		}
	} catch {
		// Ignore cleanup errors
	}
}

/**
 * Ensure the admin member is always type=Team so Settings stays visible.
 */
async function ensureAdminIsTeam(
	request: import("@playwright/test").APIRequestContext,
) {
	try {
		await updateDoc(request, "Hive Member", "Administrator", {
			type: "Team",
			client: "",
		});
	} catch {
		// Ignore — may not exist
	}
}

/**
 * Restore the seed clientuser to its original state (Client type, Acme Corp).
 */
async function restoreClientUser(
	request: import("@playwright/test").APIRequestContext,
) {
	try {
		await updateDoc(request, "Hive Member", "clientuser@example.com", {
			type: "Client",
			client: "Acme Corp",
		});
	} catch {
		// Ignore — may not exist
	}
}

test.describe("Clients", () => {
	test.beforeAll(async ({ request }) => {
		await cleanupTestClients(request);
		await ensureAdminIsTeam(request);
	});

	test.afterAll(async ({ request }) => {
		await cleanupTestClients(request);
		await ensureAdminIsTeam(request);
		await restoreClientUser(request);
	});

	test("should display existing client organizations", async ({ page }) => {
		const dialog = await openClientsSettings(page);

		// Acme Corp was created by the e2e_seed script
		await expect(dialog.getByText("Acme Corp").first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should add a new client and see it in the list", async ({
		page,
		request,
	}) => {
		await cleanupTestClients(request);

		const clientName = `${TEST_PREFIX} ${Date.now()}`;
		const dialog = await openClientsSettings(page);

		// Fill in the company name and click Add
		await dialog.getByLabel("New client").fill(clientName);
		await dialog.getByRole("button", { name: "Add" }).click();

		// Wait for success toast
		await expect(
			page.getByText(`Added "${clientName}"`),
		).toBeVisible({ timeout: 10000 });

		// Verify it appears in the list
		await expect(dialog.getByText(clientName).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should add a client via Enter key", async ({ page, request }) => {
		await cleanupTestClients(request);

		const clientName = `${TEST_PREFIX} Enter ${Date.now()}`;
		const dialog = await openClientsSettings(page);

		const input = dialog.getByLabel("New client");
		await input.fill(clientName);
		await input.press("Enter");

		// Wait for success toast
		await expect(
			page.getByText(`Added "${clientName}"`),
		).toBeVisible({ timeout: 10000 });

		// Verify it appears in the list
		await expect(dialog.getByText(clientName).first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should navigate into a client and see client members view", async ({
		page,
		request,
	}) => {
		await cleanupTestClients(request);

		// Create a test client via API
		const clientName = `${TEST_PREFIX} Nav ${Date.now()}`;
		await createDoc(request, "Hive Client", {
			company_name: clientName,
		});

		const dialog = await openClientsSettings(page);

		// Click on the client to enter the members view
		await dialog.getByRole("button", { name: clientName }).click();

		// Should see the client name as a heading and the members sections
		await expect(dialog.getByText(clientName).first()).toBeVisible({
			timeout: 10000,
		});
		await expect(dialog.getByText("Invite a member")).toBeVisible();
		await expect(dialog.getByText("Client members")).toBeVisible();

		// Should show the empty state for members
		await expect(dialog.getByText("No members assigned")).toBeVisible();

		await backToAllClients(page, dialog);
	});

	test("should assign an existing member to a client and remove them", async ({
		page,
		request,
	}) => {
		await cleanupTestClients(request);

		// Create a test client via API
		const clientName = `${TEST_PREFIX} Assign ${Date.now()}`;
		await createDoc(request, "Hive Client", {
			company_name: clientName,
		});

		const dialog = await openClientsSettings(page);

		// Click on the client
		await dialog.getByRole("button", { name: clientName }).click();
		await expect(dialog.getByText("Client members")).toBeVisible({
			timeout: 5000,
		});

		// The "Add Existing Member" dropdown should be visible
		await expect(
			dialog.getByText("Add an existing member"),
		).toBeVisible({ timeout: 5000 });

		// Select a member from the dropdown — pick "Client User" (seed data)
		// to avoid changing the admin's type which would hide Settings.
		const dropdown = dialog.getByRole("combobox", { name: "Assign a member" });
		await dropdown.click();

		// Pick the clientuser option (from seed data: "Client User")
		// If not available, pick the last option (least likely to be admin)
		const clientOption = page.getByRole("option", { name: "Client User" });
		const targetOption = (await clientOption.count()) > 0
			? clientOption
			: page.getByRole("option").last();
		const memberName = await targetOption.textContent();
		await targetOption.click();

		// Wait for success toast
		await expect(
			page.getByText("Member assigned"),
		).toBeVisible({ timeout: 10000 });

		// The member should now appear in the Client Members list
		await expect(dialog.getByText(memberName!.trim()).first()).toBeVisible({
			timeout: 10000,
		});

		// Now remove the member by clicking the X button
		await dialog
			.getByRole("button", { name: `Remove ${memberName!.trim()}` })
			.click();

		// Wait for removal toast
		await expect(
			page.getByText("Member removed from the client"),
		).toBeVisible({ timeout: 10000 });

		// Empty state should return
		await expect(dialog.getByText("No members assigned")).toBeVisible({
			timeout: 10000,
		});
	});
});
