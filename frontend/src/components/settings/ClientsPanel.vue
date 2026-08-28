<template>
	<template v-if="!selected">
		<SettingsHeader title="Clients" description="The organisations you work with." />
		<SettingsBody>
			<div class="flex flex-col gap-4 pt-6">
				<div class="flex gap-2">
					<TextInput
						v-model="newClient"
						class="flex-1"
						placeholder="Company name…"
						aria-label="New client"
						@keydown.enter.prevent="addClient"
					/>
					<Button
						variant="solid"
						theme="gray"
						icon-left="lucide-plus"
						label="Add"
						:loading="adding"
						:disabled="!newClient.trim()"
						@click="addClient"
					/>
				</div>

				<div v-if="clients.loading && !clients.data" class="space-y-2">
					<Skeleton v-for="n in 3" :key="n" class="h-11 w-full" />
				</div>
				<ul
					v-else-if="clients.data?.length"
					class="divide-y divide-outline-gray-1 rounded-4 border border-outline-gray-1"
				>
					<li v-for="client in clients.data" :key="client.name">
						<button
							type="button"
							class="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-gray-1"
							@click="selected = client.name"
						>
							<span
								class="lucide-building-2 size-4 shrink-0 text-ink-gray-5"
								aria-hidden="true"
							/>
							<span class="min-w-0 flex-1 truncate text-sm text-ink-gray-8">
								{{ client.company_name }}
							</span>
							<Badge
								v-if="!client.is_active"
								label="Inactive"
								theme="gray"
								variant="subtle"
							/>
							<span
								class="lucide-chevron-right size-4 shrink-0 text-ink-gray-5"
								aria-hidden="true"
							/>
						</button>
					</li>
				</ul>
				<EmptyState
					v-else
					icon="lucide-building-2"
					title="No clients yet"
					description="Add a client organisation above."
				/>
			</div>
		</SettingsBody>
	</template>

	<template v-else>
		<SettingsHeader :title="selectedLabel" description="Members of this client organisation.">
			<template #actions>
				<Button
					icon-left="lucide-chevron-left"
					label="All clients"
					@click="selected = null"
				/>
			</template>
		</SettingsHeader>
		<SettingsBody>
			<div class="flex flex-col gap-8 pt-6">
				<section class="space-y-2">
					<h3 class="text-base font-semibold text-ink-gray-8">Invite a member</h3>
					<div class="flex gap-2">
						<TextInput
							v-model="inviteEmail"
							class="flex-1"
							type="email"
							placeholder="email@example.com"
							aria-label="Invitee email"
							@keydown.enter.prevent="invite"
						/>
						<Button
							variant="solid"
							theme="gray"
							icon-left="lucide-send"
							label="Invite"
							:loading="inviting"
							:disabled="!inviteEmail.trim()"
							@click="invite"
						/>
					</div>
					<p class="text-sm text-ink-gray-5">
						They are linked to this client as soon as they accept.
					</p>
				</section>

				<section v-if="assignable.length" class="space-y-2">
					<h3 class="text-base font-semibold text-ink-gray-8">Add an existing member</h3>
					<Select
						:model-value="''"
						:options="assignableOptions"
						aria-label="Assign a member"
						@update:model-value="assign(String($event))"
					/>
				</section>

				<section class="space-y-3">
					<h3 class="text-base font-semibold text-ink-gray-8">Client members</h3>
					<div v-if="allMembers.loading && !allMembers.data" class="space-y-2">
						<Skeleton v-for="n in 2" :key="n" class="h-12 w-full" />
					</div>
					<ul
						v-else-if="clientMembers.length"
						class="divide-y divide-outline-gray-1 rounded-4 border border-outline-gray-1"
					>
						<li
							v-for="member in clientMembers"
							:key="member.name"
							class="flex items-center gap-3 px-4 py-2.5"
						>
							<MemberAvatar
								:name="member.member_name || member.user"
								:image="member.user_image"
							/>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm text-ink-gray-8">
									{{ member.member_name || member.user }}
								</p>
								<p class="truncate text-xs text-ink-gray-5">{{ member.user }}</p>
							</div>
							<Button
								variant="ghost"
								icon="lucide-x"
								:aria-label="`Remove ${member.member_name || member.user}`"
								@click="remove(member)"
							/>
						</li>
					</ul>
					<EmptyState
						v-else
						icon="lucide-users"
						title="No members assigned"
						description="Invite someone, or assign an existing member above."
					/>
				</section>
			</div>
		</SettingsBody>
	</template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	Badge,
	Button,
	Select,
	SettingsBody,
	SettingsHeader,
	Skeleton,
	TextInput,
	toast,
	useCall,
	useDoctype,
	useList,
	useNewDoc,
} from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import type { HiveClient, HiveMember } from '@/types'

const clients = useList<HiveClient>({
	doctype: 'Hive Client',
	fields: ['name', 'company_name', 'is_active'],
	orderBy: 'creation asc',
	limit: 200,
})

const newClient = ref('')
const adding = ref(false)

async function addClient() {
	const companyName = newClient.value.trim()
	if (!companyName || adding.value) return
	adding.value = true
	try {
		await useNewDoc<HiveClient>('Hive Client', {
			company_name: companyName,
			is_active: 1,
		}).submit()
		newClient.value = ''
		clients.reload()
		toast.success(`Added "${companyName}"`)
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Could not add the client')
	} finally {
		adding.value = false
	}
}

// -- drill-in ------------------------------------------------------------

const selected = ref<string | null>(null)

const selectedLabel = computed(
	() =>
		clients.data?.find((client) => client.name === selected.value)?.company_name ??
		selected.value ??
		'',
)

// One list covers both halves of this view: the members already on the client
// and the ones that could be assigned to it.
const allMembers = useList<HiveMember>({
	doctype: 'Hive Member',
	fields: ['name', 'user', 'member_name', 'user_image', 'type', 'client', 'is_active'],
	filters: { is_active: 1 },
	orderBy: 'member_name asc',
	limit: 200,
})

const clientMembers = computed(() =>
	(allMembers.data ?? []).filter((member) => member.client === selected.value),
)

const assignable = computed(() =>
	(allMembers.data ?? []).filter((member) => member.client !== selected.value),
)

const assignableOptions = computed(() => [
	{ label: 'Select a member…', value: '' },
	...assignable.value.map((member) => ({
		label: member.member_name || member.user,
		value: member.name,
	})),
])

const memberDoctype = useDoctype<HiveMember>('Hive Member')

async function assign(name: string) {
	if (!name || !selected.value) return
	try {
		await memberDoctype.setValue.submit({ name, type: 'Client', client: selected.value })
		allMembers.reload()
		toast.success('Member assigned')
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Could not assign the member')
	}
}

async function remove(member: HiveMember) {
	try {
		await memberDoctype.setValue.submit({ name: member.name, client: '' })
		allMembers.reload()
		toast.success('Member removed from the client')
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Could not remove the member')
	}
}

const inviteClient = useCall<unknown, { email: string; client: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.invite_client_member',
	method: 'POST',
	immediate: false,
})

const inviteEmail = ref('')
const inviting = ref(false)

async function invite() {
	const address = inviteEmail.value.trim()
	if (!address || !selected.value || inviting.value) return
	inviting.value = true
	try {
		await inviteClient.submit({ email: address, client: selected.value })
		inviteEmail.value = ''
		toast.success(`Invitation sent to ${address}`)
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Could not send the invitation')
	} finally {
		inviting.value = false
	}
}
</script>
