import * as fs from "fs";
import { APIRequestContext } from "@playwright/test";

/**
 * Frappe API response wrapper.
 */
export interface FrappeResponse<T = unknown> {
	message?: T;
	exc?: string;
	exc_type?: string;
	_server_messages?: string;
}

// Path to CSRF token file saved by auth.setup.ts
const CSRF_FILE = "e2e/.auth/csrf.json";
// Path to auth storage state file saved by auth.setup.ts
const AUTH_FILE = "e2e/.auth/user.json";

// Node.js can't resolve .localhost TLDs, so API calls go via 127.0.0.1 + Host header.
const SITE_HOST = process.env.SITE_HOST || "pms.localhost:8000";
export const API_BASE = process.env.API_BASE || "http://127.0.0.1:8000";

// Cache for CSRF token (read from file once)
let csrfTokenCache: string | null = null;
// Cache for auth cookies (read from file once)
let cookieCache: string | null = null;

/**
 * Get CSRF token from the file saved during auth setup.
 */
function getCsrfToken(): string {
	if (csrfTokenCache !== null) {
		return csrfTokenCache;
	}

	try {
		if (fs.existsSync(CSRF_FILE)) {
			const data = JSON.parse(fs.readFileSync(CSRF_FILE, "utf-8"));
			csrfTokenCache = data.csrf_token || "";
			return csrfTokenCache;
		}
	} catch (error) {
		console.warn("Failed to read CSRF token file:", error);
	}

	csrfTokenCache = "";
	return "";
}

/**
 * Get auth cookies from the storage state file saved during auth setup.
 * Needed because the request fixture sends to 127.0.0.1 but cookies are
 * scoped to the site domain, so they won't be sent automatically.
 */
function getAuthCookies(): string {
	if (cookieCache !== null) {
		return cookieCache;
	}

	try {
		if (fs.existsSync(AUTH_FILE)) {
			const data = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
			const cookies = data.cookies as Array<{ name: string; value: string }>;
			if (cookies?.length) {
				cookieCache = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
				return cookieCache;
			}
		}
	} catch (error) {
		console.warn("Failed to read auth cookies file:", error);
	}

	cookieCache = "";
	return "";
}

/**
 * Build common headers for API requests (CSRF + Host + auth cookies).
 */
function apiHeaders(extra: Record<string, string> = {}): Record<string, string> {
	const csrfToken = getCsrfToken();
	const cookies = getAuthCookies();
	return {
		Host: SITE_HOST,
		...(csrfToken ? { "X-Frappe-CSRF-Token": csrfToken } : {}),
		...(cookies ? { Cookie: cookies } : {}),
		...extra,
	};
}

/**
 * Create a new document via Frappe REST API.
 */
export async function createDoc<T = Record<string, unknown>>(
	request: APIRequestContext,
	doctype: string,
	doc: Record<string, unknown>,
): Promise<T> {
	const response = await request.post(`${API_BASE}/api/resource/${doctype}`, {
		data: doc,
		headers: apiHeaders({ "Content-Type": "application/json" }),
	});

	if (!response.ok()) {
		const error = await response.text();
		throw new Error(`Failed to create ${doctype}: ${error}`);
	}

	const result = await response.json();
	return result.data as T;
}

/**
 * Get a document by name via Frappe REST API.
 */
export async function getDoc<T = Record<string, unknown>>(
	request: APIRequestContext,
	doctype: string,
	name: string,
): Promise<T> {
	const response = await request.get(
		`${API_BASE}/api/resource/${doctype}/${encodeURIComponent(name)}`,
		{ headers: apiHeaders() },
	);

	if (!response.ok()) {
		const error = await response.text();
		throw new Error(`Failed to get ${doctype}/${name}: ${error}`);
	}

	const result = await response.json();
	return result.data as T;
}

/**
 * Update a document via Frappe REST API.
 */
export async function updateDoc<T = Record<string, unknown>>(
	request: APIRequestContext,
	doctype: string,
	name: string,
	updates: Record<string, unknown>,
): Promise<T> {
	const response = await request.put(
		`${API_BASE}/api/resource/${doctype}/${encodeURIComponent(name)}`,
		{
			data: updates,
			headers: apiHeaders({ "Content-Type": "application/json" }),
		},
	);

	if (!response.ok()) {
		const error = await response.text();
		throw new Error(`Failed to update ${doctype}/${name}: ${error}`);
	}

	const result = await response.json();
	return result.data as T;
}

/**
 * Delete a document via Frappe REST API.
 */
export async function deleteDoc(
	request: APIRequestContext,
	doctype: string,
	name: string,
): Promise<void> {
	const response = await request.delete(
		`${API_BASE}/api/resource/${doctype}/${encodeURIComponent(name)}`,
		{ headers: apiHeaders() },
	);

	if (!response.ok()) {
		const error = await response.text();
		throw new Error(`Failed to delete ${doctype}/${name}: ${error}`);
	}
}

/**
 * Call a Frappe whitelisted method.
 */
export async function callMethod<T = unknown>(
	request: APIRequestContext,
	method: string,
	args: Record<string, unknown> = {},
): Promise<T> {
	const response = await request.post(`${API_BASE}/api/method/${method}`, {
		data: args,
		headers: apiHeaders({ "Content-Type": "application/json" }),
	});

	if (!response.ok()) {
		const error = await response.text();
		throw new Error(`Failed to call ${method}: ${error}`);
	}

	const result: FrappeResponse<T> = await response.json();
	return result.message as T;
}

/**
 * Get a list of documents via Frappe REST API.
 */
export async function getList<T = Record<string, unknown>>(
	request: APIRequestContext,
	doctype: string,
	options: {
		fields?: string[];
		filters?: Record<string, unknown>;
		limit?: number;
		orderBy?: string;
	} = {},
): Promise<T[]> {
	const params = new URLSearchParams();

	if (options.fields) {
		params.set("fields", JSON.stringify(options.fields));
	}
	if (options.filters) {
		params.set("filters", JSON.stringify(options.filters));
	}
	if (options.limit) {
		params.set("limit_page_length", options.limit.toString());
	}
	if (options.orderBy) {
		params.set("order_by", options.orderBy);
	}

	const response = await request.get(
		`${API_BASE}/api/resource/${doctype}?${params.toString()}`,
		{ headers: apiHeaders() },
	);

	if (!response.ok()) {
		const error = await response.text();
		throw new Error(`Failed to get list of ${doctype}: ${error}`);
	}

	const result = await response.json();
	return result.data as T[];
}

/**
 * Check if a document exists.
 */
export async function docExists(
	request: APIRequestContext,
	doctype: string,
	name: string,
): Promise<boolean> {
	try {
		await getDoc(request, doctype, name);
		return true;
	} catch {
		return false;
	}
}
