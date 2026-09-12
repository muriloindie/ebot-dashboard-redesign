"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { ElementType } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  aside
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <header className="mb-5 flex flex-col gap-4 border-b border-ebot-border/[0.12] pb-5 lg:mb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ebot-primaryText">{eyebrow}</p> : null}
        <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-ebot-dark sm:text-[28px]">{title}</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-ebot-muted">{description}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">{aside}{action}</div>
    </header>
  );
}

export function SearchField({ value, onChange, placeholder = "Pesquisar...", label = "Pesquisar" }: { value: string; onChange: (value: string) => void; placeholder?: string; label?: string }) {
  return (
    <label className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-ebot-border/[0.14] bg-ebot-surface/80 px-3.5 text-sm text-ebot-muted transition focus-within:border-ebot-primary/45 focus-within:ring-2 focus-within:ring-ebot-primary/10">
      <Search className="size-4 shrink-0 text-ebot-primary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent font-medium text-ebot-dark outline-none placeholder:text-ebot-muted/70" />
    </label>
  );
}

export function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="flex h-11 items-center gap-2 rounded-2xl border border-ebot-border/[0.14] bg-ebot-surface/80 px-3 text-sm text-ebot-muted focus-within:border-ebot-primary/45 focus-within:ring-2 focus-within:ring-ebot-primary/10">
      <SlidersHorizontal className="size-4 shrink-0 text-ebot-primary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 bg-transparent font-bold text-ebot-dark outline-none">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export function SegmentedTabs({ tabs, value, onChange }: { tabs: { id: string; label: string; count?: number }[]; value: string; onChange: (value: string) => void }) {
  return (
    <div role="tablist" aria-label="Filtros da lista" className="flex min-w-0 gap-1 overflow-x-auto rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/55 p-1">
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" aria-selected={value === tab.id} onClick={() => onChange(tab.id)} className={cn("shrink-0 rounded-xl px-3 py-2 text-[13px] font-extrabold transition", value === tab.id ? "bg-ebot-surface text-ebot-primary shadow-sm" : "text-ebot-muted hover:text-ebot-dark")}>
          {tab.label}{tab.count !== undefined ? <span className="ml-1.5 tabular-nums opacity-70">{tab.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function StatePanel({ icon: Icon, title, description, tone = "neutral", action }: { icon: ElementType; title: string; description: string; tone?: "neutral" | "error" | "success" | "warning"; action?: React.ReactNode }) {
  const toneClass = { neutral: "border-ebot-border/[0.14] bg-ebot-surface/70 text-ebot-primary", error: "border-red-500/20 bg-red-500/[0.06] text-red-500", success: "border-ebot-green/20 bg-ebot-green/[0.07] text-ebot-green", warning: "border-ebot-orange/20 bg-ebot-orange/[0.08] text-ebot-orange" }[tone];
  return (
    <div className={cn("flex min-h-52 flex-col items-center justify-center rounded-[24px] border p-8 text-center", toneClass)}>
      <Icon className="mb-3 size-8" aria-hidden="true" />
      <h2 className="text-base font-extrabold text-ebot-dark">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-ebot-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function TableSurface({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75 shadow-ebot">
      <div className="ebot-scrollbar overflow-x-auto" tabIndex={0} aria-label="Tabela com rolagem horizontal">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) { return <thead className="border-b border-ebot-border/[0.12] bg-ebot-surfaceMuted/60 text-[11px] font-extrabold uppercase tracking-[0.09em] text-ebot-muted"><tr>{children}</tr></thead>; }
export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) { return <td className={cn("px-4 py-3.5 align-middle text-sm text-ebot-slate", className)}>{children}</td>; }
export function TableHeaderCell({ children, className }: { children: React.ReactNode; className?: string }) { return <th scope="col" className={cn("whitespace-nowrap px-4 py-3.5", className)}>{children}</th>; }

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: "blue" | "green" | "orange" | "red" | "neutral" }) {
  const styles = { blue: "bg-ebot-primary/10 text-ebot-primaryText", green: "bg-ebot-green/12 text-ebot-green", orange: "bg-ebot-orange/12 text-ebot-orange", red: "bg-red-500/10 text-red-500", neutral: "bg-ebot-surfaceMuted text-ebot-muted" }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold", styles)}>{label}</span>;
}

export function SectionBar({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-extrabold text-ebot-dark">{children}</h2>{action}</div>;
}
