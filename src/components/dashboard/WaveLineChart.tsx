"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts";
import { Activity, Bot, UsersRound } from "lucide-react";
import { hourlyFlow } from "@/data/dashboardMock";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/cn";

type SeriesKey = "total" | "ai" | "human";

export function HourlyFlowChart({ scale = 1 }: { scale?: number }) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({ total: true, ai: true, human: true });
  const activeCount = useMemo(() => Object.values(visible).filter(Boolean).length, [visible]);
  const chartData = useMemo(() => hourlyFlow.map((point) => ({ ...point, total: Math.max(1, Math.round(point.total * scale)), ai: Math.max(1, Math.round(point.ai * scale)), human: Math.max(1, Math.round(point.human * scale)) })), [scale]);

  const dark = theme === "dark";
  const colors = dark
    ? { total: "#C7CCDB", totalEnd: "#8FA9B8", ai: "#A9D16C", human: "#F2B04C", grid: "rgba(199, 204, 219, 0.12)", cursor: "rgba(199, 204, 219, 0.35)", tick: "#8B929E" }
    : { total: "#6B942E", totalEnd: "#A9D16C", ai: "#A9D16C", human: "#5D737E", grid: "rgba(93, 115, 126, 0.18)", cursor: "rgba(107, 148, 46, 0.32)", tick: "#8FA0AA" };

  const toggles: { key: SeriesKey; label: string; icon: React.ElementType; color: string }[] = [
    { key: "total", label: "Total", icon: Activity, color: colors.total },
    { key: "ai", label: "Resolvidos por IA", icon: Bot, color: colors.ai },
    { key: "human", label: "Transferidos", icon: UsersRound, color: colors.human }
  ];

  function toggleSeries(key: SeriesKey) {
    setVisible((current) => {
      if (current[key] && activeCount === 1) return current;
      return { ...current, [key]: !current[key] };
    });
  }

  return (
    <div className="min-w-0">
      <div className="mb-3 flex justify-end">
        <div className="ebot-scrollbar flex max-w-full shrink-0 gap-1.5 overflow-x-auto rounded-full border border-ebot-border/[0.10] bg-ebot-surface/62 p-1">
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
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition duration-200 focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
                  active ? "bg-ebot-surface text-ebot-primaryText shadow-[0_6px_16px_rgba(4,27,21,0.06)]" : "text-ebot-muted hover:bg-ebot-surface/70 hover:text-ebot-slate"
                )}
              >
                <Icon className="size-3.5" style={{ color: active ? toggle.color : undefined }} /> {toggle.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[260px] w-full min-w-0 max-w-full overflow-hidden rounded-[22px] border border-ebot-border/[0.08] bg-gradient-to-b from-ebot-surface/80 to-ebot-primary/[0.025] p-2 sm:h-[300px] sm:rounded-[24px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 18, right: 8, left: -28, bottom: 8 }}>
            <defs>
              <linearGradient id="totalStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={colors.total} />
                <stop offset="100%" stopColor={colors.totalEnd} />
              </linearGradient>
              <linearGradient id="totalFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={colors.total} stopOpacity={0.18} />
                <stop offset="100%" stopColor={colors.total} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={colors.grid} strokeDasharray="4 10" vertical={false} />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: colors.tick, fontSize: 12, fontWeight: 700 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.tick, fontSize: 12, fontWeight: 700 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: colors.cursor, strokeWidth: 1 }} />
            {visible.total ? (
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="url(#totalStroke)"
                strokeWidth={3}
                fill="url(#totalFill)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff", fill: colors.total }}
                animationDuration={1200}
              />
            ) : null}
            {visible.ai ? (
              <Area type="monotone" dataKey="ai" name="IA" stroke={colors.ai} strokeWidth={2.25} fill="transparent" dot={false} activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#fff", fill: colors.ai }} animationDuration={1100} />
            ) : null}
            {visible.human ? (
              <Area type="monotone" dataKey="human" name="Humano" stroke={colors.human} strokeWidth={2.25} fill="transparent" dot={false} activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#fff", fill: colors.human }} animationDuration={1100} />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 rounded-2xl border border-ebot-teal/[0.15] bg-ebot-teal/10 px-4 py-3 text-[14px] font-semibold leading-6 text-ebot-slate">
        Pico de atendimento entre <span className="font-extrabold text-ebot-dark">18h e 21h</span>. A IA resolveu <span className="font-extrabold text-ebot-primary">76%</span> das conversas fora do horário comercial.
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-ebot-border/[0.14] bg-ebot-surface/90 p-3 text-[13px] shadow-card backdrop-blur-xl">
      <p className="mb-2 font-extrabold text-ebot-dark">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="flex items-center gap-2 font-semibold text-ebot-muted">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}: <span className="font-extrabold text-ebot-dark">{item.value}</span>
        </p>
      ))}
    </div>
  );
}
