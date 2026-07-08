[FinPulse AI – Real-time markets, smarter SIPs](https://bit.ly/4ybnYNe) <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/f4e2774a-c1ae-4327-ab29-030b4c1fd0a5" />

FinPulse AI is an educational, AI-assisted portfolio dashboard that simulates how Indian investors could monitor SIPs, mutual funds, and debt products in one real-time, narrative-led interface. It focuses on making complex market data and goal tracking feel intuitive, especially for users in different net-worth tiers. [aiwealthcompass.lovable](https://aiwealthcompass.lovable.app/)

> Note: All market and portfolio data in this prototype is simulated and for demonstration only. [aiwealthcompass.lovable](https://aiwealthcompass.lovable.app/)

***

## Live demo

- Web app: https://aiwealthcompass.lovable.app/ [aiwealthcompass.lovable](https://aiwealthcompass.lovable.app/)
- Status: Public demo, no signup required, sample portfolios only. [aiwealthcompass.lovable](https://aiwealthcompass.lovable.app/)

***

## Problem statement

Most retail investors in India juggle multiple apps to track SIPs, mutual funds, and loans, often lacking a consolidated view of risk, goals, and cash flows.  
FinPulse AI explores how a single AI-narrated dashboard can:

- Provide one “screen of truth” across SIPs, MFs, and debt.
- Translate raw market data into tier-aware, plain-language advice.  
- Keep long-term goals (retirement, education, legacy) anchored to actual portfolio behavior. 
***

## Key features

- **AI-powered financial command center**  
  Single dashboard for market tickers, portfolio metrics, and AI commentary tailored to Low, Medium, and High net-worth investors. 

- **Real-time (simulated) market rail**  
  Live-style ticker showing Indian indices (NIFTY50, SENSEX, BANKNIFTY, NIFTYIT) along with global indices, currencies, commodities, and crypto. 

- **Portfolio overview**  
  Snapshot of total portfolio value, day P&L, and 12‑month trailing XIRR to approximate performance over time. 

- **Goal-based tracking**  
  OKR-style progress for goals like “Retire by 55,” with SIP step-up logic to stay on track. 

- **Tier-aware AI insights**  
  AI suggestions that differ by investor tier (Low/Medium/High net-worth), e.g. concentration alerts and rebalancing nudges.

- **Risk-first UX**  
  Visual cues for concentration, lock-in awareness, and color-blind safe gain/loss indicators. 
***

## AI insight example

A sample AI suggestion from the dashboard:

> “Trim small-cap SIP by 20% — concentration in Sun Pharma + SBI Small Cap has crossed 38%. Redirect inflow to Corporate Bond Fund for the next 2 months.” 

This showcases how the system surfaces concentrated risk and suggests short-term allocation tweaks, while remaining clearly labeled as non-advisory. 

***

## Architecture overview

> This section is intentionally technology-agnostic so you can adapt it to the actual stack used in your implementation.

- **Frontend**  
  - Single-page application dashboard (responsive, desktop-first)  
  - Navigation across Home, Dashboard, Markets, Portfolio, SIP Planner, AI Insights, and About sections.

- **Data layer**  
  - Simulated quotes for indices, FX, commodities, and crypto (no real-time feeds). 
  - Mock portfolio holdings and SIP schedules to demonstrate analytics.

- **AI / logic**  
  - Rule-based + prompt-driven templates for tier-aware recommendations (Low/Medium/High net-worth). 
  - Goal progress and XIRR calculations on simulated data. 

***

## User journeys

1. **Market pulse first**  
   - Land on Home → scan ticker rail for NIFTY50, SENSEX, global indices, BTC, ETH, USDINR, etc. 
   - Click “Open Dashboard” to view portfolio and AI commentary in context. 

2. **Goal-first investor**  
   - Navigate to Dashboard → focus on “Retire by 55” or similar goals and see % completion, SIP requirements, and step-up needs.
   - Use AI suggestions to rebalance between equity and debt exposure.

3. **Risk-conscious user**  
   - Leverage concentration alerts and lock-in awareness cues before changing SIP allocations.
   - Use the SIP Planner and AI Insights to experiment with what-if scenarios.

***

## Design principles

- **Narrative over numbers**  
  Lead with a simple story (“what should I do next?”) before deep metrics. 

- **Tier-aware personalization**  
  Same data, different playbooks for Low, Medium, and High net-worth segments. 

- **Safety-first communication**  
  Repeated, explicit disclaimers: educational demo only, not investment advice. 

- **Accessibility**  
  Color-blind safe gain/loss cues and clear typography for long-form AI text. 

***

## PM scope and contributions

This project is part of my Product Management portfolio. My responsibilities included:

- Problem discovery and user journey definition for Indian SIP/MF investors.  
- Defining feature scope for Dashboard, Markets, Portfolio, SIP Planner, AI Insights, and About flows. 
- Writing product copy for tier-aware AI suggestions, goal narratives, and risk alerts. 
- Specifying success metrics (engagement with AI insights, goal completion views, rebalance actions).  
- Collaborating with design and engineering on IA, component behavior, and guardrails for non-advisory positioning. 

***

## How to run locally

> Adapt this section to your actual tech stack. Replace placeholders once your repo structure is finalized.

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# 2. Install dependencies
# Example for a JavaScript/TypeScript SPA:
npm install

# 3. Run the development server
npm run dev

# 4. Open in browser
# Usually http://localhost:3000 or as per your dev server config
```

***

## Disclaimers

- All prices, tickers, and portfolio values are simulated and do not represent real financial data. 
- FinPulse AI is an educational prototype only and does not provide investment, legal, or tax advice.
- Any examples or suggestions are illustrative and should not be acted upon without consulting a qualified financial advisor.



