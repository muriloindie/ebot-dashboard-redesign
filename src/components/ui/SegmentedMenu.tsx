"use client";

import { cn } from "@/lib/cn";

type SegmentedOption = {
  id: string;
  label: string;
  icon?: React.ElementType;
};

type SegmentedMenuProps = {
  ariaLabel: string;
  options: SegmentedOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
};

export function SegmentedMenu({ ariaLabel, options, value, onChange, className }: SegmentedMenuProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "ebot-scrollbar flex w-fit max-w-full shrink-0 gap-1 overflow-x-auto rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/55 p-1",
        className
      )}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-extrabold transition focus:outline-none focus:ring-2 focus:ring-ebot-primary/25",
              active ? "bg-ebot-surface text-ebot-primaryText shadow-sm" : "text-ebot-muted hover:text-ebot-dark"
            )}
          >
            {Icon ? <Icon className="size-4" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
