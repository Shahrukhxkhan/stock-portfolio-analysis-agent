"use client"

import { Layers, Coins, TrendingUp, Cpu, Globe } from "lucide-react"

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
    <div className="bg-[#FFFFFF] rounded-2xl p-4 space-y-4 border border-[#E2E6EF] shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2E6EF] pb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#3730E0]" />
          <h3 className="text-xs font-bold text-[#101828] uppercase tracking-wider font-['Roobert']">
            Asset Class Breakdown
          </h3>
        </div>
        <span className="text-[10px] text-[#6B7A99]">Stocks, Crypto, Commodities, Forex & ETFs</span>
      </div>

      <div className="space-y-3">
        {defaultItems.map((item) => {
          const Icon = getAssetIcon(item.asset_class)
          return (
            <div key={item.asset_class} className="space-y-1.5 p-2 rounded-xl bg-[#F3F4F8] border border-[#E2E6EF]">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#FFFFFF] border border-[#E2E6EF] text-[#6B7A99]">
                    <Icon size={12} />
                  </div>
                  <span className="font-bold text-[#101828] font-['Roobert']">{item.asset_class}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#101828]">{formatCurrency(item.value)}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#6B7A99] border border-[#E2E6EF]">
                    {item.weight_pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-[#E2E6EF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3730E0] rounded-full transition-all duration-500"
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
