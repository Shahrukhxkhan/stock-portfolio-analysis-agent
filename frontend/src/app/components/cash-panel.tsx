"use client"

import { useState } from "react"
import { Edit2, Check, X, DollarSign, TrendingUp, Wallet, Calendar } from "lucide-react"

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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* Total Cash */}
        <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md group">
          <div className="w-8 h-8 bg-[#FF003C]/20 border border-[#FF003C]/40 rounded-lg flex items-center justify-center">
            <Wallet size={16} className="text-[#FF003C]" />
          </div>
          <div>
            <div className="text-xs text-[#a1a1aa] font-medium">Total Cash</div>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-16 text-sm font-semibold text-[#f5f5f7] font-['Roobert'] bg-white/10 border border-white/20 rounded px-1 focus:outline-none focus:border-[#6366f1]"
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
              <div className="flex items-center gap-1">
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
        <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-8 h-8 bg-[#6366f1]/20 border border-[#6366f1]/40 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-[#818cf8]" />
          </div>
          <div>
            <div className="text-xs text-[#a1a1aa] font-medium">Invested</div>
            <div className="text-sm font-semibold text-[#f5f5f7] font-['Roobert']">
              {formatCurrency(investedAmount)}
            </div>
          </div>
        </div>

        {/* Current Portfolio Value */}
        <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-8 h-8 bg-[#a855f7]/20 border border-[#a855f7]/40 rounded-lg flex items-center justify-center">
            <DollarSign size={16} className="text-[#c084fc]" />
          </div>
          <div>
            <div className="text-xs text-[#a1a1aa] font-medium">Portfolio Value</div>
            <div className="text-sm font-semibold text-[#f5f5f7] font-['Roobert']">
              {formatCurrency(currentPortfolioValue)}
            </div>
          </div>
        </div>

        {/* 4-Year Return */}
        <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              fourYearReturn >= 0 
                ? "bg-[#06b6d4]/20 border border-[#06b6d4]/40" 
                : "bg-rose-500/20 border border-rose-500/40"
            }`}
          >
            <Calendar size={16} className={fourYearReturn >= 0 ? "text-[#22d3ee]" : "text-rose-400"} />
          </div>
          <div>
            <div className="text-xs text-[#a1a1aa] font-medium">4-Year Return</div>
            <div className="flex items-center gap-2">
              <div
                className={`text-sm font-semibold font-['Roobert'] ${
                  fourYearReturn >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
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
      <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="text-right">
          <div className="text-xs text-[#a1a1aa] font-medium">Portfolio Allocation</div>
          <div className="text-sm font-semibold text-[#f5f5f7] font-['Roobert']">{investedPercentage.toFixed(1)}%</div>
        </div>
        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF003C] via-[#6366f1] to-[#a855f7] transition-all duration-300"
            style={{ width: `${Math.min(investedPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
