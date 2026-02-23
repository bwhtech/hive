import { defineConfig, devices } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "e2e", ".auth", "user.json");

// Frappe multisite routing requires the Host header to match the site name.
// Node.js can't resolve .localhost TLDs, so we connect to 127.0.0.1 and set
// the Host header. Browser navigations use Chromium's --host-resolver-rules.
const SITE_HOST = process.env.SITE_HOST || "pms.localhost:8000";

// API calls (page.request / request fixture) use Node.js DNS -> 127.0.0.1 + Host header
const API_BASE = process.env.API_BASE || "http://127.0.0.1:8000";
// Page navigations use browser DNS -> Chromium resolver rules
const PAGE_BASE = process.env.BASE_URL || "http://pms.localhost:8000";

export default defineConfig({
	testDir: "./e2e/tests",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
	timeout: 60000,

	expect: {
		timeout: 10000,
	},

	use: {
		baseURL: PAGE_BASE,
		trace: "on-first-retry",
		video: "retain-on-failure",
		screenshot: "only-on-failure",
		actionTimeout: 15000,
		navigationTimeout: 30000,
		launchOptions: {
			args: [`--host-resolver-rules=MAP pms.localhost 127.0.0.1`],
		},
	},

	projects: [
		{
			name: "setup",
			testMatch: /auth\.setup\.ts/,
		},
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				storageState: authFile,
			},
			dependencies: ["setup"],
		},
	],
});
