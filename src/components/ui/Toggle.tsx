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
        "flex w-full items-center justify-between gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-3.5 py-2.5 text-left transition hover:border-clinical-border/20",
        className
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {Icon ? (
          <span className={cn("shrink-0 transition", checked ? "text-clinical-green" : accent === "amber" ? "text-clinical-orange" : "text-clinical-muted")}>
            <Icon className="size-3.5" />
          </span>
        ) : null}
        <span className="min-w-0">
          {label ? (
            <>
              <span className="block truncate text-[13px] font-extrabold text-clinical-dark">{label}</span>
              {hint ? <span className="mt-0.5 block truncate text-[12px] font-bold text-clinical-muted">{hint}</span> : null}
            </>
          ) : (
            <span className={cn("truncate text-[12px] font-extrabold", checked ? "text-clinical-dark" : accent === "amber" ? "text-clinical-orange" : "text-clinical-dark")}>
              {checked ? statusOn : statusOff}
              {hint ? <span className="ml-1 text-clinical-muted">· {hint}</span> : null}
            </span>
          )}
        </span>
      </span>
      <span
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-clinical-green" : accent === "amber" ? "bg-clinical-orange/70" : "bg-clinical-surfaceMuted"
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
      <span className="font-bold text-clinical-muted">{label}</span>
      <span className={cn("font-extrabold", tone ?? "text-clinical-dark")}>{value}</span>
    </div>
  );
}