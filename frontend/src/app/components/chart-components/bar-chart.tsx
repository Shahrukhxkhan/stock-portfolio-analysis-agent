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
      <div className="bg-[#FFFFFF] border border-[#E2E6EF] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#F3F4F8] border border-[#E2E6EF] flex items-center justify-center text-[#6B7A99] shadow-inner relative z-10">
          <BarChart3 size={20} className="animate-pulse text-[#6B7A99]" />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-[#101828]">No Returns Data</p>
          <p className="text-[11px] text-[#6B7A99] mt-0.5">Execute an analysis query to view ticker returns</p>
        </div>
      </div>
    )
  }

  const height = size === "small" ? 80 : 140
  const padding = size === "small" ? "p-2.5" : "p-3.5"
  const fontSize = size === "small" ? 8 : 10
  const tooltipFontSize = size === "small" ? "9px" : "11px"

  return (
    <div className={`bg-[#FFFFFF] border border-[#E2E6EF] rounded-2xl ${padding} space-y-3 shadow-xs`}>
      {/* Stat Chips per Ticker */}
      <div className="flex flex-wrap gap-2">
        {data.map((item) => (
          <div
            key={item.ticker}
            onClick={() => onClick?.(item.ticker)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium cursor-pointer transition-all hover:scale-[1.03] ${
              item.return >= 0
                ? "bg-[#E8F5EE] border-[#1E8E5A]/30 text-[#1E8E5A]"
                : "bg-[#FCEBEB] border-[#D64545]/30 text-[#D64545]"
            }`}
          >
            <span className="font-bold text-[#101828] font-['Roobert']">{item.ticker}</span>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EF" />
            <XAxis dataKey="ticker" stroke="#6B7A99" fontSize={fontSize} fontFamily="Plus Jakarta Sans" />
            <YAxis
              stroke="#6B7A99"
              fontSize={fontSize}
              fontFamily="Plus Jakarta Sans"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E6EF",
                borderRadius: "12px",
                color: "#101828",
                fontSize: tooltipFontSize,
                fontFamily: "Plus Jakarta Sans",
                boxShadow: "0 4px 16px rgba(16, 24, 40, 0.08)",
              }}
              itemStyle={{ color: "#101828" }}
              labelStyle={{ color: "#6B7A99" }}
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
                <Cell key={`cell-${index}`} fill={entry.return >= 0 ? "#1E8E5A" : "#D64545"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
