"use client";

import { useMemo } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts";
import { crmMonthly } from "@/data/dashboardMock";
import { useTheme } from "@/components/theme/ThemeProvider";

function formatCompact(value: number) {
  if (value >= 1000) return `R$ ${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k`;
  return `R$ ${value}`;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-ebot-border/[0.14] bg-ebot-surface/95 p-3 text-[13px] shadow-card backdrop-blur-xl">
      <p className="mb-2 font-extrabold text-ebot-dark">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="flex items-center gap-2 font-semibold text-ebot-muted">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}: <span className="font-extrabold text-ebot-dark">{formatCompact(Number(item.value))}</span>
        </p>
      ))}
    </div>
  );
}

export function CrmMonthlyChart({ scale = 1 }: { scale?: number }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const lineColor = dark ? "#C7CCDB" : "#5D737E";
  const gridColor = dark ? "rgba(199, 204, 219, 0.12)" : "rgba(93, 115, 126, 0.18)";
  const tickColor = dark ? "#8B929E" : "#8FA0AA";

  const data = useMemo(
    () => crmMonthly.map((point) => ({
      ...point,
      ganhos: Math.max(1, Math.round(point.ganhos * scale)),
      pipeline: Math.max(1, Math.round(point.pipeline * scale))
    })),
    [scale]
  );

  return (
    <div className="min-w-0">
      <div className="mb-3 flex justify-end">
        <div className="flex items-center gap-3 text-[12px] font-extrabold text-ebot-muted">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-ebot-primary" />Ganhos</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ backgroundColor: lineColor }} />Pipeline</span>
        </div>
      </div>
      <div className="h-[260px] w-full min-w-0 sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="crmWonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A9D16C" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#A9D16C" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} strokeDasharray="4 10" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 700 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 700 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} width={40} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(169,209,108,0.08)" }} />
            <Bar dataKey="ganhos" name="Ganhos" fill="url(#crmWonGradient)" radius={[8, 8, 0, 0]} maxBarSize={34} animationDuration={900} />
            <Line type="monotone" dataKey="pipeline" name="Pipeline" stroke={lineColor} strokeWidth={2.5} dot={false} activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#fff", fill: lineColor }} animationDuration={1100} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
