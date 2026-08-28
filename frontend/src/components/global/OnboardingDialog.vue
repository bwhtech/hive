<template>
	<!-- Dismissable on purpose: the same ground is covered by Settings. -->
	<Dialog v-model:open="open" title="Welcome to Hive">
		<template #default>
			<div class="space-y-6">
				<!-- Step rail: the numbers are clickable, so a skipped step is one
				     click away rather than a restart. -->
				<ol class="flex items-center justify-center gap-2">
					<li v-for="(item, index) in rail" :key="index" class="flex items-center gap-2">
						<button
							type="button"
							class="grid size-8 place-items-center rounded-full text-xs font-medium transition-colors"
							:class="
								index <= step
									? 'bg-surface-gray-7 text-white'
									: 'bg-surface-gray-2 text-ink-gray-5'
							"
							:aria-current="index === step ? 'step' : undefined"
							:aria-label="item"
							@click="step = index"
						>
							<span
								v-if="index < step"
								class="lucide-check size-4"
								aria-hidden="true"
							/>
							<template v-else>{{ index + 1 }}</template>
						</button>
						<span
							v-if="index < rail.length - 1"
							class="h-px w-8"
							:class="index < step ? 'bg-surface-gray-7' : 'bg-outline-gray-1'"
							aria-hidden="true"
						/>
					</li>
				</ol>

				<template v-if="step < STEPS.length">
					<header class="flex flex-col items-center gap-2 text-center">
						<span
							:class="[STEPS[step].icon, 'size-6 text-ink-gray-6']"
							aria-hidden="true"
						/>
						<h3 class="text-lg font-semibold text-ink-gray-8">
							{{ STEPS[step].title }}
						</h3>
						<p class="text-p-base text-ink-gray-5">{{ STEPS[step].description }}</p>
					</header>

					<div class="min-h-28 space-y-3">
						<div class="flex gap-2">
							<TextInput
								v-model="input"
								class="flex-1"
								:type="step === 0 ? 'email' : 'text'"
								:placeholder="STEPS[step].placeholder"
								:aria-label="STEPS[step].title"
								autofocus
								@keydown.enter.prevent="submitStep"
							/>
							<Button
								variant="solid"
								theme="gray"
								:icon-left="step === 0 ? 'lucide-send' : 'lucide-plus'"
								:label="step === 0 ? 'Invite' : 'Add'"
								:loading="busy"
								:disabled="!input.trim()"
								@click="submitStep"
							/>
						</div>

						<div v-if="chips.length" class="space-y-1.5">
							<p class="text-xs font-medium text-ink-gray-5">
								{{ STEPS[step].listLabel }}
							</p>
							<div class="flex flex-wrap gap-1.5">
								<Badge
									v-for="chip in chips"
									:key="chip"
									:label="chip"
									theme="gray"
									variant="subtle"
								/>
							</div>
						</div>
					</div>

					<div class="flex items-center justify-between">
						<Button label="Back" :disabled="step === 0" @click="step -= 1" />
						<div class="flex gap-2">
							<Button variant="ghost" label="Skip" @click="step += 1" />
							<Button
								variant="solid"
								theme="gray"
								label="Next"
								icon-right="lucide-arrow-right"
								@click="step += 1"
							/>
						</div>
					</div>
				</template>

				<div v-else class="flex flex-col items-center gap-4 py-4 text-center">
					<span class="text-3xl" aria-hidden="true">🎉</span>
					<div class="space-y-1.5">
						<h3 class="text-lg font-semibold text-ink-gray-8">You are all set</h3>
						<p class="max-w-sm text-p-base text-ink-gray-5">
							Your workspace is ready. Create a project and start adding tasks.
						</p>
					</div>
					<Button
						variant="solid"
						theme="gray"
						label="Let's go"
						:loading="completing"
						@click="complete"
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
	Dialog,
	TextInput,
	toast,
	useCall,
	useDoc,
	useList,
	useNewDoc,
} from 'frappe-ui'
import { useOverlays } from '@/composables/useOverlays'
import type { Bool, HiveClient } from '@/types'

const STEPS = [
	{
		id: 'members',
		title: 'Invite your team',
		description: 'Add the people you work with, so projects have someone on them.',
		placeholder: 'email@example.com',
		listLabel: 'Pending invitations',
		icon: 'lucide-users',
	},
	{
		id: 'clients',
		title: 'Add your clients',
		description: 'Client organisations you deliver work for.',
		placeholder: 'Company name…',
		listLabel: 'Your clients',
		icon: 'lucide-building-2',
	},
	{
		id: 'types',
		title: 'Set up project types',
		description: 'The categories your projects are filed under.',
		placeholder: 'e.g. Build, Hiring, Support…',
		listLabel: 'Project types',
		icon: 'lucide-settings',
	},
] as const

const APP_NAME = 'bwh_hive'

const { onboardingOpen: open } = useOverlays()

const step = ref(0)
const input = ref('')
const busy = ref(false)
const completing = ref(false)

/** One extra rail entry for the closing "all set" step. */
const rail = computed(() => [...STEPS.map((item) => item.title), 'Finish'])

watch(step, () => (input.value = ''))

// -- step data -----------------------------------------------------------

const invitations = useCall<{ name: string; email: string }[], { app_name: string }>({
	url: '/api/v2/method/frappe.core.api.user_invitation.get_pending_invitations',
	method: 'GET',
	params: { app_name: APP_NAME },
	immediate: false,
})

const inviteMember = useCall<unknown, { email: string; role: string }>({
	url: '/api/v2/method/bwh_hive.bwh_hive.api.invite_member',
	method: 'POST',
	immediate: false,
})

const clients = useList<Pick<HiveClient, 'name' | 'company_name'>>({
	doctype: 'Hive Client',
	fields: ['name', 'company_name'],
	orderBy: 'creation asc',
	limit: 100,
	immediate: false,
})

const types = useList<{ name: string; type_name: string }>({
	doctype: 'Hive Project Type',
	fields: ['name', 'type_name'],
	filters: { is_archived: 0 },
	orderBy: 'creation asc',
	limit: 100,
	immediate: false,
	cacheKey: 'hive-project-types',
})

// Each step only fetches when it is first shown; the dialog opens on a cold app.
watch(
	[open, step],
	([isOpen, current]) => {
		if (!isOpen) return
		if (current === 0) invitations.reload()
		if (current === 1) clients.reload()
		if (current === 2) types.reload()
	},
	{ immediate: true },
)

const chips = computed(() => {
	if (step.value === 0) return (invitations.data ?? []).map((invite) => invite.email)
	if (step.value === 1) return (clients.data ?? []).map((client) => client.company_name)
	if (step.value === 2) return (types.data ?? []).map((type) => type.type_name)
	return []
})

async function submitStep() {
	const value = input.value.trim()
	if (!value || busy.value) return
	busy.value = true
	try {
		if (step.value === 0) {
			await inviteMember.submit({ email: value, role: 'Hive Team' })
			invitations.reload()
			toast.success(`Invitation sent to ${value}`)
		} else if (step.value === 1) {
			await useNewDoc<HiveClient>('Hive Client', {
				company_name: value,
				is_active: 1,
			}).submit()
			clients.reload()
			toast.success(`Added "${value}"`)
		} else {
			await useNewDoc<{ name: string; type_name: string }>('Hive Project Type', {
				type_name: value,
			}).submit()
			types.reload()
			toast.success(`Added "${value}"`)
		}
		input.value = ''
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'That did not go through')
	} finally {
		busy.value = false
	}
}

// -- completion ----------------------------------------------------------

const settings = useDoc<{ name: string; onboarding_completed: Bool }>({
	doctype: 'Hive Settings',
	name: 'Hive Settings',
	immediate: false,
})

async function complete() {
	completing.value = true
	try {
		await settings.setValue.submit({ onboarding_completed: 1 })
		toast.success('Welcome to Hive')
	} catch {
		// The flag is a convenience: closing still has to work, and Settings can
		// walk the same ground later.
	} finally {
		completing.value = false
		open.value = false
	}
}
</script>
