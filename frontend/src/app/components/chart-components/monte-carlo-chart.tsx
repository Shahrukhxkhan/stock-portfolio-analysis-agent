"use client"

import { Dices } from "lucide-react"
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export interface MonteCarloPoint {
  period: string
  bear5th: number
  median50th: number
  bull95th: number
}

interface MonteCarloChartProps {
  data?: MonteCarloPoint[]
}

export function MonteCarloChart({ data }: MonteCarloChartProps) {
  const defaultData: MonteCarloPoint[] = data?.length
    ? data
    : [
        { period: "Start", bear5th: 10000, median50th: 10000, bull95th: 10000 },
        { period: "M1", bear5th: 9800, median50th: 10250, bull95th: 10800 },
        { period: "M3", bear5th: 9500, median50th: 10700, bull95th: 12100 },
        { period: "M6", bear5th: 9100, median50th: 11400, bull95th: 13900 },
        { period: "M9", bear5th: 8800, median50th: 12100, bull95th: 15800 },
        { period: "M12", bear5th: 8500, median50th: 12900, bull95th: 18200 },
      ]

  return (
    <div className="glass-panel p-4 space-y-4 border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Dices size={18} className="text-indigo-400" />
          <div>
            <h3 className="text-xs font-bold text-[#f5f5f7] uppercase tracking-wider font-['Roobert']">
              1-Year Monte Carlo Simulation (1,000 Paths)
            </h3>
            <p className="text-[10px] text-[#a1a1aa] mt-0.5">
              Probabilistic fan chart derived from daily log return distributions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> 95th (Bull)
          </span>
          <span className="flex items-center gap-1 text-purple-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> 50th (Median)
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> 5th (Bear)
          </span>
        </div>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={defaultData}>
            <defs>
              <linearGradient id="bullGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="period" stroke="#a1a1aa" fontSize={10} fontFamily="Plus Jakarta Sans" />
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
              formatter={(val: number) => [`$${val.toLocaleString()}`, "Valuation"]}
            />

            <Area type="monotone" dataKey="bull95th" stroke="none" fill="url(#bullGradient)" />
            <Line type="monotone" dataKey="bull95th" stroke="#10b981" strokeWidth={2} name="95th Percentile (Bull)" dot={false} />
            <Line type="monotone" dataKey="median50th" stroke="#a855f7" strokeWidth={2.5} name="50th Percentile (Median)" dot={false} />
            <Line type="monotone" dataKey="bear5th" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" name="5th Percentile (Bear)" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
