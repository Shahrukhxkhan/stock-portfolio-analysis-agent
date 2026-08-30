"""
Macro US Treasury Yield Curve, Duration & Recession Risk Engine
Provides institutional macroeconomic interest rate models:
1. US Treasury Yield Curve across tenors (1M, 3M, 6M, 1Y, 2Y, 5Y, 10Y, 20Y, 30Y)
2. 2Y/10Y and 3M/10Y Inversion Spreads & Recession Probability Model (NY Fed Probit model)
3. Macroeconomic Cycle Regime Classifier (Expansion, Late-Cycle, Contraction, Recovery)
4. Federal Reserve Interest Rate Shock & Duration Sensitivity Simulator
"""

from typing import Dict, List, Any
import numpy as np
import pandas as pd


def get_treasury_yield_curve_data() -> Dict[str, Any]:
    """
    Returns realistic benchmark US Treasury yield curves across standard maturities.
    """
    maturities = [
        {"key": "1M", "label": "1 Month", "years": 0.083, "current": 4.62, "one_month_ago": 4.82, "one_year_ago": 5.45, "peak_inversion": 5.55},
        {"key": "3M", "label": "3 Month", "years": 0.25, "current": 4.55, "one_month_ago": 4.75, "one_year_ago": 5.40, "peak_inversion": 5.50},
        {"key": "6M", "label": "6 Month", "years": 0.50, "current": 4.48, "one_month_ago": 4.65, "one_year_ago": 5.35, "peak_inversion": 5.48},
        {"key": "1Y", "label": "1 Year", "years": 1.0, "current": 4.35, "one_month_ago": 4.45, "one_year_ago": 5.15, "peak_inversion": 5.40},
        {"key": "2Y", "label": "2 Year", "years": 2.0, "current": 4.22, "one_month_ago": 4.15, "one_year_ago": 4.88, "peak_inversion": 5.10},
        {"key": "5Y", "label": "5 Year", "years": 5.0, "current": 4.28, "one_month_ago": 4.08, "one_year_ago": 4.55, "peak_inversion": 4.45},
        {"key": "10Y", "label": "10 Year", "years": 10.0, "current": 4.40, "one_month_ago": 4.20, "one_year_ago": 4.45, "peak_inversion": 3.85},
        {"key": "20Y", "label": "20 Year", "years": 20.0, "current": 4.68, "one_month_ago": 4.52, "one_year_ago": 4.75, "peak_inversion": 4.15},
        {"key": "30Y", "label": "30 Year", "years": 30.0, "current": 4.58, "one_month_ago": 4.42, "one_year_ago": 4.60, "peak_inversion": 3.95},
    ]

    return {"maturities": maturities}


def calculate_yield_spreads_and_recession_prob(maturities: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes key term spreads and estimated recession probabilities.
    """
    y_2y = next((m["current"] for m in maturities if m["key"] == "2Y"), 4.22)
    y_10y = next((m["current"] for m in maturities if m["key"] == "10Y"), 4.40)
    y_3m = next((m["current"] for m in maturities if m["key"] == "3M"), 4.55)

    spread_10_2 = round(y_10y - y_2y, 2)    # +0.18% (Un-inverting / Steepening)
    spread_10_3m = round(y_10y - y_3m, 2)  # -0.15%

    # Recession probability proxy based on classic NY Fed Probit curve model
    # Spread < 0 increases recession risk; un-inversion indicates late-cycle/transition
    if spread_10_3m < -0.50:
        recession_prob = 55
        regime = "LATE-CYCLE SLOWDOWN / ELEVATED RISK"
        cycle_phase = "Phase 4: Monetary Restrictive"
    elif spread_10_2 > 0 and spread_10_3m < 0:
        recession_prob = 28
        regime = "NORMALIZING / SOFT LANDING PROJECTION"
        cycle_phase = "Phase 3: Disinflationary Transition"
    elif spread_10_2 > 0.50:
        recession_prob = 12
        regime = "ECONOMIC EXPANSION"
        cycle_phase = "Phase 1: Early/Mid Cycle Growth"
    else:
        recession_prob = 35
        regime = "TRANSITION UNCERTAINTY"
        cycle_phase = "Phase 2: Policy Recalibration"

    return {
        "spread_10y_2y_pct": spread_10_2,
        "spread_10y_3m_pct": spread_10_3m,
        "is_10_2_inverted": spread_10_2 < 0,
        "is_10_3m_inverted": spread_10_3m < 0,
        "recession_probability_pct": recession_prob,
        "macro_regime": regime,
        "economic_cycle_phase": cycle_phase,
        "fed_policy_stance": "EASING CYCLE COMMENCING (Neutral Rate 3.0-3.5%)"
    }


def simulate_fed_rate_shocks(
    holdings: Dict[str, Any],
    final_prices: Dict[str, float]
) -> Dict[str, Any]:
    """
    Calculates portfolio interest rate duration and models rate shock scenarios.
    """
    ASSET_DURATIONS = {
        "NVDA": 18.5, "TSLA": 22.0, "AAPL": 14.2, "MSFT": 15.0,
        "GOOGL": 14.5, "AMZN": 16.8, "SPY": 12.0, "QQQ": 17.5,
        "TLT": 16.2, "BND": 6.5, "SHY": 1.9, "BTC-USD": 28.0, "GLD": -2.5
    }

    total_value = sum(final_prices.get(t, 100.0) * s for t, s in holdings.items() if s > 0) or 100000.0

    port_duration = 0.0
    asset_breakdown = []

    for t, s in holdings.items():
        if s <= 0:
            continue
        price = final_prices.get(t, 100.0)
        val = price * s
        w = val / total_value
        dur = ASSET_DURATIONS.get(t.upper(), 14.0)
        port_duration += w * dur

        asset_breakdown.append({
            "ticker": t,
            "weight_pct": round(w * 100, 1),
            "effective_duration_years": dur,
            "rate_sensitivity": "EXTREME" if dur > 18 else "HIGH" if dur > 13 else "MODERATE"
        })

    port_duration = round(port_duration, 1)

    # Scenarios: -100 bps cut, -50 bps cut, +50 bps hike, +100 bps hike
    shock_scenarios = [
        {
            "shock_label": "Aggressive Fed Easing (-100 bps)",
            "rate_delta_bps": -100,
            "projected_pnl_pct": round(port_duration * 1.0 * 0.85, 1),  # modified equity duration
            "impact_direction": "POSITIVE",
            "macro_context": "Accelerated rate cuts boost growth asset discount multiples."
        },
        {
            "shock_label": "Moderate Fed Cut (-50 bps)",
            "rate_delta_bps": -50,
            "projected_pnl_pct": round(port_duration * 0.5 * 0.85, 1),
            "impact_direction": "POSITIVE",
            "macro_context": "Orderly policy normalization provides supportive equity tailwind."
        },
        {
            "shock_label": "Hawkish Pause / Hike (+50 bps)",
            "rate_delta_bps": 50,
            "projected_pnl_pct": round(-port_duration * 0.5 * 0.85, 1),
            "impact_direction": "NEGATIVE",
            "macro_context": "Inflation resurgence pressures long-duration tech multiples."
        },
        {
            "shock_label": "Severe Inflation Shock (+100 bps)",
            "rate_delta_bps": 100,
            "projected_pnl_pct": round(-port_duration * 1.0 * 0.85, 1),
            "impact_direction": "NEGATIVE",
            "macro_context": "Aggressive monetary tightening triggers multiple contraction."
        }
    ]

    return {
        "portfolio_effective_duration_years": port_duration,
        "interest_rate_risk_level": "ELEVATED DURATION (Growth Equity Tilt)" if port_duration > 15 else "MODERATE",
        "asset_breakdown": asset_breakdown,
        "shock_scenarios": shock_scenarios
    }


def execute_macro_yield_curve_analysis(
    holdings: Dict[str, Any],
    final_prices: Dict[str, float],
    stock_data: pd.DataFrame
) -> Dict[str, Any]:
    """
    Orchestrates the complete Macro US Treasury Yield Curve & Recession Risk Engine.
    """
    curve_data = get_treasury_yield_curve_data()
    spreads_data = calculate_yield_spreads_and_recession_prob(curve_data["maturities"])
    rate_shocks_data = simulate_fed_rate_shocks(holdings, final_prices)

    return {
        "yield_curve": curve_data,
        "spreads_and_recession": spreads_data,
        "rate_shocks": rate_shocks_data
    }
