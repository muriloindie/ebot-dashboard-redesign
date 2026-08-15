"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts";
import { Activity, Bot, UsersRound } from "lucide-react";
import { hourlyFlow } from "@/data/dashboardMock";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";

type SeriesKey = "total" | "ai" | "human";

const toggles: { key: SeriesKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: "total", label: "Total", icon: Activity, color: "#3A9DCA" },
  { key: "ai", label: "Resolvidos por IA", icon: Bot, color: "#30A3A4" },
  { key: "human", label: "Transferidos", icon: UsersRound, color: "#87A630" }
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface/90 p-3 text-[13px] shadow-card backdrop-blur-xl">
      <p className="mb-2 font-extrabold text-clinical-dark">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="flex items-center gap-2 font-semibold text-clinical-muted">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}: <span className="font-extrabold text-clinical-dark">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

export function WaveLineChart({ scale = 1 }: { scale?: number }) {
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({ total: true, ai: true, human: true });
  const activeCount = useMemo(() => Object.values(visible).filter(Boolean).length, [visible]);
  const chartData = useMemo(() => hourlyFlow.map((point) => ({ ...point, total: Math.max(1, Math.round(point.total * scale)), ai: Math.max(1, Math.round(point.ai * scale)), human: Math.max(1, Math.round(point.human * scale)) })), [scale]);

  function toggleSeries(key: SeriesKey) {
    setVisible((current) => {
      if (current[key] && activeCount === 1) return current;
      return { ...current, [key]: !current[key] };
    });
  }

  return (
    <GlassCard data-chart-card className="flex min-w-0 flex-col overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h3 className="text-[21px] font-extrabold tracking-[-0.03em] text-clinical-dark">Fluxo por hora</h3>
          <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-clinical-muted">
            Volume de conversas, transferências humanas e resoluções automáticas ao longo do dia.
          </p>
        </div>
        <div className="clinical-scrollbar flex max-w-full shrink-0 gap-1.5 overflow-x-auto rounded-full border border-clinical-border/[0.10] bg-clinical-surface/62 p-1">
          {toggles.map((toggle) => {
            const Icon = toggle.icon;
            const active = visible[toggle.key];
            return (
              <button
                key={toggle.key}
                type="button"
                aria-pressed={active}
                onClick={() => toggleSeries(toggle.key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition duration-200 focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
                  active ? "bg-clinical-surface text-clinical-blueText shadow-[0_6px_16px_rgba(38,53,50,0.06)]" : "text-clinical-muted hover:bg-clinical-surface/70 hover:text-clinical-slate"
                )}
              >
                <Icon className="size-3.5" style={{ color: active ? toggle.color : undefined }} /> {toggle.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 h-[260px] w-full min-w-0 max-w-full overflow-hidden rounded-[22px] border border-clinical-border/[0.08] bg-gradient-to-b from-clinical-surface/80 to-clinical-blue/[0.025] p-2 sm:h-[300px] sm:rounded-[24px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 18, right: 8, left: -28, bottom: 8 }}>
            <defs>
              <linearGradient id="totalStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#3A9DCA" />
                <stop offset="100%" stopColor="#30A3A4" />
              </linearGradient>
              <linearGradient id="totalFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3A9DCA" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#3A9DCA" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(58,157,202,0.09)" strokeDasharray="4 10" vertical={false} />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "rgb(var(--clinical-muted))", fontSize: 12, fontWeight: 700 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgb(var(--clinical-muted))", fontSize: 12, fontWeight: 700 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(43,159,232,0.22)", strokeWidth: 1 }} />
            {visible.total ? (
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="url(#totalStroke)"
                strokeWidth={3}
                fill="url(#totalFill)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff", fill: "#3A9DCA" }}
                animationDuration={1200}
              />
            ) : null}
            {visible.ai ? (
              <Area type="monotone" dataKey="ai" name="IA" stroke="#30A3A4" strokeWidth={2.25} fill="transparent" dot={false} activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#fff", fill: "#30A3A4" }} animationDuration={1100} />
            ) : null}
            {visible.human ? (
              <Area type="monotone" dataKey="human" name="Humano" stroke="#87A630" strokeWidth={2.25} fill="transparent" dot={false} activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#fff", fill: "#87A630" }} animationDuration={1100} />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 rounded-2xl border border-clinical-teal/[0.15] bg-clinical-teal/10 px-4 py-3 text-[14px] font-semibold leading-6 text-clinical-slate">
        Pico de atendimento entre <span className="font-extrabold text-clinical-dark">18h e 21h</span>. A IA resolveu <span className="font-extrabold text-clinical-blue">76%</span> das conversas fora do horário comercial.
      </div>
    </GlassCard>
  );
}
