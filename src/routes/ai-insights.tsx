import { createFileRoute } from "@tanstack/react-router";
import { TickerRail } from "@/components/shell";
import { TierSelector } from "@/components/tier-selector";
import { AiInsightsPanel } from "@/components/ai-insights-panel";
import { AlertsFeed } from "@/components/alerts-feed";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({
    meta: [
      { title: "AI Insights · FinPulse AI" },
      { name: "description", content: "Tier-aware AI rebalancing recommendations for SIPs, mutual funds, and debt instruments." },
      { property: "og:title", content: "AI Insights · FinPulse AI" },
      { property: "og:description", content: "Run the AI over your portfolio for concrete SIP, MF, and debt actions." },
    ],
  }),
  component: AiInsights,
});

function AiInsights() {
  return (
    <div>
      <TickerRail />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-sm text-muted-foreground">Tier-aware, lock-in aware. Constrained to the seeded instrument universe.</p>
          </div>
          <TierSelector />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <AiInsightsPanel />
          <AlertsFeed />
        </div>
      </div>
    </div>
  );
}
