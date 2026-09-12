"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ListOrdered, PieChart } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SegmentedMenu } from "@/components/ui/SegmentedMenu";
import { Button } from "@/components/ui/Button";
import { CrmNextActions } from "./CrmNextActions";
import { LeadOriginsPanel } from "./LeadOriginsPanel";

type PanelView = "acoes" | "origens";

const options = [
  { id: "acoes" as PanelView, label: "Próximas ações", icon: ListOrdered },
  { id: "origens" as PanelView, label: "Leads por origem", icon: PieChart }
];

export function CrmInsightPanel() {
  const router = useRouter();
  const [view, setView] = useState<PanelView>("acoes");

  return (
    <GlassCard data-dash-panel className="flex flex-col p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[21px] font-extrabold tracking-[-0.03em] text-ebot-dark">
            {view === "acoes" ? "Próximas ações do funil" : "Leads por origem"}
          </h3>
          <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-ebot-muted">
            {view === "acoes"
              ? "Leads que precisam de dono ou de follow-up agora."
              : "De onde vêm os leads e qual canal converte melhor."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedMenu
            ariaLabel="Painel de leads"
            options={options}
            value={view}
            onChange={(id) => setView(id as PanelView)}
          />
          {view === "acoes" ? (
            <Button size="sm" variant="secondary" onClick={() => router.push("/crm")}>Abrir CRM <ArrowRight className="size-4" /></Button>
          ) : null}
        </div>
      </div>

      {view === "acoes" ? <CrmNextActions /> : <LeadOriginsPanel />}
    </GlassCard>
  );
}
