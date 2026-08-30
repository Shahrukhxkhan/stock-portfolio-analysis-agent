"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Users,
  Briefcase,
  Landmark,
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  Eye,
  Calendar,
} from "lucide-react"

export interface InsiderTrade {
  date: string
  insider: string
  type: string
  shares: number
  price: number
  value_millions: number
}

export interface CongressionalTrade {
  date: string
  politician: string
  chamber: "House" | "Senate"
  type: string
  amount: string
  details: string
}

export interface Institutional13F {
  fund: string
  position_change_pct: number
  total_shares_millions: number
  action: string
}

export interface WhaleData {
  net_smart_money_score: number
  sentiment: string
  insider_form4: InsiderTrade[]
  congressional_trades: CongressionalTrade[]
  institutional_13f: Institutional13F[]
}

interface WhaleTrackingProps {
  data?: Record<string, WhaleData>
}

const DEFAULT_WHALE_DATA: Record<string, WhaleData> = {
  NVDA: {
    net_smart_money_score: 84,
    sentiment: "STRONG INSTITUTIONAL ACCUMULATION",
    insider_form4: [
      { date: "2024-11-15", insider: "Jensen Huang (President & CEO)", type: "PLANNED SALE (10b5-1)", shares: 120000, price: 141.50, value_millions: 16.98 },
      { date: "2024-10-28", insider: "Colette Kress (EVP & CFO)", type: "PLANNED SALE (10b5-1)", shares: 40000, price: 138.20, value_millions: 5.53 },
      { date: "2024-09-12", insider: "Mark Stevens (Director)", type: "OPEN MARKET BUY", shares: 25000, price: 116.40, value_millions: 2.91 },
    ],
    congressional_trades: [
      { date: "2024-11-04", politician: "Rep. Nancy Pelosi (D-CA)", chamber: "House", type: "CALL OPTIONS PURCHASE", amount: "$1,000,001 - $5,000,000", details: "50x Call Options Strike $120 Exp Dec 2025" },
      { date: "2024-10-18", politician: "Sen. Markwayne Mullin (R-OK)", chamber: "Senate", type: "PURCHASE", amount: "$50,001 - $100,000", details: "Direct common stock acquisition" },
    ],
    institutional_13f: [
      { fund: "Vanguard Group Inc", position_change_pct: 2.4, total_shares_millions: 2150.4, action: "INCREASE" },
      { fund: "BlackRock Inc", position_change_pct: 3.1, total_shares_millions: 1820.8, action: "INCREASE" },
      { fund: "Citadel Advisors LLC (Ken Griffin)", position_change_pct: 14.8, total_shares_millions: 48.6, action: "NEW HIGH-CONVICTION" },
    ],
  },
  AAPL: {
    net_smart_money_score: 62,
    sentiment: "BALANCED INSTITUTIONAL HOLD",
    insider_form4: [
      { date: "2024-10-15", insider: "Tim Cook (CEO)", type: "PLANNED SALE (10b5-1)", shares: 223986, price: 228.40, value_millions: 51.15 },
      { date: "2024-08-20", insider: "Luca Maestri (CFO)", type: "OPTION EXERCISE & HOLD", shares: 65000, price: 224.10, value_millions: 14.56 },
    ],
    congressional_trades: [
      { date: "2024-11-12", politician: "Rep. Michael McCaul (R-TX)", chamber: "House", type: "PURCHASE", amount: "$100,001 - $250,000", details: "Direct equity purchase (Foreign Affairs Chair)" },
      { date: "2024-09-05", politician: "Rep. Ro Khanna (D-CA)", chamber: "House", type: "SALE", amount: "$15,001 - $50,000", details: "Trustee portfolio trim" },
    ],
    institutional_13f: [
      { fund: "Berkshire Hathaway (Warren Buffett)", position_change_pct: -25.0, total_shares_millions: 300.0, action: "TAX-DRIVEN TRIM (STILL TOP HOLDING)" },
      { fund: "Vanguard Group Inc", position_change_pct: 1.1, total_shares_millions: 1310.2, action: "INCREASE" },
      { fund: "State Street Corp", position_change_pct: 0.8, total_shares_millions: 715.4, action: "HOLD" },
    ],
  },
}

export function WhaleTracking({ data = DEFAULT_WHALE_DATA }: WhaleTrackingProps) {
  const { theme } = useTheme()
  const activeData = Object.keys(data).length > 0 ? data : DEFAULT_WHALE_DATA
  const tickers = Object.keys(activeData)
  const [selectedTicker, setSelectedTicker] = useState<string>(tickers[0] || "NVDA")
  const [subTab, setSubTab] = useState<"form4" | "congress" | "13f">("form4")

  const currentWhale = activeData[selectedTicker] || activeData[tickers[0]] || DEFAULT_WHALE_DATA["NVDA"]

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
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Eye size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Whale Activity & Smart Money Flow</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Form 4 • 13F • Congress
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Real-time insider transactions, Congressional disclosures, and institutional hedge fund positioning
            </p>
          </div>
        </div>

        {/* Ticker Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {tickers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTicker(t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTicker === t
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] border border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Money Flow Meter Banner */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            <DollarSign size={16} />
          </div>
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase block">Smart Money Momentum</span>
            <strong className="text-[#f5f5f7] text-sm">{currentWhale.sentiment}</strong>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#a1a1aa] uppercase block">Flow Index</span>
            <span className="font-extrabold text-sm text-emerald-400">+{currentWhale.net_smart_money_score} / 100</span>
          </div>
          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400"
              style={{ width: `${currentWhale.net_smart_money_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-view Navigation */}
      <div className="flex items-center gap-2 mb-4 bg-white/5 p-1 rounded-2xl border border-white/10 w-max text-xs font-mono">
        <button
          type="button"
          onClick={() => setSubTab("form4")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            subTab === "form4"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-[#a1a1aa] hover:text-[#f5f5f7]"
          }`}
        >
          <Users size={13} />
          <span>Form 4 Insiders</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab("congress")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            subTab === "congress"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
              : "text-[#a1a1aa] hover:text-[#f5f5f7]"
          }`}
        >
          <Landmark size={13} />
          <span>Congressional Trades</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab("13f")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            subTab === "13f"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
              : "text-[#a1a1aa] hover:text-[#f5f5f7]"
          }`}
        >
          <Building2 size={13} />
          <span>13F Institutional Funds</span>
        </button>
      </div>

      {/* 1. Form 4 Insider Trades Table */}
      {subTab === "form4" && (
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-white/5 text-[11px] text-[#a1a1aa] border-b border-white/10">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Officer / Director</th>
                <th className="p-3">Transaction</th>
                <th className="p-3">Shares</th>
                <th className="p-3">Avg Price</th>
                <th className="p-3">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentWhale.insider_form4.map((trade, idx) => {
                const isBuy = trade.type.includes("BUY")
                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 text-[#a1a1aa]">{trade.date}</td>
                    <td className="p-3 font-bold text-[#f5f5f7]">{trade.insider}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isBuy
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {trade.type}
                      </span>
                    </td>
                    <td className="p-3">{trade.shares.toLocaleString()}</td>
                    <td className="p-3">${trade.price.toFixed(2)}</td>
                    <td className="p-3 font-bold text-[#f5f5f7]">${trade.value_millions.toFixed(2)}M</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Congressional Trading Table */}
      {subTab === "congress" && (
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-white/5 text-[11px] text-[#a1a1aa] border-b border-white/10">
              <tr>
                <th className="p-3">Disclosed Date</th>
                <th className="p-3">Member of Congress</th>
                <th className="p-3">Chamber</th>
                <th className="p-3">Type</th>
                <th className="p-3">Disclosed Range</th>
                <th className="p-3">Trade Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentWhale.congressional_trades.map((trade, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-[#a1a1aa]">{trade.date}</td>
                  <td className="p-3 font-bold text-[#f5f5f7]">{trade.politician}</td>
                  <td className="p-3 text-purple-300">{trade.chamber}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        trade.type.includes("PURCHASE")
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-amber-300">{trade.amount}</td>
                  <td className="p-3 text-[#a1a1aa]">{trade.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Institutional 13F Hedge Funds Table */}
      {subTab === "13f" && (
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-white/5 text-[11px] text-[#a1a1aa] border-b border-white/10">
              <tr>
                <th className="p-3">Institutional Fund / Whale</th>
                <th className="p-3">Position Change</th>
                <th className="p-3">Total Shares Held</th>
                <th className="p-3">Strategic Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentWhale.institutional_13f.map((fund, idx) => {
                const isIncrease = fund.position_change_pct >= 0
                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-[#f5f5f7]">{fund.fund}</td>
                    <td className="p-3">
                      <span
                        className={`flex items-center gap-0.5 font-bold ${
                          isIncrease ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isIncrease ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {isIncrease ? "+" : ""}
                        {fund.position_change_pct}%
                      </span>
                    </td>
                    <td className="p-3">{fund.total_shares_millions.toLocaleString()}M shares</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                        {fund.action}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
