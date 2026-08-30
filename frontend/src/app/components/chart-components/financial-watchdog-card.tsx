"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  BellRing,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Eye,
  Landmark,
  Activity,
  FileText,
  Send,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react"

export interface WatchdogAlert {
  id: string
  category: "WHALE_ALERT" | "CAPITOL_HILL" | "TECHNICAL_TRIGGER" | "SEC_FOOTNOTE"
  ticker: string
  title: string
  message: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  timestamp: string
  badge_text: string
  action_url?: string
}

export interface FinancialWatchdogData {
  sentinel_status: string
  last_scan_timestamp: string
  total_active_alerts: number
  critical_count: number
  high_count: number
  alerts: WatchdogAlert[]
  webhook_payloads?: {
    discord: any
    telegram: any
    slack: any
  }
  threshold_config?: {
    whale_min_purchase_dollars: number
    rsi_oversold_threshold: number
    rsi_overbought_threshold: number
    channels_enabled: string[]
  }
}

interface FinancialWatchdogCardProps {
  data?: FinancialWatchdogData
}

const DEFAULT_WATCHDOG_DATA: FinancialWatchdogData = {
  sentinel_status: "ACTIVE_MONITORING",
  last_scan_timestamp: "Just now",
  total_active_alerts: 4,
  critical_count: 2,
  high_count: 1,
  alerts: [
    {
      id: "whale_nvda",
      category: "WHALE_ALERT",
      ticker: "NVDA",
      title: "Whale Form 4: Mark Stevens (Director)",
      message: "Board Director executed significant open-market common equity purchase of $2.91M (Bullish Accumulation).",
      severity: "CRITICAL",
      timestamp: "2h ago",
      badge_text: "$2.9M Form 4 Buy",
      action_url: "https://www.sec.gov",
    },
    {
      id: "congress_nvda",
      category: "CAPITOL_HILL",
      ticker: "NVDA",
      title: "Congressional Trade: Rep. Nancy Pelosi (House)",
      message: "CALL OPTIONS PURCHASE ($1M - $5M): 50x Call Options Strike $120 Exp Dec 2025.",
      severity: "CRITICAL",
      timestamp: "3h ago",
      badge_text: "House LEAPS",
      action_url: "https://disclosures-clerk.house.gov",
    },
    {
      id: "tech_nvda",
      category: "TECHNICAL_TRIGGER",
      ticker: "NVDA",
      title: "Technical Alert: 50-SMA Golden Cross Acceleration",
      message: "NVDA price surpassed upper 2.0σ Bollinger Band ($145.00) with MACD histogram expanding (+4.12).",
      severity: "HIGH",
      timestamp: "4h ago",
      badge_text: "BULLISH BREAKOUT",
    },
    {
      id: "sec_aapl",
      category: "SEC_FOOTNOTE",
      ticker: "AAPL",
      title: "SEC 10-K Item 1A: DOJ Antitrust Scrutiny Update",
      message: "Updated Item 1A disclosure notes active legal proceedings regarding default search agreements and EU DMA compliance.",
      severity: "MEDIUM",
      timestamp: "1d ago",
      badge_text: "10-K Risk Factor",
    },
  ],
  threshold_config: {
    whale_min_purchase_dollars: 1000000,
    rsi_oversold_threshold: 25,
    rsi_overbought_threshold: 75,
    channels_enabled: ["DISCORD", "TELEGRAM", "SLACK", "IN_APP_PUSH"],
  },
}

export function FinancialWatchdogCard({ data = DEFAULT_WATCHDOG_DATA }: FinancialWatchdogCardProps) {
  const { theme } = useTheme()
  const activeData = data || DEFAULT_WATCHDOG_DATA
  const [filterCategory, setFilterCategory] = useState<string>("ALL")
  const [selectedChannel, setSelectedChannel] = useState<"discord" | "telegram" | "slack">("discord")
  const [dispatchedNotice, setDispatchedNotice] = useState<string | null>(null)
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const visibleAlerts = activeData.alerts
    .filter((a) => !dismissedAlerts.includes(a.id))
    .filter((a) => filterCategory === "ALL" || a.category === filterCategory)

  const handleTestDispatch = () => {
    setDispatchedNotice(`Successfully formatted and dispatched test payload to ${selectedChannel.toUpperCase()} Webhook channel.`)
    setTimeout(() => setDispatchedNotice(null), 4000)
  }

  const getSeverityPill = (sev: WatchdogAlert["severity"]) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
      case "HIGH":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "MEDIUM":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    }
  }

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
      {/* Header & Sentinel Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <BellRing size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>Autonomous Financial Watchdog & Multi-Channel Dispatcher</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                24/7 Sentinel
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Continuous anomaly monitoring for whale transactions, Congressional trades, technical breaches, and SEC footnote covenants
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold">SENTINEL ACTIVE</span>
          </div>
          <div className="text-[11px] text-[#a1a1aa]">
            Last Scan: <span className="text-[#f5f5f7]">{activeData.last_scan_timestamp}</span>
          </div>
        </div>
      </div>

      {/* KPI Severity Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Active Triggers</span>
          <div className="text-base font-extrabold text-[#f5f5f7]">{visibleAlerts.length}</div>
          <span className="text-[10px] text-[#a1a1aa]">Across all holdings</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25">
          <span className="text-[10px] text-rose-300 uppercase block mb-1">Critical Anomalies</span>
          <div className="text-base font-extrabold text-rose-400">{activeData.critical_count}</div>
          <span className="text-[10px] text-rose-300/80">Whale & Congress</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
          <span className="text-[10px] text-amber-300 uppercase block mb-1">High Severity</span>
          <div className="text-base font-extrabold text-amber-400">{activeData.high_count}</div>
          <span className="text-[10px] text-amber-300/80">Technical Breakouts</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Channels Connected</span>
          <div className="text-base font-extrabold text-purple-300">4 Active</div>
          <span className="text-[10px] text-[#a1a1aa]">Discord, Telegram, Slack, Push</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar mb-4 font-mono text-xs">
        {[
          { id: "ALL", label: "All Alerts", icon: Radio },
          { id: "WHALE_ALERT", label: "Whale Form 4 (> $1M)", icon: Eye },
          { id: "CAPITOL_HILL", label: "Capitol Hill Congress", icon: Landmark },
          { id: "TECHNICAL_TRIGGER", label: "Technical Triggers", icon: Activity },
          { id: "SEC_FOOTNOTE", label: "SEC Footnote Covenants", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = filterCategory === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCategory(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] border border-white/10"
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3 mb-6">
        {visibleAlerts.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-[#a1a1aa]">
            All sentinel alert triggers operating within standard thresholds. No anomalies detected.
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 mt-0.5">
                  {alert.category === "WHALE_ALERT" ? (
                    <Eye size={16} className="text-amber-400" />
                  ) : alert.category === "CAPITOL_HILL" ? (
                    <Landmark size={16} className="text-purple-400" />
                  ) : alert.category === "TECHNICAL_TRIGGER" ? (
                    <Activity size={16} className="text-cyan-400" />
                  ) : (
                    <FileText size={16} className="text-blue-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-[#f5f5f7]">{alert.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase border ${getSeverityPill(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-[#f5f5f7]">
                      {alert.ticker}
                    </span>
                  </div>
                  <p className="text-xs text-[#d1d5db] leading-relaxed mb-1">{alert.message}</p>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#a1a1aa]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {alert.timestamp}
                    </span>
                    <span>•</span>
                    <span className="text-purple-300 font-semibold">{alert.badge_text}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 font-mono text-xs">
                {alert.action_url && (
                  <a
                    href={alert.action_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors"
                  >
                    <span>View Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Multi-Channel Webhook Dispatcher & Simulator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-cyan-500/10 border border-purple-500/30 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Send size={16} className="text-purple-400" />
            <span className="font-bold text-[#f5f5f7]">Multi-Channel Webhook Dispatcher Simulator</span>
          </div>
          <div className="flex items-center gap-1.5">
            {(["discord", "telegram", "slack"] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setSelectedChannel(ch)}
                className={`px-2.5 py-1 rounded-lg uppercase font-bold text-[10px] transition-all cursor-pointer ${
                  selectedChannel === ch
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/40"
                    : "text-[#a1a1aa] hover:text-[#f5f5f7]"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {dispatchedNotice && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs">
            <CheckCircle2 size={14} />
            <span>{dispatchedNotice}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] overflow-x-auto">
            <div className="text-[#a1a1aa] mb-1 uppercase font-bold text-[10px]">
              Outgoing {selectedChannel.toUpperCase()} Payload Preview:
            </div>
            <pre className="text-cyan-300 whitespace-pre-wrap">
              {JSON.stringify(
                selectedChannel === "discord"
                  ? activeData.webhook_payloads?.discord || { status: "DISCORD_EMBED_READY" }
                  : selectedChannel === "telegram"
                  ? activeData.webhook_payloads?.telegram || { status: "TELEGRAM_MARKDOWN_READY" }
                  : activeData.webhook_payloads?.slack || { status: "SLACK_BLOCKS_READY" },
                null,
                2
              )}
            </pre>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
            <div className="text-[11px] text-[#a1a1aa]">
              Destination: <span className="text-purple-300 font-bold">https://api.{selectedChannel}.com/v1/webhook/...</span>
            </div>
            <button
              type="button"
              onClick={handleTestDispatch}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer"
            >
              <Send size={13} />
              <span>Test Dispatch {selectedChannel.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
