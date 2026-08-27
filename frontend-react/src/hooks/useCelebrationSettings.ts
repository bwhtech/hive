import { useSyncExternalStore } from "react"

const ANIMATION_KEY = "hive:celebration-animation"
const SOUND_KEY = "hive:celebration-sound"
const SOUND_VARIANT_KEY = "hive:celebration-sound-variant"

export const SOUND_VARIANTS = [
  { value: "victory", label: "Victory Fanfare", src: "/assets/bwh_hive/frontend/sounds/victory.wav" },
  { value: "task-complete", label: "Task Complete Ding", src: "/assets/bwh_hive/frontend/sounds/task-complete.mp3" },
] as const

export type SoundVariant = (typeof SOUND_VARIANTS)[number]["value"]

const DEFAULT_SOUND_VARIANT: SoundVariant = "victory"

function isSoundVariant(v: string | null): v is SoundVariant {
  return v !== null && SOUND_VARIANTS.some((s) => s.value === v)
}

function getBoolSnapshot(key: string, defaultValue: boolean): () => boolean {
  return () => {
    const v = localStorage.getItem(key)
    return v === null ? defaultValue : v === "true"
  }
}

function getSoundVariantSnapshot(): SoundVariant {
  const v = localStorage.getItem(SOUND_VARIANT_KEY)
  return isSoundVariant(v) ? v : DEFAULT_SOUND_VARIANT
}

const subscribers = new Set<() => void>()
function subscribe(cb: () => void) {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}

export function notify() {
  subscribers.forEach((cb) => cb())
}

export const CELEBRATION_KEYS = { ANIMATION_KEY, SOUND_KEY, SOUND_VARIANT_KEY } as const

export function useCelebrationSettings() {
  const animation = useSyncExternalStore(subscribe, getBoolSnapshot(ANIMATION_KEY, true))
  const sound = useSyncExternalStore(subscribe, getBoolSnapshot(SOUND_KEY, true))
  const soundVariant = useSyncExternalStore(subscribe, getSoundVariantSnapshot)
  return { animation, sound, soundVariant }
}

export function getSoundVariantSrc(variant: SoundVariant): string {
  const match = SOUND_VARIANTS.find((s) => s.value === variant)
  return match ? match.src : SOUND_VARIANTS[0].src
}
