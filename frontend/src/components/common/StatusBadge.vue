<template>
	<Badge :theme="statusTheme(status)" :label="status ?? ''" variant="subtle" :size="size" />
</template>

<script setup lang="ts">
import { Badge, type BadgeProps } from 'frappe-ui'
import { statusTheme } from '@/lib/status'
import type { TaskStatus } from '@/types'

withDefaults(defineProps<{ status: TaskStatus | null | undefined; size?: BadgeProps['size'] }>(), {
	size: 'sm',
})
</script>
