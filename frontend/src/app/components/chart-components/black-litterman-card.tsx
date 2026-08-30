"use client"

import React from "react"
import { useTheme } from "../../context/theme-context"
import {
  Scale,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
} from "lucide-react"

export interface BlackLittermanItem {
  ticker: string
  capm_implied_return_pct: number
  ai_agent_view_return_pct: number
  ai_confidence_pct: number
  bl_posterior_return_pct: number
  current_weight_pct: number
  bl_recommended_weight_pct: number
  rationale: string
}

export interface BlackLittermanData {
  allocations: BlackLittermanItem[]
  risk_aversion_parameter: number
  tau_scaling_constant: number
  summary: string
}

interface BlackLittermanCardProps {
  data?: BlackLittermanData
}

const DEFAULT_BL_DATA: BlackLittermanData = {
  allocations: [
    {
      ticker: "NVDA",
      capm_implied_return_pct: 24.0,
      ai_agent_view_return_pct: 32.0,
      ai_confidence_pct: 85,
      bl_posterior_return_pct: 29.8,
      current_weight_pct: 35.0,
      bl_recommended_weight_pct: 42.5,
      rationale: "AI compute monopoly & hyperscaler order book ramp",
    },
    {
      ticker: "MSFT",
      capm_implied_return_pct: 18.0,
      ai_agent_view_return_pct: 23.0,
      ai_confidence_pct: 82,
      bl_posterior_return_pct: 21.6,
      current_weight_pct: 35.0,
      bl_recommended_weight_pct: 35.0,
      rationale: "Azure enterprise AI monetization across Office 365",
    },
    {
      ticker: "AAPL",
      capm_implied_return_pct: 16.0,
      ai_agent_view_return_pct: 19.0,
      ai_confidence_pct: 75,
      bl_posterior_return_pct: 17.8,
      current_weight_pct: 30.0,
      bl_recommended_weight_pct: 22.5,
      rationale: "Apple Intelligence refresh & high-margin Services mix",
    },
  ],
  risk_aversion_parameter: 2.5,
  tau_scaling_constant: 0.05,
  summary: "Black-Litterman model recommends overweighting high-conviction AI infrastructure while maintaining market equilibrium core.",
}

export function BlackLittermanCard({ data = DEFAULT_BL_DATA }: BlackLittermanCardProps) {
  const { theme } = useTheme()
  const bl = data || DEFAULT_BL_DATA

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
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Scale size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Black-Litterman Asset Allocation Model</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Bayesian Prior + Views
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Blends CAPM market equilibrium implied returns with AI subjective conviction views to compute optimal posterior weights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#a1a1aa]">
          <span>Risk Aversion (λ): {bl.risk_aversion_parameter}</span>
          <span>•</span>
          <span>Tau (τ): {bl.tau_scaling_constant}</span>
        </div>
      </div>

      {/* Model Synthesis Summary Banner */}
      <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 mb-5 flex items-center gap-3 text-xs text-[#f5f5f7]">
        <Brain size={18} className="text-purple-400 flex-shrink-0" />
        <span className="leading-relaxed">{bl.summary}</span>
      </div>

      {/* Table of Allocations */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20 mb-5">
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-white/5 text-[11px] text-[#a1a1aa] border-b border-white/10">
            <tr>
              <th className="p-3">Asset</th>
              <th className="p-3">CAPM Implied</th>
              <th className="p-3">AI Agent View</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">BL Posterior</th>
              <th className="p-3">Current Wt</th>
              <th className="p-3">BL Rec Wt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bl.allocations.map((item) => {
              const delta = +(item.bl_recommended_weight_pct - item.current_weight_pct).toFixed(1)
              return (
                <tr key={item.ticker} className="hover:bg-white/5 transition-colors">
                  <td className="p-3">
                    <span className="font-extrabold text-sm text-[#f5f5f7] block">{item.ticker}</span>
                    <span className="text-[10px] text-[#a1a1aa] truncate max-w-[140px] block">{item.rationale}</span>
                  </td>
                  <td className="p-3 text-[#a1a1aa]">{item.capm_implied_return_pct}%</td>
                  <td className="p-3 font-bold text-emerald-400">+{item.ai_agent_view_return_pct}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.ai_confidence_pct}%
                    </span>
                  </td>
                  <td className="p-3 font-bold text-cyan-300">+{item.bl_posterior_return_pct}%</td>
                  <td className="p-3 text-[#a1a1aa]">{item.current_weight_pct}%</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-emerald-300 text-sm">{item.bl_recommended_weight_pct}%</span>
                      {delta !== 0 && (
                        <span
                          className={`text-[10px] px-1 rounded ${
                            delta > 0
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {delta > 0 ? `+${delta}%` : `${delta}%`}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Visual Weight Comparison Bars */}
      <div className="space-y-3 font-mono text-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">
          Current Weight vs Black-Litterman Target
        </div>
        {bl.allocations.map((item) => (
          <div key={`bar-${item.ticker}`} className="space-y-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#f5f5f7]">{item.ticker}</span>
              <span className="text-[#a1a1aa] text-[11px]">
                Current: {item.current_weight_pct}% →{" "}
                <strong className="text-emerald-300">Target: {item.bl_recommended_weight_pct}%</strong>
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
              <div
                className="bg-purple-400/50 h-full transition-all"
                style={{ width: `${item.current_weight_pct}%` }}
                title={`Current: ${item.current_weight_pct}%`}
              />
              <div
                className="bg-emerald-400 h-full transition-all"
                style={{ width: `${Math.max(0, item.bl_recommended_weight_pct - item.current_weight_pct)}%` }}
                title={`Overweight delta: +${(item.bl_recommended_weight_pct - item.current_weight_pct).toFixed(1)}%`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
