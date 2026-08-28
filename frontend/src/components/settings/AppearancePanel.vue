<template>
	<SettingsHeader title="Appearance" description="How Hive looks on this device." />
	<SettingsBody>
		<div class="pt-6">
			<ThemeSwitcher
				name="Hive"
				:logo="LOGO_URL"
				label="Theme"
				description="Pick a look, or follow the system setting."
			/>
		</div>
	</SettingsBody>
</template>

<script setup lang="ts">
import { SettingsBody, SettingsHeader, ThemeSwitcher } from 'frappe-ui'

/**
 * `ThemeSwitcher` drives `<html data-theme>` through the shared `useColorScheme`
 * singleton, so it needs no wiring — the whole app follows the choice made here.
 */
const LOGO_URL = `${import.meta.env.BASE_URL}images/hive-logo.png`
</script>
