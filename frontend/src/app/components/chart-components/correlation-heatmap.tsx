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
    if (val === 1.0) return "bg-[#3730E0] text-[#FFFFFF] border-[#3730E0]"
    if (val >= 0.8) return "bg-[#3730E0]/20 text-[#3730E0] border-[#3730E0]/30"
    if (val >= 0.5) return "bg-[#3730E0]/10 text-[#3730E0] border-[#3730E0]/20"
    if (val >= 0.2) return "bg-[#F3F4F8] text-[#101828] border-[#E2E6EF]"
    return "bg-[#E8F5EE] text-[#1E8E5A] border-[#1E8E5A]/30"
  }

  return (
    <div className="bg-[#FFFFFF] p-4 space-y-4 border border-[#E2E6EF] rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2E6EF] pb-3">
        <div className="flex items-center gap-2">
          <Grid size={16} className="text-[#3730E0]" />
          <h3 className="text-xs font-bold text-[#101828] uppercase tracking-wider font-['Roobert']">
            Asset Cross-Correlation Heatmap
          </h3>
        </div>
        <span className="text-[10px] text-[#6B7A99]">Range: -1.0 (Inverse) to +1.0 (Identical)</span>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-[10px] text-[#6B7A99] font-bold"></th>
              {tickers.map((t) => (
                <th key={`head-${t}`} className="p-2 text-xs font-bold text-[#101828] font-['Roobert']">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickers.map((rowTicker, rowIdx) => (
              <tr key={`row-${rowTicker}`}>
                <td className="p-2 text-xs font-bold text-[#101828] font-['Roobert'] text-right pr-3">
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
