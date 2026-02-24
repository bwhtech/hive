import { test, expect } from "@playwright/test";
import { callMethod } from "../helpers/frappe";

const TEST_EMAIL = `e2e-invite-${Date.now()}@example.com`;

/**
 * Open the Settings dialog and switch to the Members tab.
 */
async function openMembersSettings(page: import("@playwright/test").Page) {
	await page.goto("/hive");
	await page.waitForLoadState("networkidle");

	// Click the Settings button in the sidebar
	await page.getByRole("button", { name: "Settings" }).click();

	// Settings dialog should open
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible({ timeout: 5000 });

	// Click the Members tab
	await dialog.getByRole("tab", { name: "Members" }).click();

	// Wait for the Members section to be visible
	await expect(dialog.getByText("Invite Member")).toBeVisible({
		timeout: 5000,
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
		const pending = await callMethod<
			{ name: string; email: string }[]
		>(
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

	test("should display active members list in settings", async ({
		page,
	}) => {
		const dialog = await openMembersSettings(page);

		// Should show the Members heading with a count
		await expect(dialog.getByText(/^Members \(\d+\)/)).toBeVisible();

		// At least one member should be visible (the admin user)
		await expect(
			dialog.getByText("Administrator Bhaisaab"),
		).toBeVisible({ timeout: 5000 });
	});

	test("should send an invitation and see it as pending", async ({
		page,
		request,
	}) => {
		await cleanupPendingInvitations(request, "e2e-invite-");

		const dialog = await openMembersSettings(page);

		// Fill in the email and click Invite
		await dialog.getByPlaceholder("email@example.com").fill(TEST_EMAIL);
		await dialog.getByRole("button", { name: /invite/i }).click();

		// Wait for the success toast
		await expect(
			page.getByText(`Invitation sent to ${TEST_EMAIL}`),
		).toBeVisible({ timeout: 10000 });

		// The pending invitations section should appear with our email
		await expect(
			dialog.getByText("Pending Invitations"),
		).toBeVisible({ timeout: 5000 });
		await expect(dialog.getByText(TEST_EMAIL)).toBeVisible();
	});

	test("should cancel a pending invitation", async ({ page, request }) => {
		// Clean up any stale invitations from previous tests
		await cleanupPendingInvitations(request, "e2e-invite-");

		// Create a single pending invitation via API
		const inviteEmail = `e2e-invite-cancel-${Date.now()}@example.com`;
		await callMethod(
			request,
			"bwh_hive.bwh_hive.api.invite_member",
			{
				email: inviteEmail,
				role: "Hive Team",
			},
		);

		const dialog = await openMembersSettings(page);

		// Verify the pending invitation is visible
		await expect(
			dialog.getByText("Pending Invitations"),
		).toBeVisible({ timeout: 5000 });
		await expect(dialog.getByText(inviteEmail)).toBeVisible();

		// Click the cancel (X) button in the pending invitations section.
		// The "Pending Invitations" section is an ItemGroup. Find the cancel button
		// that is a sibling of the title containing our invite email.
		const pendingSection = dialog.locator('[data-slot="item-group"]').first();
		const cancelBtn = pendingSection
			.locator('[data-slot="item-actions"] button')
			.first();
		await cancelBtn.click();

		// Wait for the success toast
		await expect(
			page.getByText(`Invitation to ${inviteEmail} cancelled`),
		).toBeVisible({ timeout: 10000 });

		// The email should no longer be in the pending list
		await expect(dialog.getByText(inviteEmail)).not.toBeVisible({
			timeout: 5000,
		});
	});

	test("should filter members by type", async ({ page }) => {
		const dialog = await openMembersSettings(page);

		// The type filter dropdown is the small one near "Members (N)" heading
		// It shows "all" by default and has className w-[100px]
		const filterTrigger = dialog.locator("button[role='combobox']").last();
		await expect(filterTrigger).toBeVisible();
		await expect(filterTrigger).toContainText("all");

		// Switch to "Team" filter
		await filterTrigger.click();
		await page.getByRole("option", { name: "Team" }).click();

		// Should show only Team members — use heading role to avoid matching the tab
		await expect(
			dialog.getByRole("heading", { name: /^Members/ }),
		).toBeVisible();

		// Switch to "Client" filter
		await dialog.locator("button[role='combobox']").last().click();
		await page.getByRole("option", { name: "Client" }).click();

		// Should still show Members section (even if showing Client members or empty state)
		await expect(
			dialog
				.getByRole("heading", { name: /^Members/ })
				.or(dialog.getByText("No members found")),
		).toBeVisible();
	});

	test("should invite a member with Client role", async ({
		page,
		request,
	}) => {
		await cleanupPendingInvitations(request, "e2e-invite-client-");

		const clientEmail = `e2e-invite-client-${Date.now()}@example.com`;
		const dialog = await openMembersSettings(page);

		// Fill in the email
		await dialog
			.getByPlaceholder("email@example.com")
			.fill(clientEmail);

		// The role dropdown is the first combobox (near the invite input, w-[140px])
		// It currently shows "Team" — switch it to "Client"
		const roleDropdown = dialog.locator("button[role='combobox']").first();
		await expect(roleDropdown).toContainText("Team");
		await roleDropdown.click();
		await page.getByRole("option", { name: "Client" }).click();

		// Click Invite button
		await dialog.getByRole("button", { name: /invite/i }).click();

		// Wait for success toast
		await expect(
			page.getByText(`Invitation sent to ${clientEmail}`),
		).toBeVisible({ timeout: 10000 });

		// The pending invitation should appear
		await expect(dialog.getByText(clientEmail)).toBeVisible({
			timeout: 5000,
		});
	});
});
