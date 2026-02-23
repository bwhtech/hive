import * as fs from "fs";
import * as path from "path";
import { expect, test as setup } from "@playwright/test";

const authFile = "e2e/.auth/client.json";
const csrfFile = "e2e/.auth/client-csrf.json";

/**
 * Client user authentication setup — runs once before client tests.
 * Logs in as a Hive Client user (not admin/team).
 */
setup("authenticate as client", async ({ page }) => {
	const authDir = path.dirname(authFile);
	if (!fs.existsSync(authDir)) {
		fs.mkdirSync(authDir, { recursive: true });
	}

	const usr = process.env.CLIENT_USER || "clientuser@example.com";
	const pwd = process.env.CLIENT_PASSWORD || "Cl!ent2024#Secure";

	// Navigate to login page first to establish the domain context
	await page.goto("/login");
	await page.waitForLoadState("domcontentloaded");

	// Login via browser fetch (keeps cookies on the correct domain)
	const loginResult = await page.evaluate(
		async ({ usr, pwd }) => {
			const resp = await fetch("/api/method/login", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: `usr=${encodeURIComponent(usr)}&pwd=${encodeURIComponent(pwd)}`,
			});
			return { ok: resp.ok, status: resp.status };
		},
		{ usr, pwd },
	);
	expect(loginResult.ok).toBeTruthy();

	// Verify login succeeded
	const loggedUser = await page.evaluate(async () => {
		const resp = await fetch("/api/method/frappe.auth.get_logged_user");
		const data = await resp.json();
		return data.message as string;
	});
	expect(loggedUser).toBe(usr);
	console.log(`Client authenticated as: ${loggedUser}`);

	// Get CSRF token
	await page.goto("/app", { waitUntil: "domcontentloaded" });
	await page
		.waitForFunction(
			() =>
				(window as unknown as { frappe?: { csrf_token?: string } }).frappe
					?.csrf_token !== undefined,
			{ timeout: 15000 },
		)
		.catch(() => {
			console.warn("CSRF token not found for client user, continuing");
		});

	const csrfToken = await page.evaluate(() => {
		return (window as unknown as { frappe?: { csrf_token?: string } }).frappe
			?.csrf_token;
	});

	if (csrfToken) {
		fs.writeFileSync(csrfFile, JSON.stringify({ csrf_token: csrfToken }));
		console.log("Client CSRF token saved");
	}

	await page.context().storageState({ path: authFile });
});
