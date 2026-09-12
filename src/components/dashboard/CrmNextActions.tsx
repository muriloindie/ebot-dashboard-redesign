"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Sparkles, UserRound } from "lucide-react";
import type { CrmLead } from "@/data/crmMock";
import { formatCurrency, isTerminal, listCrmLeads } from "@/lib/crm/crmService";
import { cn } from "@/lib/cn";

export function CrmNextActions() {
  const router = useRouter();
  const [leads, setLeads] = useState<CrmLead[]>([]);

  useEffect(() => {
    setLeads(listCrmLeads());
  }, []);

  const priority = [...leads]
    .filter((lead) => !isTerminal(lead.stage))
    .sort((a, b) => {
      const aScore = (a.owner === "Sem responsável" ? 100 : 0) + a.staleDays;
      const bScore = (b.owner === "Sem responsável" ? 100 : 0) + b.staleDays;
      return bScore - aScore;
    })
    .slice(0, 5);

  return (
    <ul className="flex flex-1 flex-col divide-y divide-ebot-border/[0.08]">
      {priority.map((lead) => (
        <li key={lead.id}>
          <button
            type="button"
            onClick={() => router.push("/crm")}
            className="group flex w-full items-center gap-3 py-3 text-left transition hover:bg-ebot-primary/[0.04]"
          >
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", lead.owner === "Sem responsável" ? "bg-ebot-orange/[0.12] text-ebot-orange" : lead.staleDays >= 3 ? "bg-red-500/[0.08] text-red-500" : "bg-ebot-primary/[0.10] text-ebot-primaryText")}>
              {lead.owner === "Sem responsável" ? <UserRound className="size-4" /> : lead.staleDays >= 3 ? <AlertTriangle className="size-4" /> : <Sparkles className="size-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-extrabold text-ebot-dark">{lead.name}</span>
                {lead.company ? <span className="hidden truncate text-[12px] font-semibold text-ebot-muted sm:inline">· {lead.company}</span> : null}
              </span>
              <span className="mt-0.5 block truncate text-[12px] font-semibold text-ebot-muted">{lead.nextAction ?? "Definir próxima ação"}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-extrabold tabular-nums text-ebot-dark">{formatCurrency(lead.value)}</span>
              <span className={cn("mt-0.5 block text-[11px] font-extrabold", lead.owner === "Sem responsável" ? "text-ebot-orange" : lead.staleDays >= 3 ? "text-red-500" : "text-ebot-muted")}>
                {lead.owner === "Sem responsável" ? "sem dono" : lead.staleDays >= 3 ? `parado há ${lead.staleDays}d` : lead.owner}
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-ebot-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </button>
        </li>
      ))}
      {priority.length === 0 ? (
        <li className="py-6 text-center text-sm font-semibold text-ebot-muted">Nenhum lead pendente — funil em dia.</li>
      ) : null}
    </ul>
  );
}
