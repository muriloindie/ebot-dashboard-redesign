"use client";

import type { Metric } from "@/data/dashboardMock";
import { cn } from "@/lib/cn";
import { ReelNumber } from "./ReelNumber";

type MetricCardProps = {
  metric: Metric;
  icon: React.ElementType;
};

const metricVisuals: Record<string, { accent: string; aura: string; gradient: string; iconBg: string }> = {
  "today-service": {
    accent: "#3A9DCA",
    aura: "rgba(58,157,202,0.18)",
    gradient: "radial-gradient(circle at 12% 0%, rgba(58,157,202,0.18), transparent 36%), linear-gradient(145deg, rgb(var(--clinical-surface) / 0.96), rgb(var(--clinical-surface-muted) / 0.74))",
    iconBg: "rgba(58,157,202,0.12)"
  },
  "ai-resolved": {
    accent: "#087DFF",
    aura: "rgba(8,125,255,0.18)",
    gradient: "radial-gradient(circle at 14% 0%, rgba(8,125,255,0.18), transparent 36%), linear-gradient(145deg, rgb(var(--clinical-surface) / 0.96), rgb(var(--clinical-surface-muted) / 0.74))",
    iconBg: "rgba(8,125,255,0.12)"
  },
  "human-waiting": {
    accent: "#30A3A4",
    aura: "rgba(48,163,164,0.18)",
    gradient: "radial-gradient(circle at 14% 0%, rgba(48,163,164,0.18), transparent 36%), linear-gradient(145deg, rgb(var(--clinical-surface) / 0.96), rgb(var(--clinical-surface-muted) / 0.74))",
    iconBg: "rgba(48,163,164,0.12)"
  },
  confirmed: {
    accent: "#87A630",
    aura: "rgba(135,166,48,0.18)",
    gradient: "radial-gradient(circle at 14% 0%, rgba(135,166,48,0.18), transparent 36%), linear-gradient(145deg, rgb(var(--clinical-surface) / 0.96), rgb(var(--clinical-surface-muted) / 0.74))",
    iconBg: "rgba(135,166,48,0.14)"
  },
  "response-time": {
    accent: "#3A9DCA",
    aura: "rgba(58,157,202,0.16)",
    gradient: "radial-gradient(circle at 14% 0%, rgba(58,157,202,0.16), transparent 36%), linear-gradient(145deg, rgb(var(--clinical-surface) / 0.96), rgb(var(--clinical-surface-muted) / 0.74))",
    iconBg: "rgba(58,157,202,0.12)"
  },
  "waiting-time": {
    accent: "#F19D18",
    aura: "rgba(241,157,24,0.16)",
    gradient: "radial-gradient(circle at 14% 0%, rgba(241,157,24,0.16), transparent 36%), linear-gradient(145deg, rgb(var(--clinical-surface) / 0.96), rgb(var(--clinical-surface-muted) / 0.74))",
    iconBg: "rgba(241,157,24,0.13)"
  },
  "no-show": {
    accent: "#54C936",
    aura: "rgba(84,201,54,0.16)",
    gradient: "radial-gradient(circle at 14% 0%, rgba(84,201,54,0.16), transparent 36%), linear-gradient(145deg, rgb(var(--clinical-surface) / 0.96), rgb(var(--clinical-surface-muted) / 0.74))",
    iconBg: "rgba(84,201,54,0.12)"
  },
  "after-hours": {
    accent: "#6F7BFF",
    aura: "rgba(111,123,255,0.16)",
    gradient: "radial-gradient(circle at 14% 0%, rgba(111,123,255,0.17), transparent 36%), linear-gradient(145deg, rgb(var(--clinical-surface) / 0.96), rgb(var(--clinical-surface-muted) / 0.74))",
    iconBg: "rgba(111,123,255,0.12)"
  }
};

export function MetricCard({ metric, icon: Icon }: MetricCardProps) {
  const visual = metricVisuals[metric.id] ?? metricVisuals["today-service"];

  return (
    <div
      data-kpi-card
      className="kpi-premium-card group relative min-h-[150px] overflow-hidden rounded-[24px] border p-3.5 shadow-[0_16px_42px_rgba(38,53,50,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(38,53,50,0.12)] dark:shadow-[0_18px_48px_rgba(0,0,0,0.22)]"
      style={{
        background: visual.gradient,
        borderColor: `${visual.accent}28`,
        "--kpi-aura": visual.aura
      } as React.CSSProperties}
    >
      <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80" />
      <div className="relative flex items-start justify-between gap-2">
        <div
          className="flex size-10 items-center justify-center rounded-[16px] shadow-[inset_4px_4px_10px_rgba(38,53,50,0.05),inset_-4px_-4px_10px_rgba(255,255,255,0.62)] transition duration-300 group-hover:scale-105 dark:shadow-none"
          style={{ backgroundColor: visual.iconBg, color: visual.accent }}
        >
          <Icon className="size-[18px]" />
        </div>
        {metric.delta ? (
          <span
            className={cn(
              "metric-delta-pop rounded-full border px-2.5 py-1.5 text-[13px] font-black shadow-[0_10px_26px_rgba(77,181,43,0.16)]",
              metric.deltaTone === "warning"
                ? "border-clinical-orange/30 bg-clinical-orange/[0.14] text-clinical-orange shadow-[0_10px_26px_rgba(241,157,24,0.15)]"
                : "border-[#54C936]/30 bg-[#54C936]/[0.14] text-[#2F8E1F] dark:text-[#8CF076]"
            )}
          >
            {metric.delta}
          </span>
        ) : null}
      </div>
      <div className="relative mt-4">
        <p className="min-h-[32px] text-[13px] font-extrabold leading-4 text-clinical-muted">{metric.title}</p>
        <p className="mt-1 h-[38px] overflow-hidden">
          <ReelNumber value={metric.value} format={metric.format} />
        </p>
        {metric.subtitle ? <p className="mt-1 truncate text-[12px] font-semibold text-clinical-muted/80">{metric.subtitle}</p> : null}
      </div>
    </div>
  );
}
