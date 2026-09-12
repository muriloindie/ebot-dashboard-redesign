"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Handshake, Target, TriangleAlert, UserRound } from "lucide-react";
import { crmStages, type CrmLead } from "@/data/crmMock";
import { computeCrmInsights, formatCurrency, listCrmLeads } from "@/lib/crm/crmService";
import { cn } from "@/lib/cn";

function withAlpha(hex: string, alpha: string) {
  const value = hex.replace("#", "");
  return value.length === 6 ? `#${value}${alpha}` : hex;
}

export function CrmFunnelWidget({ scale = 1, showStats = true }: { scale?: number; showStats?: boolean }) {
  const router = useRouter();
  const [leads, setLeads] = useState<CrmLead[]>([]);

  useEffect(() => {
    setLeads(listCrmLeads());
  }, []);

  const insights = useMemo(() => computeCrmInsights(leads), [leads]);

  const stages = useMemo(() => {
    const counts = crmStages.map((stage) => ({
      ...stage,
      count: Math.max(1, Math.round(leads.filter((lead) => lead.stage === stage.id).length * scale))
    }));
    const max = Math.max(...counts.map((stage) => stage.count), 1);
    return counts.map((stage) => ({ ...stage, ratio: stage.count / max }));
  }, [leads, scale]);

  const qualifiedConversion = insights.activeLeads
    ? Math.round((leads.filter((lead) => lead.score >= 70).length / Math.max(leads.length, 1)) * 100)
    : 0;

  return (
    <section data-chart-card className="glass-card flex h-full flex-col rounded-[24px] p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ebot-primaryText">CRM · Funil comercial</p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-ebot-dark">Leads qualificados pela IA</h2>
          <p className="mt-1 text-[13px] leading-5 text-ebot-muted">Visão do funil em tempo real, com valor em pipeline e pontos de atenção.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/crm")}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ebot-primary/20 bg-ebot-primary/[0.10] px-3 py-2 text-[12px] font-extrabold text-ebot-primaryText transition hover:bg-ebot-primary/20 focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
        >
          Ver CRM <ArrowRight className="size-3.5" />
        </button>
      </header>

      {showStats ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/40 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted"><Target className="size-3.5 text-ebot-primary" />Pipeline</p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-ebot-dark">{formatCurrency(insights.pipelineValue)}</p>
          </div>
          <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/40 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted"><Handshake className="size-3.5 text-ebot-green" />Ganhos</p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-ebot-dark">{formatCurrency(insights.wonValue)}</p>
          </div>
          <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.05] p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-red-500"><UserRound className="size-3.5" />Sem dono</p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-ebot-dark">{insights.unassignedLeads}</p>
          </div>
          <div className="rounded-2xl border border-ebot-orange/20 bg-ebot-orange/[0.06] p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ebot-orange"><TriangleAlert className="size-3.5" />Parados 3+ dias</p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-ebot-dark">{insights.staleLeads}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-1 flex-col justify-center gap-2.5">
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => router.push("/crm")}
            className="group flex items-center gap-3 rounded-2xl px-1 py-1 text-left transition hover:bg-ebot-primary/[0.05] focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
            aria-label={`${stage.label}: ${stage.count} leads`}
          >
            <span className="w-[112px] shrink-0 text-[12px] font-extrabold text-ebot-slate">{stage.label}</span>
            <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-ebot-surfaceMuted">
              <span className="block h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(stage.ratio * 100, 6)}%`, backgroundColor: stage.color }} />
            </span>
            <span className="w-10 shrink-0 text-right text-[12px] font-extrabold tabular-nums" style={{ color: withAlpha(stage.color, "FF") }}>{stage.count}</span>
          </button>
        ))}
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ebot-border/[0.10] pt-3 text-[12px] font-bold text-ebot-muted">
        <span>Qualificação IA: <strong className="text-ebot-primaryText">{qualifiedConversion}%</strong></span>
        <span>Conversão lead → ganho: <strong className="text-ebot-primaryText">{insights.conversionRate}%</strong></span>
        <span className={cn("rounded-full px-2.5 py-1", insights.unassignedLeads > 0 ? "bg-red-500/[0.08] text-red-500" : "bg-ebot-green/[0.08] text-ebot-green")}>
          {insights.unassignedLeads > 0 ? `${insights.unassignedLeads} lead(s) precisam de dono` : "Todos os leads com responsável"}
        </span>
      </footer>
    </section>
  );
}
