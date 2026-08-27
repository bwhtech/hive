<template>
	<MobileNav>
		<MobileNavItem label="Dashboard" icon="lucide-layout-dashboard" to="/" />
		<MobileNavItem label="Projects" icon="lucide-folder" to="/projects" />
		<MobileNavItem label="Tasks" icon="lucide-square-check-big" to="/tasks" />
		<MobileNavItem label="You" @click="sheetOpen = true">
			<Avatar
				size="sm"
				:image="user?.user_image ?? undefined"
				:label="user?.full_name ?? ''"
			/>
		</MobileNavItem>
	</MobileNav>

	<BottomSheet v-model:open="sheetOpen" title="You">
		<div class="flex flex-col gap-1 pb-4">
			<button
				v-for="item in menu"
				:key="item.label"
				class="flex items-center gap-3 rounded-4 px-3 py-2.5 text-left text-base text-ink-gray-8 hover:bg-surface-gray-2"
				@click="run(item.onClick)"
			>
				<span :class="[item.icon, 'size-4 text-ink-gray-6']" />
				{{ item.label }}
			</button>
		</div>
	</BottomSheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, BottomSheet, MobileNav, MobileNavItem, useColorScheme } from 'frappe-ui'
import { useOverlays } from '@/composables/useOverlays'
import { useSession } from '@/composables/useSession'

const ISSUE_URL = 'https://github.com/BuildWithHussain/hive/issues/new'

const router = useRouter()
const { user, isClient, logout } = useSession()
const { openSettings } = useOverlays()
const { colorScheme, toggleColorScheme } = useColorScheme()

const sheetOpen = ref(false)

interface SheetItem {
	label: string
	icon: string
	onClick: () => void
}

const menu = computed<SheetItem[]>(() => {
	const items: SheetItem[] = [
		{ label: 'Team', icon: 'lucide-users', onClick: () => router.push('/team') },
	]
	if (!isClient.value) {
		items.push({
			label: 'Settings',
			icon: 'lucide-settings',
			onClick: () => openSettings('profile'),
		})
	}
	items.push(
		{
			label: colorScheme.value === 'dark' ? 'Light mode' : 'Dark mode',
			icon: colorScheme.value === 'dark' ? 'lucide-sun' : 'lucide-moon',
			onClick: () => toggleColorScheme(),
		},
		{
			label: 'Raise an issue',
			icon: 'lucide-bug',
			onClick: () => window.open(ISSUE_URL, '_blank', 'noopener'),
		},
		{ label: 'Log out', icon: 'lucide-log-out', onClick: () => logout() },
	)
	return items
})

function run(action: () => void) {
	sheetOpen.value = false
	action()
}
</script>
