"use client"

import { useState, useCallback } from "react"
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

// Quotes keyed by (tier, answer combo fingerprint) — we pick by raw score mod length
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
  const H = 675
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!

  const ACCENT = "#F03C24"
  const BG = "#000000"
  const WHITE = "#FAFAFA"
  const GREY = "#888888"
  const DARK = "#1a1a1a"

  // Background
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // Subtle grid lines
  ctx.strokeStyle = "#111111"
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // Card
  const cx = 80, cy = 60, cw = W - 160, ch = H - 120
  ctx.fillStyle = "#050505"
  ctx.beginPath()
  ctx.roundRect(cx, cy, cw, ch, 12)
  ctx.fill()
  ctx.strokeStyle = "#222222"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(cx, cy, cw, ch, 12)
  ctx.stroke()

  // Accent top bar
  ctx.fillStyle = ACCENT
  ctx.beginPath()
  ctx.roundRect(cx, cy, cw, 3, [3, 3, 0, 0])
  ctx.fill()

  // Legion logo (text fallback since we can't load external SVGs easily in canvas)
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.textAlign = "left"
  ctx.fillText("LEGION", cx + 36, cy + 44)

  // Title
  ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = GREY
  ctx.textAlign = "center"
  ctx.fillText("Will you survive the bear market?", W / 2, cy + 44)

  // Big percentage
  ctx.font = `bold 148px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  ctx.fillStyle = ACCENT
  ctx.textAlign = "center"
  ctx.fillText(`${result.pct}%`, W / 2, cy + 240)

  // Tier label
  ctx.font = "600 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.fillText(TIER_LABEL[result.tier], W / 2, cy + 286)

  // Progress bar
  const bx = cx + 100, by = cy + 316, bw = cw - 200, bh = 5
  ctx.fillStyle = DARK
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 3); ctx.fill()
  ctx.fillStyle = ACCENT
  ctx.beginPath(); ctx.roundRect(bx, by, bw * (result.pct / 100), bh, 3); ctx.fill()

  // Quote — wrapped
  ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = GREY
  ctx.textAlign = "center"
  const maxW = cw - 160
  const words = result.quote.split(" ")
  let line = ""
  let qy = cy + 362
  for (const word of words) {
    const test = line + word + " "
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), W / 2, qy)
      qy += 28
      line = word + " "
    } else line = test
  }
  if (line.trim()) ctx.fillText(line.trim(), W / 2, qy)

  // Bottom: legion.cc
  ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = "#444444"
  ctx.textAlign = "center"
  ctx.fillText("legion.cc", W / 2, cy + ch - 22)

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

  const question = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  const handleSelect = useCallback((optionIndex: number) => {
    if (isTransitioning) return
    setSelected(optionIndex)
  }, [isTransitioning])

  const handleNext = useCallback(() => {
    if (selected === null || isTransitioning) return
    setIsTransitioning(true)
    const newAnswers = [...answers, selected]

    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setAnswers(newAnswers)
        setCurrent((c) => c + 1)
        setSelected(null)
        setIsTransitioning(false)
      } else {
        // Calculate result
        const totalScore = newAnswers.reduce((acc, answerIdx, qIdx) => {
          return acc + QUESTIONS[qIdx].options[answerIdx].score
        }, 0)
        const pct = Math.round((totalScore / MAX_SCORE) * 100)
        const tier = getTier(pct)
        const quotes = TIER_QUOTES[tier]
        // pick quote based on answer pattern
        const fingerprint = newAnswers.reduce((a, b) => a + b, 0)
        const quote = quotes[fingerprint % quotes.length]
        setResult({ pct, tier, quote, answers: newAnswers })
        setStep("result")
        setIsTransitioning(false)
      }
    }, 200)
  }, [selected, answers, current, isTransitioning])

  const reset = () => {
    setStep("start")
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setResult(null)
    setIsTransitioning(false)
  }

  const handleDownload = useCallback(async () => {
    if (!result) return
    const dataUrl = await generateShareImage(result)
    const a = document.createElement("a")
    a.download = `bear-market-survival.png`
    a.href = dataUrl
    a.click()
  }, [result])

  // ── Start screen ──
  if (step === "start") {
    return (
      <div className="w-full">
        <button
          onClick={() => setStep("quiz")}
          className="w-full px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          Take the quiz
        </button>
      </div>
    )
  }

  // ── Result screen ──
  if (step === "result" && result) {
    return (
      <div className="w-full space-y-5 text-center">
        {/* Card */}
        <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-black">
          {/* Accent top line */}
          <div className="h-0.5 w-full bg-[#F03C24]" />

          {/* Legion logo top-left */}
          <div className="absolute top-4 left-5">
            <Image
              src="/legion-logo.svg"
              alt="Legion"
              width={80}
              height={22}
              className="h-5 w-auto brightness-0 invert opacity-60"
            />
          </div>

          <div className="pt-14 pb-10 px-8 flex flex-col items-center space-y-4">
            {/* Big percentage */}
            <p className="text-8xl font-bold leading-none" style={{ color: "#F03C24" }}>
              {result.pct}%
            </p>

            {/* Tier label */}
            <p className="text-white text-xl font-semibold">{TIER_LABEL[result.tier]}</p>

            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-1">
              <div
                className="h-1 rounded-full transition-all duration-1000"
                style={{ width: `${result.pct}%`, backgroundColor: "#F03C24" }}
              />
            </div>

            {/* Quote */}
            <p className="text-gray-400 text-base max-w-md leading-relaxed pt-1">
              {result.quote}
            </p>

            {/* legion.cc */}
            <p className="text-white/20 text-xs pt-2">legion.cc</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="w-full px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Share on X
          </button>
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-transparent border border-white/20 text-white rounded-full font-bold hover:border-white/40 transition-colors"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz screen ──
  return (
    <div className="w-full space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/40">
          <span>{current + 1} / {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-0.5">
          <div
            className="h-0.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: "#F03C24" }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="border border-white/10 rounded-2xl p-6 bg-black space-y-5">
        <p className="text-white text-lg font-medium leading-snug">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                selected === i
                  ? "border-[#F03C24] text-white bg-[#F03C24]/10"
                  : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white bg-transparent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={selected === null || isTransitioning}
        className="w-full px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {current === QUESTIONS.length - 1 ? "See my result" : "Next"}
      </button>
    </div>
  )
}
