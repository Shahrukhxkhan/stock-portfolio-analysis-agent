"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Percent,
} from "lucide-react"

export interface PayoffPoint {
  stock_price: number
  pct_change: number
  unhedged_pnl: number
  hedged_pnl: number
}

export interface OptionStrategyDetail {
  name: string
  tag: string
  description: string
  long_put_strike?: number
  short_call_strike?: number
  long_put_price?: number
  short_call_price?: number
  net_premium_per_share: number
  total_net_cost?: number
  total_net_income?: number
  annualized_cash_yield_pct?: number
  max_downside_loss_pct: number
  max_upside_profit_pct: number
  breakeven_price: number
  delta: number
  daily_theta_decay: number
  payoff_points: PayoffPoint[]
}

export interface TickerHedgingData {
  ticker: string
  current_price: number
  shares: number
  position_value: number
  contracts_needed: number
  implied_volatility_pct: number
  days_to_expiration: number
  strategies: {
    zero_cost_collar: OptionStrategyDetail
    protective_put: OptionStrategyDetail
    covered_call: OptionStrategyDetail
  }
}

export interface OptionsHedgingData {
  tickers: Record<string, TickerHedgingData>
  portfolio_greeks: {
    net_dollar_delta: number
    portfolio_beta_weighted_delta: number
    daily_theta_decay_dollars: number
    vega_exposure_dollars_per_vol_pt: number
    gamma_acceleration: number
  }
  macro_tail_hedge?: {
    benchmark: string
    current_index_price: number
    put_strike: number
    contracts: number
    cost_dollars: number
    cost_pct_of_portfolio: number
    downside_protection_trigger: string
  }
}

interface OptionsHedgingCardProps {
  data?: OptionsHedgingData
}

const DEFAULT_HEDGING_DATA: OptionsHedgingData = {
  tickers: {
    NVDA: {
      ticker: "NVDA",
      current_price: 138.5,
      shares: 200,
      position_value: 27700,
      contracts_needed: 2,
      implied_volatility_pct: 44.0,
      days_to_expiration: 45,
      strategies: {
        zero_cost_collar: {
          name: "Zero-Cost Protective Collar",
          tag: "100% FREE DOWNSIDE FLOOR",
          description: "Buys $131.50 Put (financed by selling $148.80 Call) to guarantee a max loss floor of 5% with 0 net cash outflow.",
          long_put_strike: 131.50,
          short_call_strike: 148.80,
          long_put_price: 4.80,
          short_call_price: 4.85,
          net_premium_per_share: -0.05,
          total_net_cost: -10.0,
          max_downside_loss_pct: -5.0,
          max_upside_profit_pct: 7.5,
          breakeven_price: 138.45,
          delta: 0.52,
          daily_theta_decay: -1.20,
          payoff_points: [
            { stock_price: 96.95, pct_change: -30.0, unhedged_pnl: -8310, hedged_pnl: -1385 },
            { stock_price: 110.80, pct_change: -20.0, unhedged_pnl: -5540, hedged_pnl: -1385 },
            { stock_price: 124.65, pct_change: -10.0, unhedged_pnl: -2770, hedged_pnl: -1385 },
            { stock_price: 131.50, pct_change: -5.0, unhedged_pnl: -1385, hedged_pnl: -1385 },
            { stock_price: 138.50, pct_change: 0.0, unhedged_pnl: 0, hedged_pnl: 10 },
            { stock_price: 145.40, pct_change: 5.0, unhedged_pnl: 1380, hedged_pnl: 1390 },
            { stock_price: 148.80, pct_change: 7.5, unhedged_pnl: 2060, hedged_pnl: 2070 },
            { stock_price: 166.20, pct_change: 20.0, unhedged_pnl: 5540, hedged_pnl: 2070 },
            { stock_price: 180.05, pct_change: 30.0, unhedged_pnl: 8310, hedged_pnl: 2070 },
          ],
        },
        protective_put: {
          name: "Classic Protective Put (Insurance)",
          tag: "GUARANTEED CAPITAL FLOOR",
          description: "Buys $128.00 Put to cap maximum portfolio loss at 7.5% while retaining 100% of all future upside.",
          long_put_strike: 128.0,
          long_put_price: 3.90,
          net_premium_per_share: 3.90,
          total_net_cost: 780.0,
          max_downside_loss_pct: -7.5,
          max_upside_profit_pct: 999.0,
          breakeven_price: 142.40,
          delta: 0.72,
          daily_theta_decay: -4.80,
          payoff_points: [
            { stock_price: 96.95, pct_change: -30.0, unhedged_pnl: -8310, hedged_pnl: -2860 },
            { stock_price: 110.80, pct_change: -20.0, unhedged_pnl: -5540, hedged_pnl: -2860 },
            { stock_price: 124.65, pct_change: -10.0, unhedged_pnl: -2770, hedged_pnl: -2860 },
            { stock_price: 138.50, pct_change: 0.0, unhedged_pnl: 0, hedged_pnl: -780 },
            { stock_price: 152.35, pct_change: 10.0, unhedged_pnl: 2770, hedged_pnl: 1990 },
            { stock_price: 166.20, pct_change: 20.0, unhedged_pnl: 5540, hedged_pnl: 4760 },
            { stock_price: 180.05, pct_change: 30.0, unhedged_pnl: 8310, hedged_pnl: 7530 },
          ],
        },
        covered_call: {
          name: "Covered Call Income Generator",
          tag: "CASH YIELD GENERATION",
          description: "Sells $146.80 Call against shares to generate $1,120 immediate cash yield (14.2% annualized).",
          short_call_strike: 146.80,
          short_call_price: 5.60,
          net_premium_per_share: -5.60,
          total_net_income: 1120.0,
          annualized_cash_yield_pct: 14.2,
          max_downside_loss_pct: -90.0,
          max_upside_profit_pct: 6.0,
          breakeven_price: 132.90,
          delta: 0.58,
          daily_theta_decay: 5.40,
          payoff_points: [
            { stock_price: 96.95, pct_change: -30.0, unhedged_pnl: -8310, hedged_pnl: -7190 },
            { stock_price: 110.80, pct_change: -20.0, unhedged_pnl: -5540, hedged_pnl: -4420 },
            { stock_price: 124.65, pct_change: -10.0, unhedged_pnl: -2770, hedged_pnl: -1650 },
            { stock_price: 138.50, pct_change: 0.0, unhedged_pnl: 0, hedged_pnl: 1120 },
            { stock_price: 146.80, pct_change: 6.0, unhedged_pnl: 1660, hedged_pnl: 2780 },
            { stock_price: 166.20, pct_change: 20.0, unhedged_pnl: 5540, hedged_pnl: 2780 },
            { stock_price: 180.05, pct_change: 30.0, unhedged_pnl: 8310, hedged_pnl: 2780 },
          ],
        },
      },
    },
  },
  portfolio_greeks: {
    net_dollar_delta: 27700.0,
    portfolio_beta_weighted_delta: 31855.0,
    daily_theta_decay_dollars: -1.20,
    vega_exposure_dollars_per_vol_pt: 96.95,
    gamma_acceleration: 0.012,
  },
  macro_tail_hedge: {
    benchmark: "SPY (S&P 500 Index ETF)",
    current_index_price: 585.0,
    put_strike: 497.25,
    contracts: 1,
    cost_dollars: 320.0,
    cost_pct_of_portfolio: 1.15,
    downside_protection_trigger: "Protects against S&P 500 crashes exceeding -15% over next 60 days.",
  },
}

export function OptionsHedgingCard({ data = DEFAULT_HEDGING_DATA }: OptionsHedgingCardProps) {
  const { theme } = useTheme()
  const activeData = data || DEFAULT_HEDGING_DATA
  const tickerKeys = Object.keys(activeData.tickers)
  const [selectedTicker, setSelectedTicker] = useState<string>(tickerKeys[0] || "NVDA")
  const [activeStrategy, setActiveStrategy] = useState<"zero_cost_collar" | "protective_put" | "covered_call">("zero_cost_collar")
  const [hoveredPayoff, setHoveredPayoff] = useState<PayoffPoint | null>(null)

  const currentTickerData = activeData.tickers[selectedTicker] || activeData.tickers[tickerKeys[0]] || DEFAULT_HEDGING_DATA.tickers["NVDA"]
  const currentStrategy = currentTickerData.strategies[activeStrategy] || currentTickerData.strategies["zero_cost_collar"]

  // SVG dimensions for Payoff Diagram
  const width = 600
  const height = 240
  const points = currentStrategy.payoff_points

  const minPnl = Math.min(...points.map((p) => Math.min(p.unhedged_pnl, p.hedged_pnl)))
  const maxPnl = Math.max(...points.map((p) => Math.max(p.unhedged_pnl, p.hedged_pnl)))
  const pnlSpan = maxPnl - minPnl || 1

  const minPrice = points[0]?.stock_price || 100
  const maxPrice = points[points.length - 1]?.stock_price || 200
  const priceSpan = maxPrice - minPrice || 1

  const getX = (price: number) => ((price - minPrice) / priceSpan) * (width - 80) + 50
  const getY = (pnl: number) => height - ((pnl - minPnl) / pnlSpan) * (height - 50) - 25

  const zeroY = getY(0)

  const unhedgedPolyline = points.map((p) => `${getX(p.stock_price)},${getY(p.unhedged_pnl)}`).join(" ")
  const hedgedPolyline = points.map((p) => `${getX(p.stock_price)},${getY(p.hedged_pnl)}`).join(" ")

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
            <ShieldAlert size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Options & Derivatives Hedging Engine</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Black-Scholes & Greeks
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Automated Zero-Cost Collars, Protective Puts, and Covered Call income structures with expiration payoff modeling
            </p>
          </div>
        </div>

        {/* Ticker Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {tickerKeys.map((t) => (
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

      {/* Portfolio Greeks KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Net Dollar Delta (Δ)</span>
          <div className="text-base font-extrabold text-emerald-400">
            +${activeData.portfolio_greeks.net_dollar_delta.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#a1a1aa]">Directional stock exposure</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Daily Theta Decay (Θ)</span>
          <div className="text-base font-extrabold text-purple-300">
            ${activeData.portfolio_greeks.daily_theta_decay_dollars.toFixed(2)} / day
          </div>
          <span className="text-[10px] text-[#a1a1aa]">Time decay P&L drag</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Vega Exposure (ν)</span>
          <div className="text-base font-extrabold text-cyan-300">
            +${activeData.portfolio_greeks.vega_exposure_dollars_per_vol_pt.toFixed(0)}
          </div>
          <span className="text-[10px] text-[#a1a1aa]">Per +1.0% shift in Implied Vol</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Implied Volatility (IV)</span>
          <div className="text-base font-extrabold text-amber-400">
            {currentTickerData.implied_volatility_pct}%
          </div>
          <span className="text-[10px] text-[#a1a1aa]">45-day ATM annualized IV</span>
        </div>
      </div>

      {/* Strategy Switcher Bar */}
      <div className="flex items-center gap-2 mb-5 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto hide-scrollbar text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveStrategy("zero_cost_collar")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeStrategy === "zero_cost_collar"
              ? "bg-gradient-to-r from-purple-500/30 to-emerald-500/30 text-[#f5f5f7] border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              : "text-[#a1a1aa] hover:text-[#f5f5f7]"
          }`}
        >
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Zero-Cost Collar (Free Floor)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStrategy("protective_put")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeStrategy === "protective_put"
              ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-[#f5f5f7] border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              : "text-[#a1a1aa] hover:text-[#f5f5f7]"
          }`}
        >
          <ShieldAlert size={14} className="text-cyan-400" />
          <span>Protective Put (Insurance)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStrategy("covered_call")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeStrategy === "covered_call"
              ? "bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-[#f5f5f7] border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              : "text-[#a1a1aa] hover:text-[#f5f5f7]"
          }`}
        >
          <DollarSign size={14} className="text-amber-400" />
          <span>Covered Call (Yield Income)</span>
        </button>
      </div>

      {/* Interactive Payoff Diagram (SVG) */}
      <div className="p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] font-mono">
              Expiration Profit / Loss Payoff Curve
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500"></span>
              <span className="text-[#a1a1aa]">Unhedged Stock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400"></span>
              <span className="text-emerald-400 font-bold">Hedged Structure</span>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto hide-scrollbar select-none">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-h-[220px]">
            {/* Zero P&L Axis */}
            <line x1="50" y1={zeroY} x2={width - 30} y2={zeroY} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            <text x="45" y={zeroY + 3} textAnchor="end" fill="#9ca3af" fontSize="9" fontFamily="monospace">
              $0
            </text>

            {/* Current Price Vertical Guide */}
            <line
              x1={getX(currentTickerData.current_price)}
              y1="10"
              x2={getX(currentTickerData.current_price)}
              y2={height - 20}
              stroke="#a855f7"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            <text
              x={getX(currentTickerData.current_price)}
              y={height - 6}
              textAnchor="middle"
              fill="#c084fc"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Current (${currentTickerData.current_price})
            </text>

            {/* Unhedged Stock P&L Polyline */}
            <polyline fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" points={unhedgedPolyline} />

            {/* Hedged Strategy P&L Polyline */}
            <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={hedgedPolyline} />

            {/* Hover Interactive Dots */}
            {points.map((pt, idx) => {
              const cx = getX(pt.stock_price)
              const cy = getY(pt.hedged_pnl)
              return (
                <circle
                  key={`dot-${idx}`}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="#10b981"
                  className="cursor-pointer hover:r-5 transition-all"
                  onMouseEnter={() => setHoveredPayoff(pt)}
                />
              )
            })}
          </svg>

          {/* Hover Crosshair Card */}
          {hoveredPayoff && (
            <div className="absolute top-2 right-2 p-2.5 rounded-xl bg-black/90 border border-emerald-500/40 text-xs font-mono z-20 shadow-2xl backdrop-blur-xl animate-in fade-in">
              <div className="text-[10px] text-emerald-400 font-bold uppercase mb-0.5">Payoff at Expiration</div>
              <div className="space-y-0.5">
                <div>
                  Stock Price: <strong className="text-[#f5f5f7]">${hoveredPayoff.stock_price}</strong> ({hoveredPayoff.pct_change > 0 ? "+" : ""}{hoveredPayoff.pct_change}%)
                </div>
                <div>
                  Hedged P&L:{" "}
                  <strong className={hoveredPayoff.hedged_pnl >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {hoveredPayoff.hedged_pnl >= 0 ? "+" : ""}${hoveredPayoff.hedged_pnl.toLocaleString()}
                  </strong>
                </div>
                <div className="text-[#a1a1aa] text-[10px]">
                  Unhedged P&L: {hoveredPayoff.unhedged_pnl >= 0 ? "+" : ""}${hoveredPayoff.unhedged_pnl.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contract Execution Details & Parameters Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strategy Description & Limits */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-[#f5f5f7]">{currentStrategy.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentStrategy.tag}
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed mb-4">{currentStrategy.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-white/10">
            <div>
              <span className="text-[#a1a1aa] text-[10px] block">Guaranteed Downside Floor</span>
              <strong className="text-rose-400">{currentStrategy.max_downside_loss_pct}% max loss</strong>
            </div>
            <div>
              <span className="text-[#a1a1aa] text-[10px] block">Upside Profit Cap</span>
              <strong className="text-emerald-400">
                {currentStrategy.max_upside_profit_pct > 500 ? "Unlimited Upside" : `+${currentStrategy.max_upside_profit_pct}% cap`}
              </strong>
            </div>
          </div>
        </div>

        {/* Contract Trade Order Parameters */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] mb-2 flex items-center gap-1.5">
              <Layers size={13} className="text-purple-400" />
              <span>Recommended Option Contracts</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[#a1a1aa]">Contracts Quantity:</span>
                <span className="font-bold text-[#f5f5f7]">{currentTickerData.contracts_needed} Contracts ({currentTickerData.shares} shares)</span>
              </div>
              {currentStrategy.long_put_strike && (
                <div className="flex justify-between items-center p-2 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-[#a1a1aa]">Long Put Strike (45-Day):</span>
                  <span className="font-bold text-cyan-300">${currentStrategy.long_put_strike} Put (Cost: ${currentStrategy.long_put_price})</span>
                </div>
              )}
              {currentStrategy.short_call_strike && (
                <div className="flex justify-between items-center p-2 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-[#a1a1aa]">Short Call Strike (45-Day):</span>
                  <span className="font-bold text-amber-300">${currentStrategy.short_call_strike} Call (Credit: ${currentStrategy.short_call_price})</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[#a1a1aa]">Net Premium Cost / Credit:</span>
            <strong className="text-emerald-300 font-extrabold text-sm">
              {currentStrategy.total_net_cost && currentStrategy.total_net_cost > 0
                ? `$${currentStrategy.total_net_cost} Debit`
                : currentStrategy.total_net_income
                ? `+$${currentStrategy.total_net_income} Cash Income`
                : "$0.00 (Zero-Cost)"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}
