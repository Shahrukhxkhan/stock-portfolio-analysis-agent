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
      <div className="bg-[#0f0f17]/95 border border-white/15 p-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl font-['Plus_Jakarta_Sans'] text-xs min-w-[140px]">
        <div className="text-[#a1a1aa] font-semibold mb-2 border-b border-white/10 pb-1 text-[11px] tracking-wide">{label}</div>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            if (entry.hide || entry.value == null) return null
            const isPortfolio = entry.dataKey === "portfolio"
            const color = isPortfolio ? "#FF003C" : "#94a3b8"
            const name = isPortfolio ? "Portfolio" : "SPY"
            return (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-[#a1a1aa] text-[11px] font-medium">{name}:</span>
                </div>
                <span className="text-[#f5f5f7] font-semibold font-['Roobert']">
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

  const height = size === "small" ? 120 : 192 // h-30 or h-48
  const padding = size === "small" ? "p-2.5" : "p-4"
  const fontSize = size === "small" ? 8 : 10

  return (
    <div className={`glass-panel ${padding} relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}>
      {/* Legend Pill Toggles */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-[#a1a1aa] font-medium tracking-wide">Performance Overview</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPortfolio(!showPortfolio)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
              showPortfolio
                ? "bg-pink-500/15 border-pink-500/40 text-[#f5f5f7] shadow-[0_0_10px_rgba(255,0,60,0.2)]"
                : "bg-white/5 border-white/10 text-[#a1a1aa] opacity-40 hover:opacity-70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF003C] to-[#a855f7]" />
            Portfolio
          </button>
          <button
            type="button"
            onClick={() => setShowSpy(!showSpy)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
              showSpy
                ? "bg-slate-400/15 border-slate-400/40 text-[#f5f5f7] shadow-[0_0_10px_rgba(148,163,184,0.2)]"
                : "bg-white/5 border-white/10 text-[#a1a1aa] opacity-40 hover:opacity-70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#94a3b8]" />
            SPY
          </button>
        </div>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="portfolioStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF003C" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="portfolioAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF003C" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#a855f7" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis dataKey="date" stroke="#a1a1aa" fontSize={fontSize} fontFamily="Plus Jakarta Sans" />
            <YAxis
              stroke="#a1a1aa"
              fontSize={fontSize}
              fontFamily="Plus Jakarta Sans"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Soft area-fill gradient for Portfolio */}
            {showPortfolio && (
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="none"
                fill="url(#portfolioAreaGradient)"
                isAnimationActive={true}
                animationDuration={1500}
              />
            )}

            {/* Portfolio Line with Gradient Stroke */}
            {showPortfolio && (
              <Line
                type="monotone"
                dataKey="portfolio"
                stroke="url(#portfolioStrokeGradient)"
                strokeWidth={2.5}
                name="Portfolio"
                dot={false}
                isAnimationActive={true}
                animationDuration={1500}
              />
            )}

            {/* SPY Line (dashed, muted blue-gray) */}
            {showSpy && (
              <Line
                type="monotone"
                dataKey="spy"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                name="SPY"
                dot={false}
                isAnimationActive={true}
                animationDuration={1500}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

