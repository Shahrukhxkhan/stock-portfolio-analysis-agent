"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Sliders,
  Scale,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  DollarSign,
} from "lucide-react"

interface HoldingAllocation {
  ticker: string
  currentAllocation: number // percentage e.g. 40
  targetAllocation: number // percentage e.g. 30
  currentValue: number
  currentPrice: number
  sharesOwned: number
  isLocked?: boolean
}

interface InteractiveRebalancerProps {
  allocations: Array<{
    ticker: string
    allocation: number
    currentValue: number
    totalReturn: number
  }>
  totalPortfolioValue: number
  availableCash: number
  onApplyRebalance?: (rebalancedAllocations: HoldingAllocation[], newCash: number) => void
}

export function InteractiveRebalancer({
  allocations = [],
  totalPortfolioValue = 100000,
  availableCash = 10000,
  onApplyRebalance,
}: InteractiveRebalancerProps) {
  const { theme } = useTheme()

  // Default fallback holdings if portfolio is empty yet
  const initialHoldings: HoldingAllocation[] = React.useMemo(() => {
    if (allocations.length > 0) {
      return allocations.map((a) => {
        const estPrice = a.currentValue > 0 ? a.currentValue / Math.max(1, Math.round(a.currentValue / 180)) : 180
        const shares = Math.max(1, Math.round(a.currentValue / estPrice))
        return {
          ticker: a.ticker,
          currentAllocation: +a.allocation.toFixed(1),
          targetAllocation: +a.allocation.toFixed(1),
          currentValue: a.currentValue,
          currentPrice: +estPrice.toFixed(2),
          sharesOwned: shares,
          isLocked: false,
        }
      })
    }
    return [
      { ticker: "AAPL", currentAllocation: 40, targetAllocation: 40, currentValue: 40000, currentPrice: 232, sharesOwned: 172, isLocked: false },
      { ticker: "NVDA", currentAllocation: 35, targetAllocation: 35, currentValue: 35000, currentPrice: 138, sharesOwned: 253, isLocked: false },
      { ticker: "MSFT", currentAllocation: 25, targetAllocation: 25, currentValue: 25000, currentPrice: 428, sharesOwned: 58, isLocked: false },
    ]
  }, [allocations])

  const [holdings, setHoldings] = useState<HoldingAllocation[]>(initialHoldings)
  const [appliedSuccess, setAppliedSuccess] = useState(false)

  useEffect(() => {
    setHoldings(initialHoldings)
  }, [initialHoldings])

  const totalTargetPercent = +holdings.reduce((sum, h) => sum + h.targetAllocation, 0).toFixed(1)
  const isBalanced100 = Math.abs(totalTargetPercent - 100) < 0.2

  const handleSliderChange = (ticker: string, newTarget: number) => {
    setHoldings((prev) =>
      prev.map((h) => (h.ticker === ticker ? { ...h, targetAllocation: Math.max(0, Math.min(100, newTarget)) } : h))
    )
  }

  const toggleLock = (ticker: string) => {
    setHoldings((prev) =>
      prev.map((h) => (h.ticker === ticker ? { ...h, isLocked: !h.isLocked } : h))
    )
  }

  const handleNormalize = () => {
    const lockedSum = holdings.filter((h) => h.isLocked).reduce((sum, h) => sum + h.targetAllocation, 0)
    const unlocked = holdings.filter((h) => !h.isLocked)
    const remainingTarget = Math.max(0, 100 - lockedSum)

    if (unlocked.length === 0) return

    const currentUnlockedSum = unlocked.reduce((sum, h) => sum + h.targetAllocation, 0) || 1
    setHoldings((prev) =>
      prev.map((h) => {
        if (h.isLocked) return h
        const normalized = +((h.targetAllocation / currentUnlockedSum) * remainingTarget).toFixed(1)
        return { ...h, targetAllocation: normalized }
      })
    )
  }

  const handleReset = () => {
    setHoldings(initialHoldings)
  }

  // Calculate order execution delta ($ and shares)
  const rebalancingOrders = holdings.map((h) => {
    const targetDollarValue = (totalPortfolioValue * h.targetAllocation) / 100
    const dollarDelta = targetDollarValue - h.currentValue
    const shareDelta = Math.round(dollarDelta / h.currentPrice)
    const action: "BUY" | "SELL" | "HOLD" = Math.abs(dollarDelta) < 10 ? "HOLD" : dollarDelta > 0 ? "BUY" : "SELL"

    return {
      ticker: h.ticker,
      currentPrice: h.currentPrice,
      dollarDelta,
      shareDelta: Math.abs(shareDelta),
      action,
      targetDollarValue,
    }
  })

  const totalBuys = rebalancingOrders.filter((o) => o.action === "BUY").reduce((s, o) => s + o.dollarDelta, 0)
  const totalSells = Math.abs(rebalancingOrders.filter((o) => o.action === "SELL").reduce((s, o) => s + o.dollarDelta, 0))
  const netCashImpact = totalSells - totalBuys

  const handleApply = () => {
    if (onApplyRebalance) {
      onApplyRebalance(holdings, availableCash + netCashImpact)
    }
    setAppliedSuccess(true)
    setTimeout(() => setAppliedSuccess(false), 3500)
  }

  return (
    <div
      className={`w-full rounded-2xl border p-5 backdrop-blur-xl transition-colors ${
        theme === "bloomberg"
          ? "bg-[#080808] border-[#442a00] text-[#ff9900]"
          : theme === "light"
          ? "bg-white/90 border-slate-200 text-slate-900 shadow-lg"
          : "bg-white/5 border-white/10 text-[#f5f5f7] shadow-2xl"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Interactive Portfolio Rebalancer</h2>
              <p className="text-xs text-[#a1a1aa]">
                Adjust target allocation sliders to preview rebalancing trade orders and risk shifts
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] transition-all cursor-pointer"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleNormalize}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 transition-all cursor-pointer"
          >
            <Scale size={12} />
            Auto Normalize (100%)
          </button>
        </div>
      </div>

      {/* Total Allocation Progress Bar & Balance Warning */}
      <div className="mb-6 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs mb-2 font-mono">
          <span className="text-[#a1a1aa]">Total Target Allocation:</span>
          <span
            className={`font-extrabold text-sm ${
              isBalanced100 ? "text-emerald-400" : "text-amber-400 animate-pulse"
            }`}
          >
            {totalTargetPercent}% / 100%
          </span>
        </div>
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden flex">
          {holdings.map((h, i) => {
            const colors = ["bg-cyan-500", "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500"]
            return (
              <div
                key={h.ticker}
                className={`${colors[i % colors.length]} transition-all duration-300`}
                style={{ width: `${Math.min(100, h.targetAllocation)}%` }}
                title={`${h.ticker}: ${h.targetAllocation}%`}
              />
            )
          })}
        </div>
        {!isBalanced100 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-2">
            <AlertTriangle size={13} />
            <span>
              Target sum is {totalTargetPercent > 100 ? "over" : "under"} 100% by{" "}
              {Math.abs(100 - totalTargetPercent).toFixed(1)}%. Click &ldquo;Auto Normalize&rdquo; to scale to 100%.
            </span>
          </div>
        )}
      </div>

      {/* Holdings Slider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {holdings.map((h) => {
          const delta = +(h.targetAllocation - h.currentAllocation).toFixed(1)
          return (
            <div
              key={h.ticker}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight">{h.ticker}</span>
                    <span className="text-xs text-[#a1a1aa] font-mono">${h.currentPrice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleLock(h.ticker)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      h.isLocked
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-white/5 text-[#a1a1aa] border-white/10 hover:text-[#f5f5f7]"
                    }`}
                    title={h.isLocked ? "Unlock slider" : "Lock target weight"}
                  >
                    {h.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-2 font-mono">
                  <span>Current: {h.currentAllocation}%</span>
                  <span className="flex items-center gap-1">
                    Target: <strong className="text-[#f5f5f7] text-sm">{h.targetAllocation}%</strong>
                    <span
                      className={`text-[10px] font-bold px-1 rounded ${
                        delta > 0
                          ? "text-emerald-400 bg-emerald-500/15"
                          : delta < 0
                          ? "text-rose-400 bg-rose-500/15"
                          : "text-[#a1a1aa]"
                      }`}
                    >
                      {delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : "0%"}
                    </span>
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  disabled={h.isLocked}
                  value={h.targetAllocation}
                  onChange={(e) => handleSliderChange(h.ticker, parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-40"
                />
              </div>

              {/* Position stats */}
              <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-[#a1a1aa] flex justify-between font-mono">
                <span>Value: ${h.currentValue.toLocaleString()}</span>
                <span>{h.sharesOwned} Shares</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Generated Trade Orders Preview Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
            <DollarSign size={14} className="text-emerald-400" />
            <span>Calculated Rebalancing Trade Orders</span>
          </div>
          <div className="text-xs font-mono">
            Net Cash Flow:{" "}
            <strong className={netCashImpact >= 0 ? "text-emerald-400" : "text-amber-400"}>
              {netCashImpact >= 0 ? "+" : ""}${netCashImpact.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-[#a1a1aa] font-mono border-b border-white/10 bg-white/5">
              <tr>
                <th className="p-3">Ticker</th>
                <th className="p-3">Action</th>
                <th className="p-3">Est. Shares</th>
                <th className="p-3">Order Value</th>
                <th className="p-3">Target Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {rebalancingOrders.map((order) => (
                <tr key={order.ticker} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-[#f5f5f7]">{order.ticker}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        order.action === "BUY"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : order.action === "SELL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-white/5 text-[#a1a1aa]"
                      }`}
                    >
                      {order.action}
                    </span>
                  </td>
                  <td className="p-3">
                    {order.action === "HOLD" ? "—" : `${order.shareDelta} shares`}
                  </td>
                  <td className="p-3 font-bold">
                    {order.action === "HOLD" ? (
                      "—"
                    ) : (
                      <span className={order.action === "BUY" ? "text-emerald-400" : "text-rose-400"}>
                        {order.action === "BUY" ? "+" : "-"}${Math.abs(order.dollarDelta).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="p-3">${order.targetDollarValue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3">
        {appliedSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>Rebalance Applied Successfully!</span>
          </div>
        )}
        <button
          type="button"
          disabled={!isBalanced100}
          onClick={handleApply}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Sparkles size={14} />
          <span>Apply Rebalance to Live Portfolio</span>
        </button>
      </div>
    </div>
  )
}
