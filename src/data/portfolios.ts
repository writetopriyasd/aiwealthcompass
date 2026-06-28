export type Tier = "low" | "medium" | "high";

export interface Holding {
  symbol: string;
  units: number;
  avgCost: number; // in instrument currency
}

export interface SIP {
  symbol: string;
  monthly: number; // amount in INR
  dayOfMonth: number;
  stepUpPct?: number;
}

export interface PortfolioSeed {
  tier: Tier;
  label: string;
  netWorthBand: string;
  holdings: Holding[];
  sips: SIP[];
}

export const PORTFOLIOS: Record<Tier, PortfolioSeed> = {
  low: {
    tier: "low",
    label: "Emerging Investor",
    netWorthBand: "< ₹25 L",
    holdings: [
      { symbol: "NIFINDEX", units: 480, avgCost: 142.0 },
      { symbol: "PPFCF", units: 320, avgCost: 74.5 },
      { symbol: "MIRAEELS", units: 410, avgCost: 41.2 },
      { symbol: "LIQUID", units: 18, avgCost: 360.0 },
    ],
    sips: [
      { symbol: "NIFINDEX", monthly: 10000, dayOfMonth: 5, stepUpPct: 10 },
      { symbol: "PPFCF", monthly: 7500, dayOfMonth: 12 },
      { symbol: "MIRAEELS", monthly: 5000, dayOfMonth: 20 },
    ],
  },
  medium: {
    tier: "medium",
    label: "Established Investor",
    netWorthBand: "₹25 L – ₹2 Cr",
    holdings: [
      { symbol: "PPFCF", units: 2100, avgCost: 71.0 },
      { symbol: "AXISMID", units: 1450, avgCost: 95.4 },
      { symbol: "ICICIBLU", units: 1980, avgCost: 88.2 },
      { symbol: "SBISMLCAP", units: 540, avgCost: 152.0 },
      { symbol: "HDFCBANK", units: 240, avgCost: 1620 },
      { symbol: "TCS", units: 80, avgCost: 3850 },
      { symbol: "GILT10Y", units: 12000, avgCost: 23.4 },
      { symbol: "CORPBOND", units: 3200, avgCost: 98.5 },
      { symbol: "VOO", units: 18, avgCost: 478 },
    ],
    sips: [
      { symbol: "PPFCF", monthly: 25000, dayOfMonth: 3, stepUpPct: 10 },
      { symbol: "AXISMID", monthly: 15000, dayOfMonth: 10 },
      { symbol: "ICICIBLU", monthly: 20000, dayOfMonth: 15 },
      { symbol: "SBISMLCAP", monthly: 10000, dayOfMonth: 22 },
      { symbol: "CORPBOND", monthly: 15000, dayOfMonth: 25 },
    ],
  },
  high: {
    tier: "high",
    label: "High Net-Worth",
    netWorthBand: "> ₹2 Cr",
    holdings: [
      { symbol: "PPFCF", units: 18500, avgCost: 68.0 },
      { symbol: "AXISMID", units: 9200, avgCost: 92.0 },
      { symbol: "SBISMLCAP", units: 3100, avgCost: 145.0 },
      { symbol: "RELIANCE", units: 2400, avgCost: 1140 },
      { symbol: "HDFCBANK", units: 1800, avgCost: 1580 },
      { symbol: "TCS", units: 650, avgCost: 3720 },
      { symbol: "INFY", units: 1200, avgCost: 1620 },
      { symbol: "GILT10Y", units: 95000, avgCost: 23.1 },
      { symbol: "CORPBOND", units: 24000, avgCost: 97.2 },
      { symbol: "SHORTDUR", units: 38000, avgCost: 28.4 },
      { symbol: "VOO", units: 220, avgCost: 462 },
      { symbol: "QQQ", units: 180, avgCost: 438 },
      { symbol: "NVDA", units: 240, avgCost: 102 },
      { symbol: "BTC", units: 1.8, avgCost: 71200 },
      { symbol: "GOLD", units: 85, avgCost: 2310 },
    ],
    sips: [
      { symbol: "PPFCF", monthly: 100000, dayOfMonth: 2, stepUpPct: 10 },
      { symbol: "AXISMID", monthly: 75000, dayOfMonth: 8 },
      { symbol: "SBISMLCAP", monthly: 50000, dayOfMonth: 14 },
      { symbol: "CORPBOND", monthly: 100000, dayOfMonth: 18 },
      { symbol: "SHORTDUR", monthly: 75000, dayOfMonth: 25 },
    ],
  },
};

export interface Goal {
  id: string;
  label: string;
  targetINR: number;
  currentINR: number;
  targetYear: number;
  monthlyRequired: number;
}

export const GOALS: Record<Tier, Goal[]> = {
  low: [
    { id: "emergency", label: "Emergency Fund (6 mo)", targetINR: 600000, currentINR: 215000, targetYear: 2027, monthlyRequired: 16000 },
    { id: "house-down", label: "House Down Payment", targetINR: 2500000, currentINR: 480000, targetYear: 2030, monthlyRequired: 28000 },
  ],
  medium: [
    { id: "child-edu", label: "Child's UG Education", targetINR: 8000000, currentINR: 2100000, targetYear: 2034, monthlyRequired: 42000 },
    { id: "retire", label: "Retire by 55", targetINR: 50000000, currentINR: 12500000, targetYear: 2042, monthlyRequired: 78000 },
    { id: "house-up", label: "Home Upgrade", targetINR: 6000000, currentINR: 1800000, targetYear: 2029, monthlyRequired: 64000 },
  ],
  high: [
    { id: "legacy", label: "Generational Wealth", targetINR: 400000000, currentINR: 145000000, targetYear: 2045, monthlyRequired: 350000 },
    { id: "retire-50", label: "Retire by 50", targetINR: 180000000, currentINR: 82000000, targetYear: 2036, monthlyRequired: 280000 },
    { id: "philanthropy", label: "Family Foundation", targetINR: 50000000, currentINR: 12000000, targetYear: 2032, monthlyRequired: 220000 },
  ],
};
