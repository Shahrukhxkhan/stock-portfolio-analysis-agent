import { PieChart } from "lucide-react"

export interface Allocation {
  ticker: string
  allocation: number
  currentValue: number
  totalReturn: number
}

interface AllocationTableComponentProps {
  allocations: Allocation[] | [] | undefined
  size?: "normal" | "small"
  onSelectTicker?: (ticker: string) => void
}

export function AllocationTableComponent({ allocations, size = "normal", onSelectTicker }: AllocationTableComponentProps) {
  if (!allocations || allocations.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E2E6EF] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#F3F4F8] border border-[#E2E6EF] flex items-center justify-center text-[#6B7A99] shadow-inner relative z-10">
          <PieChart size={20} className="animate-pulse text-[#6B7A99]" />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-[#101828]">No Allocation Data</p>
          <p className="text-[11px] text-[#6B7A99] mt-0.5">Execute an analysis query to generate asset allocation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E6EF] rounded-2xl p-3.5 space-y-3 shadow-xs">
      {allocations.map((item) => (
        <div
          key={item.ticker}
          onClick={() => onSelectTicker?.(item.ticker)}
          className="space-y-1.5 group p-2 rounded-xl hover:bg-[#F3F4F8] border border-transparent hover:border-[#E2E6EF] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-['Plus_Jakarta_Sans']">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#101828] tracking-wider font-['Roobert'] group-hover:text-[#3730E0] transition-colors">
                {item.ticker}
              </span>
              <span className="text-[11px] text-[#6B7A99] font-medium">({item.allocation.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-[#101828] font-['Roobert']">
                ${(item.currentValue / 1000).toFixed(1)}K
              </span>
              {item.totalReturn != null && (
                <span
                  className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md border ${
                    item.totalReturn >= 0
                      ? "bg-[#E8F5EE] border-[#1E8E5A]/30 text-[#1E8E5A]"
                      : "bg-[#FCEBEB] border-[#D64545]/30 text-[#D64545]"
                  }`}
                >
                  {item.totalReturn >= 0 ? "+" : ""}
                  {item.totalReturn.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          {/* Progress bar with primary accent fill */}
          <div className="h-2 w-full bg-[#F3F4F8] rounded-full overflow-hidden p-0.5 border border-[#E2E6EF]">
            <div
              className="h-full rounded-full bg-[#3730E0] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(Math.max(item.allocation, 3), 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
