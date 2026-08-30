"use client"

import { X, TrendingUp, TrendingDown, Sparkles, AlertCircle, DollarSign, PieChart } from "lucide-react"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg p-6 space-y-6 border border-[#E2E6EF] shadow-2xl rounded-3xl relative overflow-hidden bg-[#FFFFFF] text-[#101828]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2E6EF] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3730E0]/10 border border-[#3730E0]/30 flex items-center justify-center font-bold text-lg font-['Roobert'] text-[#3730E0]">
              {ticker}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#101828] font-['Roobert']">{ticker} Ticker Breakdown</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3F4F8] text-[#6B7A99] border border-[#E2E6EF] uppercase">
                  Active Asset
                </span>
              </div>
              <p className="text-xs text-[#6B7A99] mt-0.5">Asset allocation & individual performance details</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#F3F4F8] hover:bg-[#E2E6EF] border border-[#E2E6EF] text-[#6B7A99] hover:text-[#101828] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#6B7A99]">
              <PieChart size={14} className="text-[#3730E0]" />
              <span>Portfolio Weight</span>
            </div>
            <div className="text-lg font-bold text-[#101828] font-['Roobert']">
              {allocationPercent.toFixed(1)}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#6B7A99]">
              <DollarSign size={14} className="text-[#3730E0]" />
              <span>Current Market Value</span>
            </div>
            <div className="text-lg font-bold text-[#101828] font-['Roobert']">
              {formatCurrency(currentValue)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF] space-y-1 col-span-2">
            <div className="flex items-center gap-1.5 text-xs text-[#6B7A99]">
              {totalReturnPercent >= 0 ? (
                <TrendingUp size={14} className="text-[#1E8E5A]" />
              ) : (
                <TrendingDown size={14} className="text-[#D64545]" />
              )}
              <span>Total Asset Return</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-bold font-['Roobert'] ${
                  totalReturnPercent >= 0 ? "text-[#1E8E5A]" : "text-[#D64545]"
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
          <h4 className="text-xs font-bold text-[#6B7A99] uppercase tracking-wider">AI Insight Context</h4>

          {bullInsight && (
            <div className="p-3.5 rounded-2xl bg-[#E8F5EE] border border-[#1E8E5A]/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E8E5A]">
                <Sparkles size={14} />
                <span>{bullInsight.emoji || "🐂"} {bullInsight.title}</span>
              </div>
              <p className="text-xs text-[#101828] leading-relaxed">{bullInsight.description}</p>
            </div>
          )}

          {bearInsight && (
            <div className="p-3.5 rounded-2xl bg-[#FCEBEB] border border-[#D64545]/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D64545]">
                <AlertCircle size={14} />
                <span>{bearInsight.emoji || "🐻"} {bearInsight.title}</span>
              </div>
              <p className="text-xs text-[#101828] leading-relaxed">{bearInsight.description}</p>
            </div>
          )}

          {!bullInsight && !bearInsight && (
            <div className="p-4 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF] text-center text-xs text-[#6B7A99]">
              No ticker-specific text insight generated yet. Run a prompt for deep ticker synthesis.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-[#3730E0] hover:bg-[#3730E0]/90 text-xs font-semibold text-[#FFFFFF] border border-[#3730E0] transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
