import { useSyncExternalStore } from "react"

const ANIMATION_KEY = "hive:celebration-animation"
const SOUND_KEY = "hive:celebration-sound"

function getSnapshot(key: string, defaultValue: boolean): () => boolean {
  return () => {
    const v = localStorage.getItem(key)
    return v === null ? defaultValue : v === "true"
  }
}

const subscribers = new Set<() => void>()
function subscribe(cb: () => void) {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}

export function notify() {
  subscribers.forEach((cb) => cb())
}

export const CELEBRATION_KEYS = { ANIMATION_KEY, SOUND_KEY } as const

export function useCelebrationSettings() {
  const animation = useSyncExternalStore(subscribe, getSnapshot(ANIMATION_KEY, true))
  const sound = useSyncExternalStore(subscribe, getSnapshot(SOUND_KEY, true))
  return { animation, sound }
}
