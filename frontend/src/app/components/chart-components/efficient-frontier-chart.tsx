"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  TrendingUp,
  Award,
  Shield,
  Activity,
  Sparkles,
  Info,
  Layers,
} from "lucide-react"

export interface EfficientFrontierData {
  simulated_portfolios: Array<{
    volatility: number
    return: number
    sharpe: number
  }>
  max_sharpe_portfolio: {
    volatility: number
    return: number
    sharpe: number
    weights: Record<string, number>
  }
  min_volatility_portfolio: {
    volatility: number
    return: number
    sharpe: number
    weights: Record<string, number>
  }
  current_portfolio: {
    volatility: number
    return: number
    sharpe: number
    weights: Record<string, number>
  }
  risk_free_rate: number
}

interface EfficientFrontierChartProps {
  data?: EfficientFrontierData
}

const DEFAULT_EF_DATA: EfficientFrontierData = {
  simulated_portfolios: [
    { volatility: 13.5, return: 16.2, sharpe: 0.87 },
    { volatility: 14.8, return: 19.5, sharpe: 1.01 },
    { volatility: 16.2, return: 23.4, sharpe: 1.17 },
    { volatility: 18.0, return: 27.8, sharpe: 1.29 },
    { volatility: 20.5, return: 32.1, sharpe: 1.35 },
    { volatility: 23.0, return: 35.8, sharpe: 1.36 },
    { volatility: 26.5, return: 38.9, sharpe: 1.30 },
    { volatility: 30.0, return: 41.2, sharpe: 1.22 },
  ],
  max_sharpe_portfolio: {
    volatility: 22.4,
    return: 35.2,
    sharpe: 1.37,
    weights: { NVDA: 0.35, MSFT: 0.35, AAPL: 0.30 },
  },
  min_volatility_portfolio: {
    volatility: 13.2,
    return: 15.8,
    sharpe: 0.86,
    weights: { AAPL: 0.50, MSFT: 0.35, NVDA: 0.15 },
  },
  current_portfolio: {
    volatility: 19.8,
    return: 29.4,
    sharpe: 1.26,
    weights: { NVDA: 0.40, AAPL: 0.35, MSFT: 0.25 },
  },
  risk_free_rate: 0.045,
}

export function EfficientFrontierChart({ data = DEFAULT_EF_DATA }: EfficientFrontierChartProps) {
  const { theme } = useTheme()
  const ef = data || DEFAULT_EF_DATA

  const [hoveredPoint, setHoveredPoint] = useState<{
    volatility: number
    return: number
    sharpe: number
    label?: string
  } | null>(null)

  // Generate 80 smooth points for realistic scatter cloud
  const scatterPoints = React.useMemo(() => {
    if (ef.simulated_portfolios.length >= 20) return ef.simulated_portfolios

    const pts = [...ef.simulated_portfolios]
    for (let i = 0; i < 70; i++) {
      const vol = 12 + Math.random() * 22
      // Hyperbolic return curve
      const baseRet = 8 + Math.sqrt(vol - 11) * 7.5
      const ret = baseRet + (Math.random() - 0.5) * 6
      const sharpe = +((ret - 4.5) / vol).toFixed(2)
      pts.push({ volatility: +vol.toFixed(1), return: +ret.toFixed(1), sharpe })
    }
    return pts
  }, [ef])

  // Coordinate scales
  const minVol = 10
  const maxVol = 36
  const minRet = 5
  const maxRet = 45

  const width = 600
  const height = 280

  const getX = (vol: number) => ((vol - minVol) / (maxVol - minVol)) * (width - 60) + 40
  const getY = (ret: number) => height - ((ret - minRet) / (maxRet - minRet)) * (height - 40) - 20

  const maxSharpeCoord = {
    x: getX(ef.max_sharpe_portfolio.volatility),
    y: getY(ef.max_sharpe_portfolio.return),
  }
  const minVolCoord = {
    x: getX(ef.min_volatility_portfolio.volatility),
    y: getY(ef.min_volatility_portfolio.return),
  }
  const currentCoord = {
    x: getX(ef.current_portfolio.volatility),
    y: getY(ef.current_portfolio.return),
  }

  // Capital Allocation Line (CAL) from (0, Risk-Free Rate) tangent through Max Sharpe
  const rfCoord = { x: getX(minVol), y: getY(ef.risk_free_rate * 100) }

  return (
    <div
      className={`w-full rounded-2xl border p-5 backdrop-blur-xl transition-colors ${
        theme === "bloomberg"
          ? "bg-[#080808] border-[#442a00] text-[#ff9900]"
          : theme === "light"
          ? "bg-white/90 border-slate-200 text-slate-900 shadow-lg"
          : "bg-white/5 border-white/10 text-[#f5f5f7] shadow-2xl"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Markowitz Modern Portfolio Theory & Efficient Frontier</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Mean-Variance Optimization
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Optimal risk-return combinations, Maximum Sharpe ratio tangency, and Minimum Volatility bounds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Max Sharpe (⭐ {ef.max_sharpe_portfolio.sharpe})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Min Vol (🛡️ {ef.min_volatility_portfolio.volatility}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>Current (📍 {ef.current_portfolio.sharpe})</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Surface */}
      <div className="relative w-full overflow-x-auto hide-scrollbar select-none mb-5">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-h-[280px]">
          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
            const y = height * ratio
            const ret = maxRet - ratio * (maxRet - minRet)
            return (
              <g key={`y-grid-${idx}`}>
                <line x1="40" y1={y} x2={width} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x="35" y={y + 3} textAnchor="end" fill="#6b7280" fontSize="9" fontFamily="monospace">
                  {ret.toFixed(0)}%
                </text>
              </g>
            )
          })}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
            const x = 40 + ratio * (width - 60)
            const vol = minVol + ratio * (maxVol - minVol)
            return (
              <g key={`x-grid-${idx}`}>
                <line x1={x} y1="0" x2={x} y2={height - 20} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={x} y={height - 6} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">
                  {vol.toFixed(0)}%
                </text>
              </g>
            )
          })}

          {/* Capital Allocation Line (CAL) */}
          <line
            x1={rfCoord.x}
            y1={rfCoord.y}
            x2={width}
            y2={getY(ef.max_sharpe_portfolio.return * 1.35)}
            stroke="#a855f7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />

          {/* Monte Carlo Simulated Portfolios Scatter Dots */}
          {scatterPoints.map((pt, idx) => {
            const x = getX(pt.volatility)
            const y = getY(pt.return)
            const isHighSharpe = pt.sharpe > 1.25
            return (
              <circle
                key={`pt-${idx}`}
                cx={x}
                cy={y}
                r={isHighSharpe ? 3 : 2}
                fill={isHighSharpe ? "#a855f7" : "rgba(168, 85, 247, 0.35)"}
                className="cursor-pointer hover:r-4 transition-all"
                onMouseEnter={() => setHoveredPoint(pt)}
              />
            )
          })}

          {/* Max Sharpe Ratio Star Point */}
          <g
            className="cursor-pointer"
            onMouseEnter={() =>
              setHoveredPoint({
                ...ef.max_sharpe_portfolio,
                label: "Max Sharpe Ratio Optimal Tangency",
              })
            }
          >
            <circle cx={maxSharpeCoord.x} cy={maxSharpeCoord.y} r="10" fill="rgba(16, 185, 129, 0.3)" />
            <circle cx={maxSharpeCoord.x} cy={maxSharpeCoord.y} r="5" fill="#10b981" />
            <text
              x={maxSharpeCoord.x + 8}
              y={maxSharpeCoord.y - 6}
              fill="#10b981"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ⭐ Max Sharpe ({ef.max_sharpe_portfolio.sharpe})
            </text>
          </g>

          {/* Min Volatility Point */}
          <g
            className="cursor-pointer"
            onMouseEnter={() =>
              setHoveredPoint({
                ...ef.min_volatility_portfolio,
                label: "Global Minimum Volatility Boundary",
              })
            }
          >
            <circle cx={minVolCoord.x} cy={minVolCoord.y} r="8" fill="rgba(6, 182, 212, 0.3)" />
            <circle cx={minVolCoord.x} cy={minVolCoord.y} r="4" fill="#06b6d4" />
            <text
              x={minVolCoord.x + 8}
              y={minVolCoord.y + 12}
              fill="#06b6d4"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              🛡️ Min Vol ({ef.min_volatility_portfolio.volatility}%)
            </text>
          </g>

          {/* Current Portfolio Point */}
          <g
            className="cursor-pointer"
            onMouseEnter={() =>
              setHoveredPoint({
                ...ef.current_portfolio,
                label: "Current User Portfolio Allocation",
              })
            }
          >
            <circle cx={currentCoord.x} cy={currentCoord.y} r="9" fill="rgba(244, 63, 94, 0.3)" />
            <circle cx={currentCoord.x} cy={currentCoord.y} r="5" fill="#f43f5e" />
            <text
              x={currentCoord.x + 8}
              y={currentCoord.y - 6}
              fill="#f43f5e"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              📍 Current Portfolio
            </text>
          </g>
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 p-2.5 rounded-xl bg-black/90 border border-purple-500/40 text-xs font-mono z-20 shadow-2xl backdrop-blur-xl animate-in fade-in">
            {hoveredPoint.label && (
              <div className="text-[10px] text-purple-300 font-bold uppercase mb-1">{hoveredPoint.label}</div>
            )}
            <div className="flex items-center gap-3">
              <span>
                Exp Return: <strong className="text-emerald-400">{hoveredPoint.return}%</strong>
              </span>
              <span>
                Volatility: <strong className="text-amber-400">{hoveredPoint.volatility}%</strong>
              </span>
              <span>
                Sharpe: <strong className="text-purple-300">{hoveredPoint.sharpe}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Optimal Weights Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        {/* Max Sharpe Allocation Card */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <Award size={14} /> Max Sharpe Allocation
            </span>
            <span className="text-[11px] text-[#a1a1aa]">Sharpe: {ef.max_sharpe_portfolio.sharpe}</span>
          </div>
          <div className="space-y-1.5 pt-1">
            {Object.entries(ef.max_sharpe_portfolio.weights).map(([ticker, w]) => (
              <div key={ticker} className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#f5f5f7]">{ticker}</span>
                <span className="text-emerald-300 font-extrabold">{(w * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Min Volatility Allocation Card */}
        <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-cyan-400 flex items-center gap-1">
              <Shield size={14} /> Min Volatility Allocation
            </span>
            <span className="text-[11px] text-[#a1a1aa]">Vol: {ef.min_volatility_portfolio.volatility}%</span>
          </div>
          <div className="space-y-1.5 pt-1">
            {Object.entries(ef.min_volatility_portfolio.weights).map(([ticker, w]) => (
              <div key={ticker} className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#f5f5f7]">{ticker}</span>
                <span className="text-cyan-300 font-extrabold">{(w * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Weights vs Frontier */}
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <Activity size={14} /> Current Positioning
            </span>
            <span className="text-[11px] text-[#a1a1aa]">Sharpe: {ef.current_portfolio.sharpe}</span>
          </div>
          <div className="space-y-1.5 pt-1">
            {Object.entries(ef.current_portfolio.weights).map(([ticker, w]) => (
              <div key={ticker} className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#f5f5f7]">{ticker}</span>
                <span className="text-rose-300 font-extrabold">{(w * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
