"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Swords,
  TrendingUp,
  TrendingDown,
  Scale,
  ShieldAlert,
  Sparkles,
  Award,
  ChevronRight,
  Zap,
} from "lucide-react"

export interface DebateItem {
  bull: {
    analyst: string
    thesis: string
    points: string[]
  }
  bear: {
    analyst: string
    thesis: string
    points: string[]
  }
  judge: {
    verdict: string
    conviction_score: number
    target_allocation_advice: string
    key_catalyst: string
  }
}

interface DebateArenaProps {
  debates?: Record<string, DebateItem>
}

const DEFAULT_DEBATES: Record<string, DebateItem> = {
  NVDA: {
    bull: {
      analyst: "Alex Vance (Tech Growth Partner)",
      thesis: "Uncontested AI computing moat with CUDA software lock-in and next-generation Blackwell architecture pre-booked for 18+ months.",
      points: [
        "Data center capital expenditures across hyperscalers (Microsoft, Meta, Alphabet) remain at historic highs.",
        "Gross margins exceed 75% due to exceptional pricing power and full-stack software monetization.",
        "Sovereign AI initiatives expanding total addressable market beyond traditional enterprise cloud.",
      ],
    },
    bear: {
      analyst: "Dr. Sarah Chen (Chief Risk Officer)",
      thesis: "Extreme customer concentration risk and impending cyclical digestion phase as hyperscalers develop custom silicon ASICs.",
      points: [
        "Top 4 cloud customers represent over 40% of total revenue, creating severe revenue lumpiness.",
        "Custom silicon (Google TPU, AWS Trainium, Meta MTIA) threatens pricing power on non-frontier workloads.",
        "Export restrictions and geopolitical tensions limit long-term expansion in Asia-Pacific.",
      ],
    },
    judge: {
      verdict: "STRONG OVERWEIGHT",
      conviction_score: 88,
      target_allocation_advice: "Maintain core 25-35% allocation with trailing profit stops on 10% tactical trim.",
      key_catalyst: "Upcoming earnings datacenter guide and Blackwell volume ramp confirmation.",
    },
  },
  AAPL: {
    bull: {
      analyst: "Alex Vance (Tech Growth Partner)",
      thesis: "Unmatched consumer ecosystem stickiness with 2.2B+ active devices driving high-margin Services expansion and Apple Intelligence supercycle.",
      points: [
        "Services business (App Store, iCloud, Apple Pay) growing double-digits at 74% gross margin.",
        "On-device Apple Intelligence prompts multi-year hardware refresh cycle among aging iPhone installed base.",
        "Massive $110B annual share repurchase program provides persistent downside valuation support.",
      ],
    },
    bear: {
      analyst: "Dr. Sarah Chen (Chief Risk Officer)",
      thesis: "Top-line revenue stagnation, regulatory antitrust scrutiny in EU/US, and intensifying domestic smartphone competition in Greater China.",
      points: [
        "Hardware revenue growth has plateaued in key international regions with elongated upgrade cycles.",
        "DOJ and EU antitrust investigations threaten high-margin Google default search revenue sharing ($20B/yr).",
        "Elevated P/E multiple of 32x leaves zero margin of safety for operational missteps.",
      ],
    },
    judge: {
      verdict: "CORE HOLD / MODERATE BUY",
      conviction_score: 76,
      target_allocation_advice: "Anchor at 20-25% as low-beta ballast with aggressive dividend reinvestment.",
      key_catalyst: "Next-quarter iPhone upgrade rate data and Services segment margin expansion.",
    },
  },
}

export function DebateArena({ debates = DEFAULT_DEBATES }: DebateArenaProps) {
  const { theme } = useTheme()
  const activeDebates = Object.keys(debates).length > 0 ? debates : DEFAULT_DEBATES
  const tickers = Object.keys(activeDebates)
  const [selectedTicker, setSelectedTicker] = useState<string>(tickers[0] || "NVDA")

  const currentDebate = activeDebates[selectedTicker] || activeDebates[tickers[0]] || DEFAULT_DEBATES["NVDA"]

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
      {/* Header & Ticker Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500/30 via-purple-500/30 to-emerald-500/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Swords size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Autonomous Multi-Agent Debate Arena</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Adversarial AI
              </span>
              <span className="text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/60 inline-flex items-center gap-1">
                SIMULATED DATA
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Permabull Growth Analyst vs Skeptical Risk Officer adjudicated by Senior Portfolio Manager Judge • <span className="text-zinc-400">Illustrative simulation — generated dialogue scenarios</span>
            </p>
          </div>
        </div>

        {/* Ticker Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {tickers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTicker(t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTicker === t
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] border border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Adversarial Debate Duel: Bull vs Bear Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Permabull Case Card */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-[0_0_20px_rgba(16,185,129,0.08)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐂</span>
                <div>
                  <div className="text-[11px] uppercase font-mono font-bold text-emerald-400">Permabull Growth Thesis</div>
                  <div className="text-xs text-[#a1a1aa] font-medium">{currentDebate.bull.analyst}</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO-GROWTH
              </span>
            </div>

            <p className="text-xs font-semibold text-[#f5f5f7] leading-relaxed mb-4 p-3 rounded-xl bg-black/30 border border-emerald-500/20 italic">
              &ldquo;{currentDebate.bull.thesis}&rdquo;
            </p>

            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#a1a1aa]">Growth Catalysts & Moats</div>
              {currentDebate.bull.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#d1d5db]">
                  <TrendingUp size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeptical Short-Seller Case Card */}
        <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/25 flex flex-col justify-between relative overflow-hidden group hover:border-rose-500/40 transition-all shadow-[0_0_20px_rgba(244,63,94,0.08)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐻</span>
                <div>
                  <div className="text-[11px] uppercase font-mono font-bold text-rose-400">Risk Officer / Bear Thesis</div>
                  <div className="text-xs text-[#a1a1aa] font-medium">{currentDebate.bear.analyst}</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                DOWNSIDE RISK
              </span>
            </div>

            <p className="text-xs font-semibold text-[#f5f5f7] leading-relaxed mb-4 p-3 rounded-xl bg-black/30 border border-rose-500/20 italic">
              &ldquo;{currentDebate.bear.thesis}&rdquo;
            </p>

            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#a1a1aa]">Risk Factors & Vulnerabilities</div>
              {currentDebate.bear.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#d1d5db]">
                  <TrendingDown size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Manager Judge Consensus Verdict */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-pink-500/15 border border-purple-500/30 backdrop-blur-md relative overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.15)]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Scale size={16} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#a1a1aa]">
                Portfolio Manager Consensus
              </div>
              <div className="text-sm font-extrabold text-[#f5f5f7] flex items-center gap-2">
                <span>{currentDebate.judge.verdict}</span>
              </div>
            </div>
          </div>

          {/* Conviction Score Gauge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-[#a1a1aa]">Conviction Score</div>
              <div className="text-base font-extrabold font-mono text-purple-300">
                {currentDebate.judge.conviction_score}%
              </div>
            </div>
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${currentDebate.judge.conviction_score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">
              Target Allocation Recommendation
            </div>
            <p className="text-[#f5f5f7] leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/5">
              {currentDebate.judge.target_allocation_advice}
            </p>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">
              Key Catalyst Watch
            </div>
            <p className="text-[#f5f5f7] leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400 flex-shrink-0" />
              <span>{currentDebate.judge.key_catalyst}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
