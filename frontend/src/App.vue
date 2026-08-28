<template>
	<FrappeUIProvider>
		<AppShell />
	</FrappeUIProvider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { FrappeUIProvider } from 'frappe-ui'
import { bind } from 'cuelume'
import AppShell from '@/components/shell/AppShell.vue'
import { useSound } from '@/composables/useSound'

/**
 * `init()` hands the stored mute/volume preference to cuelume before anything
 * can ask it to play; `bind()` delegates from the document, so this one call
 * covers every `data-cuelume-*` element the app mounts later.
 */
const { init } = useSound()

onMounted(() => {
	init()
	bind()
})
</script>
