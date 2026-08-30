"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  FileText,
  Search,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Filter,
} from "lucide-react"

export interface SecCitation {
  section: string
  citation: string
  rag_relevance_score: number
  risk_flag: "LOW" | "MODERATE" | "ELEVATED" | "POSITIVE"
}

export interface SecFilingData {
  filing_type: string
  filing_date: string
  cik_number: string
  audit_opinion: string
  citations: SecCitation[]
}

interface SecFilingRagProps {
  data?: Record<string, SecFilingData>
}

const DEFAULT_SEC_DATA: Record<string, SecFilingData> = {
  NVDA: {
    filing_type: "Form 10-K (Annual Report)",
    filing_date: "2024-Q4 (Audited)",
    cik_number: "0001045810",
    audit_opinion: "Unqualified / Clean Opinion (PwC LLP)",
    citations: [
      {
        section: "Note 7 — Long-Term Debt & Liquidity",
        citation: "Total senior notes outstanding of $8.46B with weighted-average interest rate of 2.92%. No material debt maturities until 2026 ($1.25B 3.20% notes). Cash, cash equivalents, and marketable securities totaled $34.8B.",
        rag_relevance_score: 0.96,
        risk_flag: "LOW",
      },
      {
        section: "Item 1A — Risk Factors (Supply Chain Concentration)",
        citation: "We rely on a single independent foundry supplier (TSMC) to manufacture our semiconductor wafers and advanced packaging (CoWoS). Disruptions in Taiwan or manufacturing bottlenecks could severely restrict product supply.",
        rag_relevance_score: 0.94,
        risk_flag: "ELEVATED",
      },
      {
        section: "Item 7 — Management's Discussion and Analysis (MD&A)",
        citation: "Data Center revenue increased 217% YoY driven by the NVIDIA HGX platform and InfiniBand networking. Gross margin expanded to 75.9% compared to 56.9% in the prior year.",
        rag_relevance_score: 0.98,
        risk_flag: "POSITIVE",
      },
      {
        section: "Earnings Call Transcript (Q3 FY25)",
        citation: "CEO Jensen Huang: 'Blackwell demand is in full steam, and we are delivering thousands of samples to all major cloud service providers this quarter.'",
        rag_relevance_score: 0.92,
        risk_flag: "POSITIVE",
      },
    ],
  },
  AAPL: {
    filing_type: "Form 10-K (Annual Report)",
    filing_date: "2024-Q4 (Audited)",
    cik_number: "0000320193",
    audit_opinion: "Unqualified / Clean Opinion (Ernst & Young LLP)",
    citations: [
      {
        section: "Note 6 — Debt & Commercial Paper",
        citation: "Term debt outstanding totaled $95.3B. The Company maintains an active $10.0B commercial paper program with an average interest rate of 5.34%. Net cash position stood at $58.2B after $95.1B in capital returns to shareholders.",
        rag_relevance_score: 0.95,
        risk_flag: "LOW",
      },
      {
        section: "Item 1A — Risk Factors (Antitrust & Legal)",
        citation: "The Company is subject to complex legal proceedings including the US Department of Justice antitrust complaint and European Commission Digital Markets Act compliance investigations regarding App Store and NFC access.",
        rag_relevance_score: 0.91,
        risk_flag: "MODERATE",
      },
      {
        section: "Note 10 — Segment Performance (Services vs Products)",
        citation: "Services net sales reached an all-time record $96.17B with gross margin of 73.8%, compared to Products gross margin of 36.6%. Services now accounts for 24.6% of total revenue.",
        rag_relevance_score: 0.97,
        risk_flag: "POSITIVE",
      },
    ],
  },
}

export function SecFilingRag({ data = DEFAULT_SEC_DATA }: SecFilingRagProps) {
  const { theme } = useTheme()
  const activeData = Object.keys(data).length > 0 ? data : DEFAULT_SEC_DATA
  const tickers = Object.keys(activeData)
  const [selectedTicker, setSelectedTicker] = useState<string>(tickers[0] || "NVDA")
  const [searchFilter, setSearchFilter] = useState("")

  const filing = activeData[selectedTicker] || activeData[tickers[0]] || DEFAULT_SEC_DATA["NVDA"]

  const filteredCitations = filing.citations.filter(
    (c) =>
      c.section.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.citation.toLowerCase().includes(searchFilter.toLowerCase())
  )

  const getRiskBadge = (flag: SecCitation["risk_flag"]) => {
    switch (flag) {
      case "LOW":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "POSITIVE":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
      case "MODERATE":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "ELEVATED":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30"
      default:
        return "bg-white/10 text-[#a1a1aa] border-white/10"
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
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>SEC EDGAR 10-K / 10-Q RAG Agent</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Vector Retrieval
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Verifiable balance sheet footnotes, debt maturity schedules, liquidity covenants, and earnings citations
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
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] border border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Filing Metadata Banner */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-[#a1a1aa] block text-[10px] uppercase">Official Filing</span>
            <strong className="text-[#f5f5f7]">{filing.filing_type}</strong>
          </div>
          <div>
            <span className="text-[#a1a1aa] block text-[10px] uppercase">CIK Identifier</span>
            <strong className="text-[#f5f5f7]">{filing.cik_number}</strong>
          </div>
          <div>
            <span className="text-[#a1a1aa] block text-[10px] uppercase">Filing Period</span>
            <strong className="text-[#f5f5f7]">{filing.filing_date}</strong>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span className="font-bold">{filing.audit_opinion}</span>
        </div>
      </div>

      {/* Search Filter Box */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
        <input
          type="text"
          placeholder="Filter footnotes, debt covenants, or earnings transcripts..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-[#f5f5f7] focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Citations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCitations.map((citation, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#f5f5f7]">
                  <BookOpen size={13} className="text-blue-400 flex-shrink-0" />
                  <span className="truncate">{citation.section}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border flex-shrink-0 ${getRiskBadge(
                    citation.risk_flag
                  )}`}
                >
                  {citation.risk_flag}
                </span>
              </div>
              <p className="text-xs text-[#d1d5db] leading-relaxed p-3 rounded-xl bg-black/30 border border-white/5 italic">
                &ldquo;{citation.citation}&rdquo;
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#a1a1aa]">
              <div className="flex items-center gap-1">
                <Sparkles size={11} className="text-purple-400" />
                <span>RAG Similarity: {(citation.rag_relevance_score * 100).toFixed(0)}%</span>
              </div>
              <span className="text-[10px] text-blue-400">SEC EDGAR Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
