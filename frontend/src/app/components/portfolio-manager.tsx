"use client"

import React, { useState } from "react"
import {
  Plus,
  Trash2,
  RotateCcw,
  Check,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react"
import type { PortfolioState } from "../page"

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
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E6EF] text-xs font-bold transition-all cursor-pointer bg-[#FFFFFF] text-[#101828] hover:border-[#3730E0] shadow-xs"
        >
          <span className="text-sm">{activeProfile.icon}</span>
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-[10px] text-[#6B7A99] uppercase font-mono tracking-wider">Active Account</div>
            <div className="font-semibold truncate max-w-[130px]">{activeProfile.name}</div>
          </div>
          <ChevronDown size={14} className={`text-[#6B7A99] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-2 w-72 p-2 rounded-2xl border border-[#E2E6EF] shadow-lg z-50 bg-[#FFFFFF] text-[#101828]">
            <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-[#E2E6EF] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A99]">Account Profiles</span>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(true)
                  setIsOpen(false)
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#3730E0] hover:underline cursor-pointer"
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
                        ? "bg-[#3730E0]/10 border border-[#3730E0]/30 text-[#101828]"
                        : "hover:bg-[#F3F4F8] border border-transparent text-[#6B7A99] hover:text-[#101828]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-lg">{profile.icon}</span>
                      <div className="overflow-hidden text-left">
                        <div className="text-xs font-bold truncate text-[#101828]">{profile.name}</div>
                        <div className="text-[10px] text-[#6B7A99] truncate font-mono">
                          ${profile.totalCash.toLocaleString()} Cash • {profile.portfolioState.allocations?.length || 0} Assets
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isActive && <Check size={14} className="text-[#3730E0] flex-shrink-0" />}
                      {!profile.isPreset && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Delete profile "${profile.name}"?`)) {
                              onDeleteProfile(profile.id)
                            }
                          }}
                          className="p-1 hover:text-[#D64545] opacity-60 hover:opacity-100 transition-opacity"
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
            <div className="mt-2 pt-2 border-t border-[#E2E6EF]">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Reset active portfolio "${activeProfile.name}" back to default cash and clean slate?`)) {
                    onResetActiveProfile()
                    setIsOpen(false)
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#D64545] hover:bg-[#FCEBEB] transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl border border-[#E2E6EF] shadow-2xl relative bg-[#FFFFFF] text-[#101828]">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 text-[#6B7A99] hover:text-[#101828] rounded-full hover:bg-[#F3F4F8] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#3730E0]/10 border border-[#3730E0]/30 flex items-center justify-center text-[#3730E0]">
                <Sparkles size={16} />
              </div>
              <h2 className="text-lg font-bold text-[#101828]">Create Investment Profile</h2>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7A99] mb-1">
                  Profile Icon & Name
                </label>
                <div className="flex gap-2">
                  <select
                    value={newProfileIcon}
                    onChange={(e) => setNewProfileIcon(e.target.value)}
                    className="p-2.5 rounded-xl bg-[#F3F4F8] border border-[#E2E6EF] text-lg focus:outline-none focus:border-[#3730E0]"
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
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F3F4F8] border border-[#E2E6EF] text-sm text-[#101828] focus:outline-none focus:border-[#3730E0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7A99] mb-1">
                  Initial Cash Balance ($ USD)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={newProfileCash}
                  onChange={(e) => setNewProfileCash(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F4F8] border border-[#E2E6EF] text-sm font-mono text-[#101828] focus:outline-none focus:border-[#3730E0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7A99] mb-1">
                  Strategy Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Targeting ESG leaders, low volatility, 4% dividend yield..."
                  value={newProfileDesc}
                  onChange={(e) => setNewProfileDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F4F8] border border-[#E2E6EF] text-xs text-[#101828] focus:outline-none focus:border-[#3730E0] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#F3F4F8] text-[#6B7A99] hover:text-[#101828] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#3730E0] text-white shadow-xs hover:bg-[#3730E0]/90 transition-all cursor-pointer"
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
