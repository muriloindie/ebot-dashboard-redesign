"use client";

import type { Metric } from "@/data/dashboardMock";
import { cn } from "@/lib/cn";
import { ReelNumber } from "./ReelNumber";

type MetricCardProps = {
  metric: Metric;
  icon: React.ElementType;
};

const metricVisual = {
  accent: "#3A9DCA",
  iconBg: "rgba(58,157,202,0.11)"
};

export function MetricCard({ metric, icon: Icon }: MetricCardProps) {
  return (
    <div
      data-kpi-card
      className="group relative min-h-[124px] overflow-hidden rounded-[22px] border bg-clinical-surface/90 p-3 shadow-[0_8px_22px_rgba(38,53,50,0.045)] transition duration-200 hover:border-clinical-blue/25 hover:bg-clinical-surface dark:bg-clinical-surface/90 dark:shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
      style={{
        borderColor: `${metricVisual.accent}22`
      } as React.CSSProperties}
    >
      <div className="relative flex items-start justify-between gap-2">
        <div
          className="flex size-9 items-center justify-center rounded-[14px] transition duration-200 group-hover:bg-clinical-blue/[0.10]"
          style={{ backgroundColor: metricVisual.iconBg, color: metricVisual.accent }}
        >
          <Icon className="size-[18px]" />
        </div>
        {metric.delta ? (
          <span
            className={cn(
              "rounded-full border px-2 py-1 text-[12px] font-black",
              metric.deltaTone === "warning"
                ? "border-clinical-orange/25 bg-clinical-orange/[0.10] text-clinical-orange"
                : "border-[#54C936]/30 bg-[#54C936]/[0.14] text-[#2F8E1F] dark:text-[#8CF076]"
            )}
          >
            {metric.delta}
          </span>
        ) : null}
      </div>
      <div className="relative mt-3">
        <p className="min-h-[34px] text-[14px] font-extrabold leading-[17px] text-clinical-slate">{metric.title}</p>
        <p className="mt-1 h-[38px] overflow-hidden">
          <ReelNumber value={metric.value} format={metric.format} />
        </p>
        {metric.subtitle ? <p className="mt-1 truncate text-[12px] font-semibold text-clinical-muted/80">{metric.subtitle}</p> : null}
      </div>
    </div>
  );
}
