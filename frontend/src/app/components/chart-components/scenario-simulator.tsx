"use client"

import { useState } from "react"
import { Sliders, RotateCcw, TrendingUp, TrendingDown } from "lucide-react"
import { ResponsiveContainer, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import type { PortfolioState } from "@/app/page"

interface ScenarioSimulatorProps {
  portfolioState: PortfolioState
}

export function ScenarioSimulator({ portfolioState }: ScenarioSimulatorProps) {
  const [marketShift, setMarketShift] = useState(0) // -50% to +50%
  const [volatilityMultiplier, setVolatilityMultiplier] = useState(1.0) // 0.5x to 2.0x
  const [interestRateImpact, setInterestRateImpact] = useState(0) // -15% to +15%

  const basePerformance = portfolioState?.performanceData || []
  const baselineValue = portfolioState?.currentPortfolioValue || 1000000

  // Calculate stressed performance dataset
  const stressedPerformance = basePerformance.map((point) => {
    const totalShiftMultiplier = 1 + (marketShift + interestRateImpact) / 100
    const baselineChange = point.portfolio - (basePerformance[0]?.portfolio || point.portfolio)
    const stressedPortfolio = (basePerformance[0]?.portfolio || point.portfolio) + baselineChange * volatilityMultiplier * totalShiftMultiplier

    return {
      date: point.date,
      baseline: point.portfolio,
      stressed: Math.max(0, Math.round(stressedPortfolio)),
      spy: point.spy,
    }
  })

  // Final stressed portfolio value estimation
  const stressedValue = Math.round(baselineValue * (1 + (marketShift + interestRateImpact) / 100 * volatilityMultiplier))
  const dollarDiff = stressedValue - baselineValue
  const percentDiff = baselineValue > 0 ? (dollarDiff / baselineValue) * 100 : 0

  const handleReset = () => {
    setMarketShift(0)
    setVolatilityMultiplier(1.0)
    setInterestRateImpact(0)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="bg-[#FFFFFF] p-5 space-y-6 border border-[#E2E6EF] rounded-2xl shadow-xs text-[#101828]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2E6EF] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3730E0]/10 border border-[#3730E0]/30 flex items-center justify-center text-[#3730E0]">
            <Sliders size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#101828] font-['Roobert'] tracking-wide">
              What-If Market Stress Simulator
            </h2>
            <p className="text-xs text-[#6B7A99] mt-0.5">
              Simulate macroeconomic shifts, interest rate changes, and volatility stress tests on your portfolio
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3F4F8] border border-[#E2E6EF] hover:bg-[#E2E6EF] text-xs font-semibold text-[#101828] transition-all cursor-pointer"
        >
          <RotateCcw size={14} className="text-[#6B7A99]" />
          Reset Sliders
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slider 1: Broad Market Shift */}
        <div className="p-4 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#101828]">Market Shift</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                marketShift > 0
                  ? "bg-[#E8F5EE] text-[#1E8E5A] border border-[#1E8E5A]/30"
                  : marketShift < 0
                  ? "bg-[#FCEBEB] text-[#D64545] border border-[#D64545]/30"
                  : "bg-[#FFFFFF] text-[#6B7A99] border border-[#E2E6EF]"
              }`}
            >
              {marketShift > 0 ? `+${marketShift}%` : `${marketShift}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={marketShift}
            onChange={(e) => setMarketShift(Number(e.target.value))}
            className="w-full accent-[#3730E0] cursor-pointer h-1.5 bg-[#E2E6EF] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#6B7A99]">
            <span>-50% (Crash)</span>
            <span>0% (Neutral)</span>
            <span>+50% (Rally)</span>
          </div>
        </div>

        {/* Slider 2: Volatility Multiplier */}
        <div className="p-4 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#101828]">Volatility Multiplier</span>
            <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-[#3730E0]/10 text-[#3730E0] border border-[#3730E0]/30">
              {volatilityMultiplier.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={volatilityMultiplier}
            onChange={(e) => setVolatilityMultiplier(Number(e.target.value))}
            className="w-full accent-[#3730E0] cursor-pointer h-1.5 bg-[#E2E6EF] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#6B7A99]">
            <span>0.5x (Muted)</span>
            <span>1.0x (Standard)</span>
            <span>2.0x (High Vol)</span>
          </div>
        </div>

        {/* Slider 3: Interest Rate / Inflation Impact */}
        <div className="p-4 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#101828]">Rate / Inflation Shift</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                interestRateImpact > 0
                  ? "bg-[#E8F5EE] text-[#1E8E5A] border border-[#1E8E5A]/30"
                  : interestRateImpact < 0
                  ? "bg-[#FCEBEB] text-[#D64545] border border-[#D64545]/30"
                  : "bg-[#FFFFFF] text-[#6B7A99] border border-[#E2E6EF]"
              }`}
            >
              {interestRateImpact > 0 ? `+${interestRateImpact}%` : `${interestRateImpact}%`}
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={interestRateImpact}
            onChange={(e) => setInterestRateImpact(Number(e.target.value))}
            className="w-full accent-[#3730E0] cursor-pointer h-1.5 bg-[#E2E6EF] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#6B7A99]">
            <span>-15% (Tightening)</span>
            <span>0% (Base)</span>
            <span>+15% (Easing)</span>
          </div>
        </div>
      </div>

      {/* Stress Results Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF]">
          <div className="text-[11px] text-[#6B7A99] font-medium uppercase tracking-wider">Baseline Portfolio</div>
          <div className="text-lg font-bold text-[#101828] font-['Roobert'] mt-1">
            {formatCurrency(baselineValue)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF]">
          <div className="text-[11px] text-[#6B7A99] font-medium uppercase tracking-wider">Stressed Portfolio</div>
          <div className="text-lg font-bold text-[#101828] font-['Roobert'] mt-1">
            {formatCurrency(stressedValue)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F3F4F8] border border-[#E2E6EF]">
          <div className="text-[11px] text-[#6B7A99] font-medium uppercase tracking-wider">Simulated Delta</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`text-lg font-bold font-['Roobert'] flex items-center gap-1 ${
                dollarDiff >= 0 ? "text-[#1E8E5A]" : "text-[#D64545]"
              }`}
            >
              {dollarDiff >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {dollarDiff >= 0 ? "+" : ""}
              {formatCurrency(dollarDiff)}
            </span>
            <span className={`text-xs font-semibold ${dollarDiff >= 0 ? "text-[#1E8E5A]" : "text-[#D64545]"}`}>
              ({percentDiff >= 0 ? "+" : ""}
              {percentDiff.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#6B7A99] px-1">
          <span className="font-semibold text-[#101828]">Baseline vs Stressed Simulation Trajectory</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B7A99]" /> Baseline
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#3730E0] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3730E0]" /> Stressed Scenario
            </span>
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stressedPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EF" />
              <XAxis dataKey="date" stroke="#6B7A99" fontSize={10} fontFamily="Plus Jakarta Sans" />
              <YAxis
                stroke="#6B7A99"
                fontSize={10}
                fontFamily="Plus Jakarta Sans"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E6EF",
                  borderRadius: "12px",
                  color: "#101828",
                  fontSize: "11px",
                }}
              />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#6B7A99"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                name="Baseline"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="stressed"
                stroke="#3730E0"
                strokeWidth={2.5}
                name="Stressed Scenario"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
