// Seeded universe of instruments across regions. Mock-only; not investment advice.
export type Region = "IN" | "US" | "Global";
export type AssetClass = "index" | "equity" | "mf-equity" | "mf-debt" | "etf" | "crypto" | "fx" | "commodity" | "bond";
export type Sector =
  | "Technology" | "Financials" | "Healthcare" | "Energy" | "Consumer" | "Industrials"
  | "Materials" | "Utilities" | "RealEstate" | "Communication" | "Staples" | "Macro";

export interface Instrument {
  symbol: string;
  name: string;
  region: Region;
  assetClass: AssetClass;
  sector: Sector;
  currency: "INR" | "USD";
  basePrice: number;
  vol: number; // daily volatility (as decimal, e.g. 0.012 = 1.2%)
  marketCap?: number; // in billions, base currency
}

export const INDICES: Instrument[] = [
  { symbol: "NIFTY50", name: "Nifty 50", region: "IN", assetClass: "index", sector: "Macro", currency: "INR", basePrice: 24850, vol: 0.008, marketCap: 4200 },
  { symbol: "SENSEX", name: "BSE Sensex", region: "IN", assetClass: "index", sector: "Macro", currency: "INR", basePrice: 81240, vol: 0.008, marketCap: 4500 },
  { symbol: "BANKNIFTY", name: "Bank Nifty", region: "IN", assetClass: "index", sector: "Financials", currency: "INR", basePrice: 54120, vol: 0.011, marketCap: 1800 },
  { symbol: "NIFTYIT", name: "Nifty IT", region: "IN", assetClass: "index", sector: "Technology", currency: "INR", basePrice: 42180, vol: 0.013, marketCap: 1200 },
  { symbol: "SPX", name: "S&P 500", region: "US", assetClass: "index", sector: "Macro", currency: "USD", basePrice: 5870, vol: 0.007, marketCap: 50000 },
  { symbol: "NDX", name: "Nasdaq 100", region: "US", assetClass: "index", sector: "Technology", currency: "USD", basePrice: 20940, vol: 0.010, marketCap: 28000 },
  { symbol: "DJI", name: "Dow Jones", region: "US", assetClass: "index", sector: "Industrials", currency: "USD", basePrice: 44210, vol: 0.006, marketCap: 12000 },
];

export const CRYPTO: Instrument[] = [
  { symbol: "BTC", name: "Bitcoin", region: "Global", assetClass: "crypto", sector: "Macro", currency: "USD", basePrice: 96800, vol: 0.025 },
  { symbol: "ETH", name: "Ethereum", region: "Global", assetClass: "crypto", sector: "Macro", currency: "USD", basePrice: 3420, vol: 0.030 },
];

export const FX: Instrument[] = [
  { symbol: "USDINR", name: "USD / INR", region: "Global", assetClass: "fx", sector: "Macro", currency: "INR", basePrice: 84.32, vol: 0.003 },
  { symbol: "EURUSD", name: "EUR / USD", region: "Global", assetClass: "fx", sector: "Macro", currency: "USD", basePrice: 1.0524, vol: 0.004 },
];

export const COMMODITIES: Instrument[] = [
  { symbol: "GOLD", name: "Gold (oz)", region: "Global", assetClass: "commodity", sector: "Materials", currency: "USD", basePrice: 2685, vol: 0.009 },
  { symbol: "OIL", name: "Brent Crude", region: "Global", assetClass: "commodity", sector: "Energy", currency: "USD", basePrice: 73.40, vol: 0.018 },
];

export const EQUITIES: Instrument[] = [
  // India
  { symbol: "RELIANCE", name: "Reliance Industries", region: "IN", assetClass: "equity", sector: "Energy", currency: "INR", basePrice: 1285, vol: 0.014, marketCap: 1740 },
  { symbol: "TCS", name: "Tata Consultancy Services", region: "IN", assetClass: "equity", sector: "Technology", currency: "INR", basePrice: 4180, vol: 0.012, marketCap: 1510 },
  { symbol: "HDFCBANK", name: "HDFC Bank", region: "IN", assetClass: "equity", sector: "Financials", currency: "INR", basePrice: 1745, vol: 0.013, marketCap: 1330 },
  { symbol: "INFY", name: "Infosys", region: "IN", assetClass: "equity", sector: "Technology", currency: "INR", basePrice: 1890, vol: 0.013, marketCap: 785 },
  { symbol: "ICICIBANK", name: "ICICI Bank", region: "IN", assetClass: "equity", sector: "Financials", currency: "INR", basePrice: 1295, vol: 0.013, marketCap: 910 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", region: "IN", assetClass: "equity", sector: "Staples", currency: "INR", basePrice: 2410, vol: 0.010, marketCap: 565 },
  { symbol: "SUNPHARMA", name: "Sun Pharma", region: "IN", assetClass: "equity", sector: "Healthcare", currency: "INR", basePrice: 1820, vol: 0.013, marketCap: 437 },
  { symbol: "TATAMOTORS", name: "Tata Motors", region: "IN", assetClass: "equity", sector: "Consumer", currency: "INR", basePrice: 780, vol: 0.020, marketCap: 290 },
  // US
  { symbol: "AAPL", name: "Apple Inc.", region: "US", assetClass: "equity", sector: "Technology", currency: "USD", basePrice: 235, vol: 0.014, marketCap: 3580 },
  { symbol: "MSFT", name: "Microsoft", region: "US", assetClass: "equity", sector: "Technology", currency: "USD", basePrice: 422, vol: 0.013, marketCap: 3130 },
  { symbol: "NVDA", name: "NVIDIA", region: "US", assetClass: "equity", sector: "Technology", currency: "USD", basePrice: 138, vol: 0.028, marketCap: 3380 },
  { symbol: "GOOGL", name: "Alphabet", region: "US", assetClass: "equity", sector: "Communication", currency: "USD", basePrice: 178, vol: 0.016, marketCap: 2180 },
  { symbol: "AMZN", name: "Amazon", region: "US", assetClass: "equity", sector: "Consumer", currency: "USD", basePrice: 222, vol: 0.018, marketCap: 2330 },
  { symbol: "META", name: "Meta Platforms", region: "US", assetClass: "equity", sector: "Communication", currency: "USD", basePrice: 595, vol: 0.020, marketCap: 1510 },
  { symbol: "JPM", name: "JPMorgan Chase", region: "US", assetClass: "equity", sector: "Financials", currency: "USD", basePrice: 245, vol: 0.014, marketCap: 690 },
  { symbol: "XOM", name: "ExxonMobil", region: "US", assetClass: "equity", sector: "Energy", currency: "USD", basePrice: 118, vol: 0.015, marketCap: 520 },
];

export const MUTUAL_FUNDS: Instrument[] = [
  { symbol: "PPFCF", name: "Parag Parikh Flexi Cap", region: "IN", assetClass: "mf-equity", sector: "Macro", currency: "INR", basePrice: 82.5, vol: 0.009 },
  { symbol: "AXISMID", name: "Axis Midcap Fund", region: "IN", assetClass: "mf-equity", sector: "Macro", currency: "INR", basePrice: 112.4, vol: 0.012 },
  { symbol: "MIRAEELS", name: "Mirae Asset ELSS Tax Saver", region: "IN", assetClass: "mf-equity", sector: "Macro", currency: "INR", basePrice: 48.7, vol: 0.011 },
  { symbol: "NIFINDEX", name: "UTI Nifty 50 Index Fund", region: "IN", assetClass: "mf-equity", sector: "Macro", currency: "INR", basePrice: 158.3, vol: 0.008 },
  { symbol: "ICICIBLU", name: "ICICI Pru Bluechip Fund", region: "IN", assetClass: "mf-equity", sector: "Macro", currency: "INR", basePrice: 102.1, vol: 0.009 },
  { symbol: "SBISMLCAP", name: "SBI Small Cap Fund", region: "IN", assetClass: "mf-equity", sector: "Macro", currency: "INR", basePrice: 178.2, vol: 0.017 },
  { symbol: "QQQ", name: "Invesco QQQ Trust ETF", region: "US", assetClass: "etf", sector: "Technology", currency: "USD", basePrice: 510, vol: 0.011 },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", region: "US", assetClass: "etf", sector: "Macro", currency: "USD", basePrice: 538, vol: 0.008 },
];

export const DEBT_INSTRUMENTS: Instrument[] = [
  { symbol: "GILT10Y", name: "10Y G-Sec Fund", region: "IN", assetClass: "mf-debt", sector: "Macro", currency: "INR", basePrice: 24.8, vol: 0.003 },
  { symbol: "SHORTDUR", name: "HDFC Short Term Debt", region: "IN", assetClass: "mf-debt", sector: "Macro", currency: "INR", basePrice: 30.1, vol: 0.002 },
  { symbol: "CORPBOND", name: "Aditya Birla Corporate Bond", region: "IN", assetClass: "mf-debt", sector: "Macro", currency: "INR", basePrice: 103.4, vol: 0.002 },
  { symbol: "LIQUID", name: "ICICI Liquid Fund", region: "IN", assetClass: "mf-debt", sector: "Macro", currency: "INR", basePrice: 365.2, vol: 0.0005 },
  { symbol: "TBOND", name: "US Treasury Bond ETF (TLT)", region: "US", assetClass: "bond", sector: "Macro", currency: "USD", basePrice: 88.4, vol: 0.006 },
];

export const ALL_INSTRUMENTS: Instrument[] = [
  ...INDICES, ...EQUITIES, ...MUTUAL_FUNDS, ...DEBT_INSTRUMENTS, ...CRYPTO, ...FX, ...COMMODITIES,
];

export const SYMBOL_MAP: Record<string, Instrument> = Object.fromEntries(
  ALL_INSTRUMENTS.map((i) => [i.symbol, i]),
);

export const SECTORS: Sector[] = [
  "Technology", "Financials", "Healthcare", "Energy", "Consumer",
  "Industrials", "Materials", "Utilities", "Communication", "Staples", "RealEstate",
];

// Yield curve points (tenor in years, yield %)
export const YIELD_CURVES = {
  IN: [
    { tenor: 0.25, yield: 6.62 }, { tenor: 1, yield: 6.71 }, { tenor: 2, yield: 6.78 },
    { tenor: 5, yield: 6.85 }, { tenor: 10, yield: 6.92 }, { tenor: 30, yield: 7.18 },
  ],
  US: [
    { tenor: 0.25, yield: 4.42 }, { tenor: 1, yield: 4.18 }, { tenor: 2, yield: 4.02 },
    { tenor: 5, yield: 4.21 }, { tenor: 10, yield: 4.38 }, { tenor: 30, yield: 4.62 },
  ],
};
