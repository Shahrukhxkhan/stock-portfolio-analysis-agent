"""
Asset Classifier & Ticker Normalizer Module
Supports Cryptocurrencies, Commodities, Forex, ETFs, and US Stocks.
"""

from typing import Dict, List, Any

TICKER_ALIAS_MAP = {
    "BTC": "BTC-USD",
    "BITCOIN": "BTC-USD",
    "ETH": "ETH-USD",
    "ETHEREUM": "ETH-USD",
    "SOL": "SOL-USD",
    "SOLANA": "SOL-USD",
    "DOGE": "DOGE-USD",
    "DOGECOIN": "DOGE-USD",
    "XRP": "XRP-USD",
    "RIPPLE": "XRP-USD",
    "ADA": "ADA-USD",
    "CARDANO": "ADA-USD",
    "BNB": "BNB-USD",
    "GOLD": "GLD",
    "SILVER": "SLV",
    "OIL": "USO",
    "GAS": "UNG",
    "EUR/USD": "EURUSD=X",
    "EURUSD": "EURUSD=X",
    "GBP/USD": "GBPUSD=X",
    "GBPUSD": "GBPUSD=X",
}

COMMODITIES_SET = {"GLD", "SLV", "USO", "UNG", "PALL", "PPLT", "IAU"}
ETF_SET = {"SPY", "QQQ", "DIA", "IWM", "VTI", "TLT", "VOO", "EEM", "IVV", "SCHD", "ARKK"}


def normalize_ticker(ticker: str) -> str:
    """
    Normalizes ticker symbols and resolves common aliases (e.g. BTC -> BTC-USD).
    """
    clean_ticker = ticker.strip().upper()
    return TICKER_ALIAS_MAP.get(clean_ticker, clean_ticker)


def classify_asset(ticker: str) -> str:
    """
    Categorizes ticker into asset class: Crypto, Commodity, Forex, ETF, or US Stock.
    """
    norm_ticker = normalize_ticker(ticker)

    if norm_ticker.endswith("-USD") or norm_ticker in {"BTC", "ETH", "SOL", "DOGE", "XRP", "BNB"}:
        return "Crypto"
    elif norm_ticker in COMMODITIES_SET:
        return "Commodity"
    elif norm_ticker.endswith("=X"):
        return "Forex"
    elif norm_ticker in ETF_SET:
        return "ETF"
    else:
        return "US Stock"


def calculate_asset_class_distribution(holdings: Dict[str, float], final_prices: Dict[str, float]) -> List[Dict[str, Any]]:
    """
    Calculates portfolio market value breakdown by asset class.
    """
    total_val = sum(holdings.get(t, 0) * final_prices.get(t, 0) for t in holdings)
    class_totals: Dict[str, float] = {}

    for ticker, shares in holdings.items():
        price = final_prices.get(ticker, 0)
        asset_val = shares * price
        asset_cat = classify_asset(ticker)
        class_totals[asset_cat] = class_totals.get(asset_cat, 0.0) + asset_val

    distribution = []
    for cat, val in class_totals.items():
        pct = (val / total_val * 100.0) if total_val > 0 else 0.0
        distribution.append({
            "asset_class": cat,
            "value": round(val, 2),
            "weight_pct": round(pct, 1)
        })

    return distribution
