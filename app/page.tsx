import { LegionWordmark } from "@/components/legion-logo"
import { BearMarketChecker } from "@/components/bear-market-checker"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#101010] overflow-hidden">

      {/* ── Grid background ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(#1A1A1D 1px, transparent 1px),
            linear-gradient(90deg, #1A1A1D 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* ── Corner cross marks ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* top-left */}
        <div className="absolute top-0 left-0 w-5 h-5">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2A2A2F]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#2A2A2F]" />
        </div>
        {/* top-right */}
        <div className="absolute top-0 right-0 w-5 h-5">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2A2A2F]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#2A2A2F]" />
        </div>
        {/* bottom-left */}
        <div className="absolute bottom-0 left-0 w-5 h-5">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2A2A2F]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#2A2A2F]" />
        </div>
        {/* bottom-right */}
        <div className="absolute bottom-0 right-0 w-5 h-5">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2A2A2F]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#2A2A2F]" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Header ── */}
        <header className="px-6 py-5 md:px-10 flex items-center justify-between border-b border-[#1F1F23]">
          <a
            href="https://legion.cc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Legion"
          >
            <LegionWordmark size="sm" className="text-[#FAFAFA]" />
          </a>
          <a
            href="https://legion.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] uppercase text-[#71717A] hover:text-[#FAFAFA] transition-colors"
          >
            Join Legion
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </header>

        {/* ── Hero ── */}
        <section className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
          <div className="w-full max-w-2xl space-y-14">

            {/* ── Title ── */}
            <div className="space-y-4">
              {/* Eyebrow label */}
              <div className="flex items-center gap-3">
                <div className="w-5 h-px bg-[#F03C24]" />
                <span className="text-[#F03C24] text-xs font-bold tracking-[0.22em] uppercase">
                  The Ultimate Test
                </span>
              </div>

              {/* Main headline */}
              <h1 className="text-balance">
                <span className="block text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#3F3F46] leading-[1.0] uppercase">
                  Will you
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#FAFAFA] leading-[1.0] uppercase">
                  survive the
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#F03C24] leading-[1.0] uppercase">
                  bear market?
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-[#BBBBBB] text-base leading-relaxed max-w-sm pt-1">
                Enter your X username. Find out if you have what it takes.
              </p>
            </div>

            {/* ── Checker ── */}
            <BearMarketChecker />

          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-4 md:px-10 border-t border-[#1F1F23] flex items-center justify-between">
          <p className="text-[#3F3F46] text-xs tracking-widest uppercase font-mono">
            legion.cc
          </p>
          <p className="text-[#3F3F46] text-xs font-mono">
            Merit-based crypto investing
          </p>
        </footer>

      </div>
    </main>
  )
}
