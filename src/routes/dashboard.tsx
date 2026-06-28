import { createFileRoute } from "@tanstack/react-router";
import { TickerRail } from "@/components/shell";
import { TierSelector } from "@/components/tier-selector";
import { KpiCard } from "@/components/kpi-card";
import { SectorHeatmap } from "@/components/sector-heatmap";
import { SectorRotation } from "@/components/sector-rotation";
import { IndexSpotlight } from "@/components/index-spotlight";
import { GoalTracker } from "@/components/goal-tracker";
import { AlertsFeed } from "@/components/alerts-feed";
import { AiInsightsPanel } from "@/components/ai-insights-panel";
import { SipCalendar } from "@/components/sip-calendar";
import { YieldCurveChart } from "@/components/yield-curve";
import { usePortfolioMetrics } from "@/hooks/use-portfolio-metrics";
import { formatCurrency, formatPct } from "@/lib/utils";
import { Wallet, TrendingUp, Activity, Repeat, Target, ShieldAlert } from "lucide-react";
import { useMarketStore } from "@/lib/store";
import { sessionFor } from "@/lib/market-sim";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · FinPulse AI" },
      { name: "description", content: "Real-time portfolio command center: KPIs, sectoral heatmap, SIP calendar, yield curve, alerts, and AI rebalancing." },
      { property: "og:title", content: "FinPulse AI Dashboard" },
      { property: "og:description", content: "All your investing KPIs and AI insights on one screen." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const m = usePortfolioMetrics();
  const sessionIN = sessionFor("IN");
  const sessionUS = sessionFor("US");

  return (
    <div>
      <TickerRail />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Command Center</h1>
            <p className="text-sm text-muted-foreground">
              Markets · IN <SessionBadge state={sessionIN} /> · US <SessionBadge state={sessionUS} /> · Crypto <SessionBadge state="open" />
            </p>
          </div>
          <TierSelector />
        </div>

        {/* KPI strip */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Portfolio Value" value={formatCurrency(m.totalValueINR)} delta={m.dayPnlPct} hint={formatCurrency(m.dayPnlINR)} icon={Wallet} accent="primary" />
          <KpiCard label="Day P&L" value={formatCurrency(m.dayPnlINR)} delta={m.dayPnlPct} icon={TrendingUp} accent={m.dayPnlPct >= 0 ? "gain" : "loss"} />
          <KpiCard label="XIRR (est.)" value={formatPct(m.xirr, 1)} hint="annualized" icon={Activity} />
          <KpiCard label="Active SIPs" value={String(m.sipActive)} hint={`${formatCurrency(m.monthlySipINR)}/mo`} icon={Repeat} />
          <KpiCard label="Goal Progress" value={`${Math.round(avgGoalProgress(m.goals))}%`} hint={`${m.goals.length} goals`} icon={Target} />
          <KpiCard label="Risk Score" value={`${m.riskScore}/100`} hint={m.riskScore > 70 ? "Aggressive" : m.riskScore > 45 ? "Balanced" : "Conservative"} icon={ShieldAlert} accent={m.riskScore > 70 ? "loss" : "neutral"} />
        </div>

        {/* Bento grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2"><SectorHeatmap /></div>
          <div><AiInsightsPanel /></div>
          <div><IndexSpotlight /></div>
          <div><SectorRotation /></div>
          <div><GoalTracker /></div>
          <div className="lg:col-span-2"><SipCalendar /></div>
          <div><YieldCurveChart /></div>
          <div className="lg:col-span-3"><AlertsFeed /></div>
        </div>
      </div>
    </div>
  );
}

function avgGoalProgress(goals: { currentINR: number; targetINR: number }[]) {
  if (goals.length === 0) return 0;
  return goals.reduce((s, g) => s + Math.min((g.currentINR / g.targetINR) * 100, 100), 0) / goals.length;
}

function SessionBadge({ state }: { state: "open" | "closed" | "pre" | "after" }) {
  const cfg = {
    open: { dot: "text-gain", label: "open" },
    closed: { dot: "text-muted-foreground", label: "closed" },
    pre: { dot: "text-warn", label: "pre" },
    after: { dot: "text-info", label: "after" },
  }[state];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
      <span className={`pulse-dot inline-block size-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// also re-use the store so subscription stays alive even if no subcomponent reads it
useMarketStore;
