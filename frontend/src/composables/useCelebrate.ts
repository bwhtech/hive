import confetti from 'canvas-confetti'
import { useSound } from '@/composables/useSound'

/**
 * Two cannons, one in each bottom corner, angled inward so their arcs cross
 * over the middle of the screen. A single centre burst read as a puff of dust
 * on a wide monitor; corners give the moment the width it deserves.
 *
 * `startVelocity` is measured in canvas pixels, so it has to be high enough to
 * throw a particle from a corner clear across a 1440px desktop: at 40 the two
 * clouds never met and left a dead gap down the middle, at 55 they cross above
 * the centre. A phone gets the same throw across a much narrower viewport,
 * which simply fills the frame — still correct, never a wall of colour.
 */
const CANNON = {
	/** Per cannon. Split across the full width, 60 each read as drizzle. */
	particleCount: 90,
	spread: 75,
	startVelocity: 55,
	/** Long enough for the arc to peak and fall back out of frame. */
	ticks: 160,
	decay: 0.91,
	scalar: 0.9,
	disableForReducedMotion: true,
}

/**
 * The one celebration left after the Lottie settings were cut — a confetti
 * burst and a short chord when a task lands on Done.
 */
export function useCelebrate() {
	const { play } = useSound()

	function celebrate() {
		// `success` is cuelume's "the thing you asked for worked" chord, and it
		// plays even under reduced motion: that preference is about movement,
		// not about muting feedback the user opted into.
		play('success')

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		confetti({ ...CANNON, angle: 60, origin: { x: 0, y: 1 } })
		confetti({ ...CANNON, angle: 120, origin: { x: 1, y: 1 } })
	}

	return { celebrate }
}
