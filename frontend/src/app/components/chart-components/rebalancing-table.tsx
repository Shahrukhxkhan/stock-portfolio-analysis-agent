"use client"

import { Scale, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

export interface RebalanceOrder {
  ticker: string
  current_shares: number
  current_weight_pct: number
  target_weight_pct: number
  drift_pct: number
  action: "BUY" | "SELL" | "HOLD"
  share_delta: number
  dollar_delta: number
}

interface RebalancingTableProps {
  orders?: RebalanceOrder[]
}

export function RebalancingTable({ orders }: RebalancingTableProps) {
  const defaultOrders: RebalanceOrder[] = orders?.length
    ? orders
    : [
        {
          ticker: "AAPL",
          current_shares: 55.2,
          current_weight_pct: 42.5,
          target_weight_pct: 33.3,
          drift_pct: 9.2,
          action: "SELL",
          share_delta: 12,
          dollar_delta: 2700,
        },
        {
          ticker: "MSFT",
          current_shares: 24.1,
          current_weight_pct: 30.1,
          target_weight_pct: 33.3,
          drift_pct: -3.2,
          action: "BUY",
          share_delta: 3,
          dollar_delta: 1250,
        },
        {
          ticker: "NVDA",
          current_shares: 62.0,
          current_weight_pct: 27.4,
          target_weight_pct: 33.3,
          drift_pct: -5.9,
          action: "BUY",
          share_delta: 11,
          dollar_delta: 1450,
        },
      ]

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
          <Scale size={18} className="text-amber-400" />
          <div>
            <h3 className="text-xs font-bold text-[#f5f5f7] uppercase tracking-wider font-['Roobert']">
              Smart Portfolio Rebalancing Orders
            </h3>
            <p className="text-[10px] text-[#a1a1aa] mt-0.5">
              Actionable order recommendations to realign allocations to target weights
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse text-xs font-['Plus_Jakarta_Sans']">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-[#a1a1aa] uppercase tracking-wider">
              <th className="py-2 px-3">Ticker</th>
              <th className="py-2 px-3">Current Weight</th>
              <th className="py-2 px-3">Target Weight</th>
              <th className="py-2 px-3">Weight Drift</th>
              <th className="py-2 px-3">Action Order</th>
              <th className="py-2 px-3 text-right">Shares Delta</th>
              <th className="py-2 px-3 text-right">Value Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {defaultOrders.map((ord) => (
              <tr key={ord.ticker} className="hover:bg-white/5 transition-colors">
                <td className="py-2.5 px-3 font-bold text-[#f5f5f7] font-['Roobert']">{ord.ticker}</td>
                <td className="py-2.5 px-3 font-semibold text-[#f5f5f7]">{ord.current_weight_pct.toFixed(1)}%</td>
                <td className="py-2.5 px-3 text-[#a1a1aa]">{ord.target_weight_pct.toFixed(1)}%</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`font-semibold ${
                      ord.drift_pct > 0 ? "text-rose-400" : ord.drift_pct < 0 ? "text-emerald-400" : "text-[#a1a1aa]"
                    }`}
                  >
                    {ord.drift_pct > 0 ? `+${ord.drift_pct.toFixed(1)}%` : `${ord.drift_pct.toFixed(1)}%`}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ord.action === "BUY"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : ord.action === "SELL"
                        ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        : "bg-white/10 text-[#a1a1aa] border-white/10"
                    }`}
                  >
                    {ord.action === "BUY" ? (
                      <ArrowUpRight size={12} />
                    ) : ord.action === "SELL" ? (
                      <ArrowDownRight size={12} />
                    ) : (
                      <Minus size={12} />
                    )}
                    {ord.action}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#f5f5f7]">
                  {ord.share_delta > 0 ? `${ord.share_delta} shares` : "-"}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#f5f5f7]">
                  {ord.dollar_delta > 0 ? formatCurrency(ord.dollar_delta) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
