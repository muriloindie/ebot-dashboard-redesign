"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Check,
  CircleDot,
  GripVertical,
  RotateCcw,
  SearchX,
  Settings2,
  UserRound,
  X
} from "lucide-react";
import { initialTasks, type Task, type TaskStatus } from "@/data/workManagementMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { listKanbanColumns, type KanbanColumnConfig } from "@/lib/work-management/kanbanConfigService";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { PageHeader, SearchField } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const CACHE_KEY = "ebot-week2-kanban-tasks";
const ALL = "Todos";

const priorityTone: Record<Task["priority"], string> = {
  Alta: "bg-red-500/10 text-red-500",
  Média: "bg-ebot-orange/12 text-ebot-orange",
  Baixa: "bg-ebot-surfaceMuted text-ebot-muted"
};

type PendingConfirmation = { type: "delete"; task: Task } | { type: "restore" };

function priorityLabel(priority: Task["priority"]) {
  return { Alta: "Alta", Média: "Média", Baixa: "Baixa" }[priority];
}

function withAlpha(hex: string, alpha: string) {
  const value = hex.replace("#", "");
  return value.length === 6 ? `#${value}${alpha}` : hex;
}

function accentInk(hex: string) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;
  const channels = [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16));
  const luminance = (0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]) / 255;
  const factor = luminance > 0.52 ? 0.62 : 1;
  return `rgb(${channels.map((channel) => Math.round(channel * factor)).join(", ")})`;
}

export function KanbanPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [panning, setPanning] = useState(false);
  const [columns, setColumns] = useState<KanbanColumnConfig[]>([]);
  const [dragged, setDragged] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
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

  useEffect(() => {
    setTasks(readLocalCache(CACHE_KEY, initialTasks));
    setColumns(listKanbanColumns().filter((column) => column.active));
  }, []);

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
    const currentIndex = columns.findIndex((column) => column.id === task.status);
    const targetIndex = event.key === "ArrowRight" ? currentIndex + 1 : event.key === "ArrowLeft" ? currentIndex - 1 : -1;
    if (targetIndex < 0 || targetIndex >= columns.length) return;
    event.preventDefault();
    moveTask(task.id, columns[targetIndex].id as TaskStatus);
  }

  function makePreview(task: Task) {
    const preview = document.createElement("div");
    preview.textContent = task.title;
    preview.style.cssText = "position:fixed;top:-1000px;left:-1000px;width:270px;padding:16px;border-radius:18px;background:#041B15;color:#fff;font:700 13px Inter,sans-serif;box-shadow:0 22px 52px rgba(4,27,21,.34);";
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

  function drop(status: string) {
    if (dragged) moveTask(dragged, status as TaskStatus);
    setDragged(null);
    setDropTarget(null);
  }

  const sectors = Array.from(new Set(tasks.map((task) => task.sector)));
  const responsibles = Array.from(new Set(tasks.map((task) => task.responsible)));
  const hasFilters = search !== "" || sector !== ALL || priority !== ALL || responsible !== ALL;

  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.description} ${task.client ?? ""} ${task.tag}`.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sector === ALL || task.sector === sector;
    const matchesPriority = priority === ALL || task.priority === priority;
    const matchesResponsible = responsible === ALL || task.responsible === responsible;
    return matchesSearch && matchesSector && matchesPriority && matchesResponsible;
  });

  const concluded = tasks.filter((task) => task.status === "Concluído").length;
  const urgent = tasks.filter((task) => task.priority === "Alta" && task.status !== "Concluído").length;

  function startPan(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const target = event.target as HTMLElement;
    if (target.closest('[draggable="true"], a, button, input, select, textarea, [role="dialog"]')) return;
    const board = boardRef.current;
    if (!board) return;
    panRef.current = { x: event.clientX, y: event.clientY, left: board.scrollLeft, top: board.scrollTop, moved: false };
    setPanning(true);
  }

  function movePan(event: React.PointerEvent<HTMLDivElement>) {
    const pan = panRef.current;
    const board = boardRef.current;
    if (!pan || !board) return;
    const dx = event.clientX - pan.x;
    const dy = event.clientY - pan.y;
    if (!pan.moved && Math.hypot(dx, dy) > 5) pan.moved = true;
    if (pan.moved) {
      board.scrollLeft = pan.left - dx;
      board.scrollTop = pan.top - dy;
    }
  }

  function endPan() {
    panRef.current = null;
    setPanning(false);
  }

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Operação / Fluxo"
        title="Kanban"
        description="Um funil visual para enxergar volume, gargalos e próximas movimentações."
        aside={
          <span className="inline-flex items-center gap-2 rounded-full bg-ebot-green/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-green">
            <CircleDot className="size-4" />{concluded} concluídos · {urgent} de alta prioridade
          </span>
        }
        action={
          <Button variant="secondary" onClick={() => router.push("/configuracoes?secao=kanban")}>
            <Settings2 className="size-4" />Configurar Kanban
          </Button>
        }
      />

      <div data-search-bar className="mb-4 flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5 lg:flex-row lg:items-center">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar cartão por título, cliente ou etiqueta" />
        <div className="grid shrink-0 grid-cols-3 gap-2 xl:flex">
          <Dropdown label="Setor" value={sector} options={[ALL, ...sectors]} onChange={setSector} />
          <Dropdown label="Prioridade" value={priority} options={[ALL, "Alta", "Média", "Baixa"]} onChange={setPriority} />
          <Dropdown label="Responsável" value={responsible} options={[ALL, ...responsibles]} onChange={setResponsible} />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setPendingConfirmation({ type: "restore" })} className="shrink-0"><RotateCcw className="size-4" />Restaurar demo</Button>
      </div>

      {feedback ? <div role="status" className="mb-4 flex items-center gap-2 rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green"><Check className="size-4" />{feedback}</div> : null}
      <p id="kanban-keyboard-help" className="sr-only">Foque um cartão e use Alt mais seta para a esquerda ou direita para movê-lo entre as etapas.</p>

      <div
        ref={boardRef}
        role="region"
        data-kanban-board
        onPointerDown={startPan}
        onPointerMove={movePan}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onPointerLeave={endPan}
        className={cn("ebot-scrollbar min-w-0 max-w-full overflow-auto overscroll-contain pb-4", panning ? "cursor-grabbing select-none" : "cursor-grab")}
        tabIndex={0}
        aria-label="Quadro Kanban: arraste com o ponteiro para navegar na horizontal e na vertical"
      >
        <div className="flex min-w-max items-stretch gap-4 px-0.5">
        {columns.map((column) => {
          const items = visibleTasks.filter((task) => task.status === column.id);
          const overWip = column.wip !== null && items.length > column.wip;
          const ink = accentInk(column.color);
          return (
            <section
              key={column.id}
              data-kanban-col
              data-column-id={column.id}
              onDragOver={(event) => { event.preventDefault(); setDropTarget(column.id); }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={(event) => { event.preventDefault(); drop(column.id); }}
              aria-label={`Etapa ${column.label}`}
              style={{ borderColor: withAlpha(column.color, "55"), backgroundColor: dropTarget === column.id ? withAlpha("#6B942E", "18") : withAlpha(column.color, "08") }}
              className={cn(
                "flex min-h-[420px] w-[min(86vw,340px)] min-w-[280px] max-w-[340px] shrink-0 flex-col rounded-[26px] border p-3 transition duration-200",
                dropTarget === column.id ? "bg-ebot-primary/[0.10] shadow-glow" : ""
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2 px-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: column.color }} aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-extrabold" style={{ color: ink }}>{column.label}</h3>
                    <p className="text-[11px] font-semibold text-ebot-muted">{column.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-black tabular-nums", overWip ? "bg-red-500/10 text-red-500" : "")} style={overWip ? undefined : { backgroundColor: withAlpha(column.color, "18"), color: ink }}>
                    {items.length}{column.wip !== null ? `/${column.wip}` : ""}
                  </span>
                  <span className="rounded-full border px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide" style={{ borderColor: withAlpha(column.color, "40"), color: ink }}>{column.stage}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {items.map((task) => (
                  <article
                    key={task.id}
                    data-card
                    tabIndex={0}
                    draggable
                    data-task-id={task.id}
                    onDragStart={(event) => startDrag(event, task)}
                    onDragEnd={() => { setDragged(null); setDropTarget(null); }}
                    onKeyDown={(event) => handleCardKeyDown(event, task)}
                    aria-label={`Cartão ${task.title}, etapa ${task.status}`}
                    aria-describedby="kanban-keyboard-help"
                    style={{ borderColor: withAlpha(column.color, "32"), backgroundColor: withAlpha(column.color, "0D") }}
                    className={cn(
                      "group relative rounded-2xl border p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card dark:shadow-[0_12px_28px_rgba(0,0,0,0.14)]",
                      dragged === task.id && "opacity-40"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => requestRemove(task)}
                      aria-label={`Excluir ${task.title}`}
                      className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-lg text-ebot-muted opacity-70 transition hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>
                    <div className="flex items-start justify-between gap-2 pr-5">
                      <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold", priorityTone[task.priority])}>Prioridade {priorityLabel(task.priority)}</span>
                      <span className="text-[11px] font-bold text-ebot-muted">{task.id}</span>
                    </div>
                     <h4 className="mt-2.5 text-sm font-extrabold leading-5" style={{ color: ink }}>{task.title}</h4>
                     <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-ebot-muted">{task.description}</p>
                     {task.client ? (
                       <p className="mt-3 flex items-center gap-1.5 text-xs font-bold" style={{ color: ink }}><UserRound className="size-3.5" />{task.client}</p>
                     ) : null}
                     <div className="mt-3 flex flex-wrap gap-1.5">
                       <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: withAlpha(column.color, "18"), color: ink }}>{task.sector}</span>
                       {task.tag ? <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: withAlpha(column.color, "18"), color: ink }}>#{task.tag}</span> : null}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-ebot-border/[0.10] pt-3">
                      <span className={cn("flex items-center gap-1.5 text-[11px] font-bold", task.status !== "Concluído" && task.due.toLowerCase().includes("hoje") ? "text-red-500" : "text-ebot-muted")}>
                        <CalendarClock className="size-3.5" />{task.due}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-ebot-muted"><GripVertical className="size-3.5 text-ebot-border" />{task.responsible}</span>
                    </div>
                  </article>
                ))}
                {items.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-ebot-border/[0.18] p-6 text-center text-xs font-semibold text-ebot-muted">
                     {hasFilters ? "Nenhum cartão nesta etapa com os filtros atuais" : "Arraste cartões para cá"}
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
        </div>
      </div>

      {hasFilters && visibleTasks.length === 0 ? (
        <div className="mt-2 flex flex-col items-center gap-3 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/60 p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-ebot-surfaceMuted"><SearchX className="size-6 text-ebot-muted" /></span>
          <p className="text-sm font-extrabold text-ebot-dark">Nenhum cartão encontrado</p>
          <p className="max-w-sm text-xs leading-5 text-ebot-muted">Ajuste a busca ou os filtros de setor, prioridade e responsável.</p>
          <Button size="sm" variant="secondary" onClick={() => { setSearch(""); setSector(ALL); setPriority(ALL); setResponsible(ALL); }}>
            Limpar filtros
          </Button>
        </div>
      ) : null}

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
