"use client"

import { X, TrendingUp, TrendingDown, Sparkles, AlertCircle, DollarSign, PieChart, ShieldAlert } from "lucide-react"
import type { PortfolioState } from "../page"

interface AssetDetailModalProps {
  ticker: string | null
  portfolioState: PortfolioState
  onClose: () => void
}

export function AssetDetailModal({ ticker, portfolioState, onClose }: AssetDetailModalProps) {
  if (!ticker) return null

  const allocation = portfolioState.allocations.find((a) => a.ticker.toUpperCase() === ticker.toUpperCase())
  const returnData = portfolioState.returnsData.find((r) => r.ticker.toUpperCase() === ticker.toUpperCase())
  
  const bullInsight = portfolioState.bullInsights.find((b) => b.title.toUpperCase().includes(ticker.toUpperCase()) || b.description.toUpperCase().includes(ticker.toUpperCase()))
  const bearInsight = portfolioState.bearInsights.find((b) => b.title.toUpperCase().includes(ticker.toUpperCase()) || b.description.toUpperCase().includes(ticker.toUpperCase()))

  const totalReturnPercent = returnData?.return ?? allocation?.totalReturn ?? 0
  const currentValue = allocation?.currentValue ?? 0
  const allocationPercent = allocation?.allocation ?? 0

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="glass-panel w-full max-w-lg p-6 space-y-6 border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.8)] rounded-3xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-bold text-lg font-['Roobert'] text-[#f5f5f7] shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              {ticker}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#f5f5f7] font-['Roobert']">{ticker} Ticker Breakdown</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/80 border border-white/10 uppercase">
                  Active Asset
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa] mt-0.5">Asset allocation & individual performance details</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa]">
              <PieChart size={14} className="text-indigo-400" />
              <span>Portfolio Weight</span>
            </div>
            <div className="text-lg font-bold text-[#f5f5f7] font-['Roobert']">
              {allocationPercent.toFixed(1)}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa]">
              <DollarSign size={14} className="text-amber-400" />
              <span>Current Market Value</span>
            </div>
            <div className="text-lg font-bold text-[#f5f5f7] font-['Roobert']">
              {formatCurrency(currentValue)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 col-span-2">
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa]">
              {totalReturnPercent >= 0 ? (
                <TrendingUp size={14} className="text-emerald-400" />
              ) : (
                <TrendingDown size={14} className="text-rose-400" />
              )}
              <span>Total Asset Return</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-bold font-['Roobert'] ${
                  totalReturnPercent >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {totalReturnPercent >= 0 ? "+" : ""}
                {totalReturnPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Ticker Specific Bull & Bear Insight */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">AI Insight Context</h4>

          {bullInsight && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Sparkles size={14} />
                <span>{bullInsight.emoji || "🐂"} {bullInsight.title}</span>
              </div>
              <p className="text-xs text-[#f5f5f7]/90 leading-relaxed">{bullInsight.description}</p>
            </div>
          )}

          {bearInsight && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <AlertCircle size={14} />
                <span>{bearInsight.emoji || "🐻"} {bearInsight.title}</span>
              </div>
              <p className="text-xs text-[#f5f5f7]/90 leading-relaxed">{bearInsight.description}</p>
            </div>
          )}

          {!bullInsight && !bearInsight && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-[#a1a1aa]">
              No ticker-specific text insight generated yet. Run a prompt for deep ticker synthesis.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#f5f5f7] border border-white/10 transition-all shadow-md"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
