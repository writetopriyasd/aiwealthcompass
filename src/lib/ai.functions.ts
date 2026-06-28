import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ALLOWED_SYMBOLS = [
  "NIFTY50","SENSEX","BANKNIFTY","NIFTYIT","SPX","NDX","DJI","BTC","ETH","USDINR","GOLD","OIL",
  "PPFCF","AXISMID","MIRAEELS","NIFINDEX","ICICIBLU","SBISMLCAP","QQQ","VOO",
  "GILT10Y","SHORTDUR","CORPBOND","LIQUID","TBOND",
  "RELIANCE","TCS","HDFCBANK","INFY","ICICIBANK","HINDUNILVR","SUNPHARMA","TATAMOTORS",
  "AAPL","MSFT","NVDA","GOOGL","AMZN","META","JPM","XOM",
];

const InsightInput = z.object({
  tier: z.enum(["low", "medium", "high"]),
  portfolioValueINR: z.number(),
  dayPnlPct: z.number(),
  xirr: z.number(),
  topGainers: z.array(z.object({ symbol: z.string(), changePct: z.number() })),
  topLosers: z.array(z.object({ symbol: z.string(), changePct: z.number() })),
  concentration: z.array(z.object({ bucket: z.string(), pct: z.number() })),
  sectorMoves: z.array(z.object({ sector: z.string(), changePct: z.number() })),
});

const RebalanceSchema = z.object({
  narrative: z.string().describe("2-3 sentence plain-English summary tailored to this net-worth tier."),
  actions: z.array(z.object({
    symbol: z.string().describe("Must be one of the allowed instrument symbols."),
    action: z.enum(["INCREASE_SIP", "DECREASE_SIP", "PAUSE_SIP", "START_SIP", "TRIM", "ACCUMULATE", "HOLD"]),
    rationale: z.string(),
    confidence: z.enum(["low", "medium", "high"]),
  })).min(2).max(5),
  riskFlags: z.array(z.string()).max(4),
});

export type RebalanceResult = z.infer<typeof RebalanceSchema>;

export const generateInsight = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InsightInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      throw new Error("AI service unavailable: LOVABLE_API_KEY is not configured.");
    }
    const gateway = createLovableAiGatewayProvider(key);
    const tierLabels = {
      low: "Low net-worth investor (<₹25L). Focus on disciplined SIPs, index funds, ELSS for tax, building emergency fund. Avoid concentrated bets.",
      medium: "Medium net-worth investor (₹25L–₹2Cr). Balance equity/debt, diversify across market caps, modest international exposure, tax-efficient debt instruments.",
      high: "High net-worth investor (>₹2Cr). Sophisticated allocation across geographies, alternatives, direct equity, structured debt ladder, tax optimization is critical.",
    } as const;

    const prompt = `You are an analytical assistant on a financial dashboard. Tier: ${tierLabels[data.tier]}

Today's portfolio snapshot:
- Total value: ₹${data.portfolioValueINR.toLocaleString("en-IN")}
- Day P&L: ${data.dayPnlPct.toFixed(2)}%
- Approx XIRR: ${data.xirr.toFixed(1)}%
- Top gainers today: ${data.topGainers.map(g => `${g.symbol} ${g.changePct.toFixed(2)}%`).join(", ") || "none"}
- Top losers today: ${data.topLosers.map(l => `${l.symbol} ${l.changePct.toFixed(2)}%`).join(", ") || "none"}
- Allocation concentration: ${data.concentration.map(c => `${c.bucket} ${c.pct.toFixed(0)}%`).join(", ")}
- Sector moves: ${data.sectorMoves.map(s => `${s.sector} ${s.changePct.toFixed(2)}%`).join(", ")}

Allowed instrument symbols (MUST stay within this list): ${ALLOWED_SYMBOLS.join(", ")}

Produce 2-5 concrete, tier-appropriate rebalancing actions for SIPs, MFs, and debt instruments. Respect lock-ins (ELSS like MIRAEELS has a 3-year lock-in — never recommend trimming). Flag concentration risks above 40%. Do not invent symbols.`;

    try {
      const { experimental_output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt,
        experimental_output: Output.object({ schema: RebalanceSchema }),
      });
      // Filter out-of-universe symbols
      const cleaned: RebalanceResult = {
        ...experimental_output,
        actions: experimental_output.actions.filter((a) => ALLOWED_SYMBOLS.includes(a.symbol)),
      };
      return { ok: true as const, data: cleaned };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRate = msg.includes("429") || msg.toLowerCase().includes("rate");
      const isCredit = msg.includes("402") || msg.toLowerCase().includes("credit");
      return {
        ok: false as const,
        error: isCredit
          ? "AI credits exhausted on this workspace. Add credits in workspace billing to resume insights."
          : isRate
            ? "AI rate limit hit. Try again in a few seconds."
            : `AI insight failed: ${msg}`,
      };
    }
  });
