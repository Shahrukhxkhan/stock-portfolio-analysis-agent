"use client"

import { ShieldCheck, TrendingDown, Activity, Zap, Compass, BarChart } from "lucide-react"

export interface RiskMetrics {
  sharpe_ratio: number
  sortino_ratio: number
  max_drawdown_pct: number
  volatility_pct: number
  beta: number
  alpha_pct: number
}

interface RiskMetricsCardProps {
  metrics?: RiskMetrics
}

export function RiskMetricsCard({ metrics }: RiskMetricsCardProps) {
  const defaultMetrics: RiskMetrics = {
    sharpe_ratio: metrics?.sharpe_ratio ?? 1.45,
    sortino_ratio: metrics?.sortino_ratio ?? 1.82,
    max_drawdown_pct: metrics?.max_drawdown_pct ?? 12.4,
    volatility_pct: metrics?.volatility_pct ?? 16.8,
    beta: metrics?.beta ?? 1.02,
    alpha_pct: metrics?.alpha_pct ?? 4.2,
  }

  const items = [
    {
      title: "Sharpe Ratio",
      value: defaultMetrics.sharpe_ratio.toFixed(2),
      desc: "Risk-adjusted return vs risk-free rate",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15 border-emerald-500/30",
    },
    {
      title: "Sortino Ratio",
      value: defaultMetrics.sortino_ratio.toFixed(2),
      desc: "Downside risk-adjusted return",
      icon: Zap,
      color: "text-purple-400",
      bg: "bg-purple-500/15 border-purple-500/30",
    },
    {
      title: "Max Drawdown",
      value: `-${defaultMetrics.max_drawdown_pct.toFixed(1)}%`,
      desc: "Peak-to-trough max historical decline",
      icon: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-500/15 border-rose-500/30",
    },
    {
      title: "Ann. Volatility",
      value: `${defaultMetrics.volatility_pct.toFixed(1)}%`,
      desc: "Annualized standard deviation of returns",
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-500/15 border-amber-500/30",
    },
    {
      title: "Portfolio Beta",
      value: defaultMetrics.beta.toFixed(2),
      desc: "Sensitivity relative to S&P 500 (SPY)",
      icon: Compass,
      color: "text-indigo-400",
      bg: "bg-indigo-500/15 border-indigo-500/30",
    },
    {
      title: "Jensen's Alpha",
      value: `${defaultMetrics.alpha_pct >= 0 ? "+" : ""}${defaultMetrics.alpha_pct.toFixed(1)}%`,
      desc: "Excess return relative to benchmark model",
      icon: BarChart,
      color: "text-cyan-400",
      bg: "bg-cyan-500/15 border-cyan-500/30",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, idx) => {
        const Icon = item.icon
        return (
          <div
            key={idx}
            className="glass-panel p-4 space-y-2 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#a1a1aa] font-medium tracking-wide">{item.title}</span>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${item.bg}`}>
                <Icon size={15} className={item.color} />
              </div>
            </div>
            <div className="text-xl font-bold font-['Roobert'] text-[#f5f5f7] tracking-tight">{item.value}</div>
            <div className="text-[10px] text-[#a1a1aa] leading-tight">{item.desc}</div>
          </div>
        )
      })}
    </div>
  )
}
