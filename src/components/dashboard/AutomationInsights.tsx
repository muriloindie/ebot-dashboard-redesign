import { AlertTriangle, ArrowRight, CalendarPlus, ClipboardList, Sparkles, Workflow } from "lucide-react";
import { automationInsights } from "@/data/dashboardMock";
import { GlassCard } from "@/components/ui/GlassCard";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  Workflow,
  CalendarPlus,
  AlertTriangle
};

export function AutomationInsights() {
  return (
    <GlassCard className="p-4 sm:p-5 lg:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[22px] font-extrabold tracking-[-0.03em] text-clinical-dark">Insights da IA</h3>
          <p className="mt-2 text-[15px] leading-7 text-clinical-muted">Oportunidades operacionais detectadas nas conversas de hoje.</p>
        </div>
        <div className="hidden size-11 items-center justify-center rounded-2xl bg-clinical-blue/[0.10] text-clinical-blueText sm:flex">
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
              className="group relative rounded-[24px] border border-clinical-blue/[0.14] bg-[linear-gradient(145deg,rgb(var(--clinical-surface)/0.96),rgb(var(--clinical-surface-muted)/0.78))] p-4 shadow-[0_18px_46px_rgba(58,157,202,0.10)] transition duration-300 hover:-translate-y-1 hover:border-clinical-blue/30 hover:shadow-[0_24px_64px_rgba(58,157,202,0.16)] dark:bg-[linear-gradient(145deg,rgba(38,53,50,0.95),rgba(26,37,34,0.88))]"
            >
              <div className="relative mb-4 flex items-start justify-between gap-3">
                <div className="flex size-12 items-center justify-center rounded-[18px] bg-clinical-surface text-clinical-blueText shadow-[8px_8px_18px_rgba(38,53,50,0.08),-8px_-8px_18px_rgba(255,255,255,0.72)] transition duration-300 group-hover:scale-105 group-hover:text-clinical-blue dark:bg-white/[0.08] dark:shadow-[0_12px_26px_rgba(0,0,0,0.22)]">
                  <Icon className="size-[21px]" />
                </div>
                <span className="rounded-full border border-clinical-teal/20 bg-clinical-teal/[0.12] px-2.5 py-1 text-[13px] font-extrabold text-clinical-teal shadow-[0_8px_18px_rgba(48,163,164,0.10)]">
                  {insight.category}
                </span>
              </div>
              <p className="relative text-[17px] font-black leading-6 tracking-[-0.02em] text-clinical-dark">{insight.title}</p>
              <p className="relative mt-2 min-h-[58px] text-[14px] font-semibold leading-6 text-clinical-muted">
                {beforeHighlight}
                <span className="font-black text-clinical-blueText">{insight.highlight}</span>
                {afterHighlight}
              </p>
              <button className="relative mt-4 inline-flex items-center gap-2 rounded-2xl border border-clinical-blue/20 bg-clinical-blue px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[0_12px_30px_rgba(58,157,202,0.20)] transition duration-300 hover:bg-clinical-blueHover hover:shadow-[0_16px_38px_rgba(58,157,202,0.24)] focus:outline-none focus:ring-2 focus:ring-clinical-blue/25">
                {insight.action} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
