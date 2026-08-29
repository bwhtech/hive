import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import type { HiveTask } from '@/types'

/** Pointer travel that separates a click on a card from a drag of it. */
const THRESHOLD = 5
/** A touch has to rest this long before it drags instead of scrolling. */
const HOLD_MS = 350
/** Distance from a board edge at which the board starts scrolling itself. */
const EDGE = 72
const EDGE_SPEED = 18
/** A drop fires `click` on whatever sits under the pointer; ignore that one. */
const CLICK_GRACE_MS = 250

export interface BoardDragOptions {
	/** The column elements to hit-test, keyed by the status each one holds. */
	columns: () => Record<string, HTMLElement | null>
	/** The horizontally scrolling board viewport, for edge auto-scroll. */
	scroller: () => HTMLElement | null
	/** Every card on the board, in the order it is rendered. */
	tasks: () => HiveTask[]
	/** Called once with the whole picked set when it lands on a column. */
	onDrop: (tasks: HiveTask[], status: string) => void
	/** Clients see the board but cannot move or select cards. */
	disabled: () => boolean
}

interface Pending {
	task: HiveTask
	card: HTMLElement
	x: number
	y: number
	/** Where inside the card the pointer sits, so the preview does not jump. */
	dx: number
	dy: number
	touch: boolean
	/** A touch only becomes a drag after the hold; a mouse is armed at once. */
	held: boolean
}

/**
 * Cmd/Ctrl-click selection plus pointer dragging for the task board.
 *
 * The DOM is never reordered. The board persists status, not position, so a
 * drop only reports which column the pointer ended over and lets the card list
 * re-derive itself. That keeps the picked cards sitting still in their old
 * column while a preview element follows the pointer.
 */
export function useBoardDrag(options: BoardDragOptions) {
	const selection = ref(new Set<string>())
	const dragging = shallowRef<HiveTask[] | null>(null)
	const width = ref(0)
	const point = ref({ x: 0, y: 0 })
	const offset = ref({ x: 0, y: 0 })
	const over = ref<string | null>(null)

	let pending: Pending | null = null
	let holdTimer: number | undefined
	let frame = 0
	let scrollStep = 0
	let droppedAt = 0

	function isSelected(name: string) {
		return selection.value.has(name)
	}

	function isDragging(name: string) {
		return dragging.value?.some((task) => task.name === name) ?? false
	}

	function toggle(name: string) {
		if (selection.value.has(name)) selection.value.delete(name)
		else selection.value.add(name)
	}

	function clear() {
		selection.value.clear()
	}

	function press(event: PointerEvent, task: HiveTask) {
		if (options.disabled() || event.button !== 0) return
		// The pin button and the PR link own their own clicks.
		if ((event.target as HTMLElement).closest('a, button')) return

		const card = event.currentTarget as HTMLElement
		const box = card.getBoundingClientRect()
		pending = {
			task,
			card,
			x: event.clientX,
			y: event.clientY,
			dx: event.clientX - box.left,
			dy: event.clientY - box.top,
			touch: event.pointerType === 'touch',
			held: event.pointerType !== 'touch',
		}
		point.value = { x: event.clientX, y: event.clientY }

		if (pending.touch) {
			holdTimer = window.setTimeout(() => {
				if (!pending) return
				pending.held = true
				begin()
			}, HOLD_MS)
		}

		window.addEventListener('pointermove', move)
		window.addEventListener('pointerup', release)
		window.addEventListener('pointercancel', end)
	}

	/**
	 * Reports whether the card should open. A modifier-click toggles selection
	 * instead, and the click that trails a drop is swallowed.
	 */
	function click(event: MouseEvent, task: HiveTask): boolean {
		if (Date.now() - droppedAt < CLICK_GRACE_MS) return false
		if (!options.disabled() && (event.metaKey || event.ctrlKey)) {
			toggle(task.name)
			return false
		}
		clear()
		return true
	}

	function move(event: PointerEvent) {
		if (!pending) return
		point.value = { x: event.clientX, y: event.clientY }

		if (!dragging.value) {
			const travelled = Math.hypot(event.clientX - pending.x, event.clientY - pending.y)
			if (travelled <= THRESHOLD) return
			// A touch that moves before the hold is a scroll, not a drag.
			if (!pending.held) return end()
			begin()
		}

		over.value = columnAt(event.clientX, event.clientY)
		const box = options.scroller()?.getBoundingClientRect()
		scrollStep = 0
		if (!box) return
		if (event.clientX < box.left + EDGE) scrollStep = -EDGE_SPEED
		else if (event.clientX > box.right - EDGE) scrollStep = EDGE_SPEED
	}

	function begin() {
		if (!pending || dragging.value) return
		window.clearTimeout(holdTimer)

		const picked =
			selection.value.size > 1 && selection.value.has(pending.task.name)
				? options.tasks().filter((task) => selection.value.has(task.name))
				: [pending.task]
		// Dragging a card outside the selection drops the selection with it.
		if (picked.length === 1) clear()

		width.value = pending.card.getBoundingClientRect().width
		offset.value = { x: pending.dx, y: pending.dy }
		dragging.value = picked
		over.value = columnAt(point.value.x, point.value.y)

		document.body.classList.add('select-none', 'cursor-grabbing')
		// Held touches would otherwise pan the board out from under the drag.
		document.addEventListener('touchmove', blockScroll, { passive: false })
		frame = requestAnimationFrame(autoScroll)
	}

	function release() {
		const picked = dragging.value
		const status = over.value
		end()
		if (!picked) return
		droppedAt = Date.now()
		clear()
		if (status) options.onDrop(picked, status)
	}

	function end() {
		window.clearTimeout(holdTimer)
		window.removeEventListener('pointermove', move)
		window.removeEventListener('pointerup', release)
		window.removeEventListener('pointercancel', end)
		document.removeEventListener('touchmove', blockScroll)
		document.body.classList.remove('select-none', 'cursor-grabbing')
		cancelAnimationFrame(frame)
		pending = null
		dragging.value = null
		over.value = null
		scrollStep = 0
	}

	function columnAt(x: number, y: number): string | null {
		for (const [status, el] of Object.entries(options.columns())) {
			if (!el) continue
			const box = el.getBoundingClientRect()
			if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) return status
		}
		return null
	}

	function autoScroll() {
		frame = requestAnimationFrame(autoScroll)
		if (scrollStep) options.scroller()?.scrollBy({ left: scrollStep })
	}

	function blockScroll(event: TouchEvent) {
		event.preventDefault()
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return
		if (dragging.value) end()
		else clear()
	}

	onMounted(() => window.addEventListener('keydown', onKeydown))
	onBeforeUnmount(() => {
		window.removeEventListener('keydown', onKeydown)
		end()
	})

	return {
		selection,
		dragging,
		over,
		point,
		offset,
		width,
		isSelected,
		isDragging,
		press,
		click,
		clear,
	}
}
