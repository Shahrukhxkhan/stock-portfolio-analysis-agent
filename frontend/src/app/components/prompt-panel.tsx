"use client"

import type React from "react"
import { CopilotChat } from "@copilotkit/react-ui"


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
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-xl filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">🪁</span>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#f5f5f7] font-['Roobert'] tracking-wide">Portfolio Chat</h1>
            <span className="bg-gradient-to-r from-[#FF003C] to-[#a855f7] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(255,0,60,0.4)] tracking-wider uppercase">
              PRO
            </span>
          </div>
        </div>
        <p className="text-xs text-[#a1a1aa] leading-relaxed">Interact with the CrewAI-powered AI agent for portfolio visualization and analysis</p>

        {/* Available Cash Card - Standout glass card with soft pink/purple gradient border */}
        <div className="mt-3.5 p-3.5 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)] relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">Available Cash</div>
          <div className="text-xl font-extrabold text-[#f5f5f7] font-['Roobert'] mt-0.5 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {formatCurrency(availableCash)}
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
