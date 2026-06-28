import { createFileRoute } from "@tanstack/react-router";
import { TickerRail } from "@/components/shell";
import { SectorHeatmap } from "@/components/sector-heatmap";
import { IndexSpotlight } from "@/components/index-spotlight";
import { useMarketStore } from "@/lib/store";
import { ALL_INSTRUMENTS, type Region } from "@/data/universe";
import { useState } from "react";
import { cn, formatNumber, formatPct, changeTone } from "@/lib/utils";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Global Markets · FinPulse AI" },
      { name: "description", content: "Deep dive into global markets: indices, equities, crypto, FX, commodities across India, US, and global venues." },
      { property: "og:title", content: "Global Markets · FinPulse AI" },
      { property: "og:description", content: "Sector heatmaps, intraday spotlights, and a live instrument table." },
    ],
  }),
  component: Markets,
});

function Markets() {
  const ticks = useMarketStore((s) => s.ticks);
  const [region, setRegion] = useState<Region | "ALL">("ALL");
  const rows = ALL_INSTRUMENTS
    .filter((i) => region === "ALL" || i.region === region)
    .map((i) => ({ inst: i, tick: ticks[i.symbol] }))
    .filter((x) => x.tick)
    .sort((a, b) => Math.abs(b.tick.changePct) - Math.abs(a.tick.changePct));

  return (
    <div>
      <TickerRail />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Global Markets</h1>
        <p className="text-sm text-muted-foreground">Indices, equities, crypto, FX and commodities — all simulated in real time.</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2"><SectorHeatmap /></div>
          <div><IndexSpotlight /></div>
        </div>

        <div className="card-surface mt-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="text-sm font-semibold">Instruments — ranked by today's move</h3>
            <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5 text-xs">
              {(["ALL", "IN", "US", "Global"] as const).map((r) => (
                <button key={r} onClick={() => setRegion(r)} className={cn(
                  "rounded px-2.5 py-1 transition",
                  region === r ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground",
                )}>{r}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Symbol</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Sector</th>
                  <th className="px-4 py-2 text-right font-medium">Price</th>
                  <th className="px-4 py-2 text-right font-medium">Day Δ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.slice(0, 40).map(({ inst, tick }) => {
                  const tone = changeTone(tick.changePct);
                  return (
                    <tr key={inst.symbol} className="hover:bg-surface-2">
                      <td className="num px-4 py-2 font-medium">{inst.symbol}</td>
                      <td className="px-4 py-2 text-muted-foreground">{inst.name}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{inst.sector}</td>
                      <td className="num px-4 py-2 text-right">{formatNumber(tick.price, tick.price > 1000 ? 0 : 2)}</td>
                      <td className={cn("num px-4 py-2 text-right",
                        tone === "gain" && "text-gain", tone === "loss" && "text-loss", tone === "flat" && "text-muted-foreground")}>
                        {formatPct(tick.changePct)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
