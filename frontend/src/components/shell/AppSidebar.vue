<template>
	<Sidebar width="14rem">
		<SidebarHeader title="Hive" :logo="LOGO_URL" :menu-items="workspaceMenu" />

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
					:suffix="item.suffix"
				/>
				<!-- Search is a nav row, not a header button: the palette is the
				     app's search, and this is where the recipe puts it. -->
				<SidebarItem icon="lucide-search" label="Search" @click="commandPaletteOpen = true">
					<template #suffix>
						<KeyboardShortcut class="mr-2" combo="Mod+K" />
					</template>
				</SidebarItem>
			</SidebarSection>

			<SidebarProjects />
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
	KeyboardShortcut,
	ScrollArea,
	Sidebar,
	SidebarHeader,
	SidebarItem,
	SidebarSection,
	type DropdownOptions,
} from 'frappe-ui'
import SidebarPinned from '@/components/shell/SidebarPinned.vue'
import SidebarProjects from '@/components/shell/SidebarProjects.vue'
import SidebarViews from '@/components/shell/SidebarViews.vue'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import { useUnreadCount } from '@/composables/useUnreadCount'

const LOGO_URL = `${import.meta.env.BASE_URL}images/hive-logo.png`
const ISSUE_URL = 'https://github.com/BuildWithHussain/hive/issues/new'

interface NavItem {
	to: string
	label: string
	icon: string
	accessKey: string
	exact?: boolean
	suffix?: string
}

/** The `SidebarHeader` dropdown takes a narrower shape than `Dropdown` does. */
interface MenuItem {
	label: string
	icon: string
	onClick: () => void
}

const route = useRoute()
const { user, isClient, logout } = useSession()
const { commandPaletteOpen, openSettings, shortcutsOpen } = useOverlays()
const unreadCount = useUnreadCount()

// Projects live in their own section below; the nav block stays at three rows.
const navItems = computed<NavItem[]>(() => [
	{
		to: '/',
		label: 'Dashboard',
		icon: 'lucide-layout-dashboard',
		accessKey: 'd',
		exact: true,
		// The same unread count the header bell shows, in the recipe's Inbox slot.
		suffix: unreadCount.value ? String(unreadCount.value) : undefined,
	},
	{ to: '/tasks', label: 'Tasks', icon: 'lucide-square-check-big', accessKey: 't' },
	{ to: '/team', label: 'Team', icon: 'lucide-users', accessKey: 'm' },
])

function isActive(item: NavItem) {
	return item.exact ? route.path === item.to : route.path.startsWith(item.to)
}

// Workspace-level actions belong to the workspace, so they hang off its header.
const workspaceMenu = computed<MenuItem[]>(() => {
	const items: MenuItem[] = []
	if (!isClient.value) {
		items.push({
			label: 'Settings',
			icon: 'lucide-settings',
			onClick: () => openSettings('profile'),
		})
	}
	// The `?` chord still opens this, but a shortcut you have to already know
	// is a poor way to advertise the list of shortcuts.
	items.push({
		label: 'Keyboard shortcuts',
		icon: 'lucide-keyboard',
		onClick: () => (shortcutsOpen.value = true),
	})
	items.push({
		label: 'Raise an issue',
		icon: 'lucide-bug',
		onClick: () => window.open(ISSUE_URL, '_blank', 'noopener'),
	})
	return items
})

// Everything else moved to the header dropdown; the avatar keeps only Log out.
const userMenu: DropdownOptions = [
	{ label: 'Log out', icon: 'lucide-log-out', theme: 'red', onClick: () => logout() },
]
</script>
