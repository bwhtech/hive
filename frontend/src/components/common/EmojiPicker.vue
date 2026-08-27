<template>
	<Popover v-model:open="open">
		<template #trigger>
			<slot :open="open">
				<Button variant="ghost" :label="modelValue || 'Pick emoji'" />
			</slot>
		</template>
		<template #default>
			<div class="grid w-64 grid-cols-8 gap-0.5">
				<button
					v-for="emoji in EMOJI"
					:key="emoji"
					type="button"
					class="grid size-7 place-items-center rounded-3 text-lg hover:bg-surface-gray-2"
					:aria-label="emoji"
					@click="pick(emoji)"
				>
					{{ emoji }}
				</button>
			</div>
		</template>
	</Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Popover } from 'frappe-ui'

/**
 * A fixed grid rather than a full emoji library: the only pickers in the app
 * are saved-view icons and update reactions.
 */
const EMOJI = [
	'😀',
	'😄',
	'😅',
	'😂',
	'🙂',
	'😉',
	'😍',
	'🤩',
	'🤔',
	'🙌',
	'👏',
	'👍',
	'👎',
	'🙏',
	'💪',
	'🔥',
	'✨',
	'🎉',
	'🚀',
	'⚡',
	'💡',
	'📌',
	'📎',
	'📁',
	'📅',
	'⏰',
	'✅',
	'☑️',
	'❗',
	'❓',
	'⚠️',
	'🐛',
	'🛠️',
	'🧪',
	'📈',
	'📉',
	'💬',
	'📝',
	'🔍',
	'🔒',
	'🌱',
	'🌟',
	'❤️',
	'💜',
	'💙',
	'💚',
	'🧡',
	'🖤',
	'☕',
	'🍕',
	'🎯',
	'🏁',
	'🥳',
	'😎',
	'👀',
	'🤝',
]

const open = ref(false)
const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{ select: [emoji: string] }>()

defineSlots<{
	/** Custom trigger. Receives `{ open }`. */
	default?: (props: { open: boolean }) => unknown
}>()

function pick(emoji: string) {
	modelValue.value = emoji
	emit('select', emoji)
	open.value = false
}
</script>
