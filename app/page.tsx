import { LegionWordmark } from "@/components/legion-logo"
import { BearMarketChecker } from "@/components/bear-market-checker"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#c8ff00 1px, transparent 1px),
            linear-gradient(90deg, #c8ff00 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#c8ff00] opacity-[0.03] blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#c8ff00] opacity-[0.02] blur-[100px] rounded-full" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 md:p-8">
          <a href="https://legion.cc" target="_blank" rel="noopener noreferrer" className="inline-block">
            <LegionWordmark className="text-white hover:text-[#c8ff00] transition-colors" />
          </a>
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="w-full max-w-2xl space-y-12">
            {/* Title section */}
            <div className="text-center space-y-4">
              <p className="text-[#c8ff00] font-medium tracking-widest uppercase text-sm">
                The Ultimate Test
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-balance">
                <span className="text-[#666666]">Will you</span>
                <br />
                <span className="text-white">survive the</span>
                <br />
                <span className="text-[#c8ff00]">bear market?</span>
              </h1>
              <p className="text-[#666666] text-lg md:text-xl max-w-md mx-auto">
                Enter your X username and find out if you have what it takes.
              </p>
            </div>

            {/* Checker component */}
            <BearMarketChecker />
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 md:p-8 text-center">
          <p className="text-[#333333] text-sm">
            Built with conviction by{" "}
            <a 
              href="https://legion.cc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#444444] hover:text-[#c8ff00] transition-colors"
            >
              Legion
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
