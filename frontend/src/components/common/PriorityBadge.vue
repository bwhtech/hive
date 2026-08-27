<template>
	<Badge :theme="priorityTheme(priority)" :label="priority ?? ''" variant="subtle" :size="size" />
</template>

<script setup lang="ts">
import { Badge, type BadgeProps } from 'frappe-ui'
import { priorityTheme } from '@/lib/status'
import type { TaskPriority } from '@/types'

withDefaults(
	defineProps<{ priority: TaskPriority | null | undefined; size?: BadgeProps['size'] }>(),
	{ size: 'sm' },
)
</script>
