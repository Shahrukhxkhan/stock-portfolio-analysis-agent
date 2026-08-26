"use client"

import { Layers, Coins, DollarSign, TrendingUp, Cpu, Globe } from "lucide-react"

export interface AssetClassItem {
  asset_class: string
  value: number
  weight_pct: number
}

interface AssetClassDistributionProps {
  distribution?: AssetClassItem[]
}

export function AssetClassDistribution({ distribution }: AssetClassDistributionProps) {
  const defaultItems: AssetClassItem[] = distribution?.length
    ? distribution
    : [
        { asset_class: "US Stock", value: 65000, weight_pct: 65.0 },
        { asset_class: "Crypto", value: 20000, weight_pct: 20.0 },
        { asset_class: "Commodity", value: 10000, weight_pct: 10.0 },
        { asset_class: "ETF", value: 5000, weight_pct: 5.0 },
      ]

  const getAssetBadgeColor = (category: string) => {
    switch (category) {
      case "Crypto":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40"
      case "Commodity":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40"
      case "Forex":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
      case "ETF":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/40"
    }
  }

  const getAssetIcon = (category: string) => {
    switch (category) {
      case "Crypto":
        return Cpu
      case "Commodity":
        return Coins
      case "Forex":
        return Globe
      case "ETF":
        return Layers
      default:
        return TrendingUp
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="glass-panel p-4 space-y-4 border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-purple-400" />
          <h3 className="text-xs font-bold text-[#f5f5f7] uppercase tracking-wider font-['Roobert']">
            Asset Class Breakdown
          </h3>
        </div>
        <span className="text-[10px] text-[#a1a1aa]">Stocks, Crypto, Commodities, Forex & ETFs</span>
      </div>

      <div className="space-y-3">
        {defaultItems.map((item) => {
          const Icon = getAssetIcon(item.asset_class)
          const badgeStyle = getAssetBadgeColor(item.asset_class)
          return (
            <div key={item.asset_class} className="space-y-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${badgeStyle}`}>
                    <Icon size={12} />
                  </div>
                  <span className="font-bold text-[#f5f5f7] font-['Roobert']">{item.asset_class}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#f5f5f7]">{formatCurrency(item.value)}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                    {item.weight_pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(item.weight_pct, 4), 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
