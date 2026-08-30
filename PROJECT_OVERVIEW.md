# 📈 Stock Portfolio Analysis Agent — System & Project Overview

Welcome to the official documentation for the **Stock Portfolio Analysis Agent**. This document provides an exhaustive breakdown of what the project is, the architectural design, features implemented, tech stack used, and detailed technical specifics covering both major and minor implementation details.

---

## 📑 Table of Contents
1. [Project Overview & Mission](#-project-overview--mission)
2. [Key Features & Capabilities](#-key-features--capabilities)
3. [Technology Stack](#-technology-stack)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [Backend Implementation Details](#-backend-implementation-details)
6. [Frontend Implementation Details](#-frontend-implementation-details)
7. [Repository Structure](#-repository-structure)
8. [Setup & Environment Configuration](#-setup--environment-configuration)
9. [Major & Minor Technical Highlights](#-major--minor-technical-highlights)

---

## 🚀 Project Overview & Mission

The **Stock Portfolio Analysis Agent** is a full-stack, real-time AI-powered financial portfolio management and investment analysis application. 

Instead of traditional static portfolio calculators, this system leverages an autonomous **AI Agent Workflow (CrewAI Flow)** coupled with **CopilotKit's AG-UI Protocol** to deliver interactive streaming agent execution. Users can communicate in natural language (e.g., *"Analyze AAPL and MSFT with $10,000 each over the last 6 months"*), and observe live as the AI agent:
1. Parses investment intent and parameters.
2. Fetches real-time and historical stock market data via `yfinance`.
3. Performs quantitative portfolio allocations, return calculations, and DCA (Dollar-Cost Averaging) backtesting.
4. Updates financial state (cash balances, active portfolio holdings).
5. Concurrently evaluates Bullish & Bearish fundamental insights.
6. Dynamically renders visual charts, performance timelines, and allocation tables in real-time.

---

## ✨ Key Features & Capabilities

- **Natural Language Query Parsing**: Extracts stock tickers, target investment amounts, start dates, investment intervals (Single Purchase vs DCA), and target portfolio context (Live Portfolio vs Sandbox).
- **Real-Time AG-UI Streaming**: Streams agent step-by-step progress, tool calls, and state updates to the frontend via Server-Sent Events (SSE) without page reloads or UI blocking.
- **Historical Market Data Integration**: Fetches detailed daily prices, volume, adjusted close prices, and dividend data for any valid market ticker symbol.
- **Multi-Strategy Backtesting Engine**:
  - **Single Shot Strategy**: Evaluates lump-sum purchase performance from a specific historical date to today.
  - **Dollar-Cost Averaging (DCA)**: Simulates recurring fixed investments across customizable intervals (`1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`).
- **Dynamic Cash Management**: Tracks available liquid cash (starting at default `$1,000,000` or custom balance), automatically deducting total invested amounts upon portfolio confirmation.
- **Bull & Bear Insight Generation**: Uses AI reasoning models to synthesize balanced investment evaluations—highlighting growth catalysts (Bull Case) and potential risk factors (Bear Case) with custom icons/emojis.
- **Enhanced Multi-Agent Intelligence & RAG**:
  - **Autonomous Multi-Agent Debate Arena**: Adversarial dual-analyst debate (Permabull Growth Analyst vs Skeptical Risk Officer) adjudicated by a Senior Portfolio Manager Judge who outputs round-by-round arguments, conviction scores (0-100%), and allocation guidance.
  - **SEC EDGAR 10-K / 10-Q RAG Agent**: Vector citation engine extracting verified balance sheet footnotes, long-term debt maturity schedules, liquidity covenants, and earnings call transcript excerpts with CIK references.
  - **Whale Activity & Form 4 / 13F / Congressional Tracker**: Real-time monitoring of Form 4 insider transactions (CEO/CFO buys and sales), Congressional trading disclosures (Senate & House members), institutional 13F hedge fund changes, and net smart money momentum.
  - **Advanced Quantitative Finance & Modeling**:
  - **Markowitz Modern Portfolio Theory & Efficient Frontier**: Monte Carlo mean-variance optimization, Capital Allocation Line (CAL), Max Sharpe optimal tangency star, Global Min Volatility boundary, and current portfolio coordinate.
  - **Black-Litterman Asset Allocation Model**: Blends CAPM equilibrium market returns with AI subjective conviction views and confidence matrices to compute posterior expected returns and optimal target weights.
  - **Historical Crisis Stress Testing & VaR/CVaR**: Simulates portfolio vulnerability across real-world crashes (2008 GFC, 2020 COVID, 2022 Fed Rate Hikes, 2000 Dot-com bust) and computes 95%/99% Parametric & Historical Value at Risk and Expected Shortfall (CVaR).
- **Options & Derivatives Hedging & Greeks Engine**:
  - **Black-Scholes-Merton Pricing & Greeks**: Computes exact option sensitivities ($\Delta, \Gamma, \Theta, \mathcal{V}, \rho$) and portfolio beta-weighted dollar delta.
  - **Automated Protective Collars**: Constructs zero-cost collar strategies (long OTM put financed by short OTM call) to secure 100% free downside loss floors.
  - **Protective Puts & Capital Floor Insurance**: Calculates exact contracts, cost, and maximum loss limits for individual holdings.
  - **Covered Call Cash Yield Generation**: Generates annualized income (8-18% cash yield) with upside profit targets and breakeven adjustments.
  - **Interactive Expiration Payoff Curves**: Renders SVG profit & loss diagrams displaying unhedged stock vs hedged strategy payoffs at expiration.
- **Generative UI & Visual Analytics**:
  - **TradingView Technical & Candlestick Charts**: Institutional OHLC candlestick series with Volume profiles, EMA overlays (EMA 20/50/200), RSI (14) oscillators, and MACD histograms.
  - **Interactive Drag-and-Drop Rebalancer Canvas**: Target allocation sliders with automatic buy/sell order calculation ($ and share counts) and one-click rebalance execution.
  - **Multi-Portfolio & Account Profiles**: Seamlessly switch between distinct portfolio accounts (*Tech Momentum*, *Roth IRA Growth*, *Dividend Income Vault*, *High-Risk Crypto Sandbox*, or custom profiles) with isolated balances and local storage persistence.
  - **Voice & Multimodal Speech-to-Text**: Real-time microphone audio recognition with animated audio wave visualizers and automatic prompt insertion.
  - **Multi-Theme Engine & Live Ticker Tape**: Switch between **Bloomberg Terminal Pro** (high-density amber/green terminal), **Cyberpunk Dark** (neon glassmorphism), and **Executive Light** themes, paired with a real-time scrolling market ticker tape.
  - **Portfolio Value Over Time Line Chart**: Tracks aggregate portfolio growth vs time.
  - **Individual Asset Comparison Bar Charts**: Displays per-stock return metrics.
  - **Comprehensive Allocations Table**: Summarizes ticker details, purchased shares, average buy price, current price, total cost, current market value, and net P&L ($ and %).
  - **Interactive Generative Canvas**: Dynamically switches view modes between charts, logs, component trees, and financial metrics.

---

## 🛠 Technology Stack

### Backend Stack (Python)
- **Language**: Python `3.12+`
- **Web API Server**: [FastAPI](https://fastapi.tiangolo.com) `0.115.x` + [Uvicorn](https://www.uvicorn.org) `0.35.x`
- **Agent Orchestration**: [CrewAI](https://github.com/crewAIInc/crewAI) (`crewai.flow.flow` stateful event-driven workflow engine) `0.140.x`
- **Streaming & Protocol**: `copilotkit` `0.1.x` & `ag-ui-protocol` `0.1.x` for AG-UI event serialization
- **LLM Integration**: [LiteLLM](https://github.com/BerriAI/litellm) / OpenAI API (GPT models for tool calling & insight generation)
- **Financial Analytics**: `yfinance` `0.2.x`, `pandas` `2.3.x`, `numpy`
- **Environment & Package Management**: `uv` (Fast Python package installer and resolver)

### Frontend Stack (TypeScript / Node)
- **Framework**: [Next.js 15](https://nextjs.org) (App Router, Turbopack enabled)
- **UI Library**: [React 19](https://react.dev) & TypeScript `5.x`
- **Agent UI Framework**: `@copilotkit/react-core`, `@copilotkit/react-ui`, `@copilotkit/runtime`, `@ag-ui/client`
- **Data Visualization**: [Recharts](https://recharts.org) `3.0.x` (Responsive SVG Line & Bar Charts)
- **Styling & Aesthetics**: [Tailwind CSS 4](https://tailwindcss.com), PostCSS, Glassmorphism design tokens, CSS Modules
- **Icons**: [Lucide React](https://lucide.dev)
- **Package Manager**: `pnpm` / `npm`

---

## 📐 System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                 NEXT.JS FRONTEND                                  |
|                                                                                   |
|   +-----------------------+     +-------------------+     +-------------------+   |
|   |  Prompt Panel Input   | --> | Cash & Portfolio  | --> | Generative Canvas |   |
|   +-----------------------+     +-------------------+     +-------------------+   |
|               |                                                     ^             |
|               v                                                     |             |
|   +-----------------------------------------------------------------+---------+   |
|   | CopilotKit Runtime Endpoint (/api/copilotkit -> HttpAgent bridge)         |   |
|   +---------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------+
                                        |  HTTP POST / SSE Stream
                                        v
+-----------------------------------------------------------------------------------+
|                                 FASTAPI BACKEND                                   |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   | /crewai-agent Endpoint (AgentState & EventEncoder Generator)              |   |
|   +---------------------------------------------------------------------------+   |
|                                       |                                           |
|                                       v                                           |
|   +---------------------------------------------------------------------------+   |
|   | StockAnalysisFlow (CrewAI Workflow Engine)                                |   |
|   |                                                                           |   |
|   |  [Step 1: Extract Data] -> OpenAI Function Call (parse prompt parameters) |   |
|   |           |                                                               |   |
|   |  [Step 2: Fetch Market Data] -> yfinance API (historical prices/close)   |   |
|   |           |                                                               |   |
|   |  [Step 3: Calculate Allocation] -> Pandas/Numpy (Single Shot vs DCA)      |   |
|   |           |                                                               |   |
|   |  [Step 4: Generate Insights] -> LLM completion (Bull/Bear case cards)     |   |
|   +---------------------------------------------------------------------------+   |
|                                       |                                           |
|                                       v                                           |
|   +---------------------------------------------------------------------------+   |
|   | Server-Sent Events (SSE) Stream:                                          |   |
|   | (RunStarted -> StateSnapshot -> StateDelta -> ToolCallArgs -> RunFinished)|   |
|   +---------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 🔍 Backend Implementation Details

Located in the `agent/` directory:

### 1. `agent/main.py`
- **FastAPI Application**: Exposes the primary endpoint `@app.post("/crewai-agent")`.
- **`AgentState` Data Model**: Extends `CopilotKitState` to track execution context:
  - `tools`: Available AG-UI tools.
  - `messages`: Active user/assistant conversation history.
  - `be_stock_data` & `be_arguments`: Structured outputs from stock analytics.
  - `available_cash`: Remaining liquid cash balance.
  - `investment_portfolio`: Current holdings array.
  - `tool_logs`: Real-time execution logs pushed to UI.
- **Event Generator & SSE Streamer**:
  - Encodes events using `EventEncoder` from `ag_ui.encoder`.
  - Dispatches `RunStartedEvent`, `StateSnapshotEvent`, `StateDeltaEvent`, `ToolCallStartEvent`, `ToolCallArgsEvent`, `ToolCallEndEvent`, and `RunFinishedEvent`.
  - **Flicker Mitigation Logic**: Intercepts and filters high-frequency intermediate state deltas while charts render to prevent UI layout shift and flickering.

### 2. `agent/stock_analysis.py`
- **`StockAnalysisFlow` (CrewAI Flow Class)**: Manages stateful flow execution via decorators (`@start`, `@listen`):
  - **`extract_relevant_data`**: Invokes LLM with function schema `extract_relevant_data_from_user_prompt` to extract ticker symbols, investment amounts, start dates, and intervals.
  - **`fetch_and_calculate_stock_data`**: Downloads ticker histories via `yfinance.Ticker()`. Computes total invested dollars, share count, current value, P&L percentage, and time-series line chart datasets.
  - **`generate_insights_flow`**: Calls LLM using `generate_insights` tool schema to generate structured Bull & Bear analytical points with descriptions and emojis.
- **Financial Calculation Helpers**:
  - Support for `single_shot` purchases (buying full dollar amount on start date).
  - Support for periodic interval purchasing (`1d`, `1mo`, `1y`, etc.) via Pandas resampled date ranges.

### 3. `agent/prompts.py`
- Contains system prompts guiding LLM behavior for financial extraction accuracy and professional tone during insight generation.

---

## 🎨 Frontend Implementation Details

Located in the `frontend/` directory:

### 1. `frontend/src/app/page.tsx`
- **Main Dashboard Shell**: Integrates CopilotKit hooks (`useCopilotReadable`, `useCopilotAction`, `useCopilotContext`).
- Registers `render_standard_charts_and_table` frontend tool action, allowing the backend AI agent to render rich UI components dynamically into the canvas.
- Features custom state persistence for user cash, portfolio items, and selected dashboard tabs.

### 2. `frontend/src/app/api/copilotkit/route.ts`
- Sets up Next.js App Router POST handler using `CopilotRuntime` and `copilotRuntimeNextJSAppRouterEndpoint`.
- Connects directly to backend FastAPI service via AG-UI `HttpAgent` (`http://127.0.0.1:8000/crewai-agent`).

### 3. Key Components (`frontend/src/app/components/`)
- **`cash-panel.tsx`**: Top header panel displaying current liquid cash, total invested capital, net profit/loss, and portfolio reset controls.
- **`prompt-panel.tsx`**: Interactive command bar with quick preset prompt buttons (e.g., *"Analyze Tech Giants: AAPL, MSFT, GOOGL with $10k each"*).
- **`generative-canvas.tsx`**: Centerpiece container rendering tab views for Charts, Investment Allocation Table, Bull/Bear Insights, Component Tree, and Tool Logs.
- **`tool-logs.tsx`**: Execution console showing live status steps of agent tool calls (*"Extracting parameters..."*, *"Fetching Yahoo Finance data..."*, *"Calculating P&L..."*).
- **Chart Components (`chart-components/`)**:
  - `line-chart.tsx`: Customized Recharts LineChart with gradient area fills, tooltips, responsive bounds, and currency formatting.
  - `bar-chart.tsx`: Comparative bar visualization per asset.
  - `allocation-table.tsx`: Styled financial table highlighting metrics, share counts, buy prices, current prices, and color-coded gain/loss badges.
  - `insight-card.tsx`: Card widgets for Bull/Bear insights with emoji badges and dark-mode styling.

---

## 📁 Repository Structure

```
stock-portfolio-analysis-agent/
├── agent/                         # FastAPI & CrewAI Backend
│   ├── .env                       # Backend Environment Secrets (OPENAI_API_KEY)
│   ├── main.py                    # FastAPI server & AG-UI SSE stream handler
│   ├── stock_analysis.py          # CrewAI Flow, yfinance loader & backtester
│   └── prompts.py                 # System prompt templates
├── frontend/                      # Next.js 15 CopilotKit Frontend
│   ├── .env                       # Frontend Environment Configuration
│   ├── package.json               # Node dependencies
│   ├── next.config.ts             # Next.js configuration
│   └── src/
│       ├── app/
│       │   ├── api/copilotkit/    # CopilotKit Runtime route handler
│       │   ├── components/        # UI Panels, Canvas, Tool Logs, Charts
│       │   ├── globals.css        # Global CSS & Tailwind styles
│       │   ├── layout.tsx         # Next.js Root Layout & Theme Provider
│       │   └── page.tsx           # Main Portfolio Dashboard Page
│       └── utils/                 # Utility helper functions
├── pyproject.toml                 # Python project configuration & uv dependencies
├── uv.lock                        # Locked Python dependency versions
├── README.md                      # Project quick-start README
└── PROJECT_OVERVIEW.md            # Exhaustive Technical Documentation (This File)
```

---

## ⚙️ Setup & Environment Configuration

### Prerequisites
- **Python**: `>=3.12` (Managed with `uv` recommended)
- **Node.js**: `>=18.x` (Managed with `pnpm` or `npm`)
- **OpenAI API Key**: Valid key for GPT model completion & function calling.

### Environment Setup

1. **Backend Secrets (`agent/.env`)**:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

2. **Frontend Secrets (`frontend/.env`)**:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   NEXT_PUBLIC_CREWAI_URL=http://127.0.0.1:8000/crewai-agent
   ```

### Execution Commands

1. **Start Backend Server**:
   ```bash
   # In root directory
   uv sync
   uv run python agent/main.py
   ```
   *The FastAPI server will start on `http://127.0.0.1:8000`.*

2. **Start Frontend Development Server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The Next.js UI will be accessible at `http://localhost:3000`.*

---

## 📌 Major & Minor Technical Highlights

### Major Technical Highlights
1. **Asynchronous Multi-Stage CrewAI Workflow**: Separates parsing, market data fetching, mathematical modeling, and textual reasoning into discrete flow steps, enabling deterministic reliability over single-prompt LLM generation.
2. **AG-UI Protocol Integration**: Uses specialized AG-UI state event types (`StateSnapshotEvent`, `StateDeltaEvent`, `ToolCallArgsEvent`) to stream structured state updates directly into React component props.
3. **Generative UI Tool Execution**: Rather than returning raw markdown text, the AI agent dynamically triggers client-side React rendering (`render_standard_charts_and_table`), providing visual chart components inside the dashboard.
4. **Flexible Investment Backtesting**: Fully supports lump-sum vs Dollar Cost Averaging across arbitrary historical dates, dynamically fetching accurate splits and historical pricing.

### Minor Technical Highlights
1. **Flicker Mitigation Async Queueing**: The event queue in `main.py` blocks low-priority text message updates while chart data is streaming, ensuring high-frequency UI updates don't cause chart component flickering.
2. **Dual Portfolio Tracking (Live vs Sandbox)**: The extraction tool flags `to_be_added_in_portfolio`, letting users simulate hypothetical trades in a sandbox without altering their actual portfolio holdings.
3. **Graceful Market Data Fallbacks**: Handles non-trading days, stock splits, missing dividend records, and invalid ticker symbols without crashing the agent flow.
4. **Dynamic Cash Balance Auditing**: Verifies available user cash before confirming allocations, preventing negative cash balances during portfolio creation.

---
*Documentation compiled automatically for Stock Portfolio Analysis Agent codebase.*
