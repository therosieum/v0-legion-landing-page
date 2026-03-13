"use client"

import { useState, useRef, useCallback } from "react"
import { LegionMark } from "@/components/legion-logo"

// ─── Data ────────────────────────────────────────────────────────────────────

interface Result {
  willSurvive: boolean
  username: string
  headline: string
  verdict: string
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
  "On-chain Native",
  "Long-term Thinker",
]

const NO_SURVIVE_TRAITS = [
  "Paper Hands",
  "Top Buyer",
  "Leverage Degen",
  "Panic Seller",
  "CT Brain Rot",
  "Moon Chaser",
  "Exit Liquidity",
  "Permabull",
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashUsername(s: string): number {
  return s.toLowerCase().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

// ─── Canvas PNG Generation ────────────────────────────────────────────────────

async function generateShareImage(result: Result): Promise<string> {
  const W = 1200
  const H = 675
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!

  const ACCENT = "#F03C24"
  const BG = "#101010"
  const CARD = "#101010"
  const BORDER = "#1F1F23"
  const WHITE = "#FAFAFA"
  const GREY = "#BBBBBB"
  const accent = result.willSurvive ? ACCENT : "#EF4444"

  // ── Background ──
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // ── Subtle grid ──
  ctx.strokeStyle = "#1A1A1D"
  ctx.lineWidth = 1
  const gridSize = 60
  for (let x = 0; x <= W; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y <= H; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // ── Center card ──
  const cardX = 60, cardY = 60, cardW = W - 120, cardH = H - 120
  ctx.fillStyle = CARD
  ctx.fillRect(cardX, cardY, cardW, cardH)
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 1
  ctx.strokeRect(cardX, cardY, cardW, cardH)

  // ── Accent top bar ──
  ctx.fillStyle = accent
  ctx.fillRect(cardX, cardY, cardW, 4)

  // ── Corner crosses ──
  function drawCross(cx: number, cy: number, r: number) {
    ctx.strokeStyle = BORDER
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke()
  }
  drawCross(cardX, cardY, 10)
  drawCross(cardX + cardW, cardY, 10)
  drawCross(cardX, cardY + cardH, 10)
  drawCross(cardX + cardW, cardY + cardH, 10)

  // ── Legion mark (sword) — drawn manually ──
  function drawSword(x: number, y: number, scale: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)

    // blade
    ctx.fillStyle = WHITE
    roundRect(ctx, -1.5, -18, 3, 24, 1); ctx.fill()
    // crossguard
    roundRect(ctx, -10, 1, 20, 3, 1); ctx.fill()
    // handle
    ctx.fillStyle = LIME
    roundRect(ctx, -1.5, 7, 3, 9, 1); ctx.fill()
    // pommel
    roundRect(ctx, -4, 15, 8, 3, 1.5); ctx.fill()
    // blade tip
    ctx.fillStyle = LIME
    ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(2.5, -12); ctx.lineTo(-2.5, -12); ctx.closePath(); ctx.fill()

    ctx.restore()
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  drawSword(cardX + 36, cardY + 50, 1.6)

  // LEGION wordmark
  ctx.font = "900 20px Inter, system-ui, sans-serif"
  ctx.fillStyle = WHITE
  ctx.letterSpacing = "0.2em"
  ctx.fillText("LEGION", cardX + 58, cardY + 46)
  ctx.letterSpacing = "0"

  // legion.cc
  ctx.font = "500 13px Inter, system-ui, sans-serif"
  ctx.fillStyle = GREY
  ctx.fillText("legion.cc", cardX + 58, cardY + 62)

  // ── Title label ──
  ctx.font = "700 12px Inter, system-ui, sans-serif"
  ctx.fillStyle = GREY
  ctx.fillText("WILL YOU SURVIVE THE BEAR MARKET?", W / 2, cardY + 58)
  const titleMeasure = ctx.measureText("WILL YOU SURVIVE THE BEAR MARKET?")
  ctx.fillText("WILL YOU SURVIVE THE BEAR MARKET?", W / 2 - titleMeasure.width / 2, cardY + 58)

  // ── Big verdict ──
  ctx.font = "900 160px Inter, system-ui, sans-serif"
  ctx.fillStyle = accent
  const verdictText = result.willSurvive ? "YES" : "NO"
  const verdictW = ctx.measureText(verdictText).width
  ctx.fillText(verdictText, W / 2 - verdictW / 2, 360)

  // ── Username ──
  ctx.font = "500 22px Inter, system-ui, sans-serif"
  ctx.fillStyle = GREY
  const userText = `@${result.username}`
  const userW = ctx.measureText(userText).width
  ctx.fillText(userText, W / 2 - userW / 2, 410)

  // ── Divider ──
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2 - 180, 432)
  ctx.lineTo(W / 2 + 180, 432)
  ctx.stroke()

  // ── Headline text (word-wrapped) ──
  ctx.font = "400 18px Inter, system-ui, sans-serif"
  ctx.fillStyle = GREY
  const maxW = 680
  const lineH = 28
  const words = result.headline.split(" ")
  let line = ""
  let ty = 470
  const lines: string[] = []
  for (const word of words) {
    const test = line + word + " "
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line.trim()); line = word + " "
    } else {
      line = test
    }
  }
  if (line.trim()) lines.push(line.trim())
  for (const l of lines) {
    const lw = ctx.measureText(l).width
    ctx.fillText(l, W / 2 - lw / 2, ty)
    ty += lineH
  }

  // ── Traits ──
  ctx.font = "600 12px Inter, system-ui, sans-serif"
  ctx.fillStyle = accent
  const traitsStr = result.traits.join("  ·  ")
  const traitW = ctx.measureText(traitsStr).width
  ctx.fillText(traitsStr, W / 2 - traitW / 2, cardY + cardH - 36)

  // ── Bottom line ──
  ctx.fillStyle = accent
  ctx.fillRect(cardX, cardY + cardH - 4, cardW, 4)

  return canvas.toDataURL("image/png")
}

// ─── Component ───────────────────────────────────────────────────────────────

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

    const h = hashUsername(raw)
    const willSurvive = h % 3 !== 0

    const headlines = willSurvive ? SURVIVE_HEADLINES : NO_SURVIVE_HEADLINES
    const pool = willSurvive ? SURVIVE_TRAITS : NO_SURVIVE_TRAITS
    const headline = headlines[h % headlines.length]
    const traits = [pool[h % pool.length], pool[(h + 2) % pool.length], pool[(h + 4) % pool.length]]
    const verdict = willSurvive ? "Survivor" : "Eliminated"

    setResult({ willSurvive, username: raw, headline, verdict, traits })
    setIsLoading(false)
  }, [username])

  const handleDownload = useCallback(async () => {
    if (!result) return
    const dataUrl = await generateShareImage(result)
    const a = document.createElement("a")
    a.download = `legion-bear-market-${result.username}.png`
    a.href = dataUrl
    a.click()
  }, [result])

  const reset = () => {
    setResult(null)
    setUsername("")
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const accent = result?.willSurvive ? "#C8FF00" : "#EF4444"

  return (
    <div className="w-full max-w-lg mx-auto">
      {!result ? (
        // ── Input State ──
        <div className="space-y-3">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-[#71717A] font-mono text-base select-none pointer-events-none">
              @
            </span>
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/^@/, ""))}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && generateResult()}
              disabled={isLoading}
              className="w-full h-13 pl-9 pr-4 py-3.5 bg-[#111113] border border-[#1F1F23] text-[#FAFAFA] placeholder:text-[#3F3F46] font-mono text-base focus:outline-none focus:border-[#C8FF00] focus:ring-0 transition-colors disabled:opacity-50"
              style={{ borderRadius: "2px" }}
            />
          </div>

          <button
            onClick={generateResult}
            disabled={!username.trim() || isLoading}
            className="w-full h-13 py-3.5 font-bold text-sm tracking-[0.12em] uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isLoading || !username.trim() ? "#1C1C1F" : "#C8FF00",
              color: isLoading || !username.trim() ? "#3F3F46" : "#09090B",
              borderRadius: "2px",
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Analyzing your fate...
              </span>
            ) : (
              "Check Your Survival"
            )}
          </button>

          <p className="text-center text-[#3F3F46] text-xs tracking-widest uppercase pt-1">
            Enter your X handle to find out
          </p>
        </div>
      ) : (
        // ── Result State ──
        <div className="space-y-4">
          {/* Card */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "#111113",
              border: `1px solid ${accent}`,
              borderRadius: "2px",
            }}
          >
            {/* Top accent bar */}
            <div className="h-[3px] w-full" style={{ background: accent }} />

            {/* Corner marks */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l" style={{ borderColor: accent }} />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r" style={{ borderColor: accent }} />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l" style={{ borderColor: accent }} />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r" style={{ borderColor: accent }} />

            <div className="px-8 py-10 text-center space-y-5">
              {/* Username */}
              <p className="text-[#71717A] font-mono text-sm tracking-widest uppercase">
                @{result.username}
              </p>

              {/* Big YES / NO */}
              <div
                className="text-[100px] md:text-[120px] font-black leading-none tracking-tight"
                style={{ color: accent }}
              >
                {result.willSurvive ? "YES" : "NO"}
              </div>

              {/* Verdict label */}
              <div
                className="inline-block px-3 py-1 text-xs font-bold tracking-[0.18em] uppercase"
                style={{
                  border: `1px solid ${accent}`,
                  color: accent,
                  borderRadius: "2px",
                }}
              >
                {result.verdict}
              </div>

              {/* Divider */}
              <div className="w-16 h-px mx-auto" style={{ background: "#1F1F23" }} />

              {/* Headline */}
              <p className="text-[#71717A] text-sm leading-relaxed max-w-xs mx-auto">
                {result.headline}
              </p>

              {/* Traits */}
              <div className="flex flex-wrap justify-center gap-2">
                {result.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: accent }}
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Legion watermark */}
              <div className="flex items-center justify-center gap-2 pt-2 opacity-40">
                <LegionMark size={14} className="text-[#FAFAFA]" />
                <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#FAFAFA]">
                  legion.cc
                </span>
              </div>
            </div>

            {/* Bottom accent bar */}
            <div className="h-[3px] w-full" style={{ background: accent }} />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="h-11 font-bold text-xs tracking-[0.12em] uppercase transition-colors"
              style={{
                background: accent,
                color: "#09090B",
                borderRadius: "2px",
              }}
            >
              Download PNG
            </button>
            <button
              onClick={reset}
              className="h-11 font-bold text-xs tracking-[0.12em] uppercase border border-[#1F1F23] text-[#71717A] hover:border-[#3F3F46] hover:text-[#FAFAFA] transition-colors"
              style={{ borderRadius: "2px", background: "transparent" }}
            >
              Try Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
