"use client";

import { AlertTriangle, ArrowRight, CalendarPlus, ClipboardList, Sparkles, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { automationInsights } from "@/data/dashboardMock";
import { GlassCard } from "@/components/ui/GlassCard";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  Workflow,
  CalendarPlus,
  AlertTriangle
};

export function AutomationInsights() {
  const router = useRouter();
  const routes: Record<string, string> = { "Criar automação": "/fluxos-automacao", "Ver conversas": "/atendimentos", "Enviar campanha": "/campanhas" };
  return (
    <GlassCard className="p-4 sm:p-5 lg:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[22px] font-extrabold tracking-[-0.03em] text-ebot-dark">Insights da IA</h3>
          <p className="mt-2 text-[15px] leading-7 text-ebot-muted">Oportunidades operacionais detectadas nas conversas de hoje.</p>
        </div>
        <div className="hidden size-11 items-center justify-center rounded-2xl bg-ebot-primary/[0.10] text-ebot-primaryText sm:flex">
          <Sparkles className="size-5" />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {automationInsights.map((insight) => {
          const Icon = iconMap[insight.icon];
          const [beforeHighlight, afterHighlight] = insight.description.split(insight.highlight);
          return (
            <div
              key={insight.title}
              className="group relative rounded-[24px] border border-ebot-primary/[0.14] bg-[linear-gradient(145deg,rgb(var(--ebot-surface)/0.96),rgb(var(--ebot-surface-muted)/0.78))] p-4 shadow-[0_18px_46px_rgba(4,27,21,0.06)] transition duration-300 hover:-translate-y-1 hover:border-ebot-primary/30 hover:shadow-[0_24px_64px_rgba(4,27,21,0.10)] dark:bg-[linear-gradient(145deg,rgba(8,33,26,0.95),rgba(13,44,36,0.88))]"
            >
              <div className="relative mb-4 flex items-start justify-between gap-3">
                <div className="flex size-12 items-center justify-center rounded-[18px] bg-ebot-surface text-ebot-primaryText shadow-[8px_8px_18px_rgba(4,27,21,0.08),-8px_-8px_18px_rgba(255,255,255,0.72)] transition duration-300 group-hover:scale-105 group-hover:text-ebot-primary dark:bg-white/[0.08] dark:shadow-[0_12px_26px_rgba(0,0,0,0.22)]">
                  <Icon className="size-[21px]" />
                </div>
                <span className="rounded-full border border-ebot-teal/20 bg-ebot-teal/[0.12] px-2.5 py-1 text-[13px] font-extrabold text-ebot-teal shadow-[0_8px_18px_rgba(64,139,120,0.12)]">
                  {insight.category}
                </span>
              </div>
              <p className="relative text-[17px] font-black leading-6 tracking-[-0.02em] text-ebot-dark">{insight.title}</p>
              <p className="relative mt-2 min-h-[58px] text-[14px] font-semibold leading-6 text-ebot-muted">
                {beforeHighlight}
                <span className="font-black text-ebot-primaryText">{insight.highlight}</span>
                {afterHighlight}
              </p>
              <button type="button" onClick={() => router.push(routes[insight.action] ?? "/fluxos-automacao")} className="relative mt-4 inline-flex items-center gap-2 rounded-2xl border border-ebot-primary/20 bg-ebot-primary px-4 py-2.5 text-[13px] font-extrabold text-ebot-charcoal shadow-[0_12px_30px_rgba(169,209,108,0.30)] transition duration-300 hover:bg-ebot-primaryHover hover:shadow-[0_16px_38px_rgba(169,209,108,0.36)] focus:outline-none focus:ring-2 focus:ring-ebot-primary/25">
                {insight.action} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
