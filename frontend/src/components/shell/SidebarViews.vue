<template>
	<!--
		Saved "Hive View" links. W5 owns the content of this section; until it
		lands the section renders nothing so the sidebar has no empty heading.
	-->
	<SidebarSection v-if="false" label="Views" collapsible />
</template>

<script setup lang="ts">
import { SidebarSection } from 'frappe-ui'
</script>
