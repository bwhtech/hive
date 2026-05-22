import { createContext, use, useState, useCallback, useRef, useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import type { DotLottie } from "@lottiefiles/dotlottie-web"
import { motion } from "motion/react"
import confetti from "canvas-confetti"
import { useCelebrationSettings, getSoundVariantSrc } from "@/hooks/useCelebrationSettings"

const LOTTIE_SRC = "/assets/bwh_hive/frontend/sounds/celebration.lottie"

interface CelebrationContextValue {
  celebrate: () => void
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null)

export function useCelebration() {
  const ctx = use(CelebrationContext)
  if (!ctx) throw new Error("useCelebration must be used within CelebrationProvider")
  return ctx
}

function CelebrationOverlay({ visible }: { visible: boolean }) {
  const lottieRef = useRef<DotLottie | null>(null)
  const [shown, setShown] = useState(false)

  // Keep container visible during exit animation, then hide after it completes
  useEffect(() => {
    if (visible) {
      setShown(true)
    } else if (shown) {
      const timer = setTimeout(() => setShown(false), 600)
      return () => clearTimeout(timer)
    }
  }, [visible, shown])

  // When celebration starts, rewind and play the Lottie from frame 0
  useEffect(() => {
    if (visible && lottieRef.current) {
      lottieRef.current.setFrame(0)
      lottieRef.current.play()
    }
  }, [visible])

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ visibility: shown ? "visible" : "hidden" }}
    >
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-64"
        animate={visible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        initial={false}
        transition={visible
          ? { type: "spring", stiffness: 120, damping: 14, mass: 1 }
          : { type: "spring", stiffness: 200, damping: 26 }
        }
      >
        <DotLottieReact
          src={LOTTIE_SRC}
          autoplay={false}
          loop
          dotLottieRefCallback={(dotLottie) => { lottieRef.current = dotLottie }}
          style={{ width: 320, height: 320 }}
        />
      </motion.div>
    </div>,
    document.body,
  )
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const dismissRef = useRef<ReturnType<typeof setTimeout>>()
  const fadeRef = useRef<ReturnType<typeof setTimeout>>()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { animation: animationEnabled, sound: soundEnabled, soundVariant } = useCelebrationSettings()

  useEffect(() => {
    audioRef.current = new Audio(getSoundVariantSrc(soundVariant))
    audioRef.current.preload = "auto"
  }, [soundVariant])

  const celebrate = useCallback(() => {
    if (!animationEnabled && !soundEnabled) return
    if (visible) return

    if (animationEnabled) {
      setVisible(true)

      // Confetti burst
      const isMobile = window.innerWidth < 768
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: isMobile ? 0.5 : 0.25, y: 0.9 },
        colors: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd"],
      })

      // Auto-dismiss overlay after 5 seconds
      if (dismissRef.current) clearTimeout(dismissRef.current)
      dismissRef.current = setTimeout(() => {
        setVisible(false)
      }, 5000)
    }

    if (soundEnabled) {
      try {
        const audio = audioRef.current
        if (audio) {
          audio.volume = 0.5
          audio.currentTime = 0
          audio.play().catch(() => {})

          // Start fading out after 3s (over the last 2s)
          if (fadeRef.current) clearTimeout(fadeRef.current)
          fadeRef.current = setTimeout(() => {
            const fadeSteps = 40
            const fadeInterval = 2000 / fadeSteps
            let step = 0
            const fade = setInterval(() => {
              step++
              audio.volume = Math.max(0, 0.5 * (1 - step / fadeSteps))
              if (step >= fadeSteps) {
                clearInterval(fade)
                audio.pause()
              }
            }, fadeInterval)
          }, 3000)
        }
      } catch {
        // Audio playback may be blocked by browser policy — ignore
      }
    }
  }, [visible, animationEnabled, soundEnabled])

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      <CelebrationOverlay visible={visible} />
    </CelebrationContext.Provider>
  )
}
