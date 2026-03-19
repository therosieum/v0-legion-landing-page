"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"

// ─── Quiz data ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    question: "You wake up. First thing you do?",
    options: [
      { label: "Check price", score: 1 },
      { label: "Open X", score: 2 },
      { label: "I didn't sleep", score: 0 },
      { label: "Kiss my partner and check price", score: 3 },
    ],
  },
  {
    id: 2,
    question: "X now requires you to label any project post as a paid partnership. You...",
    options: [
      { label: "Label everything — not dying on this hill", score: 3 },
      { label: "Post anyway and pretend I didn't see the new TOS", score: 1 },
      { label: "I stopped posting about projects, easier", score: 2 },
      { label: "I was never getting paid anyway so nothing changed", score: 0 },
    ],
  },
  {
    id: 3,
    question: "Your dev just said he's leaving crypto for AI. You...",
    options: [
      { label: "Respect it", score: 3 },
      { label: "Ask if he needs a cofounder", score: 2 },
      { label: "He's going to regret this in 18 months and I will say nothing", score: 2 },
      { label: "I'm also leaving", score: 0 },
    ],
  },
  {
    id: 4,
    question: "You open CT. Everyone is posting the same thing again. You...",
    options: [
      { label: "Post it too", score: 0 },
      { label: "Close the app and reopen it immediately", score: 1 },
      { label: "I wrote the original", score: 3 },
      { label: "I've accepted this is just what it is now", score: 2 },
    ],
  },
  {
    id: 5,
    question: "Your FYP is 90% content you don't care about. You...",
    options: [
      { label: "Keep scrolling anyway", score: 1 },
      { label: "I curated my following list for 3 years and it still looks like TikTok", score: 2 },
      { label: "WE ARE COOKED", score: 0 },
      { label: "I haven't looked up in a while", score: 1 },
    ],
  },
  {
    id: 6,
    question: "A founder just rugged. You go on Ethos and...",
    options: [
      { label: "Slash immediately, max credibility burned", score: 3 },
      { label: "I check if anyone else already slashed first", score: 1 },
      { label: "I vouch. I don't understand my own behavior.", score: 0 },
      { label: "I close the tab. Not my problem anymore.", score: 2 },
    ],
  },
  {
    id: 7,
    question: "A suit just got hired for a role that used to go to a degen. You feel...",
    options: [
      { label: "It's fine, the industry is maturing", score: 3 },
      { label: "I am the degen who didn't get the role", score: 1 },
      { label: "I am the suit", score: 2 },
      { label: "I've started updating my LinkedIn", score: 0 },
    ],
  },
  {
    id: 8,
    question: "Why are you still in crypto?",
    options: [
      { label: "I genuinely believe in it", score: 3 },
      { label: "I've already told too many people I'm in crypto", score: 1 },
      { label: "We are still early", score: 2 },
      { label: "I love all my CT friends", score: 2 },
    ],
  },
]

const MAX_SCORE = QUESTIONS.reduce((acc, q) => acc + Math.max(...q.options.map((o) => o.score)), 0)

// ─── Result copy ───────────────────────────────────────────────────────────────

type Tier = "survivor" | "likely" | "edge" | "risk" | "cooked"

function getTier(pct: number): Tier {
  if (pct >= 82) return "survivor"
  if (pct >= 62) return "likely"
  if (pct >= 42) return "edge"
  if (pct >= 22) return "risk"
  return "cooked"
}

const TIER_LABEL: Record<Tier, string> = {
  survivor: "You're built for this",
  likely: "Lowkey gonna make it",
  edge: "Too close to call",
  risk: "Not looking great",
  cooked: "Absolutely cooked",
}

const TIER_QUOTES: Record<Tier, string[]> = {
  survivor: [
    "You're not just surviving — you're the person others are watching to decide if they should panic.",
    "You've seen the cycle enough times that the bear market is basically just a sale you prepared for.",
    "Honestly? You might be the only person in CT who will look back at this period without regret.",
    "You're treating the bear market like a gym membership — showing up while everyone else cancels.",
  ],
  likely: [
    "You'll make it, but you're going to have a few very dark Sunday evenings first.",
    "Solid fundamentals, questionable sleep schedule. You're probably fine.",
    "The bear market isn't going to break you. Your group chat might, but not the market.",
    "You have the right instincts. You just need to stop checking prices at 2am.",
  ],
  edge: [
    "The outcome is genuinely unclear and that's kind of the honest answer here.",
    "You're going to be okay, but only if you stop making decisions based on the CT mood.",
    "50/50. The next three months are basically a personality test you haven't studied for.",
    "You could go either way. The question is which version of you shows up when it matters.",
  ],
  risk: [
    "You're still in it for the right reasons, but your habits are actively working against you.",
    "The bear market isn't your real problem. Your real problem is your relationship with this app.",
    "You have enough self-awareness to know you're not okay. That's actually step one.",
    "Honestly, a 30-day CT detox might be worth more than any trade you'll make this quarter.",
  ],
  cooked: [
    "This isn't a roast, it's a wellness check. Please close the app and eat something.",
    "You're not going to make it through the bear market, but you might make it through the day. Focus on that.",
    "The bear market didn't do this to you. You were already like this before it got here.",
    "At some point optimism becomes a coping mechanism. You've crossed that line. Respect, honestly.",
  ],
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface QuizResult {
  pct: number
  tier: Tier
  quote: string
  answers: number[]
}

// ─── Canvas PNG export ─────────────────────────────────────────────────────────

async function generateShareImage(result: QuizResult): Promise<string> {
  const W = 1200
  const H = 630
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!

  // Load background image
  const bgImg = new window.Image()
  bgImg.crossOrigin = "anonymous"
  bgImg.src = "/result-bg.png"

  await new Promise((resolve) => {
    bgImg.onload = resolve
    bgImg.onerror = resolve
  })

  // Draw background
  if (bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.drawImage(bgImg, 0, 0, W, H)
  } else {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, W, H)
  }

  // Semi-transparent overlay for text readability
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
  ctx.fillRect(0, 0, W, H)

  const ACCENT = "#F03C24"
  const WHITE = "#FAFAFA"
  const GREY = "#888888"

  // Title at top
  ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.textAlign = "center"
  ctx.fillText("Will you survive the bear market?", W / 2, 80)

  // Big percentage in center
  ctx.font = `bold 180px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  ctx.fillStyle = ACCENT
  ctx.textAlign = "center"
  ctx.fillText(`${result.pct}%`, W / 2, 300)

  // Tier label
  ctx.font = "600 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.fillText(TIER_LABEL[result.tier], W / 2, 360)

  // Quote — wrapped
  ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = GREY
  ctx.textAlign = "center"
  const maxW = W - 200
  const words = result.quote.split(" ")
  let line = ""
  let qy = 420
  for (const word of words) {
    const test = line + word + " "
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), W / 2, qy)
      qy += 30
      line = word + " "
    } else line = test
  }
  if (line.trim()) ctx.fillText(line.trim(), W / 2, qy)

  // LEGION text at bottom (matching the image)
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.letterSpacing = "4px"
  ctx.textAlign = "center"
  ctx.fillText("LEGION", W / 2, H - 40)

  return canvas.toDataURL("image/png")
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function BearMarketChecker() {
  const [step, setStep] = useState<"start" | "quiz" | "result">("start")
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showQuestion, setShowQuestion] = useState(true)
  const [animatedPct, setAnimatedPct] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const question = QUESTIONS[current]

  // Animate percentage on result
  useEffect(() => {
    if (step === "result" && result) {
      setAnimatedPct(0)
      const target = result.pct
      const duration = 1500
      const start = performance.now()
      const animate = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setAnimatedPct(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }
  }, [step, result])

  const advance = useCallback((optionIndex: number, currentAnswers: number[]) => {
    setIsTransitioning(true)
    setShowQuestion(false)

    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setAnswers(currentAnswers)
        setCurrent((c) => c + 1)
        setSelected(null)
        setShowQuestion(true)
        setIsTransitioning(false)
        // Scroll the quiz container into view smoothly
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 50)
      } else {
        const totalScore = currentAnswers.reduce((acc, answerIdx, qIdx) => {
          return acc + QUESTIONS[qIdx].options[answerIdx].score
        }, 0)
        const pct = Math.round((totalScore / MAX_SCORE) * 100)
        const tier = getTier(pct)
        const quotes = TIER_QUOTES[tier]
        const fingerprint = currentAnswers.reduce((a, b) => a + b, 0)
        const quote = quotes[fingerprint % quotes.length]
        setResult({ pct, tier, quote, answers: currentAnswers })
        setStep("result")
        setIsTransitioning(false)
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 50)
      }
    }, 350)
  }, [current])

  const handleSelect = useCallback((optionIndex: number) => {
    if (isTransitioning) return
    setSelected(optionIndex)
    // Auto-advance after a short delay so the selection highlight is visible
    const newAnswers = [...answers, optionIndex]
    setTimeout(() => advance(optionIndex, newAnswers), 400)
  }, [isTransitioning, answers, advance])

  const reset = () => {
    setStep("start")
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setResult(null)
    setIsTransitioning(false)
    setShowQuestion(true)
  }

  const handleDownload = useCallback(async () => {
    if (!result) return
    const dataUrl = await generateShareImage(result)
    const a = document.createElement("a")
    a.download = `bear-market-survival-${result.pct}.png`
    a.href = dataUrl
    a.click()
  }, [result])

  // ── Start screen ──
  if (step === "start") {
    return (
      <div className="w-full animate-in fade-in duration-500">
        <button
          onClick={() => setStep("quiz")}
          className="w-full px-6 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Take the quiz
        </button>
      </div>
    )
  }

  // ── Result screen ──
  if (step === "result" && result) {
    return (
      <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Card with Legion background */}
        <div 
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundImage: 'url(/result-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          <div className="relative pt-6 pb-8 px-8 flex flex-col items-center space-y-4">
            {/* Legion logo top */}
            <div className="w-full flex justify-center mb-2">
              <Image
                src="/legion-logo.svg"
                alt="Legion"
                width={100}
                height={28}
                style={{ width: "auto", height: "24px" }}
                className="brightness-0 invert"
              />
            </div>

            {/* Title */}
            <p className="text-white/60 text-sm">Will you survive the bear market?</p>

            {/* Big percentage */}
            <p 
              className="text-[120px] md:text-[140px] font-bold leading-none tracking-tighter animate-in zoom-in duration-700"
              style={{ color: "#F03C24" }}
            >
              {animatedPct}%
            </p>

            {/* Tier label */}
            <p className="text-white text-2xl font-semibold animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              {TIER_LABEL[result.tier]}
            </p>

            {/* Progress bar */}
            <div className="w-full max-w-xs bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animatedPct}%`, backgroundColor: "#F03C24" }}
              />
            </div>

            {/* Quote */}
            <p className="text-gray-400 text-base max-w-md text-center leading-relaxed pt-2 animate-in fade-in duration-500 delay-500">
              {result.quote}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <button
            onClick={handleDownload}
            className="w-full px-6 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            Share on X
          </button>
          <button
            onClick={reset}
            className="w-full px-6 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:border-white/40 hover:bg-white/5 transition-all duration-200"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz screen ──
  return (
    <div ref={containerRef} className="w-full space-y-5">
      {/* Progress */}
      <div className="space-y-2 animate-in fade-in duration-300">
        <div className="flex justify-between text-sm text-white/40">
          <span>{current + 1} / {QUESTIONS.length}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%`, backgroundColor: "#F03C24" }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        className={`border border-white/10 rounded-2xl p-6 bg-black/50 backdrop-blur-sm space-y-5 transition-all duration-300 ${
          showQuestion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-white text-xl font-medium leading-snug">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={isTransitioning}
              className={`w-full text-left px-5 py-4 rounded-xl border text-base transition-all duration-200 ${
                selected === i
                  ? "border-[#F03C24] text-white bg-[#F03C24]/15 scale-[1.01]"
                  : "border-white/10 text-gray-300 hover:border-white/30 hover:text-white hover:bg-white/5 bg-transparent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
