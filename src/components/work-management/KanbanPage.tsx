"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarClock,
  Check,
  CircleDot,
  GripVertical,
  KanbanSquare,
  Layers3,
  Plus,
  RotateCcw,
  SearchX,
  UserRound,
  X
} from "lucide-react";
import { initialTasks, kanbanColumns, type Task, type TaskStatus } from "@/data/workManagementMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { Dropdown } from "@/components/ui/Dropdown";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { PageHeader, SearchField } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const CACHE_KEY = "ebot-week2-kanban-tasks";
const ALL = "Todos";

const columnTone: Record<TaskStatus, string> = {
  "Novo": "bg-clinical-blue",
  "Em atendimento": "bg-clinical-orange",
  "Aguardando": "bg-clinical-muted",
  "Agendado": "bg-clinical-teal",
  "Em acompanhamento": "bg-clinical-green",
  "Concluído": "bg-clinical-charcoal"
};

const priorityTone: Record<Task["priority"], string> = {
  Alta: "bg-red-500/10 text-red-500",
  Média: "bg-clinical-orange/12 text-clinical-orange",
  Baixa: "bg-clinical-surfaceMuted text-clinical-muted"
};

type PendingConfirmation = { type: "delete"; task: Task } | { type: "restore" };

function priorityLabel(priority: Task["priority"]) {
  return { Alta: "Alta", Média: "Média", Baixa: "Baixa" }[priority];
}

export function KanbanPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dragged, setDragged] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [responsible, setResponsible] = useState(ALL);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);

  usePageEnter(pageRef, [
    { selector: "[data-kanban-col]", from: { opacity: 0, y: 22 } },
    { selector: "[data-search-bar]", from: { opacity: 0, y: 12 }, to: { duration: 0.4, ease: "power3.out" } }
  ], { stagger: 0.06, delay: 0.05 });

  useEffect(() => setTasks(readLocalCache(CACHE_KEY, initialTasks)), []);

  useEffect(() => () => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
  }, []);

  function announce(message: string) {
    setFeedback(message);
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(""), 3200);
  }

  function persist(next: Task[]) { setTasks(next); writeLocalCache(CACHE_KEY, next); }

  function moveTask(id: string, status: TaskStatus) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    if (task.status === status) {
      announce(`${task.title} já está em ${status}.`);
      return;
    }
    persist(tasks.map((item) => item.id === id ? { ...item, status } : item));
    announce(`${task.title} movido para ${status}.`);
  }

  function requestRemove(task: Task) { setPendingConfirmation({ type: "delete", task }); }

  function confirmPendingAction() {
    if (!pendingConfirmation) return;
    if (pendingConfirmation.type === "delete") {
      persist(tasks.filter((task) => task.id !== pendingConfirmation.task.id));
      announce(`Cartão "${pendingConfirmation.task.title}" excluído.`);
    } else {
      persist([...initialTasks]);
      announce("Cartões de demonstração restaurados.");
    }
    setPendingConfirmation(null);
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLElement>, task: Task) {
    if (!event.altKey) return;
    const currentIndex = kanbanColumns.findIndex((column) => column.id === task.status);
    const targetIndex = event.key === "ArrowRight" ? currentIndex + 1 : event.key === "ArrowLeft" ? currentIndex - 1 : -1;
    if (targetIndex < 0 || targetIndex >= kanbanColumns.length) return;
    event.preventDefault();
    moveTask(task.id, kanbanColumns[targetIndex].id);
  }

  function makePreview(task: Task) {
    const preview = document.createElement("div");
    preview.textContent = task.title;
    preview.style.cssText = "position:fixed;top:-1000px;left:-1000px;width:270px;padding:16px;border-radius:18px;background:#263532;color:#fff;font:700 13px Inter,sans-serif;box-shadow:0 22px 52px rgba(38,53,50,.34);";
    document.body.appendChild(preview);
    previewRef.current = preview;
    return preview;
  }

  function startDrag(event: React.DragEvent<HTMLElement>, task: Task) {
    setDragged(task.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", task.id);
    const preview = makePreview(task);
    event.dataTransfer.setDragImage(preview, 24, 20);
    window.setTimeout(() => { preview.remove(); previewRef.current = null; }, 0);
  }

  function drop(status: TaskStatus) {
    if (dragged) moveTask(dragged, status);
    setDragged(null);
    setDropTarget(null);
  }

  function createCard(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Task = {
      id: `TK-${String(Math.max(-1, ...tasks.map((task) => Number(task.id.replace("TK-", "")))) + 1).padStart(2, "0")}`,
      title: String(form.get("title")),
      description: String(form.get("description")),
      responsible: String(form.get("responsible")),
      sector: String(form.get("sector")),
      priority: String(form.get("priority")) as Task["priority"],
      due: String(form.get("due")),
      status: String(form.get("status")) as TaskStatus,
      tag: String(form.get("tag"))
    };
    persist([...tasks, next]);
    setCreateOpen(false);
    announce(`Cartão "${next.title}" criado em ${next.status}.`);
  }

  const sectors = Array.from(new Set(tasks.map((task) => task.sector)));
  const responsibles = Array.from(new Set(tasks.map((task) => task.responsible)));
  const hasFilters = search !== "" || sector !== ALL || priority !== ALL || responsible !== ALL;

  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.description} ${task.patient ?? ""} ${task.tag}`.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sector === ALL || task.sector === sector;
    const matchesPriority = priority === ALL || task.priority === priority;
    const matchesResponsible = responsible === ALL || task.responsible === responsible;
    return matchesSearch && matchesSector && matchesPriority && matchesResponsible;
  });

  const concluded = tasks.filter((task) => task.status === "Concluído").length;
  const urgent = tasks.filter((task) => task.priority === "Alta" && task.status !== "Concluído").length;
  const groups = kanbanColumns.map((column, index) => ({
    ...column,
    stage: index === 0 ? "Entrada" : index >= kanbanColumns.length - 2 ? "Entrega" : "Ação"
  }));
  const stages = ["Entrada", "Ação", "Entrega"];

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Operação / Fluxo"
        title="Kanban"
        description="Um funil visual para enxergar volume, gargalos e próximas movimentações."
        aside={
          <span className="inline-flex items-center gap-2 rounded-full bg-clinical-green/[0.09] px-3 py-2 text-xs font-extrabold text-clinical-green">
            <CircleDot className="size-4" />{concluded} concluídos · {urgent} de alta prioridade
          </span>
        }
        action={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" />Novo cartão</Button>}
      />

      <div className="mb-5 overflow-hidden rounded-[26px] bg-clinical-charcoal text-white shadow-[0_18px_42px_rgba(38,53,50,0.18)]">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-clinical-blue"><KanbanSquare className="size-4" />Pipeline clínico</p>
            <h2 className="mt-2 text-lg font-extrabold tracking-tight">Fluxo de execução da equipe</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Layers3 className="size-4 text-clinical-green" />{tasks.length} cartões · {kanbanColumns.length} etapas
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-white/10 text-center text-xs font-bold text-white/55">
          {stages.map((stage, index) => (
            <div key={stage} className={cn("px-3 py-3", index === 1 && "border-x border-white/10")}>
              {stage}
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-extrabold text-white/80">
                {groups.filter((group) => group.stage === stage).reduce((sum, group) => sum + visibleTasks.filter((task) => task.status === group.id).length, 0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div data-search-bar className="mb-4 flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5 lg:flex-row lg:items-center">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar cartão por título, paciente ou etiqueta" />
        <div className="grid shrink-0 grid-cols-3 gap-2 xl:flex">
          <Dropdown label="Setor" value={sector} options={[ALL, ...sectors]} onChange={setSector} />
          <Dropdown label="Prioridade" value={priority} options={[ALL, "Alta", "Média", "Baixa"]} onChange={setPriority} />
          <Dropdown label="Responsável" value={responsible} options={[ALL, ...responsibles]} onChange={setResponsible} />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setPendingConfirmation({ type: "restore" })} className="shrink-0"><RotateCcw className="size-4" />Restaurar demo</Button>
      </div>

      {feedback ? <div role="status" className="mb-4 flex items-center gap-2 rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green"><Check className="size-4" />{feedback}</div> : null}
      <p id="kanban-keyboard-help" className="sr-only">Foque um cartão e use Alt mais seta para a esquerda ou direita para movê-lo entre as etapas.</p>

      <div className="clinical-scrollbar grid grid-cols-1 gap-4 overflow-x-auto pb-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kanbanColumns.map((column) => {
          const items = visibleTasks.filter((task) => task.status === column.id);
          const group = groups.find((item) => item.id === column.id)?.stage ?? "Ação";
          return (
            <section
              key={column.id}
              data-kanban-col
              onDragOver={(event) => { event.preventDefault(); setDropTarget(column.id); }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={(event) => { event.preventDefault(); drop(column.id); }}
              aria-label={`Etapa ${column.label}`}
              className={cn(
                "flex min-h-[420px] min-w-[280px] flex-col rounded-[26px] border p-3 transition duration-200",
                dropTarget === column.id ? "border-clinical-blue/55 bg-clinical-blue/[0.10] shadow-glow" : "border-clinical-border/[0.14] bg-clinical-surface/65"
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2 px-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-full", columnTone[column.id])} aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-extrabold text-clinical-dark">{column.label}</h3>
                    <p className="text-[11px] font-semibold text-clinical-muted">{column.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-black tabular-nums text-clinical-muted">{items.length}</span>
                  <span className="rounded-full border border-clinical-border/[0.12] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-clinical-muted">{group}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {items.map((task) => (
                  <article
                    key={task.id}
                    data-card
                    tabIndex={0}
                    draggable
                    onDragStart={(event) => startDrag(event, task)}
                    onDragEnd={() => { setDragged(null); setDropTarget(null); }}
                    onKeyDown={(event) => handleCardKeyDown(event, task)}
                    aria-label={`Cartão ${task.title}, etapa ${task.status}`}
                    aria-describedby="kanban-keyboard-help"
                    className={cn(
                      "group relative rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/90 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:shadow-card dark:shadow-[0_12px_28px_rgba(0,0,0,0.14)]",
                      dragged === task.id && "opacity-40"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => requestRemove(task)}
                      aria-label={`Excluir ${task.title}`}
                      className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-lg text-clinical-muted opacity-70 transition hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>
                    <div className="flex items-start justify-between gap-2 pr-5">
                      <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold", priorityTone[task.priority])}>Prioridade {priorityLabel(task.priority)}</span>
                      <span className="text-[11px] font-bold text-clinical-muted">{task.id}</span>
                    </div>
                    <h4 className="mt-3 text-sm font-extrabold leading-5 text-clinical-dark">{task.title}</h4>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-clinical-muted">{task.description}</p>
                    {task.patient ? (
                      <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-clinical-blueText"><UserRound className="size-3.5" />{task.patient}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-clinical-blue/[0.08] px-2 py-1 text-[11px] font-bold text-clinical-blueText">{task.sector}</span>
                      {task.tag ? <span className="rounded-full bg-clinical-green/[0.09] px-2 py-1 text-[11px] font-bold text-clinical-green">#{task.tag}</span> : null}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-clinical-border/[0.10] pt-3">
                      <span className={cn("flex items-center gap-1.5 text-[11px] font-bold", task.status !== "Concluído" && task.due.toLowerCase().includes("hoje") ? "text-red-500" : "text-clinical-muted")}>
                        <CalendarClock className="size-3.5" />{task.due}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-clinical-muted"><GripVertical className="size-3.5 text-clinical-border" />{task.responsible}</span>
                    </div>
                  </article>
                ))}
                {items.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-clinical-border/[0.18] p-6 text-center text-xs font-semibold text-clinical-muted">
                     {hasFilters ? "Nenhum cartão nesta etapa com os filtros atuais" : "Arraste cartões para cá"}
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      {hasFilters && visibleTasks.length === 0 ? (
        <div className="mt-2 flex flex-col items-center gap-3 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/60 p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-clinical-surfaceMuted"><SearchX className="size-6 text-clinical-muted" /></span>
          <p className="text-sm font-extrabold text-clinical-dark">Nenhum cartão encontrado</p>
          <p className="max-w-sm text-xs leading-5 text-clinical-muted">Ajuste a busca ou os filtros de setor, prioridade e responsável.</p>
          <Button size="sm" variant="secondary" onClick={() => { setSearch(""); setSector(ALL); setPriority(ALL); setResponsible(ALL); }}>
            Limpar filtros
          </Button>
        </div>
      ) : null}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo cartão no Kanban" eyebrow="Pipeline clínico" description="Crie um cartão completo e escolha exatamente em qual etapa ele deve entrar." icon={KanbanSquare} className="max-w-2xl">
        <form onSubmit={createCard} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="title" label="Título do cartão" icon={KanbanSquare} placeholder="Ex.: Confirmar retorno do paciente" required />
            <ModalField name="tag" label="Etiqueta do funil" icon={Layers3} placeholder="Ex.: Retorno, Convênio" required />
            <ModalTextarea name="description" label="Contexto do cartão" icon={CircleDot} placeholder="Descreva a ação e o resultado esperado." required className="sm:col-span-2" />
            <ModalSelect name="status" label="Etapa inicial" icon={KanbanSquare} defaultValue="Novo">
              {kanbanColumns.map((column) => <option key={column.id}>{column.id}</option>)}
            </ModalSelect>
            <ModalSelect name="responsible" label="Responsável" icon={UserRound} defaultValue="Marina Costa">
              {responsibles.map((item) => <option key={item}>{item}</option>)}
            </ModalSelect>
            <ModalSelect name="sector" label="Setor" icon={Layers3} defaultValue={sectors[0] ?? "Operação"}>
              {sectors.map((item) => <option key={item}>{item}</option>)}
            </ModalSelect>
            <ModalSelect name="priority" label="Prioridade" icon={CircleDot} defaultValue="Média"><option>Alta</option><option>Média</option><option>Baixa</option></ModalSelect>
            <ModalField name="due" label="Prazo do cartão" icon={CalendarClock} placeholder="Ex.: Hoje, 24 jul" required />
          </div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button type="submit"><Check className="size-4" />Criar cartão</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={Boolean(pendingConfirmation)}
        onClose={() => setPendingConfirmation(null)}
        onConfirm={confirmPendingAction}
        title={pendingConfirmation?.type === "restore" ? "Restaurar cartões de demonstração?" : "Excluir cartão?"}
        description={pendingConfirmation?.type === "restore" ? "As alterações locais do Kanban serão substituídas pelos cartões de demonstração." : `O cartão "${pendingConfirmation?.task.title ?? ""}" será removido desta visão local.`}
        confirmLabel={pendingConfirmation?.type === "restore" ? "Restaurar" : "Excluir cartão"}
      />
    </div>
  );
}
