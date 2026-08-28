<template>
	<AppHeader>
		<template #left>
			<!-- The sidebar already says which project this is, so the header drops
			     the breadcrumb trail and leads with the project's own mark. For the
			     team the mark is the icon picker's trigger; a client just sees it. -->
			<ProjectIconPicker
				v-if="canEdit"
				:icon="project.icon"
				:color="project.color"
				@update:icon="emit('save', { icon: $event })"
				@update:color="emit('save', { color: $event })"
			>
				<button
					type="button"
					class="shrink-0 rounded-2 ring-outline-gray-3 hover:ring-2"
					aria-label="Project icon and color"
					data-testid="project-icon-trigger"
				>
					<ProjectAvatar
						:name="project.name"
						:icon="project.icon"
						:color="project.color"
						size="lg"
						hide-tooltip
					/>
				</button>
			</ProjectIconPicker>
			<ProjectAvatar
				v-else
				class="shrink-0"
				:name="project.name"
				:icon="project.icon"
				:color="project.color"
				size="lg"
				hide-tooltip
			/>

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
			<h1 v-else class="min-w-0 truncate text-lg font-semibold text-ink-gray-9">
				{{ project.title }}
			</h1>

			<!-- Status is the one attribute worth reading at a glance; type, client,
			     repo and links all moved behind the actions menu. -->
			<Dropdown v-if="canEdit" :options="statusOptions" align="start">
				<button type="button" class="shrink-0 rounded-full">
					<Badge
						:label="project.status"
						:theme="projectStatusTheme(project.status)"
						variant="subtle"
					/>
				</button>
			</Dropdown>
			<Badge
				v-else
				class="shrink-0"
				:label="project.status"
				:theme="projectStatusTheme(project.status)"
				variant="subtle"
			/>
		</template>

		<template #actions>
			<!-- One overlay for everything secondary. A plain Dropdown could not
			     hold the repo Combobox or the link list, so the actions menu is a
			     Popover panel of label/control rows. -->
			<Popover
				v-if="canEdit || links.length"
				v-model:open="detailsOpen"
				align="end"
				:offset="4"
			>
				<template #trigger>
					<Button variant="ghost" icon="lucide-ellipsis" aria-label="Project actions" />
				</template>
				<template #default>
					<div class="w-72 divide-y divide-outline-gray-1">
						<div v-if="canEdit" class="space-y-2 p-3">
							<div class="flex items-center justify-between gap-2">
								<p class="text-xs font-medium text-ink-gray-5">Type</p>
								<Dropdown :options="typeOptions" align="end">
									<button type="button" class="rounded-full">
										<Badge
											:label="typeLabel || 'Set type'"
											theme="gray"
											:variant="typeLabel ? 'outline' : 'ghost'"
										/>
									</button>
								</Dropdown>
							</div>
							<div class="flex items-center justify-between gap-2">
								<p class="text-xs font-medium text-ink-gray-5">Client</p>
								<Dropdown :options="clientOptions" align="end">
									<button type="button" class="rounded-full">
										<Badge
											:label="clientLabel || 'Set client'"
											theme="gray"
											:variant="clientLabel ? 'outline' : 'ghost'"
										/>
									</button>
								</Dropdown>
							</div>
						</div>

						<!-- Clients never see the repo: it is internal, like the
						     board's UAT column. -->
						<div v-if="canEdit" class="space-y-1.5 p-3">
							<p class="text-xs font-medium text-ink-gray-5">GitHub</p>
							<Combobox
								v-if="githubConnected"
								class="w-full"
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
							<a
								v-else-if="project.github_repo"
								class="inline-flex items-center gap-1 text-sm text-ink-gray-6 hover:text-ink-gray-8"
								:href="`https://github.com/${project.github_repo}`"
								target="_blank"
								rel="noopener noreferrer"
							>
								<span class="lucide-git-branch size-3.5" aria-hidden="true" />
								{{ project.github_repo }}
							</a>
							<p v-else class="text-sm text-ink-gray-5">Not connected</p>
						</div>

						<div class="space-y-1.5 p-3">
							<p class="text-xs font-medium text-ink-gray-5">Links</p>
							<div v-if="links.length" class="space-y-1">
								<a
									v-for="link in links"
									:key="link.name ?? link.url"
									class="flex items-center gap-1.5 text-sm text-ink-gray-6 hover:text-ink-gray-8"
									:href="link.url"
									target="_blank"
									rel="noopener noreferrer"
								>
									<span
										class="lucide-arrow-up-right size-3 shrink-0"
										aria-hidden="true"
									/>
									<span class="min-w-0 truncate">{{ link.title }}</span>
								</a>
							</div>
							<p v-else class="text-sm text-ink-gray-5">No links yet</p>
							<Button
								v-if="canEdit"
								variant="ghost"
								size="sm"
								:icon-left="links.length ? 'lucide-pencil' : 'lucide-link'"
								:label="links.length ? 'Manage links' : 'Add link'"
								@click="openLinks"
							/>
						</div>

						<div v-if="canEdit" class="p-1">
							<Button
								class="w-full justify-start"
								variant="ghost"
								theme="red"
								icon-left="lucide-archive"
								label="Archive project"
								@click="openArchive"
							/>
						</div>
					</div>
				</template>
			</Popover>

			<Button
				v-if="canEdit"
				variant="solid"
				theme="gray"
				icon-left="lucide-plus"
				label="Add Task"
				@click="emit('add-task')"
			>
				<template v-if="isDesktop" #suffix>
					<KeyboardShortcut combo="T" />
				</template>
			</Button>
		</template>
	</AppHeader>

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
	Popover,
	TextInput,
	toast,
	useCall,
	useList,
	type DropdownOptions,
} from 'frappe-ui'
import ProjectAvatar from '@/components/common/ProjectAvatar.vue'
import ProjectIconPicker from '@/components/common/ProjectIconPicker.vue'
import AppHeader from '@/components/shell/AppHeader.vue'
import ManageLinksDialog from '@/components/projects/ManageLinksDialog.vue'
import NewClientDialog from '@/components/projects/NewClientDialog.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
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

const { isDesktop } = useBreakpoint()
const { isClient } = useSession()
const canEdit = computed(() => !isClient.value)

const links = computed<HiveProjectLink[]>(() => props.project.links ?? [])

// -- breadcrumbs and inline title ----------------------------------------

/** The crumb that replaces the old back button. */
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

// Creating a client is another way of picking one, so it sits at the foot of
// the same menu rather than as a button of its own on the meta line.
const clientOptions = computed<DropdownOptions>(() => [
	{
		group: 'clients',
		hideLabel: true,
		options: [
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
		],
	},
	{
		group: 'new-client',
		hideLabel: true,
		options: [
			{
				label: 'New client',
				icon: 'lucide-plus',
				onClick: () => (newClientOpen.value = true),
			},
		],
	},
])

const newClientOpen = ref(false)

function selectNewClient(created: HiveClient) {
	clients.reload()
	emit('save', { client: created.name })
}

// -- details: GitHub and links -------------------------------------------

const detailsOpen = ref(false)

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

const linksOpen = ref(false)

/** The dialog and the popover would otherwise stack on top of each other. */
function openLinks() {
	detailsOpen.value = false
	linksOpen.value = true
}

function saveLinks(next: HiveProjectLink[]) {
	emit('save', { links: next.map((link) => ({ title: link.title, url: link.url })) })
}

// -- archive -------------------------------------------------------------

function openArchive() {
	detailsOpen.value = false
	archiveOpen.value = true
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
</script>
