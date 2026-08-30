"use client"

import React, { useState } from "react"
import { useTheme } from "../../context/theme-context"
import {
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Sliders,
  DollarSign,
  TrendingDown,
  Info,
  CheckCircle2,
  XCircle,
  Globe2,
  Droplets,
  Flame,
} from "lucide-react"

export interface EsgClimateData {
  esg_metrics: {
    portfolio_composite_esg_score: number
    portfolio_rating_tier: string
    e_pillar_score: number
    s_pillar_score: number
    g_pillar_score: number
    portfolio_carbon_intensity_tco2e: number
    sp500_benchmark_carbon_intensity: number
    carbon_efficiency_vs_benchmark_pct: number
    renewable_energy_weighted_pct: number
    un_global_compact_compliance: string
    fossil_fuel_revenue_exposure_pct: number
    controversies: Array<{ ticker: string; controversy: string }>
    asset_breakdown: Array<{
      ticker: string
      weight_pct: number
      esg_score: number
      rating_tier: string
      e_score: number
      s_score: number
      g_score: number
      carbon_intensity_tco2e: number
      renewable_energy_pct: number
    }>
  }
  climate_stress_test: {
    total_annual_emissions_tco2e: number
    scenarios: Array<{
      tax_rate_per_ton: number
      annual_carbon_tax_liability_dollars: number
      estimated_valuation_impairment_pct: number
      regulatory_risk: string
    }>
  }
}

interface EsgClimateCardProps {
  data?: EsgClimateData
}

const DEFAULT_ESG_DATA: EsgClimateData = {
  esg_metrics: {
    portfolio_composite_esg_score: 83.2,
    portfolio_rating_tier: "AAA (Global Leader)",
    e_pillar_score: 86.8,
    s_pillar_score: 79.4,
    g_pillar_score: 84.1,
    portfolio_carbon_intensity_tco2e: 10.8,
    sp500_benchmark_carbon_intensity: 115.0,
    carbon_efficiency_vs_benchmark_pct: 90.6,
    renewable_energy_weighted_pct: 94.5,
    un_global_compact_compliance: "100% COMPLIANT",
    fossil_fuel_revenue_exposure_pct: 0.0,
    controversies: [
      { ticker: "NVDA", controversy: "Semiconductor Supply Chain Water Footprint" },
      { ticker: "AAPL", controversy: "App Store Regulatory Antitrust Inquiries" },
    ],
    asset_breakdown: [
      { ticker: "NVDA", weight_pct: 45.0, esg_score: 84, rating_tier: "AAA", e_score: 85, s_score: 81, g_score: 86, carbon_intensity_tco2e: 12.2, renewable_energy_pct: 92 },
      { ticker: "AAPL", weight_pct: 35.0, esg_score: 82, rating_tier: "AAA", e_score: 88, s_score: 78, g_score: 82, carbon_intensity_tco2e: 8.4, renewable_energy_pct: 100 },
      { ticker: "MSFT", weight_pct: 20.0, esg_score: 88, rating_tier: "AAA", e_score: 92, s_score: 84, g_score: 88, carbon_intensity_tco2e: 6.8, renewable_energy_pct: 100 },
    ],
  },
  climate_stress_test: {
    total_annual_emissions_tco2e: 1.08,
    scenarios: [
      { tax_rate_per_ton: 50, annual_carbon_tax_liability_dollars: 54.0, estimated_valuation_impairment_pct: 0.24, regulatory_risk: "LOW (Clean Tech Resilient)" },
      { tax_rate_per_ton: 100, annual_carbon_tax_liability_dollars: 108.0, estimated_valuation_impairment_pct: 0.49, regulatory_risk: "MODERATE" },
    ],
  },
}

export function EsgClimateCard({ data = DEFAULT_ESG_DATA }: EsgClimateCardProps) {
  const { theme } = useTheme()
  const activeData = data || DEFAULT_ESG_DATA
  const [customTaxRate, setCustomTaxRate] = useState<number>(75)

  const metrics = activeData.esg_metrics
  const stress = activeData.climate_stress_test

  // Dynamic carbon tax stress test calculation
  const customTaxLiability = +(stress.total_annual_emissions_tco2e * customTaxRate).toFixed(2)
  const customImpairmentPct = +(customTaxLiability * 0.0045).toFixed(2)

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
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Leaf size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>ESG, Carbon Accounting & Climate Stress Test</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sustainability
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Environmental, Social & Governance pillar decomposition, Scope 1-3 carbon footprint, and carbon tax impairment modeling
            </p>
          </div>
        </div>

        {/* ESG Composite Tier Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
          <ShieldCheck size={14} />
          <span className="font-bold">{metrics.portfolio_rating_tier}</span>
          <span className="text-white/60">({metrics.portfolio_composite_esg_score}/100)</span>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Carbon Intensity</span>
          <div className="text-base font-extrabold text-emerald-400">
            {metrics.portfolio_carbon_intensity_tco2e} <span className="text-[10px] font-normal text-[#a1a1aa]">tCO₂e/$1M</span>
          </div>
          <span className="text-[10px] text-emerald-300">+{metrics.carbon_efficiency_vs_benchmark_pct}% cleaner than S&P 500</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Renewable Energy Mix</span>
          <div className="text-base font-extrabold text-cyan-300">
            {metrics.renewable_energy_weighted_pct}%
          </div>
          <span className="text-[10px] text-[#a1a1aa]">Scope 2 Clean Power</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">Fossil Fuel Exposure</span>
          <div className="text-base font-extrabold text-emerald-400">
            {metrics.fossil_fuel_revenue_exposure_pct}%
          </div>
          <span className="text-[10px] text-emerald-300">Zero Fossil Extraction</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-[#a1a1aa] uppercase block mb-1">UN Global Compact</span>
          <div className="text-base font-extrabold text-purple-300">
            {metrics.un_global_compact_compliance}
          </div>
          <span className="text-[10px] text-[#a1a1aa]">Human Rights & Labor Verified</span>
        </div>
      </div>

      {/* ESG Pillar Breakdown Bars */}
      <div className="p-4 rounded-2xl bg-black/30 border border-white/10 mb-5">
        <div className="text-xs font-bold font-mono uppercase tracking-wider text-[#a1a1aa] mb-3">
          ESG Pillar Performance Decomposition
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* E Pillar */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-emerald-300 font-bold">
                <Leaf size={13} /> Environmental (E)
              </span>
              <span className="font-extrabold text-[#f5f5f7]">{metrics.e_pillar_score}/100</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${metrics.e_pillar_score}%` }} />
            </div>
            <span className="text-[10px] text-[#a1a1aa] block">Clean energy, zero direct fossil generation, water recycling</span>
          </div>

          {/* S Pillar */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-blue-300 font-bold">
                <Globe2 size={13} /> Social (S)
              </span>
              <span className="font-extrabold text-[#f5f5f7]">{metrics.s_pillar_score}/100</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${metrics.s_pillar_score}%` }} />
            </div>
            <span className="text-[10px] text-[#a1a1aa] block">Human capital development, diversity & workplace safety</span>
          </div>

          {/* G Pillar */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-purple-300 font-bold">
                <ShieldCheck size={13} /> Governance (G)
              </span>
              <span className="font-extrabold text-[#f5f5f7]">{metrics.g_pillar_score}/100</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${metrics.g_pillar_score}%` }} />
            </div>
            <span className="text-[10px] text-[#a1a1aa] block">Independent board oversight, shareholder rights & ethics</span>
          </div>
        </div>
      </div>

      {/* Carbon Tax & Climate Impairment Simulator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-purple-500/10 border border-emerald-500/30 font-mono text-xs mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-emerald-400" />
            <span className="font-bold text-[#f5f5f7]">Carbon Tax & Climate Transition Impairment Simulator</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[#a1a1aa]">Simulated Tax:</span>
            <span className="px-2 py-0.5 rounded font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ${customTaxRate} / ton CO₂
            </span>
          </div>
        </div>

        {/* Tax Slider */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-[11px] text-[#a1a1aa]">
            <span>$0/ton (Current Baseline)</span>
            <span>$50/ton (Paris 2.0°C)</span>
            <span>$100/ton (Paris 1.5°C)</span>
            <span>$150/ton (Strict EU ETS)</span>
          </div>
          <input
            type="range"
            min={0}
            max={150}
            step={5}
            value={customTaxRate}
            onChange={(e) => setCustomTaxRate(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Simulation Output Card */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase block">Annual Portfolio Carbon Liability</span>
            <strong className="text-sm font-extrabold text-emerald-400">${customTaxLiability} / yr</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase block">Valuation Multiple Haircut</span>
            <strong className="text-sm font-extrabold text-cyan-300">-{customImpairmentPct}% (Minimal Risk)</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase block">Transition Resilience</span>
            <strong className="text-sm font-extrabold text-emerald-300">HIGH IMMUNITY</strong>
          </div>
        </div>
      </div>

      {/* Holdings ESG Breakdown Table */}
      <div className="space-y-2 font-mono text-xs">
        <div className="text-[10px] font-bold uppercase text-[#a1a1aa] tracking-wider mb-1">
          Holding-Level Sustainability Ratings
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-[#a1a1aa] uppercase">
                <th className="py-2 px-3">Asset</th>
                <th className="py-2 px-3">Weight</th>
                <th className="py-2 px-3">ESG Rating</th>
                <th className="py-2 px-3">E / S / G</th>
                <th className="py-2 px-3">Carbon Intensity</th>
                <th className="py-2 px-3">Clean Energy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {metrics.asset_breakdown.map((item) => (
                <tr key={item.ticker} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#f5f5f7]">{item.ticker}</td>
                  <td className="py-2.5 px-3 text-[#a1a1aa]">{item.weight_pct}%</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.rating_tier} ({item.esg_score})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#f5f5f7]">
                    {item.e_score} / {item.s_score} / {item.g_score}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300">{item.carbon_intensity_tco2e} tCO₂e</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{item.renewable_energy_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
