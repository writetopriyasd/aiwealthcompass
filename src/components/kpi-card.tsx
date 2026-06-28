import { cn, formatPct } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  delta?: number;
  hint?: string;
  icon?: LucideIcon;
  accent?: "gain" | "loss" | "neutral" | "primary";
}

export function KpiCard({ label, value, delta, hint, icon: Icon, accent = "neutral" }: KpiCardProps) {
  const tone = delta == null ? null : delta > 0 ? "gain" : delta < 0 ? "loss" : "flat";
  const DeltaIcon = tone === "gain" ? ArrowUpRight : tone === "loss" ? ArrowDownRight : Minus;
  return (
    <div className="card-surface relative overflow-hidden p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon && <Icon className={cn("size-4", accent === "primary" && "text-primary", accent === "gain" && "text-gain", accent === "loss" && "text-loss", accent === "neutral" && "text-muted-foreground")} />}
      </div>
      <div className="num mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 flex items-center gap-2">
        {delta != null && (
          <span className={cn(
            "num inline-flex items-center gap-0.5 text-xs",
            tone === "gain" && "text-gain",
            tone === "loss" && "text-loss",
            tone === "flat" && "text-muted-foreground",
          )}>
            <DeltaIcon className="size-3" aria-hidden />
            <span aria-label={tone ?? undefined}>{formatPct(delta)}</span>
          </span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
