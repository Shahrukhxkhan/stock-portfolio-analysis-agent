# Stock Portfolio Agent

This project demonstrates an AI agent that streams stock portfolio analysis workflows in real time. Built with **CrewAI** (backend), **React / Next.js** (frontend), and **CopilotKit's AG-UI Protocol**, users can observe the agent fetching stock data, performing portfolio allocations, and generating insights live.

📖 **For exhaustive technical documentation, architecture details, and full feature specs, see [PROJECT_OVERVIEW.md](file:///d:/PROJECTS/stock-portfolio-analysis-agent/PROJECT_OVERVIEW.md).**

## Tech Stack
- **Frontend UI**: [React 19](https://react.dev) + [Next.js 15](https://nextjs.org) + [Recharts](https://recharts.org) + [Tailwind CSS 4](https://tailwindcss.com)
- **Backend API**: [FastAPI](https://fastapi.tiangolo.com) + [Uvicorn](https://www.uvicorn.org)
- **Streaming & Protocol**: [CopilotKit](https://github.com/CopilotKit/CopilotKit) + AG-UI Protocol
- **Agent Workflow**: [CrewAI](https://github.com/crewAIInc/crewAI) (`crewai.flow.flow`)
- **Market Data**: [yfinance](https://github.com/ranaroussi/yfinance) and [pandas](https://pandas.pydata.org)

## Quick Setup

1. **Install Dependencies**:
   ```bash
   uv sync
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

2. **Environment Variables**:
   - `agent/.env` (backend):
     ```env
     OPENAI_API_KEY=your-openai-api-key
     ```
   - `frontend/.env` (frontend):
     ```env
     OPENAI_API_KEY=your-openai-api-key
     NEXT_PUBLIC_CREWAI_URL=http://127.0.0.1:8000/crewai-agent
     ```

3. **Run the App**:
   ```bash
   # Start backend
   uv run python agent/main.py

   # In another terminal, start frontend
   cd frontend
   npm run dev
   ```

## Usage

1. **Open the UI**: Visit `http://localhost:3000`.
2. **Run Stock Analysis**: Ask for portfolio analysis (e.g., *"Analyze AAPL and MSFT with $10k each over the last year"*).
3. **Watch Live Progress**: Streamed tool calls, execution steps, charts, and insights render live on screen.

## Documentation
Refer to [`PROJECT_OVERVIEW.md`](file:///d:/PROJECTS/stock-portfolio-analysis-agent/PROJECT_OVERVIEW.md) for full implementation details, architecture diagrams, and feature breakdowns.

