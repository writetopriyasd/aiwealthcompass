import { createFileRoute } from "@tanstack/react-router";
import { TickerRail } from "@/components/shell";
import { TierSelector } from "@/components/tier-selector";
import { SipCalendar } from "@/components/sip-calendar";
import { GoalTracker } from "@/components/goal-tracker";
import { useMarketStore } from "@/lib/store";
import { PORTFOLIOS } from "@/data/portfolios";
import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/sip-planner")({
  head: () => ({
    meta: [
      { title: "SIP Planner · FinPulse AI" },
      { name: "description", content: "Project SIP corpus growth with step-up and expected return assumptions, tuned per net-worth tier." },
      { property: "og:title", content: "SIP Planner · FinPulse AI" },
      { property: "og:description", content: "See how step-up SIPs compound across 5–25 year horizons." },
    ],
  }),
  component: SipPlanner,
});

function SipPlanner() {
  const tier = useMarketStore((s) => s.tier);
  const seed = PORTFOLIOS[tier];
  const totalMonthly = seed.sips.reduce((s, sip) => s + sip.monthly, 0);
  const [monthly, setMonthly] = useState(totalMonthly);
  const [returnPct, setReturnPct] = useState(12);
  const [stepUp, setStepUp] = useState(10);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    const out: { year: number; invested: number; value: number }[] = [];
    let corpus = 0;
    let invested = 0;
    let currentMonthly = monthly;
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        corpus = corpus * (1 + returnPct / 100 / 12) + currentMonthly;
        invested += currentMonthly;
      }
      out.push({ year: y, invested, value: corpus });
      currentMonthly = currentMonthly * (1 + stepUp / 100);
    }
    return out;
  }, [monthly, returnPct, stepUp, years]);

  const final = data[data.length - 1];

  return (
    <div>
      <TickerRail />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">SIP Planner</h1>
            <p className="text-sm text-muted-foreground">Step-up compounding projector — defaults seeded from your tier.</p>
          </div>
          <TierSelector />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="card-surface space-y-4 p-4">
            <Slider label="Starting monthly SIP" value={monthly} onChange={setMonthly} min={1000} max={1000000} step={1000} format={formatCurrency} />
            <Slider label="Expected annual return" value={returnPct} onChange={setReturnPct} min={4} max={20} step={0.5} format={(v) => `${v}%`} />
            <Slider label="Annual step-up" value={stepUp} onChange={setStepUp} min={0} max={25} step={1} format={(v) => `${v}%`} />
            <Slider label="Horizon (years)" value={years} onChange={setYears} min={3} max={30} step={1} format={(v) => `${v} yr`} />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Stat label="Total invested" value={formatCurrency(final.invested)} />
              <Stat label="Projected corpus" value={formatCurrency(final.value)} accent />
            </div>
          </div>
          <div className="card-surface p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold">Corpus growth</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 16 }}>
                  <defs>
                    <linearGradient id="g-val" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g-inv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `Y${v}`} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => formatCurrency(v).replace("₹", "₹")} width={70} />
                  <Tooltip
                    contentStyle={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any) => formatCurrency(Number(v))}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  <Area type="monotone" dataKey="invested" stroke="var(--color-accent)" strokeWidth={2} fill="url(#g-inv)" />
                  <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#g-val)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="lg:col-span-2"><SipCalendar /></div>
          <div><GoalTracker /></div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step, format }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step: number; format: (v: number) => string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="num font-medium">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-primary"
      />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`num mt-1 text-lg font-semibold ${accent ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
