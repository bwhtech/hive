<template>
	<Sidebar width="14rem">
		<SidebarHeader title="Hive" :logo="LOGO_URL" />

		<ScrollArea class="min-h-0 flex-1 px-1">
			<SidebarSection>
				<SidebarItem
					v-for="item in navItems"
					:key="item.to"
					:icon="item.icon"
					:label="item.label"
					:access-key="item.accessKey"
					:to="item.to"
					:active="isActive(item)"
				/>
				<SidebarItem
					v-if="!isClient"
					icon="lucide-settings"
					label="Settings"
					@click="openSettings('profile')"
				/>
			</SidebarSection>

			<SidebarViews />
			<SidebarPinned />
		</ScrollArea>

		<div class="shrink-0 p-1">
			<Dropdown :options="userMenu" side="top" align="start" match-trigger-width>
				<button
					class="flex w-full items-center gap-2 rounded-4 p-1.5 text-left hover:bg-surface-gray-3"
				>
					<Avatar
						size="sm"
						:image="user?.user_image ?? undefined"
						:label="user?.full_name ?? ''"
					/>
					<span class="min-w-0 flex-1 truncate text-sm text-ink-gray-8">
						{{ user?.full_name ?? '…' }}
					</span>
					<span class="lucide-chevrons-up-down size-4 shrink-0 text-ink-gray-5" />
				</button>
			</Dropdown>
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
	Avatar,
	Dropdown,
	ScrollArea,
	Sidebar,
	SidebarHeader,
	SidebarItem,
	SidebarSection,
	type DropdownOptions,
} from 'frappe-ui'
import SidebarPinned from '@/components/shell/SidebarPinned.vue'
import SidebarViews from '@/components/shell/SidebarViews.vue'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'

const LOGO_URL = `${import.meta.env.BASE_URL}images/hive-logo.png`
const ISSUE_URL = 'https://github.com/BuildWithHussain/hive/issues/new'

interface NavItem {
	to: string
	label: string
	icon: string
	accessKey: string
	exact?: boolean
}

const navItems: NavItem[] = [
	{ to: '/', label: 'Dashboard', icon: 'lucide-layout-dashboard', accessKey: 'd', exact: true },
	{ to: '/projects', label: 'Projects', icon: 'lucide-folder', accessKey: 'p' },
	{ to: '/tasks', label: 'Tasks', icon: 'lucide-square-check-big', accessKey: 't' },
	{ to: '/team', label: 'Team', icon: 'lucide-users', accessKey: 'm' },
]

const route = useRoute()
const { user, isClient, logout } = useSession()
const { openSettings } = useOverlays()

function isActive(item: NavItem) {
	return item.exact ? route.path === item.to : route.path.startsWith(item.to)
}

const userMenu = computed<DropdownOptions>(() => [
	{
		label: 'Raise an issue',
		icon: 'lucide-bug',
		onClick: () => window.open(ISSUE_URL, '_blank', 'noopener'),
	},
	{ label: 'Log out', icon: 'lucide-log-out', theme: 'red', onClick: () => logout() },
])
</script>
