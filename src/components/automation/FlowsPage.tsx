"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  History,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  RadioTower,
  ScrollText,
  Search,
  Store,
  Trash2,
  Workflow as WorkflowIcon,
  Zap
} from "lucide-react";
import { deleteWorkflow, duplicateWorkflow, listExecutions, listWorkflows, saveWorkflow, setWorkflowStatus } from "@/lib/automation/n8nService";
import type { FlowExecution, FlowStatus, Workflow } from "@/lib/automation/types";
import { getNodeVisual } from "@/lib/automation/nodeCatalog";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Drawer } from "@/components/ui/Drawer";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { PageHeader, SearchField, SegmentedTabs, StatePanel, StatusBadge } from "@/components/ui/Week1Primitives";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";

const ALL = "Todos";

const statusMeta: Record<FlowStatus, { label: string; tone: "green" | "orange" | "blue" }> = {
  active: { label: "Ativo", tone: "green" },
  paused: { label: "Pausado", tone: "orange" },
  draft: { label: "Rascunho", tone: "blue" }
};

function executionTone(status: FlowExecution["status"]) {
  if (status === "success") return "green";
  if (status === "error") return "red";
  return "blue";
}

export function FlowsPage() {
  const router = useRouter();
  const { toast } = useDemo();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL);
  const [logsFor, setLogsFor] = useState<Workflow | null>(null);
  const [deleting, setDeleting] = useState<Workflow | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    setWorkflows(listWorkflows());
    const params = new URLSearchParams(window.location.search);
    const novo = params.get("novo");
    if (novo) setHighlightId(novo);
  }, []);

  const filtered = useMemo(() => {
    return workflows.filter((workflow) => {
      const matchesStatus = status === ALL || statusMeta[workflow.status].label === status;
      const matchesQuery = `${workflow.name} ${workflow.description} ${workflow.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [workflows, query, status]);

  const stats: StatItem[] = useMemo(() => {
    const active = workflows.filter((workflow) => workflow.status === "active").length;
    const drafts = workflows.filter((workflow) => workflow.status === "draft").length;
    const runs = workflows.reduce((total, workflow) => total + workflow.executions7d, 0);
    const avgSuccess = workflows.filter((workflow) => workflow.executions7d > 0);
    const success = avgSuccess.length ? Math.round(avgSuccess.reduce((total, workflow) => total + workflow.successRate, 0) / avgSuccess.length) : 0;
    return [
      { id: "active", label: "Fluxos ativos", value: String(active), hint: `${workflows.length} no total`, tone: "blue", icon: WorkflowIcon },
      { id: "runs", label: "Execuções (7 dias)", value: runs.toLocaleString("pt-BR"), hint: "todos os fluxos", tone: "green", icon: Activity },
      { id: "success", label: "Taxa de sucesso", value: `${success}%`, hint: "média dos ativos", tone: "teal", icon: CheckCircle2 },
      { id: "drafts", label: "Rascunhos", value: String(drafts), hint: "prontos para ativar", tone: "orange", icon: FileText }
    ];
  }, [workflows]);

  function refresh() {
    setWorkflows(listWorkflows());
  }

  function createBlank() {
    const blank: Workflow = {
      id: `wf-${Date.now().toString(36)}`,
      name: "Novo fluxo de automação",
      description: "Fluxo criado manualmente no editor.",
      status: "draft",
      channel: "WhatsApp",
      protocolId: null,
      protocolName: null,
      templateId: null,
      knowledgeBaseId: null,
      nodes: [
        { id: `node-${Date.now().toString(36)}a`, type: "ebot.chatTrigger", name: "Mensagem recebida", position: { x: 40, y: 120 }, parameters: { channel: "Todos", keyword: "" } }
      ],
      connections: [],
      settings: { timezone: "America/Sao_Paulo", saveExecutions: true, onError: "continuar" },
      tags: [],
      executions7d: 0,
      successRate: 0,
      lastRun: "nunca",
      updatedAt: "agora"
    };
    saveWorkflow(blank);
    router.push(`/fluxos-automacao/${blank.id}`);
  }

  function toggleStatus(workflow: Workflow) {
    const next: FlowStatus = workflow.status === "active" ? "paused" : "active";
    setWorkflowStatus(workflow.id, next);
    refresh();
    toast(next === "active" ? `Fluxo "${workflow.name}" ativado.` : `Fluxo "${workflow.name}" pausado.`, next === "active" ? "success" : "info");
  }

  function duplicate(workflow: Workflow) {
    const copy = duplicateWorkflow(workflow.id);
    refresh();
    if (copy) toast(`Cópia criada: "${copy.name}".`);
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteWorkflow(deleting.id);
    toast(`Fluxo "${deleting.name}" excluído.`, "warning");
    setDeleting(null);
    refresh();
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Automação / Jornadas"
        title="Fluxos de automação"
        description="Ative, pause, edite e acompanhe as jornadas automatizadas da empresa. Os fluxos rodam sobre o motor n8n da Ê-Bot e podem nascer de um template da loja."
        aside={<Button variant="secondary" onClick={() => router.push("/templates")}><Store className="size-4" />Loja de templates</Button>}
        action={<Button onClick={createBlank}><Plus className="size-4" />Novo fluxo</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar fluxo por nome, descrição ou tag" />
        <SegmentedTabs
          tabs={[ALL, "Ativo", "Pausado", "Rascunho"].map((item) => ({
            id: item,
            label: item,
            count: item === ALL ? workflows.length : workflows.filter((workflow) => statusMeta[workflow.status].label === item).length
          }))}
          value={status}
          onChange={setStatus}
        />
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={Search}
          title="Nenhum fluxo encontrado"
          description="Ajuste a busca ou aplique um template da loja para começar."
          action={<div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => { setQuery(""); setStatus(ALL); }}>Limpar filtros</Button><Button size="sm" onClick={() => router.push("/templates")}><Store className="size-4" />Ver templates</Button></div>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((workflow) => {
            const meta = statusMeta[workflow.status];
            const highlighted = workflow.id === highlightId;
            return (
              <article
                key={workflow.id}
                className={cn(
                  "relative flex flex-col rounded-[24px] border bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)] transition hover:shadow-ebot",
                  highlighted ? "border-ebot-primary/50 ring-2 ring-ebot-primary/20" : "border-ebot-border/[0.14] hover:border-ebot-primary/25"
                )}
              >
                {highlighted ? <span className="absolute -top-3 left-5 rounded-full bg-ebot-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-ebot-charcoal">Aplicado agora</span> : null}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", workflow.status === "active" ? "bg-ebot-green/[0.12] text-ebot-green" : workflow.status === "paused" ? "bg-ebot-orange/[0.12] text-ebot-orange" : "bg-ebot-primary/[0.10] text-ebot-primary")}>
                      <WorkflowIcon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-extrabold tracking-tight text-ebot-dark">{workflow.name}</h2>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <StatusBadge label={meta.label} tone={meta.tone} />
                        <span className="inline-flex items-center gap-1 rounded-full bg-ebot-surfaceMuted px-2 py-1 text-[11px] font-extrabold text-ebot-slate"><RadioTower className="size-3" />{workflow.channel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <button type="button" onClick={() => setMenuFor(menuFor === workflow.id ? null : workflow.id)} aria-label={`Ações do fluxo ${workflow.name}`} aria-expanded={menuFor === workflow.id} className="flex size-9 items-center justify-center rounded-xl border border-ebot-border/[0.12] text-ebot-muted transition hover:border-ebot-primary/25 hover:text-ebot-primary">
                      <MoreHorizontal className="size-4" />
                    </button>
                    {menuFor === workflow.id ? (
                      <div role="menu" className="absolute right-0 top-11 z-30 w-52 rounded-2xl border border-ebot-border/[0.14] bg-ebot-surface p-2 shadow-ebot">
                        <button type="button" role="menuitem" onClick={() => { setMenuFor(null); setLogsFor(workflow); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-ebot-slate transition hover:bg-ebot-primary/[0.08] hover:text-ebot-primary"><ScrollText className="size-4" />Ver logs de execução</button>
                        <button type="button" role="menuitem" onClick={() => { setMenuFor(null); duplicate(workflow); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-ebot-slate transition hover:bg-ebot-primary/[0.08] hover:text-ebot-primary"><Copy className="size-4" />Duplicar fluxo</button>
                        <button type="button" role="menuitem" onClick={() => { setMenuFor(null); setDeleting(workflow); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-ebot-red transition hover:bg-ebot-red/[0.08]"><Trash2 className="size-4" />Excluir fluxo</button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-[13px] leading-5 text-ebot-muted">{workflow.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {workflow.protocolName ? <span className="inline-flex items-center gap-1 rounded-full bg-ebot-primary/[0.08] px-2.5 py-1 text-[11px] font-extrabold text-ebot-primaryText"><ClipboardList className="size-3" />{workflow.protocolName}</span> : null}
                  {workflow.knowledgeBaseId ? <span className="inline-flex items-center gap-1 rounded-full bg-ebot-teal/[0.10] px-2.5 py-1 text-[11px] font-extrabold text-ebot-teal"><BookOpen className="size-3" />Base de conhecimento</span> : null}
                  {workflow.tags.map((tag) => <span key={tag} className="rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-ebot-muted">#{tag}</span>)}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ebot-border/[0.10] pt-3 text-center">
                  <div><p className="text-base font-extrabold tabular-nums text-ebot-dark">{workflow.executions7d}</p><p className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Execuções 7d</p></div>
                  <div><p className="text-base font-extrabold tabular-nums text-ebot-dark">{workflow.successRate}%</p><p className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Sucesso</p></div>
                  <div><p className="truncate text-base font-extrabold text-ebot-dark">{workflow.lastRun}</p><p className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Última</p></div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Toggle
                    checked={workflow.status === "active"}
                    onChange={() => toggleStatus(workflow)}
                    statusOn="Em operação"
                    statusOff="Em pausa"
                    iconOn={Play}
                    iconOff={Pause}
                    accent="amber"
                  />
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => router.push(`/fluxos-automacao/${workflow.id}`)}><Pencil className="size-4" />Editar canvas</Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Drawer open={Boolean(logsFor)} onClose={() => setLogsFor(null)} title="Logs de execução" description={logsFor ? `${logsFor.name} · histórico recente` : undefined} width="max-w-xl">
        {logsFor ? <ExecutionLogs workflow={logsFor} /> : null}
      </Drawer>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Excluir fluxo"
        description={deleting ? `Excluir "${deleting.name}"? As execuções registradas também serão removidas. Essa ação não pode ser desfeita.` : ""}
        confirmLabel="Excluir fluxo"
      />
    </div>
  );
}

export function ExecutionLogs({ workflow }: { workflow: Workflow }) {
  const executions = useMemo(() => listExecutions(workflow.id), [workflow.id]);
  const [selected, setSelected] = useState<FlowExecution | null>(executions[0] ?? null);

  if (executions.length === 0) {
    return <StatePanel icon={History} title="Nenhuma execução registrada" description="Teste o fluxo no editor ou ative-o para começar a registrar execuções." />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {executions.map((execution) => (
          <button
            key={execution.id}
            type="button"
            onClick={() => setSelected(execution)}
            className={cn(
              "w-full rounded-2xl border p-3.5 text-left transition",
              selected?.id === execution.id ? "border-ebot-primary/40 bg-ebot-primary/[0.07]" : "border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 hover:border-ebot-primary/25"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark">
                <StatusBadge label={execution.status === "success" ? "Sucesso" : execution.status === "error" ? "Erro" : execution.status === "running" ? "Rodando" : "Aguardando"} tone={executionTone(execution.status)} />
                {execution.startedAt}
              </span>
              <span className="text-[11px] font-bold text-ebot-muted">{(execution.durationMs / 1000).toFixed(1)}s</span>
            </div>
            <p className="mt-1.5 text-xs font-semibold text-ebot-muted">{execution.trigger}</p>
          </button>
        ))}
      </div>

      {selected ? (
        <section className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-4">
          <h3 className="text-sm font-extrabold text-ebot-dark">Detalhe por nó</h3>
          <p className="mt-0.5 text-xs font-semibold text-ebot-muted">Execução {selected.id} · {(selected.durationMs / 1000).toFixed(1)}s no total</p>
          <div className="mt-3 space-y-2">
            {workflow.nodes.map((node) => {
              const result = selected.nodeResults[node.id];
              const visual = getNodeVisual(node.type);
              const Icon = visual.icon;
              return (
                <div key={node.id} className="flex items-start gap-3 rounded-xl border border-ebot-border/[0.10] bg-ebot-surface px-3 py-2.5">
                  <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg", result?.status === "error" ? "bg-ebot-red/[0.12] text-ebot-red" : result?.status === "success" ? "bg-ebot-green/[0.12] text-ebot-green" : "bg-ebot-surfaceMuted text-ebot-muted")}>
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-extrabold text-ebot-dark">{node.name}</span>
                      {result ? <span className="shrink-0 text-[10px] font-bold tabular-nums text-ebot-muted">{result.durationMs}ms</span> : null}
                    </span>
                    <span className={cn("mt-0.5 block text-xs leading-4", result?.status === "error" ? "font-bold text-ebot-red" : "font-semibold text-ebot-muted")}>
                      {result?.status === "skipped" ? "Não executado (caminho alternativo)." : result?.error ?? result?.output ?? "Sem dados."}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-ebot-muted"><Zap className="size-3.5 text-ebot-primary" />No editor, selecione esta execução para visualizar o status direto no canvas.</p>
        </section>
      ) : null}
    </div>
  );
}
