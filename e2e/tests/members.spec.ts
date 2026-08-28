import { test, expect, Page } from "../helpers/app";
import { callMethod } from "../helpers/frappe";
import { chooseOption, openSettings, selectTrigger } from "../helpers/ui";

const TEST_EMAIL = `e2e-invite-${Date.now()}@example.com`;

/**
 * Open the Settings dialog on its Members panel.
 */
async function openMembersSettings(page: Page) {
	const dialog = await openSettings(page, "Members");
	await expect(dialog.getByText("Invite a member")).toBeVisible({
		timeout: 10000,
	});
	return dialog;
}

/**
 * Cancel all pending invitations matching a pattern via API.
 */
async function cleanupPendingInvitations(
	request: import("@playwright/test").APIRequestContext,
	emailPattern: string,
) {
	try {
		const pending = await callMethod<{ name: string; email: string }[]>(
			request,
			"frappe.core.api.user_invitation.get_pending_invitations",
			{ app_name: "bwh_hive" },
		);

		if (!Array.isArray(pending)) return;

		for (const invite of pending) {
			if (invite.email.includes(emailPattern)) {
				await callMethod(
					request,
					"frappe.core.api.user_invitation.cancel_invitation",
					{ name: invite.name, app_name: "bwh_hive" },
				);
			}
		}
	} catch {
		// Ignore cleanup errors
	}
}

test.describe("Members", () => {
	test.afterAll(async ({ request }) => {
		await cleanupPendingInvitations(request, "e2e-invite-");
	});

	test("should display active members list in settings", async ({ page }) => {
		const dialog = await openMembersSettings(page);

		await expect(
			dialog.getByRole("heading", { name: /^\d+ members?$/ }),
		).toBeVisible();

		// The signed-in admin is a member, so the list is never empty. The name
		// also appears in the row's meta line, hence `.first()`.
		await expect(dialog.getByText("Administrator").first()).toBeVisible({
			timeout: 10000,
		});
	});

	test("should send an invitation and see it as pending", async ({
		page,
		request,
	}) => {
		await cleanupPendingInvitations(request, "e2e-invite-");

		const dialog = await openMembersSettings(page);

		await dialog.getByLabel("Invitee email").fill(TEST_EMAIL);
		await dialog.getByRole("button", { name: "Invite", exact: true }).click();

		await expect(
			page.getByText(`Invitation sent to ${TEST_EMAIL}`),
		).toBeVisible({ timeout: 10000 });

		await expect(dialog.getByText("Pending invitations")).toBeVisible({
			timeout: 10000,
		});
		await expect(dialog.getByText(TEST_EMAIL)).toBeVisible();
	});

	test("should cancel a pending invitation", async ({ page, request }) => {
		await cleanupPendingInvitations(request, "e2e-invite-");

		const inviteEmail = `e2e-invite-cancel-${Date.now()}@example.com`;
		await callMethod(request, "bwh_hive.bwh_hive.api.invite_member", {
			email: inviteEmail,
			role: "Hive Team",
		});

		const dialog = await openMembersSettings(page);

		await expect(dialog.getByText("Pending invitations")).toBeVisible({
			timeout: 10000,
		});
		await expect(dialog.getByText(inviteEmail)).toBeVisible();

		await dialog
			.getByRole("button", { name: `Cancel invitation to ${inviteEmail}` })
			.click();

		await expect(
			page.getByText(`Invitation to ${inviteEmail} cancelled`),
		).toBeVisible({ timeout: 10000 });

		await expect(dialog.getByText(inviteEmail)).toHaveCount(0, {
			timeout: 10000,
		});
	});

	test("should filter members by type", async ({ page }) => {
		const dialog = await openMembersSettings(page);

		const filter = selectTrigger(dialog, "Filter by member type");
		await expect(filter).toHaveText(/All/);

		await chooseOption(page, "Filter by member type", "Team", dialog);
		await expect(filter).toHaveText(/Team/);

		await chooseOption(page, "Filter by member type", "Client", dialog);
		await expect(filter).toHaveText(/Client/);

		// Either some client members or the empty state — both are valid.
		await expect(
			dialog
				.getByRole("heading", { name: /^\d+ members?$/ })
				.or(dialog.getByText("No members found")),
		).toBeVisible();
	});

	test("should invite a member with Client role", async ({ page, request }) => {
		await cleanupPendingInvitations(request, "e2e-invite-client-");

		const clientEmail = `e2e-invite-client-${Date.now()}@example.com`;
		const dialog = await openMembersSettings(page);

		await dialog.getByLabel("Invitee email").fill(clientEmail);

		await expect(selectTrigger(dialog, "Role")).toHaveText(/Team/);
		await chooseOption(page, "Role", "Client", dialog);

		// Choosing the Client role reveals a client-organisation picker.
		const clientPicker = dialog.getByRole("button", { name: /Select client/ });
		await expect(clientPicker).toBeVisible({ timeout: 5000 });
		await clientPicker.click();
		await page.getByRole("option").first().click();

		await dialog.getByRole("button", { name: "Invite", exact: true }).click();

		await expect(
			page.getByText(`Invitation sent to ${clientEmail}`),
		).toBeVisible({ timeout: 10000 });

		await expect(dialog.getByText(clientEmail)).toBeVisible({
			timeout: 10000,
		});
	});
});
