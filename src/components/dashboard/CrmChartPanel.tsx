"use client";

import { useState } from "react";
import { Activity, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SegmentedMenu } from "@/components/ui/SegmentedMenu";
import { CrmMonthlyChart } from "./CrmMonthlyChart";
import { HourlyFlowChart } from "./WaveLineChart";

type ChartView = "ganhos" | "fluxo";

const options = [
  { id: "ganhos" as ChartView, label: "Ganhos e pipeline", icon: BarChart3 },
  { id: "fluxo" as ChartView, label: "Fluxo por hora", icon: Activity }
];

export function CrmChartPanel({ scale = 1 }: { scale?: number }) {
  const [view, setView] = useState<ChartView>("ganhos");

  return (
    <GlassCard data-chart-card className="flex min-w-0 flex-col p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[21px] font-extrabold tracking-[-0.03em] text-ebot-dark">
            {view === "ganhos" ? "Ganhos e pipeline por mês" : "Fluxo por hora"}
          </h3>
          <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-ebot-muted">
            {view === "ganhos"
              ? "Compare o valor fechado com o pipeline acumulado para enxergar tendência comercial."
              : "Volume de conversas, transferências humanas e resoluções automáticas ao longo do dia."}
          </p>
        </div>
        <SegmentedMenu
          ariaLabel="Gráfico do CRM"
          options={options}
          value={view}
          onChange={(id) => setView(id as ChartView)}
        />
      </div>

      {view === "ganhos" ? <CrmMonthlyChart scale={scale} /> : <HourlyFlowChart scale={scale} />}
    </GlassCard>
  );
}
