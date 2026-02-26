import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import confetti from "canvas-confetti"

interface CelebrationContextValue {
  celebrate: () => void
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null)

export function useCelebration() {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error("useCelebration must be used within CelebrationProvider")
  return ctx
}

function CelebrationOverlay({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  if (!visible) return null

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      onAnimationEnd={onDone}
    >
      {/* Lottie character sliding up from bottom-left */}
      <div className="absolute bottom-0 left-4 animate-celebration-slide-up">
        <DotLottieReact
          src="https://lottie.host/41939115-11a3-4f76-90ec-48d4424041f3/h5f7MdMijX.lottie"
          autoplay
          style={{ width: 320, height: 320 }}
        />
      </div>
    </div>,
    document.body,
  )
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const celebrate = useCallback(() => {
    // Prevent overlapping celebrations
    if (visible) return

    setVisible(true)

    // Confetti burst from bottom-left
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.1, y: 0.9 },
      colors: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd"],
    })

    // Play celebration sound
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/hive/sounds/task-complete.mp3")
        audioRef.current.volume = 0.5
      }
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    } catch {
      // Audio playback may be blocked by browser policy — ignore
    }

    // Auto-dismiss after 3 seconds
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setVisible(false)
    }, 3000)
  }, [visible])

  const handleDone = useCallback(() => {
    // Animation ended — cleanup if timer already elapsed
  }, [])

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      <CelebrationOverlay visible={visible} onDone={handleDone} />
    </CelebrationContext.Provider>
  )
}
