"use client"

import React, { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Radio } from "lucide-react"
import { useTheme } from "../context/theme-context"

interface TickerItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

const DEFAULT_TICKERS: TickerItem[] = [
  { symbol: "SPY", name: "S&P 500 ETF", price: 588.42, change: 3.15, changePercent: 0.54 },
  { symbol: "QQQ", name: "Nasdaq 100", price: 509.85, change: 5.40, changePercent: 1.07 },
  { symbol: "NVDA", name: "Nvidia", price: 138.25, change: 4.12, changePercent: 3.07 },
  { symbol: "AAPL", name: "Apple", price: 232.10, change: -1.20, changePercent: -0.51 },
  { symbol: "MSFT", name: "Microsoft", price: 428.50, change: 2.30, changePercent: 0.54 },
  { symbol: "TSLA", name: "Tesla", price: 260.40, change: -4.80, changePercent: -1.81 },
  { symbol: "BTC-USD", name: "Bitcoin", price: 91450.00, change: 1850.00, changePercent: 2.06 },
  { symbol: "ETH-USD", name: "Ethereum", price: 3420.50, change: 78.20, changePercent: 2.34 },
  { symbol: "GLD", name: "Gold Trust", price: 248.60, change: 0.85, changePercent: 0.34 },
  { symbol: "AMZN", name: "Amazon", price: 214.30, change: 1.95, changePercent: 0.92 },
  { symbol: "META", name: "Meta", price: 590.20, change: 6.80, changePercent: 1.16 },
  { symbol: "GOOGL", name: "Alphabet", price: 178.90, change: -0.45, changePercent: -0.25 },
]

export function TickerTape() {
  const { theme } = useTheme()
  const [tickers, setTickers] = useState<TickerItem[]>(DEFAULT_TICKERS)

  // Minor realistic jitter to simulate live streaming tick feed
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((item) => {
          if (Math.random() > 0.6) {
            const deltaPercent = (Math.random() - 0.48) * 0.15
            const newPrice = +(item.price * (1 + deltaPercent / 100)).toFixed(2)
            const newChange = +(item.change + (newPrice - item.price)).toFixed(2)
            const newChangePercent = +(item.changePercent + deltaPercent).toFixed(2)
            return {
              ...item,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent,
            }
          }
          return item
        })
      )
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const duplicatedTickers = [...tickers, ...tickers]

  return (
    <div
      className={`w-full overflow-hidden border-b flex items-center h-9 text-[11px] font-mono select-none z-30 transition-colors ${
        theme === "bloomberg"
          ? "bg-[#000000] border-[#442a00] text-[#ff9900]"
          : theme === "light"
          ? "bg-slate-100/90 border-slate-300 text-slate-800"
          : "bg-black/60 border-white/10 text-[#f5f5f7] backdrop-blur-md"
      }`}
    >
      {/* Live Market Status Pill */}
      <div
        className={`flex items-center gap-1.5 px-3.5 h-full border-r font-bold uppercase tracking-wider flex-shrink-0 z-10 ${
          theme === "bloomberg"
            ? "bg-[#110a00] border-[#442a00] text-[#ff9900]"
            : theme === "light"
            ? "bg-slate-200 border-slate-300 text-slate-700"
            : "bg-indigo-950/30 border-white/10 text-indigo-300"
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="hidden sm:inline">LIVE FEED</span>
      </div>

      {/* Marquee Tickers Container */}
      <div className="overflow-hidden flex-1 relative flex items-center">
        <div className="animate-ticker flex items-center gap-8 py-1 pl-4">
          {duplicatedTickers.map((ticker, index) => {
            const isPositive = ticker.change >= 0
            return (
              <div
                key={`${ticker.symbol}-${index}`}
                className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="font-bold tracking-tight">{ticker.symbol}</span>
                <span className="opacity-80">${ticker.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span
                  className={`flex items-center text-[10px] font-semibold px-1 rounded ${
                    isPositive
                      ? theme === "bloomberg"
                        ? "text-[#00ff66]"
                        : "text-emerald-400 bg-emerald-500/10"
                      : theme === "bloomberg"
                      ? "text-[#ff3344]"
                      : "text-rose-400 bg-rose-500/10"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {ticker.changePercent.toFixed(2)}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
