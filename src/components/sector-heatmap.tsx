import { useState } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { useMarketStore } from "@/lib/store";
import { ALL_INSTRUMENTS, SECTORS, type Region } from "@/data/universe";
import { cn, formatPct } from "@/lib/utils";

const REGIONS: Array<{ id: Region | "ALL"; label: string }> = [
  { id: "ALL", label: "Global" },
  { id: "IN", label: "India" },
  { id: "US", label: "US" },
];

export function SectorHeatmap() {
  const ticks = useMarketStore((s) => s.ticks);
  const [region, setRegion] = useState<Region | "ALL">("ALL");

  const sectorRows = SECTORS.map((sector) => {
    const filtered = ALL_INSTRUMENTS.filter((i) =>
      i.sector === sector && (region === "ALL" || i.region === region) && i.assetClass !== "fx",
    );
    if (filtered.length === 0) return null;
    let mcap = 0;
    let weighted = 0;
    filtered.forEach((inst) => {
      const t = ticks[inst.symbol];
      const w = inst.marketCap ?? 50;
      mcap += w;
      weighted += w * (t?.changePct ?? 0);
    });
    const change = mcap > 0 ? weighted / mcap : 0;
    return { name: sector, size: Math.max(mcap, 30), change };
  }).filter((x): x is { name: string; size: number; change: number } => !!x);

  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Sectoral Heatmap</h3>
          <p className="text-xs text-muted-foreground">Size = market cap · Color = day change</p>
        </div>
        <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5 text-xs">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRegion(r.id)}
              className={cn(
                "rounded px-2.5 py-1 transition",
                region === r.id ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >{r.label}</button>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <Treemap
            data={sectorRows}
            dataKey="size"
            stroke="var(--color-background)"
            content={<HeatCell />}
            isAnimationActive={false}
          >
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              formatter={(_v: number, _k, item) => {
                const p = item.payload as { name: string; change: number };
                return [`${formatPct(p.change)}`, p.name];
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function HeatCell(props: any) {
  const { x, y, width, height, name, change } = props;
  if (width < 1 || height < 1) return null;
  const intensity = Math.min(Math.abs(change ?? 0) / 2.5, 1);
  const positive = (change ?? 0) >= 0;
  const fill = positive
    ? `oklch(${0.30 + intensity * 0.32} ${0.10 + intensity * 0.10} 160)`
    : `oklch(${0.30 + intensity * 0.30} ${0.10 + intensity * 0.12} 25)`;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="var(--color-background)" />
      {width > 70 && height > 36 && (
        <>
          <text x={x + 8} y={y + 18} fill="oklch(0.96 0.01 240)" fontSize={11} fontWeight={600}>{name}</text>
          <text x={x + 8} y={y + 34} fill="oklch(0.96 0.01 240 / 0.85)" fontSize={11} fontFamily="JetBrains Mono Variable">
            {(change ?? 0).toFixed(2)}%
          </text>
        </>
      )}
    </g>
  );
}
