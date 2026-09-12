"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  ClipboardCheck,
  Grid2X2,
  List,
  ListTodo,
  Pencil,
  Plus,
  SearchX,
  Trash2,
  Undo2,
  UserRound
} from "lucide-react";
import { initialTasks, type Task, type TaskStatus } from "@/data/workManagementMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { listKanbanTags } from "@/lib/tags/tagsService";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { FilterSelect, PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const CACHE_KEY = "ebot-week2-kanban-tasks";
const ALL = "Todos";
const statuses: TaskStatus[] = ["Novo", "Em atendimento", "Aguardando", "Agendado", "Em acompanhamento", "Concluído"];

const columns: { ids: TaskStatus[]; title: string; subtitle: string; icon: typeof ListTodo; color: string }[] = [
  { ids: ["Novo"], title: "Novas", subtitle: "Entraram na fila agora", icon: CircleDashed, color: "#C97F12" },
  { ids: ["Em atendimento", "Aguardando", "Agendado"], title: "Em execução", subtitle: "Em andamento com a equipe", icon: ListTodo, color: "#6B942E" },
  { ids: ["Em acompanhamento"], title: "Acompanhamento", subtitle: "Monitoramento pós-agendamento", icon: CircleDot, color: "#408B78" },
  { ids: ["Concluído"], title: "Encerradas", subtitle: "Finalizadas recentemente", icon: CheckCircle2, color: "#6B942E" }
];

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

type ViewMode = "board" | "list" | "agenda";
type PendingUndo = { tasks: Task[]; label: string };

function nextTaskId(tasks: Task[]) {
  const numbers = tasks
    .map((task) => Number(task.id.replace("TK-", "")))
    .filter((value) => Number.isFinite(value));
  return `TK-${String(Math.max(-1, ...numbers) + 1).padStart(2, "0")}`;
}

function taskPriorityMeta(priority: Task["priority"]): { dot: string; label: string } {
  if (priority === "Alta") return { dot: "#C13E3E", label: "Alta" };
  if (priority === "Média") return { dot: "#C97F12", label: "Média" };
  return { dot: "#8FA9B4", label: "Baixa" };
}

function TaskCard({
  task,
  variant = "card",
  accent = "#6B942E",
  onMove,
  onDragStart,
  onDragEnd,
  onEdit,
  onToggleComplete,
  onDelete
}: {
  task: Task;
  variant?: "card" | "notebook";
  accent?: string;
  onMove: (id: string, status: TaskStatus) => void;
  onDragStart: (event: React.DragEvent<HTMLElement>, task: Task) => void;
  onDragEnd: () => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!event.altKey || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    const currentIndex = statuses.indexOf(task.status);
    const nextIndex = event.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= statuses.length) return;
    event.preventDefault();
    onMove(task.id, statuses[nextIndex]);
  }

  const done = task.status === "Concluído";
  const ink = accentInk(accent);
  const priority = taskPriorityMeta(task.priority);

  if (variant === "notebook") {
    return (
      <article
        draggable
        tabIndex={0}
        onDragStart={(event) => onDragStart(event, task)}
        onDragEnd={onDragEnd}
        onKeyDown={handleKeyDown}
        aria-label={`Tarefa ${task.title}, status ${task.status}`}
        className="group relative flex items-start gap-3.5 rounded-r-2xl border-b border-ebot-border/[0.12] bg-ebot-surface/90 py-3.5 pl-5 pr-3 transition duration-200 hover:bg-ebot-primary/[0.04] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ebot-primary/30"
      >
        <span aria-hidden="true" className="absolute inset-y-2 left-2 w-px bg-ebot-red/25" />
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          role="checkbox"
          aria-checked={done}
          aria-label={done ? `Reabrir ${task.title}` : `Concluir ${task.title}`}
          title={done ? "Reabrir tarefa" : "Concluir tarefa"}
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition",
            done
              ? "border-ebot-green bg-ebot-green text-white"
              : "border-ebot-border/[0.35] bg-ebot-surface text-transparent hover:border-ebot-green hover:text-ebot-green/40"
          )}
        >
          <Check className="size-3.5" strokeWidth={3.5} />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className={cn("text-[14px] font-extrabold leading-5 text-ebot-dark", done && "text-ebot-muted line-through decoration-ebot-green/60")}>{task.title}</h3>
          {task.description ? <p className="mt-0.5 line-clamp-1 text-[12px] leading-5 text-ebot-muted">{task.description}</p> : null}
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold text-ebot-muted">
            <span className="inline-flex items-center gap-1"><CalendarClock className="size-3" />{task.due}</span>
            <span className="inline-flex items-center gap-1"><UserRound className="size-3" />{task.responsible}</span>
            <span className="rounded-full bg-ebot-surfaceMuted px-2 py-0.5">{task.sector}</span>
            {task.tag ? <span className="text-ebot-green">#{task.tag}</span> : null}
            {task.client ? <span className="text-ebot-primaryText">{task.client}</span> : null}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
          <button type="button" onClick={() => onEdit(task)} aria-label={`Editar ${task.title}`} title="Editar" className="flex size-8 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-3.5" /></button>
          <button type="button" onClick={() => onDelete(task)} aria-label={`Excluir ${task.title}`} title="Excluir" className="flex size-8 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500"><Trash2 className="size-3.5" /></button>
        </span>
      </article>
    );
  }

  return (
    <article
      draggable
      tabIndex={0}
      onDragStart={(event) => onDragStart(event, task)}
      onDragEnd={onDragEnd}
      onKeyDown={handleKeyDown}
      aria-label={`Tarefa ${task.title}, status ${task.status}`}
      style={{ borderColor: withAlpha(accent, "30"), backgroundColor: withAlpha(accent, "0D") }}
      className="group rounded-2xl border p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-ebot-primary/30"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide" style={{ backgroundColor: withAlpha(accent, "18"), color: ink }}>
          <span className="size-1.5 rounded-full" style={{ backgroundColor: priority.dot }} aria-hidden="true" />
          {priority.label}
        </span>
        <span className="shrink-0 font-mono text-[10px] font-bold text-ebot-muted">{task.id}</span>
      </div>
      <h3 className={cn("mt-2 text-[14px] font-extrabold leading-5 text-ebot-dark", done && "text-ebot-muted line-through decoration-ebot-green/60")}>{task.title}</h3>
      {task.description ? <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-ebot-muted">{task.description}</p> : null}
      {task.client ? <p className="mt-2 flex items-center gap-1.5 text-[12px] font-bold" style={{ color: ink }}><UserRound className="size-3.5 shrink-0" /><span className="truncate">{task.client}</span></p> : null}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: withAlpha(accent, "18"), color: ink }}><UserRound className="size-3" />{task.responsible}</span>
        <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: withAlpha(accent, "18"), color: ink }}>{task.sector}</span>
        {task.tag ? <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: withAlpha(accent, "18"), color: ink }}>#{task.tag}</span> : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2.5" style={{ borderColor: withAlpha(accent, "22") }}>
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold text-ebot-muted"><CalendarClock className="size-3.5 shrink-0" /><span className="truncate">{task.due}</span></span>
        <span className="flex shrink-0 items-center">
          <button type="button" onClick={() => onToggleComplete(task)} aria-label={done ? `Reabrir ${task.title}` : `Concluir ${task.title}`} title={done ? "Reabrir" : "Concluir"} className={cn("flex size-8 items-center justify-center rounded-xl transition focus:outline-none focus:ring-2 focus:ring-ebot-green/40", done ? "text-ebot-green" : "text-ebot-muted hover:bg-ebot-green/10 hover:text-ebot-green")}>
            <CheckCircle2 className="size-4" />
          </button>
          <button type="button" onClick={() => onEdit(task)} aria-label={`Editar ${task.title}`} title="Editar" className="flex size-8 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary focus:outline-none focus:ring-2 focus:ring-ebot-primary/30"><Pencil className="size-3.5" /></button>
          <button type="button" onClick={() => onDelete(task)} aria-label={`Excluir ${task.title}`} title="Excluir" className="flex size-8 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"><Trash2 className="size-3.5" /></button>
        </span>
      </div>
      <select aria-label={`Mover ${task.title}`} value={task.status} onChange={(event) => onMove(task.id, event.target.value as TaskStatus)} className="mt-2 w-full rounded-xl border-0 bg-transparent py-1 text-[11px] font-extrabold outline-none" style={{ color: ink }}>
        {statuses.map((status) => <option key={status}>{status}</option>)}
      </select>
    </article>
  );
}

export function TodoListPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [priorityFilter, setPriorityFilter] = useState(ALL);
  const [sectorFilter, setSectorFilter] = useState(ALL);
  const [responsibleFilter, setResponsibleFilter] = useState(ALL);
  const [tagFilter, setTagFilter] = useState(ALL);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [view, setView] = useState<ViewMode>("board");
  const [dragged, setDragged] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
  const [notice, setNotice] = useState("");
  const [undo, setUndo] = useState<PendingUndo | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const undoTimerRef = useRef<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const [panning, setPanning] = useState(false);

  useEffect(() => setTasks(readLocalCache(CACHE_KEY, initialTasks)), []);
  useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  }, []);

  const sectors = Array.from(new Set(tasks.map((task) => task.sector)));
  const responsibles = Array.from(new Set(tasks.map((task) => task.responsible)));
  const kanbanTags = useMemo(() => listKanbanTags(), []);
  const filtered = useMemo(() => tasks.filter((task) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch = !normalizedSearch || `${task.title} ${task.description} ${task.client ?? ""} ${task.responsible} ${task.sector} ${task.tag}`.toLowerCase().includes(normalizedSearch);
    return matchesSearch
      && (statusFilter === ALL || task.status === statusFilter)
      && (priorityFilter === ALL || task.priority === priorityFilter)
      && (sectorFilter === ALL || task.sector === sectorFilter)
      && (responsibleFilter === ALL || task.responsible === responsibleFilter)
      && (tagFilter === ALL || task.tag.toLowerCase() === tagFilter.toLowerCase());
  }), [priorityFilter, responsibleFilter, search, sectorFilter, statusFilter, tagFilter, tasks]);
  function persist(next: Task[]) {
    setTasks(next);
    writeLocalCache(CACHE_KEY, next);
  }

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

  function showNotice(message: string, previousTasks?: Task[]) {
    setNotice(message);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 3600);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    if (previousTasks) {
      setUndo({ tasks: previousTasks, label: "Desfazer" });
      undoTimerRef.current = window.setTimeout(() => setUndo(null), 6000);
    } else {
      setUndo(null);
    }
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter(ALL);
    setPriorityFilter(ALL);
    setSectorFilter(ALL);
    setResponsibleFilter(ALL);
    setTagFilter(ALL);
  }

  function moveTask(id: string, status: TaskStatus) {
    const task = tasks.find((item) => item.id === id);
    if (!task || task.status === status) return;
    const previousTasks = tasks;
    persist(tasks.map((item) => item.id === id ? { ...item, status } : item));
    showNotice(`"${task.title}" movida para ${status}.`, previousTasks);
  }

  function toggleComplete(task: Task) {
    const nextStatus: TaskStatus = task.status === "Concluído" ? "Em atendimento" : "Concluído";
    moveTask(task.id, nextStatus);
  }

  function createDragPreview(task: Task) {
    const preview = document.createElement("div");
    preview.textContent = task.title;
    preview.style.cssText = "position:fixed;top:-1000px;left:-1000px;width:260px;padding:14px 16px;border-radius:16px;background:#041B15;color:#fff;font:700 13px Inter, sans-serif;box-shadow:0 20px 45px rgba(4,27,21,.28);";
    document.body.appendChild(preview);
    previewRef.current = preview;
    return preview;
  }

  function handleDragStart(event: React.DragEvent<HTMLElement>, task: Task) {
    setDragged(task.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", task.id);
    const preview = createDragPreview(task);
    event.dataTransfer.setDragImage(preview, 18, 18);
    window.setTimeout(() => { preview.remove(); previewRef.current = null; }, 0);
  }

  function handleDrop(status: TaskStatus) {
    if (dragged) moveTask(dragged, status);
    setDragged(null);
    setDropTarget(null);
  }

  function openCreate() {
    setEditingTask(null);
    setCreateOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setCreateOpen(true);
  }

  function closeTaskModal() {
    setCreateOpen(false);
    setEditingTask(null);
  }

  function saveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;
    const client = String(form.get("client") ?? "").trim();
    const taskFields = {
      title,
      description: String(form.get("description") ?? "").trim(),
      client: client || undefined,
      responsible: String(form.get("responsible") ?? "").trim(),
      sector: String(form.get("sector") ?? "").trim(),
      priority: String(form.get("priority") ?? "Média") as Task["priority"],
      due: String(form.get("due") ?? "").trim(),
      status: String(form.get("status") ?? "Novo") as TaskStatus,
      tag: String(form.get("tag") ?? "").trim()
    };

    if (editingTask) {
      persist(tasks.map((task) => task.id === editingTask.id ? { ...task, ...taskFields } : task));
      showNotice(`Tarefa "${title}" atualizada localmente.`);
    } else {
      const next: Task = { id: nextTaskId(tasks), ...taskFields };
      persist([next, ...tasks]);
      showNotice(`Tarefa "${title}" criada localmente.`);
    }
    closeTaskModal();
  }

  function confirmDelete() {
    if (!taskToDelete) return;
    const previousTasks = tasks;
    persist(tasks.filter((task) => task.id !== taskToDelete.id));
    showNotice(`Tarefa "${taskToDelete.title}" removida.`, previousTasks);
    setTaskToDelete(null);
  }

  function undoLastAction() {
    if (!undo) return;
    persist(undo.tasks);
    setUndo(null);
    showNotice("Última alteração desfeita.");
  }

  const cardProps = { onMove: moveTask, onDragStart: handleDragStart, onDragEnd: () => { setDragged(null); setDropTarget(null); }, onEdit: openEdit, onToggleComplete: toggleComplete, onDelete: (task: Task) => setTaskToDelete(task) };

  return (
    <div>
      <PageHeader
        eyebrow="Operação / Organização"
        title="Tarefas"
        description="Dê visibilidade ao trabalho que mantém a operação empresa em movimento."
        action={<Button onClick={openCreate}><Plus className="size-4" />Nova tarefa</Button>}
      />

      <div className="mb-5 flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <SearchField value={search} onChange={setSearch} placeholder="Buscar tarefa, responsável, setor ou etiqueta" />
          <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-ebot-surfaceMuted/55 p-1">
            <button type="button" onClick={() => setView("board")} aria-label="Ver tarefas em quadro" aria-pressed={view === "board"} className={cn("flex size-9 items-center justify-center rounded-xl transition", view === "board" ? "bg-ebot-surface text-ebot-primary shadow-sm" : "text-ebot-muted hover:text-ebot-primary")}><Grid2X2 className="size-4" /></button>
            <button type="button" onClick={() => setView("list")} aria-label="Ver tarefas em lista" aria-pressed={view === "list"} className={cn("flex size-9 items-center justify-center rounded-xl transition", view === "list" ? "bg-ebot-surface text-ebot-primary shadow-sm" : "text-ebot-muted hover:text-ebot-primary")}><List className="size-4" /></button>
            <button type="button" onClick={() => setView("agenda")} aria-label="Ver tarefas em agenda" aria-pressed={view === "agenda"} className={cn("flex size-9 items-center justify-center rounded-xl transition", view === "agenda" ? "bg-ebot-surface text-ebot-primary shadow-sm" : "text-ebot-muted hover:text-ebot-primary")}><CalendarClock className="size-4" /></button>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[ALL, ...statuses]} />
          <FilterSelect label="Prioridade" value={priorityFilter} onChange={setPriorityFilter} options={[ALL, "Alta", "Média", "Baixa"]} />
          <FilterSelect label="Setor" value={sectorFilter} onChange={setSectorFilter} options={[ALL, ...sectors]} />
          <FilterSelect label="Responsável" value={responsibleFilter} onChange={setResponsibleFilter} options={[ALL, ...responsibles]} />
          <FilterSelect label="Tag do Kanban" value={tagFilter} onChange={setTagFilter} options={[ALL, ...kanbanTags.map((tag) => tag.name)]} />
        </div>
      </div>

      {notice ? <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green"><span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>{undo ? <Button size="sm" variant="secondary" onClick={undoLastAction}><Undo2 className="size-3.5" />{undo.label}</Button> : null}</div> : null}
      <p id="todo-keyboard-help" className="sr-only">Foque uma tarefa e use Alt mais seta para a esquerda ou direita para movê-la entre os status.</p>

      {filtered.length === 0 ? (
        <StatePanel
          icon={tasks.length ? SearchX : ListTodo}
          title={tasks.length ? "Nenhuma tarefa encontrada" : "Ainda não há tarefas"}
          description={tasks.length ? "Ajuste os filtros ou tente outro termo de busca." : "Crie a primeira tarefa para organizar o próximo movimento da equipe."}
          action={<Button size="sm" variant="secondary" onClick={tasks.length ? clearFilters : openCreate}>{tasks.length ? "Limpar filtros" : "Criar tarefa"}</Button>}
        />
      ) : view === "board" ? (
        <div
          ref={boardRef}
          role="region"
          data-todo-board
          onPointerDown={startPan}
          onPointerMove={movePan}
          onPointerUp={endPan}
          onPointerCancel={endPan}
          onPointerLeave={endPan}
          className={cn("ebot-scrollbar min-w-0 max-w-full overflow-auto overscroll-contain pb-4", panning ? "cursor-grabbing select-none" : "cursor-grab")}
          tabIndex={0}
          aria-label="Quadro de tarefas: arraste com o ponteiro para navegar na horizontal"
        >
          <div className="flex min-w-max items-stretch gap-4 px-0.5">
          {columns.map((column) => {
            const ColumnIcon = column.icon;
            const columnTasks = filtered.filter((task) => column.ids.includes(task.status));
            const ink = accentInk(column.color);
            const isOver = dropTarget !== null && column.ids.includes(dropTarget);
            return (
              <section
                key={column.title}
                onDragOver={(event) => { event.preventDefault(); setDropTarget(column.ids[0]); }}
                onDragLeave={() => setDropTarget(null)}
                onDrop={(event) => { event.preventDefault(); handleDrop(column.ids[0]); }}
                aria-label={`Coluna ${column.title}`}
                style={{ borderColor: withAlpha(column.color, "55"), backgroundColor: isOver ? withAlpha("#6B942E", "18") : withAlpha(column.color, "08") }}
                className="flex min-h-[460px] w-[min(86vw,300px)] min-w-[268px] max-w-[320px] shrink-0 flex-col rounded-[26px] border p-3 transition duration-200"
              >
                <div className="mb-3 flex items-center gap-2.5 px-1 pt-1">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: withAlpha(column.color, "18"), color: ink }}><ColumnIcon className="size-4" /></span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[13px] font-extrabold uppercase tracking-[0.08em] text-ebot-dark">{column.title}</h2>
                    <p className="truncate text-[11px] font-semibold text-ebot-muted">{column.subtitle}</p>
                  </div>
                  <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black tabular-nums" style={{ backgroundColor: withAlpha(column.color, "18"), color: ink }}>{columnTasks.length}</span>
                </div>
                <div className="flex flex-1 flex-col gap-2.5">
                  {columnTasks.map((task) => <TaskCard key={task.id} task={task} accent={column.color} {...cardProps} />)}
                  {columnTasks.length === 0 ? <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed p-6 text-center text-xs font-semibold text-ebot-muted" style={{ borderColor: withAlpha(column.color, "40") }}>Arraste uma tarefa para esta etapa</div> : null}
                </div>
              </section>
            );
          })}
          </div>
        </div>
      ) : view === "list" ? (
        <div className="space-y-4">
          {columns.map((column) => {
            const ColumnIcon = column.icon;
            const columnTasks = filtered.filter((task) => column.ids.includes(task.status));
            if (columnTasks.length === 0) return null;
            const open = columnTasks.filter((task) => task.status !== "Concluído").length;
            const ink = accentInk(column.color);
            return (
              <section key={column.title} aria-label={`Caderno ${column.title}`} className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
                <header className="flex items-center gap-3 px-5 pb-3.5 pt-4" style={{ borderTop: `4px solid ${column.color}` }}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: withAlpha(column.color, "18"), color: ink }}><ColumnIcon className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-black uppercase tracking-[0.06em] text-ebot-dark">{column.title}</h2>
                    <p className="truncate text-[12px] font-semibold text-ebot-muted">{column.subtitle}</p>
                  </div>
                  <span className="shrink-0 rounded-full px-3 py-1 text-[12px] font-black tabular-nums" style={{ backgroundColor: withAlpha(column.color, "18"), color: ink }}>{open} em aberto</span>
                </header>
                <div
                  className="border-t border-ebot-border/[0.10] px-2 pb-2"
                  onDragOver={(event) => { event.preventDefault(); setDropTarget(column.ids[0]); }}
                  onDragLeave={() => setDropTarget(null)}
                  onDrop={(event) => { event.preventDefault(); handleDrop(column.ids[0]); }}
                >
                  {columnTasks.map((task) => <TaskCard key={task.id} task={task} variant="notebook" {...cardProps} />)}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-extrabold text-ebot-dark">Agenda de tarefas</h2><span className="text-xs font-bold text-ebot-muted">{filtered.length} itens</span></div>
          <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 px-2 pb-2 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
            {[...filtered].sort((a, b) => a.due.localeCompare(b.due)).map((task) => <TaskCard key={task.id} task={task} variant="notebook" {...cardProps} />)}
          </div>
        </div>
      )}

      <Modal open={createOpen} onClose={closeTaskModal} title={editingTask ? "Editar tarefa" : "Nova tarefa"} eyebrow="Organização da operação" description={editingTask ? `Atualize os dados de ${editingTask.title}.` : "Registre o contexto, responsável e prazo para a tarefa entrar no fluxo certo."} icon={editingTask ? Pencil : ListTodo} className="max-w-2xl">
        <form key={editingTask?.id ?? "new-task"} onSubmit={saveTask} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="title" label="Título da tarefa" icon={ListTodo} placeholder="Ex.: Revisar protocolo de retorno" defaultValue={editingTask?.title} required className="sm:col-span-2" />
            <ModalSelect name="tag" label="Etiqueta (tags do Kanban)" icon={ClipboardCheck} defaultValue={editingTask?.tag ?? kanbanTags[0]?.name ?? ""}>{Array.from(new Set([...kanbanTags.map((tag) => tag.name), ...(editingTask?.tag ? [editingTask.tag] : [])])).map((item) => <option key={item} value={item}>{item}</option>)}</ModalSelect>
            <ModalField name="client" label="Cliente (opcional)" icon={UserRound} placeholder="Ex.: Amanda Souza" defaultValue={editingTask?.client} />
            <ModalTextarea name="description" label="Contexto e descrição" icon={ClipboardCheck} placeholder="O que precisa ser feito e qual o resultado esperado?" defaultValue={editingTask?.description} required className="sm:col-span-2" />
            <ModalSelect name="responsible" label="Responsável" icon={UserRound} defaultValue={editingTask?.responsible ?? "Marina Costa"}>{Array.from(new Set(["Marina Costa", ...responsibles, ...(editingTask ? [editingTask.responsible] : [])])).map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            <ModalSelect name="sector" label="Setor" icon={Grid2X2} defaultValue={editingTask?.sector ?? "Operação"}>{Array.from(new Set(["Operação", ...sectors, ...(editingTask ? [editingTask.sector] : [])])).map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            <ModalSelect name="priority" label="Prioridade" icon={CheckCircle2} defaultValue={editingTask?.priority ?? "Média"}><option>Alta</option><option>Média</option><option>Baixa</option></ModalSelect>
            <ModalSelect name="status" label="Status" icon={ListTodo} defaultValue={editingTask?.status ?? "Novo"}>{statuses.map((status) => <option key={status}>{status}</option>)}</ModalSelect>
            <ModalField name="due" label="Prazo" icon={CalendarClock} placeholder="Ex.: Hoje, 24 jul" defaultValue={editingTask?.due} required />
          </div>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4"><Button type="button" variant="ghost" onClick={closeTaskModal}>Cancelar</Button><Button type="submit"><Check className="size-4" />{editingTask ? "Salvar alterações" : "Criar tarefa"}</Button></div>
        </form>
      </Modal>

      <ConfirmationDialog open={Boolean(taskToDelete)} onClose={() => setTaskToDelete(null)} onConfirm={confirmDelete} title="Excluir tarefa?" description={`A tarefa "${taskToDelete?.title ?? ""}" será removida da lista local. Você poderá desfazer a ação pelo aviso da tela.`} confirmLabel="Excluir tarefa" />
    </div>
  );
}
