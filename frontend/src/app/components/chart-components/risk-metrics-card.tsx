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
      valueColor: "text-[#101828]",
    },
    {
      title: "Sortino Ratio",
      value: defaultMetrics.sortino_ratio.toFixed(2),
      desc: "Downside risk-adjusted return",
      icon: Zap,
      valueColor: "text-[#101828]",
    },
    {
      title: "Max Drawdown",
      value: `-${defaultMetrics.max_drawdown_pct.toFixed(1)}%`,
      desc: "Peak-to-trough max historical decline",
      icon: TrendingDown,
      valueColor: "text-[#D64545]",
    },
    {
      title: "Ann. Volatility",
      value: `${defaultMetrics.volatility_pct.toFixed(1)}%`,
      desc: "Annualized standard deviation of returns",
      icon: Activity,
      valueColor: "text-[#101828]",
    },
    {
      title: "Portfolio Beta",
      value: defaultMetrics.beta.toFixed(2),
      desc: "Sensitivity relative to S&P 500 (SPY)",
      icon: Compass,
      valueColor: "text-[#101828]",
    },
    {
      title: "Jensen's Alpha",
      value: `${defaultMetrics.alpha_pct >= 0 ? "+" : ""}${defaultMetrics.alpha_pct.toFixed(1)}%`,
      desc: "Excess return relative to benchmark model",
      icon: BarChart,
      valueColor: defaultMetrics.alpha_pct >= 0 ? "text-[#1E8E5A]" : "text-[#D64545]",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, idx) => {
        const Icon = item.icon
        return (
          <div
            key={idx}
            className="bg-[#FFFFFF] p-4 space-y-2 border border-[#E2E6EF] rounded-2xl shadow-xs transition-all hover:border-[#6B7A99]/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B7A99] font-medium tracking-wide">{item.title}</span>
              {/* Neutral icon badge: background #F3F4F8, icon color #6B7A99 */}
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-[#F3F4F8] border border-[#E2E6EF] text-[#6B7A99]">
                <Icon size={14} className="text-[#6B7A99]" />
              </div>
            </div>
            <div className={`text-xl font-bold font-['Roobert'] tracking-tight ${item.valueColor}`}>{item.value}</div>
            <div className="text-[10px] text-[#6B7A99] leading-tight">{item.desc}</div>
          </div>
        )
      })}
    </div>
  )
}
