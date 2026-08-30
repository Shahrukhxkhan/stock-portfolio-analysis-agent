"use client"

import { useState } from "react"
import { Edit2, Check, X, DollarSign, TrendingUp, Wallet, Calendar, ArrowUpRight, ArrowDownRight, Sun, Moon, Terminal } from "lucide-react"
import { PortfolioManager, PortfolioProfile } from "./portfolio-manager"
import { useTheme, ThemeType } from "../context/theme-context"

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
    <div className="flex flex-wrap items-center justify-between gap-3 w-full overflow-x-auto pb-1 hide-scrollbar">
      <div className="flex flex-wrap items-center gap-3">
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
        <div className="glass-panel !rounded-2xl p-2 px-3 flex items-center gap-2 border border-white/10 hover:border-white/20">
          <span className="text-xs text-[#a1a1aa] font-medium uppercase">FX</span>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as any)}
            className="bg-transparent text-xs font-bold text-[#f5f5f7] font-['Roobert'] cursor-pointer focus:outline-none"
          >
            <option value="USD" className="bg-[#0f0f17] text-white">🇺🇸 USD ($)</option>
            <option value="EUR" className="bg-[#0f0f17] text-white">🇪🇺 EUR (€)</option>
            <option value="GBP" className="bg-[#0f0f17] text-white">🇬🇧 GBP (£)</option>
            <option value="INR" className="bg-[#0f0f17] text-white">🇮🇳 INR (₹)</option>
          </select>
        </div>

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

      {/* Right Controls: Theme Switcher & Investment Progress */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher Pill */}
        <div className="glass-panel !rounded-2xl p-1 px-1.5 flex items-center gap-1 border border-white/10">
          <button
            type="button"
            title="Cyberpunk Dark Theme"
            onClick={() => setTheme("cyberpunk")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              theme === "cyberpunk"
                ? "bg-purple-500/30 text-purple-200 border border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                : "text-[#a1a1aa] hover:text-[#f5f5f7]"
            }`}
          >
            <span>🌆</span>
            <span className="hidden md:inline">Cyber</span>
          </button>
          <button
            type="button"
            title="Bloomberg Terminal High-Density Mode"
            onClick={() => setTheme("bloomberg")}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
              theme === "bloomberg"
                ? "bg-[#ff9900] text-black border border-[#ff9900] shadow-[0_0_10px_rgba(255,153,0,0.4)]"
                : "text-[#a1a1aa] hover:text-[#ff9900]"
            }`}
          >
            <span>📟</span>
            <span className="hidden md:inline">Terminal</span>
          </button>
          <button
            type="button"
            title="Executive Light Mode"
            onClick={() => setTheme("light")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              theme === "light"
                ? "bg-blue-500/20 text-blue-700 border border-blue-400"
                : "text-[#a1a1aa] hover:text-[#f5f5f7]"
            }`}
          >
            <span>☀️</span>
            <span className="hidden md:inline">Light</span>
          </button>
        </div>

        {/* Investment Progress */}
        <div className="glass-panel !rounded-2xl p-2.5 px-3.5 flex items-center gap-3.5 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out border border-white/10 hover:border-white/20">
          <div className="text-right">
            <div className="text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">Portfolio Allocation</div>
            <div className="text-sm font-semibold text-[#f5f5f7] font-['Roobert'] mt-0.5">{investedPercentage.toFixed(1)}%</div>
          </div>
          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 backdrop-blur-md">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(236,72,153,0.4)]"
              style={{ width: `${Math.min(investedPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

