"use client"

import { useState } from "react"
import { Edit2, Check, X, DollarSign, TrendingUp, Wallet, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface CashPanelProps {
  totalCash: number
  investedAmount: number
  currentPortfolioValue: number
  onTotalCashChange: (amount: number) => void
  onStateCashChange: (state: any) => void
}

export function CashPanel({ totalCash, investedAmount, currentPortfolioValue, onTotalCashChange, onStateCashChange }: CashPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(totalCash.toString())

  // const availableCash = totalCash - investedAmount
  const investedPercentage = totalCash > 0 ? (investedAmount / (totalCash + investedAmount)) * 100 : 0
  const fourYearReturn = currentPortfolioValue - investedAmount - totalCash
  const fourYearReturnPercentage = investedAmount > 0 ? (fourYearReturn / investedAmount) * 100 : 0

  const handleEdit = () => {
    setIsEditing(true)
    setEditValue(totalCash.toString())
  }

  const handleSave = () => {
    const newAmount = Number.parseInt(editValue.replace(/,/g, ""))
    if (!isNaN(newAmount) && newAmount >= 0) {
      onTotalCashChange(newAmount)
      onStateCashChange((prevState: any) => ({
        ...prevState,
        available_cash: newAmount,
      }))
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(totalCash.toString())
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full overflow-x-auto pb-1 hide-scrollbar">
      <div className="flex flex-wrap items-center gap-3.5">
        {/* Total Cash */}
        <div className="glass-panel !rounded-2xl p-2.5 px-3.5 flex items-center gap-3 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out group border border-white/10 hover:border-white/20">
          <div className="w-9 h-9 bg-blue-500/15 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.25)] flex-shrink-0">
            <Wallet size={18} />
          </div>
          <div>
            <div className="text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">Total Cash</div>
            {isEditing ? (
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-16 text-sm font-semibold text-[#f5f5f7] font-['Roobert'] bg-white/10 border border-white/20 rounded px-1.5 focus:outline-none focus:border-blue-400"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <button onClick={handleSave} className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded transition-colors">
                  <Check size={12} />
                </button>
                <button onClick={handleCancel} className="p-1 text-[#a1a1aa] hover:bg-white/10 rounded transition-colors">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-sm font-semibold text-[#f5f5f7] font-['Roobert']">
                  {formatCurrency(totalCash)}
                </span>
                <button
                  onClick={handleEdit}
                  className="p-1 text-[#a1a1aa] hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Invested Amount */}
        <div className="glass-panel !rounded-2xl p-2.5 px-3.5 flex items-center gap-3 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out border border-white/10 hover:border-white/20">
          <div className="w-9 h-9 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.25)] flex-shrink-0">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">Invested</div>
            <div className="text-sm font-semibold text-[#f5f5f7] font-['Roobert'] mt-0.5">
              {formatCurrency(investedAmount)}
            </div>
          </div>
        </div>

        {/* Current Portfolio Value */}
        <div className="glass-panel !rounded-2xl p-2.5 px-3.5 flex items-center gap-3 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out border border-white/10 hover:border-white/20">
          <div className="w-9 h-9 bg-amber-400/15 border border-amber-400/30 text-amber-300 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.25)] flex-shrink-0">
            <DollarSign size={18} />
          </div>
          <div>
            <div className="text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">Portfolio Value</div>
            <div className="text-sm font-semibold text-[#f5f5f7] font-['Roobert'] mt-0.5">
              {formatCurrency(currentPortfolioValue)}
            </div>
          </div>
        </div>

        {/* 4-Year Return */}
        <div className="glass-panel !rounded-2xl p-2.5 px-3.5 flex items-center gap-3 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out border border-white/10 hover:border-white/20">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              fourYearReturn >= 0 
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.25)]" 
                : "bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
            }`}
          >
            <Calendar size={18} />
          </div>
          <div>
            <div className="text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">4-Year Return</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`text-sm font-semibold font-['Roobert'] flex items-center gap-0.5 ${
                  fourYearReturn >= 0 
                    ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
                    : "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                }`}
              >
                {fourYearReturn >= 0 ? <ArrowUpRight size={14} className="inline text-emerald-400" /> : <ArrowDownRight size={14} className="inline text-rose-400" />}
                {fourYearReturn >= 0 ? "+" : ""}
                {formatCurrency(fourYearReturn)}
              </div>
              <div className={`text-xs font-medium ${fourYearReturn >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                ({fourYearReturn >= 0 ? "+" : ""}
                {fourYearReturnPercentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Progress */}
      <div className="glass-panel !rounded-2xl p-2.5 px-3.5 flex items-center gap-3.5 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out border border-white/10 hover:border-white/20">
        <div className="text-right">
          <div className="text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">Portfolio Allocation</div>
          <div className="text-sm font-semibold text-[#f5f5f7] font-['Roobert'] mt-0.5">{investedPercentage.toFixed(1)}%</div>
        </div>
        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 backdrop-blur-md">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(236,72,153,0.4)]"
            style={{ width: `${Math.min(investedPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

