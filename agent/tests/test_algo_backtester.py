import pytest
import pandas as pd
import numpy as np
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from algo_backtester import (
    calculate_rsi,
    fetch_daily_ohlcv,
    compute_performance_metrics,
    run_momentum_trend_strategy,
    run_mean_reversion_strategy,
    run_volatility_breakout_strategy,
    execute_algo_backtest_analysis
)


def test_calculate_rsi():
    prices = pd.Series([100, 102, 104, 103, 105, 107, 106, 108, 110, 109, 111, 113, 112, 114, 116, 118, 120])
    rsi = calculate_rsi(prices, period=14)
    assert len(rsi) == len(prices)
    assert not np.isnan(rsi.iloc[-1])
    assert 0 <= rsi.iloc[-1] <= 100
    # Consistently upward series should yield RSI > 60
    assert rsi.iloc[-1] > 60


def test_compute_performance_metrics_real_trades():
    dates = pd.date_range(start="2023-01-01", periods=100, freq="B")
    equity_series = pd.Series(np.linspace(100000, 120000, 100), index=dates)
    benchmark_series = pd.Series(np.linspace(100000, 110000, 100), index=dates)

    trades = [
        {
            "entry_date": "2023-01-10",
            "exit_date": "2023-01-20",
            "action": "LONG",
            "entry_price": 100.0,
            "exit_price": 110.0,
            "shares": 500,
            "pnl_dollars": 5000.0,
            "pnl_pct": 10.0,
            "reason": "Target Hit"
        },
        {
            "entry_date": "2023-02-01",
            "exit_date": "2023-02-15",
            "action": "LONG",
            "entry_price": 110.0,
            "exit_price": 105.0,
            "shares": 500,
            "pnl_dollars": -2500.0,
            "pnl_pct": -4.55,
            "reason": "Stop Loss"
        }
    ]

    metrics = compute_performance_metrics(equity_series, benchmark_series, trades, initial_capital=100000.0)

    assert metrics["total_trades"] == 2
    assert metrics["win_rate_pct"] == 50.0
    assert metrics["profit_factor"] == 2.0  # 5000 / 2500
    assert metrics["total_return_pct"] == 20.0
    assert metrics["benchmark_return_pct"] == 10.0
    assert metrics["alpha_pct"] == 10.0
    assert "sharpe_ratio" in metrics
    assert "sortino_ratio" in metrics


def test_bar_by_bar_strategies_execution():
    # Deterministic 300 bars dataset
    dates = pd.date_range(start="2023-01-01", periods=300, freq="B")
    t = np.linspace(0, 4 * np.pi, 300)
    prices = 100.0 * (1.0 + 0.20 * np.sin(t))
    mock_df = pd.DataFrame({"TEST": prices}, index=dates)

    for strat_fn in [run_momentum_trend_strategy, run_mean_reversion_strategy, run_volatility_breakout_strategy]:
        res = strat_fn(mock_df, "TEST")
        assert "metrics" in res
        assert "equity_curve" in res
        assert "trades" in res
        assert len(res["equity_curve"]) > 0
        assert isinstance(res["trades"], list)
        for trade in res["trades"]:
            assert "entry_date" in trade
            assert "exit_date" in trade
            assert "entry_price" in trade
            assert "exit_price" in trade
            assert "shares" in trade
            assert "pnl_dollars" in trade
            assert "pnl_pct" in trade
            assert "reason" in trade


def test_execute_algo_backtest_analysis():
    dates = pd.date_range(start="2023-01-01", periods=200, freq="B")
    mock_df = pd.DataFrame({"AAPL": np.linspace(150, 180, 200), "MSFT": np.linspace(250, 300, 200)}, index=dates)
    holdings = {"AAPL": 10, "MSFT": 5}
    all_tickers = ["AAPL", "MSFT"]

    res = execute_algo_backtest_analysis(mock_df, holdings, all_tickers)
    assert res["primary_ticker"] == "AAPL"
    assert "momentum_trend" in res["strategies"]
    assert "mean_reversion" in res["strategies"]
    assert "volatility_breakout" in res["strategies"]
    assert res["paper_trading_account"]["modeled_slippage_bps"] == 2.5
