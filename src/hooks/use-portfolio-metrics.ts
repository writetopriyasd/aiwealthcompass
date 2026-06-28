import { useMemo } from "react";
import { useMarketStore, fxToBase } from "@/lib/store";
import { PORTFOLIOS, type Tier, type Goal, GOALS } from "@/data/portfolios";
import { SYMBOL_MAP } from "@/data/universe";

export interface PortfolioMetrics {
  tier: Tier;
  totalValueINR: number;
  dayPnlINR: number;
  dayPnlPct: number;
  xirr: number;
  sipActive: number;
  monthlySipINR: number;
  riskScore: number;
  holdings: Array<{
    symbol: string;
    name: string;
    units: number;
    avgCost: number;
    price: number;
    valueINR: number;
    pnlPct: number;
    dayChangePct: number;
    weight: number;
    sector: string;
    assetClass: string;
  }>;
  bySector: Array<{ sector: string; valueINR: number; pct: number; dayChangePct: number }>;
  byAssetClass: Array<{ bucket: string; valueINR: number; pct: number }>;
  topGainers: Array<{ symbol: string; changePct: number }>;
  topLosers: Array<{ symbol: string; changePct: number }>;
  goals: Goal[];
}

export function usePortfolioMetrics(): PortfolioMetrics {
  const tier = useMarketStore((s) => s.tier);
  const ticks = useMarketStore((s) => s.ticks);

  return useMemo(() => {
    const seed = PORTFOLIOS[tier];
    let totalValueINR = 0;
    let prevValueINR = 0;
    const holdings = seed.holdings.map((h) => {
      const inst = SYMBOL_MAP[h.symbol];
      const tick = ticks[h.symbol];
      const fx = fxToBase(inst.currency, "INR", ticks);
      const price = tick?.price ?? inst.basePrice;
      const prev = tick?.prevClose ?? inst.basePrice;
      const valueINR = h.units * price * fx;
      const prevValueLocal = h.units * prev * fx;
      totalValueINR += valueINR;
      prevValueINR += prevValueLocal;
      const pnlPct = ((price - h.avgCost) / h.avgCost) * 100;
      const dayChangePct = tick?.changePct ?? 0;
      return {
        symbol: h.symbol,
        name: inst.name,
        units: h.units,
        avgCost: h.avgCost,
        price,
        valueINR,
        pnlPct,
        dayChangePct,
        weight: 0,
        sector: inst.sector,
        assetClass: inst.assetClass,
      };
    });
    holdings.forEach((h) => { h.weight = totalValueINR > 0 ? (h.valueINR / totalValueINR) * 100 : 0; });
    const dayPnlINR = totalValueINR - prevValueINR;
    const dayPnlPct = prevValueINR > 0 ? (dayPnlINR / prevValueINR) * 100 : 0;

    // Approximate XIRR via blended weighted return vs avgCost
    const totalCost = seed.holdings.reduce((acc, h) => {
      const inst = SYMBOL_MAP[h.symbol];
      const fx = fxToBase(inst.currency, "INR", ticks);
      return acc + h.units * h.avgCost * fx;
    }, 0);
    const overallReturn = totalCost > 0 ? ((totalValueINR - totalCost) / totalCost) * 100 : 0;
    const xirr = overallReturn / 3; // assume avg 3y holding -> rough annualized

    // Sector buckets
    const sectorMap = new Map<string, { v: number; prev: number }>();
    holdings.forEach((h) => {
      const cur = sectorMap.get(h.sector) ?? { v: 0, prev: 0 };
      const prevV = h.valueINR / (1 + h.dayChangePct / 100);
      sectorMap.set(h.sector, { v: cur.v + h.valueINR, prev: cur.prev + prevV });
    });
    const bySector = Array.from(sectorMap.entries()).map(([sector, { v, prev }]) => ({
      sector,
      valueINR: v,
      pct: (v / totalValueINR) * 100,
      dayChangePct: prev > 0 ? ((v - prev) / prev) * 100 : 0,
    })).sort((a, b) => b.valueINR - a.valueINR);

    // Asset class buckets
    const ACL: Record<string, string> = {
      "equity": "Direct Equity", "mf-equity": "Equity MF/ETF", "etf": "Equity MF/ETF",
      "mf-debt": "Debt MF", "bond": "Bonds", "crypto": "Crypto", "commodity": "Commodities",
      "index": "Index", "fx": "FX",
    };
    const acMap = new Map<string, number>();
    holdings.forEach((h) => {
      const b = ACL[h.assetClass] ?? "Other";
      acMap.set(b, (acMap.get(b) ?? 0) + h.valueINR);
    });
    const byAssetClass = Array.from(acMap.entries()).map(([bucket, v]) => ({
      bucket, valueINR: v, pct: (v / totalValueINR) * 100,
    })).sort((a, b) => b.valueINR - a.valueINR);

    const sortedByChange = [...holdings].sort((a, b) => b.dayChangePct - a.dayChangePct);
    const topGainers = sortedByChange.slice(0, 3).map((h) => ({ symbol: h.symbol, changePct: h.dayChangePct }));
    const topLosers = sortedByChange.slice(-3).reverse().map((h) => ({ symbol: h.symbol, changePct: h.dayChangePct }));

    const equityPct = byAssetClass.filter((a) => /Equity|Index|Crypto/.test(a.bucket)).reduce((s, a) => s + a.pct, 0);
    const concentration = Math.max(...bySector.map((s) => s.pct), 0);
    const riskScore = Math.round(Math.min(100, equityPct * 0.6 + concentration * 0.8));

    const monthlySipINR = seed.sips.reduce((s, sip) => s + sip.monthly, 0);

    return {
      tier,
      totalValueINR,
      dayPnlINR,
      dayPnlPct,
      xirr,
      sipActive: seed.sips.length,
      monthlySipINR,
      riskScore,
      holdings,
      bySector,
      byAssetClass,
      topGainers,
      topLosers,
      goals: GOALS[tier],
    };
  }, [tier, ticks]);
}
