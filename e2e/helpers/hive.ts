import { APIRequestContext } from "@playwright/test";
import { createDoc, deleteDoc, getDoc, getList } from "./frappe";

/**
 * Hive Feature Request document interface.
 */
export interface HiveFeatureRequest {
	name: string;
	title: string;
	project: string;
	requested_by: string;
	status: string;
	priority: string;
	description?: string;
	creation?: string;
	modified?: string;
}

/**
 * Hive Project document interface.
 */
export interface HiveProject {
	name: string;
	title: string;
	status: string;
	project_type?: string;
	client?: string;
	creation?: string;
	modified?: string;
}

/**
 * Hive Task document interface.
 */
export interface HiveTask {
	name: string;
	title: string;
	project: string;
	status: string;
	priority?: string;
	size?: string;
	milestone?: string;
	creation?: string;
	modified?: string;
}

/**
 * Generate a unique project title for tests.
 */
export function generateProjectTitle(prefix = "E2E Test Project"): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 8);
	return `${prefix} ${timestamp}-${random}`;
}

/**
 * Create a test Hive Project via API.
 */
export async function createTestProject(
	request: APIRequestContext,
	options: {
		title?: string;
		status?: string;
		project_type?: string;
		client?: string;
	} = {},
): Promise<HiveProject> {
	const title = options.title || generateProjectTitle();

	return createDoc<HiveProject>(request, "Hive Project", {
		title,
		status: options.status ?? "Open",
		project_type: options.project_type,
		client: options.client,
	});
}

/**
 * Delete a test Hive Project via API.
 */
export async function deleteTestProject(
	request: APIRequestContext,
	name: string,
): Promise<void> {
	await deleteDoc(request, "Hive Project", name);
}

/**
 * Get a Hive Project by name via API.
 */
export async function getProject(
	request: APIRequestContext,
	name: string,
): Promise<HiveProject> {
	return getDoc<HiveProject>(request, "Hive Project", name);
}

/**
 * List Hive Projects via API.
 */
export async function listProjects(
	request: APIRequestContext,
	options: {
		filters?: Record<string, unknown>;
		limit?: number;
	} = {},
): Promise<HiveProject[]> {
	return getList<HiveProject>(request, "Hive Project", {
		fields: ["name", "title", "status", "project_type", "client", "creation"],
		filters: options.filters,
		limit: options.limit,
	});
}

/**
 * Create a test Hive Task via API.
 */
export async function createTestTask(
	request: APIRequestContext,
	options: {
		title?: string;
		project: string;
		status?: string;
		priority?: string;
		size?: string;
	},
): Promise<HiveTask> {
	const title = options.title || `E2E Test Task ${Date.now()}`;

	return createDoc<HiveTask>(request, "Hive Task", {
		title,
		project: options.project,
		status: options.status ?? "Not Started",
		priority: options.priority,
		size: options.size,
	});
}

/**
 * Delete a test Hive Task via API.
 */
export async function deleteTestTask(
	request: APIRequestContext,
	name: string,
): Promise<void> {
	await deleteDoc(request, "Hive Task", name);
}

/**
 * List feature requests for a project via API.
 */
export async function listFeatureRequests(
	request: APIRequestContext,
	options: {
		filters?: Record<string, unknown>;
		limit?: number;
	} = {},
): Promise<HiveFeatureRequest[]> {
	return getList<HiveFeatureRequest>(request, "Hive Feature Request", {
		fields: ["name", "title", "project", "requested_by", "status", "priority", "creation"],
		filters: options.filters,
		limit: options.limit,
	});
}

/**
 * Delete a test feature request via API.
 */
export async function deleteTestFeatureRequest(
	request: APIRequestContext,
	name: string,
): Promise<void> {
	await deleteDoc(request, "Hive Feature Request", name);
}

/**
 * Cleanup test feature requests matching a title pattern.
 */
export async function cleanupTestFeatureRequests(
	request: APIRequestContext,
	titlePattern: string,
): Promise<void> {
	const requests = await listFeatureRequests(request, {
		filters: { title: ["like", `${titlePattern}%`] },
		limit: 100,
	});

	for (const req of requests) {
		try {
			await deleteTestFeatureRequest(request, req.name);
		} catch (error) {
			console.warn(`Failed to delete feature request ${req.name}:`, error);
		}
	}
}

/**
 * Cleanup test projects matching a title pattern.
 * Deletes linked tasks first to avoid LinkExistsError.
 */
export async function cleanupTestProjects(
	request: APIRequestContext,
	titlePattern = "E2E Test Project",
): Promise<void> {
	const projects = await listProjects(request, {
		filters: { title: ["like", `${titlePattern}%`] },
		limit: 100,
	});

	for (const project of projects) {
		try {
			// Delete linked tasks first to avoid LinkExistsError
			const tasks = await getList<HiveTask>(request, "Hive Task", {
				fields: ["name"],
				filters: { project: project.name },
				limit: 500,
			});
			for (const task of tasks) {
				try {
					await deleteDoc(request, "Hive Task", task.name);
				} catch (taskError) {
					console.warn(`Failed to delete task ${task.name}:`, taskError);
				}
			}
			await deleteTestProject(request, project.name);
		} catch (error) {
			console.warn(`Failed to delete ${project.name}:`, error);
		}
	}
}
