"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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
  const height = size === "small" ? 80 : 160 // h-20 or h-40
  const padding = size === "small" ? "p-2" : "p-4"
  const fontSize = size === "small" ? 8 : 10
  const tooltipFontSize = size === "small" ? "9px" : "11px"
  return (
    <div className={`glass-panel ${padding}`}>
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
            <Bar onClick={(data, index) => {
              if (size === "normal") {
                // @ts-ignore
                console.log(data.payload, "clicked")
                // @ts-ignore
                onClick?.(data.payload.ticker as string)
              }
            }} dataKey="return" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
