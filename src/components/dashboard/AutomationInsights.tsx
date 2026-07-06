import { AlertTriangle, CalendarPlus, ClipboardList, Workflow } from "lucide-react";
import { automationInsights } from "@/data/dashboardMock";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  Workflow,
  CalendarPlus,
  AlertTriangle
};

export function AutomationInsights() {
  return (
    <GlassCard className="p-5 lg:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold tracking-[-0.03em] text-clinical-dark">Insights da IA</h3>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">Oportunidades operacionais detectadas nas conversas de hoje.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {automationInsights.map((insight) => {
          const Icon = iconMap[insight.icon];
          return (
            <div key={insight.title} className="rounded-[22px] border border-clinical-blue/10 bg-white/[0.62] p-4 transition hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:bg-white">
              <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-clinical-blue/10 text-clinical-blue">
                <Icon className="size-[18px]" />
              </div>
              <p className="text-sm font-extrabold text-clinical-dark">{insight.title}</p>
              <p className="mt-2 min-h-[40px] text-xs font-medium leading-5 text-clinical-muted">{insight.description}</p>
              <Button variant="ghost" size="sm" className="mt-3 px-0 hover:bg-transparent">
                {insight.action}
              </Button>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
