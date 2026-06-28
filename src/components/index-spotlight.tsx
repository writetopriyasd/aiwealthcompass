import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useMarketStore } from "@/lib/store";
import { INDICES } from "@/data/universe";
import { useState } from "react";
import { cn, formatNumber, formatPct, changeTone } from "@/lib/utils";

export function IndexSpotlight() {
  const ticks = useMarketStore((s) => s.ticks);
  const [active, setActive] = useState(INDICES[0].symbol);
  const tick = ticks[active];
  const data = (tick?.spark ?? []).map((p, i) => ({ i, p }));
  const tone = changeTone(tick?.changePct ?? 0);

  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Index Spotlight</h3>
          <p className="text-xs text-muted-foreground">Intraday path · simulated</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {INDICES.map((i) => (
            <button
              key={i.symbol}
              onClick={() => setActive(i.symbol)}
              className={cn(
                "rounded-md border border-border px-2 py-1 text-[11px] transition",
                active === i.symbol ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:text-foreground",
              )}
            >{i.symbol}</button>
          ))}
        </div>
      </div>
      <div className="mb-2 flex items-end gap-3">
        <span className="num text-3xl font-semibold tracking-tight">{tick ? formatNumber(tick.price, tick.price > 1000 ? 0 : 2) : "—"}</span>
        <span className={cn(
          "num pb-1 text-sm font-medium",
          tone === "gain" && "text-gain", tone === "loss" && "text-loss", tone === "flat" && "text-muted-foreground",
        )}>{tick ? formatPct(tick.changePct) : ""}</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="g-spot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tone === "loss" ? "var(--color-loss)" : "var(--color-primary)"} stopOpacity={0.4} />
                <stop offset="100%" stopColor={tone === "loss" ? "var(--color-loss)" : "var(--color-primary)"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v: any) => formatNumber(Number(v), 2)}
              labelFormatter={() => ""}
            />
            <Area type="monotone" dataKey="p" stroke={tone === "loss" ? "var(--color-loss)" : "var(--color-primary)"} strokeWidth={2} fill="url(#g-spot)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
