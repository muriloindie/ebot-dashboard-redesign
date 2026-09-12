"use client";

import { AlertTriangle, Handshake, Sparkles, Target, Timer, TrendingUp, UserRound, Wallet } from "lucide-react";
import { crmMetrics } from "@/data/dashboardMock";
import { AutomationInsights } from "./AutomationInsights";
import { ContactReasons } from "./ContactReasons";
import { CrmChartPanel } from "./CrmChartPanel";
import { CrmFunnelWidget } from "./CrmFunnelWidget";
import { CrmInsightPanel } from "./CrmInsightPanel";
import { MetricCard } from "./MetricCard";
import { RecentConversations } from "./RecentConversations";
import { TeamPerformanceTable } from "./TeamPerformanceTable";

const iconMap: Record<string, React.ElementType> = {
  Target,
  Handshake,
  Sparkles,
  TrendingUp,
  Wallet,
  Timer,
  AlertTriangle,
  UserRound
};

export function CrmDashboard({ scale = 1 }: { scale?: number }) {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-8 xl:gap-3" aria-label="Indicadores do CRM">
        {crmMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={{ ...metric, value: Math.max(1, Math.round(metric.value * scale)) }} icon={iconMap[metric.icon]} />
        ))}
      </section>

      <section className="grid min-w-0 items-stretch gap-4 lg:gap-6 2xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
        <CrmChartPanel scale={scale} />
        <CrmFunnelWidget scale={scale} showStats={false} />
      </section>

      <CrmInsightPanel />

      <section className="grid gap-4 lg:gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)]">
        <AutomationInsights />
        <ContactReasons />
      </section>

      <section className="grid gap-4 lg:gap-6 2xl:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.15fr)]">
        <RecentConversations />
        <TeamPerformanceTable />
      </section>
    </div>
  );
}
