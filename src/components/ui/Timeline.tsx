import type { ElementType } from "react";
import { cn } from "@/lib/cn";

export type TimelineItemData = {
  id: string;
  icon?: ElementType;
  title: string;
  subtitle?: string;
  date?: string;
  tone?: "blue" | "green" | "orange" | "red" | "neutral";
};

const toneStyles = {
  blue: "border-clinical-blue/25 bg-clinical-blue/12 text-clinical-blue",
  green: "border-clinical-green/25 bg-clinical-green/12 text-clinical-green",
  orange: "border-clinical-orange/25 bg-clinical-orange/12 text-clinical-orange",
  red: "border-red-500/25 bg-red-500/12 text-red-500",
  neutral: "border-clinical-border/[0.14] bg-clinical-surfaceMuted text-clinical-muted"
};

export function Timeline({ items, className }: { items: TimelineItemData[]; className?: string }) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-3.5 pb-5 last:pb-0">
            {!isLast ? <span className="absolute left-[17px] top-9 h-[calc(100%-28px)] w-px bg-clinical-border/[0.16]" aria-hidden="true" /> : null}
            <span className={cn("relative z-10 flex size-[34px] shrink-0 items-center justify-center rounded-xl border", toneStyles[item.tone ?? "neutral"])}>
              {Icon ? <Icon className="size-4" /> : null}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-sm font-extrabold text-clinical-dark">{item.title}</p>
                {item.date ? <span className="shrink-0 text-xs font-bold text-clinical-muted">{item.date}</span> : null}
              </div>
              {item.subtitle ? <p className="mt-1 text-[13px] leading-5 text-clinical-muted">{item.subtitle}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
