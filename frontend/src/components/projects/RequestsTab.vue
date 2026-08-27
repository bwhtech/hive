<template>
	<div class="space-y-4 pb-10">
		<div class="flex items-center justify-between gap-2">
			<h3 class="text-sm text-ink-gray-5">
				{{ requests.length }} {{ requests.length === 1 ? 'request' : 'requests' }}
			</h3>
			<Button
				variant="solid"
				theme="gray"
				label="New request"
				icon-left="lucide-plus"
				@click="createOpen = true"
			/>
		</div>

		<LoadingText v-if="list.loading && !list.data" />

		<EmptyState
			v-else-if="!requests.length"
			title="No feature requests yet"
			description="Submit a request to suggest an improvement."
			icon="lucide-lightbulb"
		>
			<template #action>
				<Button label="New request" icon-left="lucide-plus" @click="createOpen = true" />
			</template>
		</EmptyState>

		<List
			v-else
			:columns="COLUMNS"
			:row-height="52"
			class="max-md:[--list-columns:minmax(0,1fr)_7rem_8rem_2.5rem] max-sm:[--list-columns:minmax(0,1fr)_7rem_2.5rem]"
		>
			<ListHeader>
				<ListHeaderCell>Title</ListHeaderCell>
				<ListHeaderCell>Status</ListHeaderCell>
				<ListHeaderCell class="max-sm:hidden">Priority</ListHeaderCell>
				<ListHeaderCell class="max-md:hidden">Requested by</ListHeaderCell>
				<ListHeaderCell class="max-md:hidden">Date</ListHeaderCell>
				<ListHeaderCell><span class="sr-only">Actions</span></ListHeaderCell>
			</ListHeader>

			<ListRow v-for="request in requests" :key="request.name" :value="request.name">
				<ListCell>
					<div class="min-w-0">
						<p class="truncate text-base text-ink-gray-8">{{ request.title }}</p>
						<p v-if="request.description" class="truncate text-xs text-ink-gray-5">
							{{ summary(request.description) }}
						</p>
					</div>
				</ListCell>
				<ListCell>
					<Badge
						:label="request.status"
						:theme="featureRequestStatusTheme(request.status)"
						variant="subtle"
					/>
				</ListCell>
				<ListCell class="max-sm:hidden">
					<Badge
						:label="request.priority"
						:theme="featureRequestPriorityTheme(request.priority)"
						variant="subtle"
					/>
				</ListCell>
				<ListCell class="max-md:hidden">
					<span class="truncate text-sm text-ink-gray-6">
						{{ displayName(request.requested_by) }}
					</span>
				</ListCell>
				<ListCell class="max-md:hidden">
					<span class="text-sm text-ink-gray-5">{{ formatDate(request.creation) }}</span>
				</ListCell>
				<ListCell class="justify-end">
					<Badge
						v-if="request.status === 'Converted' && request.converted_task"
						:label="request.converted_task"
						theme="blue"
						variant="subtle"
					/>
					<Dropdown v-else-if="actionsFor(request).length" :options="actionsFor(request)">
						<Button
							variant="ghost"
							icon="lucide-ellipsis"
							:aria-label="`Actions for ${request.title}`"
							:loading="busy === request.name"
						/>
					</Dropdown>
				</ListCell>
			</ListRow>
		</List>

		<FeatureRequestDialog
			v-model:open="createOpen"
			:project="project"
			:mentions="mentions"
			@created="list.reload()"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, Dropdown, LoadingText, toast, useDoctype, useList } from 'frappe-ui'
import type { DropdownOption } from 'frappe-ui'
import { List, ListCell, ListHeader, ListHeaderCell, ListRow } from 'frappe-ui/list'
import EmptyState from '@/components/common/EmptyState.vue'
import FeatureRequestDialog from '@/components/projects/FeatureRequestDialog.vue'
import { useSession } from '@/composables/useSession'
import { formatDate } from '@/lib/dates'
import { featureRequestPriorityTheme, featureRequestStatusTheme } from '@/lib/status'
import { stripHtml, truncate } from '@/lib/text'
import type { HiveFeatureRequest, HiveMember } from '@/types'

const COLUMNS = ['minmax(0,1fr)', '7rem', '8rem', '10rem', '7rem', '2.5rem']

const props = defineProps<{
	/** Hive Project docname. */
	project: string
}>()

const emit = defineEmits<{
	/** Number of requests on this project, for the tab's count badge. */
	count: [count: number]
}>()

/** `?create_feature_request=1` on the project route opens the dialog through this. */
const createOpen = defineModel<boolean>('createOpen', { default: false })

const { isClient } = useSession()

const members = useList<HiveMember>({
	doctype: 'Hive Member',
	fields: ['name', 'user', 'member_name', 'user_image'],
	filters: { is_active: 1 },
	limit: 100,
	cacheKey: 'hive-active-members',
})

const mentions = computed(() =>
	(members.data ?? []).map((member) => ({
		id: member.user,
		label: member.member_name || member.user,
		image: member.user_image || undefined,
	})),
)

function displayName(user: string): string {
	const member = (members.data ?? []).find((row) => row.user === user)
	return member?.member_name || user.split('@')[0]
}

const list = useList<HiveFeatureRequest>({
	doctype: 'Hive Feature Request',
	fields: [
		'name',
		'title',
		'project',
		'requested_by',
		'status',
		'priority',
		'description',
		'converted_task',
		'creation',
		'modified',
	],
	filters: () => ({ project: props.project }),
	orderBy: 'creation desc',
	limit: 100,
	onSuccess: (rows) => emit('count', rows.length),
})

const requests = computed(() => list.data ?? [])

function summary(description: string): string {
	return truncate(stripHtml(description), 120)
}

const requestDoctype = useDoctype<HiveFeatureRequest>('Hive Feature Request')
const busy = ref<string | null>(null)

/**
 * Reviewing and converting are team actions — a client files requests and
 * watches them move, exactly as the desk permits.
 */
function actionsFor(request: HiveFeatureRequest): DropdownOption[] {
	if (isClient.value) return []
	if (request.status === 'Open') {
		return [
			{
				label: 'Set under review',
				icon: 'lucide-search',
				onClick: () => review(request.name, 'under_review'),
			},
			{
				label: 'Approve',
				icon: 'lucide-circle-check',
				onClick: () => review(request.name, 'approve'),
			},
			{
				label: 'Reject',
				icon: 'lucide-x',
				theme: 'red',
				onClick: () => review(request.name, 'reject'),
			},
		]
	}
	if (request.status === 'Under Review') {
		return [
			{
				label: 'Approve',
				icon: 'lucide-circle-check',
				onClick: () => review(request.name, 'approve'),
			},
			{
				label: 'Reject',
				icon: 'lucide-x',
				theme: 'red',
				onClick: () => review(request.name, 'reject'),
			},
		]
	}
	if (request.status === 'Approved') {
		return [
			{
				label: 'Convert to task',
				icon: 'lucide-corner-up-right',
				onClick: () => convert(request.name),
			},
		]
	}
	return []
}

const REVIEW_MESSAGE: Record<string, string> = {
	approve: 'Request approved',
	reject: 'Request rejected',
	under_review: 'Request set to under review',
}

async function review(name: string, action: 'approve' | 'reject' | 'under_review') {
	busy.value = name
	try {
		await requestDoctype.runDocMethod.submit({ name, method: 'review', params: { action } })
		list.reload()
		toast.success(REVIEW_MESSAGE[action])
	} catch {
		toast.error('Could not update request')
	} finally {
		busy.value = null
	}
}

async function convert(name: string) {
	busy.value = name
	try {
		await requestDoctype.runDocMethod.submit({ name, method: 'convert_to_task' })
		list.reload()
		toast.success('Feature request converted to task')
	} catch {
		toast.error('Could not convert request')
	} finally {
		busy.value = null
	}
}
</script>
