"use client"

import { Grid } from "lucide-react"

export interface CorrelationData {
  tickers: string[]
  matrix: number[][]
}

interface CorrelationHeatmapProps {
  data?: CorrelationData
}

export function CorrelationHeatmap({ data }: CorrelationHeatmapProps) {
  const tickers = data?.tickers || ["AAPL", "MSFT", "NVDA", "SPY"]
  const matrix = data?.matrix || [
    [1.0, 0.72, 0.65, 0.81],
    [0.72, 1.0, 0.78, 0.85],
    [0.65, 0.78, 1.0, 0.74],
    [0.81, 0.85, 0.74, 1.0],
  ]

  const getCellColor = (val: number) => {
    if (val === 1.0) return "bg-purple-500/30 text-purple-200 border-purple-500/40"
    if (val >= 0.8) return "bg-rose-500/25 text-rose-300 border-rose-500/40"
    if (val >= 0.5) return "bg-amber-500/20 text-amber-300 border-amber-500/30"
    if (val >= 0.2) return "bg-blue-500/15 text-blue-300 border-blue-500/30"
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
  }

  return (
    <div className="glass-panel p-4 space-y-4 border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Grid size={16} className="text-purple-400" />
          <h3 className="text-xs font-bold text-[#f5f5f7] uppercase tracking-wider font-['Roobert']">
            Asset Cross-Correlation Heatmap
          </h3>
        </div>
        <span className="text-[10px] text-[#a1a1aa]">Range: -1.0 (Inverse) to +1.0 (Identical)</span>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-[10px] text-[#a1a1aa] font-bold"></th>
              {tickers.map((t) => (
                <th key={`head-${t}`} className="p-2 text-xs font-bold text-[#f5f5f7] font-['Roobert']">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickers.map((rowTicker, rowIdx) => (
              <tr key={`row-${rowTicker}`}>
                <td className="p-2 text-xs font-bold text-[#f5f5f7] font-['Roobert'] text-right pr-3">
                  {rowTicker}
                </td>
                {tickers.map((colTicker, colIdx) => {
                  const val = matrix[rowIdx]?.[colIdx] ?? (rowIdx === colIdx ? 1.0 : 0.5)
                  return (
                    <td key={`cell-${rowTicker}-${colTicker}`} className="p-1.5">
                      <div
                        className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-[1.05] ${getCellColor(
                          val
                        )}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
