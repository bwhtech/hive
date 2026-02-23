import * as fs from "fs";
import * as path from "path";
import { expect, test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";
const csrfFile = "e2e/.auth/csrf.json";

/**
 * Authentication setup - runs once before all tests.
 * Uses browser fetch() so cookies are saved for the correct domain
 * (Chromium resolves pms.localhost via --host-resolver-rules).
 */
setup("authenticate", async ({ page }) => {
	const authDir = path.dirname(authFile);
	if (!fs.existsSync(authDir)) {
		fs.mkdirSync(authDir, { recursive: true });
	}

	const usr = process.env.FRAPPE_USER || "Administrator";
	const pwd = process.env.FRAPPE_PASSWORD || "admin";

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
	expect(loggedUser).toBeTruthy();
	expect(loggedUser).not.toBe("Guest");
	console.log(`Authenticated as: ${loggedUser}`);

	// Get CSRF token by navigating to /app (Frappe desk sets window.frappe.csrf_token)
	await page.goto("/app", { waitUntil: "domcontentloaded" });
	// Wait a bit for Frappe to initialize
	await page.waitForFunction(
		() =>
			(window as unknown as { frappe?: { csrf_token?: string } }).frappe
				?.csrf_token !== undefined,
		{ timeout: 15000 },
	).catch(() => {
		// CSRF token may not be available in all setups - continue without it
		console.warn("CSRF token not found, continuing without it");
	});

	const csrfToken = await page.evaluate(() => {
		return (window as unknown as { frappe?: { csrf_token?: string } }).frappe
			?.csrf_token;
	});

	if (csrfToken) {
		fs.writeFileSync(csrfFile, JSON.stringify({ csrf_token: csrfToken }));
		console.log("CSRF token saved");
	}

	await page.context().storageState({ path: authFile });
});
