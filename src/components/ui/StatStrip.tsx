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
  blue: "bg-ebot-primary/10 text-ebot-primary",
  green: "bg-ebot-green/12 text-ebot-green",
  orange: "bg-ebot-orange/12 text-ebot-orange",
  teal: "bg-ebot-teal/12 text-ebot-teal",
  neutral: "bg-ebot-surfaceMuted text-ebot-muted"
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
            className="min-w-0 rounded-[20px] border border-ebot-border/[0.12] bg-ebot-surface/80 p-3.5 shadow-[0_8px_22px_rgba(4,27,21,0.04)] transition duration-200 hover:border-ebot-primary/25 hover:bg-ebot-surface dark:shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-[12px]", tones[item.tone])}>
                <Icon className="size-4" />
              </span>
              {item.hint ? <span className="truncate text-[11px] font-extrabold text-ebot-muted">{item.hint}</span> : null}
            </div>
            <p className="mt-2.5 truncate text-xl font-extrabold tracking-[-0.02em] text-ebot-dark">{item.value}</p>
            <p className="mt-0.5 truncate text-[13px] font-bold leading-4 text-ebot-muted">{item.label}</p>
          </div>
        );
      })}
    </section>
  );
}
