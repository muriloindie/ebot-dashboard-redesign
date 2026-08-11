import type { ElementType } from "react";
import { cn } from "@/lib/cn";

export type StatItem = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  tone: "blue" | "green" | "orange" | "teal" | "neutral";
  icon: ElementType;
};

const tones = {
  blue: "bg-clinical-blue/10 text-clinical-blue",
  green: "bg-clinical-green/12 text-clinical-green",
  orange: "bg-clinical-orange/12 text-clinical-orange",
  teal: "bg-clinical-teal/12 text-clinical-teal",
  neutral: "bg-clinical-surfaceMuted text-clinical-muted"
};

export function StatStrip({ items, className }: { items: StatItem[]; className?: string }) {
  return (
    <section className={cn("grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6", className)} aria-label="Indicadores">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            data-stat-card
            className="min-w-0 rounded-[20px] border border-clinical-border/[0.12] bg-clinical-surface/80 p-3.5 shadow-[0_8px_22px_rgba(38,53,50,0.04)] transition duration-200 hover:border-clinical-blue/25 hover:bg-clinical-surface dark:shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-[12px]", tones[item.tone])}>
                <Icon className="size-4" />
              </span>
              {item.hint ? <span className="truncate text-[11px] font-extrabold text-clinical-muted">{item.hint}</span> : null}
            </div>
            <p className="mt-2.5 truncate text-xl font-extrabold tracking-[-0.02em] text-clinical-dark">{item.value}</p>
            <p className="mt-0.5 truncate text-[13px] font-bold leading-4 text-clinical-muted">{item.label}</p>
          </div>
        );
      })}
    </section>
  );
}
