"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface LineChartData {
  date: string
  portfolio: number
  spy: number | null | undefined
}

interface LineChartComponentProps {
  data: LineChartData[] | [] | undefined
  size?: "normal" | "small"
}

export function LineChartComponent({ data, size = "normal" }: LineChartComponentProps) {
  const height = size === "small" ? 120 : 192 // h-30 or h-48
  const padding = size === "small" ? "p-2" : "p-4"
  const fontSize = size === "small" ? 8 : 10
  const tooltipFontSize = size === "small" ? "9px" : "11px"
  const legendFontSize = size === "small" ? "9px" : "11px"
  return (
    <div className={`glass-panel ${padding}`}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="date" stroke="#a1a1aa" fontSize={fontSize} fontFamily="Plus Jakarta Sans" />
            <YAxis
              stroke="#a1a1aa"
              fontSize={fontSize}
              fontFamily="Plus Jakarta Sans"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 15, 23, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#f5f5f7",
                borderRadius: "12px",
                fontSize: tooltipFontSize,
                fontFamily: "Plus Jakarta Sans",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(12px)",
              }}
              itemStyle={{ color: "#f5f5f7" }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: any, name: string) => [
                value != null && typeof value === 'number' ? `$${value.toLocaleString()}` : "N/A",
                name.toLowerCase() === "portfolio" ? "Portfolio" : "SPY",
              ]}
            />
            <Legend
              wrapperStyle={{
                fontSize: legendFontSize,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 500,
                color: "#a1a1aa",
              }}
            />
            <Line type="monotone" dataKey="portfolio" stroke="#FF003C" strokeWidth={2.5} name="Portfolio" dot={false} />
            <Line type="monotone" dataKey="spy" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" name="SPY" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
