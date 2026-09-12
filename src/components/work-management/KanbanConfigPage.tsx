"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Columns3,
  Eye,
  EyeOff,
  Layers3,
  RotateCcw,
  Save,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ColorField } from "@/components/ui/ColorField";
import { ModalField } from "@/components/ui/ModalField";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Toggle } from "@/components/ui/Toggle";
import { PageHeader } from "@/components/ui/Week1Primitives";
import { usePageEnter } from "@/lib/usePageEnter";
import {
  defaultKanbanColumns,
  listKanbanColumns,
  resetKanbanColumns,
  saveKanbanColumns,
  type KanbanColumnConfig,
  type KanbanStage
} from "@/lib/work-management/kanbanConfigService";
import { cn } from "@/lib/cn";

export function KanbanConfigPage() {
  return <KanbanConfigPanel />;
}

export function KanbanConfigPanel({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<KanbanColumnConfig[]>(defaultKanbanColumns());
  const [feedback, setFeedback] = useState("");
  const [restoreOpen, setRestoreOpen] = useState(false);

  usePageEnter(pageRef, [
    { selector: "[data-column-row]", from: { opacity: 0, y: 18 } }
  ], { stagger: 0.05, delay: 0.05 });

  useEffect(() => setColumns(listKanbanColumns()), []);

  function update(id: string, patch: Partial<KanbanColumnConfig>) {
    setColumns((current) => current.map((column) => (column.id === id ? { ...column, ...patch } : column)));
  }

  function move(index: number, direction: -1 | 1) {
    setColumns((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function save() {
    saveKanbanColumns(columns);
    setFeedback("Configuração do Kanban salva. O quadro já reflete as mudanças.");
    window.setTimeout(() => setFeedback(""), 3200);
  }

  function restore() {
    resetKanbanColumns();
    setColumns(defaultKanbanColumns());
    setRestoreOpen(false);
    setFeedback("Padrões restaurados para o Kanban de demonstração.");
    window.setTimeout(() => setFeedback(""), 3200);
  }

  const actions = (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => setRestoreOpen(true)}><RotateCcw className="size-4" />Restaurar padrão</Button>
      <Button onClick={save}><Save className="size-4" />Salvar configuração</Button>
    </div>
  );

  return (
    <div ref={pageRef}>
      {embedded ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ebot-primary/[0.10] text-ebot-primary"><Columns3 className="size-5" /></span>
            <div className="min-w-0"><h3 className="text-sm font-extrabold text-ebot-dark">Colunas do quadro</h3><p className="text-xs font-semibold text-ebot-muted">{columns.length} colunas, cores, etapas e limites de cartões.</p></div>
          </div>
          {actions}
        </div>
      ) : (
        <PageHeader
          eyebrow="Operação / Fluxo"
          title="Configuração do Kanban"
          description="Ajuste as colunas do quadro: nomes, cores, estágios do funil, limites por coluna e visibilidade."
          aside={<span className="inline-flex items-center gap-2 rounded-full bg-ebot-primary/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-primaryText"><Columns3 className="size-4" />{columns.length} colunas</span>}
          action={actions}
        />
      )}

      {feedback ? (
        <div role="status" className="mb-4 flex items-center gap-2 rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green">
          <Check className="size-4" />{feedback}
        </div>
      ) : null}

      <div className="space-y-3">
        {columns.map((column, index) => (
          <section
            key={column.id}
            data-column-row
            className={cn(
              "rounded-[24px] border p-4 transition",
              column.active ? "border-ebot-border/[0.14] bg-ebot-surface/75" : "border-dashed border-ebot-border/[0.18] bg-ebot-surface/40"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: column.color }}>
                  <Columns3 className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ebot-dark">{column.label}</p>
                  <p className="text-[11px] font-semibold text-ebot-muted">Identificador interno: {column.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Mover coluna para cima" className="flex size-9 items-center justify-center rounded-xl border border-ebot-border/[0.12] text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary disabled:opacity-40">
                  <ArrowUp className="size-4" />
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === columns.length - 1} aria-label="Mover coluna para baixo" className="flex size-9 items-center justify-center rounded-xl border border-ebot-border/[0.12] text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary disabled:opacity-40">
                  <ArrowDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => update(column.id, { active: !column.active })}
                  aria-label={column.active ? "Ocultar coluna no quadro" : "Exibir coluna no quadro"}
                  className={cn("flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-extrabold transition", column.active ? "border-ebot-green/25 bg-ebot-green/[0.08] text-ebot-green" : "border-ebot-border/[0.14] bg-ebot-surface text-ebot-muted")}
                >
                  {column.active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}{column.active ? "Visível" : "Oculta"}
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <ModalField label="Nome da coluna" value={column.label} onChange={(event) => update(column.id, { label: event.target.value })} />
              <ModalField label="Descrição curta" value={column.description} onChange={(event) => update(column.id, { description: event.target.value })} />
              <label className="block">
                <span className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-ebot-dark"><Layers3 className="size-4 text-ebot-primary" />Estágio do funil</span>
                <select
                  value={column.stage}
                  onChange={(event) => update(column.id, { stage: event.target.value as KanbanStage })}
                  className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none transition focus:border-ebot-primary/45 focus:bg-ebot-surface focus:ring-2 focus:ring-ebot-primary/10"
                >
                  <option>Entrada</option><option>Ação</option><option>Entrega</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-ebot-dark"><Timer className="size-4 text-ebot-primary" />Limite de cartões (WIP)</span>
                <input
                  type="number"
                  min={0}
                  value={column.wip ?? ""}
                  placeholder="Sem limite"
                  onChange={(event) => update(column.id, { wip: event.target.value === "" ? null : Math.max(0, Number(event.target.value)) })}
                  className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none transition placeholder:text-ebot-muted/65 focus:border-ebot-primary/45 focus:bg-ebot-surface focus:ring-2 focus:ring-ebot-primary/10"
                />
              </label>
            </div>

            <div className="mt-4 grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <ColorField label="Cor da coluna" value={column.color} onChange={(color) => update(column.id, { color })} />
              <div className="flex items-center gap-2">
                <Toggle checked={column.active} onChange={(value) => update(column.id, { active: value })} label="Coluna ativa" />
                <span className="text-xs font-semibold text-ebot-muted">Exibir no quadro</span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-4">
        <p className="text-sm font-semibold text-ebot-muted">As alterações valem para este navegador (dados locais de demonstração).</p>
        <div className="flex gap-2">
          {!embedded ? <Button variant="ghost" onClick={() => router.push("/kanban")}>Voltar ao quadro</Button> : null}
          <Button onClick={save}><Check className="size-4" />Salvar configuração</Button>
        </div>
      </div>

      <ConfirmationDialog
        open={restoreOpen}
        onClose={() => setRestoreOpen(false)}
        onConfirm={restore}
        title="Restaurar padrões do Kanban?"
        description="Nomes, cores, estágios e limites voltarão à configuração original de demonstração."
        confirmLabel="Restaurar padrão"
      />
    </div>
  );
}
