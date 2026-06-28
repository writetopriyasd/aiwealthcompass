import { createFileRoute } from "@tanstack/react-router";
import { TickerRail } from "@/components/shell";
import { TierSelector } from "@/components/tier-selector";
import { usePortfolioMetrics } from "@/hooks/use-portfolio-metrics";
import { cn, formatCurrency, formatPct, changeTone, formatNumber } from "@/lib/utils";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio · FinPulse AI" },
      { name: "description", content: "Sample portfolio for the selected net-worth tier: holdings, allocation, P&L, and sector exposure." },
      { property: "og:title", content: "Portfolio · FinPulse AI" },
      { property: "og:description", content: "Holdings, allocation, and exposure for each tier." },
    ],
  }),
  component: PortfolioPage,
});

const COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-gain)", "var(--color-warn)", "var(--color-info)", "var(--color-loss)"];

function PortfolioPage() {
  const m = usePortfolioMetrics();
  return (
    <div>
      <TickerRail />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-sm text-muted-foreground">{m.holdings.length} holdings · {formatCurrency(m.totalValueINR)} total value</p>
          </div>
          <TierSelector />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <DonutCard title="Asset Class Allocation" data={m.byAssetClass.map((a, i) => ({ name: a.bucket, value: a.valueINR, color: COLORS[i % COLORS.length] }))} />
          <DonutCard title="Sector Allocation" data={m.bySector.map((s, i) => ({ name: s.sector, value: s.valueINR, color: COLORS[i % COLORS.length] }))} />
        </div>

        <div className="card-surface mt-6 overflow-hidden">
          <div className="border-b border-border p-4"><h3 className="text-sm font-semibold">Holdings</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Symbol</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 text-right font-medium">Units</th>
                  <th className="px-4 py-2 text-right font-medium">Avg Cost</th>
                  <th className="px-4 py-2 text-right font-medium">Price</th>
                  <th className="px-4 py-2 text-right font-medium">Value</th>
                  <th className="px-4 py-2 text-right font-medium">Weight</th>
                  <th className="px-4 py-2 text-right font-medium">Day Δ</th>
                  <th className="px-4 py-2 text-right font-medium">Total P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {m.holdings.map((h) => {
                  const dt = changeTone(h.dayChangePct);
                  const pt = changeTone(h.pnlPct);
                  return (
                    <tr key={h.symbol} className="hover:bg-surface-2">
                      <td className="num px-4 py-2 font-medium">{h.symbol}</td>
                      <td className="px-4 py-2 text-muted-foreground">{h.name}</td>
                      <td className="num px-4 py-2 text-right">{formatNumber(h.units, h.units < 10 ? 4 : 0)}</td>
                      <td className="num px-4 py-2 text-right">{formatNumber(h.avgCost, h.avgCost > 1000 ? 0 : 2)}</td>
                      <td className="num px-4 py-2 text-right">{formatNumber(h.price, h.price > 1000 ? 0 : 2)}</td>
                      <td className="num px-4 py-2 text-right">{formatCurrency(h.valueINR)}</td>
                      <td className="num px-4 py-2 text-right text-muted-foreground">{h.weight.toFixed(1)}%</td>
                      <td className={cn("num px-4 py-2 text-right", dt === "gain" && "text-gain", dt === "loss" && "text-loss")}>{formatPct(h.dayChangePct)}</td>
                      <td className={cn("num px-4 py-2 text-right", pt === "gain" && "text-gain", pt === "loss" && "text-loss")}>{formatPct(h.pnlPct)}</td>
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

function DonutCard({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
  return (
    <div className="card-surface p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="grid items-center gap-3 sm:grid-cols-2">
        <div className="h-56">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {data.map((d, i) => <Cell key={i} fill={d.color} stroke="var(--color-background)" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} formatter={(v: any) => formatCurrency(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-1.5 text-sm">
          {data.map((d) => {
            const total = data.reduce((s, x) => s + x.value, 0);
            return (
              <li key={d.name} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs"><span className="size-2.5 rounded-sm" style={{ background: d.color }} /> {d.name}</span>
                <span className="num text-xs text-muted-foreground">{((d.value / total) * 100).toFixed(1)}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
