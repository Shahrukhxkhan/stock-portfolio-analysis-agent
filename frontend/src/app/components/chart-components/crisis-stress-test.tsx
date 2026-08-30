"use client"

import React from "react"
import { useTheme } from "../../context/theme-context"
import {
  Flame,
  AlertTriangle,
  ShieldAlert,
  Clock,
  TrendingDown,
  Activity,
  Zap,
} from "lucide-react"

export interface CrisisScenario {
  name: string
  description: string
  portfolio_drawdown_pct: number
  benchmark_drawdown_pct: number
  duration_months: number
  est_recovery_months: number
  severity_status: "HIGH" | "MODERATE" | "LOW"
}

export interface VarMetrics {
  var_95_daily_pct: number
  var_99_daily_pct: number
  cvar_95_expected_shortfall_daily_pct: number
  var_95_monthly_pct: number
  var_99_monthly_pct: number
}

export interface CrisisStressTestData {
  crisis_scenarios: CrisisScenario[]
  var_metrics: VarMetrics
}

interface CrisisStressTestProps {
  data?: CrisisStressTestData
}

const DEFAULT_STRESS_DATA: CrisisStressTestData = {
  crisis_scenarios: [
    {
      name: "2008 Global Financial Crisis",
      description: "Lehman Brothers collapse, systemic banking liquidity freeze, and global economic contraction (Sep 2008 - Mar 2009)",
      portfolio_drawdown_pct: -48.2,
      benchmark_drawdown_pct: -50.9,
      duration_months: 17,
      est_recovery_months: 49,
      severity_status: "HIGH",
    },
    {
      name: "2020 COVID-19 Liquidity Shock",
      description: "Global pandemic lockdowns, rapid equity liquidity crunch, and emergency central bank interventions (Feb - Mar 2020)",
      portfolio_drawdown_pct: -31.4,
      benchmark_drawdown_pct: -33.9,
      duration_months: 1.5,
      est_recovery_months: 5,
      severity_status: "MODERATE",
    },
    {
      name: "2022 Fed Rate Shock & Tech Unwind",
      description: "Aggressive Fed monetary tightening, 9.1% inflation peak, and long-duration growth equity multiple compression (Jan - Oct 2022)",
      portfolio_drawdown_pct: -28.6,
      benchmark_drawdown_pct: -25.4,
      duration_months: 10,
      est_recovery_months: 15,
      severity_status: "MODERATE",
    },
    {
      name: "2000 Dot-com Bubble Deflation",
      description: "Extreme valuation multiple unwinding across unprofitable technology & telecommunications equities (2000 - 2002)",
      portfolio_drawdown_pct: -52.4,
      benchmark_drawdown_pct: -44.7,
      duration_months: 30,
      est_recovery_months: 56,
      severity_status: "HIGH",
    },
  ],
  var_metrics: {
    var_95_daily_pct: 2.07,
    var_99_daily_pct: 2.93,
    cvar_95_expected_shortfall_daily_pct: 2.60,
    var_95_monthly_pct: 9.49,
    var_99_monthly_pct: 13.43,
  },
}

export function CrisisStressTest({ data = DEFAULT_STRESS_DATA }: CrisisStressTestProps) {
  const { theme } = useTheme()
  const stress = data || DEFAULT_STRESS_DATA

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
          <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Historical Crisis Stress Testing & Value at Risk (VaR)</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Tail Risk & CVaR
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Simulates portfolio drawdowns under major historical financial crises and computes parametric tail risk
            </p>
          </div>
        </div>
      </div>

      {/* Value at Risk (VaR) KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">1-Day 95% VaR</span>
          <div className="text-base font-extrabold text-amber-400">-{stress.var_metrics.var_95_daily_pct}%</div>
          <span className="text-[10px] text-[#a1a1aa]">95% probability daily loss limit</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">1-Day 99% VaR</span>
          <div className="text-base font-extrabold text-rose-400">-{stress.var_metrics.var_99_daily_pct}%</div>
          <span className="text-[10px] text-[#a1a1aa]">99% probability worst-case day</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">95% Expected Shortfall (CVaR)</span>
          <div className="text-base font-extrabold text-purple-300">-{stress.var_metrics.cvar_95_expected_shortfall_daily_pct}%</div>
          <span className="text-[10px] text-[#a1a1aa]">Average loss beyond 95% VaR</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">1-Month 95% VaR</span>
          <div className="text-base font-extrabold text-amber-300">-{stress.var_metrics.var_95_monthly_pct}%</div>
          <span className="text-[10px] text-[#a1a1aa]">Monthly tail drawdown limit</span>
        </div>
      </div>

      {/* Historical Crisis Simulation Cards */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] font-mono">
          Historical Macro Crisis Shock Scenarios
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stress.crisis_scenarios.map((scenario) => (
            <div
              key={scenario.name}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-[#f5f5f7]">{scenario.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      scenario.severity_status === "HIGH"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {scenario.severity_status} SEVERITY
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa] mb-3 leading-relaxed">{scenario.description}</p>

                {/* Drawdown Progress Bars */}
                <div className="space-y-2 text-xs font-mono mb-3">
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span>Simulated Portfolio:</span>
                      <strong className="text-rose-400">{scenario.portfolio_drawdown_pct}%</strong>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full transition-all"
                        style={{ width: `${Math.min(100, Math.abs(scenario.portfolio_drawdown_pct))}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-0.5 text-[#a1a1aa]">
                      <span>S&P 500 Benchmark:</span>
                      <span>{scenario.benchmark_drawdown_pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-500 h-full transition-all"
                        style={{ width: `${Math.min(100, Math.abs(scenario.benchmark_drawdown_pct))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration & Recovery Footnote */}
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#a1a1aa]">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> Crash: {scenario.duration_months} mo
                </span>
                <span className="text-emerald-400">Recovery: ~{scenario.est_recovery_months} mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
