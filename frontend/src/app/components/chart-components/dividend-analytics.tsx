"use client"

import { Coins, TrendingUp, RefreshCw } from "lucide-react"
import { ResponsiveContainer, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

export interface DividendData {
  total_annual_income: number
  portfolio_yield_pct: number
  ticker_dividends: Record<
    string,
    {
      annual_per_share: number
      annual_income: number
      yield_pct: number
    }
  >
  drip_projection: Array<{
    year: string
    withoutDRIP: number
    withDRIP: number
  }>
}

interface DividendAnalyticsProps {
  data?: DividendData
}

export function DividendAnalytics({ data }: DividendAnalyticsProps) {
  const defaultIncome = data?.total_annual_income ?? 680
  const defaultYield = data?.portfolio_yield_pct ?? 2.1
  const tickerDivs = data?.ticker_dividends || {
    AAPL: { annual_per_share: 1.0, annual_income: 220, yield_pct: 0.55 },
    MSFT: { annual_per_share: 3.0, annual_income: 360, yield_pct: 0.72 },
    SPY: { annual_per_share: 6.8, annual_income: 100, yield_pct: 1.35 },
  }
  const dripProjection = data?.drip_projection?.length
    ? data.drip_projection
    : [
        { year: "Year 1", withoutDRIP: 10700, withDRIP: 10910 },
        { year: "Year 2", withoutDRIP: 11449, withDRIP: 11902 },
        { year: "Year 3", withoutDRIP: 12250, withDRIP: 12985 },
        { year: "Year 4", withoutDRIP: 13107, withDRIP: 14167 },
        { year: "Year 5", withoutDRIP: 14025, withDRIP: 15456 },
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
    <div className="glass-panel p-5 space-y-5 border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Coins size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#f5f5f7] font-['Roobert']">Dividend & DRIP Compounding Analytics</h3>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Projected annual dividend payouts and DRIP (Dividend Reinvestment Plan) compounding simulation
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-[#a1a1aa] uppercase tracking-wider">Est. Annual Payout</div>
          <div className="text-lg font-bold text-emerald-400 font-['Roobert']">{formatCurrency(defaultIncome)}</div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-[11px] text-[#a1a1aa]">Portfolio Yield %</div>
          <div className="text-xl font-bold text-[#f5f5f7] font-['Roobert'] mt-1">{defaultYield.toFixed(2)}%</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-[11px] text-[#a1a1aa]">DRIP Reinvestment Bonus</div>
          <div className="text-xl font-bold text-purple-400 font-['Roobert'] mt-1">+10.2% / 5Y</div>
        </div>
      </div>

      {/* Per Ticker Breakdown */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Dividend Payout Breakdown</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Object.entries(tickerDivs).map(([ticker, info]) => (
            <div key={ticker} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#f5f5f7] font-['Roobert']">{ticker}</span>
                <span className="text-emerald-400 font-semibold">{info.yield_pct.toFixed(2)}% Yield</span>
              </div>
              <div className="text-xs text-[#a1a1aa]">
                Income: <span className="text-[#f5f5f7] font-semibold">{formatCurrency(info.annual_income)}/yr</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DRIP Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
          <span className="font-semibold text-[#f5f5f7]">5-Year Growth: DRIP vs Cash Payout</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-[#a1a1aa]">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Cash Payout
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Reinvested (DRIP)
            </span>
          </div>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dripProjection}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="year" stroke="#a1a1aa" fontSize={10} fontFamily="Plus Jakarta Sans" />
              <YAxis
                stroke="#a1a1aa"
                fontSize={10}
                fontFamily="Plus Jakarta Sans"
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 15, 23, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  color: "#f5f5f7",
                  fontSize: "11px",
                  backdropFilter: "blur(12px)",
                }}
              />
              <Line type="monotone" dataKey="withoutDRIP" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" name="Without DRIP" dot={false} />
              <Line type="monotone" dataKey="withDRIP" stroke="#10b981" strokeWidth={2.5} name="With DRIP" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
