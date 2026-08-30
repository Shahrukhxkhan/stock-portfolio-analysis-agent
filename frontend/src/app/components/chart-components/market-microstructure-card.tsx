"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Layers,
  Activity,
  TrendingUp,
  Flame,
  ShieldCheck,
  Zap,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  Info,
  Clock,
  CircleDollarSign,
  BarChart3,
  Sliders,
  Scale,
  Radar,
  Radio,
  Eye,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  CheckCircle2,
} from "lucide-react"

export interface DarkPoolMetrics {
  ticker: string
  current_price: number
  dark_pool_volume_pct: number
  lit_exchange_volume_pct: number
  short_volume_ratio_pct: number
  institutional_bias: string
  estimated_daily_dark_dollar_val: string
}

export interface BlockTrade {
  id: string
  ticker: string
  shares: string
  notional_value: string
  price: number
  venue: string
  execution: string
  time: string
  is_bullish: boolean
}

export interface CointegratedPair {
  pair: string
  stock_a: string
  stock_b: string
  sector: string
  hedge_ratio_beta: number
  current_z_score: number
  half_life_days: number
  adf_p_value: number
  is_cointegrated: boolean
  signal: string
  action: string
  bias: string
  expected_reversion_roi_pct: number
  spread_timeline: Array<{
    date: string
    z_score: number
    upper_band: number
    lower_band: number
    mean: number
  }>
}

export interface OrderBookMetric {
  ticker: string
  bid_price: number
  ask_price: number
  spread_bps: number
  bid_depth_thousands: number
  ask_depth_thousands: number
  ofi_score: number
  vpin_toxicity: number
  vpin_status: string
  slippage_estimate_dollars: number
}

export interface TickerSentiment {
  ticker: string
  social_mentions_24h: number
  mention_velocity_pct: number
  retail_sentiment_score: number
  institutional_dark_score: number
  divergence_score: number
  divergence_signal: string
  signal_color: string
  trending_topics: string[]
}

export interface MarketMicrostructureData {
  dark_pool_gex: {
    net_gex_billions: number
    gex_regime: string
    dix_pct: number
    call_wall_level: number
    put_wall_level: number
    gamma_flip_level: number
    ticker_dark_metrics: DarkPoolMetrics[]
    recent_block_trades: BlockTrade[]
  }
  pairs_stat_arb: {
    pairs_count: number
    cointegrated_pairs: CointegratedPair[]
  }
  microstructure_liquidity: {
    portfolio_avg_spread_bps: number
    portfolio_avg_vpin_toxicity: number
    total_est_execution_slippage_dollars: number
    liquidity_rating: string
    orderbook_metrics: OrderBookMetric[]
  }
  sentiment_velocity: {
    overall_market_sentiment: string
    retail_euphoria_index: number
    smart_money_positioning_index: number
    ticker_sentiments: TickerSentiment[]
  }
  timestamp?: string
}

interface MarketMicrostructureCardProps {
  data?: MarketMicrostructureData
}

const DEFAULT_MICROSTRUCTURE_DATA: MarketMicrostructureData = {
  dark_pool_gex: {
    net_gex_billions: 3.85,
    gex_regime: "POSITIVE GEX (VOLATILITY SUPPRESSION / MEAN-REVERTING)",
    dix_pct: 46.8,
    call_wall_level: 6050.0,
    put_wall_level: 5800.0,
    gamma_flip_level: 5890.0,
    ticker_dark_metrics: [
      {
        ticker: "AAPL",
        current_price: 228.5,
        dark_pool_volume_pct: 48.2,
        lit_exchange_volume_pct: 51.8,
        short_volume_ratio_pct: 46.1,
        institutional_bias: "ACCUMULATION",
        estimated_daily_dark_dollar_val: "$412.5M",
      },
      {
        ticker: "NVDA",
        current_price: 138.25,
        dark_pool_volume_pct: 54.6,
        lit_exchange_volume_pct: 45.4,
        short_volume_ratio_pct: 42.8,
        institutional_bias: "ACCUMULATION",
        estimated_daily_dark_dollar_val: "$895.0M",
      },
      {
        ticker: "MSFT",
        current_price: 448.9,
        dark_pool_volume_pct: 43.1,
        lit_exchange_volume_pct: 56.9,
        short_volume_ratio_pct: 49.3,
        institutional_bias: "DISTRIBUTION",
        estimated_daily_dark_dollar_val: "$340.2M",
      },
    ],
    recent_block_trades: [
      {
        id: "BLK-NVDA-1",
        ticker: "NVDA",
        shares: "250,000",
        notional_value: "$34.56M",
        price: 138.3,
        venue: "UBS ATS",
        execution: "AT ASK (BULLISH BLOCK)",
        time: "14:22:15 EST",
        is_bullish: true,
      },
      {
        id: "BLK-AAPL-1",
        ticker: "AAPL",
        shares: "125,000",
        notional_value: "$28.56M",
        price: 228.45,
        venue: "Citadel Connect",
        execution: "AT ASK (BULLISH BLOCK)",
        time: "14:18:40 EST",
        is_bullish: true,
      },
      {
        id: "BLK-MSFT-1",
        ticker: "MSFT",
        shares: "65,000",
        notional_value: "$29.17M",
        price: 448.75,
        venue: "Crossfinder (CS)",
        execution: "AT BID (BEARISH BLOCK)",
        time: "14:05:12 EST",
        is_bullish: false,
      },
    ],
  },
  pairs_stat_arb: {
    pairs_count: 4,
    cointegrated_pairs: [
      {
        pair: "NVDA / AMD",
        stock_a: "NVDA",
        stock_b: "AMD",
        sector: "Semiconductor / AI Compute",
        hedge_ratio_beta: 1.18,
        current_z_score: 2.15,
        half_life_days: 8.4,
        adf_p_value: 0.018,
        is_cointegrated: true,
        signal: "SHORT NVDA / LONG AMD",
        action: "ARBITRAGE ENTRY (Spread Overextended +2σ)",
        bias: "SHORT_SPREAD",
        expected_reversion_roi_pct: 3.98,
        spread_timeline: [
          { date: "Day 1", z_score: -0.4, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Day 5", z_score: 0.3, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Day 10", z_score: 0.8, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Day 15", z_score: 1.4, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Day 20", z_score: 1.9, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Today", z_score: 2.15, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
        ],
      },
      {
        pair: "MSFT / AAPL",
        stock_a: "MSFT",
        stock_b: "AAPL",
        sector: "Mega-Cap Tech Ecosystem",
        hedge_ratio_beta: 0.94,
        current_z_score: -1.95,
        half_life_days: 11.2,
        adf_p_value: 0.024,
        is_cointegrated: true,
        signal: "LONG MSFT / SHORT AAPL",
        action: "ARBITRAGE ENTRY (Spread Undervalued -2σ)",
        bias: "LONG_SPREAD",
        expected_reversion_roi_pct: 3.61,
        spread_timeline: [
          { date: "Day 1", z_score: 0.2, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Day 5", z_score: -0.5, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Day 10", z_score: -1.1, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Day 15", z_score: -1.6, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Day 20", z_score: -1.8, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
          { date: "Today", z_score: -1.95, upper_band: 2.0, lower_band: -2.0, mean: 0.0 },
        ],
      },
    ],
  },
  microstructure_liquidity: {
    portfolio_avg_spread_bps: 1.85,
    portfolio_avg_vpin_toxicity: 0.26,
    total_est_execution_slippage_dollars: 184.2,
    liquidity_rating: "INSTITUTIONAL TIER 1 (ULTRA-LIQUID)",
    orderbook_metrics: [
      {
        ticker: "AAPL",
        bid_price: 228.48,
        ask_price: 228.52,
        spread_bps: 1.75,
        bid_depth_thousands: 820.0,
        ask_depth_thousands: 760.0,
        ofi_score: 0.038,
        vpin_toxicity: 0.22,
        vpin_status: "NORMAL (BENIGN FLOW)",
        slippage_estimate_dollars: 42.5,
      },
      {
        ticker: "NVDA",
        bid_price: 138.22,
        ask_price: 138.28,
        spread_bps: 2.15,
        bid_depth_thousands: 1450.0,
        ask_depth_thousands: 1100.0,
        ofi_score: 0.137,
        vpin_toxicity: 0.31,
        vpin_status: "NORMAL (BENIGN FLOW)",
        slippage_estimate_dollars: 95.0,
      },
    ],
  },
  sentiment_velocity: {
    overall_market_sentiment: "BULLISH RISK-ON EXPANSION",
    retail_euphoria_index: 68,
    smart_money_positioning_index: 74,
    ticker_sentiments: [
      {
        ticker: "NVDA",
        social_mentions_24h: 8420,
        mention_velocity_pct: 42.5,
        retail_sentiment_score: 0.78,
        institutional_dark_score: 0.82,
        divergence_score: -0.04,
        divergence_signal: "ALIGNED SENTIMENT (CONVERGENT TREND)",
        signal_color: "CYAN",
        trending_topics: ["#NVDABreakout", "CallSweep", "10K_Filing"],
      },
      {
        ticker: "AAPL",
        social_mentions_24h: 4210,
        mention_velocity_pct: 12.0,
        retail_sentiment_score: 0.65,
        institutional_dark_score: 0.70,
        divergence_score: -0.05,
        divergence_signal: "ALIGNED SENTIMENT (CONVERGENT TREND)",
        signal_color: "CYAN",
        trending_topics: ["#AppleIntelligence", "DarkPoolPrint", "Buybacks"],
      },
    ],
  },
}

export function MarketMicrostructureCard({ data }: MarketMicrostructureCardProps) {
  const { theme } = useTheme()
  const isBloomberg = theme === "bloomberg"
  const isCyberpunk = theme === "cyberpunk"
  const [subTab, setSubTab] = useState<"dark_pool" | "pairs_arb" | "liquidity" | "sentiment">("dark_pool")
  const [selectedPairIndex, setSelectedPairIndex] = useState(0)

  const msData = data || DEFAULT_MICROSTRUCTURE_DATA
  const { dark_pool_gex, pairs_stat_arb, microstructure_liquidity, sentiment_velocity } = msData

  const activePair = pairs_stat_arb.cointegrated_pairs[selectedPairIndex] || pairs_stat_arb.cointegrated_pairs[0]

  return (
    <div
      className={`rounded-2xl border p-6 transition-all shadow-xl backdrop-blur-xl ${
        isBloomberg
          ? "bg-[#0b0e14]/90 border-amber-500/30 text-amber-100"
          : isCyberpunk
          ? "bg-slate-950/80 border-cyan-500/30 text-cyan-100 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
          : "bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-indigo-500/20 text-slate-100"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isBloomberg
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                : isCyberpunk
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
            }`}
          >
            <Radar className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Institutional Microstructure & Alternative Data</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold">
                LIVE FEED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dark Pool (DIX/GEX), Statistical Arbitrage Cointegration, Level 2 Depth/VPIN Toxicity & NLP Sentiment Velocity
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl overflow-x-auto">
          {[
            { id: "dark_pool", label: "Dark Pool & GEX", icon: Layers },
            { id: "pairs_arb", label: "Pairs Stat-Arb", icon: ArrowRightLeft },
            { id: "liquidity", label: "L2 Depth & VPIN", icon: Sliders },
            { id: "sentiment", label: "Sentiment Velocity", icon: Radio },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = subTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? isBloomberg
                      ? "bg-amber-500 text-black shadow"
                      : isCyberpunk
                      ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                      : "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* TAB 1: DARK POOL & GEX / DIX */}
      {subTab === "dark_pool" && (
        <div className="space-y-6">
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">Net Market Gamma (GEX)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-emerald-400">
                  +${dark_pool_gex.net_gex_billions}B
                </span>
                <span className="text-[10px] text-slate-400 font-mono">/ 1% Move</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-300 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Volatility Suppressed
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">Dark Pool Index (DIX)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-cyan-400">
                  {dark_pool_gex.dix_pct}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">&gt; 45% = Acc</span>
              </div>
              <span className="text-[10px] font-semibold text-cyan-300 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Institutional Accumulation
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">Dealer Call / Put Walls</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold font-mono text-purple-300">
                  ${dark_pool_gex.call_wall_level}
                </span>
                <span className="text-xs text-slate-500 font-mono">/</span>
                <span className="text-lg font-bold font-mono text-rose-400">
                  ${dark_pool_gex.put_wall_level}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 mt-2 font-mono">
                Pin Range (SPX Equiv)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">Gamma Flip Level</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-amber-400">
                  ${dark_pool_gex.gamma_flip_level}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-amber-300 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Surge Vol Below
              </span>
            </div>
          </div>

          {/* Off-Exchange Ticker Table */}
          <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Portfolio Off-Exchange Dark Pool Volume Breakdown
              </h3>
              <span className="text-xs text-slate-400 font-mono">FINRA ADF / ATS Feeds</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Asset</th>
                    <th className="px-4 py-2.5">Dark Pool %</th>
                    <th className="px-4 py-2.5">Lit Exchange %</th>
                    <th className="px-4 py-2.5">Short Volume %</th>
                    <th className="px-4 py-2.5">Daily Dark Value</th>
                    <th className="px-4 py-2.5">Institutional Bias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dark_pool_gex.ticker_dark_metrics.map((item) => (
                    <tr key={item.ticker} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-xs">{item.ticker}</span>
                        <span className="text-slate-400 font-normal text-[11px]">${item.current_price}</span>
                      </td>
                      <td className="px-4 py-3 text-cyan-300 font-semibold">{item.dark_pool_volume_pct}%</td>
                      <td className="px-4 py-3 text-slate-400">{item.lit_exchange_volume_pct}%</td>
                      <td className="px-4 py-3 text-amber-300">{item.short_volume_ratio_pct}%</td>
                      <td className="px-4 py-3 text-slate-200">{item.estimated_daily_dark_dollar_val}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.institutional_bias === "ACCUMULATION"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {item.institutional_bias}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-Time Block Trade Stream */}
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Institutional Block Execution Tape (&gt; $5M+ Notional)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Auto-Updating Tape</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {dark_pool_gex.recent_block_trades.map((block) => (
                <div
                  key={block.id}
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono transition-all ${
                    block.is_bullish
                      ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60"
                      : "bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded ${
                        block.is_bullish ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {block.is_bullish ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{block.ticker}</span>
                        <span className="text-slate-400 text-[10px]">{block.venue}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {block.shares} shares @ ${block.price}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm text-white">{block.notional_value}</div>
                    <div className="text-[10px] text-slate-400">{block.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAIRS STAT-ARB SCANNER */}
      {subTab === "pairs_arb" && (
        <div className="space-y-6">
          {/* Pair Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {pairs_stat_arb.cointegrated_pairs.map((p, idx) => (
              <button
                key={p.pair}
                onClick={() => setSelectedPairIndex(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-2 ${
                  selectedPairIndex === idx
                    ? isBloomberg
                      ? "bg-amber-500 text-black border-amber-400"
                      : isCyberpunk
                      ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                      : "bg-indigo-600 text-white border-indigo-500"
                    : "bg-black/30 border-white/10 text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{p.pair}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded ${
                    p.bias === "SHORT_SPREAD"
                      ? "bg-rose-500/20 text-rose-300"
                      : p.bias === "LONG_SPREAD"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-500/20 text-slate-300"
                  }`}
                >
                  Z: {p.current_z_score > 0 ? `+${p.current_z_score}` : p.current_z_score}σ
                </span>
              </button>
            ))}
          </div>

          {/* Active Pair Focus Banner */}
          {activePair && (
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white font-mono">{activePair.pair}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono">
                      {activePair.sector}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono">
                      ADF p = {activePair.adf_p_value} (Cointegrated)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Ornstein-Uhlenbeck Half-Life: <strong className="text-white">{activePair.half_life_days} Days</strong> | Hedge Ratio (β):{" "}
                    <strong className="text-white">{activePair.hedge_ratio_beta}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black font-mono ${
                      activePair.bias === "SHORT_SPREAD"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                        : activePair.bias === "LONG_SPREAD"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-500/20 text-slate-300 border border-slate-500/40"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {activePair.signal}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Expected Mean Reversion ROI: <strong className="text-emerald-400">+{activePair.expected_reversion_roi_pct}%</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Spread & Z-Score Chart Container */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Normalized Spread Z-Score Timeline</span>
                  <span className="text-rose-400 font-semibold">+2.0σ Short Entry Zone / -2.0σ Long Entry Zone</span>
                </div>

                {/* SVG Z-Score Chart */}
                <div className="relative h-44 w-full bg-slate-950/60 rounded-xl border border-white/5 p-2 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                    {/* Upper Band +2.0 Sigma */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" />
                    <text x="10" y="24" fill="#f43f5e" fontSize="10" fontFamily="monospace">+2.0σ Upper Threshold</text>

                    {/* Zero Mean Line */}
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#64748b" strokeWidth="1" />
                    <text x="10" y="75" fill="#94a3b8" fontSize="10" fontFamily="monospace">0.0σ Mean Target</text>

                    {/* Lower Band -2.0 Sigma */}
                    <line x1="0" y1="130" x2="500" y2="130" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" />
                    <text x="10" y="145" fill="#10b981" fontSize="10" fontFamily="monospace">-2.0σ Lower Threshold</text>

                    {/* Path plotting Z-scores */}
                    {activePair.spread_timeline && activePair.spread_timeline.length > 1 && (
                      <path
                        d={activePair.spread_timeline.reduce((acc, point, index) => {
                          const x = (index / (activePair.spread_timeline.length - 1)) * 480 + 10
                          // Map Z-score: z=0 -> 80, z=+2 -> 30, z=-2 -> 130
                          const y = 80 - point.z_score * 25
                          return `${acc} ${index === 0 ? "M" : "L"} ${x} ${y}`
                        }, "")}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Data Points */}
                    {activePair.spread_timeline?.map((point, index) => {
                      const x = (index / (activePair.spread_timeline.length - 1)) * 480 + 10
                      const y = 80 - point.z_score * 25
                      const isLast = index === activePair.spread_timeline.length - 1
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r={isLast ? "5" : "3"}
                          fill={isLast ? "#38bdf8" : "#0284c7"}
                          stroke="#ffffff"
                          strokeWidth={isLast ? "2" : "1"}
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Execution Guidance Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-400">Leg 1 Action</span>
                  <div className="text-sm font-bold text-white mt-1">
                    {activePair.bias === "SHORT_SPREAD" ? `SELL ${activePair.stock_a}` : `BUY ${activePair.stock_a}`}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-400">Leg 2 Hedge (Hedge Ratio: {activePair.hedge_ratio_beta})</span>
                  <div className="text-sm font-bold text-white mt-1">
                    {activePair.bias === "SHORT_SPREAD" ? `BUY ${activePair.stock_b}` : `SELL ${activePair.stock_b}`}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-400">Target Take-Profit</span>
                  <div className="text-sm font-bold text-emerald-400 mt-1">Mean Reversion @ Z = 0.0σ</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDER BOOK DEPTH & VPIN TOXICITY */}
      {subTab === "liquidity" && (
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-mono">Portfolio Avg Bid-Ask Spread</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {microstructure_liquidity.portfolio_avg_spread_bps} bps
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                {microstructure_liquidity.liquidity_rating}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-mono">VPIN Toxic Flow Probability</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {(microstructure_liquidity.portfolio_avg_vpin_toxicity * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-emerald-300 font-mono mt-1 block">
                Low Adverse Selection Risk
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-mono">Est. Rebalance Slippage Cost</span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                ${microstructure_liquidity.total_est_execution_slippage_dollars}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Almgren-Chriss Impact Model
              </span>
            </div>
          </div>

          {/* Level 2 Depth & Liquidity Ladder */}
          <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Level 2 Depth & Order Flow Imbalance (OFI)
              </h3>
              <span className="text-xs text-slate-400 font-mono">BBO Book Depth</span>
            </div>

            <div className="p-4 space-y-4 font-mono text-xs">
              {microstructure_liquidity.orderbook_metrics.map((book) => {
                const totalDepth = book.bid_depth_thousands + book.ask_depth_thousands
                const bidPct = (book.bid_depth_thousands / totalDepth) * 100
                const askPct = (book.ask_depth_thousands / totalDepth) * 100

                return (
                  <div key={book.ticker} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-white">{book.ticker}</span>
                        <span className="text-slate-400">
                          Bid: <strong className="text-emerald-400">${book.bid_price}</strong> | Ask:{" "}
                          <strong className="text-rose-400">${book.ask_price}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">
                          Spread: <strong className="text-white">{book.spread_bps} bps</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                          OFI: {book.ofi_score > 0 ? `+${book.ofi_score}` : book.ofi_score}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                          VPIN: {book.vpin_toxicity} ({book.vpin_status})
                        </span>
                      </div>
                    </div>

                    {/* Visual Depth Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Bid Liquidity: ${book.bid_depth_thousands}k ({bidPct.toFixed(0)}%)</span>
                        <span>Ask Liquidity: ${book.ask_depth_thousands}k ({askPct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                        <div style={{ width: `${bidPct}%` }} className="bg-emerald-500 transition-all" />
                        <div style={{ width: `${askPct}%` }} className="bg-rose-500 transition-all" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOCIAL SENTIMENT VELOCITY & SMART MONEY DIVERGENCE */}
      {subTab === "sentiment" && (
        <div className="space-y-6">
          {/* Sentiment Gauge Headers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-mono">Retail Euphoria Index (WSB / X)</span>
              <div className="text-2xl font-black font-mono text-purple-400 mt-1">
                {sentiment_velocity.retail_euphoria_index} / 100
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">High Retail Engagement</span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-mono">Smart Money Positioning Index</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {sentiment_velocity.smart_money_positioning_index} / 100
              </div>
              <span className="text-[10px] text-cyan-300 font-mono mt-1 block">Institutional Net Accumulation</span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-mono">Macro Sentiment Regime</span>
              <div className="text-sm font-black font-mono text-emerald-400 mt-1">
                {sentiment_velocity.overall_market_sentiment}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Aggressive Risk-On</span>
            </div>
          </div>

          {/* Ticker Divergence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sentiment_velocity.ticker_sentiments.map((s) => (
              <div key={s.ticker} className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white">{s.ticker}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {s.social_mentions_24h.toLocaleString()} mentions
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      s.mention_velocity_pct > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    Velocity: {s.mention_velocity_pct > 0 ? `+${s.mention_velocity_pct}%` : `${s.mention_velocity_pct}%`}
                  </span>
                </div>

                {/* Score Comparison Bars */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Retail Sentiment Score</span>
                      <span className="text-purple-300 font-bold">{(s.retail_sentiment_score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(0, Math.min(100, s.retail_sentiment_score * 100))}%` }}
                        className="h-full bg-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Institutional Dark Pool Score</span>
                      <span className="text-cyan-300 font-bold">{(s.institutional_dark_score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(0, Math.min(100, s.institutional_dark_score * 100))}%` }}
                        className="h-full bg-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Signal Badge */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Divergence Signal:</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      s.signal_color === "RED"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : s.signal_color === "GREEN"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {s.divergence_signal}
                  </span>
                </div>

                {/* Trending Topics */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {s.trending_topics.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
