"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Cpu,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Play,
  RotateCcw,
  Sliders,
} from "lucide-react"

export interface TradeItem {
  entry_date: string
  exit_date: string
  action: string
  entry_price: number
  exit_price: number
  shares: number
  pnl_dollars: number
  pnl_pct: number
  reason: string
}

export interface EquityCurvePoint {
  date: string
  strategy_equity: number
  benchmark_equity: number
}

export interface StrategyDetail {
  strategy_id: string
  strategy_name: string
  tag: string
  description: string
  metrics: {
    total_return_pct: number
    benchmark_return_pct: number
    alpha_pct: number
    win_rate_pct: number
    profit_factor: number
    max_drawdown_pct: number
    sharpe_ratio: number
    sortino_ratio: number
    calmar_ratio: number
    total_trades: number
    avg_trade_pnl_pct: number
  }
  equity_curve: EquityCurvePoint[]
  trades: TradeItem[]
}

export interface AlgoBacktestData {
  primary_ticker: string
  available_tickers: string[]
  strategies: {
    momentum_trend: StrategyDetail
    mean_reversion: StrategyDetail
    volatility_breakout: StrategyDetail
  }
  paper_trading_account: {
    virtual_balance: number
    modeled_slippage_bps: number
    supported_order_types: string[]
  }
}

interface AlgoBacktestCardProps {
  data?: AlgoBacktestData
}

const DEFAULT_BACKTEST_DATA: AlgoBacktestData = {
  primary_ticker: "NVDA",
  available_tickers: ["NVDA", "AAPL", "MSFT"],
  strategies: {
    momentum_trend: {
      strategy_id: "momentum_trend",
      strategy_name: "Momentum Trend-Following (50/200 Golden Cross)",
      tag: "TREND FOLLOWING",
      description: "Exploits multi-month upward momentum using 50/200 SMA regime filters and 20-day Donchian channel breakouts.",
      metrics: {
        total_return_pct: 56.0,
        benchmark_return_pct: 28.0,
        alpha_pct: 28.0,
        win_rate_pct: 75.0,
        profit_factor: 2.85,
        max_drawdown_pct: -6.5,
        sharpe_ratio: 2.45,
        sortino_ratio: 3.30,
        calmar_ratio: 8.61,
        total_trades: 4,
        avg_trade_pnl_pct: 15.6,
      },
      equity_curve: [
        { date: "Jan", strategy_equity: 100000, benchmark_equity: 100000 },
        { date: "Feb", strategy_equity: 108000, benchmark_equity: 104000 },
        { date: "Mar", strategy_equity: 120000, benchmark_equity: 109000 },
        { date: "Apr", strategy_equity: 118000, benchmark_equity: 107000 },
        { date: "May", strategy_equity: 126000, benchmark_equity: 112000 },
        { date: "Jun", strategy_equity: 134000, benchmark_equity: 116000 },
        { date: "Jul", strategy_equity: 140000, benchmark_equity: 120000 },
        { date: "Aug", strategy_equity: 136000, benchmark_equity: 118000 },
        { date: "Sep", strategy_equity: 144000, benchmark_equity: 122000 },
        { date: "Oct", strategy_equity: 150000, benchmark_equity: 125000 },
        { date: "Nov", strategy_equity: 156000, benchmark_equity: 128000 },
      ],
      trades: [
        { entry_date: "2024-01-15", exit_date: "2024-03-20", action: "LONG", entry_price: 112.5, exit_price: 138.2, shares: 800, pnl_dollars: 20560.0, pnl_pct: 22.8, reason: "50-SMA Trailing Target Hit" },
        { entry_date: "2024-04-22", exit_date: "2024-07-10", action: "LONG", entry_price: 126.0, exit_price: 154.4, shares: 700, pnl_dollars: 19880.0, pnl_pct: 22.5, reason: "20-Day High Breakout Target" },
        { entry_date: "2024-08-05", exit_date: "2024-08-25", action: "LONG", entry_price: 142.1, exit_price: 136.2, shares: 650, pnl_dollars: -3835.0, pnl_pct: -4.1, reason: "Trailing Stop Loss Triggered" },
        { entry_date: "2024-09-12", exit_date: "2024-11-18", action: "LONG", entry_price: 134.5, exit_price: 162.8, shares: 680, pnl_dollars: 19244.0, pnl_pct: 21.0, reason: "Golden Cross Acceleration Exit" },
      ],
    },
    mean_reversion: {
      strategy_id: "mean_reversion",
      strategy_name: "RSI & Bollinger Mean-Reversion",
      tag: "STATISTICAL ARBITRAGE",
      description: "Capitalizes on temporary overextended selloffs by entering on oversold RSI and exiting at the 20-day mean.",
      metrics: {
        total_return_pct: 42.0,
        benchmark_return_pct: 28.0,
        alpha_pct: 14.0,
        win_rate_pct: 100.0,
        profit_factor: 4.50,
        max_drawdown_pct: -3.8,
        sharpe_ratio: 2.10,
        sortino_ratio: 3.15,
        calmar_ratio: 11.05,
        total_trades: 4,
        avg_trade_pnl_pct: 8.0,
      },
      equity_curve: [
        { date: "Jan", strategy_equity: 100000, benchmark_equity: 100000 },
        { date: "Feb", strategy_equity: 107000, benchmark_equity: 104000 },
        { date: "Mar", strategy_equity: 109000, benchmark_equity: 109000 },
        { date: "Apr", strategy_equity: 116000, benchmark_equity: 107000 },
        { date: "May", strategy_equity: 121000, benchmark_equity: 112000 },
        { date: "Jun", strategy_equity: 123000, benchmark_equity: 116000 },
        { date: "Jul", strategy_equity: 125000, benchmark_equity: 120000 },
        { date: "Aug", strategy_equity: 131000, benchmark_equity: 118000 },
        { date: "Sep", strategy_equity: 133000, benchmark_equity: 122000 },
        { date: "Oct", strategy_equity: 138000, benchmark_equity: 125000 },
        { date: "Nov", strategy_equity: 142000, benchmark_equity: 128000 },
      ],
      trades: [
        { entry_date: "2024-01-20", exit_date: "2024-02-05", action: "LONG", entry_price: 108.2, exit_price: 118.5, shares: 800, pnl_dollars: 8240.0, pnl_pct: 9.5, reason: "Bollinger Mean Reversion Target Hit" },
        { entry_date: "2024-04-16", exit_date: "2024-05-02", action: "LONG", entry_price: 121.4, exit_price: 132.8, shares: 750, pnl_dollars: 8550.0, pnl_pct: 9.4, reason: "RSI 65 Overbought Exit" },
        { entry_date: "2024-08-08", exit_date: "2024-08-20", action: "LONG", entry_price: 132.0, exit_price: 141.5, shares: 700, pnl_dollars: 6650.0, pnl_pct: 7.2, reason: "SMA20 Baseline Cross" },
        { entry_date: "2024-10-12", exit_date: "2024-10-28", action: "LONG", entry_price: 139.1, exit_price: 147.2, shares: 680, pnl_dollars: 5508.0, pnl_pct: 5.8, reason: "Mean Reversion Target Hit" },
      ],
    },
    volatility_breakout: {
      strategy_id: "volatility_breakout",
      strategy_name: "ATR Volatility Contraction Breakout",
      tag: "DYNAMIC RISK PARITY",
      description: "Identifies volatility squeeze cycles and enters on high-momentum expansion with ATR-adjusted position sizing.",
      metrics: {
        total_return_pct: 62.0,
        benchmark_return_pct: 28.0,
        alpha_pct: 34.0,
        win_rate_pct: 100.0,
        profit_factor: 5.20,
        max_drawdown_pct: -4.5,
        sharpe_ratio: 2.80,
        sortino_ratio: 4.10,
        calmar_ratio: 13.78,
        total_trades: 3,
        avg_trade_pnl_pct: 19.7,
      },
      equity_curve: [
        { date: "Jan", strategy_equity: 100000, benchmark_equity: 100000 },
        { date: "Feb", strategy_equity: 105000, benchmark_equity: 104000 },
        { date: "Mar", strategy_equity: 115000, benchmark_equity: 109000 },
        { date: "Apr", strategy_equity: 118000, benchmark_equity: 107000 },
        { date: "May", strategy_equity: 125000, benchmark_equity: 112000 },
        { date: "Jun", strategy_equity: 133000, benchmark_equity: 116000 },
        { date: "Jul", strategy_equity: 138000, benchmark_equity: 120000 },
        { date: "Aug", strategy_equity: 136000, benchmark_equity: 118000 },
        { date: "Sep", strategy_equity: 145000, benchmark_equity: 122000 },
        { date: "Oct", strategy_equity: 152000, benchmark_equity: 125000 },
        { date: "Nov", strategy_equity: 162000, benchmark_equity: 128000 },
      ],
      trades: [
        { entry_date: "2024-02-10", exit_date: "2024-04-05", action: "LONG", entry_price: 115.0, exit_price: 139.2, shares: 750, pnl_dollars: 18150.0, pnl_pct: 21.0, reason: "Volatility Expansion Target Hit" },
        { entry_date: "2024-05-15", exit_date: "2024-07-22", action: "LONG", entry_price: 131.2, exit_price: 158.5, shares: 680, pnl_dollars: 18564.0, pnl_pct: 20.8, reason: "3x ATR Trailing Profit Target" },
        { entry_date: "2024-09-02", exit_date: "2024-11-10", action: "LONG", entry_price: 140.0, exit_price: 164.2, shares: 650, pnl_dollars: 15730.0, pnl_pct: 17.3, reason: "Volatility Contraction Expansion" },
      ],
    },
  },
  paper_trading_account: {
    virtual_balance: 100000.0,
    modeled_slippage_bps: 2.5,
    supported_order_types: ["MARKET", "LIMIT", "STOP_LOSS", "TRAILING_STOP"],
  },
}

export function AlgoBacktestCard({ data = DEFAULT_BACKTEST_DATA }: AlgoBacktestCardProps) {
  const { theme } = useTheme()
  const activeData = data || DEFAULT_BACKTEST_DATA
  const [selectedStrategy, setSelectedStrategy] = useState<"momentum_trend" | "mean_reversion" | "volatility_breakout">("momentum_trend")
  const [hoveredPoint, setHoveredPoint] = useState<EquityCurvePoint | null>(null)
  const [paperOrderType, setPaperOrderType] = useState<string>("MARKET")
  const [paperShares, setPaperShares] = useState<number>(100)
  const [orderFilledAlert, setOrderFilledAlert] = useState<string | null>(null)

  const currentStrategy = activeData.strategies[selectedStrategy] || activeData.strategies["momentum_trend"]

  // SVG dimensions for Equity Curve
  const width = 600
  const height = 240
  const curve = currentStrategy.equity_curve

  const minEq = Math.min(...curve.map((c) => Math.min(c.strategy_equity, c.benchmark_equity))) * 0.95
  const maxEq = Math.max(...curve.map((c) => Math.max(c.strategy_equity, c.benchmark_equity))) * 1.05
  const eqSpan = maxEq - minEq || 1

  const getX = (idx: number) => (idx / (curve.length - 1 || 1)) * (width - 70) + 45
  const getY = (val: number) => height - ((val - minEq) / eqSpan) * (height - 50) - 25

  const stratPolyline = curve.map((c, i) => `${getX(i)},${getY(c.strategy_equity)}`).join(" ")
  const benchPolyline = curve.map((c, i) => `${getX(i)},${getY(c.benchmark_equity)}`).join(" ")

  const handleSimulatePaperOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderFilledAlert(`Filled simulated ${paperOrderType} order for ${paperShares} shares of ${activeData.primary_ticker} at market with 0.025% modeled slippage.`)
    setTimeout(() => setOrderFilledAlert(null), 5000)
  }

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
      {/* Header & Strategy Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Systematic Algorithmic Strategy Backtester</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Quantitative Alpha
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Rule-based systematic execution algorithms, institutional tear sheets, trade blotters, and paper trading
            </p>
          </div>
        </div>

        {/* Strategy Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {[
            { id: "momentum_trend", label: "Momentum Trend", icon: TrendingUp },
            { id: "mean_reversion", label: "Mean-Reversion", icon: RotateCcw },
            { id: "volatility_breakout", label: "Vol Breakout", icon: Activity },
          ].map((strat) => {
            const Icon = strat.icon
            const isActive = selectedStrategy === strat.id
            return (
              <button
                key={strat.id}
                type="button"
                onClick={() => setSelectedStrategy(strat.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : "bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] border border-white/10"
                }`}
              >
                <Icon size={13} />
                <span>{strat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Strategy Description Banner */}
      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 mb-5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles size={16} className="text-cyan-400 flex-shrink-0" />
          <span className="text-[#f5f5f7] leading-relaxed">{currentStrategy.description}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex-shrink-0">
          {currentStrategy.tag}
        </span>
      </div>

      {/* Institutional Tear Sheet KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5 font-mono text-xs">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block">Cumulative Return</span>
          <div className="text-base font-extrabold text-emerald-400">+{currentStrategy.metrics.total_return_pct}%</div>
          <span className="text-[10px] text-cyan-300">Alpha: +{currentStrategy.metrics.alpha_pct}%</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block">Win / Loss Rate</span>
          <div className="text-base font-extrabold text-emerald-300">{currentStrategy.metrics.win_rate_pct}%</div>
          <span className="text-[10px] text-[#a1a1aa]">{currentStrategy.metrics.total_trades} Total Trades</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block">Profit Factor</span>
          <div className="text-base font-extrabold text-purple-300">{currentStrategy.metrics.profit_factor}x</div>
          <span className="text-[10px] text-[#a1a1aa]">Gains / Losses</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block">Max Drawdown</span>
          <div className="text-base font-extrabold text-rose-400">{currentStrategy.metrics.max_drawdown_pct}%</div>
          <span className="text-[10px] text-[#a1a1aa]">Peak-to-Trough</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block">Sharpe Ratio</span>
          <div className="text-base font-extrabold text-cyan-400">{currentStrategy.metrics.sharpe_ratio}</div>
          <span className="text-[10px] text-[#a1a1aa]">Risk-Adjusted</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block">Sortino Ratio</span>
          <div className="text-base font-extrabold text-amber-300">{currentStrategy.metrics.sortino_ratio}</div>
          <span className="text-[10px] text-[#a1a1aa]">Downside Only</span>
        </div>
      </div>

      {/* Interactive Equity Curve Chart (SVG) */}
      <div className="p-4 rounded-2xl bg-black/30 border border-white/10 mb-5 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] font-mono">
              Cumulative Strategy Equity vs S&P 500 Benchmark
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500"></span>
              <span className="text-[#a1a1aa]">S&P 500 Buy & Hold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400"></span>
              <span className="text-cyan-400 font-bold">{currentStrategy.strategy_name}</span>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto hide-scrollbar select-none">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-h-[220px]">
            {/* Grid horizontal guides */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
              const y = height * ratio
              const val = maxEq - ratio * (maxEq - minEq)
              return (
                <g key={`grid-y-${idx}`}>
                  <line x1="45" y1={y} x2={width - 25} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <text x="40" y={y + 3} textAnchor="end" fill="#6b7280" fontSize="9" fontFamily="monospace">
                    ${(val / 1000).toFixed(0)}k
                  </text>
                </g>
              )
            })}

            {/* X-axis date labels */}
            {curve.map((c, i) => (
              <text key={`date-${i}`} x={getX(i)} y={height - 6} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">
                {c.date}
              </text>
            ))}

            {/* Benchmark Polyline */}
            <polyline fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" points={benchPolyline} />

            {/* Strategy Polyline */}
            <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={stratPolyline} />

            {/* Hover Interactive Dots */}
            {curve.map((pt, idx) => {
              const cx = getX(idx)
              const cy = getY(pt.strategy_equity)
              return (
                <circle
                  key={`eq-dot-${idx}`}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="#06b6d4"
                  className="cursor-pointer hover:r-5 transition-all"
                  onMouseEnter={() => setHoveredPoint(pt)}
                />
              )
            })}
          </svg>

          {/* Hover Crosshair Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 right-2 p-2.5 rounded-xl bg-black/90 border border-cyan-500/40 text-xs font-mono z-20 shadow-2xl backdrop-blur-xl animate-in fade-in">
              <div className="text-[10px] text-cyan-400 font-bold uppercase mb-0.5">Month: {hoveredPoint.date}</div>
              <div className="space-y-0.5">
                <div>
                  Strategy Equity: <strong className="text-emerald-400">${hoveredPoint.strategy_equity.toLocaleString()}</strong>
                </div>
                <div className="text-[#a1a1aa] text-[10px]">
                  Benchmark: ${hoveredPoint.benchmark_equity.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trade Execution Blotter Table */}
      <div className="mb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] font-mono mb-2 flex items-center gap-1.5">
          <Layers size={13} className="text-purple-400" />
          <span>Historical Trade Execution Blotter</span>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-white/5 text-[11px] text-[#a1a1aa] border-b border-white/10">
              <tr>
                <th className="p-3">Entry Date</th>
                <th className="p-3">Exit Date</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entry Price</th>
                <th className="p-3">Exit Price</th>
                <th className="p-3">Realized P&L</th>
                <th className="p-3">Exit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentStrategy.trades.map((trade, idx) => {
                const isProfit = trade.pnl_dollars >= 0
                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 text-[#a1a1aa]">{trade.entry_date}</td>
                    <td className="p-3 text-[#a1a1aa]">{trade.exit_date}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {trade.action}
                      </span>
                    </td>
                    <td className="p-3">${trade.entry_price.toFixed(2)}</td>
                    <td className="p-3 font-bold text-[#f5f5f7]">${trade.exit_price.toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          isProfit ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isProfit ? "+" : ""}${trade.pnl_dollars.toLocaleString()} ({isProfit ? "+" : ""}{trade.pnl_pct}%)
                      </span>
                    </td>
                    <td className="p-3 text-[#a1a1aa] text-[11px]">{trade.reason}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Paper Trading Order Execution Module */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-cyan-500/10 border border-purple-500/30 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-400" />
            <span className="font-bold text-[#f5f5f7]">Paper Trading Order Execution Sandbox</span>
            <span className="text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/60 inline-flex items-center gap-1">
              SIMULATED DATA
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#a1a1aa]">
            <span>Virtual Cash: <strong className="text-emerald-300">$100,000.00</strong></span>
            <span>•</span>
            <span>Modeled Slippage: <strong className="text-cyan-300">0.025%</strong></span>
            <span className="text-zinc-500">• (Sandbox model only)</span>
          </div>
        </div>

        {orderFilledAlert && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs">
            <CheckCircle2 size={14} />
            <span>{orderFilledAlert}</span>
          </div>
        )}

        <form onSubmit={handleSimulatePaperOrder} className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#a1a1aa]">Ticker:</span>
            <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 font-bold text-[#f5f5f7]">
              {activeData.primary_ticker}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#a1a1aa]">Order Type:</span>
            <select
              value={paperOrderType}
              onChange={(e) => setPaperOrderType(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[#f5f5f7] focus:outline-none focus:border-purple-500 text-xs"
            >
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
              <option value="STOP_LOSS">STOP LOSS</option>
              <option value="TRAILING_STOP">TRAILING STOP (2.5%)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#a1a1aa]">Quantity:</span>
            <input
              type="number"
              min={1}
              max={5000}
              value={paperShares}
              onChange={(e) => setPaperShares(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-[#f5f5f7] focus:outline-none focus:border-purple-500 text-xs"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer"
          >
            <Play size={13} />
            <span>Execute Paper Trade</span>
          </button>
        </form>
      </div>
    </div>
  )
}
