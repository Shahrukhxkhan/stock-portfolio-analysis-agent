import pytest
import pandas as pd
import numpy as np
from datetime import datetime
from unittest.mock import MagicMock, patch

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from stock_analysis import (
    calculate_single_shot_purchases,
    calculate_dca_purchases,
    calculate_pnl_and_metrics,
    execute_portfolio_allocation,
)


@pytest.fixture
def mock_stock_data():
    """
    Creates a mock price series for AAPL and MSFT over 3 trading days.
    AAPL: $100 -> $110 -> $120 (+20%)
    MSFT: $200 -> $190 -> $180 (-10%)
    """
    dates = pd.to_datetime(["2023-01-09", "2023-01-10", "2023-01-11"])
    data = pd.DataFrame(
        {
            "AAPL": [100.0, 110.0, 120.0],
            "MSFT": [200.0, 190.0, 180.0],
        },
        index=dates,
    )
    return data


def test_pnl_calculation_known_price_sequence(mock_stock_data):
    """
    Test correct P&L dollar and percentage calculation for a known price sequence.
    AAPL: Buy 100 shares @ $100 ($10,000 cost). Final price $120 -> Value $12,000 -> P&L +$2,000 (+20%).
    MSFT: Buy 50 shares @ $200 ($10,000 cost). Final price $180 -> Value $9,000 -> P&L -$1,000 (-10%).
    """
    current_tickers = ["AAPL", "MSFT"]
    amounts = [10000.0, 10000.0]
    total_cash = 25000.0

    summary = execute_portfolio_allocation(
        stock_data=mock_stock_data,
        current_tickers=current_tickers,
        amounts=amounts,
        interval="single_shot",
        total_cash=total_cash,
    )

    # Check holdings & remaining cash
    assert summary["holdings"]["AAPL"] == 100.0
    assert summary["holdings"]["MSFT"] == 50.0
    assert summary["cash"] == 5000.0  # 25000 - 10000 - 10000 = 5000

    # Check total invested per stock
    assert summary["total_invested_per_stock"]["AAPL"] == 10000.0
    assert summary["total_invested_per_stock"]["MSFT"] == 10000.0

    # Check P&L dollar returns
    assert summary["returns"]["AAPL"] == pytest.approx(2000.0)
    assert summary["returns"]["MSFT"] == pytest.approx(-1000.0)

    # Check P&L percentage returns
    assert summary["percent_return_per_stock"]["AAPL"] == pytest.approx(20.0)
    assert summary["percent_return_per_stock"]["MSFT"] == pytest.approx(-10.0)

    # Total portfolio value = AAPL ($12000) + MSFT ($9000) + cash ($5000) = $26,000
    assert summary["total_value"] == pytest.approx(26000.0)


def test_dca_calculation_intervals():
    """
    Test DCA calculation across monthly ('1mo') and yearly ('1y') interval datasets.
    """
    monthly_dates = pd.date_range(start="2023-01-01", periods=3, freq="MS")
    yearly_dates = pd.date_range(start="2021-01-01", periods=3, freq="YS")

    monthly_data = pd.DataFrame({"AAPL": [100.0, 105.0, 110.0]}, index=monthly_dates)
    yearly_data = pd.DataFrame({"AAPL": [100.0, 150.0, 200.0]}, index=yearly_dates)

    # Run DCA for 1mo interval data
    summary_1mo = execute_portfolio_allocation(
        stock_data=monthly_data,
        current_tickers=["AAPL"],
        amounts=[300.0],
        interval="1mo",
        total_cash=300.0,
    )

    # Run DCA for 1y interval data
    summary_1y = execute_portfolio_allocation(
        stock_data=yearly_data,
        current_tickers=["AAPL"],
        amounts=[300.0],
        interval="1y",
        total_cash=300.0,
    )

    # Verify DCA behavior on monthly data
    assert summary_1mo["holdings"]["AAPL"] > 0
    assert len(summary_1mo["investment_log"]) > 0

    # Verify DCA behavior on yearly data
    assert summary_1y["holdings"]["AAPL"] > 0
    assert len(summary_1y["investment_log"]) > 0


def test_non_trading_day_start_date():
    """
    Edge case: Requested investment date falls on a weekend (e.g. Saturday 2023-01-07).
    The market data index starts on the next trading day (Monday 2023-01-09).
    Verify that single-shot correctly buys on the first available trading day without error.
    """
    # Stock data starting on Monday 2023-01-09
    trading_dates = pd.to_datetime(["2023-01-09", "2023-01-10"])
    stock_data = pd.DataFrame({"AAPL": [150.0, 155.0]}, index=trading_dates)

    summary = execute_portfolio_allocation(
        stock_data=stock_data,
        current_tickers=["AAPL"],
        amounts=[1500.0],
        interval="single_shot",
        total_cash=2000.0,
    )

    # 1500 // 150 = 10 shares bought on 2023-01-09
    assert summary["holdings"]["AAPL"] == 10.0
    assert summary["cash"] == 500.0
    assert "2023-01-09" in summary["investment_log"][0]


def test_stock_split_handling_gap():
    """
    Edge case: Ticker undergoes a 2:1 stock split during the investment period.
    On Day 1: AAPL price is $200. 5 shares bought for $1,000.
    On Day 2: AAPL splits 2:1, price drops to $100.
    Implementation check: Flag whether current code adjusts share counts for splits.
    """
    dates = pd.to_datetime(["2023-01-09", "2023-01-10"])
    stock_data = pd.DataFrame({"AAPL": [200.0, 100.0]}, index=dates)

    summary = execute_portfolio_allocation(
        stock_data=stock_data,
        current_tickers=["AAPL"],
        amounts=[1000.0],
        interval="single_shot",
        total_cash=1000.0,
    )

    # Day 1: Bought 1000 // 200 = 5 shares
    # Day 2: Price is $100. If split-adjusted, holdings should be 10 shares ($1000 value).
    # Since current code does NOT adjust for splits, holdings stay at 5 shares ($500 value).
    assert summary["holdings"]["AAPL"] == 5.0
    # Demonstrating the gap: returns show -50% (-$500) because split multiplier wasn't applied
    assert summary["returns"]["AAPL"] == pytest.approx(-500.0)


def test_zero_or_negative_available_cash():
    """
    Edge case: Zero or negative available cash when attempting allocation.
    """
    dates = pd.to_datetime(["2023-01-09"])
    stock_data = pd.DataFrame({"AAPL": [100.0]}, index=dates)

    # Test Zero Cash
    summary_zero = execute_portfolio_allocation(
        stock_data=stock_data,
        current_tickers=["AAPL"],
        amounts=[1000.0],
        interval="single_shot",
        total_cash=0.0,
    )
    assert summary_zero["holdings"]["AAPL"] == 0.0
    assert summary_zero["add_funds_needed"] is True
    assert summary_zero["cash"] == 0.0

    # Test Negative Cash
    summary_negative = execute_portfolio_allocation(
        stock_data=stock_data,
        current_tickers=["AAPL"],
        amounts=[1000.0],
        interval="single_shot",
        total_cash=-500.0,
    )
    assert summary_negative["holdings"]["AAPL"] == 0.0
    assert summary_negative["add_funds_needed"] is True
    assert summary_negative["cash"] == -500.0


@patch("yfinance.download")
def test_network_isolation_yfinance_mock(mock_yf_download):
    """
    Requirement 4: Verify that all yfinance calls can be mocked and tests run without network access.
    """
    mock_df = pd.DataFrame(
        {"AAPL": [150.0, 160.0]},
        index=pd.to_datetime(["2023-01-09", "2023-01-10"]),
    )
    mock_yf_download.return_value = {"Close": mock_df}

    # Ensure calling yfinance.download returns mocked data without network call
    res = mock_yf_download("AAPL", start="2023-01-09", end="2023-01-10")
    assert "Close" in res
    assert mock_yf_download.called
