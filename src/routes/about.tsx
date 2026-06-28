import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · FinPulse AI" },
      { name: "description", content: "Methodology, data sources, hypotheses, and edge cases behind the FinPulse AI demo." },
      { property: "og:title", content: "About · FinPulse AI" },
      { property: "og:description", content: "What FinPulse AI is, what it isn't, and how the simulation works." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight">About FinPulse AI</h1>
      <p className="mt-4 text-muted-foreground">
        FinPulse AI is a prototype financial command center. It fuses real-time market data, sectoral KPIs, OKR goal tracking, and AI-narrated portfolio insights tuned to three net-worth tiers — Low, Medium, and High — so investors can make smarter calls on SIPs, mutual funds, and debt instruments.
      </p>

      <Section title="Hypotheses">
        <ol className="list-decimal space-y-2 pl-5">
          <li><b>Decision friction, not data scarcity, is the real problem.</b> HNIs already have data; they lack one glanceable surface fusing macro + sector + portfolio + AI narrative.</li>
          <li><b>Net-worth tier changes the right answer.</b> A rebalance for ₹5L is not the rebalance for ₹5Cr. Tier is a first-class filter.</li>
          <li><b>AI is most useful as a "why" layer.</b> Charts answer <i>what</i> moved; the AI panel answers <i>why it matters to this portfolio</i> and <i>what to do next month</i>.</li>
          <li><b>OKR framing resonates.</b> Retirement / education / legacy goals map naturally to SIP step-up math.</li>
          <li><b>Public demo is enough for UX validation.</b> A seeded portfolio + tier toggle proves the value without onboarding drag.</li>
        </ol>
      </Section>

      <Section title="Edge cases identified">
        <ul className="list-disc space-y-2 pl-5">
          <li><b>Market sessions</b> — IST, ET, and 24/7 crypto are tracked separately; session badges show open/pre/after/closed.</li>
          <li><b>Currency mixing</b> — INR + USD holdings reconcile through a live USD/INR cross; we never silently sum across currencies.</li>
          <li><b>Concentration risk</b> — sector exposure above 40% triggers a dedicated alert.</li>
          <li><b>Lock-in instruments</b> — ELSS funds carry a 3-year lock-in; the AI is instructed never to recommend trimming them.</li>
          <li><b>Negative XIRR</b> — losers are surfaced explicitly, never hidden.</li>
          <li><b>SIP on a holiday</b> — projected debit shifts to the next business day.</li>
          <li><b>AI hallucinations</b> — recommendations are post-filtered against an allow-list of seeded instruments.</li>
          <li><b>AI failures (429 rate / 402 credits)</b> — surfaced inline with a retry, never a blank panel.</li>
          <li><b>Reduced motion / color-blindness</b> — tick animations disable on user preference; gain/loss use arrows + color, not color alone.</li>
        </ul>
      </Section>

      <Section title="Tech under the hood">
        <ul className="list-disc space-y-2 pl-5">
          <li>TanStack Start + TanStack Query + Tailwind v4.</li>
          <li>Zustand store + per-symbol Brownian-motion simulator (seeded per day for SSR continuity).</li>
          <li>Recharts for KPI/sector/yield visualizations.</li>
          <li>AI Insights via Lovable AI Gateway (Gemini 3 Flash) with structured output and a strict instrument allow-list.</li>
        </ul>
      </Section>

      <div className="mt-10 rounded-xl border border-warn/40 bg-warn-soft/40 p-4 text-sm">
        <p className="font-semibold text-warn">Educational, not investment advice.</p>
        <p className="mt-1 text-foreground/90">All market data shown is simulated. Holdings, SIPs, and AI recommendations are for demonstration of UX and analytical patterns only.</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}
