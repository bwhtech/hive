import confetti from 'canvas-confetti'

/**
 * The one celebration left after the Lottie/sound settings were cut — a short
 * confetti burst when a task lands on Done.
 */
export function useCelebrate() {
	function celebrate() {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		confetti({
			particleCount: 80,
			spread: 70,
			startVelocity: 35,
			ticks: 120,
			origin: { y: 0.7 },
			disableForReducedMotion: true,
		})
	}

	return { celebrate }
}
