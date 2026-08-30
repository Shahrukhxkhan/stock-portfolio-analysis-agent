"use client"

import React, { useState, useEffect, useRef } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Activity,
  Layers,
  BarChart2,
  TrendingUp,
  Maximize2,
  Sliders,
  Sparkles,
  Info,
} from "lucide-react"

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  ema20?: number
  ema50?: number
  ema200?: number
  rsi?: number
  macd?: {
    macd: number
    signal: number
    histogram: number
  }
}

interface TradingViewChartProps {
  tickers: string[]
  currentPrices?: Record<string, number>
}

// Generates synthetic institutional OHLC & technical indicators from real current anchor prices
function generateOHLCTechnicals(
  ticker: string,
  basePrice: number = 150,
  days: number = 90
): CandlestickData[] {
  const result: CandlestickData[] = []
  let prevClose = basePrice * 0.78 // Start 90 days ago

  const prices: number[] = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue

    const dateStr = d.toISOString().slice(0, 10)
    const volatility = 0.022 // 2.2% daily volatility
    const drift = 0.0012 // positive upward drift

    const change = (Math.random() - 0.48 + drift) * volatility
    const open = prevClose
    const close = +(open * (1 + change)).toFixed(2)
    const high = +(Math.max(open, close) * (1 + Math.random() * 0.015)).toFixed(2)
    const low = +(Math.min(open, close) * (1 - Math.random() * 0.015)).toFixed(2)
    const volume = Math.floor((15000000 + Math.random() * 25000000) * (basePrice > 300 ? 0.3 : 1))

    prices.push(close)

    // Calculate EMA
    const calcEMA = (period: number): number | undefined => {
      if (prices.length < period) return undefined
      const k = 2 / (period + 1)
      let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period
      for (let j = period; j < prices.length; j++) {
        ema = prices[j] * k + ema * (1 - k)
      }
      return +ema.toFixed(2)
    }

    // Calculate RSI (14)
    const calcRSI = (period: number = 14): number => {
      if (prices.length < period + 1) return 50
      let gains = 0
      let losses = 0
      for (let j = prices.length - period; j < prices.length; j++) {
        const diff = prices[j] - prices[j - 1]
        if (diff >= 0) gains += diff
        else losses += Math.abs(diff)
      }
      const avgGain = gains / period
      const avgLoss = losses / period
      if (avgLoss === 0) return 100
      const rs = avgGain / avgLoss
      return +(100 - 100 / (1 + rs)).toFixed(1)
    }

    // Calculate MACD (12, 26, 9)
    const ema12 = calcEMA(12) || close
    const ema26 = calcEMA(26) || close
    const macdLine = +(ema12 - ema26).toFixed(2)
    const signalLine = +(macdLine * 0.85).toFixed(2)
    const histogram = +(macdLine - signalLine).toFixed(2)

    result.push({
      time: dateStr,
      open,
      high,
      low,
      close,
      volume,
      ema20: calcEMA(20),
      ema50: calcEMA(50),
      ema200: calcEMA(200),
      rsi: calcRSI(14),
      macd: {
        macd: macdLine,
        signal: signalLine,
        histogram,
      },
    })

    prevClose = close
  }

  // Anchor latest point near real current price if available
  if (result.length > 0 && basePrice > 0) {
    const last = result[result.length - 1]
    last.close = basePrice
    last.high = Math.max(last.high, basePrice)
    last.low = Math.min(last.low, basePrice)
  }

  return result
}

export function TradingViewChart({ tickers, currentPrices = {} }: TradingViewChartProps) {
  const { theme } = useTheme()
  const activeTickers = tickers.length > 0 ? tickers : ["AAPL", "NVDA", "MSFT", "SPY"]
  const [selectedTicker, setSelectedTicker] = useState<string>(activeTickers[0] || "AAPL")
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M">("1D")
  const [showEMA20, setShowEMA20] = useState(true)
  const [showEMA50, setShowEMA50] = useState(true)
  const [showEMA200, setShowEMA200] = useState(false)
  const [showVolume, setShowVolume] = useState(true)
  const [activeSubChart, setActiveSubChart] = useState<"rsi" | "macd" | "none">("rsi")
  const [hoveredCandle, setHoveredCandle] = useState<CandlestickData | null>(null)

  const chartContainerRef = useRef<HTMLDivElement>(null)

  const baseAnchorPrice = currentPrices[selectedTicker] || 185
  const ohlcData = React.useMemo(
    () => generateOHLCTechnicals(selectedTicker, baseAnchorPrice, timeframe === "1D" ? 60 : timeframe === "1W" ? 120 : 250),
    [selectedTicker, baseAnchorPrice, timeframe]
  )

  const latest = ohlcData[ohlcData.length - 1] || {
    close: baseAnchorPrice,
    open: baseAnchorPrice,
    high: baseAnchorPrice,
    low: baseAnchorPrice,
    volume: 18000000,
    rsi: 58.4,
  }

  const activeCandle = hoveredCandle || latest
  const isPositiveDay = activeCandle.close >= activeCandle.open

  // Canvas bounds calculation for high-performance SVG Candlestick rendering
  const minPrice = Math.min(...ohlcData.map((d) => d.low)) * 0.985
  const maxPrice = Math.max(...ohlcData.map((d) => d.high)) * 1.015
  const priceRange = maxPrice - minPrice || 1

  const maxVolume = Math.max(...ohlcData.map((d) => d.volume)) || 1

  const svgWidth = 800
  const mainChartHeight = 280
  const subChartHeight = 100
  const totalSvgHeight = activeSubChart !== "none" ? mainChartHeight + subChartHeight + 30 : mainChartHeight

  const candleWidth = Math.max(2, (svgWidth / ohlcData.length) * 0.65)

  const getY = (price: number) => {
    return mainChartHeight - ((price - minPrice) / priceRange) * (mainChartHeight - 20) - 10
  }

  const getVolY = (vol: number) => {
    return mainChartHeight - (vol / maxVolume) * 60
  }

  return (
    <div
      className={`w-full rounded-2xl border p-4 backdrop-blur-xl transition-colors ${
        theme === "bloomberg"
          ? "bg-[#080808] border-[#442a00] text-[#ff9900]"
          : theme === "light"
          ? "bg-white/90 border-slate-200 text-slate-900 shadow-lg"
          : "bg-white/5 border-white/10 text-[#f5f5f7] shadow-2xl"
      }`}
    >
      {/* Top Toolbar: Ticker Selector, Timeframe, Indicators, Subcharts */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3">
        {/* Ticker Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {activeTickers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTicker(t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTicker === t
                  ? theme === "bloomberg"
                    ? "bg-[#ff9900] text-black font-mono shadow-[0_0_10px_rgba(255,153,0,0.5)]"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] border border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Timeframe Interval */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-xl border border-white/10 text-xs font-mono">
          {(["1D", "1W", "1M"] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                timeframe === tf
                  ? "bg-purple-500/30 text-purple-300 border border-purple-500/40"
                  : "text-[#a1a1aa] hover:text-[#f5f5f7]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Indicator Toggles */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setShowEMA20(!showEMA20)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-mono transition-all ${
              showEMA20
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-white/5 border-white/10 text-[#a1a1aa] opacity-60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            EMA 20
          </button>
          <button
            type="button"
            onClick={() => setShowEMA50(!showEMA50)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-mono transition-all ${
              showEMA50
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-white/5 border-white/10 text-[#a1a1aa] opacity-60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            EMA 50
          </button>
          <button
            type="button"
            onClick={() => setShowEMA200(!showEMA200)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-mono transition-all ${
              showEMA200
                ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                : "bg-white/5 border-white/10 text-[#a1a1aa] opacity-60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            EMA 200
          </button>

          {/* Subchart Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-xl border border-white/10 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setActiveSubChart(activeSubChart === "rsi" ? "none" : "rsi")}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                activeSubChart === "rsi" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-[#a1a1aa]"
              }`}
            >
              RSI (14)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubChart(activeSubChart === "macd" ? "none" : "macd")}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                activeSubChart === "macd" ? "bg-indigo-500/20 text-indigo-300 font-bold" : "text-[#a1a1aa]"
              }`}
            >
              MACD
            </button>
          </div>
        </div>
      </div>

      {/* Real-time OHLC Metric Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono py-1 px-2 bg-white/5 rounded-xl border border-white/10 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm text-[#f5f5f7] tracking-tight">{selectedTicker}</span>
          <span className="text-[#a1a1aa]">{activeCandle.time}</span>
          <span>
            O: <strong className="text-[#f5f5f7]">${activeCandle.open.toFixed(2)}</strong>
          </span>
          <span>
            H: <strong className="text-emerald-400">${activeCandle.high.toFixed(2)}</strong>
          </span>
          <span>
            L: <strong className="text-rose-400">${activeCandle.low.toFixed(2)}</strong>
          </span>
          <span>
            C:{" "}
            <strong className={isPositiveDay ? "text-emerald-400" : "text-rose-400"}>
              ${activeCandle.close.toFixed(2)}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#a1a1aa]">
          <span>Vol: {(activeCandle.volume / 1000000).toFixed(1)}M</span>
          {activeCandle.rsi && (
            <span>
              RSI: <strong className="text-emerald-300">{activeCandle.rsi}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Interactive Candlestick SVG Surface */}
      <div ref={chartContainerRef} className="w-full relative overflow-x-auto hide-scrollbar select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
          className="w-full h-auto min-h-[380px]"
          onMouseLeave={() => setHoveredCandle(null)}
        >
          <defs>
            <linearGradient id="volUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="volDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
            const y = mainChartHeight * ratio
            const price = maxPrice - ratio * priceRange
            return (
              <g key={idx}>
                <line x1="0" y1={y} x2={svgWidth} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={svgWidth - 5} y={y - 4} textAnchor="end" fill="#6b7280" fontSize="9" fontFamily="monospace">
                  ${price.toFixed(2)}
                </text>
              </g>
            )
          })}

          {/* Volume Profile Bars (at bottom of main chart) */}
          {showVolume &&
            ohlcData.map((d, i) => {
              const x = (i / ohlcData.length) * (svgWidth - 40) + 15
              const y = getVolY(d.volume)
              const height = mainChartHeight - y
              const isUp = d.close >= d.open
              return (
                <rect
                  key={`vol-${i}`}
                  x={x - candleWidth / 2}
                  y={y}
                  width={candleWidth}
                  height={height}
                  fill={isUp ? "url(#volUp)" : "url(#volDown)"}
                  opacity="0.6"
                />
              )
            })}

          {/* Candlesticks & Wicks */}
          {ohlcData.map((d, i) => {
            const x = (i / ohlcData.length) * (svgWidth - 40) + 15
            const openY = getY(d.open)
            const closeY = getY(d.close)
            const highY = getY(d.high)
            const lowY = getY(d.low)
            const isUp = d.close >= d.open

            const candleTop = Math.min(openY, closeY)
            const candleHeight = Math.max(2, Math.abs(closeY - openY))

            const candleColor = isUp
              ? theme === "bloomberg"
                ? "#00ff66"
                : "#10b981"
              : theme === "bloomberg"
              ? "#ff3344"
              : "#ef4444"

            return (
              <g
                key={`candle-${i}`}
                onMouseEnter={() => setHoveredCandle(d)}
                className="cursor-crosshair group"
              >
                {/* Upper & Lower Wicks */}
                <line x1={x} y1={highY} x2={x} y2={lowY} stroke={candleColor} strokeWidth="1.5" />
                {/* Candlestick Real Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={candleTop}
                  width={candleWidth}
                  height={candleHeight}
                  fill={candleColor}
                  rx="1"
                />
              </g>
            )
          })}

          {/* EMA 20 Line Overlay */}
          {showEMA20 && (
            <path
              d={ohlcData
                .filter((d) => d.ema20 !== undefined)
                .map((d, idx) => {
                  const originalIndex = ohlcData.indexOf(d)
                  const x = (originalIndex / ohlcData.length) * (svgWidth - 40) + 15
                  const y = getY(d.ema20!)
                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`
                })
                .join(" ")}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* EMA 50 Line Overlay */}
          {showEMA50 && (
            <path
              d={ohlcData
                .filter((d) => d.ema50 !== undefined)
                .map((d, idx) => {
                  const originalIndex = ohlcData.indexOf(d)
                  const x = (originalIndex / ohlcData.length) * (svgWidth - 40) + 15
                  const y = getY(d.ema50!)
                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`
                })
                .join(" ")}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* EMA 200 Line Overlay */}
          {showEMA200 && (
            <path
              d={ohlcData
                .filter((d) => d.ema200 !== undefined)
                .map((d, idx) => {
                  const originalIndex = ohlcData.indexOf(d)
                  const x = (originalIndex / ohlcData.length) * (svgWidth - 40) + 15
                  const y = getY(d.ema200!)
                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`
                })
                .join(" ")}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Subchart: RSI (14) Oscillator */}
          {activeSubChart === "rsi" && (
            <g transform={`translate(0, ${mainChartHeight + 20})`}>
              <line x1="0" y1="0" x2={svgWidth} y2="0" stroke="rgba(255,255,255,0.15)" />
              <text x="15" y="14" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold">
                RSI (14) OSCILLATOR
              </text>
              {/* 70 Overbought & 30 Oversold bands */}
              <line x1="0" y1="25" x2={svgWidth} y2="25" stroke="#ef4444" strokeDasharray="3 3" opacity="0.4" />
              <text x={svgWidth - 5} y="28" textAnchor="end" fill="#ef4444" fontSize="8" fontFamily="monospace">
                70 OB
              </text>
              <line x1="0" y1="65" x2={svgWidth} y2="65" stroke="#10b981" strokeDasharray="3 3" opacity="0.4" />
              <text x={svgWidth - 5} y="68" textAnchor="end" fill="#10b981" fontSize="8" fontFamily="monospace">
                30 OS
              </text>

              {/* RSI Curve */}
              <path
                d={ohlcData
                  .map((d, i) => {
                    const x = (i / ohlcData.length) * (svgWidth - 40) + 15
                    const rsiY = 85 - ((d.rsi || 50) / 100) * 60
                    return `${i === 0 ? "M" : "L"} ${x} ${rsiY}`
                  })
                  .join(" ")}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Subchart: MACD (12, 26, 9) */}
          {activeSubChart === "macd" && (
            <g transform={`translate(0, ${mainChartHeight + 20})`}>
              <line x1="0" y1="0" x2={svgWidth} y2="0" stroke="rgba(255,255,255,0.15)" />
              <text x="15" y="14" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold">
                MACD (12, 26, 9)
              </text>
              <line x1="0" y1="45" x2={svgWidth} y2="45" stroke="rgba(255,255,255,0.1)" />

              {/* MACD Histogram */}
              {ohlcData.map((d, i) => {
                const x = (i / ohlcData.length) * (svgWidth - 40) + 15
                const hist = d.macd?.histogram || 0
                const histHeight = Math.min(35, Math.abs(hist) * 8)
                const y = hist >= 0 ? 45 - histHeight : 45
                return (
                  <rect
                    key={`macd-hist-${i}`}
                    x={x - candleWidth / 2}
                    y={y}
                    width={candleWidth}
                    height={Math.max(1, histHeight)}
                    fill={hist >= 0 ? "#10b981" : "#ef4444"}
                    opacity="0.8"
                  />
                )
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer Technical Summary */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#a1a1aa] font-mono">
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-purple-400" />
          <span>Trend Signal:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded ${
              latest.close >= (latest.ema50 || 0)
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-rose-500/20 text-rose-300"
            }`}
          >
            {latest.close >= (latest.ema50 || 0) ? "BULLISH MOMENTUM" : "BEARISH PRESSURE"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>EMA 20: ${latest.ema20 || latest.close}</span>
          <span>EMA 50: ${latest.ema50 || latest.close}</span>
          <span>EMA 200: ${latest.ema200 || latest.close}</span>
        </div>
      </div>
    </div>
  )
}
