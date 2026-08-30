"use client"

import { useState } from "react"
import { LineChartComponent } from "./chart-components/line-chart"
import { AllocationTableComponent } from "./chart-components/allocation-table"
import { InsightCardComponent } from "./chart-components/insight-card"
import { SectionTitle } from "./chart-components/section-title"
import { BarChartComponent } from "./chart-components/bar-chart"
import { ScenarioSimulator } from "./chart-components/scenario-simulator"
import { RiskMetricsCard } from "./chart-components/risk-metrics-card"
import { CorrelationHeatmap } from "./chart-components/correlation-heatmap"
import { MonteCarloChart } from "./chart-components/monte-carlo-chart"
import { RebalancingTable } from "./chart-components/rebalancing-table"
import { DividendAnalytics } from "./chart-components/dividend-analytics"
import { MultiAgentInsights } from "./chart-components/multi-agent-insights"
import { AssetClassDistribution } from "./chart-components/asset-class-distribution"
import { PortfolioPdfReport } from "./portfolio-pdf-report"
import { copyShareLinkToClipboard } from "@/utils/share-link-utils"
import type { PortfolioState, SandBoxPortfolioState } from "../page"
import { TradingViewChart } from "./chart-components/tradingview-chart"
import { InteractiveRebalancer } from "./chart-components/interactive-rebalancer"
import { EfficientFrontierChart } from "./chart-components/efficient-frontier-chart"
import { BlackLittermanCard } from "./chart-components/black-litterman-card"
import { CrisisStressTest } from "./chart-components/crisis-stress-test"
import { FamaFrenchFactors } from "./chart-components/fama-french-factors"
import { OptionsHedgingCard } from "./chart-components/options-hedging-card"
import { Sparkles, AlertCircle, LayoutGrid, TrendingUp, PieChart, Sliders, Download, ShieldCheck, Scale, Bot, Link, Check, FileText, Zap, Activity, ShieldAlert } from "lucide-react"

interface GenerativeCanvasProps {
  portfolioState: PortfolioState & {
    riskMetrics?: any
    correlationMatrix?: any
    monteCarlo?: any
    dividendAnalytics?: any
    rebalancingOrders?: any
    multiAgentCrew?: any
    quantModels?: any
    optionsHedging?: any
    performanceTelemetry?: any
  }
  setSelectedStock: (stock: string | null) => void
  sandBoxPortfolio: SandBoxPortfolioState[]
  setSandBoxPortfolio: (portfolio: SandBoxPortfolioState[]) => void
  onApplyRebalance?: (rebalancedAllocations: any[], newCash: number) => void
}

export function GenerativeCanvas({
  portfolioState,
  setSelectedStock,
  sandBoxPortfolio,
  onApplyRebalance,
}: GenerativeCanvasProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "technical" | "performance" | "allocations" | "multiagent" | "risk" | "hedging" | "rebalance_interactive" | "rebalance" | "insights" | "simulator"
  >("overview")
  const [quantSubTab, setQuantSubTab] = useState<
    "frontier" | "black_litterman" | "crisis" | "fama_french" | "risk_var"
  >("frontier")
  const [showPdfReport, setShowPdfReport] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyShareLink = async () => {
    const success = await copyShareLinkToClipboard(portfolioState)
    if (success) {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioState, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `portfolio_analytics_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const activeTickers = (portfolioState.allocations || []).map((a) => a.ticker)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* PDF Executive Report Modal */}
      {showPdfReport && <PortfolioPdfReport portfolioState={portfolioState} onClose={() => setShowPdfReport(false)} />}

      {/* Generative Canvas Top Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-black/40 border-b border-white/10 backdrop-blur-xl flex-shrink-0 z-10">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: LayoutGrid },
            { id: "technical", label: "Technical Charts", icon: Activity },
            { id: "rebalance_interactive", label: "Live Rebalancer", icon: Sliders },
            { id: "performance", label: "Performance", icon: TrendingUp },
            { id: "allocations", label: "Allocations & Returns", icon: PieChart },
            { id: "multiagent", label: "Multi-Agent Intel", icon: Bot },
            { id: "risk", label: "Quant Risk", icon: ShieldCheck },
            { id: "hedging", label: "Hedging & Options", icon: ShieldAlert },
            { id: "rebalance", label: "Auto Orders & Dividends", icon: Scale },
            { id: "insights", label: "Market Insights", icon: Sparkles },
            { id: "simulator", label: "What-If Simulator", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-[#f5f5f7] border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                    : "text-[#a1a1aa] hover:text-[#f5f5f7] hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={14} className={isActive ? "text-purple-400" : "text-[#a1a1aa]"} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Action Buttons: Telemetry Badge, Export PDF, Share Link, Export JSON */}
        <div className="flex items-center gap-2">
          {/* Performance & Cache Telemetry Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border transition-all ${
              portfolioState.performanceTelemetry?.cache_hit
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.2)]"
                : "bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.2)]"
            }`}
            title={`Source: ${portfolioState.performanceTelemetry?.data_source || "Memory Cache"}`}
          >
            <Zap size={12} className={portfolioState.performanceTelemetry?.cache_hit ? "text-emerald-400" : "text-purple-400"} />
            <span>{portfolioState.performanceTelemetry?.execution_time_ms ?? 12}ms</span>
            <span className="opacity-70">
              ({portfolioState.performanceTelemetry?.cache_hit ? "Cache Hit" : "Network"})
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyShareLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              copiedLink
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-white/5 hover:bg-white/10 border-white/10 text-[#a1a1aa] hover:text-[#f5f5f7]"
            }`}
          >
            {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Link size={13} />}
            {copiedLink ? "Link Copied!" : "Share Link"}
          </button>

          <button
            type="button"
            onClick={() => setShowPdfReport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/30 to-indigo-500/30 hover:from-purple-500/40 hover:to-indigo-500/40 border border-purple-500/40 text-xs font-semibold text-purple-200 transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]"
          >
            <FileText size={13} />
            Export PDF
          </button>

          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#a1a1aa] hover:text-[#f5f5f7] transition-all"
          >
            <Download size={13} />
            JSON
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-auto p-4 space-y-4 max-w-none">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
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
                    data={(portfolioState?.performanceData || []).map((d) => ({
                      ...d,
                      portfolio: d.portfolio ?? 0,
                      spy: d.spy,
                    }))}
                  />
                )}
              </div>
            </div>

            {/* Risk Metrics Quick Overview */}
            <RiskMetricsCard metrics={portfolioState?.riskMetrics} />

            {/* Asset Class Breakdown Distribution */}
            <AssetClassDistribution distribution={portfolioState?.assetClassDistribution} />

            {/* Allocation and Returns Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionTitle title="Allocation" />
                <div className="mt-3">
                  <AllocationTableComponent
                    onSelectTicker={setSelectedStock}
                    allocations={(portfolioState?.allocations || []).map((a) => ({
                      ...a,
                      allocation: Number(a.allocation),
                    }))}
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

            {/* Insights Summary */}
            <div>
              <SectionTitle title="Market Insights" />
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === "performance" && (
          <div>
            <SectionTitle title="Historical Performance & Index Benchmarking" />
            <div className="mt-3">
              <LineChartComponent
                data={(portfolioState?.performanceData || []).map((d) => ({
                  ...d,
                  portfolio: d.portfolio ?? 0,
                  spy: d.spy,
                }))}
              />
            </div>
          </div>
        )}

        {/* ALLOCATIONS TAB */}
        {activeTab === "allocations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SectionTitle title="Holdings Allocation Breakdown" />
              <div className="mt-3">
                <AllocationTableComponent
                  onSelectTicker={setSelectedStock}
                  allocations={(portfolioState?.allocations || []).map((a) => ({
                    ...a,
                    allocation: Number(a.allocation),
                  }))}
                />
              </div>
            </div>

            <div>
              <SectionTitle title="Individual Asset Returns" />
              <div className="mt-3">
                <BarChartComponent data={portfolioState?.returnsData || []} onClick={setSelectedStock} />
              </div>
            </div>
          </div>
        )}

        {/* TECHNICAL CANDLESTICK & INDICATORS TAB */}
        {activeTab === "technical" && (
          <TradingViewChart
            tickers={activeTickers}
            currentPrices={
              portfolioState.allocations?.reduce((acc: any, curr) => {
                acc[curr.ticker] = curr.currentValue / Math.max(1, Math.round(curr.currentValue / 180))
                return acc
              }, {}) || {}
            }
          />
        )}

        {/* INTERACTIVE DRAG-AND-DROP REBALANCER TAB */}
        {activeTab === "rebalance_interactive" && (
          <InteractiveRebalancer
            allocations={portfolioState.allocations || []}
            totalPortfolioValue={portfolioState.currentPortfolioValue || 100000}
            availableCash={portfolioState.investmentAmount || 10000}
            onApplyRebalance={onApplyRebalance}
          />
        )}

        {/* MULTI-AGENT INTELLIGENCE TAB */}
        {activeTab === "multiagent" && (
          <MultiAgentInsights data={portfolioState?.multiAgentCrew} />
        )}

        {/* QUANT & RISK ANALYTICS TAB */}
        {activeTab === "risk" && (
          <div className="space-y-4">
            {/* Quant Sub-View Switcher Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
              {[
                { id: "frontier", label: "Efficient Frontier", icon: Activity, color: "text-purple-400" },
                { id: "black_litterman", label: "Black-Litterman", icon: Scale, color: "text-blue-400" },
                { id: "crisis", label: "Crisis Stress Test", icon: Zap, color: "text-rose-400" },
                { id: "fama_french", label: "Fama-French 5-Factor", icon: LayoutGrid, color: "text-cyan-400" },
                { id: "risk_var", label: "VaR & Correlation Grid", icon: ShieldCheck, color: "text-emerald-400" },
              ].map((sub) => {
                const Icon = sub.icon
                const isActive = quantSubTab === sub.id
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setQuantSubTab(sub.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-[#f5f5f7] border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                        : "text-[#a1a1aa] hover:text-[#f5f5f7] hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon size={14} className={isActive ? sub.color : "text-[#a1a1aa]"} />
                    <span>{sub.label}</span>
                  </button>
                )
              })}
            </div>

            {/* 1. Markowitz Efficient Frontier */}
            {quantSubTab === "frontier" && (
              <EfficientFrontierChart data={portfolioState?.quantModels?.efficient_frontier} />
            )}

            {/* 2. Black-Litterman Model */}
            {quantSubTab === "black_litterman" && (
              <BlackLittermanCard data={portfolioState?.quantModels?.black_litterman} />
            )}

            {/* 3. Crisis Stress Test & VaR */}
            {quantSubTab === "crisis" && (
              <CrisisStressTest data={portfolioState?.quantModels?.crisis_stress_test} />
            )}

            {/* 4. Fama-French 5-Factor Decomposition */}
            {quantSubTab === "fama_french" && (
              <FamaFrenchFactors data={portfolioState?.quantModels?.fama_french} />
            )}

            {/* 5. Core VaR, Correlation Heatmap & Monte Carlo */}
            {quantSubTab === "risk_var" && (
              <div className="space-y-4">
                <RiskMetricsCard metrics={portfolioState?.riskMetrics} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CorrelationHeatmap data={portfolioState?.correlationMatrix} />
                  <MonteCarloChart data={portfolioState?.monteCarlo} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* HEDGING & OPTIONS TAB */}
        {activeTab === "hedging" && (
          <OptionsHedgingCard data={portfolioState?.optionsHedging} />
        )}

        {/* REBALANCE & DIVIDENDS TAB */}
        {activeTab === "rebalance" && (
          <div className="space-y-4">
            <RebalancingTable orders={portfolioState?.rebalancingOrders} />
            <DividendAnalytics data={portfolioState?.dividendAnalytics} />
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === "insights" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 border-emerald-500/20 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🐂</span>
                <h3 className="text-base font-bold text-emerald-400 font-['Roobert']">BULLISH CATALYSTS</h3>
              </div>
              <div className="space-y-3">
                {portfolioState.bullInsights.map((insight, index) => (
                  <InsightCardComponent key={`bull-tab-${index}`} insight={insight} type="bull" />
                ))}
              </div>
            </div>

            <div className="glass-panel p-5 border-rose-500/20 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🐻</span>
                <h3 className="text-base font-bold text-rose-400 font-['Roobert']">BEARISH RISKS</h3>
              </div>
              <div className="space-y-3">
                {portfolioState.bearInsights.map((insight, index) => (
                  <InsightCardComponent key={`bear-tab-${index}`} insight={insight} type="bear" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WHAT-IF SIMULATOR TAB */}
        {activeTab === "simulator" && <ScenarioSimulator portfolioState={portfolioState} />}
      </div>
    </div>
  )
}
