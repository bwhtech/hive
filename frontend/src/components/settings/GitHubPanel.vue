<template>
	<SettingsHeader
		title="GitHub"
		description="Connect Hive to GitHub so a task can become an issue."
	>
		<template v-if="configured" #actions>
			<Badge label="App configured" theme="green" variant="subtle" />
			<Button
				v-if="publicLink"
				label="View app on GitHub"
				icon-right="lucide-external-link"
				:link="publicLink"
			/>
			<Dropdown :options="appActions" align="end">
				<Button variant="ghost" icon="lucide-ellipsis" aria-label="GitHub App actions" />
			</Dropdown>
		</template>
	</SettingsHeader>

	<SettingsBody>
		<div v-if="settings.loading && !settings.doc" class="space-y-3 pt-6">
			<Skeleton class="h-6 w-48 rounded-full" />
			<Skeleton class="h-4 w-72 rounded-full" />
			<Skeleton class="h-9 w-40 rounded-4" />
		</div>

		<div v-else-if="!configured" class="flex flex-col gap-3 pt-6">
			<p class="text-p-base text-ink-gray-6">
				Creating a GitHub App registers Hive with GitHub. You are taken to GitHub to confirm
				it, then back here.
			</p>
			<div class="space-y-1.5">
				<TextInput
					v-model="org"
					class="max-w-xs"
					placeholder="GitHub organisation (optional)"
					aria-label="GitHub organisation"
				/>
				<p class="text-sm text-ink-gray-5">
					Which account owns the app registration. Leave it blank to own it yourself —
					either way you choose the organisations to install it on afterwards.
				</p>
			</div>
			<div>
				<Button
					variant="solid"
					theme="gray"
					icon-left="lucide-git-branch"
					:label="submitting ? 'Opening GitHub…' : 'Create GitHub App'"
					:loading="submitting"
					@click="createApp"
				/>
			</div>
		</div>

		<section v-else class="flex flex-col gap-3 pt-6">
			<div class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					<h3 class="text-base font-semibold text-ink-gray-8">Installations</h3>
					<p class="text-sm text-ink-gray-5">
						Install the app on every account or organisation whose repositories you use.
					</p>
				</div>
				<Button
					v-if="publicLink"
					class="shrink-0"
					label="Add organisation"
					icon-left="lucide-plus"
					@click="install"
				/>
			</div>

			<div v-if="status.loading && !status.data" class="space-y-2">
				<Skeleton class="h-14 w-full rounded-4" />
				<Skeleton class="h-14 w-full rounded-4" />
			</div>

			<ul v-else-if="installations.length" class="divide-y divide-outline-gray-1">
				<li
					v-for="installation in installations"
					:key="installation.id"
					class="flex items-center gap-3 py-3"
				>
					<Avatar
						:image="installation.avatar_url ?? undefined"
						:label="installation.account ?? ''"
						size="lg"
						shape="square"
					/>
					<div class="min-w-0 flex-1">
						<p class="truncate text-base font-medium text-ink-gray-8">
							{{ installation.account }}
						</p>
						<p class="text-sm text-ink-gray-5">
							{{
								installation.account_type === 'Organization'
									? 'Organisation'
									: 'User'
							}}&nbsp;·&nbsp;{{ repoScopeLabel(installation) }}
						</p>
					</div>
					<Dropdown :options="installationActions(installation)" align="end">
						<Button
							variant="ghost"
							icon="lucide-ellipsis"
							:aria-label="`Actions for ${installation.account}`"
						/>
					</Dropdown>
				</li>
			</ul>

			<div v-else class="space-y-2 rounded-4 border border-dashed border-outline-gray-2 p-4">
				<p class="text-sm text-ink-gray-5">
					The app is not installed anywhere yet, so Hive cannot see any repositories.
				</p>
				<Button
					v-if="publicLink"
					variant="solid"
					theme="gray"
					label="Install GitHub App"
					icon-left="lucide-external-link"
					@click="install"
				/>
			</div>
		</section>

		<!-- Apps created before issue sync existed have no webhook pointing here,
		     and GitHub only exposes the URL and secret to the API — the event
		     subscription itself has to be ticked on github.com. -->
		<section v-if="configured && installations.length" class="flex flex-col gap-3 pt-8">
			<div class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					<h3 class="text-base font-semibold text-ink-gray-8">Issue sync</h3>
					<p class="text-sm text-ink-gray-5">
						Lets GitHub tell Hive when an issue is opened. Turn it on per project from
						the project's actions menu.
					</p>
				</div>
				<Badge
					v-if="issueSyncReady"
					class="shrink-0"
					label="Active"
					theme="green"
					variant="subtle"
				/>
			</div>

			<div v-if="syncStatus.loading && !syncStatus.data">
				<Skeleton class="h-9 w-40 rounded-4" />
			</div>

			<div v-else-if="!syncStatus.data?.webhook_ready">
				<Button
					variant="solid"
					theme="gray"
					icon-left="lucide-webhook"
					label="Set up webhook"
					:loading="settingUpSync"
					@click="enableIssueSync"
				/>
			</div>

			<div
				v-else-if="!syncStatus.data?.issue_events_subscribed"
				class="space-y-2 rounded-4 border border-dashed border-outline-gray-2 p-4"
			>
				<p class="text-sm text-ink-gray-6">
					The webhook is set up, but the app is not subscribed to issue events yet. GitHub
					only allows that to be changed on its own settings page: tick
					<span class="font-medium text-ink-gray-8">Issues</span> under
					<span class="font-medium text-ink-gray-8">Subscribe to events</span>, then come
					back and refresh.
				</p>
				<div class="flex gap-2">
					<Button
						v-if="syncStatus.data?.app_settings_url"
						label="Subscribe on GitHub"
						icon-right="lucide-external-link"
						:link="syncStatus.data.app_settings_url"
					/>
					<Button
						variant="ghost"
						label="Refresh"
						icon-left="lucide-refresh-cw"
						:loading="syncStatus.loading"
						@click="syncStatus.reload()"
					/>
				</div>
			</div>
		</section>
	</SettingsBody>

	<Dialog v-model:open="uninstallOpen" title="Uninstall from GitHub" size="sm">
		<template #default="{ close }">
			<p class="text-p-base text-ink-gray-7">
				Hive loses access to every repository owned by
				<span class="font-medium text-ink-gray-8">{{ uninstallTarget?.account }}</span>
			</p>
			<p class="pt-2 text-p-base text-ink-gray-6">
				Projects keep their repository link, but tasks can no longer be pushed as issues
				until the app is installed there again.
			</p>
			<div class="flex justify-end gap-2 pt-6">
				<Button label="Cancel" @click="close" />
				<Button
					variant="solid"
					theme="red"
					label="Uninstall"
					:loading="busy"
					@click="confirmUninstall"
				/>
			</div>
		</template>
	</Dialog>

	<Dialog v-model:open="disconnectOpen" title="Disconnect GitHub App" size="sm">
		<template #default="{ close }">
			<p class="text-p-base text-ink-gray-7">
				Hive forgets this app's credentials so you can create or connect a different one.
				The app itself stays on GitHub — delete it there if you no longer want it. Project
				repository links are kept.
			</p>
			<div class="flex justify-end gap-2 pt-6">
				<Button label="Cancel" @click="close" />
				<Button
					variant="solid"
					theme="red"
					label="Disconnect"
					:loading="busy"
					@click="confirmDisconnect"
				/>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
	Avatar,
	Badge,
	Button,
	Dialog,
	Dropdown,
	SettingsBody,
	SettingsHeader,
	Skeleton,
	TextInput,
	toast,
	useCall,
	useDoc,
} from 'frappe-ui'
import type { DropdownOptions } from 'frappe-ui'
import { useOverlays } from '@/composables/useOverlays'

const { settingsResult } = useOverlays()

interface HiveSettingsDoc {
	name: string
	github_app_id: string | null
	github_app_public_link: string | null
}

interface GithubInstallation {
	id: number
	account: string | null
	account_type: string | null
	avatar_url: string | null
	repository_selection: 'all' | 'selected' | null
	html_url: string | null
}

interface IssueSyncState {
	webhook_ready?: boolean
	issue_events_subscribed?: boolean
	app_settings_url?: string | null
}

interface GithubStatus {
	app_configured: boolean
	app_public_link: string | null
	connected: boolean
	installed_account: string | null
	installations: GithubInstallation[]
}

interface SettingsDocMethods {
	manifest: () => void
}

const settings = useDoc<HiveSettingsDoc, SettingsDocMethods>({
	doctype: 'Hive Settings',
	name: 'Hive Settings',
	methods: { manifest: 'get_github_app_manifest' },
})

const status = useCall<GithubStatus>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.status',
	method: 'GET',
	cacheKey: 'github-status',
})

const uninstallCall = useCall<{ uninstalled: boolean }, { installation_id: number }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.uninstall',
	method: 'POST',
	immediate: false,
})

const disconnectCall = useCall<{ disconnected: boolean }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.disconnect_app',
	method: 'POST',
	immediate: false,
})

const syncStatus = useCall<IssueSyncState>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.issue_sync_status',
	method: 'GET',
	cacheKey: 'github-issue-sync-status',
	immediate: false,
})

const setupSyncCall = useCall<IssueSyncState>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.setup_issue_sync',
	method: 'POST',
	immediate: false,
})

const settingUpSync = ref(false)

const issueSyncReady = computed(
	() =>
		Boolean(syncStatus.data?.webhook_ready) &&
		Boolean(syncStatus.data?.issue_events_subscribed),
)

async function enableIssueSync() {
	settingUpSync.value = true
	try {
		const state = await setupSyncCall.submit()
		await syncStatus.reload()
		if (state?.issue_events_subscribed) toast.success('Issue sync is on')
		else toast.success('Webhook set up — one step left on GitHub')
	} catch (error) {
		toast.error((error as Error).message || 'Could not set up the webhook')
	} finally {
		settingUpSync.value = false
	}
}

const configured = computed(() => Boolean(settings.doc?.github_app_id))
const publicLink = computed(() => settings.doc?.github_app_public_link || '')
const installations = computed(() => status.data?.installations ?? [])

// Asking GitHub about the webhook is only meaningful once the app is installed
// somewhere, and it costs two round-trips, so it waits for that.
watch(
	() => installations.value.length > 0,
	(installed) => installed && syncStatus.reload(),
	{ immediate: true },
)

/**
 * Report the round-trip to github.com. `AppShell` reopens this panel from
 * `?settings=github` and hands over what happened while the user was away. The
 * page has just reloaded, so the panel's own fetches are already current —
 * there is nothing to refresh, only something to say.
 */
onMounted(() => {
	const result = settingsResult.value
	settingsResult.value = null

	if (result === 'connected') toast.success('GitHub App connected')
	else if (result === 'installed') toast.success('GitHub App installed')
	else if (result === 'error') toast.error('Could not create the GitHub App. Please try again.')
})

const org = ref('')
const submitting = ref(false)
const busy = ref(false)
const uninstallTarget = ref<GithubInstallation | null>(null)
const uninstallOpen = computed({
	get: () => uninstallTarget.value !== null,
	set: (open: boolean) => {
		if (!open) uninstallTarget.value = null
	},
})
const disconnectOpen = ref(false)

/**
 * GitHub's install page, in this tab. It offers an account picker (the app is
 * registered public precisely so it does), and hands the browser back to
 * `/github/authorize`, which redirects into this panel. A new tab would strand
 * that return trip away from the tab the user was working in.
 */
function install() {
	if (publicLink.value) window.location.href = `${publicLink.value}/installations/new`
}

function errorMessage(error: unknown, fallback: string) {
	const message = error instanceof Error ? error.message : ''
	return message || fallback
}

function repoScopeLabel(installation: GithubInstallation) {
	return installation.repository_selection === 'all'
		? 'All repositories'
		: 'Selected repositories'
}

const appActions = computed<DropdownOptions>(() => [
	{
		label: 'Add organisation',
		icon: 'lucide-plus',
		condition: () => Boolean(publicLink.value),
		onClick: () => install(),
	},
	{
		label: 'Refresh',
		icon: 'lucide-refresh-cw',
		onClick: () => status.reload(),
	},
	{
		label: 'Disconnect GitHub App',
		icon: 'lucide-unlink',
		theme: 'red',
		onClick: () => (disconnectOpen.value = true),
	},
])

function installationActions(installation: GithubInstallation): DropdownOptions {
	return [
		{
			label: 'Configure repositories',
			icon: 'lucide-settings',
			condition: () => Boolean(installation.html_url),
			onClick: () => window.open(installation.html_url as string, '_blank'),
		},
		{
			label: 'Uninstall',
			icon: 'lucide-trash-2',
			theme: 'red',
			onClick: () => (uninstallTarget.value = installation),
		},
	]
}

async function confirmUninstall() {
	const installation = uninstallTarget.value
	if (!installation || busy.value) return
	busy.value = true
	await uninstallCall.submit({ installation_id: installation.id })
	busy.value = false

	// useCall.submit() resolves on an API error too, so the error ref is what
	// actually tells the two apart.
	if (uninstallCall.error) {
		toast.error(errorMessage(uninstallCall.error, 'Could not uninstall the app'))
		return
	}

	toast.success(`Uninstalled from ${installation.account}`)
	uninstallTarget.value = null
	status.reload()
}

async function confirmDisconnect() {
	if (busy.value) return
	busy.value = true
	await disconnectCall.submit()
	busy.value = false

	if (disconnectCall.error) {
		toast.error(errorMessage(disconnectCall.error, 'Could not disconnect the app'))
		return
	}

	toast.success('GitHub App disconnected')
	disconnectOpen.value = false
	settings.reload()
	status.reload()
}

/**
 * GitHub's app-manifest flow only accepts a real form POST, so this builds one
 * and submits it. The page navigates away; there is nothing to clean up.
 */
async function createApp() {
	if (submitting.value) return
	submitting.value = true
	let manifest: unknown
	try {
		manifest = await settings.manifest.submit()
	} catch {
		toast.error('Could not generate the GitHub App manifest')
		submitting.value = false
		return
	}

	const organisation = org.value.trim()
	const form = document.createElement('form')
	form.method = 'POST'
	form.action = organisation
		? `https://github.com/organizations/${organisation}/settings/apps/new`
		: 'https://github.com/settings/apps/new'

	const input = document.createElement('input')
	input.type = 'hidden'
	input.name = 'manifest'
	input.value = JSON.stringify(manifest)
	form.appendChild(input)

	document.body.appendChild(form)
	form.submit()
}
</script>
