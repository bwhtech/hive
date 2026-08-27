<template>
	<SettingsDialogRoot v-model:open="open" :tab="tab" @update:tab="setTab">
		<SettingsSidebar>
			<SettingsNavGroup>
				<SettingsNavItem v-for="item in panels" :key="item.value" :value="item.value">
					<template #prefix>
						<span
							:class="[item.icon, 'size-4 shrink-0 text-ink-gray-6']"
							aria-hidden="true"
						/>
					</template>
					{{ item.label }}
				</SettingsNavItem>
			</SettingsNavGroup>
		</SettingsSidebar>

		<SettingsContent>
			<SettingsPanel v-for="item in panels" :key="item.value" :value="item.value">
				<component :is="item.component" />
			</SettingsPanel>
		</SettingsContent>
	</SettingsDialogRoot>
</template>

<script setup lang="ts">
import { computed, markRaw, type Component } from 'vue'
import {
	SettingsContent,
	// Aliased: this file is `SettingsDialog.vue`, and the bare name would read
	// as a self-reference.
	SettingsDialog as SettingsDialogRoot,
	SettingsNavGroup,
	SettingsNavItem,
	SettingsPanel,
	SettingsSidebar,
} from 'frappe-ui'
import ClientsPanel from '@/components/settings/ClientsPanel.vue'
import GeneralPanel from '@/components/settings/GeneralPanel.vue'
import GitHubPanel from '@/components/settings/GitHubPanel.vue'
import MembersPanel from '@/components/settings/MembersPanel.vue'
import ProfilePanel from '@/components/settings/ProfilePanel.vue'
import { useOverlays, type SettingsTab } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'

interface PanelDef {
	value: SettingsTab
	label: string
	icon: string
	component: Component
	/** Client members only get their own profile. */
	teamOnly: boolean
}

const PANELS: PanelDef[] = [
	{
		value: 'profile',
		label: 'Profile',
		icon: 'lucide-circle-user',
		component: markRaw(ProfilePanel),
		teamOnly: false,
	},
	{
		value: 'general',
		label: 'General',
		icon: 'lucide-settings',
		component: markRaw(GeneralPanel),
		teamOnly: true,
	},
	{
		value: 'members',
		label: 'Members',
		icon: 'lucide-users',
		component: markRaw(MembersPanel),
		teamOnly: true,
	},
	{
		value: 'clients',
		label: 'Clients',
		icon: 'lucide-building-2',
		component: markRaw(ClientsPanel),
		teamOnly: true,
	},
	{
		value: 'github',
		label: 'GitHub',
		icon: 'lucide-git-branch',
		component: markRaw(GitHubPanel),
		teamOnly: true,
	},
]

const { settingsOpen: open, settingsTab } = useOverlays()
const { isClient } = useSession()

const panels = computed(() => PANELS.filter((panel) => !panel.teamOnly || !isClient.value))

/** A client landing on a team-only tab (deep link, stale state) gets Profile. */
const tab = computed<SettingsTab>(() =>
	panels.value.some((panel) => panel.value === settingsTab.value) ? settingsTab.value : 'profile',
)

function setTab(value: string | number | undefined) {
	if (value) settingsTab.value = value as SettingsTab
}
</script>
