"use client";

import { ArrowRight, BookOpen, CalendarCheck, FlaskConical, HeartHandshake, ListChecks, PartyPopper, type LucideIcon } from "lucide-react";
import { getNodeVisual } from "@/lib/automation/nodeCatalog";
import type { AutomationTemplate, KbCategory, TemplateCategory } from "@/lib/automation/types";
import { cn } from "@/lib/cn";

export type CategoryVisual = { icon: LucideIcon; tone: "blue" | "green" | "orange" | "teal" | "red" };

export const templateCategoryVisuals: Record<TemplateCategory, CategoryVisual> = {
  Agendamento: { icon: CalendarCheck, tone: "blue" },
  Exames: { icon: FlaskConical, tone: "teal" },
  "Pós-consulta": { icon: HeartHandshake, tone: "green" },
  Triagem: { icon: ListChecks, tone: "orange" },
  Relacionamento: { icon: PartyPopper, tone: "red" }
};

export const kbCategoryVisuals: Record<KbCategory, CategoryVisual> = {
  Protocolos: { icon: ListChecks, tone: "blue" },
  Convênios: { icon: BookOpen, tone: "green" },
  Exames: { icon: FlaskConical, tone: "teal" },
  Políticas: { icon: CalendarCheck, tone: "orange" },
  Geral: { icon: BookOpen, tone: "red" }
};

export const toneChip: Record<CategoryVisual["tone"], string> = {
  blue: "bg-clinical-blue/[0.10] text-clinical-blueText",
  green: "bg-clinical-green/[0.12] text-clinical-green",
  orange: "bg-clinical-orange/[0.12] text-clinical-orange",
  teal: "bg-clinical-teal/[0.12] text-clinical-teal",
  red: "bg-clinical-red/[0.12] text-clinical-red"
};

export function CategoryChip({ category, kind = "template" }: { category: string; kind?: "template" | "kb" }) {
  const visual =
    kind === "template"
      ? templateCategoryVisuals[category as TemplateCategory]
      : kbCategoryVisuals[category as KbCategory];
  if (!visual) return <span className="rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-muted">{category}</span>;
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
    <div className="clinical-scrollbar overflow-x-auto rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3" aria-label={`Prévia do fluxo ${template.name}`}>
      <div className="flex min-w-max items-center gap-1.5">
        {nodes.map((node, index) => {
          const visual = getNodeVisual(node.type);
          const Icon = visual.icon;
          return (
            <span key={`${template.id}-mini-${index}`} className="flex items-center gap-1.5">
              <span className={cn("flex items-center gap-1.5 rounded-xl border border-clinical-border/[0.14] bg-clinical-surface px-2.5 py-1.5 text-[11px] font-extrabold text-clinical-dark shadow-[0_2px_8px_rgba(38,53,50,0.05)]")}>
                <Icon className="size-3.5 text-clinical-blue" />
                {node.name}
              </span>
              {index < nodes.length - 1 ? <ArrowRight className="size-3.5 shrink-0 text-clinical-muted/70" /> : null}
            </span>
          );
        })}
        {compact && template.nodes.length > 4 ? (
          <span className="rounded-xl bg-clinical-surfaceMuted px-2 py-1.5 text-[11px] font-extrabold text-clinical-muted">+{template.nodes.length - 4}</span>
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
                active ? "bg-clinical-blue text-clinical-charcoal" : done ? "bg-clinical-green/[0.14] text-clinical-green" : "bg-clinical-surfaceMuted text-clinical-muted"
              )}
              aria-current={active ? "step" : undefined}
            >
              <span className="flex size-4 items-center justify-center rounded-full bg-white/25 text-[10px]">{index + 1}</span>
              {step}
            </span>
            {index < steps.length - 1 ? <span className="h-px w-3 bg-clinical-border/[0.3]" aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
