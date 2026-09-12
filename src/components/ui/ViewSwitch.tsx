import type { ElementType } from "react";
import { cn } from "@/lib/cn";

type ViewSwitchProps = {
  views: { id: string; label: string; icon: ElementType }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
};

export function ViewSwitch({ views, value, onChange, className }: ViewSwitchProps) {
  return (
    <div role="tablist" aria-label="Visualização" className={cn("flex shrink-0 gap-1 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/55 p-1", className)}>
      {views.map((view) => {
        const Icon = view.icon;
        const active = value === view.id;
        return (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(view.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-extrabold transition",
              active ? "bg-ebot-surface text-ebot-primary shadow-sm" : "text-ebot-muted hover:text-ebot-dark"
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}
