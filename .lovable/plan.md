
# FinPulse AI — Real-Time Markets & SIP/MF Intelligence Dashboard

A public demo platform that streams simulated global market data (India NSE/BSE, US NYSE/Nasdaq, crypto) into a rich KPI/OKR dashboard, with an AI assistant that analyzes a sample portfolio and recommends SIP/MF/debt rebalancing across Low / Medium / High net-worth tiers.

---

## Hypotheses (the bets this plan makes)

1. **Decision friction, not data scarcity, is the real problem.** HNIs/MNIs already have data; they lack a single glanceable surface that fuses macro + sector + portfolio + AI narrative. So the UI optimizes for *one screen of truth* over deep drill-downs.
2. **Net-worth tier changes the right answer.** A "rebalance" suggestion for a ₹5L SIP investor differs from a ₹5Cr portfolio (tax efficiency, debt ladder, alternatives). Tier is a first-class filter, not a profile setting.
3. **Simulated tick data is acceptable for the demo** because the value prop is the *analytical layer* (KPIs, AI narrative, rebalancing logic), not feed latency. Real broker APIs are a v2 swap behind a single adapter.
4. **AI is most useful as a "why" layer, not a "what" layer.** Charts answer *what* moved; the AI panel answers *why it matters to this portfolio* and *what to do about SIPs next month*.
5. **Public demo (no auth) is enough to validate UX.** A seeded sample portfolio + tier toggle proves the concept without onboarding drag. Persistence is a v2 concern.
6. **OKR framing resonates with HNIs** more than raw returns — goals like "Retire by 55 with ₹8Cr corpus" map naturally to SIP step-up math.

---

## Edge Cases Identified

**Data & feed**
- Market closed / weekend / holiday — show last-close snapshot with a "Markets closed" ribbon; AI narrative shifts to weekly recap mode.
- Cross-timezone overlap (IST vs ET vs crypto 24/7) — every timestamp shows local + market-local time; sector cards label their session state (Pre/Open/Closed/After).
- Currency mixing (INR + USD holdings) — single base currency toggle (INR default); FX shown as a KPI; never silently sum across currencies.
- Mock feed gaps / NaN ticks — smoothing layer drops invalid ticks; sparklines never break a line, they show a dotted segment.
- Extreme volatility spikes — auto-rescale Y axis with a "zoomed" badge so users don't misread a 0.2% move as a crash.

**Portfolio & math**
- Empty portfolio (tier switched before holdings load) — show skeleton + "Add a sample holding" CTA, not zeros that look like losses.
- SIP date falling on holiday — next-business-day projection.
- Negative XIRR / loss-making MFs — color, don't hide; AI must explicitly flag rather than recommend "average down" blindly.
- Debt instruments with lock-in (ELSS, tax-free bonds) — rebalancer must respect lock-in and surface it as a constraint, not silently ignore.
- Concentration risk (>40% in one sector/AMC) — dedicated alert card.
- Tier mismatch (user marks Low net worth but seeds a ₹10Cr portfolio) — warning banner, don't crash AI prompt.

**AI layer**
- LLM hallucinated tickers / fund names — AI is constrained to the seeded universe; any out-of-universe symbol is filtered before render.
- Rate limit (429) and credits exhausted (402) from Lovable AI Gateway — surfaced inline in the AI card with a retry, never a blank panel.
- Slow AI response — stream tokens; show "Analyzing 47 holdings…" progress, not a spinner.
- Schema-too-large for Gemini structured output — keep rebalance schema flat and short; long enums passed in prompt + validated in code.
- Regulatory / advice disclaimer — every AI recommendation card carries "Educational, not investment advice" footer.

**UX & device**
- Mobile (chart density) — KPI grid collapses to horizontal snap-scroll; heatmaps switch to a ranked list.
- Reduced motion preference — disable tick animations and number roll-ups.
- Color-blind safety — gains/losses use shape + arrow + color, not color alone.
- SSR / first paint — loaders prime React Query cache with seeded snapshot so the dashboard renders meaningful numbers on first byte, not zeros.

---

## Product Surface (routes)

```
/                      Landing → hero, live ticker strip, "Open Dashboard" CTA
/dashboard             Main real-time command center (default route after landing)
/markets               Global markets deep dive (regions, sectors, heatmap)
/portfolio             Sample portfolio + holdings table + allocation donut
/sip-planner           SIP/MF goal planner with tier-aware projections
/ai-insights           Full-page AI conversation + rebalancing recommendations
/about                 Methodology, data source disclosure, disclaimers
```

Each route has its own `head()` with unique title/description/OG metadata. Hash anchors are not used for primary nav.

---

## Dashboard Composition (`/dashboard`)

Single-screen "command center" laid out as a bento grid:

1. **Top ticker rail** — global indices: NIFTY50, SENSEX, BANKNIFTY, S&P500, NASDAQ, DJIA, BTC, ETH, USD/INR, Gold. Live tick animation.
2. **Tier selector** — segmented control: `Low (<₹25L)` · `Medium (₹25L–₹2Cr)` · `High (>₹2Cr)`. Drives portfolio seed + AI prompt.
3. **KPI strip (6 cards)** — Portfolio Value, Day P&L, XIRR, SIP Active Count, Goal Progress %, Risk Score.
4. **Sectoral heatmap** — treemap of 11 GICS sectors × region tabs (IN / US / Global). Cell size = market cap, color = day change.
5. **Sector rotation chart** — relative strength of sectors over 1W/1M/3M.
6. **OKR / Goal tracker** — 2–3 goals (Retirement, House, Child Education) with progress bars + required monthly SIP delta.
7. **AI Insights panel** — streaming narrative: "Why your portfolio is up 0.4% today" + 3 ranked rebalancing actions.
8. **SIP inflow calendar** — next 30 days of scheduled SIP debits with cumulative inflow.
9. **Debt yield curve** — G-Sec/Treasury yield curve with duration markers for user's debt MFs.
10. **Alerts feed** — anomaly cards (sector >2σ move, fund downgrade, concentration breach).

---

## Tech Plan

**Stack:** TanStack Start (already provisioned) + TanStack Query + Tailwind v4 + Recharts (KPI charts) + Lovable AI Gateway (no auth, no Cloud needed for v1).

**Mock real-time feed**
- `src/lib/market-sim.ts` — geometric Brownian motion tick generator seeded per symbol with realistic volatility (equities ~1%, crypto ~3%, FX ~0.3%).
- Browser-side `setInterval` (1s tick) feeding a Zustand store; React Query for snapshots, store for ticks.
- Session-state aware: respects market hours per region; weekends = flat with crypto only live.

**Seeded data**
- `src/data/universe.ts` — ~80 instruments across regions, sectors, MF schemes, debt instruments, with realistic metadata.
- `src/data/portfolios.ts` — three sample portfolios keyed by tier.
- `src/data/goals.ts` — sample OKRs per tier.

**AI integration**
- Server function `src/lib/ai.functions.ts` (`createServerFn`) calling Lovable AI Gateway via `@ai-sdk/openai-compatible`.
- Model: `google/gemini-3-flash-preview`.
- Two functions:
  - `explainMarket({ tier, portfolioSnapshot, marketSnapshot })` → streamed narrative.
  - `recommendRebalance(...)` → structured output (small flat schema: `actions: [{ symbol, action, rationale, confidence }]`).
- Prompt constrains tickers to seeded universe; post-validation drops anything else.
- Errors (429/402) surfaced inline in the AI card.

**Charts**
- Recharts for line/area/bar/treemap; custom canvas sparkline for tick rail (perf).
- Reduced-motion + color-blind tokens baked into the theme.

**Design system**
- Dark-first finance aesthetic: deep slate background, neon-mint gains, coral losses, amber alerts. Mono-numerics font for all numbers (JetBrains Mono via @fontsource). Headings in Outfit, body in Inter.
- All colors as semantic tokens in `src/styles.css` (no hardcoded hex in components).

---

## Build Order

1. Design system tokens + fonts + landing page shell.
2. Mock market simulator + Zustand tick store + seeded universe.
3. `/dashboard` skeleton with KPI strip, ticker rail, tier selector.
4. Sectoral heatmap + sector rotation + alerts feed.
5. `/portfolio` and `/sip-planner` with goal math.
6. AI server functions + AI Insights panel (streaming) + rebalancer card.
7. `/markets`, `/ai-insights`, `/about` routes with proper SEO heads.
8. Edge-case polish: market-closed ribbon, holiday handling, mobile heatmap fallback, reduced motion, color-blind shapes, AI error states.

---

## Out of Scope for v1 (called out so we can defer cleanly)

- Real broker/exchange APIs, real-money execution, KYC.
- User accounts, saved portfolios, multi-user data (no Lovable Cloud).
- Push/email alerts.
- Options, futures, derivatives analytics.
- Tax computation engine (only surfaced as a constraint, not calculated).

Disclaimers ("Educational, not investment advice") appear on every AI output and in the footer.
