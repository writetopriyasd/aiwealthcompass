import { usePortfolioMetrics } from "@/hooks/use-portfolio-metrics";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { formatPct } from "@/lib/utils";

export function SectorRotation() {
  const { bySector } = usePortfolioMetrics();
  const data = bySector.slice(0, 8).map((s) => ({ sector: s.sector, change: s.dayChangePct }));
  return (
    <div className="card-surface p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">Sector Rotation · Today</h3>
        <p className="text-xs text-muted-foreground">Day-change by sector in your portfolio</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 16 }}>
            <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="sector" stroke="var(--color-muted-foreground)" fontSize={11} width={90} />
            <Tooltip
              cursor={{ fill: "var(--color-surface-3)" }}
              contentStyle={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v: any) => formatPct(Number(v))}
            />
            <Bar dataKey="change" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.change >= 0 ? "var(--color-gain)" : "var(--color-loss)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
