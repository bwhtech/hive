import { onScopeDispose, ref, watch, type Ref } from 'vue'

/** How wide each edge fade grows to, in px. */
const FADE = 40
/** Sub-pixel scroll sizes are never exactly equal; ignore the remainder. */
const EPSILON = 1

/**
 * A `mask-image` that fades whichever edges of a scroller still have content
 * past them, so a cut-off row reads as scrollable instead of chopped.
 *
 * Each fade grows with the distance left to scroll on that side, which means
 * it eases in and out with the scroll itself — no transition to animate, and
 * no fade at an edge you have already reached.
 */
export function useScrollFade(
	element: Ref<HTMLElement | null | undefined>,
	orientation: 'horizontal' | 'vertical' = 'horizontal',
) {
	const mask = ref('none')
	const horizontal = orientation === 'horizontal'

	function update() {
		const el = element.value
		if (!el) return

		const scrollSize = horizontal ? el.scrollWidth : el.scrollHeight
		const clientSize = horizontal ? el.clientWidth : el.clientHeight
		const offset = horizontal ? el.scrollLeft : el.scrollTop
		const overflow = scrollSize - clientSize

		if (overflow <= EPSILON) {
			mask.value = 'none'
			return
		}

		const start = Math.round(Math.min(offset, FADE))
		const end = Math.round(Math.min(overflow - offset, FADE))
		const direction = horizontal ? 'to right' : 'to bottom'
		mask.value =
			`linear-gradient(${direction}, transparent 0, #000 ${start}px, ` +
			`#000 calc(100% - ${end}px), transparent 100%)`
	}

	let observer: ResizeObserver | null = null

	function detach(el: HTMLElement) {
		el.removeEventListener('scroll', update)
		observer?.disconnect()
		observer = null
	}

	watch(
		element,
		(el, previous) => {
			if (previous) detach(previous)
			if (!el) return
			el.addEventListener('scroll', update, { passive: true })
			// The viewport resizes with the window; its child resizes when
			// columns or cards come and go. Both change what overflows.
			observer = new ResizeObserver(update)
			observer.observe(el)
			if (el.firstElementChild) observer.observe(el.firstElementChild)
			update()
		},
		{ immediate: true },
	)

	onScopeDispose(() => {
		if (element.value) detach(element.value)
	})

	return { mask, update }
}
