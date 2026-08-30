"use client"

import React, { useState, useEffect } from "react"
import {
  FolderKanban,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  ChevronDown,
  Briefcase,
  Shield,
  Coins,
  Zap,
  TrendingUp,
  X,
  Sparkles,
} from "lucide-react"
import type { PortfolioState } from "../page"
import { useTheme } from "../context/theme-context"

export interface PortfolioProfile {
  id: string
  name: string
  icon: string
  description: string
  totalCash: number
  investedAmount: number
  portfolioState: PortfolioState
  isPreset?: boolean
}

export const PRESET_PORTFOLIOS: PortfolioProfile[] = [
  {
    id: "tech-momentum",
    name: "Tech Momentum Pro",
    icon: "🚀",
    description: "High-growth AI, Semiconductor, and Cloud hyperscalers (NVDA, MSFT, AAPL, GOOGL)",
    totalCash: 500000,
    investedAmount: 0,
    portfolioState: {
      id: "tech-momentum",
      trigger: "preset",
      performanceData: [],
      allocations: [],
      returnsData: [],
      bullInsights: [],
      bearInsights: [],
      currentPortfolioValue: 0,
      totalReturns: 0,
    },
    isPreset: true,
  },
  {
    id: "roth-ira",
    name: "Roth IRA Growth",
    icon: "🛡️",
    description: "Tax-advantaged long-term compounding with core index funds and blue chips",
    totalCash: 100000,
    investedAmount: 0,
    portfolioState: {
      id: "roth-ira",
      trigger: "preset",
      performanceData: [],
      allocations: [],
      returnsData: [],
      bullInsights: [],
      bearInsights: [],
      currentPortfolioValue: 0,
      totalReturns: 0,
    },
    isPreset: true,
  },
  {
    id: "dividend-vault",
    name: "Dividend Income Vault",
    icon: "💰",
    description: "Cash-flow generating dividend aristocrats, infrastructure REITs, and value leaders",
    totalCash: 250000,
    investedAmount: 0,
    portfolioState: {
      id: "dividend-vault",
      trigger: "preset",
      performanceData: [],
      allocations: [],
      returnsData: [],
      bullInsights: [],
      bearInsights: [],
      currentPortfolioValue: 0,
      totalReturns: 0,
    },
    isPreset: true,
  },
  {
    id: "crypto-sandbox",
    name: "High-Risk Crypto Sandbox",
    icon: "⚡",
    description: "Digital assets, Bitcoin, Ethereum, and high-beta decentralized ecosystem tokens",
    totalCash: 50000,
    investedAmount: 0,
    portfolioState: {
      id: "crypto-sandbox",
      trigger: "preset",
      performanceData: [],
      allocations: [],
      returnsData: [],
      bullInsights: [],
      bearInsights: [],
      currentPortfolioValue: 0,
      totalReturns: 0,
    },
    isPreset: true,
  },
]

interface PortfolioManagerProps {
  activeProfileId: string
  profiles: PortfolioProfile[]
  onSelectProfile: (profileId: string) => void
  onCreateProfile: (profile: PortfolioProfile) => void
  onDeleteProfile: (profileId: string) => void
  onResetActiveProfile: () => void
}

export function PortfolioManager({
  activeProfileId,
  profiles,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onResetActiveProfile,
}: PortfolioManagerProps) {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")
  const [newProfileIcon, setNewProfileIcon] = useState("💼")
  const [newProfileCash, setNewProfileCash] = useState("100000")
  const [newProfileDesc, setNewProfileDesc] = useState("")

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0]

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProfileName.trim()) return

    const cashNum = parseFloat(newProfileCash) || 100000
    const newProfile: PortfolioProfile = {
      id: `custom-${Date.now()}`,
      name: newProfileName.trim(),
      icon: newProfileIcon || "💼",
      description: newProfileDesc.trim() || "Custom Investment Portfolio",
      totalCash: cashNum,
      investedAmount: 0,
      portfolioState: {
        id: `custom-${Date.now()}`,
        trigger: "custom",
        performanceData: [],
        allocations: [],
        returnsData: [],
        bullInsights: [],
        bearInsights: [],
        currentPortfolioValue: 0,
        totalReturns: 0,
      },
      isPreset: false,
    }

    onCreateProfile(newProfile)
    onSelectProfile(newProfile.id)
    setShowCreateModal(false)
    setNewProfileName("")
    setNewProfileDesc("")
    setNewProfileCash("100000")
  }

  return (
    <>
      {/* Portfolio Selector Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            theme === "bloomberg"
              ? "bg-[#110a00] border-[#442a00] text-[#ff9900] hover:border-[#ff9900]"
              : theme === "light"
              ? "bg-white border-slate-300 text-slate-800 shadow-sm hover:border-slate-400"
              : "bg-white/5 border-white/10 hover:bg-white/10 text-[#f5f5f7] hover:border-purple-500/40"
          }`}
        >
          <span className="text-sm">{activeProfile.icon}</span>
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-[10px] text-[#a1a1aa] uppercase font-mono tracking-wider">Active Account</div>
            <div className="font-semibold truncate max-w-[130px]">{activeProfile.name}</div>
          </div>
          <ChevronDown size={14} className={`text-[#a1a1aa] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute left-0 mt-2 w-72 p-2 rounded-2xl border shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 ${
              theme === "bloomberg"
                ? "bg-[#050505] border-[#442a00] text-[#ff9900]"
                : theme === "light"
                ? "bg-white/95 border-slate-200 text-slate-800 shadow-xl"
                : "bg-black/90 border-white/15 text-[#f5f5f7]"
            }`}
          >
            <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-white/10 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">Account Profiles</span>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(true)
                  setIsOpen(false)
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <Plus size={12} />
                <span>New Profile</span>
              </button>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto hide-scrollbar">
              {profiles.map((profile) => {
                const isActive = profile.id === activeProfileId
                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      onSelectProfile(profile.id)
                      setIsOpen(false)
                    }}
                    className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? "bg-purple-500/20 border border-purple-500/40 text-[#f5f5f7]"
                        : "hover:bg-white/5 border border-transparent text-[#a1a1aa] hover:text-[#f5f5f7]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-lg">{profile.icon}</span>
                      <div className="overflow-hidden text-left">
                        <div className="text-xs font-bold truncate text-[#f5f5f7]">{profile.name}</div>
                        <div className="text-[10px] text-[#a1a1aa] truncate font-mono">
                          ${profile.totalCash.toLocaleString()} Cash • {profile.portfolioState.allocations?.length || 0} Assets
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isActive && <Check size={14} className="text-purple-400 flex-shrink-0" />}
                      {!profile.isPreset && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Delete profile "${profile.name}"?`)) {
                              onDeleteProfile(profile.id)
                            }
                          }}
                          className="p-1 hover:text-rose-400 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Reset Active Profile */}
            <div className="mt-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Reset active portfolio "${activeProfile.name}" back to default cash and clean slate?`)) {
                    onResetActiveProfile()
                    setIsOpen(false)
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset Active Portfolio</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create New Custom Portfolio Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl backdrop-blur-2xl relative ${
              theme === "bloomberg"
                ? "bg-[#050505] border-[#442a00] text-[#ff9900]"
                : theme === "light"
                ? "bg-white border-slate-200 text-slate-800 shadow-2xl"
                : "bg-[#0d0d14]/95 border-white/15 text-[#f5f5f7]"
            }`}
          >
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 text-[#a1a1aa] hover:text-[#f5f5f7] rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles size={16} />
              </div>
              <h2 className="text-lg font-bold">Create Investment Profile</h2>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">
                  Profile Icon & Name
                </label>
                <div className="flex gap-2">
                  <select
                    value={newProfileIcon}
                    onChange={(e) => setNewProfileIcon(e.target.value)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="💼">💼</option>
                    <option value="🚀">🚀</option>
                    <option value="🛡️">🛡️</option>
                    <option value="💰">💰</option>
                    <option value="⚡">⚡</option>
                    <option value="🎯">🎯</option>
                    <option value="💎">💎</option>
                    <option value="🏛️">🏛️</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="e.g., European Green Energy Fund"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">
                  Initial Cash Balance ($ USD)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={newProfileCash}
                  onChange={(e) => setNewProfileCash(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">
                  Strategy Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Targeting ESG leaders, low volatility, 4% dividend yield..."
                  value={newProfileDesc}
                  onChange={(e) => setNewProfileDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/5 text-[#a1a1aa] hover:text-[#f5f5f7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
