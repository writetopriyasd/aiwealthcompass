import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { YIELD_CURVES } from "@/data/universe";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function YieldCurveChart() {
  const [region, setRegion] = useState<"IN" | "US">("IN");
  const data = YIELD_CURVES[region];
  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Sovereign Yield Curve</h3>
          <p className="text-xs text-muted-foreground">Anchor for debt MF duration calls</p>
        </div>
        <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5 text-xs">
          {(["IN", "US"] as const).map((r) => (
            <button key={r} onClick={() => setRegion(r)}
              className={cn("rounded px-2.5 py-1 transition", region === r ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground")}
            >{r}</button>
          ))}
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="tenor" stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${v}y`} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={["dataMin - 0.2", "dataMax + 0.2"]} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `${v.toFixed(2)}%`} labelFormatter={(l) => `${l} year`} />
            <Line type="monotone" dataKey="yield" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--color-primary)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
