import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { resolveLoggedUser } from '@/composables/useSession'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Dashboard',
		component: () => import('@/pages/DashboardPage.vue'),
	},
	{
		path: '/projects',
		name: 'Projects',
		component: () => import('@/pages/ProjectsPage.vue'),
	},
	{
		path: '/projects/:id',
		name: 'ProjectDetail',
		component: () => import('@/pages/ProjectDetailPage.vue'),
		props: true,
	},
	{
		path: '/tasks',
		name: 'Tasks',
		component: () => import('@/pages/TasksPage.vue'),
	},
	{
		// Deep links to a bare task resolve its project and redirect.
		path: '/tasks/:id',
		name: 'TaskRedirect',
		component: () => import('@/pages/TaskRedirectPage.vue'),
		props: true,
	},
	{
		path: '/team',
		name: 'Team',
		component: () => import('@/pages/TeamPage.vue'),
	},
	{
		// Hidden sandbox for the shared components. Not linked from anywhere.
		path: '/dev',
		name: 'Dev',
		component: () => import('@/pages/DevPage.vue'),
	},
	{ path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
	// The app is mounted at /hive by `website_route_rules`.
	history: createWebHistory('/hive'),
	routes,
	scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
	const user = await resolveLoggedUser()
	if (user) return true
	const target = `/hive${to.fullPath}`
	window.location.href = `/login?redirect-to=${encodeURIComponent(target)}`
	return false
})

// A lazy chunk that 404s means the deployed build moved under us. Reload once,
// tracked in sessionStorage so a genuinely broken chunk can't loop.
const RELOAD_KEY = 'hive-chunk-reload'
router.onError((error) => {
	if (!/dynamically imported module|Importing a module script failed/i.test(String(error))) return
	if (sessionStorage.getItem(RELOAD_KEY)) return
	sessionStorage.setItem(RELOAD_KEY, '1')
	window.location.reload()
})
router.isReady().then(() => sessionStorage.removeItem(RELOAD_KEY))

export default router
