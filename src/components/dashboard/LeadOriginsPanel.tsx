"use client";

import { leadOrigins } from "@/data/dashboardMock";

export function LeadOriginsPanel() {
  const max = Math.max(...leadOrigins.map((origin) => origin.value), 1);

  return (
    <div className="flex flex-1 flex-col justify-center gap-3.5">
      {leadOrigins.map((origin) => (
        <div key={origin.label}>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-[13px] font-extrabold text-ebot-slate">{origin.label}</span>
            <span className="flex items-center gap-2 text-[12px] font-bold text-ebot-muted">
              <span className="tabular-nums">{origin.value}% dos leads</span>
              <span className="rounded-full bg-ebot-green/[0.10] px-2 py-0.5 text-[11px] font-extrabold text-ebot-green">{origin.conversion}% conv.</span>
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ebot-surfaceMuted">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max((origin.value / max) * 100, 6)}%`, backgroundColor: origin.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
