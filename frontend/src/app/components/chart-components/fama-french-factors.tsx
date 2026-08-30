"use client"

import React from "react"
import { useTheme } from "../../context/theme-context"
import {
  Layers,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle2,
} from "lucide-react"

export interface FactorItem {
  factor_name: string
  loading: number
  benchmark: number
  interpretation: string
}

export interface FamaFrenchData {
  factor_breakdown: FactorItem[]
  jensens_alpha_annualized_pct: number
  r_squared_pct: number
  summary_style: string
}

interface FamaFrenchFactorsProps {
  data?: FamaFrenchData
}

const DEFAULT_FF_DATA: FamaFrenchData = {
  factor_breakdown: [
    { factor_name: "Market Beta (Mkt-RF)", loading: 1.35, benchmark: 1.00, interpretation: "Aggressive High-Beta Tilt" },
    { factor_name: "Size Tilt (SMB)", loading: -0.36, benchmark: 0.00, interpretation: "Large-Cap Quality Tilt" },
    { factor_name: "Value vs Growth (HML)", loading: -0.62, benchmark: 0.00, interpretation: "High-Growth Secular Tilt" },
    { factor_name: "Profitability Quality (RMW)", loading: 0.98, benchmark: 0.00, interpretation: "Robust Enterprise Quality" },
    { factor_name: "Investment Reinvestment (CMA)", loading: -0.45, benchmark: 0.00, interpretation: "Aggressive CapEx Reinvestment" },
    { factor_name: "Trend Momentum (MOM)", loading: 0.64, benchmark: 0.00, interpretation: "High Relative Momentum" },
  ],
  jensens_alpha_annualized_pct: 10.45,
  r_squared_pct: 89.4,
  summary_style: "High-Quality Secular Growth with Strong Momentum Overweight",
}

export function FamaFrenchFactors({ data = DEFAULT_FF_DATA }: FamaFrenchFactorsProps) {
  const { theme } = useTheme()
  const ff = data || DEFAULT_FF_DATA

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
          <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Fama-French 5-Factor & Momentum Decomposition</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Factor Premia
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Decomposes portfolio returns into systematic factor tilts: Market Beta, Size, Value, Quality, Investment, and Momentum
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div>
            <span className="text-[#a1a1aa] block text-[10px] uppercase">Jensen&apos;s Alpha (α)</span>
            <strong className="text-emerald-400 text-sm">+{ff.jensens_alpha_annualized_pct}% / yr</strong>
          </div>
          <div>
            <span className="text-[#a1a1aa] block text-[10px] uppercase">Model Fit (R²)</span>
            <strong className="text-purple-300 text-sm">{ff.r_squared_pct}%</strong>
          </div>
        </div>
      </div>

      {/* Summary Style Pill */}
      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 mb-5 flex items-center gap-3 text-xs text-[#f5f5f7]">
        <Sparkles size={16} className="text-cyan-400 flex-shrink-0" />
        <span>
          Dominant Factor Signature: <strong className="text-cyan-300">{ff.summary_style}</strong>
        </span>
      </div>

      {/* Factor Loadings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ff.factor_breakdown.map((item) => {
          const isPositive = item.loading >= 0
          return (
            <div
              key={item.factor_name}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#f5f5f7]">{item.factor_name}</span>
                  <span className="text-xs font-mono font-extrabold text-cyan-300">
                    {isPositive ? "+" : ""}
                    {item.loading}
                  </span>
                </div>

                {/* Factor Loading Level Bar centered at 0 */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative my-2">
                  <div
                    className={`h-full transition-all ${
                      isPositive ? "bg-gradient-to-r from-cyan-500 to-emerald-400" : "bg-gradient-to-r from-amber-500 to-rose-400"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.abs(item.loading) * 45)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#a1a1aa]">Benchmark: {item.benchmark.toFixed(2)}</span>
                <span className="text-purple-300 font-bold">{item.interpretation}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
