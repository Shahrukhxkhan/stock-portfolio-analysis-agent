"use client"

import { Newspaper, Activity, Globe, Landmark, CheckCircle, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react"

export interface MultiAgentCrewData {
  technical_analysis?: Record<
    string,
    {
      current_price: number
      rsi: number
      macd: number
      signal: number
      sma50: number
      sma200: number
      crossover_signal: string
      upper_band: number
      lower_band: number
      stance: string
    }
  >
  news_sentiment?: Record<
    string,
    {
      score: number
      label: string
      sec_filing: string
      key_headline: string
    }
  >
  macro_sector?: {
    sector_breakdown: Array<{ sector: string; weight_pct: number; value: number }>
    fed_policy_risk: string
    inflation_drag_rating: string
    macro_stance: string
  }
  tax_harvesting?: {
    total_potential_tax_savings: number
    candidates: Array<{
      ticker: string
      invested: number
      current_val: number
      unrealized_loss: number
      est_tax_savings: number
      wash_sale_safe_replacement: string
      status: string
    }>
    wash_sale_window_notice: string
  }
}

interface MultiAgentInsightsProps {
  data?: MultiAgentCrewData
}

export function MultiAgentInsights({ data }: MultiAgentInsightsProps) {
  const technicals = data?.technical_analysis || {
    AAPL: {
      current_price: 232.5,
      rsi: 62.4,
      macd: 2.15,
      signal: 1.8,
      sma50: 224.1,
      sma200: 210.3,
      crossover_signal: "Golden Cross (Bullish)",
      upper_band: 238.0,
      lower_band: 220.0,
      stance: "BULLISH BREAKOUT",
    },
    MSFT: {
      current_price: 418.2,
      rsi: 58.1,
      macd: 3.4,
      signal: 2.9,
      sma50: 410.0,
      sma200: 395.0,
      crossover_signal: "Golden Cross (Bullish)",
      upper_band: 425.0,
      lower_band: 405.0,
      stance: "BULLISH BREAKOUT",
    },
  }

  const sentiment = data?.news_sentiment || {
    AAPL: {
      score: 82,
      label: "BULLISH",
      sec_filing: "Clean 10-K (No Audit Flags)",
      key_headline: "iPhone AI demand fuels revenue acceleration",
    },
    MSFT: {
      score: 88,
      label: "VERY BULLISH",
      sec_filing: "Clean 10-Q (Cloud Expansion)",
      key_headline: "Azure AI annual recurring revenue surpasses milestones",
    },
  }

  const macro = data?.macro_sector || {
    sector_breakdown: [
      { sector: "Information Technology", weight_pct: 72.5, value: 72500 },
      { sector: "Consumer Discretionary", weight_pct: 27.5, value: 27500 },
    ],
    fed_policy_risk: "NEUTRAL / MODERATE (Fed Rate Cuts Expected)",
    inflation_drag_rating: "LOW (CPI Trajectory 2.4%)",
    macro_stance: "FAVORABLE FOR HIGH-QUALITY GROWTH ASSETS",
  }

  const taxHarvesting = data?.tax_harvesting || {
    total_potential_tax_savings: 420.0,
    candidates: [
      {
        ticker: "TSLA",
        invested: 5000,
        current_val: 4320,
        unrealized_loss: 680,
        est_tax_savings: 170.0,
        wash_sale_safe_replacement: "TSLA_EQUIVALENT_ETF",
        status: "ELIGIBLE FOR HARVESTING",
      },
    ],
    wash_sale_window_notice: "Must wait 31 days before repurchasing identical security to ensure tax deduction compliance.",
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
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AGENT 1: NEWS & SENTIMENT */}
        <div className="glass-panel p-5 space-y-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.06)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Newspaper size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f5f5f7] font-['Roobert']">News & SEC Sentiment Agent</h3>
                <p className="text-[11px] text-[#a1a1aa]">SEC 10-K/10-Q filing audit & news sentiment scoring</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(sentiment).map(([ticker, info]) => (
              <div key={ticker} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#f5f5f7] font-['Roobert'] text-xs">{ticker}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Score: {info.score}/100
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {info.label}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-[#a1a1aa]">
                  <span className="text-white/80 font-semibold">Headline: </span>"{info.key_headline}"
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                  <CheckCircle size={12} />
                  <span>{info.sec_filing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AGENT 2: TECHNICAL ANALYSIS */}
        <div className="glass-panel p-5 space-y-4 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.06)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f5f5f7] font-['Roobert']">Technical Analysis Agent</h3>
                <p className="text-[11px] text-[#a1a1aa]">RSI(14), MACD, 50/200 SMA crossover & Bollinger Bands</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(technicals).map(([ticker, info]) => (
              <div key={ticker} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#f5f5f7] font-['Roobert'] text-xs">{ticker} (${info.current_price})</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {info.stance}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-1.5 rounded-xl bg-white/5 text-center">
                    <div className="text-[10px] text-[#a1a1aa]">RSI (14)</div>
                    <div className="font-mono font-bold text-[#f5f5f7]">{info.rsi}</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white/5 text-center">
                    <div className="text-[10px] text-[#a1a1aa]">MACD</div>
                    <div className="font-mono font-bold text-[#f5f5f7]">{info.macd}</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white/5 text-center">
                    <div className="text-[10px] text-[#a1a1aa]">50 SMA</div>
                    <div className="font-mono font-bold text-[#f5f5f7]">${info.sma50}</div>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">{info.crossover_signal}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AGENT 3: MACRO & SECTOR EXPOSURE */}
        <div className="glass-panel p-5 space-y-4 border border-amber-500/20 shadow-[0_0_20px_rgba(251,191,36,0.06)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Globe size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f5f5f7] font-['Roobert']">Macro & Sector Exposure Agent</h3>
                <p className="text-[11px] text-[#a1a1aa]">Sector allocation breakdown & Fed policy risk audit</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Sector Concentration</div>
              {macro.sector_breakdown.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-[#f5f5f7]">
                    <span>{sec.sector}</span>
                    <span className="font-mono font-semibold">{sec.weight_pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      style={{ width: `${Math.min(sec.weight_pct, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
              <div className="text-[#a1a1aa]">Fed Rate Stance: <span className="text-[#f5f5f7] font-semibold">{macro.fed_policy_risk}</span></div>
              <div className="text-[#a1a1aa]">Inflation Risk: <span className="text-[#f5f5f7] font-semibold">{macro.inflation_drag_rating}</span></div>
            </div>
          </div>
        </div>

        {/* AGENT 4: TAX-LOSS HARVESTING */}
        <div className="glass-panel p-5 space-y-4 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.06)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Landmark size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f5f5f7] font-['Roobert']">Tax-Loss Harvesting Agent</h3>
                <p className="text-[11px] text-[#a1a1aa]">Underwater holding identification & tax loss savings</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#a1a1aa] uppercase">Potential Tax Offset</div>
              <div className="text-base font-bold text-rose-400 font-['Roobert']">
                {formatCurrency(taxHarvesting.total_potential_tax_savings)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {taxHarvesting.candidates.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 text-center">
                All portfolio holdings are currently in net gain. No tax loss harvesting required.
              </div>
            ) : (
              taxHarvesting.candidates.map((cand) => (
                <div key={cand.ticker} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-[#f5f5f7]">
                    <span>{cand.ticker}</span>
                    <span className="text-rose-400">-${cand.unrealized_loss.toFixed(0)} Loss</span>
                  </div>
                  <div className="text-[11px] text-[#a1a1aa]">
                    Est. Tax Savings: <span className="text-emerald-400 font-semibold">{formatCurrency(cand.est_tax_savings)}</span>
                  </div>
                  <div className="text-[10px] text-[#a1a1aa]">
                    Safe Replacement: <span className="text-purple-300 font-mono">{cand.wash_sale_safe_replacement}</span>
                  </div>
                </div>
              ))
            )}
            <div className="text-[10px] text-[#a1a1aa] flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber-400" />
              <span>{taxHarvesting.wash_sale_window_notice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
