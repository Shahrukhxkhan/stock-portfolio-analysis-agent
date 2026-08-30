"use client"

import React, { useState } from "react"
import {
  Swords,
  FileText,
  Eye,
  Newspaper,
  Activity,
  Globe,
  Landmark,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react"
import { DebateArena, DebateItem } from "./debate-arena"
import { SecFilingRag, SecFilingData } from "./sec-filing-rag"
import { WhaleTracking, WhaleData } from "./whale-tracking"
import { SentimentFeed, SentimentData } from "./sentiment-feed"

export interface MultiAgentCrewData {
  debate_arena?: Record<string, DebateItem>
  sec_edgar_rag?: Record<string, SecFilingData>
  whale_tracking?: Record<string, WhaleData>
  news_sentiment?: Record<string, any>
  technical_analysis?: Record<
    string,
    {
      current_price: number
      rsi: number
      macd: number
      signal: number
      sma50: number
      sma200: number
      crossover_signal: string
      upper_band: number
      lower_band: number
      stance: string
    }
  >
  macro_sector?: {
    sector_breakdown: Array<{ sector: string; weight_pct: number; value: number }>
    fed_policy_risk: string
    inflation_drag_rating: string
    macro_stance: string
  }
  tax_harvesting?: {
    total_potential_tax_savings: number
    candidates: Array<{
      ticker: string
      invested: number
      current_val: number
      unrealized_loss: number
      est_tax_savings: number
      wash_sale_safe_replacement: string
      status: string
    }>
    wash_sale_window_notice: string
  }
}

interface MultiAgentInsightsProps {
  data?: MultiAgentCrewData
}

export function MultiAgentInsights({ data }: MultiAgentInsightsProps) {
  const [activeSubAgent, setActiveSubAgent] = useState<
    "debate" | "sec_rag" | "whale" | "sentiment" | "technical_macro"
  >("debate")

  const technicals = data?.technical_analysis || {
    AAPL: {
      current_price: 232.5,
      rsi: 62.4,
      macd: 2.15,
      signal: 1.8,
      sma50: 224.1,
      sma200: 210.3,
      crossover_signal: "Golden Cross (Bullish)",
      upper_band: 238.0,
      lower_band: 220.0,
      stance: "BULLISH BREAKOUT",
    },
    NVDA: {
      current_price: 138.2,
      rsi: 66.8,
      macd: 4.12,
      signal: 3.5,
      sma50: 128.0,
      sma200: 112.5,
      crossover_signal: "Golden Cross (Bullish)",
      upper_band: 145.0,
      lower_band: 124.0,
      stance: "BULLISH BREAKOUT",
    },
  }

  const macro = data?.macro_sector || {
    sector_breakdown: [
      { sector: "Information Technology", weight_pct: 72.5, value: 72500 },
      { sector: "Consumer Discretionary", weight_pct: 18.0, value: 18000 },
      { sector: "Broad Market ETF", weight_pct: 9.5, value: 9500 },
    ],
    fed_policy_risk: "NEUTRAL / MODERATE (Fed Rate Cuts Expected)",
    inflation_drag_rating: "LOW (CPI Trajectory 2.4%)",
    macro_stance: "FAVORABLE FOR HIGH-QUALITY GROWTH ASSETS",
  }

  const taxHarvesting = data?.tax_harvesting || {
    total_potential_tax_savings: 0,
    candidates: [],
    wash_sale_window_notice: "Must wait 31 days before repurchasing identical security to ensure tax deduction compliance.",
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
    <div className="space-y-4">
      {/* Top Sub-Agent Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
        {[
          { id: "debate", label: "Debate Arena", icon: Swords, color: "text-purple-400" },
          { id: "sec_rag", label: "SEC EDGAR RAG", icon: FileText, color: "text-blue-400" },
          { id: "whale", label: "Whale & 13F Tracker", icon: Eye, color: "text-amber-400" },
          { id: "sentiment", label: "News & Sentiment", icon: Newspaper, color: "text-cyan-400" },
          { id: "technical_macro", label: "Technical & Macro", icon: Activity, color: "text-emerald-400" },
        ].map((sub) => {
          const Icon = sub.icon
          const isActive = activeSubAgent === sub.id
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubAgent(sub.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-[#f5f5f7] border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                  : "text-[#a1a1aa] hover:text-[#f5f5f7] hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon size={14} className={isActive ? sub.color : "text-[#a1a1aa]"} />
              <span>{sub.label}</span>
            </button>
          )
        })}
      </div>

      {/* 1. DEBATE ARENA */}
      {activeSubAgent === "debate" && <DebateArena debates={data?.debate_arena} />}

      {/* 2. SEC EDGAR RAG AGENT */}
      {activeSubAgent === "sec_rag" && <SecFilingRag data={data?.sec_edgar_rag} />}

      {/* 3. WHALE & 13F TRACKING */}
      {activeSubAgent === "whale" && <WhaleTracking data={data?.whale_tracking} />}

      {/* 4. NEWS & SENTIMENT AGENT */}
      {activeSubAgent === "sentiment" && <SentimentFeed data={data?.news_sentiment} />}

      {/* 5. TECHNICAL & MACRO & TAX HARVESTING (EXISTING CORE ENGINES) */}
      {activeSubAgent === "technical_macro" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TECHNICAL ANALYSIS AGENT */}
          <div className="glass-panel p-5 space-y-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.06)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f5f5f7] font-['Roobert']">Technical Analysis Agent</h3>
                  <p className="text-[11px] text-[#a1a1aa]">RSI(14), MACD, SMA crossovers, Bollinger Bands</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(technicals).map(([ticker, metrics]) => (
                <div key={ticker} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#f5f5f7] font-['Roobert']">{ticker}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        metrics.stance.includes("BULLISH")
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : metrics.stance.includes("BEARISH")
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-white/10 text-[#a1a1aa]"
                      }`}
                    >
                      {metrics.stance}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-[#a1a1aa]">
                    <div>
                      RSI(14):{" "}
                      <span className={metrics.rsi > 70 ? "text-rose-400 font-bold" : metrics.rsi < 30 ? "text-emerald-400 font-bold" : "text-[#f5f5f7]"}>
                        {metrics.rsi}
                      </span>
                    </div>
                    <div>
                      MACD: <span className="text-[#f5f5f7]">{metrics.macd}</span>
                    </div>
                    <div>
                      Price: <span className="text-[#f5f5f7]">${metrics.current_price}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#a1a1aa] pt-1 border-t border-white/5 flex items-center justify-between font-mono">
                    <span>50/200 SMA: {metrics.crossover_signal}</span>
                    <span className="text-purple-300">BB: ${metrics.lower_band} - ${metrics.upper_band}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MACROECONOMIC & SECTOR EXPOSURE AGENT */}
          <div className="glass-panel p-5 space-y-4 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.06)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Globe size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f5f5f7] font-['Roobert']">Macro & Sector Exposure</h3>
                  <p className="text-[11px] text-[#a1a1aa]">Fed policy, inflation drag, and sector concentration</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Sector Concentration</div>
              {macro.sector_breakdown.map((s) => (
                <div key={s.sector} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#f5f5f7]">{s.sector}</span>
                    <span className="text-purple-300 font-bold">{s.weight_pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: `${s.weight_pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs font-mono">
              <div className="text-[#a1a1aa]">Fed Policy Stance: <span className="text-[#f5f5f7] font-semibold">{macro.fed_policy_risk}</span></div>
              <div className="text-[#a1a1aa]">Inflation Trajectory: <span className="text-[#f5f5f7] font-semibold">{macro.inflation_drag_rating}</span></div>
            </div>
          </div>

          {/* TAX-LOSS HARVESTING AGENT */}
          <div className="glass-panel p-5 space-y-4 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.06)] md:col-span-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Landmark size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f5f5f7] font-['Roobert']">Tax-Loss Harvesting Agent</h3>
                  <p className="text-[11px] text-[#a1a1aa]">Underwater holding identification & tax loss savings</p>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-[10px] text-[#a1a1aa] uppercase">Potential Tax Offset</div>
                <div className="text-base font-bold text-rose-400">
                  {formatCurrency(taxHarvesting.total_potential_tax_savings)}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {taxHarvesting.candidates.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 text-center font-semibold">
                  All portfolio holdings are currently in net gain. No tax loss harvesting offsets required.
                </div>
              ) : (
                taxHarvesting.candidates.map((cand) => (
                  <div key={cand.ticker} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs font-mono">
                    <div className="flex justify-between font-bold text-[#f5f5f7]">
                      <span>{cand.ticker}</span>
                      <span className="text-rose-400">-${cand.unrealized_loss.toFixed(0)} Loss</span>
                    </div>
                    <div className="text-[11px] text-[#a1a1aa]">
                      Est. Tax Savings: <span className="text-emerald-400 font-semibold">{formatCurrency(cand.est_tax_savings)}</span>
                    </div>
                    <div className="text-[10px] text-[#a1a1aa]">
                      Safe Replacement ETF: <span className="text-purple-300 font-mono">{cand.wash_sale_safe_replacement}</span>
                    </div>
                  </div>
                ))
              )}
              <div className="text-[10px] text-[#a1a1aa] flex items-center gap-1 font-mono">
                <AlertTriangle size={12} className="text-amber-400" />
                <span>{taxHarvesting.wash_sale_window_notice}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
