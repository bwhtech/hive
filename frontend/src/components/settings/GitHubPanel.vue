<template>
	<SettingsHeader
		title="GitHub"
		description="Connect Hive to GitHub so a task can become an issue."
	/>
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
			<TextInput
				v-model="org"
				class="max-w-xs"
				placeholder="GitHub organisation (optional)"
				aria-label="GitHub organisation"
			/>
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

		<div v-else class="flex flex-col gap-6 pt-6">
			<section class="space-y-2">
				<Badge label="App configured" theme="green" variant="subtle" />
				<p v-if="publicLink">
					<a
						class="text-base text-ink-blue-link hover:underline"
						:href="publicLink"
						target="_blank"
						rel="noopener noreferrer"
					>
						View the app on GitHub
					</a>
				</p>
			</section>

			<section class="space-y-2 border-t border-outline-gray-1 pt-4">
				<h3 class="text-base font-semibold text-ink-gray-8">Installation</h3>
				<p class="text-sm text-ink-gray-5">
					Install the app on the account or organisation whose repositories you use.
				</p>

				<div v-if="status.data?.connected" class="flex items-center gap-2">
					<Badge label="Installed" theme="green" variant="subtle" />
					<span v-if="status.data.installed_account" class="text-sm text-ink-gray-6">
						on
						<span class="font-medium text-ink-gray-8">
							{{ status.data.installed_account }}
						</span>
					</span>
				</div>
				<div v-else class="space-y-2">
					<p class="text-sm text-ink-gray-5">Not installed yet.</p>
					<Button
						v-if="publicLink"
						label="Install GitHub App"
						icon-left="lucide-external-link"
						:link="`${publicLink}/installations/new`"
					/>
				</div>
			</section>
		</div>
	</SettingsBody>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	Badge,
	Button,
	SettingsBody,
	SettingsHeader,
	Skeleton,
	TextInput,
	toast,
	useCall,
	useDoc,
} from 'frappe-ui'

interface HiveSettingsDoc {
	name: string
	github_app_id: string | null
	github_app_public_link: string | null
}

interface GithubStatus {
	app_configured: boolean
	connected: boolean
	installed_account: string | null
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

const configured = computed(() => Boolean(settings.doc?.github_app_id))
const publicLink = computed(() => settings.doc?.github_app_public_link || '')

const org = ref('')
const submitting = ref(false)

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
