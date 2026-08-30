"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Newspaper,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Flame,
  Radio,
  ExternalLink,
  Clock,
  Zap,
} from "lucide-react"

export interface BreakingHeadline {
  source: string
  time: string
  title: string
  impact: "HIGH" | "MEDIUM" | "LOW"
  direction: "POSITIVE" | "NEGATIVE"
}

export interface SentimentData {
  score: number
  label: string
  social_retail_ratio: {
    bullish_pct: number
    bearish_pct: number
    buzz_volume: string
  }
  key_headline: string
  breaking_feed: BreakingHeadline[]
}

interface SentimentFeedProps {
  data?: Record<string, SentimentData>
}

const DEFAULT_SENTIMENT_DATA: Record<string, SentimentData> = {
  NVDA: {
    score: 92,
    label: "EXTREMELY BULLISH",
    social_retail_ratio: { bullish_pct: 86, bearish_pct: 14, buzz_volume: "VERY HIGH (98th percentile)" },
    key_headline: "Next-gen GPU architecture sees historic enterprise pre-orders across cloud providers",
    breaking_feed: [
      { source: "Bloomberg Markets", time: "20m ago", title: "Nvidia Blackwell Supply Fully Booked Through Mid-2025", impact: "HIGH", direction: "POSITIVE" },
      { source: "Reuters", time: "2h ago", title: "Hyperscaler CapEx Projections Point to Continued AI Infrastructure Spending", impact: "HIGH", direction: "POSITIVE" },
      { source: "Wall Street Journal", time: "5h ago", title: "Nvidia Expands Enterprise Sovereign Cloud Partnerships in Europe", impact: "MEDIUM", direction: "POSITIVE" },
    ],
  },
  AAPL: {
    score: 82,
    label: "BULLISH",
    social_retail_ratio: { bullish_pct: 74, bearish_pct: 26, buzz_volume: "HIGH (82nd percentile)" },
    key_headline: "iPhone AI demand fuels revenue acceleration with record Services expansion",
    breaking_feed: [
      { source: "Financial Times", time: "45m ago", title: "Apple Intelligence Rollout Drives Accelerated Trade-in Volumes", impact: "HIGH", direction: "POSITIVE" },
      { source: "CNBC", time: "3h ago", title: "Apple Services Margin Hits Record 74% as Active Devices Top 2.2 Billion", impact: "HIGH", direction: "POSITIVE" },
      { source: "The Information", time: "6h ago", title: "Apple Tests Advanced Siri Large Language Models for 2025 Release", impact: "MEDIUM", direction: "POSITIVE" },
    ],
  },
}

export function SentimentFeed({ data = DEFAULT_SENTIMENT_DATA }: SentimentFeedProps) {
  const { theme } = useTheme()
  const activeData = Object.keys(data).length > 0 ? data : DEFAULT_SENTIMENT_DATA
  const tickers = Object.keys(activeData)
  const [selectedTicker, setSelectedTicker] = useState<string>(tickers[0] || "NVDA")

  const currentSentiment = activeData[selectedTicker] || activeData[tickers[0]] || DEFAULT_SENTIMENT_DATA["NVDA"]

  const isBullish = currentSentiment.score >= 70

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
      {/* Header & Ticker Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Newspaper size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Real-Time News & Social Sentiment Agent</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                NewsAPI • Reddit • StockTwits
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Multi-source natural language sentiment analysis, retail community buzz, and breaking news impact
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
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] border border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top Sentiment & Social Pulse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* News Sentiment Index Score Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
                Financial News Sentiment Index
              </span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isBullish
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {currentSentiment.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold font-mono text-[#f5f5f7]">{currentSentiment.score}</span>
            <span className="text-xs text-[#a1a1aa] font-mono">/ 100</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBullish ? "bg-gradient-to-r from-cyan-400 to-emerald-400" : "bg-gradient-to-r from-rose-400 to-amber-400"
              }`}
              style={{ width: `${currentSentiment.score}%` }}
            />
          </div>

          <p className="text-xs text-[#a1a1aa] italic">&ldquo;{currentSentiment.key_headline}&rdquo;</p>
        </div>

        {/* Social & Retail Community Pulse Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
                Retail Community & Social Pulse
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <Flame size={14} />
              <span>{currentSentiment.social_retail_ratio.buzz_volume}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-emerald-400 font-bold">
              Bullish: {currentSentiment.social_retail_ratio.bullish_pct}%
            </span>
            <span className="text-rose-400 font-bold">
              Bearish: {currentSentiment.social_retail_ratio.bearish_pct}%
            </span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex mb-3">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${currentSentiment.social_retail_ratio.bullish_pct}%` }}
            />
            <div
              className="bg-rose-400 h-full transition-all duration-300"
              style={{ width: `${currentSentiment.social_retail_ratio.bearish_pct}%` }}
            />
          </div>

          <div className="text-[11px] text-[#a1a1aa] flex items-center justify-between font-mono">
            <span>Sources: StockTwits • Reddit r/wallstreetbets • X</span>
            <span className="text-emerald-300">Live Aggregate</span>
          </div>
        </div>
      </div>

      {/* Breaking Headline Impact Stream */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
        <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
            <Radio size={14} className="text-cyan-400 animate-pulse" />
            <span>Breaking News & Catalyst Impact Feed</span>
          </div>
          <span className="text-[10px] text-[#a1a1aa] font-mono">Real-Time NLP Classifier</span>
        </div>

        <div className="divide-y divide-white/5">
          {currentSentiment.breaking_feed.map((item, idx) => (
            <div key={idx} className="p-3.5 hover:bg-white/5 transition-colors flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    item.direction === "POSITIVE"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {item.direction === "POSITIVE" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f5f5f7] mb-1">{item.title}</div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#a1a1aa]">
                    <span className="text-cyan-300">{item.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    item.impact === "HIGH"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-white/10 text-[#a1a1aa]"
                  }`}
                >
                  {item.impact} IMPACT
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
