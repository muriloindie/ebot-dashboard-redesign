"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, CalendarCheck, Hourglass, MessageCircle, Moon, ShieldCheck, Timer, UserRoundCheck } from "lucide-react";
import gsap from "gsap";
import { metrics } from "@/data/dashboardMock";
import { AppointmentTimeline } from "./AppointmentTimeline";
import { AutomationInsights } from "./AutomationInsights";
import { ContactReasons } from "./ContactReasons";
import { DashboardHeader } from "./DashboardHeader";
import { ExportReportModal } from "./ExportReportModal";
import { MetricCard } from "./MetricCard";
import { NewFlowModal } from "./NewFlowModal";
import { RecentConversations } from "./RecentConversations";
import { SmartFilters } from "./SmartFilters";
import { TeamPerformanceTable } from "./TeamPerformanceTable";
import { WaveLineChart } from "./WaveLineChart";

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Bot,
  UserRoundCheck,
  CalendarCheck,
  Timer,
  Hourglass,
  ShieldCheck,
  Moon
};

export function DashboardPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [newFlowOpen, setNewFlowOpen] = useState(false);

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-kpi-card]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.055, delay: 0.2 });
      gsap.fromTo("[data-chart-card]", { opacity: 0, scale: 0.985, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "power3.out", delay: 0.46 });
      gsap.fromTo("[data-right-panel]", { opacity: 0, x: 28 }, { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.52 });
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
      <SmartFilters />

      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-8 xl:gap-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} icon={iconMap[metric.icon]} />
        ))}
      </section>

      <section className="grid min-w-0 items-stretch gap-4 lg:gap-6 2xl:grid-cols-[minmax(0,0.92fr)_minmax(460px,0.72fr)]">
        <WaveLineChart />
        <AppointmentTimeline />
      </section>

      <section className="grid gap-4 lg:gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)]">
        <AutomationInsights />
        <ContactReasons />
      </section>

      <section className="grid gap-4 lg:gap-6 2xl:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.15fr)]">
        <RecentConversations />
        <TeamPerformanceTable />
      </section>

      <ExportReportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <NewFlowModal open={newFlowOpen} onClose={() => setNewFlowOpen(false)} />
    </div>
  );
}
