<template>
	<Popover v-model:open="open">
		<template #trigger>
			<slot :open="open">
				<!-- The testid keeps its original `project-` name: the component
				     serves two doctypes now, but the specs that reach for the
				     trigger predate the rename and there is one trigger. -->
				<button
					type="button"
					class="rounded-2 ring-outline-gray-3 hover:ring-2"
					aria-label="Icon and color"
					data-testid="project-icon-trigger"
				>
					<IdentityAvatar
						:icon="icon"
						:color="color"
						:avatar="avatar?.svg"
						size="xl"
						hide-tooltip
					/>
				</button>
			</slot>
		</template>
		<template #default>
			<div class="w-64 space-y-3 p-3">
				<!-- An icon and an avatar are alternatives, not layers, so the
				     control that picks between them is a value control and the
				     panels follow — hence TabButtons rather than Tabs.
				     The testid sits on a wrapper because TabButtons declares
				     `inheritAttrs: false` and never re-emits `$attrs`. -->
				<div data-testid="project-identity-tabs">
					<TabButtons v-model="mode" :options="MODE_OPTIONS" fluid />
				</div>

				<template v-if="mode === 'icon'">
					<!-- Swatches are the avatar itself in each tint, so the row
					     doubles as a preview of the icon currently selected. -->
					<div class="flex items-center justify-between">
						<button
							v-for="swatch in PROJECT_COLORS"
							:key="swatch"
							type="button"
							class="rounded-3 p-1 ring-inset hover:bg-surface-gray-2"
							:class="swatch === color ? 'ring-2 ring-outline-gray-3' : ''"
							:aria-label="swatch"
							:aria-pressed="swatch === color"
							@click="color = swatch"
						>
							<IdentityAvatar :icon="icon" :color="swatch" size="lg" hide-tooltip />
						</button>
					</div>

					<div class="grid grid-cols-7 gap-0.5">
						<button
							v-for="name in PROJECT_ICONS"
							:key="name"
							type="button"
							class="grid size-8 place-items-center rounded-3 text-ink-gray-7 hover:bg-surface-gray-2"
							:class="name === icon ? 'bg-surface-gray-2' : ''"
							:aria-label="name"
							:aria-pressed="name === icon"
							@click="pickIcon(name)"
						>
							<span :class="[projectIconClass(name), 'size-4']" aria-hidden="true" />
						</button>
					</div>
				</template>

				<template v-else>
					<div class="flex items-center gap-3">
						<IdentityAvatar
							:avatar="avatar?.svg"
							:icon="icon"
							:color="color"
							size="3xl"
							hide-tooltip
						/>
						<Button
							class="flex-1"
							icon-left="lucide-shuffle"
							label="Shuffle"
							:loading="rendering"
							data-testid="project-avatar-shuffle"
							@click="shuffle"
						/>
					</div>

					<Select
						v-model="styleId"
						label="Style"
						size="sm"
						:options="STYLE_OPTIONS"
						data-testid="project-avatar-style"
					/>

					<!-- Two knobs per style, no more. DiceBear exposes dozens of
					     options per style and a form over all of them is worse
					     than a shuffle button; these are the components that
					     change who the avatar looks like. "Random" leaves the
					     component to the seed, which is what shuffle re-rolls. -->
					<Select
						v-for="aspect in aspects"
						:key="aspect.key"
						:model-value="chosen[aspect.key] ?? ''"
						:label="aspect.label"
						size="sm"
						:options="aspectOptions(aspect.key)"
						@update:model-value="pickVariant(aspect.key, String($event))"
					/>
				</template>
			</div>
		</template>
	</Popover>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Popover, Select, TabButtons } from 'frappe-ui'
import IdentityAvatar from '@/components/common/IdentityAvatar.vue'
import {
	avatarStyleMeta,
	DEFAULT_PROJECT_AVATAR_STYLE,
	listAvatarVariants,
	PROJECT_AVATAR_STYLES,
	randomAvatarSeed,
	renderProjectAvatar,
	type ProjectAvatarValue,
} from '@/lib/dicebear'
import { PROJECT_COLORS, PROJECT_ICONS, projectIconClass, type ProjectColor } from '@/lib/project'

/**
 * The whole of a record's visual identity: a curated lucide grid with colour
 * swatches, or a DiceBear avatar with a shuffle button. Curated on purpose on
 * both sides — a search over all of lucide is a worse choice than twenty-eight
 * names that all read as a project, and the same goes for DiceBear's 61 styles.
 *
 * One picker for every doctype that has an identity — `Hive Project` and
 * `Hive View` today. The models below are flat fields rather than a document,
 * so a caller only has to store the six fields under the same names.
 *
 * Generation runs in the browser through `lib/dicebear`, so shuffle is instant
 * and nothing about a record's avatar reaches a third-party server.
 */
const icon = defineModel<string>('icon', { default: '' })
const color = defineModel<ProjectColor | ''>('color', { default: '' })

/**
 * The three DiceBear fields travel as one object rather than three models: they
 * are only ever written together, and a half-applied avatar — an SVG with no
 * seed — is not a state the picker should be able to produce. `null` means the
 * record uses its icon.
 */
const avatar = defineModel<ProjectAvatarValue | null>('avatar', { default: null })

const open = ref(false)

defineSlots<{
	/** Custom trigger. Receives `{ open }`. */
	default?: (props: { open: boolean }) => unknown
}>()

const MODE_OPTIONS = [
	{ label: 'Icon', value: 'icon' },
	{ label: 'Avatar', value: 'avatar' },
]

const STYLE_OPTIONS = PROJECT_AVATAR_STYLES.map((style) => ({
	label: style.label,
	value: style.id,
}))

const mode = ref<string | number>(avatar.value ? 'avatar' : 'icon')
// `||`, not `??`: a row can carry an SVG with an empty style or seed — written
// by hand or by a REST client — and an empty style id loads nothing, so a
// shuffle would fail on a record that looks fine on screen.
const styleId = ref<string>(avatar.value?.style || DEFAULT_PROJECT_AVATAR_STYLE)
const seed = ref<string>(avatar.value?.seed || randomAvatarSeed())
const chosen = ref<Record<string, string>>({ ...(avatar.value?.options ?? {}) })
const rendering = ref(false)

/** Variant names per component, filled once the style definition has loaded. */
const variants = ref<Record<string, string[]>>({})

/**
 * Only the newest render may write to the model. Style definitions arrive at
 * very different speeds — 13 kB for Dylan against 373 kB for Notionists — so a
 * fast second choice can otherwise be overwritten by a slow first one.
 */
let renderToken = 0

const styleMeta = computed(() => avatarStyleMeta(styleId.value) ?? PROJECT_AVATAR_STYLES[0])
const aspects = computed(() => styleMeta.value.aspects)

// Colour is a one-click tweak you may want to repeat, so only the icon — the
// choice that finishes the job — closes the popover.
function pickIcon(name: string) {
	icon.value = name
	open.value = false
}

function aspectOptions(aspect: string) {
	return [
		{ label: 'Random', value: '' },
		...(variants.value[aspect] ?? []).map((variant) => ({
			label: humanize(variant),
			value: variant,
		})),
	]
}

/** `tearDrop` → `Tear Drop`, `variant01` → `Variant 01`. */
function humanize(variant: string): string {
	return variant
		.replace(/([a-z])([A-Z0-9])/g, '$1 $2')
		.replace(/^./, (first) => first.toUpperCase())
}

function shuffle() {
	seed.value = randomAvatarSeed()
	// Hand-picked variants survive a shuffle on purpose: pinning the hair and
	// then re-rolling everything else is the reason to have both controls.
	void render()
}

function pickVariant(aspect: string, variant: string) {
	if (variant) chosen.value[aspect] = variant
	else delete chosen.value[aspect]
	void render()
}

/**
 * A failed roll — a style chunk that would not download, say — keeps whatever
 * avatar is already on screen rather than clearing it, so a flaky network
 * costs the user a shuffle and not their choice.
 */
async function render() {
	const token = ++renderToken
	rendering.value = true
	try {
		const svg = await renderProjectAvatar(styleId.value, seed.value, chosen.value)
		if (token !== renderToken) return
		avatar.value = {
			svg,
			style: styleId.value,
			seed: seed.value,
			options: { ...chosen.value },
		}
	} catch (error) {
		console.error('Could not generate avatar', error)
	} finally {
		if (token === renderToken) rendering.value = false
	}
}

async function loadVariants(id: string) {
	const meta = avatarStyleMeta(id)
	if (!meta) return
	try {
		const lists = await Promise.all(
			meta.aspects.map((aspect) => listAvatarVariants(id, aspect.key)),
		)
		if (id !== styleId.value) return
		variants.value = Object.fromEntries(
			meta.aspects.map((aspect, index) => [aspect.key, lists[index]]),
		)
	} catch (error) {
		// The selects fall back to "Random" only, which still generates.
		console.error('Could not load avatar options', error)
	}
}

watch(styleId, (id) => {
	// Variants are named per style, so a pin on the old style's hair means
	// nothing to the new one; dropping them beats rendering a silent no-op.
	chosen.value = {}
	variants.value = {}
	void loadVariants(id)
	void render()
})

/**
 * The tab is the choice. Landing on "Avatar" with nothing generated yet gives
 * you one straight away — an empty panel with a shuffle button would be asking
 * the user to press a button to see what the tab is for. Going back to "Icon"
 * clears the field, because `IdentityAvatar` prefers an avatar whenever one is
 * set; the last one is kept in memory so flipping between tabs is free.
 */
let lastAvatar: ProjectAvatarValue | null = avatar.value

watch(mode, (next) => {
	if (next === 'avatar') {
		void loadVariants(styleId.value)
		if (lastAvatar) avatar.value = lastAvatar
		else void render()
		return
	}
	lastAvatar = avatar.value
	avatar.value = null
})

watch(avatar, (value) => {
	if (value) lastAvatar = value
})

// A record that already has an avatar opens straight onto the avatar panel,
// which the `mode` watcher never sees. `loadStyle` caches, so re-opening the
// popover costs nothing.
watch(open, (isOpen) => {
	if (isOpen && mode.value === 'avatar') void loadVariants(styleId.value)
})
</script>
