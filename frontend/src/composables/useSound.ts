import { ref } from 'vue'
import { play as cuelumePlay, setEnabled, setVolume, type SoundName } from 'cuelume'
import { STORAGE_KEYS, readStorage, writeStorage } from '@/lib/storage'

/**
 * The app's only door to cuelume. Everything else calls `play()` from here so
 * the mute setting is honoured in one place and cuelume — which deliberately
 * persists nothing — is fed from our own storage.
 *
 * Sound is OFF until the user asks for it in Settings › Appearance. A work tool
 * that starts making noise on its own is hostile, and a first visit is exactly
 * when the user is least prepared for it.
 */
const DEFAULT_ENABLED = false

/** Half volume: audible next to a video call, not startling in a quiet room. */
const DEFAULT_VOLUME = 0.5

function clamp(value: number) {
	return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : DEFAULT_VOLUME
}

const enabled = ref(readStorage<boolean>(STORAGE_KEYS.soundEnabled, DEFAULT_ENABLED))
const volume = ref(clamp(readStorage<number>(STORAGE_KEYS.soundVolume, DEFAULT_VOLUME)))

/**
 * Sound is a nicety, never a requirement: a browser that blocks autoplay, an
 * exhausted `AudioContext` or a missing Web Audio implementation must never
 * take a user action down with it.
 */
function safely(action: () => void) {
	try {
		action()
	} catch {
		/* no audio here — carry on silently */
	}
}

export function useSound() {
	/** Pushes the stored preference into cuelume. Called once from `App.vue`. */
	function init() {
		safely(() => {
			setEnabled(enabled.value)
			setVolume(volume.value)
		})
	}

	function setSoundEnabled(value: boolean) {
		enabled.value = value
		writeStorage(STORAGE_KEYS.soundEnabled, value)
		safely(() => setEnabled(value))
	}

	function setSoundVolume(value: number) {
		const next = clamp(value)
		volume.value = next
		writeStorage(STORAGE_KEYS.soundVolume, next)
		safely(() => setVolume(next))
	}

	/**
	 * Checking `enabled` here as well as in cuelume keeps callers honest when
	 * `init()` has not run yet — cuelume's own default is unmuted.
	 */
	function play(name: SoundName) {
		if (!enabled.value) return
		safely(() => cuelumePlay(name))
	}

	return { enabled, volume, init, setSoundEnabled, setSoundVolume, play }
}
