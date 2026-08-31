"use client"

import React from "react"
import { useTheme } from "../../context/theme-context"
import {
  Coins,
  TrendingUp,
  Activity,
  Flame,
  ShieldCheck,
  Zap,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  Info,
  Clock,
  CircleDollarSign,
  Wallet,
} from "lucide-react"

export interface CryptoOnChainData {
  has_crypto_holdings: boolean
  macro_cycle_phase: string
  mvrv_analytics: {
    mvrv_zscore: number
    mvrv_ratio: number
    btc_realized_price_dollars: number
    btc_market_price_dollars: number
    cycle_signal: string
    risk_color: string
    overbought_threshold: number
    oversold_bottom_threshold: number
  }
  sentiment_index: {
    current_score: number
    classification: string
    yesterday_score: number
    last_week_score: number
    last_month_score: number
    historical_trend: number[]
  }
  onchain_flows: {
    net_exchange_flow_24h_btc: number
    flow_interpretation: string
    stablecoin_supply_ratio_ssr: number
    ssr_interpretation: string
    active_whale_wallets_count: number
    recent_large_transfers: Array<{
      amount: string
      type: string
      time: string
      impact: string
    }>
  }
}

interface CryptoOnChainCardProps {
  data?: CryptoOnChainData
}

const DEFAULT_CRYPTO_DATA: CryptoOnChainData = {
  has_crypto_holdings: true,
  macro_cycle_phase: "Phase 2: Parabolic Bull Expansion & Institutional Adoption",
  mvrv_analytics: {
    mvrv_zscore: 2.45,
    mvrv_ratio: 2.06,
    btc_realized_price_dollars: 42850.0,
    btc_market_price_dollars: 88400.0,
    cycle_signal: "HEALTHY BULL MARKET EXPANSION",
    risk_color: "GREEN",
    overbought_threshold: 6.0,
    oversold_bottom_threshold: 0.1,
  },
  sentiment_index: {
    current_score: 76,
    classification: "EXTREME GREED",
    yesterday_score: 74,
    last_week_score: 68,
    last_month_score: 52,
    historical_trend: [52, 58, 63, 68, 70, 74, 76],
  },
  onchain_flows: {
    net_exchange_flow_24h_btc: -14250,
    flow_interpretation: "STRONG INSTITUTIONAL ACCUMULATION (Net Outflow into Custody Cold Storage)",
    stablecoin_supply_ratio_ssr: 11.2,
    ssr_interpretation: "HIGH PURCHASING POWER (Stablecoin Dry Powder Waiting to Deploy)",
    active_whale_wallets_count: 2184,
    recent_large_transfers: [
      {
        amount: "4,500 BTC ($397.8M)",
        type: "OUTFLOW (Binance -> Institutional Cold Storage)",
        time: "1h ago",
        impact: "BULLISH ACCUMULATION",
      },
      {
        amount: "2,200 BTC ($194.4M)",
        type: "OUTFLOW (Coinbase Prime -> Cold Storage)",
        time: "4h ago",
        impact: "BULLISH ACCUMULATION",
      },
      {
        amount: "$125,000,000 USDT",
        type: "MINT & INFLOW (Tether Treasury -> Kraken)",
        time: "6h ago",
        impact: "DRY POWDER INJECTION",
      },
    ],
  },
}

export function CryptoOnChainCard({ data = DEFAULT_CRYPTO_DATA }: CryptoOnChainCardProps) {
  const { theme } = useTheme()
  const activeData = data || DEFAULT_CRYPTO_DATA

  const mvrv = activeData.mvrv_analytics
  const sentiment = activeData.sentiment_index
  const flows = activeData.onchain_flows

  // MVRV Meter percentage (0 to 7.0)
  const zScorePct = Math.min(Math.max((mvrv.mvrv_zscore / 7.0) * 100, 2), 98)

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
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Coins size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Crypto On-Chain Intelligence & Market Cycle Engine</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Layer 1 Quant
              </span>
              <span className="text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/60 inline-flex items-center gap-1">
                SIMULATED DATA
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Bitcoin MVRV Z-Score, Crypto Fear & Greed Index, Stablecoin Supply Ratio (SSR), and Whale Exchange Flows • <span className="text-zinc-400">Illustrative data — not connected to a live on-chain node</span>
            </p>
          </div>
        </div>

        {/* Macro Cycle Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs">
          <Sparkles size={13} className="text-amber-400" />
          <span className="font-bold">{activeData.macro_cycle_phase}</span>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">MVRV Z-Score</span>
          <div className="text-base font-extrabold text-emerald-400">{mvrv.mvrv_zscore}</div>
          <span className="text-[10px] text-[#a1a1aa]">{mvrv.cycle_signal}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Crypto Fear & Greed</span>
          <div className="text-base font-extrabold text-amber-400">
            {sentiment.current_score}/100
          </div>
          <span className="text-[10px] text-amber-300 font-bold">{sentiment.classification}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">24h Net Exchange Outflow</span>
          <div className="text-base font-extrabold text-cyan-300">
            {Math.abs(flows.net_exchange_flow_24h_btc).toLocaleString()} BTC
          </div>
          <span className="text-[10px] text-emerald-300 font-bold">Cold Storage Accumulation</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Stablecoin SSR Ratio</span>
          <div className="text-base font-extrabold text-purple-300">{flows.stablecoin_supply_ratio_ssr}x</div>
          <span className="text-[10px] text-[#a1a1aa]">High Buy Liquidity</span>
        </div>
      </div>

      {/* Bitcoin MVRV Z-Score Visual Meter */}
      <div className="p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
            Bitcoin MVRV Z-Score Valuation Meter
          </div>
          <div className="text-[11px] text-[#a1a1aa]">
            Realized Price: <strong className="text-cyan-300">${mvrv.btc_realized_price_dollars.toLocaleString()}</strong> | Spot: <strong className="text-amber-400">${mvrv.btc_market_price_dollars.toLocaleString()}</strong>
          </div>
        </div>

        {/* Meter Gauge */}
        <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-emerald-500 via-amber-500 to-rose-600 opacity-80" />
          {/* Current Needle */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_#ffffff] -translate-x-1/2 transition-all duration-500"
            style={{ left: `${zScorePct}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-[#a1a1aa]">
          <span>0.0 (Bottom Accumulation Zone)</span>
          <span>2.5 (Current Score: {mvrv.mvrv_zscore})</span>
          <span>6.0+ (Cycle Top Blow-Off)</span>
        </div>
      </div>

      {/* Whale Exchange Flow Blotter */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-[#a1a1aa] tracking-wider">
            Real-Time Whale Flow Tracker & Treasury Mints
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">
            {flows.active_whale_wallets_count.toLocaleString()} Active Whale Wallets
          </span>
        </div>

        <div className="space-y-2">
          {flows.recent_large_transfers.map((tx, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-amber-400">
                  <Wallet size={14} />
                </div>
                <div>
                  <div className="font-bold text-[#f5f5f7]">{tx.amount}</div>
                  <div className="text-[11px] text-[#a1a1aa]">{tx.type}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {tx.impact}
                </span>
                <span className="text-[10px] text-[#a1a1aa] flex items-center gap-1">
                  <Clock size={10} /> {tx.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
