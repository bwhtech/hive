<template>
	<Popover v-model:open="open">
		<template #trigger>
			<slot :open="open">
				<button
					type="button"
					class="rounded-2 ring-outline-gray-3 hover:ring-2"
					aria-label="Project icon and color"
					data-testid="project-icon-trigger"
				>
					<ProjectAvatar :icon="icon" :color="color" size="xl" hide-tooltip />
				</button>
			</slot>
		</template>
		<template #default>
			<div class="w-64 space-y-3">
				<!-- Swatches are the avatar itself in each tint, so the row doubles
				     as a preview of the icon currently selected. -->
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
						<ProjectAvatar :icon="icon" :color="swatch" size="lg" hide-tooltip />
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
			</div>
		</template>
	</Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Popover } from 'frappe-ui'
import ProjectAvatar from '@/components/common/ProjectAvatar.vue'
import { PROJECT_COLORS, PROJECT_ICONS, projectIconClass, type ProjectColor } from '@/lib/project'

/**
 * Icon grid plus colour swatches for a project's identity. Curated on purpose:
 * a search over all of lucide is a worse choice than twenty-eight names that
 * all read as a project.
 */
const icon = defineModel<string>('icon', { default: '' })
const color = defineModel<ProjectColor | ''>('color', { default: '' })

const open = ref(false)

defineSlots<{
	/** Custom trigger. Receives `{ open }`. */
	default?: (props: { open: boolean }) => unknown
}>()

// Colour is a one-click tweak you may want to repeat, so only the icon — the
// choice that finishes the job — closes the popover.
function pickIcon(name: string) {
	icon.value = name
	open.value = false
}
</script>
