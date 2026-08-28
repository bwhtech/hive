import frappeUIPreset from 'frappe-ui/tailwind'
import { content as frappeUIContent } from 'frappe-ui/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
	presets: [frappeUIPreset],
	content: [...frappeUIContent, './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
