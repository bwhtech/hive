import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import proxyOptions from './proxyOptions';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
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
					{
						src: 'images/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'images/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
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
	server: {
		port: 8080,
		host: '0.0.0.0',
		proxy: proxyOptions
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	build: {
		outDir: '../bwh_hive/public/frontend',
		emptyOutDir: true,
		target: 'es2015',
	},
});
