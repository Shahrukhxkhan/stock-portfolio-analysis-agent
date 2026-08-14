export interface Allocation {
  ticker: string
  allocation: number
  currentValue: number
  totalReturn: number
}

interface AllocationTableComponentProps {
  allocations: Allocation[] | [] | undefined
  size?: "normal" | "small"
}

export function AllocationTableComponent({ allocations, size = "normal" }: AllocationTableComponentProps) {
  // Define class variants based on size
  const padding = size === "small" ? "py-1.5 px-2" : "py-2.5 px-3"
  const fontSize = size === "small" ? "text-[10px]" : "text-xs"
  return (
    <div className="glass-panel overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className={`text-left ${padding} ${fontSize} font-semibold text-[#f5f5f7] font-['Plus_Jakarta_Sans']`}>
              Ticker
            </th>
            <th className={`text-left ${padding} ${fontSize} font-semibold text-[#f5f5f7] font-['Plus_Jakarta_Sans']`}>%</th>
            <th className={`text-left ${padding} ${fontSize} font-semibold text-[#f5f5f7] font-['Plus_Jakarta_Sans']`}>
              Value
            </th>
            <th className={`text-left ${padding} ${fontSize} font-semibold text-[#f5f5f7] font-['Plus_Jakarta_Sans']`}>
              Return
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {allocations?.map((allocation, index) => (
            <tr key={allocation.ticker} className={index % 2 === 0 ? "bg-transparent hover:bg-white/5 transition-colors" : "bg-white/[0.02] hover:bg-white/5 transition-colors"}>
              <td className={`font-semibold text-[#f5f5f7] font-['Plus_Jakarta_Sans'] ${padding} ${fontSize}`}>
                {allocation.ticker}
              </td>
              <td className={`text-[#a1a1aa] font-['Plus_Jakarta_Sans'] ${padding} ${fontSize}`}>{allocation.allocation.toFixed(2)}%</td>
              <td className={`text-[#a1a1aa] font-['Plus_Jakarta_Sans'] ${padding} ${fontSize}`}>
                ${(allocation.currentValue / 1000).toFixed(1)}K
              </td>
              <td className={`font-medium font-['Plus_Jakarta_Sans'] ${padding} ${fontSize}`}>
                <span className={allocation.totalReturn >= 0 ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                  {allocation.totalReturn >= 0 ? "+" : ""}
                  {allocation.totalReturn.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
