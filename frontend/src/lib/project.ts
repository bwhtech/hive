import type { AvatarProps } from 'frappe-ui'
import type { ProjectAvatarValue } from '@/lib/dicebear'

/**
 * The visual identity a `Hive Project` and a `Hive View` share: a lucide icon
 * on a tinted square, the way Linear and Notion do it, or a generated DiceBear
 * avatar in its place. `icon`, `color` and `avatar` are all optional on both
 * doctypes, so every helper here has to answer for a row that has never been
 * given one.
 *
 * The DiceBear half — styles, generation, shuffle — lives in `lib/dicebear.ts`,
 * which loads a megabyte of style definitions and so must stay out of the path
 * that merely *draws* a row; the import above is type-only for that reason.
 * Only the guard below belongs here.
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
 * An SVG is a script host: `<svg><script>` and `onload=` on any element both
 * run, and `Hive Project.avatar` is a field any member can write. So a stored
 * avatar never becomes markup — it is only ever an `<img>` source, which does
 * not execute script, and only after it has proved to be an SVG data URI.
 * Anything else resolves to `''`, and `ProjectAvatar` falls back to the icon.
 *
 * The check is deliberately narrow. `data:image/svg+xml` is what
 * `renderProjectAvatar` writes; a `javascript:` or `data:text/html` value —
 * inert in `src` on any current browser, but not something to rely on — never
 * gets that far.
 */
const AVATAR_DATA_URI = /^data:image\/svg\+xml[;,]/i

export function projectAvatarSrc(avatar?: string | null): string {
	const value = (avatar ?? '').trim()
	return AVATAR_DATA_URI.test(value) ? value : ''
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

/**
 * The identity fields as a row stores them. `Hive Project` and `Hive View`
 * name and type them identically on purpose — one picker writes both — so the
 * two helpers below work on either without knowing which they were handed.
 */
export interface StoredIdentity {
	icon?: string | null
	color?: string | null
	avatar?: string | null
	avatar_style?: string | null
	avatar_seed?: string | null
	avatar_options?: string | null
}

/**
 * Rebuild the picker's avatar model from a row, so an edit dialog opens on the
 * avatar that is already stored and can shuffle on from it. `null` means the
 * row uses its icon — which is also the answer for an `avatar` that fails the
 * data-URI check, since such a value would never be drawn either.
 */
export function storedAvatarValue(doc: StoredIdentity): ProjectAvatarValue | null {
	const svg = projectAvatarSrc(doc.avatar)
	if (!svg) return null
	return {
		svg,
		style: doc.avatar_style || '',
		seed: doc.avatar_seed || '',
		options: parseAvatarOptions(doc.avatar_options),
	}
}

/**
 * What `identityPatch` writes: the same six fields, none of them optional, and
 * `color` still narrowed to the palette so a caller cannot widen a document's
 * field to `string` by spreading this into it.
 */
export interface IdentityPatch {
	icon: string
	color: ProjectColor | ''
	avatar: string
	avatar_style: string
	avatar_seed: string
	avatar_options: string
}

/**
 * The fields to write for a chosen identity. Every key is always present, and
 * empty rather than absent, because an update has to be able to *clear* one:
 * going back from an avatar to an icon means writing four empty strings, and
 * an omitted key would leave the old avatar in the row.
 */
export function identityPatch(
	icon: string,
	color: ProjectColor | '',
	avatar: ProjectAvatarValue | null,
): IdentityPatch {
	return {
		icon,
		color,
		// The SVG is what gets drawn; the style, seed and options are what let
		// the avatar be rolled again, or rebuilt, later.
		avatar: avatar?.svg ?? '',
		avatar_style: avatar?.style ?? '',
		avatar_seed: avatar?.seed ?? '',
		avatar_options: avatar ? JSON.stringify(avatar.options) : '',
	}
}

/** A row written before the field existed, or by hand, must not break a dialog. */
function parseAvatarOptions(json?: string | null): Record<string, string> {
	try {
		const parsed: unknown = JSON.parse(json || '{}')
		return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {}
	} catch {
		return {}
	}
}
