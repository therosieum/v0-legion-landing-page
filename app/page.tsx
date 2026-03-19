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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/legion-logo.svg" 
          alt="Legion" 
          className="h-8 w-auto brightness-0 invert"
        />
      </div>

      <div className="w-full max-w-2xl space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Will you survive the bear market?
          </h1>
          <p className="text-white text-base font-medium drop-shadow-lg">
            8 questions to find out
          </p>
        </div>

        {/* Checker */}
        <BearMarketChecker />

        {/* Pre-quiz disclaimer */}
        <p className="text-white/30 text-[10px] text-center leading-relaxed max-w-md mx-auto">
          Just a Heads Up: This quiz is purely for fun and the "vibes." While Legion takes on-chain reputation seriously, this specific quiz is for entertainment purposes only. It is not investment advice, nor is it a formal assessment of your financial standing or "Legion Score." Play at your own risk, laugh at the memes, and remember: none of this is financial advice.
        </p>
      </div>

      {/* Footer Disclaimer */}
      <footer className="absolute bottom-0 left-0 right-0 px-6 py-4">
        <p className="text-white/20 text-[9px] text-center leading-relaxed max-w-4xl mx-auto">
          Disclaimer: The Bear Market Quiz is provided by Legion for entertainment and informational purposes only. It does not constitute financial, investment, legal, or tax advice. The quiz results and "scores" are generated based on subjective criteria and should not be used as a basis for any investment decisions. Cryptocurrency investments carry significant risk; always conduct your own research or consult a certified financial advisor before trading. Legion is not responsible for any losses or actions taken based on the content of this quiz.
        </p>
      </footer>
    </main>
  )
}
