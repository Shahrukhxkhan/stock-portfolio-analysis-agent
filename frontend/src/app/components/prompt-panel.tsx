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
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🪁</span>
          <div>
            <h1 className="text-lg font-semibold text-[#f5f5f7] font-['Roobert']">Portfolio Chat</h1>
            <div className="inline-block px-2 py-0.5 bg-[#6366f1]/20 text-[#a5b4fc] border border-[#6366f1]/30 text-xs font-semibold uppercase rounded">
              PRO
            </div>
          </div>
        </div>
        <p className="text-xs text-[#a1a1aa]">Interact with the CrewAI-powered AI agent for portfolio visualization and analysis</p>

        {/* Available Cash Display */}
        <div className="mt-3 p-2.5 bg-[#FF003C]/15 border border-[#FF003C]/30 rounded-xl backdrop-blur-md">
          <div className="text-xs text-[#a1a1aa] font-medium">Available Cash</div>
          <div className="text-sm font-semibold text-[#f5f5f7] font-['Roobert']">{formatCurrency(availableCash)}</div>
        </div>
      </div>
      <CopilotChat className="h-[78vh] p-2" labels={
        {
          initial : `I am a CrewAI AI agent designed to analyze investment opportunities and track stock performance over time. How can I help you with your investment query? For example, you can ask me to analyze a stock like "Invest in Apple with 10k dollars since Jan 2023". \n\nNote: The AI agent has access to stock data from the past 4 years only`
        }
      } />

    </div >
  )
}
