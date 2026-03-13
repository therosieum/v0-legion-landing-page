"use client"

import { useState, useRef, useCallback } from "react"

interface Result {
  score: number
  username: string
  headline: string
  traits: string[]
  label: string
}

// Score tiers
function getTier(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "You're locked in", color: "#F03C24" }
  if (score >= 60) return { label: "Lowkey gonna make it", color: "#F03C24" }
  if (score >= 40) return { label: "It's giving 50/50", color: "#BBBBBB" }
  if (score >= 20) return { label: "Not looking good", color: "#BBBBBB" }
  return { label: "Absolutely cooked", color: "#555555" }
}

const HEADLINES: Record<string, string[]> = {
  high: [
    "You're actually locked in. The bear can't touch this.",
    "POV: you bought the dip and the dip respected you back.",
    "Main character energy but make it financial literacy.",
    "No thoughts, just stacking. Respect.",
    "Your portfolio is giving... stability? In this economy?",
  ],
  mid_high: [
    "Lowkey gonna make it. Just don't check your portfolio at 3am.",
    "You're cooked but like, medium rare. Still edible.",
    "Giving survivor but with a few therapy sessions needed.",
    "You'll make it out, just maybe with a few trust issues.",
  ],
  mid: [
    "It's giving 50/50. Flip a coin bestie.",
    "The math isn't mathing but it's not NOT mathing either.",
    "You're on thin ice but at least you're skating.",
    "Real talk? Could go either way. Stay hydrated.",
  ],
  low: [
    "Not you being the exit liquidity. Embarrassing for you.",
    "Tell me you bought the top without telling me you bought the top.",
    "Your portfolio said 'I'm tired' and honestly same.",
    "This is giving... financial ruin? Get help.",
  ],
  very_low: [
    "Be so fr rn. Your bags aren't making it.",
    "The bear market saw your portfolio and laughed.",
    "No cap, this is giving charity case.",
    "Chronically online but financially offline. Tragic.",
  ],
}

const TRAITS_BY_TIER: Record<string, string[]> = {
  high: ["Locked In", "Unbothered", "Actually Literate", "Zero Panic", "Built Different", "Touch Grass Investor"],
  mid_high: ["Lowkey Solid", "Slight Panic", "Mostly Chill", "Occasional Doom Check"],
  mid: ["50/50 Energy", "Trust Issues", "Chaotic Neutral", "Vibes Only Investor"],
  low: ["Exit Liquidity", "Chronically Online", "Top Buyer", "CT Brain Rot"],
  very_low: ["Absolutely Cooked", "Down Bad", "No Recovery Arc", "Bag Fumbler"],
}

function hashUsername(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i)
  }
  return Math.abs(h)
}

function computeScore(raw: string): number {
  const h = hashUsername(raw)
  // Multiple signals derived from username characteristics
  const lengthScore = Math.min(raw.length / 20, 1) * 20        // longer = more experienced
  const numericPenalty = (raw.replace(/\D/g, "").length / raw.length) * 15  // lots of numbers = degen
  const variedChars = new Set(raw.toLowerCase()).size
  const diversityScore = Math.min(variedChars / 10, 1) * 20    // varied chars = diverse thinking
  const hashScore = (h % 100) * 0.6                             // pseudo-random base 0–60
  const raw_score = lengthScore + diversityScore + hashScore - numericPenalty
  return Math.min(99, Math.max(1, Math.round(raw_score)))
}

function getHeadlineKey(score: number): keyof typeof HEADLINES {
  if (score >= 80) return "high"
  if (score >= 60) return "mid_high"
  if (score >= 40) return "mid"
  if (score >= 20) return "low"
  return "very_low"
}

async function generateShareImage(result: Result): Promise<string> {
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
  const DARK_GREY = "#333333"

  // Background
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // Center content card
  const boxX = 120
  const boxY = 80
  const boxW = W - 240
  const boxH = H - 160

  ctx.strokeStyle = DARK_GREY
  ctx.lineWidth = 1.5
  ctx.strokeRect(boxX, boxY, boxW, boxH)

  // Title
  ctx.font = "600 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.textAlign = "center"
  ctx.fillText("Will you survive the bear market?", W / 2, boxY + 56)

  // Username
  ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = GREY
  ctx.fillText(`@${result.username}`, W / 2, boxY + 94)

  // Big percentage
  ctx.font = `bold 130px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  ctx.fillStyle = ACCENT
  ctx.fillText(`${result.score}%`, W / 2, boxY + 260)

  // Label
  ctx.font = "600 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.fillText(result.label, W / 2, boxY + 305)

  // Progress bar background
  const barX = boxX + 80
  const barY = boxY + 340
  const barW = boxW - 160
  const barH = 6
  ctx.fillStyle = DARK_GREY
  ctx.beginPath()
  ctx.roundRect(barX, barY, barW, barH, 3)
  ctx.fill()

  // Progress bar fill
  ctx.fillStyle = ACCENT
  ctx.beginPath()
  ctx.roundRect(barX, barY, barW * (result.score / 100), barH, 3)
  ctx.fill()

  // Headline text (wrap)
  ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = GREY
  ctx.textAlign = "center"
  const maxTextW = boxW - 120
  const words = result.headline.split(" ")
  let line = ""
  let y = boxY + 390
  for (const word of words) {
    const test = line + word + " "
    if (ctx.measureText(test).width > maxTextW && line) {
      ctx.fillText(line.trim(), W / 2, y)
      y += 26
      line = word + " "
    } else {
      line = test
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), W / 2, y)

  // Traits
  ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = DARK_GREY
  ctx.fillText(result.traits.join("  ·  "), W / 2, boxY + boxH - 40)

  // Legion wordmark bottom
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = GREY
  ctx.fillText("LEGION", W / 2, H - 22)

  return canvas.toDataURL("image/png")
}

export function BearMarketChecker() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateResult = useCallback(async () => {
    const raw = username.trim().replace(/^@/, "")
    if (!raw) return
    setIsLoading(true)
    setResult(null)

    await new Promise((r) => setTimeout(r, 1400))

    const score = computeScore(raw)
    const key = getHeadlineKey(score)
    const h = hashUsername(raw)
    const headlines = HEADLINES[key]
    const pool = TRAITS_BY_TIER[key]
    const headline = headlines[h % headlines.length]
    const traits = [pool[h % pool.length], pool[(h + 1) % pool.length], pool[(h + 2) % pool.length]]
    const { label } = getTier(score)

    setResult({ score, username: raw, headline, traits, label })
    setIsLoading(false)
  }, [username])

  const handleDownload = useCallback(async () => {
    if (!result) return
    const dataUrl = await generateShareImage(result)
    const a = document.createElement("a")
    a.download = `bear-market-${result.username}.png`
    a.href = dataUrl
    a.click()
  }, [result])

  const reset = () => {
    setResult(null)
    setUsername("")
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  if (result) {
    const { label, color } = getTier(result.score)
    return (
      <div className="w-full space-y-6 text-center">
        {/* Result preview box */}
        <div className="border border-gray-800 rounded-2xl p-10 bg-black flex flex-col items-center space-y-5">
          <p className="text-gray-500 text-sm">@{result.username}</p>

          {/* Score */}
          <p className="text-8xl font-bold" style={{ color: "#F03C24" }}>
            {result.score}%
          </p>

          {/* Label */}
          <p className="text-white text-xl font-semibold">{label}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${result.score}%`, backgroundColor: "#F03C24" }}
            />
          </div>

          {/* Headline */}
          <p className="text-gray-400 text-base max-w-md leading-relaxed">{result.headline}</p>

          {/* Traits */}
          <p className="text-gray-600 text-sm">{result.traits.join(" · ")}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
          >
            Download result
          </button>
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-transparent border border-gray-700 text-white rounded-full font-semibold hover:border-gray-500 transition-colors"
          >
            Try another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Input */}
      <div className="border border-gray-800 rounded-2xl p-4 bg-black">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your X username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateResult()}
          className="w-full bg-transparent text-white placeholder-gray-600 outline-none text-center text-lg"
          autoFocus
        />
      </div>

      {/* CTA */}
      <button
        onClick={generateResult}
        disabled={!username.trim() || isLoading}
        className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Calculating..." : "Check your survival rate"}
      </button>
    </div>
  )
}
