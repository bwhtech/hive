<template>
	<SettingsHeader title="Appearance" description="How Hive looks on this device." />
	<SettingsBody>
		<div class="flex flex-col gap-8 pt-6">
			<ThemeSwitcher
				name="Hive"
				:logo="LOGO_URL"
				label="Theme"
				description="Pick a look, or follow the system setting."
			/>

			<section>
				<h3 class="text-base font-semibold text-ink-gray-8">Sound</h3>
				<div class="mt-2 divide-y divide-outline-gray-1">
					<SettingsRow
						title="Interaction sounds"
						description="A short cue when a task is completed. Off unless you ask for it."
					>
						<Switch :model-value="enabled" @update:model-value="toggleSound" />
					</SettingsRow>
					<SettingsRow
						v-if="enabled"
						title="Volume"
						description="How loud those cues are."
					>
						<Slider
							class="w-40"
							:model-value="[Math.round(volume * 100)]"
							:min="0"
							:max="100"
							:step="10"
							@update:model-value="onVolumeChange"
							@value-commit="play('tick')"
						/>
					</SettingsRow>
				</div>
			</section>
		</div>
	</SettingsBody>
</template>

<script setup lang="ts">
import {
	SettingsBody,
	SettingsHeader,
	SettingsRow,
	Slider,
	type SliderValue,
	Switch,
	ThemeSwitcher,
} from 'frappe-ui'
import { useSound } from '@/composables/useSound'

/**
 * `ThemeSwitcher` drives `<html data-theme>` through the shared `useColorScheme`
 * singleton, so it needs no wiring — the whole app follows the choice made here.
 */
const LOGO_URL = `${import.meta.env.BASE_URL}images/hive-logo.png`

const { enabled, volume, setSoundEnabled, setSoundVolume, play } = useSound()

function toggleSound(value: boolean) {
	setSoundEnabled(value)
	// Switching sound on should demonstrate itself: `ready` is the palette's
	// "we're live" cue, and it doubles as the browser's first user gesture,
	// which is what unblocks the `AudioContext`.
	if (value) play('ready')
}

/**
 * The slider fires on every step, so the volume applies while dragging; the
 * audible preview waits for `value-commit` rather than chirping all the way
 * across the track.
 */
function onVolumeChange(value: SliderValue | undefined) {
	if (value?.length) setSoundVolume(value[0] / 100)
}
</script>
