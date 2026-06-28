import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateInsight, type RebalanceResult } from "@/lib/ai.functions";
import { usePortfolioMetrics } from "@/hooks/use-portfolio-metrics";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_TONE: Record<string, string> = {
  INCREASE_SIP: "text-gain bg-gain-soft",
  START_SIP: "text-gain bg-gain-soft",
  ACCUMULATE: "text-gain bg-gain-soft",
  DECREASE_SIP: "text-warn bg-warn-soft",
  PAUSE_SIP: "text-warn bg-warn-soft",
  TRIM: "text-loss bg-loss-soft",
  HOLD: "text-muted-foreground bg-surface-3",
};

export function AiInsightsPanel() {
  const metrics = usePortfolioMetrics();
  const run = useServerFn(generateInsight);
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "ok"; data: RebalanceResult }
    | { kind: "err"; msg: string }
  >({ kind: "idle" });

  async function analyze() {
    setState({ kind: "loading" });
    try {
      const res = await run({
        data: {
          tier: metrics.tier,
          portfolioValueINR: metrics.totalValueINR,
          dayPnlPct: metrics.dayPnlPct,
          xirr: metrics.xirr,
          topGainers: metrics.topGainers,
          topLosers: metrics.topLosers,
          concentration: metrics.bySector.slice(0, 4).map((s) => ({ bucket: s.sector, pct: s.pct })),
          sectorMoves: metrics.bySector.slice(0, 6).map((s) => ({ sector: s.sector, changePct: s.dayChangePct })),
        },
      });
      if (res.ok) setState({ kind: "ok", data: res.data });
      else setState({ kind: "err", msg: res.error });
    } catch (e) {
      setState({ kind: "err", msg: e instanceof Error ? e.message : "Unknown error" });
    }
  }

  return (
    <div className="card-surface flex flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="size-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold">AI Rebalancing Insights</h3>
        </div>
        <button
          onClick={analyze}
          disabled={state.kind === "loading"}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {state.kind === "loading" ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
          {state.kind === "ok" ? "Re-analyze" : "Analyze portfolio"}
        </button>
      </div>

      {state.kind === "idle" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-center">
          <Sparkles className="size-6 text-primary/60" />
          <p className="text-sm font-medium">Tier-aware rebalancing analysis</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            Run an AI pass over your {metrics.tier === "high" ? "High Net-Worth" : metrics.tier === "medium" ? "Established" : "Emerging"} portfolio for SIP, MF, and debt actions grounded in today's market moves.
          </p>
        </div>
      )}

      {state.kind === "loading" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          Analyzing {metrics.holdings.length} holdings across {metrics.bySector.length} sectors…
        </div>
      )}

      {state.kind === "err" && (
        <div className="flex flex-1 items-start gap-2 rounded-lg border border-loss/40 bg-loss-soft p-3 text-sm text-loss">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Couldn't generate insights</p>
            <p className="mt-1 text-xs opacity-90">{state.msg}</p>
            <button onClick={analyze} className="mt-2 rounded-md border border-loss/40 px-2 py-1 text-xs hover:bg-loss/10">Retry</button>
          </div>
        </div>
      )}

      {state.kind === "ok" && (
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-sm leading-relaxed text-foreground">{state.data.narrative}</p>
          <ul className="space-y-2">
            {state.data.actions.map((a, i) => (
              <li key={i} className="rounded-lg border border-border bg-surface-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", ACTION_TONE[a.action])}>
                      {a.action.replace(/_/g, " ")}
                    </span>
                    <span className="num text-sm font-semibold">{a.symbol}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">conf · {a.confidence}</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{a.rationale}</p>
              </li>
            ))}
          </ul>
          {state.data.riskFlags.length > 0 && (
            <div className="rounded-lg border border-warn/40 bg-warn-soft/50 p-3">
              <p className="text-xs font-semibold text-warn">Risk flags</p>
              <ul className="mt-1 space-y-0.5 text-xs text-foreground/90">
                {state.data.riskFlags.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground">Educational, not investment advice.</p>
        </div>
      )}
    </div>
  );
}
