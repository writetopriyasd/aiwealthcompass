import { usePortfolioMetrics } from "@/hooks/use-portfolio-metrics";
import { formatCurrency, cn } from "@/lib/utils";
import { Target } from "lucide-react";

export function GoalTracker() {
  const { goals } = usePortfolioMetrics();
  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Target className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">OKR Goal Tracker</h3>
      </div>
      <div className="space-y-4">
        {goals.map((g) => {
          const pct = Math.min((g.currentINR / g.targetINR) * 100, 100);
          const yearsLeft = g.targetYear - new Date().getFullYear();
          const onTrack = pct / 100 >= (10 - yearsLeft) / 10;
          return (
            <div key={g.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{g.label}</span>
                <span className="num text-xs text-muted-foreground">{formatCurrency(g.currentINR)} / {formatCurrency(g.targetINR)}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-3">
                <div
                  className={cn("h-full rounded-full transition-all", onTrack ? "bg-gain" : "bg-warn")}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="num">{pct.toFixed(0)}% complete · target {g.targetYear}</span>
                <span className="num">SIP needed: {formatCurrency(g.monthlyRequired)}/mo</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
