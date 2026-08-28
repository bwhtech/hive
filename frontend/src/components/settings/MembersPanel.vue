<template>
	<SettingsHeader title="Members" description="Who can sign in to this workspace." />
	<SettingsBody>
		<div class="flex flex-col gap-8 pt-6">
			<!-- `get_pending_invitations` throws for anyone who cannot invite, which
			     is how we know whether to offer the form at all. -->
			<section v-if="canInvite" class="space-y-3">
				<h3 class="text-base font-semibold text-ink-gray-8">Invite a member</h3>
				<div class="flex flex-wrap items-end gap-2">
					<TextInput
						v-model="email"
						class="min-w-48 flex-1"
						type="email"
						placeholder="email@example.com"
						aria-label="Invitee email"
						@keydown.enter.prevent="invite"
					/>
					<Select v-model="role" class="w-32" :options="ROLE_OPTIONS" aria-label="Role" />
					<LinkPicker
						v-if="role === CLIENT_ROLE"
						v-model="client"
						class="w-48"
						doctype="Hive Client"
						placeholder="Select client"
						:filters="{ is_active: 1 }"
					/>
					<Button
						variant="solid"
						theme="gray"
						icon-left="lucide-send"
						label="Invite"
						:loading="inviting"
						:disabled="!email.trim() || (role === CLIENT_ROLE && !client)"
						@click="invite"
					/>
				</div>
			</section>

			<section v-if="pending.length" class="space-y-3">
				<h3 class="text-base font-semibold text-ink-gray-8">Pending invitations</h3>
				<ul class="divide-y divide-outline-gray-1 rounded-5 border border-outline-gray-1">
					<li
						v-for="invite_ in pending"
						:key="invite_.name"
						class="flex items-center gap-3 px-4 py-2.5"
					>
						<Avatar size="sm" :label="invite_.email" />
						<span class="min-w-0 flex-1 truncate text-sm text-ink-gray-8">
							{{ invite_.email }}
						</span>
						<Badge label="Pending" theme="amber" variant="subtle" />
						<Button
							variant="ghost"
							icon="lucide-x"
							:aria-label="`Cancel invitation to ${invite_.email}`"
							@click="cancel(invite_)"
						/>
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<div class="flex items-center justify-between gap-2">
					<h3 class="text-base font-semibold text-ink-gray-8">
						{{ filtered.length }} {{ filtered.length === 1 ? 'member' : 'members' }}
					</h3>
					<Select
						v-model="typeFilter"
						class="w-32"
						size="sm"
						:options="TYPE_OPTIONS"
						aria-label="Filter by member type"
					/>
				</div>

				<div v-if="members.loading && !members.data" class="space-y-2">
					<Skeleton v-for="n in 3" :key="n" class="h-12 w-full rounded-5" />
				</div>
				<ul
					v-else-if="filtered.length"
					class="divide-y divide-outline-gray-1 rounded-5 border border-outline-gray-1"
				>
					<li
						v-for="member in filtered"
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
							<p class="truncate text-xs text-ink-gray-5">
								{{ memberMeta(member) }}
							</p>
						</div>
						<Badge :label="member.type" theme="gray" variant="subtle" />
					</li>
				</ul>
				<EmptyState
					v-else
					icon="lucide-users"
					title="No members found"
					:description="
						typeFilter === 'all'
							? 'Invite someone to get started.'
							: 'Try a different filter.'
					"
				/>
			</section>
		</div>
	</SettingsBody>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
	Avatar,
	Badge,
	Button,
	Select,
	SettingsBody,
	SettingsHeader,
	Skeleton,
	TextInput,
	toast,
	useCall,
	useList,
} from 'frappe-ui'
import EmptyState from '@/components/common/EmptyState.vue'
import LinkPicker from '@/components/common/LinkPicker.vue'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import type { HiveMember } from '@/types'

interface PendingInvitation {
	name: string
	email: string
}

const APP_NAME = 'bwh_hive'
const CLIENT_ROLE = 'Hive Client'

const ROLE_OPTIONS = [
	{ label: 'Team', value: 'Hive Team' },
	{ label: 'Client', value: CLIENT_ROLE },
]

const TYPE_OPTIONS = [
	{ label: 'All', value: 'all' },
	{ label: 'Team', value: 'Team' },
	{ label: 'Client', value: 'Client' },
]

const members = useList<HiveMember>({
	doctype: 'Hive Member',
	fields: ['name', 'user', 'member_name', 'user_image', 'type', 'designation', 'is_active'],
	filters: { is_active: 1 },
	orderBy: 'creation asc',
	limit: 200,
})

const typeFilter = ref('all')

const filtered = computed(() =>
	(members.data ?? []).filter(
		(member) => typeFilter.value === 'all' || member.type === typeFilter.value,
	),
)

/** `email · designation`, skipping the half that is missing. */
function memberMeta(member: HiveMember): string {
	return [member.user, member.designation].filter(Boolean).join(' · ')
}

const invitations = useCall<PendingInvitation[], { app_name: string }>({
	url: '/api/v2/method/frappe.core.api.user_invitation.get_pending_invitations',
	method: 'GET',
	params: { app_name: APP_NAME },
})

const pending = computed(() => invitations.data ?? [])
const canInvite = computed(() => !invitations.error)

const inviteTeam = useCall<unknown, { email: string; role: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.invite_member',
	method: 'POST',
	immediate: false,
})

const inviteClient = useCall<unknown, { email: string; client: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.invite_client_member',
	method: 'POST',
	immediate: false,
})

const cancelInvitation = useCall<unknown, { name: string; app_name: string }>({
	url: '/api/v2/method/frappe.core.api.user_invitation.cancel_invitation',
	method: 'POST',
	immediate: false,
})

const email = ref('')
const role = ref('Hive Team')
const client = ref<string | null>(null)
const inviting = ref(false)

watch(role, (value) => {
	if (value !== CLIENT_ROLE) client.value = null
})

async function invite() {
	const address = email.value.trim()
	if (!address || inviting.value) return
	if (role.value === CLIENT_ROLE && !client.value) return

	inviting.value = true
	try {
		if (role.value === CLIENT_ROLE) {
			await inviteClient.submit({ email: address, client: client.value as string })
		} else {
			await inviteTeam.submit({ email: address, role: role.value })
		}
		email.value = ''
		client.value = null
		invitations.reload()
		members.reload()
		toast.success(`Invitation sent to ${address}`)
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Could not send the invitation')
	} finally {
		inviting.value = false
	}
}

async function cancel(invitation: PendingInvitation) {
	try {
		await cancelInvitation.submit({ name: invitation.name, app_name: APP_NAME })
		invitations.reload()
		toast.success(`Invitation to ${invitation.email} cancelled`)
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Could not cancel the invitation')
	}
}
</script>
