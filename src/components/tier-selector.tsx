import { useMarketStore } from "@/lib/store";
import type { Tier } from "@/data/portfolios";
import { PORTFOLIOS } from "@/data/portfolios";
import { cn } from "@/lib/utils";

const TIERS: Tier[] = ["low", "medium", "high"];

export function TierSelector() {
  const tier = useMarketStore((s) => s.tier);
  const setTier = useMarketStore((s) => s.setTier);
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-1">
      {TIERS.map((t) => {
        const p = PORTFOLIOS[t];
        const active = tier === t;
        return (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition",
              active ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="block">{p.label}</span>
            <span className="num block text-[10px] opacity-70">{p.netWorthBand}</span>
          </button>
        );
      })}
    </div>
  );
}
