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
    <div className="bg-[#FFFFFF] p-4 space-y-4 border border-[#E2E6EF] rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2E6EF] pb-3">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-[#3730E0]" />
          <div>
            <h3 className="text-xs font-bold text-[#101828] uppercase tracking-wider font-['Roobert']">
              Smart Portfolio Rebalancing Orders
            </h3>
            <p className="text-[10px] text-[#6B7A99] mt-0.5">
              Actionable order recommendations to realign allocations to target weights
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse text-xs font-['Plus_Jakarta_Sans']">
          <thead>
            <tr className="border-b border-[#E2E6EF] text-[10px] text-[#6B7A99] uppercase tracking-wider">
              <th className="py-2 px-3">Ticker</th>
              <th className="py-2 px-3">Current Weight</th>
              <th className="py-2 px-3">Target Weight</th>
              <th className="py-2 px-3">Weight Drift</th>
              <th className="py-2 px-3">Action Order</th>
              <th className="py-2 px-3 text-right">Shares Delta</th>
              <th className="py-2 px-3 text-right">Value Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EF]">
            {defaultOrders.map((ord) => (
              <tr key={ord.ticker} className="hover:bg-[#F3F4F8] transition-colors">
                <td className="py-2.5 px-3 font-bold text-[#101828] font-['Roobert']">{ord.ticker}</td>
                <td className="py-2.5 px-3 font-semibold text-[#101828]">{ord.current_weight_pct.toFixed(1)}%</td>
                <td className="py-2.5 px-3 text-[#6B7A99]">{ord.target_weight_pct.toFixed(1)}%</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`font-semibold ${
                      ord.drift_pct > 0 ? "text-[#D64545]" : ord.drift_pct < 0 ? "text-[#1E8E5A]" : "text-[#6B7A99]"
                    }`}
                  >
                    {ord.drift_pct > 0 ? `+${ord.drift_pct.toFixed(1)}%` : `${ord.drift_pct.toFixed(1)}%`}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ord.action === "BUY"
                        ? "bg-[#E8F5EE] text-[#1E8E5A] border-[#1E8E5A]/30"
                        : ord.action === "SELL"
                        ? "bg-[#FCEBEB] text-[#D64545] border-[#D64545]/30"
                        : "bg-[#F3F4F8] text-[#6B7A99] border-[#E2E6EF]"
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
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#101828]">
                  {ord.share_delta > 0 ? `${ord.share_delta} shares` : "-"}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#101828]">
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
