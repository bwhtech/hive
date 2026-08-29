<template>
	<Teleport to="body">
		<div
			class="pointer-events-none fixed left-0 top-0 z-50"
			:style="{ width: `${width}px`, transform: translate }"
			aria-hidden="true"
		>
			<!-- Cards behind the top one, fanned so a multi-card drag reads as
			     a stack rather than a single thicker card. -->
			<div
				v-for="(layer, index) in layers"
				:key="index"
				class="absolute inset-0 rounded-4 border border-outline-gray-2 bg-surface-elevation-1 shadow-lg"
				:style="{ transform: layer }"
			/>

			<div class="relative rotate-3 drop-shadow-xl">
				<TaskBoardCard :task="tasks[0]" :assignees="assignees" preview />
				<Badge
					v-if="tasks.length > 1"
					class="absolute -right-2 -top-2"
					variant="solid"
					theme="gray"
					:label="String(tasks.length)"
				/>
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from 'frappe-ui'
import TaskBoardCard from '@/components/tasks/TaskBoardCard.vue'
import type { HiveTask, HiveTaskAssignee } from '@/types'

const props = defineProps<{
	/** The picked cards, top one first. */
	tasks: HiveTask[]
	assignees: HiveTaskAssignee[]
	/** Pointer position, and where inside the card it grabbed. */
	point: { x: number; y: number }
	offset: { x: number; y: number }
	width: number
}>()

/** More than three fanned cards stop reading as a stack and start as a mess. */
const MAX_LAYERS = 3

const translate = computed(
	() =>
		`translate3d(${props.point.x - props.offset.x}px, ${props.point.y - props.offset.y}px, 0)`,
)

const layers = computed(() =>
	Array.from({ length: Math.min(props.tasks.length - 1, MAX_LAYERS) }, (_, index) => {
		const depth = index + 1
		return `translate(${depth * -4}px, ${depth * 4}px) rotate(${depth * -3}deg)`
	}).reverse(),
)
</script>
