import { Link } from "@tanstack/react-router";
import { useMarketStore } from "@/lib/store";
import { useLiveTicker } from "@/hooks/use-live-ticker";
import { INDICES, CRYPTO, FX, COMMODITIES } from "@/data/universe";
import { cn, formatNumber, formatPct, changeTone } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const TICKER_SYMBOLS = [...INDICES, ...CRYPTO, ...FX, ...COMMODITIES];

export function TickerRail() {
  useLiveTicker();
  const ticks = useMarketStore((s) => s.ticks);
  const items = TICKER_SYMBOLS.map((i) => ({ inst: i, tick: ticks[i.symbol] })).filter((x) => x.tick);

  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/60 backdrop-blur">
      <div className="ticker-track flex w-max gap-8 py-2 px-4">
        {[...items, ...items].map(({ inst, tick }, idx) => {
          const tone = changeTone(tick.changePct);
          const Icon = tone === "gain" ? ArrowUpRight : tone === "loss" ? ArrowDownRight : Minus;
          return (
            <div key={`${inst.symbol}-${idx}`} className="flex items-center gap-2 text-sm whitespace-nowrap">
              <span className="font-medium text-muted-foreground">{inst.symbol}</span>
              <span className="num text-foreground">{formatNumber(tick.price, tick.price > 1000 ? 0 : 2)}</span>
              <span className={cn(
                "num inline-flex items-center gap-0.5 text-xs",
                tone === "gain" && "text-gain",
                tone === "loss" && "text-loss",
                tone === "flat" && "text-muted-foreground",
              )}>
                <Icon className="size-3" />
                {formatPct(tick.changePct)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative size-7 rounded-md bg-gradient-to-br from-primary to-accent">
            <div className="absolute inset-1.5 rounded-sm bg-background" />
            <div className="absolute inset-2.5 rounded-sm bg-primary" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">FinPulse <span className="text-primary">AI</span></span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-foreground bg-surface-2" }}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground hover:bg-surface-2"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/dashboard" className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
          Open Dashboard
        </Link>
      </div>
    </header>
  );
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/markets", label: "Markets" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/sip-planner", label: "SIP Planner" },
  { to: "/ai-insights", label: "AI Insights" },
  { to: "/about", label: "About" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-muted-foreground sm:px-6">
        <p className="font-medium text-foreground">Educational demo, not investment advice.</p>
        <p className="mt-1">All market data is simulated. FinPulse AI is a portfolio prototype that visualizes how AI-assisted SIP/MF/debt decisions could feel.</p>
      </div>
    </footer>
  );
}
