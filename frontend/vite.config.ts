import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		frappeui({
			frontendRoute: '/hive',
			frappeProxy: { port: 8080 },
			jinjaBootData: true,
			lucideIcons: true,
			buildConfig: {
				indexHtmlPath: '../bwh_hive/www/hive.html',
				outDir: '../bwh_hive/public/frontend',
				baseUrl: '/assets/bwh_hive/frontend/',
			},
		}),
		vue(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'BWH Hive',
				short_name: 'Hive',
				description: 'Project Management Solution',
				theme_color: '#000000',
				background_color: '#000000',
				display: 'standalone',
				scope: '/hive',
				start_url: '/hive',
				icons: [
					{ src: 'images/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'images/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
					{
						src: 'images/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
			workbox: {
				navigateFallback: null,
				globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
				maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	optimizeDeps: {
		// frappe-ui ships unbuilt source with `~icons/lucide/*` virtual imports
		// that esbuild's prebundler cannot resolve.
		exclude: ['frappe-ui'],
		// Transitive CJS deps that still need converting to ESM once frappe-ui
		// itself is excluded from prebundling.
		include: ['tippy.js', 'engine.io-client', 'socket.io-client', 'debug'],
	},
})
