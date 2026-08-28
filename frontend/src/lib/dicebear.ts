import type { Style } from '@dicebear/core'

/**
 * DiceBear avatars as a project's identity, next to the lucide icon in
 * `lib/project.ts`. A project has one or the other: `Hive Project.avatar` wins
 * when it is set, and everything falls back to the icon when it is not.
 *
 * Two rules shape this file.
 *
 * Generation is local. `@dicebear/core` renders the SVG in the browser, so a
 * project row never reaches `api.dicebear.com` — this app is served from a
 * Frappe site and must not hand a third party the list of projects a user is
 * looking at, once per row, forever.
 *
 * Generation is also lazy. The twelve style definitions weigh ~1.2 MB of JSON
 * and the renderer another ~120 kB; that is far more than the rest of the
 * frontend and it is only ever needed while the picker is open. Every entry
 * point here is `async` and reaches the packages through `import()`, so Rollup
 * splits them into chunks that the app loads on the first shuffle and never
 * before. Nothing in this module may be imported for its side effects.
 */

/**
 * One component of a style the picker lets you choose by hand — `eyes`,
 * `hair`. DiceBear names the option after the component with a `Variant`
 * suffix (`eyesVariant`), which is what `variantOptions` builds.
 */
export interface ProjectAvatarAspect {
	/** Component name in the style definition. */
	key: string
	label: string
}

export interface ProjectAvatarStyleMeta {
	/** DiceBear style id, also the stored value of `Hive Project.avatar_style`. */
	id: string
	label: string
	/** License of the artwork, not of DiceBear's code, which is MIT throughout. */
	license: string
	licenseUrl: string
	artist: string
	artistUrl: string
	/**
	 * Whether the license obliges us to name the artist wherever the art is
	 * shipped. CC BY 4.0 does; CC0 and the two artists' own terms do not.
	 * `ProjectIconPicker` credits every style regardless — this flag only
	 * decides which ones it is not allowed to stop crediting.
	 */
	attributionRequired: boolean
	/**
	 * The handful of components worth a control, at most two per style. Each
	 * one is always drawn (probability 100), so picking a variant always shows
	 * up — a control over an occasional component would look broken.
	 */
	aspects: readonly [ProjectAvatarAspect, ProjectAvatarAspect]
}

/**
 * The shipped styles. Every one of these permits commercial use: DiceBear
 * groups its artwork as CC0 1.0, CC BY 4.0, MIT, or the artist's own
 * "free for personal and commercial use" terms, and none of the four excludes
 * it. Styles are still listed one by one rather than pulled wholesale from
 * `@dicebear/styles`, because that package ships 61 styles under licenses we
 * have not read and adding one has to stay a deliberate act.
 *
 * The credits below are copied from each definition's own `meta` block, so
 * they are the artist's wording and not a paraphrase.
 */
export const PROJECT_AVATAR_STYLES = [
	{
		id: 'notionists',
		label: 'Notionists',
		license: 'CC0 1.0',
		licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
		artist: 'Zoish',
		artistUrl: 'https://bio.link/heyzoish',
		attributionRequired: false,
		aspects: [
			{ key: 'hair', label: 'Hair' },
			{ key: 'mouth', label: 'Mouth' },
		],
	},
	{
		id: 'open-peeps',
		label: 'Open Peeps',
		license: 'CC0 1.0',
		licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
		artist: 'Pablo Stanley',
		artistUrl: 'https://www.openpeeps.com/',
		attributionRequired: false,
		aspects: [
			{ key: 'head', label: 'Hair' },
			{ key: 'expression', label: 'Expression' },
		],
	},
	{
		id: 'lorelei-neutral',
		label: 'Lorelei Neutral',
		license: 'CC0 1.0',
		licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
		artist: 'Lisa Wischofsky',
		artistUrl: 'https://www.instagram.com/lischi_art/',
		attributionRequired: false,
		aspects: [
			{ key: 'eyes', label: 'Eyes' },
			{ key: 'mouth', label: 'Mouth' },
		],
	},
	{
		id: 'bottts',
		label: 'Bottts',
		license: 'Free for personal and commercial use',
		licenseUrl: 'https://bottts.com/',
		artist: 'Pablo Stanley',
		artistUrl: 'https://bottts.com/',
		attributionRequired: false,
		aspects: [
			{ key: 'head', label: 'Head' },
			{ key: 'eyes', label: 'Eyes' },
		],
	},
	{
		id: 'avataaars',
		label: 'Avataaars',
		license: 'Free for personal and commercial use',
		licenseUrl: 'https://avataaars.com/',
		artist: 'Pablo Stanley',
		artistUrl: 'https://avataaars.com/',
		attributionRequired: false,
		aspects: [
			{ key: 'top', label: 'Hair' },
			{ key: 'clothes', label: 'Clothes' },
		],
	},
	{
		id: 'adventurer-neutral',
		label: 'Adventurer Neutral',
		license: 'CC BY 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
		artist: 'Lisa Wischofsky',
		artistUrl: 'https://www.instagram.com/lischi_art/',
		attributionRequired: true,
		aspects: [
			{ key: 'eyes', label: 'Eyes' },
			{ key: 'mouth', label: 'Mouth' },
		],
	},
	{
		id: 'croodles',
		label: 'Croodles',
		license: 'CC BY 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
		artist: 'vijay verma',
		artistUrl: 'https://vjy.me/',
		attributionRequired: true,
		aspects: [
			{ key: 'top', label: 'Hair' },
			{ key: 'mouth', label: 'Mouth' },
		],
	},
	{
		id: 'dylan',
		label: 'Dylan',
		license: 'CC BY 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
		artist: 'Natalia Spivak',
		artistUrl: 'https://nataspvk.tilda.ws/',
		attributionRequired: true,
		aspects: [
			{ key: 'hair', label: 'Hair' },
			{ key: 'mood', label: 'Mood' },
		],
	},
	{
		id: 'fun-emoji',
		label: 'Fun Emoji',
		license: 'CC BY 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
		artist: 'Davis Uche',
		artistUrl: 'https://www.instagram.com/davedirect3/',
		attributionRequired: true,
		aspects: [
			{ key: 'eyes', label: 'Eyes' },
			{ key: 'mouth', label: 'Mouth' },
		],
	},
	{
		id: 'miniavs',
		label: 'Miniavs',
		license: 'CC BY 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
		artist: 'Webpixels',
		artistUrl: 'https://webpixels.io/',
		attributionRequired: true,
		aspects: [
			{ key: 'hair', label: 'Hair' },
			{ key: 'mouth', label: 'Mouth' },
		],
	},
	{
		id: 'personas',
		label: 'Personas',
		license: 'CC BY 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
		artist: 'Draftbit',
		artistUrl: 'https://draftbit.com/',
		attributionRequired: true,
		aspects: [
			{ key: 'hair', label: 'Hair' },
			{ key: 'clothes', label: 'Clothes' },
		],
	},
	{
		id: 'toon-head',
		label: 'Toon Head',
		license: 'CC BY 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
		artist: 'Johan Melin',
		artistUrl: 'https://www.johanmelin.com',
		attributionRequired: true,
		aspects: [
			{ key: 'hair', label: 'Hair' },
			{ key: 'mouth', label: 'Mouth' },
		],
	},
] as const satisfies readonly ProjectAvatarStyleMeta[]

export type ProjectAvatarStyleId = (typeof PROJECT_AVATAR_STYLES)[number]['id']

export const DEFAULT_PROJECT_AVATAR_STYLE: ProjectAvatarStyleId = 'notionists'

/**
 * Everything needed to both draw a project's avatar and roll it again later.
 * `svg` is what the renderer uses; the other three are what shuffle and any
 * future re-render need in order to land on the same face.
 */
export interface ProjectAvatarValue {
	/** `data:image/svg+xml;…` — a URI, never markup. See `projectAvatarSrc`. */
	svg: string
	style: string
	seed: string
	/** Hand-picked component variants, keyed by component name. */
	options: Record<string, string>
}

/**
 * One `import()` per style, spelled out. A template literal would work in Vite
 * for a relative path but not for a bare package specifier, and listing them
 * is what lets Rollup emit twelve chunks instead of one 1.2 MB blob.
 */
const STYLE_LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
	'adventurer-neutral': () => import('@dicebear/styles/adventurer-neutral.json'),
	avataaars: () => import('@dicebear/styles/avataaars.json'),
	bottts: () => import('@dicebear/styles/bottts.json'),
	croodles: () => import('@dicebear/styles/croodles.json'),
	dylan: () => import('@dicebear/styles/dylan.json'),
	'fun-emoji': () => import('@dicebear/styles/fun-emoji.json'),
	'lorelei-neutral': () => import('@dicebear/styles/lorelei-neutral.json'),
	miniavs: () => import('@dicebear/styles/miniavs.json'),
	notionists: () => import('@dicebear/styles/notionists.json'),
	'open-peeps': () => import('@dicebear/styles/open-peeps.json'),
	personas: () => import('@dicebear/styles/personas.json'),
	'toon-head': () => import('@dicebear/styles/toon-head.json'),
}

/**
 * Keyed by style id, holding the in-flight promise rather than the resolved
 * `Style`. Two shuffles a frame apart then share one download, and `new Style`
 * — which validates the definition against a JSON schema — runs once per style
 * for the life of the tab instead of once per roll.
 */
const styleCache = new Map<string, Promise<Style<unknown>>>()

function loadStyle(id: string): Promise<Style<unknown>> {
	const cached = styleCache.get(id)
	if (cached) return cached

	const load = STYLE_LOADERS[id]
	if (!load) return Promise.reject(new Error(`Unknown avatar style: ${id}`))

	const pending = Promise.all([import('@dicebear/core'), load()]).then(
		([{ Style }, definition]) => new Style(definition.default),
	)
	styleCache.set(id, pending)
	return pending
}

/**
 * A style's own name for each variant of one component, in definition order.
 * Read off the loaded definition rather than hard-coded, so a style that gains
 * a hairstyle in a patch release gains it here too.
 */
export async function listAvatarVariants(styleId: string, aspect: string): Promise<string[]> {
	const style = await loadStyle(styleId)
	const component = style.components().get(aspect)
	return component ? [...component.variants().keys()] : []
}

/**
 * DiceBear rejects an option set containing `undefined`, so an unset aspect has
 * to be absent rather than empty — which is also what makes the seed decide it.
 */
function variantOptions(options: Record<string, string>): Record<string, string> {
	const resolved: Record<string, string> = {}
	for (const [aspect, variant] of Object.entries(options)) {
		if (variant) resolved[`${aspect}Variant`] = variant
	}
	return resolved
}

/**
 * Render one avatar. Returns the SVG as a `data:` URI because that is the form
 * both the database and the `<img>` want; `projectAvatarSrc` is the only thing
 * allowed to hand it to the DOM.
 *
 * The background is left to the style. Four of the twelve draw one and eight do
 * not, and overriding that would mean inventing hex colours the design system
 * has no say over — an SVG cannot read a CSS token, so any colour baked in here
 * would be the one place in the frontend that owns a raw colour value.
 */
export async function renderProjectAvatar(
	styleId: string,
	seed: string,
	options: Record<string, string> = {},
): Promise<string> {
	const [style, { Avatar }] = await Promise.all([loadStyle(styleId), import('@dicebear/core')])
	return new Avatar(style, { seed, ...variantOptions(options) }).toDataUri()
}

/**
 * Shuffle rolls this, and it is stored so the same face comes back. Random
 * rather than derived from the project — a project id would make shuffle a
 * no-op, and the title would change the avatar on every rename.
 */
export function randomAvatarSeed(): string {
	const bytes = new Uint8Array(8)
	crypto.getRandomValues(bytes)
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function avatarStyleMeta(styleId?: string | null): ProjectAvatarStyleMeta | undefined {
	return PROJECT_AVATAR_STYLES.find((style) => style.id === styleId)
}
