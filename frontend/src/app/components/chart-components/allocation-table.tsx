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
}

export function AllocationTableComponent({ allocations, size = "normal" }: AllocationTableComponentProps) {
  if (!allocations || allocations.length === 0) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
        {/* Subtle pulsing skeleton lines */}
        <div className="absolute inset-0 flex flex-col justify-around opacity-10 pointer-events-none p-4">
          <div className="h-2 bg-white/30 rounded-full w-3/4 animate-pulse" />
          <div className="h-2 bg-white/30 rounded-full w-1/2 animate-pulse delay-100" />
          <div className="h-2 bg-white/30 rounded-full w-5/6 animate-pulse delay-200" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a1a1aa] shadow-inner relative z-10">
          <PieChart size={20} className="animate-pulse text-[#a1a1aa]" />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-[#f5f5f7]">No Allocation Data</p>
          <p className="text-[11px] text-[#a1a1aa] mt-0.5">Execute an analysis query to generate asset allocation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-3.5 space-y-3">
      {allocations.map((item) => (
        <div key={item.ticker} className="space-y-1.5 group p-1.5 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-between text-xs font-['Plus_Jakarta_Sans']">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#f5f5f7] tracking-wider font-['Roobert']">{item.ticker}</span>
              <span className="text-[11px] text-[#a1a1aa] font-medium">({item.allocation.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-[#f5f5f7] font-['Roobert']">
                ${(item.currentValue / 1000).toFixed(1)}K
              </span>
              {item.totalReturn != null && (
                <span
                  className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md border ${
                    item.totalReturn >= 0
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/15 border-rose-500/30 text-rose-400"
                  }`}
                >
                  {item.totalReturn >= 0 ? "+" : ""}
                  {item.totalReturn.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          {/* Slim progress bar with gradient fill */}
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 backdrop-blur-md">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF003C] via-[#6366f1] to-[#a855f7] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.4)]"
              style={{ width: `${Math.min(Math.max(item.allocation, 3), 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

