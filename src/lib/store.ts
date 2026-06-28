import { create } from "zustand";
import { ALL_INSTRUMENTS, SYMBOL_MAP } from "@/data/universe";
import { nextTick, snapshotAll, type Tick } from "@/lib/market-sim";
import type { Tier } from "@/data/portfolios";

interface MarketState {
  ticks: Record<string, Tick>;
  tier: Tier;
  baseCurrency: "INR" | "USD";
  liveStarted: boolean;
  setTier: (t: Tier) => void;
  setBaseCurrency: (c: "INR" | "USD") => void;
  startLive: () => void;
  step: () => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  ticks: snapshotAll(),
  tier: "medium",
  baseCurrency: "INR",
  liveStarted: false,
  setTier: (t) => set({ tier: t }),
  setBaseCurrency: (c) => set({ baseCurrency: c }),
  startLive: () => {
    if (get().liveStarted) return;
    set({ liveStarted: true });
  },
  step: () => {
    const prev = get().ticks;
    const next: Record<string, Tick> = {};
    for (const inst of ALL_INSTRUMENTS) {
      const t = prev[inst.symbol];
      if (!t) continue;
      next[inst.symbol] = nextTick(t, SYMBOL_MAP[inst.symbol]);
    }
    set({ ticks: next });
  },
}));

export function fxToBase(currency: "INR" | "USD", baseCurrency: "INR" | "USD", ticks: Record<string, Tick>) {
  if (currency === baseCurrency) return 1;
  const usdinr = ticks["USDINR"]?.price ?? 84.32;
  if (currency === "USD" && baseCurrency === "INR") return usdinr;
  if (currency === "INR" && baseCurrency === "USD") return 1 / usdinr;
  return 1;
}
