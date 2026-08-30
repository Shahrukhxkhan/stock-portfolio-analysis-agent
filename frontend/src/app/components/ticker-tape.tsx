"use client"

import React, { useState, useEffect } from "react"

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
    <div className="w-full overflow-hidden border-b border-[#E2E6EF] flex items-center h-9 text-[11px] font-mono select-none z-30 bg-[#FFFFFF] text-[#101828]">
      {/* Live Market Status Pill */}
      <div className="flex items-center gap-1.5 px-3.5 h-full border-r border-[#E2E6EF] font-bold uppercase tracking-wider flex-shrink-0 z-10 bg-[#F3F4F8] text-[#3730E0]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E8E5A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1E8E5A]"></span>
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
                <span className="font-bold tracking-tight text-[#101828]">{ticker.symbol}</span>
                <span className="text-[#6B7A99]">${ticker.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span
                  className={`flex items-center text-[10px] font-semibold px-1 rounded ${
                    isPositive
                      ? "text-[#1E8E5A] bg-[#E8F5EE]"
                      : "text-[#D64545] bg-[#FCEBEB]"
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
