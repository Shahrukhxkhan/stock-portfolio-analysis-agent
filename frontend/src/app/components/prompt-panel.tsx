"use client"

import type React from "react"
import { CopilotChat } from "@copilotkit/react-ui"
import { VoiceInputButton } from "./voice-input-button"

interface PromptPanelProps {
  availableCash: number
}

export function PromptPanel({ availableCash }: PromptPanelProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="h-full flex flex-col bg-transparent relative">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xl filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">🪁</span>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#f5f5f7] font-['Roobert'] tracking-wide">Portfolio Chat</h1>
              <span className="bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.25)] tracking-wider uppercase">
                PRO
              </span>
            </div>
          </div>
          {/* Voice Input Speech Recognition Button */}
          <VoiceInputButton />
        </div>
        <p className="text-xs text-[#a1a1aa] leading-relaxed">Interact with the CrewAI-powered AI agent via natural language or speech</p>

        {/* Available Cash Card */}
        <div className="mt-3.5 p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.1)] relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">Available Cash</div>
          <div className="text-xl font-extrabold text-[#f5f5f7] font-['Roobert'] mt-0.5 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {formatCurrency(availableCash)}
          </div>
        </div>

        {/* Quick Presets Section */}
        <div className="mt-3 space-y-1.5">
          <div className="text-[10px] text-[#a1a1aa] font-bold uppercase tracking-wider">Quick Query Presets</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "🚀 Tech Trio $10k", text: "Analyze AAPL, MSFT, and NVDA with $10,000 each since Jan 2023" },
              { label: "₿ Crypto & Tech $10k", text: "Analyze BTC-USD, ETH-USD, and NVDA with $10,000 each since Jan 2023" },
              { label: "🥇 Gold & Stocks $15k", text: "Analyze GLD, AAPL, and MSFT with $15,000 total since Jan 2023" },
              { label: "📅 DCA SPY $500/mo", text: "DCA $500 monthly into SPY over the last 2 years" },
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const inputEl = document.querySelector(".copilotKitInput input, .copilotKitInput textarea") as HTMLInputElement | HTMLTextAreaElement
                  if (inputEl) {
                    inputEl.value = preset.text
                    inputEl.dispatchEvent(new Event("input", { bubbles: true }))
                    inputEl.focus()
                  }
                }}
                className="text-[10px] font-medium px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[#f5f5f7] hover:border-purple-500/40 transition-all text-left truncate max-w-full"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CopilotChat className="h-[78vh] p-3 flex-1" labels={
        {
          initial : `I am a CrewAI AI agent designed to analyze investment opportunities and track stock performance over time. How can I help you with your investment query? For example, you can ask me to analyze a stock like "Invest in Apple with 10k dollars since Jan 2023". \n\nNote: The AI agent has access to stock data from the past 4 years only`
        }
      } />

    </div >
  )
}
