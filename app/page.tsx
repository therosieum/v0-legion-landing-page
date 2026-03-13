'use client'

import { LegionMark } from '@/components/legion-logo'
import { BearMarketChecker } from '@/components/bear-market-checker'

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Legion Logo - Top Left */}
      <div className="absolute top-8 left-8">
        <LegionMark size={40} className="text-white" />
      </div>

      <div className="w-full max-w-2xl space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F03C24]">
            Will you survive the bear market?
          </h1>
          <p className="text-gray-400 text-base">
            Enter your X username to find out
          </p>
        </div>

        {/* Checker */}
        <BearMarketChecker />
      </div>
    </main>
  )
}
