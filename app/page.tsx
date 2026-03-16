'use client'

import Image from 'next/image'
import { BearMarketChecker } from '@/components/bear-market-checker'

export default function Home() {
  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
      style={{
        backgroundImage: 'url(/bg-pattern.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Legion Logo - Top Left */}
      <div className="absolute top-8 left-8">
        <Image 
          src="/legion-logo.svg" 
          alt="Legion" 
          width={120} 
          height={32} 
          className="h-8 w-auto brightness-0 invert"
        />
      </div>

      <div className="w-full max-w-2xl space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Will you survive the bear market?
          </h1>
          <p className="text-white/60 text-base">
            8 questions. Honest answers only.
          </p>
        </div>

        {/* Checker */}
        <BearMarketChecker />
      </div>
    </main>
  )
}
