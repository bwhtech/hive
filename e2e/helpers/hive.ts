import { APIRequestContext } from "@playwright/test";
import {
	createDoc,
	deleteDoc,
	getDoc,
	getList,
	updateDoc,
	callMethod,
} from "./frappe";

/**
 * Hive View document interface.
 */
export interface HiveView {
	name: string;
	label: string;
	view_type: "list" | "kanban";
	filters_json: string;
	is_public: 0 | 1;
	owner: string;
	creation?: string;
	modified?: string;
}

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
	slug?: string;
	status: string;
	project_type?: string;
	client?: string;
	is_private?: 0 | 1;
	is_archived?: 0 | 1;
	owner?: string;
	creation?: string;
	modified?: string;
}

/**
 * Hive Milestone document interface.
 */
export interface HiveMilestone {
	name: string;
	title: string;
	project: string;
	status: string;
	target_date?: string | null;
	description?: string;
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
		is_private?: 0 | 1;
	} = {},
): Promise<HiveProject> {
	const title = options.title || generateProjectTitle();

	return createDoc<HiveProject>(request, "Hive Project", {
		title,
		status: options.status ?? "Open",
		project_type: options.project_type,
		client: options.client,
		is_private: options.is_private ?? 0,
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
		fields: [
			"name",
			"title",
			"slug",
			"status",
			"project_type",
			"client",
			"is_private",
			"owner",
			"creation",
		],
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
		status: options.status ?? "To Do",
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
		fields: [
			"name",
			"title",
			"project",
			"requested_by",
			"status",
			"priority",
			"creation",
		],
		filters: options.filters,
		limit: options.limit,
	});
}

/**
 * Create a test Hive Feature Request via API.
 */
export async function createTestFeatureRequest(
	request: APIRequestContext,
	options: {
		title?: string;
		project: string;
		priority?: string;
		description?: string;
	},
): Promise<HiveFeatureRequest> {
	const title = options.title || `E2E Test FR ${Date.now()}`;

	return createDoc<HiveFeatureRequest>(request, "Hive Feature Request", {
		title,
		project: options.project,
		priority: options.priority ?? "Nice to Have",
		description: options.description,
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
 * Create a test Hive Milestone via API.
 */
export async function createTestMilestone(
	request: APIRequestContext,
	options: {
		title?: string;
		project: string;
		status?: string;
		target_date?: string | null;
		description?: string;
	},
): Promise<HiveMilestone> {
	const title = options.title || `E2E Test Milestone ${Date.now()}`;

	return createDoc<HiveMilestone>(request, "Hive Milestone", {
		title,
		project: options.project,
		status: options.status ?? "Upcoming",
		target_date: options.target_date ?? null,
		description: options.description,
	});
}

/**
 * Delete a test Hive Milestone via API.
 */
export async function deleteTestMilestone(
	request: APIRequestContext,
	name: string,
): Promise<void> {
	await deleteDoc(request, "Hive Milestone", name);
}

/**
 * Cleanup test milestones matching a title pattern.
 * Unlinks tasks first, then deletes the milestones.
 */
export async function cleanupTestMilestones(
	request: APIRequestContext,
	titlePattern = "E2E Test Milestone",
): Promise<void> {
	const milestones = await getList<HiveMilestone>(request, "Hive Milestone", {
		fields: ["name"],
		filters: { title: ["like", `${titlePattern}%`] },
		limit: 100,
	});

	for (const ms of milestones) {
		// Unlink tasks referencing this milestone before deleting
		const tasks = await getList<HiveTask>(request, "Hive Task", {
			fields: ["name"],
			filters: { milestone: ms.name },
			limit: 500,
		});
		for (const task of tasks) {
			try {
				await updateDoc(request, "Hive Task", task.name, {
					milestone: null,
				});
			} catch (e) {
				console.warn(`Failed to unlink task ${task.name} from milestone:`, e);
			}
		}
		try {
			await deleteDoc(request, "Hive Milestone", ms.name);
		} catch (error) {
			console.warn(`Failed to delete milestone ${ms.name}:`, error);
		}
	}
}

/**
 * Hive Project Update document interface.
 */
export interface HiveProjectUpdate {
	name: string;
	project: string;
	posted_by: string;
	content: string;
	is_draft: 0 | 1;
	creation?: string;
	modified?: string;
}

/**
 * Create a test Hive Project Update via API.
 */
export async function createTestUpdate(
	request: APIRequestContext,
	options: {
		project: string;
		content?: string;
		is_draft?: 0 | 1;
	},
): Promise<HiveProjectUpdate> {
	const content = options.content || `<p>E2E test update ${Date.now()}</p>`;

	return createDoc<HiveProjectUpdate>(request, "Hive Project Update", {
		project: options.project,
		content,
		is_draft: options.is_draft ?? 0,
	});
}

/**
 * Delete a test Hive Project Update via API.
 */
export async function deleteTestUpdate(
	request: APIRequestContext,
	name: string,
): Promise<void> {
	await deleteDoc(request, "Hive Project Update", name);
}

/**
 * Publish a draft update via API.
 */
export async function publishUpdate(
	request: APIRequestContext,
	updateName: string,
): Promise<void> {
	await callMethod(request, "bwh_hive.bwh_hive.api.publish_update", {
		update_name: updateName,
	});
}

/**
 * Cleanup test updates for a given project.
 */
export async function cleanupTestUpdates(
	request: APIRequestContext,
	projectName: string,
): Promise<void> {
	const updates = await getList<HiveProjectUpdate>(
		request,
		"Hive Project Update",
		{
			fields: ["name"],
			filters: { project: projectName },
			limit: 100,
		},
	);

	for (const update of updates) {
		try {
			await deleteDoc(request, "Hive Project Update", update.name);
		} catch (error) {
			console.warn(`Failed to delete update ${update.name}:`, error);
		}
	}
}

/**
 * Create a test Hive View via API.
 */
export async function createTestView(
	request: APIRequestContext,
	options: {
		label?: string;
		view_type?: "list" | "kanban";
		filters_json?: string;
		is_public?: 0 | 1;
	} = {},
): Promise<HiveView> {
	const label = options.label || `E2E Test View ${Date.now()}`;

	return createDoc<HiveView>(request, "Hive View", {
		label,
		view_type: options.view_type ?? "list",
		filters_json: options.filters_json ?? "{}",
		is_public: options.is_public ?? 0,
	});
}

/**
 * Delete a test Hive View via API.
 */
export async function deleteTestView(
	request: APIRequestContext,
	name: string,
): Promise<void> {
	await deleteDoc(request, "Hive View", name);
}

/**
 * Cleanup test views matching a label pattern.
 */
export async function cleanupTestViews(
	request: APIRequestContext,
	labelPattern = "E2E Test View",
): Promise<void> {
	const views = await getList<HiveView>(request, "Hive View", {
		fields: ["name"],
		filters: { label: ["like", `${labelPattern}%`] },
		limit: 100,
	});

	for (const view of views) {
		try {
			await deleteDoc(request, "Hive View", view.name);
		} catch (error) {
			console.warn(`Failed to delete view ${view.name}:`, error);
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
