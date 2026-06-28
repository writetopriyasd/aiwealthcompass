import { useMemo } from "react";
import { useMarketStore } from "@/lib/store";
import { PORTFOLIOS } from "@/data/portfolios";
import { SYMBOL_MAP } from "@/data/universe";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

const HOLIDAYS = new Set<string>([]); // demo: no holidays seeded

function isBusinessDay(d: Date) {
  const day = d.getDay();
  return day !== 0 && day !== 6 && !HOLIDAYS.has(d.toISOString().slice(0, 10));
}

function nextBusinessDay(d: Date) {
  let n = new Date(d);
  while (!isBusinessDay(n)) n.setDate(n.getDate() + 1);
  return n;
}

export function SipCalendar() {
  const tier = useMarketStore((s) => s.tier);
  const seed = PORTFOLIOS[tier];

  const upcoming = useMemo(() => {
    const today = new Date();
    const list = seed.sips.flatMap((sip) => {
      // upcoming within next 35 days
      const out: { date: Date; sip: typeof sip }[] = [];
      for (let m = 0; m < 2; m++) {
        const candidate = new Date(today.getFullYear(), today.getMonth() + m, sip.dayOfMonth);
        const adjusted = nextBusinessDay(candidate);
        if (adjusted >= today && (adjusted.getTime() - today.getTime()) < 35 * 86400000) {
          out.push({ date: adjusted, sip });
        }
      }
      return out;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
    return list;
  }, [seed]);

  let cum = 0;
  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">SIP Inflow Calendar · Next 35 days</h3>
      </div>
      <ul className="divide-y divide-border">
        {upcoming.map(({ date, sip }, i) => {
          cum += sip.monthly;
          const inst = SYMBOL_MAP[sip.symbol];
          return (
            <li key={i} className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="num flex size-10 flex-col items-center justify-center rounded-md bg-surface-2 text-[10px]">
                  <span className="leading-none text-muted-foreground">{date.toLocaleDateString("en", { month: "short" })}</span>
                  <span className="text-base font-semibold leading-none">{date.getDate()}</span>
                </div>
                <div>
                  <p className="font-medium">{inst?.name ?? sip.symbol}</p>
                  <p className="text-xs text-muted-foreground">{sip.symbol}{sip.stepUpPct ? ` · ${sip.stepUpPct}% step-up` : ""}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="num font-medium">{formatCurrency(sip.monthly)}</p>
                <p className="num text-xs text-muted-foreground">cum {formatCurrency(cum)}</p>
              </div>
            </li>
          );
        })}
        {upcoming.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No upcoming SIPs.</li>}
      </ul>
    </div>
  );
}
