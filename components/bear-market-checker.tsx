"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LegionLogo } from "@/components/legion-logo"
import { Spinner } from "@/components/ui/spinner"

interface Result {
  willSurvive: boolean
  username: string
  affirmation: string
  traits: string[]
}

const survivalAffirmations = [
  "Diamond hands forged in the fires of 2022. You've seen -90% and smiled.",
  "Your portfolio may bleed, but your conviction never wavers.",
  "You bought the dip so many times, you forgot what green looks like.",
  "Stacking sats while others panic sell. This is the way.",
  "You've been through Mt. Gox, Luna, FTX. Nothing can break you.",
  "Your conviction is your shield. Bear markets are just sales.",
  "HODL isn't just a strategy for you—it's a lifestyle.",
  "While others cry, you DCA. True survivor mentality.",
]

const noSurvivalAffirmations = [
  "Paper hands detected. Consider touching grass during the bear market.",
  "Your portfolio screams 'bought the top'. Bear market will humble you.",
  "Too many moon calls, not enough fundamentals. RIP your portfolio.",
  "You'll be working at McDonald's by Q3. But hey, free fries!",
  "Your leveraged longs have entered the chat... and left immediately.",
  "NGMI vibes detected. The bear market is your final boss.",
  "You're the exit liquidity the whales dream about.",
  "Your trading history reads like a comedy. Bear market will be the finale.",
]

const survivalTraits = [
  "Diamond Hands",
  "DCA Warrior",
  "FUD Resistant",
  "Cycle Veteran",
  "Based Builder",
  "Stack Maximalist",
]

const noSurvivalTraits = [
  "Paper Hands",
  "Top Buyer",
  "Leverage Degen",
  "Panic Seller",
  "CT Brain Rot",
  "Ape In, Cry Out",
]

export function BearMarketChecker() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateResult = useCallback(async () => {
    if (!username.trim()) return

    setIsLoading(true)
    setResult(null)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Deterministic but fun "random" based on username
    const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const willSurvive = hash % 3 !== 0 // ~66% survival rate to keep it fun

    const affirmations = willSurvive ? survivalAffirmations : noSurvivalAffirmations
    const traits = willSurvive ? survivalTraits : noSurvivalTraits

    // Pick random items based on username hash
    const affirmation = affirmations[hash % affirmations.length]
    const selectedTraits = [
      traits[hash % traits.length],
      traits[(hash + 1) % traits.length],
      traits[(hash + 2) % traits.length],
    ]

    setResult({
      willSurvive,
      username: username.trim().replace("@", ""),
      affirmation,
      traits: selectedTraits,
    })

    setIsLoading(false)
  }, [username])

  const downloadAsPng = useCallback(async () => {
    if (!result || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size for high quality
    const width = 1200
    const height = 630
    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, width, height)

    // Border gradient effect
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#c8ff00")
    gradient.addColorStop(1, "#88aa00")
    ctx.strokeStyle = gradient
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, width - 4, height - 4)

    // Inner border
    ctx.strokeStyle = "#222222"
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, width - 40, height - 40)

    // Legion logo (simplified L shape)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(50, 50, 15, 60)
    ctx.fillRect(50, 95, 60, 15)
    ctx.fillStyle = "#c8ff00"
    ctx.fillRect(65, 95, 30, 8)

    // LEGION text
    ctx.font = "bold 24px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#ffffff"
    ctx.fillText("LEGION", 120, 85)

    // Main title
    ctx.font = "bold 48px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#888888"
    ctx.fillText("WILL YOU SURVIVE", width / 2 - 220, 180)
    
    ctx.font = "bold 56px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#ffffff"
    ctx.fillText("THE BEAR MARKET?", width / 2 - 260, 250)

    // Result
    ctx.font = "bold 120px Inter, system-ui, sans-serif"
    ctx.fillStyle = result.willSurvive ? "#c8ff00" : "#ff4444"
    const resultText = result.willSurvive ? "YES" : "NO"
    ctx.fillText(resultText, width / 2 - (result.willSurvive ? 100 : 80), 400)

    // Username
    ctx.font = "32px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#888888"
    ctx.fillText(`@${result.username}`, width / 2 - 80, 460)

    // Affirmation
    ctx.font = "20px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#666666"
    const maxWidth = width - 200
    const words = result.affirmation.split(" ")
    let line = ""
    let y = 520
    
    for (const word of words) {
      const testLine = line + word + " "
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth) {
        ctx.fillText(line, 100, y)
        line = word + " "
        y += 28
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, 100, y)

    // Traits
    ctx.font = "16px Inter, system-ui, sans-serif"
    const traitsText = result.traits.join(" • ")
    ctx.fillStyle = result.willSurvive ? "#c8ff00" : "#ff4444"
    ctx.fillText(traitsText, width / 2 - ctx.measureText(traitsText).width / 2, 590)

    // legion.cc watermark
    ctx.font = "18px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#444444"
    ctx.fillText("legion.cc", width - 120, height - 30)

    // Download
    const link = document.createElement("a")
    link.download = `bear-market-${result.username}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [result])

  const reset = () => {
    setResult(null)
    setUsername("")
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {!result ? (
        <div className="space-y-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
              @
            </span>
            <Input
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateResult()}
              className="pl-10 h-14 text-lg bg-[#111111] border-[#222222] focus:border-[#c8ff00] focus:ring-[#c8ff00] placeholder:text-[#444444]"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={generateResult}
            disabled={!username.trim() || isLoading}
            className="w-full h-14 text-lg font-bold bg-[#c8ff00] text-black hover:bg-[#a8df00] disabled:bg-[#333333] disabled:text-[#666666] transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Spinner className="w-5 h-5" />
                <span>Analyzing your fate...</span>
              </div>
            ) : (
              "Check Your Survival"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Result Card */}
          <div
            ref={resultRef}
            className="relative p-8 rounded-xl border-2 overflow-hidden"
            style={{
              backgroundColor: "#111111",
              borderColor: result.willSurvive ? "#c8ff00" : "#ff4444",
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl"
              style={{
                background: result.willSurvive
                  ? "radial-gradient(circle at center, #c8ff00 0%, transparent 70%)"
                  : "radial-gradient(circle at center, #ff4444 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 text-center space-y-6">
              {/* Username */}
              <p className="text-muted-foreground text-lg">@{result.username}</p>

              {/* Big Result */}
              <div
                className="text-7xl md:text-8xl font-black tracking-tight"
                style={{ color: result.willSurvive ? "#c8ff00" : "#ff4444" }}
              >
                {result.willSurvive ? "YES" : "NO"}
              </div>

              {/* Affirmation */}
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                {result.affirmation}
              </p>

              {/* Traits */}
              <div className="flex flex-wrap justify-center gap-2">
                {result.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 rounded-full text-sm font-medium border"
                    style={{
                      borderColor: result.willSurvive ? "#c8ff00" : "#ff4444",
                      color: result.willSurvive ? "#c8ff00" : "#ff4444",
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Legion Badge */}
              <div className="pt-4 flex justify-center">
                <div className="flex items-center gap-2 text-[#444444]">
                  <LegionLogo size={20} />
                  <span className="text-sm">legion.cc</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={downloadAsPng}
              className="flex-1 h-12 font-bold bg-[#c8ff00] text-black hover:bg-[#a8df00]"
            >
              Download PNG
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="flex-1 h-12 font-bold border-[#333333] hover:bg-[#1a1a1a] text-white"
            >
              Try Another
            </Button>
          </div>

          {/* Hidden canvas for PNG generation */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  )
}
