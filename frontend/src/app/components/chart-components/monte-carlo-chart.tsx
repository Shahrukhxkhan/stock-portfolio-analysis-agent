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
    <div className="bg-[#FFFFFF] rounded-2xl p-4 space-y-4 border border-[#E2E6EF] shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2E6EF] pb-3">
        <div className="flex items-center gap-2">
          <Dices size={18} className="text-[#3730E0]" />
          <div>
            <h3 className="text-xs font-bold text-[#101828] uppercase tracking-wider font-['Roobert']">
              1-Year Monte Carlo Simulation (1,000 Paths)
            </h3>
            <p className="text-[10px] text-[#6B7A99] mt-0.5">
              Probabilistic fan chart derived from daily log return distributions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1 text-[#1E8E5A] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E5A]" /> 95th (Bull)
          </span>
          <span className="flex items-center gap-1 text-[#3730E0] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3730E0]" /> 50th (Median)
          </span>
          <span className="flex items-center gap-1 text-[#D64545] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D64545]" /> 5th (Bear)
          </span>
        </div>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={defaultData}>
            <defs>
              <linearGradient id="bullGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E8E5A" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#1E8E5A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EF" />
            <XAxis dataKey="period" stroke="#6B7A99" fontSize={10} fontFamily="Plus Jakarta Sans" />
            <YAxis
              stroke="#6B7A99"
              fontSize={10}
              fontFamily="Plus Jakarta Sans"
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E6EF",
                borderRadius: "12px",
                color: "#101828",
                fontSize: "11px",
              }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, "Valuation"]}
            />

            <Area type="monotone" dataKey="bull95th" stroke="none" fill="url(#bullGradient)" />
            <Line type="monotone" dataKey="bull95th" stroke="#1E8E5A" strokeWidth={2} name="95th Percentile (Bull)" dot={false} />
            <Line type="monotone" dataKey="median50th" stroke="#3730E0" strokeWidth={2.5} name="50th Percentile (Median)" dot={false} />
            <Line type="monotone" dataKey="bear5th" stroke="#D64545" strokeWidth={2} strokeDasharray="4 4" name="5th Percentile (Bear)" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
