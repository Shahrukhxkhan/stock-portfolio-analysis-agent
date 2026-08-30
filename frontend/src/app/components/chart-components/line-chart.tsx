"use client"

import { useState } from "react"
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LineChartData {
  date: string
  portfolio: number
  spy: number | null | undefined
}

interface LineChartComponentProps {
  data: LineChartData[] | [] | undefined
  size?: "normal" | "small"
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E2E6EF] p-3 rounded-xl shadow-lg font-['Plus_Jakarta_Sans'] text-xs min-w-[140px]">
        <div className="text-[#6B7A99] font-semibold mb-2 border-b border-[#E2E6EF] pb-1 text-[11px] tracking-wide">{label}</div>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            if (entry.hide || entry.value == null) return null
            const isPortfolio = entry.dataKey === "portfolio"
            const color = isPortfolio ? "#3730E0" : "#6B7A99"
            const name = isPortfolio ? "Portfolio" : "SPY"
            return (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shadow-xs" style={{ backgroundColor: color }} />
                  <span className="text-[#6B7A99] text-[11px] font-medium">{name}:</span>
                </div>
                <span className="text-[#101828] font-semibold font-['Roobert']">
                  ${entry.value.toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}

export function LineChartComponent({ data, size = "normal" }: LineChartComponentProps) {
  const [showPortfolio, setShowPortfolio] = useState(true)
  const [showSpy, setShowSpy] = useState(true)
  const [showGradient, setShowGradient] = useState(true)
  const [timeRange, setTimeRange] = useState<"1M" | "6M" | "1Y" | "ALL">("ALL")

  const height = size === "small" ? 120 : 210
  const padding = size === "small" ? "p-2.5" : "p-4"
  const fontSize = size === "small" ? 8 : 10

  // Filter data based on selected time range
  const filteredData = (data || []).slice(
    timeRange === "1M" ? -2 : timeRange === "6M" ? -6 : timeRange === "1Y" ? -12 : 0
  )

  return (
    <div className={`bg-[#FFFFFF] border border-[#E2E6EF] rounded-2xl ${padding} relative overflow-hidden shadow-xs space-y-3`}>
      {/* Legend & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E6EF] pb-2">
        <div className="flex items-center gap-2">
          <div className="text-xs text-[#6B7A99] font-medium tracking-wide">Performance Overview</div>
          {/* Time Range Chips */}
          {size !== "small" && (
            <div className="flex items-center bg-[#F3F4F8] border border-[#E2E6EF] rounded-lg p-0.5 ml-2">
              {(["1M", "6M", "1Y", "ALL"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                    timeRange === range
                      ? "bg-[#3730E0] text-[#FFFFFF] shadow-xs"
                      : "text-[#6B7A99] hover:text-[#101828]"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Gradient Area Fill Toggle */}
          {size !== "small" && (
            <button
              type="button"
              onClick={() => setShowGradient(!showGradient)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all border cursor-pointer ${
                showGradient
                  ? "bg-[#3730E0]/10 border-[#3730E0]/30 text-[#3730E0]"
                  : "bg-[#F3F4F8] border-[#E2E6EF] text-[#6B7A99] opacity-70"
              }`}
            >
              Fill
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowPortfolio(!showPortfolio)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
              showPortfolio
                ? "bg-[#3730E0]/10 border-[#3730E0]/30 text-[#3730E0] font-semibold"
                : "bg-[#F3F4F8] border-[#E2E6EF] text-[#6B7A99] opacity-60 hover:opacity-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#3730E0]" />
            Portfolio
          </button>
          <button
            type="button"
            onClick={() => setShowSpy(!showSpy)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
              showSpy
                ? "bg-[#F3F4F8] border-[#E2E6EF] text-[#101828] font-semibold"
                : "bg-[#F3F4F8] border-[#E2E6EF] text-[#6B7A99] opacity-60 hover:opacity-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#6B7A99]" />
            SPY
          </button>
        </div>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData}>
            <defs>
              <linearGradient id="portfolioStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3730E0" />
                <stop offset="100%" stopColor="#3730E0" />
              </linearGradient>
              <linearGradient id="portfolioAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3730E0" stopOpacity={0.14} />
                <stop offset="60%" stopColor="#3730E0" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#3730E0" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EF" />
            <XAxis dataKey="date" stroke="#6B7A99" fontSize={fontSize} fontFamily="Plus Jakarta Sans" />
            <YAxis
              stroke="#6B7A99"
              fontSize={fontSize}
              fontFamily="Plus Jakarta Sans"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Primary Accent area-fill gradient for Portfolio at low opacity */}
            {showPortfolio && showGradient && (
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="none"
                fill="url(#portfolioAreaGradient)"
                isAnimationActive={true}
                animationDuration={1000}
              />
            )}

            {/* Portfolio Line with Primary Accent (#3730E0) */}
            {showPortfolio && (
              <Line
                type="monotone"
                dataKey="portfolio"
                stroke="#3730E0"
                strokeWidth={2.5}
                name="Portfolio"
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
              />
            )}

            {/* SPY Line (dashed, muted blue-gray #6B7A99) */}
            {showSpy && (
              <Line
                type="monotone"
                dataKey="spy"
                stroke="#6B7A99"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                name="SPY"
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
