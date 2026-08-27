<template>
	<AppHeader>
		<template #left>
			<PageHeaderBackButton to="/projects" label="" />

			<TextInput
				v-if="editingTitle"
				v-model="titleDraft"
				class="min-w-0 flex-1"
				aria-label="Project title"
				autofocus
				@keydown.enter.prevent="commitTitle"
				@keydown.esc.prevent="editingTitle = false"
				@blur="commitTitle"
			/>
			<button
				v-else-if="canEdit"
				type="button"
				class="min-w-0 truncate rounded-2 px-1 text-lg font-semibold text-ink-gray-9 hover:bg-surface-gray-2"
				title="Rename project"
				@click="startTitleEdit"
			>
				{{ project.title }}
			</button>
			<span v-else class="min-w-0 truncate text-lg font-semibold text-ink-gray-9">
				{{ project.title }}
			</span>
		</template>

		<template #actions>
			<Dropdown v-if="canEdit" :options="menu" align="end">
				<Button variant="ghost" icon="lucide-ellipsis" aria-label="Project actions" />
			</Dropdown>
			<Button
				v-if="canEdit"
				variant="solid"
				theme="gray"
				icon-left="lucide-plus"
				label="Add Task"
				@click="emit('add-task')"
			>
				<template #suffix>
					<KeyboardShortcut combo="T" />
				</template>
			</Button>
		</template>
	</AppHeader>

	<!-- Meta row: the pills that describe the project, each one editable in place. -->
	<div class="flex flex-wrap items-center gap-2 border-b border-outline-gray-1 px-3 py-2 sm:px-5">
		<Dropdown v-if="canEdit" :options="statusOptions" align="start">
			<button type="button" class="rounded-full">
				<Badge
					:label="project.status"
					:theme="projectStatusTheme(project.status)"
					variant="subtle"
				/>
			</button>
		</Dropdown>
		<Badge
			v-else
			:label="project.status"
			:theme="projectStatusTheme(project.status)"
			variant="subtle"
		/>

		<Dropdown v-if="canEdit" :options="typeOptions" align="start">
			<button type="button" class="rounded-full">
				<Badge
					:label="typeLabel || 'Set type'"
					theme="gray"
					:variant="typeLabel ? 'outline' : 'ghost'"
				/>
			</button>
		</Dropdown>
		<Badge v-else-if="typeLabel" :label="typeLabel" theme="gray" variant="outline" />

		<div class="flex items-center gap-1">
			<Dropdown v-if="canEdit" :options="clientOptions" align="start">
				<button type="button" class="rounded-full">
					<Badge
						:label="clientLabel || 'Set client'"
						theme="gray"
						:variant="clientLabel ? 'outline' : 'ghost'"
					/>
				</button>
			</Dropdown>
			<Badge v-else-if="clientLabel" :label="clientLabel" theme="gray" variant="outline" />
			<Button
				v-if="canEdit"
				variant="ghost"
				size="sm"
				icon="lucide-plus"
				tooltip="New client"
				aria-label="New client"
				@click="newClientOpen = true"
			/>
		</div>

		<Combobox
			v-if="canEdit && githubConnected"
			class="w-52"
			:model-value="project.github_repo"
			:options="repoOptions"
			:loading="repos.loading"
			placeholder="Link repo"
			empty-text="No repositories found"
			trigger="button"
			size="sm"
			aria-label="GitHub repository"
			@update:model-value="setRepo($event as string | null)"
		/>
		<!-- Clients never see the repo: it is internal, like the board's UAT column. -->
		<a
			v-else-if="canEdit && project.github_repo"
			class="inline-flex items-center gap-1 text-sm text-ink-gray-6 hover:text-ink-gray-8"
			:href="`https://github.com/${project.github_repo}`"
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="lucide-git-branch size-3.5" aria-hidden="true" />
			{{ project.github_repo }}
		</a>

		<span
			v-if="links.length || canEdit"
			class="h-4 w-px bg-outline-gray-1"
			aria-hidden="true"
		/>

		<a
			v-for="link in links"
			:key="link.name ?? link.url"
			class="inline-flex items-center gap-1 rounded-full border border-outline-gray-1 px-2 py-0.5 text-xs text-ink-gray-6 hover:text-ink-gray-8"
			:href="link.url"
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="lucide-arrow-up-right size-3" aria-hidden="true" />
			{{ link.title }}
		</a>
		<Button
			v-if="canEdit"
			variant="ghost"
			size="sm"
			:icon-left="links.length ? 'lucide-pencil' : 'lucide-link'"
			:label="links.length ? 'Manage' : 'Add link'"
			@click="linksOpen = true"
		/>
	</div>

	<NewClientDialog v-model:open="newClientOpen" @created="selectNewClient" />

	<ManageLinksDialog v-model:open="linksOpen" :links="links" @save="saveLinks" />

	<!-- Archiving hides a whole project, so it asks for the title back first. -->
	<Dialog v-model:open="archiveOpen" title="Archive project">
		<template #default>
			<div class="space-y-4">
				<p class="text-p-base text-ink-gray-7">
					This hides the project and everything in it. Type
					<span class="font-medium text-ink-gray-8">{{ project.title }}</span>
					to confirm.
				</p>
				<TextInput
					v-model="archiveConfirm"
					placeholder="Type the project title"
					aria-label="Confirm project title"
					autofocus
				/>
				<div class="flex justify-end gap-2">
					<Button label="Cancel" @click="archiveOpen = false" />
					<Button
						variant="solid"
						theme="red"
						label="Archive"
						:disabled="archiveConfirm.trim() !== project.title"
						@click="confirmArchive"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
	Badge,
	Button,
	Combobox,
	Dialog,
	Dropdown,
	KeyboardShortcut,
	PageHeaderBackButton,
	TextInput,
	toast,
	useCall,
	useList,
	type DropdownOptions,
} from 'frappe-ui'
import AppHeader from '@/components/shell/AppHeader.vue'
import ManageLinksDialog from '@/components/projects/ManageLinksDialog.vue'
import NewClientDialog from '@/components/projects/NewClientDialog.vue'
import { useSession } from '@/composables/useSession'
import { projectStatusTheme } from '@/lib/status'
import {
	PROJECT_STATUSES,
	type HiveClient,
	type HiveProject,
	type HiveProjectLink,
	type ProjectStatus,
} from '@/types'

const props = defineProps<{ project: HiveProject }>()

const emit = defineEmits<{
	/** A field the header owns changed; the page writes it and reloads. */
	save: [patch: Partial<HiveProject>]
	/** The typed-title confirmation passed. */
	archive: []
	'add-task': []
}>()

const { isClient } = useSession()
const canEdit = computed(() => !isClient.value)

const links = computed<HiveProjectLink[]>(() => props.project.links ?? [])

// -- inline title --------------------------------------------------------

const editingTitle = ref(false)
const titleDraft = ref('')

function startTitleEdit() {
	titleDraft.value = props.project.title
	editingTitle.value = true
}

function commitTitle() {
	if (!editingTitle.value) return
	editingTitle.value = false
	const title = titleDraft.value.trim()
	if (!title || title === props.project.title) return
	emit('save', { title })
}

// -- pills ---------------------------------------------------------------

const projectTypes = useList<{ name: string; type_name: string }>({
	doctype: 'Hive Project Type',
	fields: ['name', 'type_name'],
	filters: { is_archived: 0 },
	orderBy: 'type_name asc',
	limit: 50,
	cacheKey: 'hive-project-types',
})

const clients = useList<Pick<HiveClient, 'name' | 'company_name'>>({
	doctype: 'Hive Client',
	fields: ['name', 'company_name'],
	filters: { is_active: 1 },
	orderBy: 'company_name asc',
	limit: 100,
	cacheKey: 'hive-active-clients',
})

const typeLabel = computed(() => {
	const type = props.project.project_type
	if (!type) return ''
	return projectTypes.data?.find((row) => row.name === type)?.type_name ?? type
})

const clientLabel = computed(() => {
	const client = props.project.client
	if (!client) return ''
	return clients.data?.find((row) => row.name === client)?.company_name ?? client
})

const statusOptions = computed<DropdownOptions>(() =>
	PROJECT_STATUSES.map((status) => ({
		label: status,
		selected: status === props.project.status,
		onClick: () => emit('save', { status: status as ProjectStatus }),
	})),
)

const typeOptions = computed<DropdownOptions>(() => [
	{
		label: 'No type',
		selected: !props.project.project_type,
		onClick: () => emit('save', { project_type: '' }),
	},
	...(projectTypes.data ?? []).map((row) => ({
		label: row.type_name,
		selected: row.name === props.project.project_type,
		onClick: () => emit('save', { project_type: row.name }),
	})),
])

const clientOptions = computed<DropdownOptions>(() => [
	{
		label: 'No client',
		selected: !props.project.client,
		onClick: () => emit('save', { client: '' }),
	},
	...(clients.data ?? []).map((row) => ({
		label: row.company_name,
		selected: row.name === props.project.client,
		onClick: () => emit('save', { client: row.name }),
	})),
])

const newClientOpen = ref(false)

function selectNewClient(created: HiveClient) {
	clients.reload()
	emit('save', { client: created.name })
}

// -- GitHub --------------------------------------------------------------

const ghStatus = useCall<{ app_configured: boolean; connected: boolean }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.status',
	method: 'GET',
	cacheKey: 'github-status',
	immediate: false,
})

const repos = useCall<{ full_name: string; private: boolean }[]>({
	url: '/api/v2/method/bwh_hive.bwh_hive.github.get_repos',
	method: 'GET',
	cacheKey: 'github-repos',
	immediate: false,
})

const githubConnected = computed(() => Boolean(ghStatus.data?.connected))

watch(canEdit, (allowed) => allowed && ghStatus.reload(), { immediate: true })
watch(githubConnected, (connected) => connected && repos.reload())

const repoOptions = computed(() =>
	(repos.data ?? []).map((repo) => ({ label: repo.full_name, value: repo.full_name })),
)

function setRepo(value: string | null) {
	const repo = value ? String(value) : null
	emit('save', { github_repo: repo })
	toast.success(repo ? 'GitHub repo linked' : 'GitHub repo unlinked')
}

// -- links and archive ---------------------------------------------------

const linksOpen = ref(false)

function saveLinks(next: HiveProjectLink[]) {
	emit('save', { links: next.map((link) => ({ title: link.title, url: link.url })) })
}

const archiveOpen = ref(false)
const archiveConfirm = ref('')

watch(archiveOpen, (open) => {
	if (!open) archiveConfirm.value = ''
})

function confirmArchive() {
	archiveOpen.value = false
	emit('archive')
}

const menu = computed<DropdownOptions>(() => [
	{ label: 'Manage links', icon: 'lucide-link', onClick: () => (linksOpen.value = true) },
	{
		label: 'Archive project',
		icon: 'lucide-archive',
		theme: 'red',
		onClick: () => (archiveOpen.value = true),
	},
])
</script>
