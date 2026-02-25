import { createContext, useContext, useCallback, useState, useRef } from "react"
import confetti from "canvas-confetti"

interface CelebrationContextValue {
  celebrate: () => void
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null)

const PHRASES = [
  "Nice work!",
  "Crushed it!",
  "Ship it!",
  "You're on fire!",
  "Let's gooo!",
  "GG!",
  "Boom!",
  "Easy peasy!",
]

const EMOJIS = ["🎉", "💪", "🚀", "🔥", "⚡", "🏆", "💥", "✨"]

// Web Audio API sound engine
const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : null

let audioCtx: AudioContext | null = null

function ensureAudioCtx() {
  if (!audioCtx && AudioCtx) audioCtx = new AudioCtx()
  if (audioCtx?.state === "suspended") audioCtx.resume()
}

function playCompletionSound() {
  ensureAudioCtx()
  if (!audioCtx) return
  const now = audioCtx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator()
    const gain = audioCtx!.createGain()
    osc.type = "sine"
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, now + i * 0.08)
    gain.gain.linearRampToValueAtTime(0.15, now + i * 0.08 + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.8)
    osc.connect(gain)
    gain.connect(audioCtx!.destination)
    osc.start(now + i * 0.08)
    osc.stop(now + i * 0.08 + 0.9)
  })
  // Sparkle sounds
  for (let i = 0; i < 5; i++) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = "sine"
    osc.frequency.value = 2000 + Math.random() * 3000
    gain.gain.setValueAtTime(0, now + 0.3 + i * 0.06)
    gain.gain.linearRampToValueAtTime(0.04, now + 0.35 + i * 0.06)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + i * 0.06)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now + 0.3 + i * 0.06)
    osc.stop(now + 0.65 + i * 0.06)
  }
}

function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.08, y: 0.9 },
    colors: ["#4ade80", "#22c55e", "#a78bfa", "#f472b6", "#fbbf24", "#fff"],
    ticks: 200,
    gravity: 0.8,
    scalar: 1.2,
  })
  setTimeout(
    () =>
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { x: 0.15, y: 0.85 },
        colors: ["#4ade80", "#22c55e", "#fff"],
        ticks: 150,
      }),
    200,
  )
  setTimeout(
    () =>
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x: 0.03, y: 0.95 },
        colors: ["#fbbf24", "#f472b6", "#a78bfa"],
        ticks: 120,
      }),
    400,
  )
}

function getRandomPhrase() {
  const idx = Math.floor(Math.random() * PHRASES.length)
  return `${PHRASES[idx]} ${EMOJIS[idx]}`
}

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [phrase, setPhrase] = useState("")
  const [flash, setFlash] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const isAnimatingRef = useRef(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    setBouncing(false)
    isAnimatingRef.current = false
  }, [])

  const celebrate = useCallback(() => {
    if (isAnimatingRef.current) {
      // Already celebrating — refresh phrase and re-burst
      setPhrase(getRandomPhrase())
      fireConfetti()
      playCompletionSound()
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(dismiss, 3500)
      return
    }

    isAnimatingRef.current = true
    setPhrase(getRandomPhrase())
    setBouncing(true)

    // Screen flash
    setFlash(true)
    setTimeout(() => setFlash(false), 600)

    // Show character
    setVisible(true)

    // Confetti + sound after character slides in
    setTimeout(() => {
      fireConfetti()
      playCompletionSound()
    }, 300)

    timeoutRef.current = setTimeout(dismiss, 3500)
  }, [dismiss])

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}

      {/* Screen flash */}
      <div
        className="pointer-events-none fixed inset-0 z-[999] transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at 10% 90%, oklch(0.72 0.19 142 / 0.2), transparent 60%)",
          opacity: flash ? 1 : 0,
        }}
      />

      {/* Celebration character container */}
      <div
        className="pointer-events-none fixed left-2.5 z-[1000]"
        style={{
          bottom: visible ? "-10px" : "-260px",
          transition: visible
            ? "bottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "bottom 0.4s cubic-bezier(0.6, -0.28, 0.74, 0.05)",
        }}
      >
        {/* Speech bubble */}
        <div
          className="absolute top-1 left-40 z-[1001] whitespace-nowrap rounded-xl bg-white px-3.5 py-2 text-sm font-bold text-gray-900 shadow-lg"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(0.5) translateY(10px)",
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transitionDelay: visible ? "0.3s" : "0s",
          }}
        >
          {phrase}
          {/* Tail */}
          <div
            className="absolute -bottom-1.5 left-4 size-3 rotate-45 rounded-sm bg-white"
          />
        </div>

        {/* SVG Character */}
        <svg
          viewBox="0 0 100 120"
          className="block size-[200px]"
          style={{
            animation: bouncing ? "celebration-bounce 0.5s ease-in-out infinite" : "none",
          }}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="116" rx="20" ry="4" fill="#0006" />
          {/* Body */}
          <rect x="32" y="58" width="36" height="40" rx="12" fill="oklch(0.65 0.18 132)" />
          <rect x="43" y="68" width="14" height="3" rx="1.5" fill="oklch(0.77 0.20 131)" opacity="0.5" />
          {/* Legs */}
          <rect x="36" y="94" width="11" height="20" rx="5.5" fill="oklch(0.53 0.14 132)" />
          <rect x="53" y="94" width="11" height="20" rx="5.5" fill="oklch(0.53 0.14 132)" />
          {/* Shoes */}
          <ellipse cx="41.5" cy="114" rx="7.5" ry="3.5" fill="#4ade80" />
          <ellipse cx="58.5" cy="114" rx="7.5" ry="3.5" fill="#4ade80" />
          {/* Left arm */}
          <g
            style={{
              transformOrigin: "28px 72px",
              animation: bouncing ? "celebration-wave-l 0.35s ease-in-out infinite alternate" : "none",
            }}
          >
            <rect x="16" y="62" width="18" height="10" rx="5" fill="oklch(0.65 0.18 132)" />
            <circle cx="17" cy="67" r="6" fill="#ffcc80" />
          </g>
          {/* Right arm */}
          <g
            style={{
              transformOrigin: "72px 72px",
              animation: bouncing ? "celebration-wave-r 0.35s ease-in-out infinite alternate" : "none",
            }}
          >
            <rect x="66" y="62" width="18" height="10" rx="5" fill="oklch(0.65 0.18 132)" />
            <circle cx="83" cy="67" r="6" fill="#ffcc80" />
          </g>
          {/* Head */}
          <circle cx="50" cy="38" r="23" fill="#ffcc80" />
          {/* Hair */}
          <path d="M29 32 Q31 14 50 13 Q69 14 71 32 Q69 20 50 18 Q31 20 29 32Z" fill="#4a3a2a" />
          {/* Happy eyes */}
          <path d="M38 36 Q42 32 46 36" stroke="#1a1a24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M54 36 Q58 32 62 36" stroke="#1a1a24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Mouth */}
          <path d="M42 46 Q50 54 58 46" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Blush */}
          <ellipse cx="34" cy="44" rx="5" ry="3" fill="#ff9a9a" opacity="0.4" />
          <ellipse cx="66" cy="44" rx="5" ry="3" fill="#ff9a9a" opacity="0.4" />
        </svg>
      </div>
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error("useCelebration must be used within CelebrationProvider")
  return ctx
}
