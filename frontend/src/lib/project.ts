import type { AvatarProps } from 'frappe-ui'

/**
 * A project's visual identity: a lucide icon on a tinted square, the way Linear
 * and Notion do it. Both `Hive Project.icon` and `.color` are optional, so
 * every helper here has to answer for a project that has never been given one.
 */

/**
 * The palette is exactly frappe-ui's `Avatar` themes. Deriving the type from
 * the component means a project colour can only ever resolve to a tint the
 * design system already ships — there is no hand-written class map to drift
 * off-palette, and no raw colour value anywhere in the chain.
 */
export type ProjectColor = NonNullable<AvatarProps['theme']>

export const PROJECT_COLORS = [
	'gray',
	'blue',
	'green',
	'amber',
	'red',
	'violet',
] as const satisfies readonly ProjectColor[]

const ICON_PREFIX = 'lucide-'

/**
 * Tailwind's JIT only emits an icon rule for a class it can read literally in
 * source, so the curated set is spelled out as whole class names here and the
 * bare lucide names — what the field actually stores — are derived from them.
 * A template string alone would compile to CSS that does not exist.
 *
 * Twenty-eight names that suit a project, not all of lucide: a grid you can
 * scan in one pass beats a search box over 1500 icons.
 */
const PROJECT_ICON_CLASSES = [
	'lucide-folder',
	'lucide-briefcase',
	'lucide-rocket',
	'lucide-target',
	'lucide-flag',
	'lucide-sparkles',
	'lucide-lightbulb',
	'lucide-compass',
	'lucide-layers',
	'lucide-box',
	'lucide-puzzle',
	'lucide-component',
	'lucide-code',
	'lucide-terminal',
	'lucide-database',
	'lucide-server',
	'lucide-bug',
	'lucide-cpu',
	'lucide-globe',
	'lucide-monitor',
	'lucide-smartphone',
	'lucide-palette',
	'lucide-pen-tool',
	'lucide-book-open',
	'lucide-megaphone',
	'lucide-users',
	'lucide-chart-line',
	'lucide-shopping-cart',
] as const

export const PROJECT_ICONS: string[] = PROJECT_ICON_CLASSES.map((cls) =>
	cls.slice(ICON_PREFIX.length),
)

/**
 * A folder is the neutral stand-in for "no icon chosen". Unlike the colour it
 * is not derived: an icon carries meaning, and hashing one out of the project
 * id would claim a meaning nobody picked — a beaker on a billing project.
 */
export const DEFAULT_PROJECT_ICON = 'folder'

export function projectIconClass(icon?: string | null): string {
	return ICON_PREFIX + (icon || DEFAULT_PROJECT_ICON)
}

/**
 * Colour falls back to a hash of the project's docname (`PROJ-00042`), which
 * Frappe never rewrites when a title changes — so a project keeps its colour
 * across a rename. A fixed neutral would be stable too, but it would leave
 * every project that predates this field looking identical, which is the thing
 * the avatar exists to fix.
 */
export function projectColorTheme(color?: string | null, seed?: string | null): ProjectColor {
	const colors: readonly string[] = PROJECT_COLORS
	if (color && colors.includes(color)) return color as ProjectColor
	return PROJECT_COLORS[hash(seed ?? '') % PROJECT_COLORS.length]
}

/** Small deterministic string hash — same input, same colour, forever. */
function hash(seed: string): number {
	let value = 0
	for (let index = 0; index < seed.length; index++) {
		value = (value * 31 + seed.charCodeAt(index)) | 0
	}
	return Math.abs(value)
}
