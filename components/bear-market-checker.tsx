"use client"

import { useState, useRef, useCallback } from "react"

interface Result {
  willSurvive: boolean
  username: string
  headline: string
  traits: string[]
}

const SURVIVE_HEADLINES = [
  "Diamond hands forged in 2022. You've seen −90% and smiled.",
  "You DCA'd through Luna, FTX, and Three Arrows. Unbreakable.",
  "Stacking sats while others panic-sold. This is the way.",
  "You've weathered every capitulation event. Nothing phases you.",
  "Your conviction is your shield. Bear markets are just discounts.",
  "HODL isn't a strategy for you — it's a personality trait.",
  "You've survived the purge. Weak hands wanted you out. They failed.",
  "The cycle will reward you. It always rewards the patient ones.",
]

const NO_SURVIVE_HEADLINES = [
  "Paper hands detected. The bear market will humble you.",
  "Too many moon calls, not enough fundamentals. RIP portfolio.",
  "You're the exit liquidity the whales dreamed about.",
  "Leverage degen energy. The liquidation cascade is coming.",
  "Bought the top, will sell the bottom. Classic retail behavior.",
  "NGMI. The bear market is your final boss and you are under-leveled.",
  "Your portfolio reads like a cautionary tale. Screenshot it now.",
  "You'll be working at McDonald's by Q3. At least it's fiat.",
]

const SURVIVE_TRAITS = [
  "Diamond Hands",
  "DCA Warrior",
  "FUD Resistant",
  "Cycle Veteran",
  "Based Builder",
  "Stack Maximalist",
]

const NO_SURVIVE_TRAITS = [
  "Paper Hands",
  "Top Buyer",
  "Leverage Degen",
  "Panic Seller",
  "CT Brain Rot",
  "Moon Chaser",
]

function hashUsername(s: string): number {
  return s.toLowerCase().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
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
  const GREY = "#999999"

  // Background
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // Center box
  const boxX = 150
  const boxY = 100
  const boxW = W - 300
  const boxH = H - 200
  
  // Box border
  ctx.strokeStyle = GREY
  ctx.lineWidth = 2
  ctx.strokeRect(boxX, boxY, boxW, boxH)

  // Title
  ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.textAlign = "center"
  ctx.fillText("Will you survive the bear market?", W / 2, boxY + 50)

  // Big verdict
  ctx.font = "bold 120px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = ACCENT
  const verdictText = result.willSurvive ? "YES" : "NO"
  ctx.fillText(verdictText, W / 2, boxY + 220)

  // Username
  ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = GREY
  ctx.fillText(`@${result.username}`, W / 2, boxY + 270)

  // Headline
  ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = WHITE
  ctx.textAlign = "center"
  const maxW = boxW - 60
  const words = result.headline.split(" ")
  let line = ""
  let y = boxY + 330
  for (const word of words) {
    const test = line + word + " "
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), W / 2, y)
      y += 28
      line = word + " "
    } else {
      line = test
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), W / 2, y)

  // Traits
  ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = ACCENT
  const traitsStr = result.traits.join(" • ")
  ctx.fillText(traitsStr, W / 2, boxY + boxH - 30)

  // Legion logo at bottom
  ctx.font = "12px monospace"
  ctx.fillStyle = GREY
  ctx.textAlign = "center"
  ctx.fillText("legion.cc", W / 2, H - 20)

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

    await new Promise((r) => setTimeout(r, 1200))

    const h = hashUsername(raw)
    const willSurvive = h % 3 !== 0
    const headlines = willSurvive ? SURVIVE_HEADLINES : NO_SURVIVE_HEADLINES
    const pool = willSurvive ? SURVIVE_TRAITS : NO_SURVIVE_TRAITS
    const headline = headlines[h % headlines.length]
    const traits = [pool[h % pool.length], pool[(h + 2) % pool.length], pool[(h + 4) % pool.length]]

    setResult({ willSurvive, username: raw, headline, traits })
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

  const accentColor = result?.willSurvive ? "#F03C24" : "#EF4444"

  if (result) {
    return (
      <div className="w-full space-y-6 text-center">
        {/* Result Preview Box */}
        <div className="border-2 border-gray-600 rounded-2xl p-12 bg-black min-h-72 flex flex-col items-center justify-center space-y-6">
          <p className="text-gray-400 text-sm">Your result</p>
          <h2 className="text-6xl font-bold" style={{ color: accentColor }}>
            {result.willSurvive ? "YES" : "NO"}
          </h2>
          <p className="text-gray-300 text-lg max-w-md">{result.headline}</p>
          <p className="text-gray-500 text-sm">{result.traits.join(" • ")}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={handleDownload}
            className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
          >
            Download Result
          </button>
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-transparent border-2 border-gray-600 text-white rounded-full font-semibold hover:border-gray-400 transition-colors"
          >
            Try Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Input Box */}
      <div className="border-2 border-gray-600 rounded-2xl p-4 bg-black">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your X username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateResult()}
          className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-center text-lg"
          autoFocus
        />
      </div>

      {/* Button */}
      <button
        onClick={generateResult}
        disabled={!username.trim() || isLoading}
        className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Checking..." : "Check Your Fate"}
      </button>
    </div>
  )
}
