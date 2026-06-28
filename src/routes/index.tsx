import { createFileRoute, Link } from "@tanstack/react-router";
import { TickerRail } from "@/components/shell";
import { Sparkles, LineChart, Target, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinPulse AI — Real-time markets, smarter SIPs" },
      { name: "description", content: "An AI-powered financial command center: real-time global markets, sectoral KPIs, OKR goal tracking, and tier-aware SIP, MF, and debt rebalancing." },
      { property: "og:title", content: "FinPulse AI — Real-time markets, smarter SIPs" },
      { property: "og:description", content: "Decide faster across SIPs, MFs and debt with one AI-narrated dashboard." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div>
      <TickerRail />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3" /> AI-powered financial command center
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              One screen of truth for your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SIPs, MFs &amp; debt</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              Real-time global markets, sectoral KPIs, and OKR goal tracking — narrated by an AI that knows whether you're a Low, Medium, or High net-worth investor and tunes its advice to fit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                Open the dashboard <ArrowRight className="size-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-surface-2">
                How it works
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">No signup · Sample portfolios · All data simulated for demo</p>
          </div>
          <div className="relative">
            <div className="card-surface relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              <div className="relative grid grid-cols-2 gap-3">
                {HERO_KPIS.map((k) => (
                  <div key={k.label} className="rounded-lg border border-border bg-surface-2/80 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
                    <p className="num mt-1 text-xl font-semibold">{k.value}</p>
                    <p className={`num text-xs ${k.tone === "gain" ? "text-gain" : k.tone === "loss" ? "text-loss" : "text-muted-foreground"}`}>{k.delta}</p>
                  </div>
                ))}
              </div>
              <div className="relative mt-4 rounded-lg border border-border bg-surface-2/80 p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-primary" />
                  <p className="text-xs font-semibold">AI suggestion</p>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  "Trim small-cap SIP by 20% — concentration in Sun Pharma + SBI Small Cap has crossed 38%. Redirect inflow to Corporate Bond Fund for the next 2 months."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-surface p-5">
              <f.icon className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const HERO_KPIS = [
  { label: "Portfolio", value: "₹1.42 Cr", delta: "+0.42%", tone: "gain" },
  { label: "Day P&L", value: "+₹59,820", delta: "vs ₹1.41 Cr", tone: "gain" },
  { label: "XIRR", value: "14.8%", delta: "12-mo trailing", tone: "neutral" },
  { label: "Goal progress", value: "42%", delta: "Retire by 55", tone: "neutral" },
];

const FEATURES = [
  { title: "Real-time KPIs", body: "Live ticker rail, sectoral heatmap, and intraday index spotlight across IN, US, and crypto.", icon: LineChart },
  { title: "OKR goal tracking", body: "Retirement, education, and legacy goals with the SIP step-up math required to stay on track.", icon: Target },
  { title: "Tier-aware AI", body: "Same data, different playbook — Low, Medium, and High net-worth tiers each get distinct recommendations.", icon: Sparkles },
  { title: "Risk-first design", body: "Concentration alerts, lock-in awareness, and color-blind safe gain/loss cues built in.", icon: ShieldCheck },
];
