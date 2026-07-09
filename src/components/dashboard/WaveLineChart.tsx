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
  { key: "human", label: "Transferidos", icon: UsersRound, color: "#F19D18" }
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

export function WaveLineChart() {
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({ total: true, ai: true, human: true });
  const activeCount = useMemo(() => Object.values(visible).filter(Boolean).length, [visible]);

  function toggleSeries(key: SeriesKey) {
    setVisible((current) => {
      if (current[key] && activeCount === 1) return current;
      return { ...current, [key]: !current[key] };
    });
  }

  return (
    <GlassCard data-chart-card className="flex flex-col p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-[21px] font-extrabold tracking-[-0.03em] text-clinical-dark">Fluxo por hora</h3>
          <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-clinical-muted">
            Volume de conversas, transferências humanas e resoluções automáticas ao longo do dia.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {toggles.map((toggle) => {
            const Icon = toggle.icon;
            const active = visible[toggle.key];
            return (
              <button
                key={toggle.key}
                onClick={() => toggleSeries(toggle.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-extrabold transition duration-300 focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
                  active ? "border-clinical-blue/20 bg-clinical-blue/10 text-clinical-blueText" : "border-clinical-border/[0.10] bg-clinical-surface/55 text-clinical-muted"
                )}
              >
                <Icon className="size-3.5" /> {toggle.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 min-h-[300px] flex-1 rounded-[24px] border border-clinical-border/[0.08] bg-gradient-to-b from-clinical-surface/78 to-clinical-blue/[0.03] p-2">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyFlow} margin={{ top: 18, right: 14, left: -22, bottom: 8 }}>
            <defs>
              <linearGradient id="totalStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#3A9DCA" />
                <stop offset="100%" stopColor="#30A3A4" />
              </linearGradient>
              <linearGradient id="totalFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3A9DCA" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#3A9DCA" stopOpacity={0.02} />
              </linearGradient>
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid stroke="rgba(43,159,232,0.10)" strokeDasharray="4 8" vertical={false} />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "#52625F", fontSize: 12, fontWeight: 700 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#52625F", fontSize: 12, fontWeight: 700 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(43,159,232,0.22)", strokeWidth: 1 }} />
            {visible.total ? (
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="url(#totalStroke)"
                strokeWidth={4}
                fill="url(#totalFill)"
                filter="url(#lineGlow)"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 3, stroke: "#fff", fill: "#3A9DCA" }}
                animationDuration={1200}
              />
            ) : null}
            {visible.ai ? (
              <Area type="monotone" dataKey="ai" name="IA" stroke="#30A3A4" strokeWidth={2.5} fill="transparent" dot={false} activeDot={{ r: 5 }} animationDuration={1100} />
            ) : null}
            {visible.human ? (
              <Area type="monotone" dataKey="human" name="Humano" stroke="#F19D18" strokeWidth={2.5} fill="transparent" dot={false} activeDot={{ r: 5 }} animationDuration={1100} />
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
