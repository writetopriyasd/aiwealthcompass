import { useEffect } from "react";
import { useMarketStore } from "@/lib/store";

/** Mounts a 1s ticker that drives the global market store. Mount once at the app shell. */
export function useLiveTicker(intervalMs = 1500) {
  const startLive = useMarketStore((s) => s.startLive);
  const step = useMarketStore((s) => s.step);
  useEffect(() => {
    startLive();
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(step, intervalMs);
    return () => clearInterval(id);
  }, [startLive, step, intervalMs]);
}
