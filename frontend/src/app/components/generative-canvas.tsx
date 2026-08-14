"use client"

import { LineChartComponent } from "./chart-components/line-chart"
import { AllocationTableComponent } from "./chart-components/allocation-table"
import { InsightCardComponent } from "./chart-components/insight-card"
import { SectionTitle } from "./chart-components/section-title"
import { BarChartComponent } from "./chart-components/bar-chart"
import type { PortfolioState, SandBoxPortfolioState } from "../page"
import { Sparkles, AlertCircle } from "lucide-react"

interface GenerativeCanvasProps {
  portfolioState: PortfolioState
  setSelectedStock: (stock: string) => void
  sandBoxPortfolio: SandBoxPortfolioState[]
  setSandBoxPortfolio: (portfolio: SandBoxPortfolioState[]) => void
}

export function GenerativeCanvas({ portfolioState, setSelectedStock, sandBoxPortfolio, setSandBoxPortfolio }: GenerativeCanvasProps) {
  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-4 max-w-none">
        {/* Performance Section */}
        <div>
          <SectionTitle title="Performance" />
          <div className="mt-3">
            {portfolioState?.performanceData?.length === 0 ? (
              <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a1a1aa] shadow-inner">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#f5f5f7]">No Performance Data</p>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5">Performance charts will be rendered here upon prompt submission</p>
                </div>
              </div>
            ) : (
              <LineChartComponent
                data={
                  (portfolioState?.performanceData || []).map(d => ({
                    ...d,
                    portfolio: d.portfolio ?? 0,
                    spy: d.spy,
                  }))
                }
              />
            )}
          </div>
        </div>

        {/* Allocation and Returns Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SectionTitle title="Allocation" />
            <div className="mt-3">
              <AllocationTableComponent
                allocations={
                  (portfolioState?.allocations || []).map(a => ({
                    ...a,
                    allocation: Number(a.allocation),
                  }))
                }
              />
            </div>
          </div>

          <div>
            <SectionTitle title="Returns" />
            <div className="mt-3">
              <BarChartComponent data={portfolioState?.returnsData || []} onClick={setSelectedStock} />
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div>
          <SectionTitle title="Market Insights" />
          <div className="mt-3 grid grid-cols-2 gap-4">
            {/* Bull Insights */}
            <div className="glass-panel p-4 border-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.06)] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-base shadow-[0_0_10px_rgba(52,211,153,0.2)] flex-shrink-0">
                  🐂
                </div>
                <h3 className="text-sm font-bold text-emerald-400 font-['Roobert'] tracking-wide">BULL CASE</h3>
              </div>
              <div className="space-y-2.5">
                {portfolioState.bullInsights.length === 0 ? (
                  <div className="p-5 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Sparkles size={18} className="animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#f5f5f7]">No Bull Case Insights</p>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5">Bullish analysis will appear here after prompt execution</p>
                    </div>
                  </div>
                ) : (
                  portfolioState.bullInsights.map((insight, index) => (
                    <InsightCardComponent key={`bull-${index}`} insight={insight} type="bull" />
                  ))
                )}
              </div>
            </div>

            {/* Bear Insights */}
            <div className="glass-panel p-4 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.06)] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-base shadow-[0_0_10px_rgba(244,63,94,0.2)] flex-shrink-0">
                  🐻
                </div>
                <h3 className="text-sm font-bold text-rose-400 font-['Roobert'] tracking-wide">BEAR CASE</h3>
              </div>
              <div className="space-y-2.5">
                {portfolioState.bearInsights.length === 0 ? (
                  <div className="p-5 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <AlertCircle size={18} className="animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#f5f5f7]">No Bear Case Insights</p>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5">Bearish analysis will appear here after prompt execution</p>
                    </div>
                  </div>
                ) : (
                  portfolioState.bearInsights.map((insight, index) => (
                    <InsightCardComponent key={`bear-${index}`} insight={insight} type="bear" />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Charts */}
        <div hidden={sandBoxPortfolio?.length == 0}>
          <SectionTitle title="Custom Charts" />
          <div className="mt-3">
            {sandBoxPortfolio?.length === 0 ? (
              <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-xs font-semibold text-[#f5f5f7]">No Custom Chart Data</p>
              </div>
            ) : (
              <LineChartComponent
                data={
                  (portfolioState?.performanceData || []).map(d => ({
                    ...d,
                    portfolio: d.portfolio ?? 0,
                    spy: d.spy,
                  }))
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

