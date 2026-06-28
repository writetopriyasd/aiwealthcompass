import { usePortfolioMetrics } from "@/hooks/use-portfolio-metrics";
import { useMarketStore } from "@/lib/store";
import { AlertTriangle, TrendingDown, TrendingUp, Activity } from "lucide-react";

export function AlertsFeed() {
  const metrics = usePortfolioMetrics();
  const ticks = useMarketStore((s) => s.ticks);
  const alerts: Array<{ icon: any; tone: string; title: string; body: string }> = [];

  // Concentration risk
  const top = metrics.bySector[0];
  if (top && top.pct > 40) {
    alerts.push({
      icon: AlertTriangle, tone: "warn",
      title: `Concentration risk: ${top.sector} at ${top.pct.toFixed(0)}%`,
      body: "Allocation to a single sector above 40% increases drawdown risk. Consider trimming or rebalancing inflows.",
    });
  }

  // Big sector moves (>2σ ≈ >2%)
  metrics.bySector.forEach((s) => {
    if (Math.abs(s.dayChangePct) >= 2) {
      alerts.push({
        icon: s.dayChangePct >= 0 ? TrendingUp : TrendingDown,
        tone: s.dayChangePct >= 0 ? "gain" : "loss",
        title: `${s.sector} ${s.dayChangePct >= 0 ? "rallied" : "sold off"} ${Math.abs(s.dayChangePct).toFixed(2)}% today`,
        body: "Move exceeds typical 1-day band. Check holdings exposure before adjusting SIPs.",
      });
    }
  });

  // Currency move
  const usdinr = ticks["USDINR"];
  if (usdinr && Math.abs(usdinr.changePct) > 0.5) {
    alerts.push({
      icon: Activity, tone: "info",
      title: `USD/INR moved ${usdinr.changePct.toFixed(2)}% today`,
      body: "FX swings affect USD-denominated ETF returns. Re-check global allocation.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({ icon: Activity, tone: "info", title: "No anomalies detected", body: "All sector moves within typical 1-day band. SIP cadence on track." });
  }

  return (
    <div className="card-surface p-4">
      <h3 className="mb-3 text-sm font-semibold">Live Alerts</h3>
      <ul className="space-y-2">
        {alerts.slice(0, 6).map((a, i) => {
          const Icon = a.icon;
          const toneClass =
            a.tone === "gain" ? "bg-gain-soft text-gain" :
            a.tone === "loss" ? "bg-loss-soft text-loss" :
            a.tone === "warn" ? "bg-warn-soft text-warn" : "bg-surface-3 text-info";
          return (
            <li key={i} className="flex gap-3 rounded-lg border border-border p-3">
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-md ${toneClass}`}>
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
