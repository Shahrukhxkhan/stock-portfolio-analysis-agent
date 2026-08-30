"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Globe,
  Landmark,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Sliders,
  DollarSign,
  Percent,
  Sparkles,
  Info,
  Clock,
} from "lucide-react"

export interface MaturityYield {
  key: string
  label: string
  years: number
  current: number
  one_month_ago: number
  one_year_ago: number
  peak_inversion: number
}

export interface MacroYieldCurveData {
  yield_curve: {
    maturities: MaturityYield[]
  }
  spreads_and_recession: {
    spread_10y_2y_pct: number
    spread_10y_3m_pct: number
    is_10_2_inverted: boolean
    is_10_3m_inverted: boolean
    recession_probability_pct: number
    macro_regime: string
    economic_cycle_phase: string
    fed_policy_stance: string
  }
  rate_shocks: {
    portfolio_effective_duration_years: number
    interest_rate_risk_level: string
    asset_breakdown: Array<{
      ticker: string
      weight_pct: number
      effective_duration_years: number
      rate_sensitivity: string
    }>
    shock_scenarios: Array<{
      shock_label: string
      rate_delta_bps: number
      projected_pnl_pct: number
      impact_direction: "POSITIVE" | "NEGATIVE"
      macro_context: string
    }>
  }
}

interface MacroYieldCurveCardProps {
  data?: MacroYieldCurveData
}

const DEFAULT_MACRO_DATA: MacroYieldCurveData = {
  yield_curve: {
    maturities: [
      { key: "1M", label: "1 Month", years: 0.083, current: 4.62, one_month_ago: 4.82, one_year_ago: 5.45, peak_inversion: 5.55 },
      { key: "3M", label: "3 Month", years: 0.25, current: 4.55, one_month_ago: 4.75, one_year_ago: 5.4, peak_inversion: 5.5 },
      { key: "6M", label: "6 Month", years: 0.5, current: 4.48, one_month_ago: 4.65, one_year_ago: 5.35, peak_inversion: 5.48 },
      { key: "1Y", label: "1 Year", years: 1.0, current: 4.35, one_month_ago: 4.45, one_year_ago: 5.15, peak_inversion: 5.4 },
      { key: "2Y", label: "2 Year", years: 2.0, current: 4.22, one_month_ago: 4.15, one_year_ago: 4.88, peak_inversion: 5.1 },
      { key: "5Y", label: "5 Year", years: 5.0, current: 4.28, one_month_ago: 4.08, one_year_ago: 4.55, peak_inversion: 4.45 },
      { key: "10Y", label: "10 Year", years: 10.0, current: 4.4, one_month_ago: 4.2, one_year_ago: 4.45, peak_inversion: 3.85 },
      { key: "20Y", label: "20 Year", years: 20.0, current: 4.68, one_month_ago: 4.52, one_year_ago: 4.75, peak_inversion: 4.15 },
      { key: "30Y", label: "30 Year", years: 30.0, current: 4.58, one_month_ago: 4.42, one_year_ago: 4.6, peak_inversion: 3.95 },
    ],
  },
  spreads_and_recession: {
    spread_10y_2y_pct: 0.18,
    spread_10y_3m_pct: -0.15,
    is_10_2_inverted: false,
    is_10_3m_inverted: true,
    recession_probability_pct: 28,
    macro_regime: "NORMALIZING / SOFT LANDING PROJECTION",
    economic_cycle_phase: "Phase 3: Disinflationary Transition",
    fed_policy_stance: "EASING CYCLE COMMENCING (Neutral Rate 3.0-3.5%)",
  },
  rate_shocks: {
    portfolio_effective_duration_years: 16.8,
    interest_rate_risk_level: "ELEVATED DURATION (Growth Equity Tilt)",
    asset_breakdown: [
      { ticker: "NVDA", weight_pct: 45.0, effective_duration_years: 18.5, rate_sensitivity: "EXTREME" },
      { ticker: "AAPL", weight_pct: 35.0, effective_duration_years: 14.2, rate_sensitivity: "HIGH" },
      { ticker: "MSFT", weight_pct: 20.0, effective_duration_years: 15.0, rate_sensitivity: "HIGH" },
    ],
    shock_scenarios: [
      { shock_label: "Aggressive Fed Easing (-100 bps)", rate_delta_bps: -100, projected_pnl_pct: 14.3, impact_direction: "POSITIVE", macro_context: "Accelerated rate cuts boost growth asset discount multiples." },
      { shock_label: "Moderate Fed Cut (-50 bps)", rate_delta_bps: -50, projected_pnl_pct: 7.1, impact_direction: "POSITIVE", macro_context: "Orderly policy normalization provides supportive equity tailwind." },
      { shock_label: "Hawkish Pause / Hike (+50 bps)", rate_delta_bps: 50, projected_pnl_pct: -7.1, impact_direction: "NEGATIVE", macro_context: "Inflation resurgence pressures long-duration tech multiples." },
      { shock_label: "Severe Inflation Shock (+100 bps)", rate_delta_bps: 100, projected_pnl_pct: -14.3, impact_direction: "NEGATIVE", macro_context: "Aggressive monetary tightening triggers multiple contraction." },
    ],
  },
}

export function MacroYieldCurveCard({ data = DEFAULT_MACRO_DATA }: MacroYieldCurveCardProps) {
  const { theme } = useTheme()
  const activeData = data || DEFAULT_MACRO_DATA
  const [hoveredMaturity, setHoveredMaturity] = useState<MaturityYield | null>(null)
  const [customRateDeltaBps, setCustomRateDeltaBps] = useState<number>(-50)

  const maturities = activeData.yield_curve.maturities

  // SVG dimensions for Yield Curve
  const width = 600
  const height = 240

  const minY = 3.5
  const maxY = 6.0
  const ySpan = maxY - minY

  const getX = (idx: number) => (idx / (maturities.length - 1 || 1)) * (width - 70) + 45
  const getY = (val: number) => height - ((val - minY) / ySpan) * (height - 50) - 25

  const currentPolyline = maturities.map((m, i) => `${getX(i)},${getY(m.current)}`).join(" ")
  const monthAgoPolyline = maturities.map((m, i) => `${getX(i)},${getY(m.one_month_ago)}`).join(" ")
  const yearAgoPolyline = maturities.map((m, i) => `${getX(i)},${getY(m.one_year_ago)}`).join(" ")
  const peakInversionPolyline = maturities.map((m, i) => `${getX(i)},${getY(m.peak_inversion)}`).join(" ")

  // Interactive Fed Rate Shock calculation
  const customPnlPct = +(
    -customRateDeltaBps *
    (activeData.rate_shocks.portfolio_effective_duration_years / 100.0) *
    0.85
  ).toFixed(1)

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
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Globe size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Macro US Treasury Yield Curve & Recession Barometer</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Term Structure
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Benchmark yield curve dynamics, 2Y/10Y inversion spreads, recession probability, and Fed rate shock simulator
            </p>
          </div>
        </div>

        {/* Macro Regime Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
          <Sparkles size={13} className="text-indigo-400" />
          <span className="font-bold">{activeData.spreads_and_recession.macro_regime}</span>
        </div>
      </div>

      {/* Recession Probability & Inversion Spread Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">10Y - 2Y Spread</span>
          <div
            className={`text-base font-extrabold ${
              activeData.spreads_and_recession.spread_10y_2y_pct >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {activeData.spreads_and_recession.spread_10y_2y_pct > 0 ? "+" : ""}
            {activeData.spreads_and_recession.spread_10y_2y_pct}%
          </div>
          <span className="text-[10px] text-[#a1a1aa]">
            {activeData.spreads_and_recession.is_10_2_inverted ? "Inverted Curve (Warning)" : "Normal / Steepening"}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">10Y - 3M Spread</span>
          <div
            className={`text-base font-extrabold ${
              activeData.spreads_and_recession.spread_10y_3m_pct >= 0 ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {activeData.spreads_and_recession.spread_10y_3m_pct > 0 ? "+" : ""}
            {activeData.spreads_and_recession.spread_10y_3m_pct}%
          </div>
          <span className="text-[10px] text-[#a1a1aa]">NY Fed Indicator</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Recession Probability</span>
          <div className="text-base font-extrabold text-purple-300">
            {activeData.spreads_and_recession.recession_probability_pct}%
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 h-full"
              style={{ width: `${activeData.spreads_and_recession.recession_probability_pct}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Portfolio Duration</span>
          <div className="text-base font-extrabold text-cyan-300">
            {activeData.rate_shocks.portfolio_effective_duration_years} yrs
          </div>
          <span className="text-[10px] text-[#a1a1aa]">Growth Equity Sensitivity</span>
        </div>
      </div>

      {/* Interactive Yield Curve Multi-Line Chart (SVG) */}
      <div className="p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] font-mono">
              US Treasury Yield Curve Comparison
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400"></span>
              <span className="text-cyan-300 font-bold">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-400"></span>
              <span className="text-[#a1a1aa]">1M Ago</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500"></span>
              <span className="text-[#a1a1aa]">1Y Ago</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-400"></span>
              <span className="text-rose-300">Peak Inversion</span>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto hide-scrollbar select-none">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-h-[220px]">
            {/* Grid horizontal lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
              const y = height * ratio
              const val = maxY - ratio * ySpan
              return (
                <g key={`grid-y-${idx}`}>
                  <line x1="45" y1={y} x2={width - 25} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <text x="40" y={y + 3} textAnchor="end" fill="#6b7280" fontSize="9" fontFamily="monospace">
                    {val.toFixed(1)}%
                  </text>
                </g>
              )
            })}

            {/* X-axis maturity labels */}
            {maturities.map((m, i) => (
              <text key={`mat-${i}`} x={getX(i)} y={height - 6} textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="monospace">
                {m.key}
              </text>
            ))}

            {/* 1-Year Ago Curve */}
            <polyline fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" points={yearAgoPolyline} />

            {/* Peak Inversion Curve */}
            <polyline fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" points={peakInversionPolyline} />

            {/* 1-Month Ago Curve */}
            <polyline fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="2 2" points={monthAgoPolyline} />

            {/* Current Curve (Solid Cyan) */}
            <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={currentPolyline} />

            {/* Interactive Hover Circles */}
            {maturities.map((m, idx) => {
              const cx = getX(idx)
              const cy = getY(m.current)
              return (
                <circle
                  key={`dot-${idx}`}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#06b6d4"
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() => setHoveredMaturity(m)}
                />
              )
            })}
          </svg>

          {/* Hover Crosshair Tooltip */}
          {hoveredMaturity && (
            <div className="absolute top-2 right-2 p-2.5 rounded-xl bg-black/90 border border-cyan-500/40 text-xs font-mono z-20 shadow-2xl backdrop-blur-xl animate-in fade-in">
              <div className="text-[10px] text-cyan-400 font-bold uppercase mb-0.5">
                Maturity: {hoveredMaturity.label} ({hoveredMaturity.key})
              </div>
              <div className="space-y-0.5">
                <div>
                  Current Yield: <strong className="text-cyan-300">{hoveredMaturity.current}%</strong>
                </div>
                <div className="text-[#a1a1aa] text-[10px]">1-Month Ago: {hoveredMaturity.one_month_ago}%</div>
                <div className="text-[#a1a1aa] text-[10px]">1-Year Ago: {hoveredMaturity.one_year_ago}%</div>
                <div className="text-rose-400 text-[10px]">Peak Inversion: {hoveredMaturity.peak_inversion}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Federal Reserve Rate Shock & Duration Simulator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 border border-indigo-500/30 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-indigo-400" />
            <span className="font-bold text-[#f5f5f7]">Federal Reserve Interest Rate Shock Simulator</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[#a1a1aa]">Simulated Shift:</span>
            <span
              className={`px-2 py-0.5 rounded font-extrabold ${
                customRateDeltaBps < 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
              }`}
            >
              {customRateDeltaBps > 0 ? "+" : ""}
              {customRateDeltaBps} bps
            </span>
          </div>
        </div>

        {/* Interactive Rate Delta Slider */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-[11px] text-[#a1a1aa]">
            <span>-200 bps (Aggressive Cut)</span>
            <span>0 bps (Neutral)</span>
            <span>+200 bps (Aggressive Hike)</span>
          </div>
          <input
            type="range"
            min={-200}
            max={200}
            step={25}
            value={customRateDeltaBps}
            onChange={(e) => setCustomRateDeltaBps(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
        </div>

        {/* Real-time Projected Valuation Shift */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase block">Projected Portfolio Valuation Shift</span>
            <strong
              className={`text-base font-extrabold ${
                customPnlPct >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {customPnlPct >= 0 ? "+" : ""}
              {customPnlPct}% P&L Impact
            </strong>
          </div>
          <div className="text-right text-[11px] text-[#a1a1aa]">
            <div>Effective Portfolio Duration: <strong className="text-[#f5f5f7]">{activeData.rate_shocks.portfolio_effective_duration_years} yrs</strong></div>
            <div className="text-purple-300">{activeData.spreads_and_recession.fed_policy_stance}</div>
          </div>
        </div>

        {/* Asset Sensitivity Breakdown */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase text-[#a1a1aa] tracking-wider mb-1">
            Asset-by-Asset Duration Sensitivity
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeData.rate_shocks.asset_breakdown.map((item) => (
              <div key={item.ticker} className="p-2 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#f5f5f7] block">{item.ticker}</span>
                  <span className="text-[10px] text-[#a1a1aa]">{item.weight_pct}% weight</span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-300 font-bold block">{item.effective_duration_years}y dur</span>
                  <span className="text-[9px] text-purple-300 uppercase">{item.rate_sensitivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
