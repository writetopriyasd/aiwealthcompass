import { ALL_INSTRUMENTS, type Instrument } from "@/data/universe";

// Deterministic seeded RNG so SSR + first client paint don't mismatch wildly.
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSymbol(symbol: string) {
  let h = 2166136261;
  for (let i = 0; i < symbol.length; i++) {
    h ^= symbol.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface Tick {
  symbol: string;
  price: number;
  prevClose: number;
  changePct: number;
  spark: number[]; // recent prices
  ts: number;
}

// Generate today's path for a symbol — `points` evenly spaced through the session.
export function generateDailyPath(inst: Instrument, points = 60, daySeed = todaySeed()) {
  const rng = mulberry32(hashSymbol(inst.symbol) ^ daySeed);
  // Pretend yesterday's close drifted by a small amount from basePrice.
  const drift = (rng() - 0.5) * 0.02;
  const prevClose = inst.basePrice * (1 + drift);
  const path: number[] = [];
  let p = prevClose;
  // sub-period vol scaled from daily vol
  const stepVol = inst.vol / Math.sqrt(points);
  for (let i = 0; i < points; i++) {
    // normal-ish via Box-Muller
    const u1 = Math.max(rng(), 1e-9);
    const u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    p = p * (1 + z * stepVol);
    path.push(p);
  }
  const price = path[path.length - 1];
  return {
    symbol: inst.symbol,
    prevClose,
    price,
    spark: path,
    changePct: ((price - prevClose) / prevClose) * 100,
    ts: Date.now(),
  } satisfies Tick;
}

export function todaySeed(d = new Date()) {
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

export function snapshotAll(): Record<string, Tick> {
  const out: Record<string, Tick> = {};
  const seed = todaySeed();
  for (const inst of ALL_INSTRUMENTS) {
    out[inst.symbol] = generateDailyPath(inst, 60, seed);
  }
  return out;
}

// One live tick: nudge price by one step using its own vol. Keeps continuity.
export function nextTick(prev: Tick, inst: Instrument): Tick {
  const stepVol = inst.vol / Math.sqrt(60);
  // pseudo-random per call (Math.random is fine for client-only animation)
  const u1 = Math.max(Math.random(), 1e-9);
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const price = prev.price * (1 + z * stepVol);
  const spark = [...prev.spark.slice(-59), price];
  return {
    ...prev,
    price,
    spark,
    changePct: ((price - prev.prevClose) / prev.prevClose) * 100,
    ts: Date.now(),
  };
}

// Market session helpers — simplified, demo-grade.
export type SessionState = "open" | "closed" | "pre" | "after";
export function sessionFor(region: "IN" | "US" | "Global", now = new Date()): SessionState {
  if (region === "Global") return "open"; // crypto/FX 24/7
  const day = now.getUTCDay(); // 0 Sun .. 6 Sat
  if (day === 0 || day === 6) return "closed";
  const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (region === "IN") {
    // 09:15 – 15:30 IST = 03:45 – 10:00 UTC
    if (utcMin < 225) return "pre";
    if (utcMin < 600) return "open";
    return "after";
  }
  // US: 09:30 – 16:00 ET ≈ 14:30 – 21:00 UTC (ignoring DST nuance)
  if (utcMin < 870) return "pre";
  if (utcMin < 1260) return "open";
  return "after";
}
