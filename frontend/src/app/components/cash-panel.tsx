"use client"

import { useState } from "react"
import { Edit2, Check, X, DollarSign, TrendingUp, Wallet, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { PortfolioManager, PortfolioProfile } from "./portfolio-manager"
import { useTheme } from "../context/theme-context"

interface CashPanelProps {
  totalCash: number
  investedAmount: number
  currentPortfolioValue: number
  onTotalCashChange: (amount: number) => void
  onStateCashChange: (state: any) => void
  activeProfileId: string
  profiles: PortfolioProfile[]
  onSelectProfile: (profileId: string) => void
  onCreateProfile: (profile: PortfolioProfile) => void
  onDeleteProfile: (profileId: string) => void
  onResetActiveProfile: () => void
}

export function CashPanel({
  totalCash,
  investedAmount,
  currentPortfolioValue,
  onTotalCashChange,
  onStateCashChange,
  activeProfileId,
  profiles,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onResetActiveProfile,
}: CashPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(totalCash.toString())
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "EUR" | "GBP" | "INR">("USD")
  const { theme, setTheme } = useTheme()

  const CURRENCY_RATES = {
    USD: { rate: 1.0, symbol: "$", code: "USD" },
    EUR: { rate: 0.92, symbol: "€", code: "EUR" },
    GBP: { rate: 0.78, symbol: "£", code: "GBP" },
    INR: { rate: 83.5, symbol: "₹", code: "INR" },
  }

  const curr = CURRENCY_RATES[selectedCurrency]

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
    const converted = amount * curr.rate
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 w-full overflow-x-auto pb-1 hide-scrollbar bg-[#FFFFFF]">
      <div className="flex flex-wrap items-center gap-3.5">
        {/* Multi-Portfolio Account Profiles Dropdown */}
        <PortfolioManager
          activeProfileId={activeProfileId}
          profiles={profiles}
          onSelectProfile={onSelectProfile}
          onCreateProfile={onCreateProfile}
          onDeleteProfile={onDeleteProfile}
          onResetActiveProfile={onResetActiveProfile}
        />

        {/* Currency Switcher Dropdown */}
        <div className="bg-[#FFFFFF] rounded-2xl p-2.5 px-3.5 flex items-center gap-2 border border-[#E2E6EF] hover:border-[#6B7A99]/40 shadow-xs">
          <span className="text-xs text-[#6B7A99] font-medium uppercase">FX</span>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as any)}
            className="bg-transparent text-xs font-bold text-[#101828] font-['Roobert'] cursor-pointer focus:outline-none"
          >
            <option value="USD" className="bg-white text-[#101828]">🇺🇸 USD ($)</option>
            <option value="EUR" className="bg-white text-[#101828]">🇪🇺 EUR (€)</option>
            <option value="GBP" className="bg-white text-[#101828]">🇬🇧 GBP (£)</option>
            <option value="INR" className="bg-white text-[#101828]">🇮🇳 INR (₹)</option>
          </select>
        </div>

        {/* Total Cash */}
        <div className="bg-[#FFFFFF] rounded-2xl p-3 px-4 flex items-center gap-3.5 hover:scale-[1.01] transition-all duration-300 ease-out group border border-[#E2E6EF] hover:border-[#6B7A99]/40 shadow-xs">
          <div className="w-9 h-9 bg-[#F3F4F8] border border-[#E2E6EF] text-[#6B7A99] rounded-xl flex items-center justify-center flex-shrink-0">
            <Wallet size={18} />
          </div>
          <div>
            <div className="text-[11px] text-[#6B7A99] font-medium tracking-wide uppercase">Total Cash</div>
            {isEditing ? (
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-16 text-sm font-semibold text-[#101828] font-['Roobert'] bg-[#F3F4F8] border border-[#E2E6EF] rounded px-1.5 focus:outline-none focus:border-[#3730E0]"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <button onClick={handleSave} className="p-1 text-[#1E8E5A] hover:bg-[#E8F5EE] rounded transition-colors cursor-pointer">
                  <Check size={12} />
                </button>
                <button onClick={handleCancel} className="p-1 text-[#6B7A99] hover:bg-[#F3F4F8] rounded transition-colors cursor-pointer">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-sm font-semibold text-[#101828] font-['Roobert']">
                  {formatCurrency(totalCash)}
                </span>
                <button
                  onClick={handleEdit}
                  className="p-1 text-[#6B7A99] hover:bg-[#F3F4F8] rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Edit2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Invested Amount */}
        <div className="bg-[#FFFFFF] rounded-2xl p-3 px-4 flex items-center gap-3.5 hover:scale-[1.01] transition-all duration-300 ease-out border border-[#E2E6EF] hover:border-[#6B7A99]/40 shadow-xs">
          <div className="w-9 h-9 bg-[#F3F4F8] border border-[#E2E6EF] text-[#6B7A99] rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-[11px] text-[#6B7A99] font-medium tracking-wide uppercase">Invested</div>
            <div className="text-sm font-semibold text-[#101828] font-['Roobert'] mt-0.5">
              {formatCurrency(investedAmount)}
            </div>
          </div>
        </div>

        {/* Current Portfolio Value */}
        <div className="bg-[#FFFFFF] rounded-2xl p-3 px-4 flex items-center gap-3.5 hover:scale-[1.01] transition-all duration-300 ease-out border border-[#E2E6EF] hover:border-[#6B7A99]/40 shadow-xs">
          <div className="w-9 h-9 bg-[#F3F4F8] border border-[#E2E6EF] text-[#6B7A99] rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign size={18} />
          </div>
          <div>
            <div className="text-[11px] text-[#6B7A99] font-medium tracking-wide uppercase">Portfolio Value</div>
            <div className="text-sm font-semibold text-[#101828] font-['Roobert'] mt-0.5">
              {formatCurrency(currentPortfolioValue)}
            </div>
          </div>
        </div>

        {/* 4-Year Return */}
        <div className="bg-[#FFFFFF] rounded-2xl p-3 px-4 flex items-center gap-3.5 hover:scale-[1.01] transition-all duration-300 ease-out border border-[#E2E6EF] hover:border-[#6B7A99]/40 shadow-xs">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              fourYearReturn >= 0 
                ? "bg-[#E8F5EE] border border-[#1E8E5A]/30 text-[#1E8E5A]" 
                : "bg-[#FCEBEB] border border-[#D64545]/30 text-[#D64545]"
            }`}
          >
            <Calendar size={18} />
          </div>
          <div>
            <div className="text-[11px] text-[#6B7A99] font-medium tracking-wide uppercase">4-Year Return</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`text-sm font-semibold font-['Roobert'] flex items-center gap-0.5 ${
                  fourYearReturn >= 0 
                    ? "text-[#1E8E5A]" 
                    : "text-[#D64545]"
                }`}
              >
                {fourYearReturn >= 0 ? <ArrowUpRight size={14} className="inline text-[#1E8E5A]" /> : <ArrowDownRight size={14} className="inline text-[#D64545]" />}
                {fourYearReturn >= 0 ? "+" : ""}
                {formatCurrency(fourYearReturn)}
              </div>
              <div className={`text-xs font-medium ${fourYearReturn >= 0 ? "text-[#1E8E5A]" : "text-[#D64545]"}`}>
                ({fourYearReturn >= 0 ? "+" : ""}
                {fourYearReturnPercentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Investment Progress */}
      <div className="flex items-center gap-3">
        {/* Investment Progress */}
        <div className="bg-[#FFFFFF] rounded-2xl p-2.5 px-3.5 flex items-center gap-3.5 hover:scale-[1.01] transition-all duration-300 ease-out border border-[#E2E6EF] hover:border-[#6B7A99]/40 shadow-xs">
          <div className="text-right">
            <div className="text-[11px] text-[#6B7A99] font-medium tracking-wide uppercase">Portfolio Allocation</div>
            <div className="text-sm font-semibold text-[#101828] font-['Roobert'] mt-0.5">{investedPercentage.toFixed(1)}%</div>
          </div>
          <div className="w-20 h-2 bg-[#F3F4F8] rounded-full overflow-hidden p-0.5 border border-[#E2E6EF]">
            <div
              className="h-full rounded-full bg-[#3730E0] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(investedPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
