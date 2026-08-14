"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { BarChart3 } from "lucide-react"

interface BarChartData {
  ticker: string
  return: number
}

interface BarChartComponentProps {
  data: BarChartData[]
  size?: "normal" | "small"
  onClick?: (data: string) => void
}

export function BarChartComponent({ data, size = "normal", onClick }: BarChartComponentProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
        {/* Subtle pulsing skeleton lines */}
        <div className="absolute inset-0 flex flex-col justify-around opacity-10 pointer-events-none p-4">
          <div className="h-2 bg-white/30 rounded-full w-2/3 animate-pulse" />
          <div className="h-2 bg-white/30 rounded-full w-1/2 animate-pulse delay-100" />
          <div className="h-2 bg-white/30 rounded-full w-4/5 animate-pulse delay-200" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a1a1aa] shadow-inner relative z-10">
          <BarChart3 size={20} className="animate-pulse text-[#a1a1aa]" />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-[#f5f5f7]">No Returns Data</p>
          <p className="text-[11px] text-[#a1a1aa] mt-0.5">Execute an analysis query to view ticker returns</p>
        </div>
      </div>
    )
  }

  const height = size === "small" ? 80 : 140 // h-20 or h-35
  const padding = size === "small" ? "p-2.5" : "p-3.5"
  const fontSize = size === "small" ? 8 : 10
  const tooltipFontSize = size === "small" ? "9px" : "11px"

  return (
    <div className={`glass-panel ${padding} space-y-3`}>
      {/* Stat Chips per Ticker */}
      <div className="flex flex-wrap gap-2">
        {data.map((item) => (
          <div
            key={item.ticker}
            onClick={() => onClick?.(item.ticker)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium cursor-pointer transition-all hover:scale-[1.03] ${
              item.return >= 0
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                : "bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
            }`}
          >
            <span className="font-bold text-[#f5f5f7] font-['Roobert']">{item.ticker}</span>
            <span className="font-semibold">
              {item.return >= 0 ? "+" : ""}
              {item.return.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="ticker" stroke="#a1a1aa" fontSize={fontSize} fontFamily="Plus Jakarta Sans" />
            <YAxis
              stroke="#a1a1aa"
              fontSize={fontSize}
              fontFamily="Plus Jakarta Sans"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 15, 23, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "12px",
                color: "#f5f5f7",
                fontSize: tooltipFontSize,
                fontFamily: "Plus Jakarta Sans",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(12px)",
              }}
              itemStyle={{ color: "#f5f5f7" }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Return"]}
            />
            <Bar
              onClick={(data: any) => {
                if (size === "normal" && data?.payload) {
                  onClick?.(data.payload.ticker as string)
                }
              }}
              dataKey="return"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.return >= 0 ? "#10b981" : "#f43f5e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

