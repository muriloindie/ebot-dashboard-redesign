"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { animationsEnabled } from "@/lib/usePageEnter";
import { CrmDashboard } from "./CrmDashboard";
import { DashboardHeader } from "./DashboardHeader";
import { ExportReportModal } from "./ExportReportModal";
import { NewFlowModal } from "./NewFlowModal";
import { SmartFilters } from "./SmartFilters";
import type { DashboardFilters } from "./SmartFilters";

export function DashboardPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [newFlowOpen, setNewFlowOpen] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({ period: "Hoje", channel: "Todos", status: "Todos", team: "Todas" });

  const filterFactor = (() => {
    let factor = filters.period === "7 dias" ? 0.84 : filters.period === "30 dias" ? 0.72 : filters.period === "Personalizado" ? 0.61 : 1;
    if (filters.channel !== "Todos") factor *= 0.78;
    if (filters.status === "Aguardando") factor *= 0.2;
    if (filters.status === "IA resolveu") factor *= 0.68;
    if (filters.status === "Humano assumiu") factor *= 0.32;
    if (filters.team !== "Todas") factor *= 0.46;
    return Math.max(factor, 0.08);
  })();

  useEffect(() => {
    if (!ref.current || !animationsEnabled()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-kpi-card]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.055, delay: 0.2, clearProps: "opacity,transform" });
      gsap.fromTo("[data-chart-card]", { opacity: 0, scale: 0.985, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "power3.out", delay: 0.46, clearProps: "opacity,transform" });
      gsap.fromTo("[data-dash-panel]", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, delay: 0.58, clearProps: "opacity,transform" });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest("#export-report-trigger")) {
        event.preventDefault();
        setExportOpen(true);
      }
      if (target.closest("#new-flow-trigger")) {
        event.preventDefault();
        setNewFlowOpen(true);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={ref} className="space-y-4 sm:space-y-5 lg:space-y-6">
      <DashboardHeader />
      <SmartFilters filters={filters} onChange={setFilters} />
      <CrmDashboard scale={filterFactor} />
      <ExportReportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <NewFlowModal open={newFlowOpen} onClose={() => setNewFlowOpen(false)} />
    </div>
  );
}
