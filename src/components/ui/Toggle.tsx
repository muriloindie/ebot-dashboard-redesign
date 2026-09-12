"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  hint?: string;
  statusOn?: string;
  statusOff?: string;
  icon?: ElementType;
  iconOn?: ElementType;
  iconOff?: ElementType;
  accent?: "green" | "amber";
  className?: string;
};

export function Toggle({ checked, onChange, label, hint, statusOn = "Ativo", statusOff = "Inativo", icon, iconOn, iconOff, accent = "green", className }: ToggleProps) {
  const Icon = checked ? iconOn ?? icon : iconOff ?? icon;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 px-3.5 py-2.5 text-left transition hover:border-ebot-border/20",
        className
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {Icon ? (
          <span className={cn("shrink-0 transition", checked ? "text-ebot-green" : accent === "amber" ? "text-ebot-orange" : "text-ebot-muted")}>
            <Icon className="size-3.5" />
          </span>
        ) : null}
        <span className="min-w-0">
          {label ? (
            <>
              <span className="block truncate text-[13px] font-extrabold text-ebot-dark">{label}</span>
              {hint ? <span className="mt-0.5 block truncate text-[12px] font-bold text-ebot-muted">{hint}</span> : null}
            </>
          ) : (
            <span className={cn("truncate text-[12px] font-extrabold", checked ? "text-ebot-dark" : accent === "amber" ? "text-ebot-orange" : "text-ebot-dark")}>
              {checked ? statusOn : statusOff}
              {hint ? <span className="ml-1 text-ebot-muted">· {hint}</span> : null}
            </span>
          )}
        </span>
      </span>
      <span
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-ebot-green" : accent === "amber" ? "bg-ebot-orange/70" : "bg-ebot-surfaceMuted"
        )}
      >
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200", checked ? "left-[18px]" : "left-0.5")} />
      </span>
    </button>
  );
}

export function TogglePreview({ label, value, tone }: { label: ReactNode; value: ReactNode; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="font-bold text-ebot-muted">{label}</span>
      <span className={cn("font-extrabold", tone ?? "text-ebot-dark")}>{value}</span>
    </div>
  );
}