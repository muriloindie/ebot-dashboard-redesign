"use client";

import type { Metric } from "@/data/dashboardMock";
import { cn } from "@/lib/cn";
import { ReelNumber } from "./ReelNumber";

type MetricCardProps = {
  metric: Metric;
  icon: React.ElementType;
};

export function MetricCard({ metric, icon: Icon }: MetricCardProps) {
  return (
    <div
      data-kpi-card
      className="group glass-card relative overflow-hidden rounded-[24px] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(43,159,232,0.16)]"
    >
      <div className="absolute -right-10 -top-10 size-28 rounded-full bg-clinical-blue/10 blur-2xl transition group-hover:bg-clinical-teal/[0.15]" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-clinical-blue/10 text-clinical-blue transition duration-300 group-hover:scale-105 group-hover:bg-clinical-blue group-hover:text-white">
          <Icon className="size-5" />
        </div>
        {metric.delta ? (
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-extrabold",
              metric.deltaTone === "warning"
                ? "border-clinical-orange/25 bg-clinical-orange/10 text-clinical-orange"
                : "border-clinical-green/20 bg-clinical-green/10 text-clinical-green"
            )}
          >
            {metric.delta}
          </span>
        ) : null}
      </div>
      <div className="relative mt-5">
        <p className="text-sm font-bold text-clinical-muted">{metric.title}</p>
        <p className="mt-2 h-[48px]">
          <ReelNumber value={metric.value} format={metric.format} />
        </p>
        {metric.subtitle ? <p className="mt-1 text-xs font-semibold text-clinical-muted/75">{metric.subtitle}</p> : null}
      </div>
    </div>
  );
}
