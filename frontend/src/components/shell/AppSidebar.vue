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
				<!-- Notifications open a sheet rather than a route, so this row has
				     no `to`; the unread count sits where a route's suffix would. -->
				<SidebarItem
					icon="lucide-bell"
					label="Notifications"
					:suffix="unreadCount ? String(unreadCount) : undefined"
					data-testid="sidebar-notifications"
					@click="notificationsOpen = true"
				/>
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
import { computed, h } from 'vue'
import type { VNode } from 'vue'
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
	useCall,
	type DropdownOptions,
} from 'frappe-ui'
import SidebarPinned from '@/components/shell/SidebarPinned.vue'
import SidebarProjects from '@/components/shell/SidebarProjects.vue'
import SidebarViews from '@/components/shell/SidebarViews.vue'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'
import { useUnreadCount } from '@/composables/useUnreadCount'

const LOGO_URL = `${import.meta.env.BASE_URL}images/hive-logo.svg`
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
	icon?: string
	onClick?: () => void
	submenu?: MenuItem[]
	slots?: { prefix?: () => VNode }
}

/** One row of `frappe.apps.get_apps`: an installed app that opted into the apps screen. */
interface AppEntry {
	name: string
	logo: string
	title: string
	route: string
}

const route = useRoute()
const { user, isClient, isSystemManager, logout } = useSession()
const { commandPaletteOpen, notificationsOpen, openSettings, shortcutsOpen } = useOverlays()
const unreadCount = useUnreadCount()

// Projects live in their own section below; the nav block stays at three rows.
const navItems = computed<NavItem[]>(() => [
	{
		to: '/',
		label: 'Dashboard',
		icon: 'lucide-layout-dashboard',
		accessKey: 'd',
		exact: true,
	},
	{ to: '/tasks', label: 'Tasks', icon: 'lucide-square-check-big', accessKey: 't' },
	{ to: '/team', label: 'Team', icon: 'lucide-users', accessKey: 'm' },
])

function isActive(item: NavItem) {
	return item.exact ? route.path === item.to : route.path.startsWith(item.to)
}

// The apps screen hook is the site-wide list of installed apps, so the switcher
// stays correct as apps are installed or removed without a Hive-side registry.
const apps = useCall<AppEntry[]>({
	url: '/api/v2/method/frappe.apps.get_apps',
	method: 'GET',
	cacheKey: 'installed-apps',
})

// Desk is not on the apps screen (it is every site's fallback), so it is added by
// hand — but only for System Managers, since a client user has no desk access and
// would land on a permission error. Hive itself is dropped: switching to where you
// already are is a no-op.
const deskApp: AppEntry = {
	name: 'frappe',
	logo: '/assets/frappe/images/framework.png',
	title: 'Desk',
	route: '/desk',
}

const appSwitcherItems = computed<MenuItem[]>(() =>
	[
		...(isSystemManager.value ? [deskApp] : []),
		...(apps.data ?? []).filter((app) => app.name !== 'bwh_hive'),
	].map((app) => ({
		label: app.title,
		onClick: () => {
			window.location.href = app.route
		},
		slots: {
			prefix: () => h('img', { src: app.logo, alt: '', class: 'size-4 rounded-sm' }),
		},
	})),
)

// Workspace-level actions belong to the workspace, so they hang off its header.
const workspaceMenu = computed<MenuItem[]>(() => {
	const items: MenuItem[] = []
	if (appSwitcherItems.value.length) {
		items.push({
			label: 'Switch app',
			icon: 'lucide-layout-grid',
			submenu: appSwitcherItems.value,
		})
	}
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
