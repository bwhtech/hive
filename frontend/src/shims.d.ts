// Ambient module declarations. Keep this file free of top-level imports and
// exports — one would turn it into a module and every `declare module` below
// into an augmentation, which declares nothing.

// frappe-ui ships unbuilt source that imports lucide glyphs through
// `unplugin-icons`' virtual modules. The vite plugin resolves them at build
// time; this keeps `vue-tsc` from tripping over the specifier.
declare module '~icons/*' {
	import type { FunctionalComponent, SVGAttributes } from 'vue'
	const component: FunctionalComponent<SVGAttributes>
	export default component
}
