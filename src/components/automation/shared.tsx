"use client";

import { ArrowRight, BookOpen, CalendarCheck, FlaskConical, HeartHandshake, ListChecks, PartyPopper, type LucideIcon } from "lucide-react";
import { getNodeVisual } from "@/lib/automation/nodeCatalog";
import type { AutomationTemplate, KbCategory, TemplateCategory } from "@/lib/automation/types";
import { cn } from "@/lib/cn";

export type CategoryVisual = { icon: LucideIcon; tone: "blue" | "green" | "orange" | "teal" | "red" };

export const templateCategoryVisuals: Record<TemplateCategory, CategoryVisual> = {
  Agendamento: { icon: CalendarCheck, tone: "blue" },
  Pedidos: { icon: FlaskConical, tone: "teal" },
  "Pós-venda": { icon: HeartHandshake, tone: "green" },
  Triagem: { icon: ListChecks, tone: "orange" },
  Relacionamento: { icon: PartyPopper, tone: "red" }
};

export const kbCategoryVisuals: Record<KbCategory, CategoryVisual> = {
  Protocolos: { icon: ListChecks, tone: "blue" },
  Parcerias: { icon: BookOpen, tone: "green" },
  Pedidos: { icon: FlaskConical, tone: "teal" },
  Políticas: { icon: CalendarCheck, tone: "orange" },
  Geral: { icon: BookOpen, tone: "red" }
};

export const toneChip: Record<CategoryVisual["tone"], string> = {
  blue: "bg-ebot-primary/[0.10] text-ebot-primaryText",
  green: "bg-ebot-green/[0.12] text-ebot-green",
  orange: "bg-ebot-orange/[0.12] text-ebot-orange",
  teal: "bg-ebot-teal/[0.12] text-ebot-teal",
  red: "bg-ebot-red/[0.12] text-ebot-red"
};

export function CategoryChip({ category, kind = "template" }: { category: string; kind?: "template" | "kb" }) {
  const visual =
    kind === "template"
      ? templateCategoryVisuals[category as TemplateCategory]
      : kbCategoryVisuals[category as KbCategory];
  if (!visual) return <span className="rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-ebot-muted">{category}</span>;
  const Icon = visual.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold", toneChip[visual.tone])}>
      <Icon className="size-3" />
      {category}
    </span>
  );
}

export function MiniFlowPreview({ template, compact = false }: { template: AutomationTemplate; compact?: boolean }) {
  const nodes = compact ? template.nodes.slice(0, 4) : template.nodes;
  return (
    <div className="ebot-scrollbar overflow-x-auto rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-3" aria-label={`Prévia do fluxo ${template.name}`}>
      <div className="flex min-w-max items-center gap-1.5">
        {nodes.map((node, index) => {
          const visual = getNodeVisual(node.type);
          const Icon = visual.icon;
          return (
            <span key={`${template.id}-mini-${index}`} className="flex items-center gap-1.5">
              <span className={cn("flex items-center gap-1.5 rounded-xl border border-ebot-border/[0.14] bg-ebot-surface px-2.5 py-1.5 text-[11px] font-extrabold text-ebot-dark shadow-[0_2px_8px_rgba(4,27,21,0.05)]")}>
                <Icon className="size-3.5 text-ebot-primary" />
                {node.name}
              </span>
              {index < nodes.length - 1 ? <ArrowRight className="size-3.5 shrink-0 text-ebot-muted/70" /> : null}
            </span>
          );
        })}
        {compact && template.nodes.length > 4 ? (
          <span className="rounded-xl bg-ebot-surfaceMuted px-2 py-1.5 text-[11px] font-extrabold text-ebot-muted">+{template.nodes.length - 4}</span>
        ) : null}
      </div>
    </div>
  );
}

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mb-5 flex flex-wrap items-center gap-2" aria-label="Etapas do assistente">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold transition",
                active ? "bg-ebot-primary text-ebot-charcoal" : done ? "bg-ebot-green/[0.14] text-ebot-green" : "bg-ebot-surfaceMuted text-ebot-muted"
              )}
              aria-current={active ? "step" : undefined}
            >
              <span className="flex size-4 items-center justify-center rounded-full bg-white/25 text-[10px]">{index + 1}</span>
              {step}
            </span>
            {index < steps.length - 1 ? <span className="h-px w-3 bg-ebot-border/[0.3]" aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
