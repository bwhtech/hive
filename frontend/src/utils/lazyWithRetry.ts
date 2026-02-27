import { lazy, type ComponentType } from "react"

const RETRY_KEY = "chunk_retry_reloaded"

/**
 * Wraps React.lazy with automatic page reload on chunk load failure.
 * After a deployment, browsers may cache stale chunk URLs with old hashes.
 * This detects the failure and does a single hard reload to fetch fresh assets.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(() =>
    factory().catch((error: unknown) => {
      const alreadyRetried = sessionStorage.getItem(RETRY_KEY)
      if (!alreadyRetried) {
        sessionStorage.setItem(RETRY_KEY, "1")
        window.location.reload()
        // Return a never-resolving promise to prevent React from rendering while reloading
        return new Promise(() => {})
      }
      // Already retried once — clear flag and throw so ErrorBoundary catches it
      sessionStorage.removeItem(RETRY_KEY)
      throw error
    }),
  )
}
