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
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { FilterSelect, PageHeader, SearchField, StatePanel, StatusBadge } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const CACHE_KEY = "ebot-week2-kanban-tasks";
const ALL = "Todos";
const statuses: TaskStatus[] = ["Novo", "Em atendimento", "Aguardando", "Agendado", "Em acompanhamento", "Concluído"];

const columns: { ids: TaskStatus[]; title: string; icon: typeof ListTodo; tone: "blue" | "orange" | "green" }[] = [
  { ids: ["Novo"], title: "Novas", icon: CircleDashed, tone: "orange" },
  { ids: ["Em atendimento", "Aguardando", "Agendado"], title: "Em execução", icon: ListTodo, tone: "blue" },
  { ids: ["Em acompanhamento"], title: "Acompanhamento", icon: CircleDot, tone: "blue" },
  { ids: ["Concluído"], title: "Encerradas", icon: CheckCircle2, tone: "green" }
];

type ViewMode = "board" | "list" | "agenda";
type PendingUndo = { tasks: Task[]; label: string };

function nextTaskId(tasks: Task[]) {
  const numbers = tasks
    .map((task) => Number(task.id.replace("TK-", "")))
    .filter((value) => Number.isFinite(value));
  return `TK-${String(Math.max(-1, ...numbers) + 1).padStart(2, "0")}`;
}

function taskStatusTone(status: TaskStatus): "blue" | "green" | "orange" | "neutral" {
  if (status === "Concluído") return "green";
  if (status === "Novo") return "orange";
  if (status === "Em acompanhamento") return "blue";
  return "neutral";
}

function TaskCard({
  task,
  onMove,
  onDragStart,
  onDragEnd,
  onEdit,
  onToggleComplete,
  onDelete
}: {
  task: Task;
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

  return (
    <article
      draggable
      tabIndex={0}
      onDragStart={(event) => onDragStart(event, task)}
      onDragEnd={onDragEnd}
      onKeyDown={handleKeyDown}
      aria-label={`Tarefa ${task.title}, status ${task.status}`}
      className="group rounded-2xl border border-clinical-border/[0.12] bg-clinical-surface/90 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-clinical-blue/25 focus:outline-none focus:ring-2 focus:ring-clinical-blue/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <StatusBadge label={task.priority} tone={task.priority === "Alta" ? "red" : task.priority === "Média" ? "orange" : "neutral"} />
          <StatusBadge label={task.status} tone={taskStatusTone(task.status)} />
        </div>
        <span className="shrink-0 text-[11px] font-bold text-clinical-muted">{task.id}</span>
      </div>
      <h3 className="mt-3 text-sm font-extrabold leading-5 text-clinical-dark">{task.title}</h3>
      <p className="mt-1.5 text-xs leading-5 text-clinical-muted">{task.description}</p>
      {task.patient ? <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-clinical-blueText"><UserRound className="size-3.5" />{task.patient}</p> : null}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-clinical-blue/[0.08] px-2 py-1 text-[11px] font-bold text-clinical-blueText"><UserRound className="size-3" />{task.responsible}</span>
        <span className="rounded-full bg-clinical-surfaceMuted px-2 py-1 text-[11px] font-bold text-clinical-muted">{task.sector}</span>
        {task.tag ? <span className="rounded-full bg-clinical-green/[0.09] px-2 py-1 text-[11px] font-bold text-clinical-green">#{task.tag}</span> : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-clinical-border/[0.10] pt-3">
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold text-clinical-muted"><CalendarClock className="size-3.5 shrink-0" />{task.due}</span>
        <select aria-label={`Mover ${task.title}`} value={task.status} onChange={(event) => onMove(task.id, event.target.value as TaskStatus)} className="max-w-[55%] rounded-lg border-0 bg-transparent text-right text-[11px] font-extrabold text-clinical-blueText outline-none">
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap justify-end gap-1.5">
        <Button type="button" size="sm" variant="ghost" onClick={() => onEdit(task)} aria-label={`Editar ${task.title}`}><Pencil className="size-3.5" /><span className="hidden sm:inline">Editar</span></Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => onToggleComplete(task)} aria-label={task.status === "Concluído" ? `Reabrir ${task.title}` : `Concluir ${task.title}`}>
          <CheckCircle2 className="size-3.5" />{task.status === "Concluído" ? "Reabrir" : "Concluir"}
        </Button>
        <button type="button" onClick={() => onDelete(task)} aria-label={`Excluir ${task.title}`} className="flex size-8 items-center justify-center rounded-xl text-clinical-muted transition hover:bg-red-500/10 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"><Trash2 className="size-3.5" /></button>
      </div>
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

  useEffect(() => setTasks(readLocalCache(CACHE_KEY, initialTasks)), []);
  useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  }, []);

  const sectors = Array.from(new Set(tasks.map((task) => task.sector)));
  const responsibles = Array.from(new Set(tasks.map((task) => task.responsible)));
  const filtered = useMemo(() => tasks.filter((task) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch = !normalizedSearch || `${task.title} ${task.description} ${task.patient ?? ""} ${task.responsible} ${task.sector} ${task.tag}`.toLowerCase().includes(normalizedSearch);
    return matchesSearch
      && (statusFilter === ALL || task.status === statusFilter)
      && (priorityFilter === ALL || task.priority === priorityFilter)
      && (sectorFilter === ALL || task.sector === sectorFilter)
      && (responsibleFilter === ALL || task.responsible === responsibleFilter);
  }), [priorityFilter, responsibleFilter, search, sectorFilter, statusFilter, tasks]);
  function persist(next: Task[]) {
    setTasks(next);
    writeLocalCache(CACHE_KEY, next);
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
    preview.style.cssText = "position:fixed;top:-1000px;left:-1000px;width:260px;padding:14px 16px;border-radius:16px;background:#263532;color:#fff;font:700 13px Inter, sans-serif;box-shadow:0 20px 45px rgba(38,53,50,.28);";
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
    const patient = String(form.get("patient") ?? "").trim();
    const taskFields = {
      title,
      description: String(form.get("description") ?? "").trim(),
      patient: patient || undefined,
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
        description="Dê visibilidade ao trabalho que mantém a operação clínica em movimento."
        action={<Button onClick={openCreate}><Plus className="size-4" />Nova tarefa</Button>}
      />

      <div className="mb-5 flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <SearchField value={search} onChange={setSearch} placeholder="Buscar tarefa, responsável, setor ou etiqueta" />
          <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-clinical-surfaceMuted/55 p-1">
            <button type="button" onClick={() => setView("board")} aria-label="Ver tarefas em quadro" aria-pressed={view === "board"} className={cn("flex size-9 items-center justify-center rounded-xl transition", view === "board" ? "bg-clinical-surface text-clinical-blue shadow-sm" : "text-clinical-muted hover:text-clinical-blue")}><Grid2X2 className="size-4" /></button>
            <button type="button" onClick={() => setView("list")} aria-label="Ver tarefas em lista" aria-pressed={view === "list"} className={cn("flex size-9 items-center justify-center rounded-xl transition", view === "list" ? "bg-clinical-surface text-clinical-blue shadow-sm" : "text-clinical-muted hover:text-clinical-blue")}><List className="size-4" /></button>
            <button type="button" onClick={() => setView("agenda")} aria-label="Ver tarefas em agenda" aria-pressed={view === "agenda"} className={cn("flex size-9 items-center justify-center rounded-xl transition", view === "agenda" ? "bg-clinical-surface text-clinical-blue shadow-sm" : "text-clinical-muted hover:text-clinical-blue")}><CalendarClock className="size-4" /></button>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[ALL, ...statuses]} />
          <FilterSelect label="Prioridade" value={priorityFilter} onChange={setPriorityFilter} options={[ALL, "Alta", "Média", "Baixa"]} />
          <FilterSelect label="Setor" value={sectorFilter} onChange={setSectorFilter} options={[ALL, ...sectors]} />
          <FilterSelect label="Responsável" value={responsibleFilter} onChange={setResponsibleFilter} options={[ALL, ...responsibles]} />
        </div>
      </div>

      {notice ? <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green"><span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>{undo ? <Button size="sm" variant="secondary" onClick={undoLastAction}><Undo2 className="size-3.5" />{undo.label}</Button> : null}</div> : null}
      <p id="todo-keyboard-help" className="sr-only">Foque uma tarefa e use Alt mais seta para a esquerda ou direita para movê-la entre os status.</p>

      {filtered.length === 0 ? (
        <StatePanel
          icon={tasks.length ? SearchX : ListTodo}
          title={tasks.length ? "Nenhuma tarefa encontrada" : "Ainda não há tarefas"}
          description={tasks.length ? "Ajuste os filtros ou tente outro termo de busca." : "Crie a primeira tarefa para organizar o próximo movimento da equipe."}
          action={<Button size="sm" variant="secondary" onClick={tasks.length ? clearFilters : openCreate}>{tasks.length ? "Limpar filtros" : "Criar tarefa"}</Button>}
        />
      ) : view === "board" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const ColumnIcon = column.icon;
            const columnTasks = filtered.filter((task) => column.ids.includes(task.status));
            return (
              <section
                key={column.title}
                onDragOver={(event) => { event.preventDefault(); setDropTarget(column.ids[0]); }}
                onDragLeave={() => setDropTarget(null)}
                onDrop={(event) => { event.preventDefault(); handleDrop(column.ids[0]); }}
                aria-label={`Coluna ${column.title}`}
                className={cn("flex min-h-[460px] flex-col rounded-[24px] border p-3 transition duration-200", dropTarget && column.ids.includes(dropTarget) ? "border-clinical-blue/55 bg-clinical-blue/[0.10] shadow-glow" : "border-clinical-border/[0.14] bg-clinical-surface/65")}
              >
                <div className="mb-3 flex items-start justify-between gap-2 px-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("flex size-8 items-center justify-center rounded-xl", column.tone === "orange" ? "bg-clinical-orange/10 text-clinical-orange" : column.tone === "green" ? "bg-clinical-green/10 text-clinical-green" : "bg-clinical-blue/10 text-clinical-blue")}><ColumnIcon className="size-4" /></span>
                    <div><h2 className="text-sm font-extrabold text-clinical-dark">{column.title}</h2><p className="text-[11px] font-semibold text-clinical-muted">{column.ids.join(" · ")}</p></div>
                  </div>
                  <span className="rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-black tabular-nums text-clinical-muted">{columnTasks.length}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  {columnTasks.map((task) => <TaskCard key={task.id} task={task} {...cardProps} />)}
                  {columnTasks.length === 0 ? <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-clinical-border/[0.18] p-6 text-center text-xs font-semibold text-clinical-muted">Arraste uma tarefa para esta etapa</div> : null}
                </div>
              </section>
            );
          })}
        </div>
      ) : view === "list" ? (
        <div className="grid gap-3">{filtered.map((task) => <TaskCard key={task.id} task={task} {...cardProps} />)}</div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-extrabold text-clinical-dark">Agenda de tarefas</h2><span className="text-xs font-bold text-clinical-muted">{filtered.length} itens</span></div>
          {[...filtered].sort((a, b) => a.due.localeCompare(b.due)).map((task) => <TaskCard key={task.id} task={task} {...cardProps} />)}
        </div>
      )}

      <Modal open={createOpen} onClose={closeTaskModal} title={editingTask ? "Editar tarefa" : "Nova tarefa"} eyebrow="Organização da operação" description={editingTask ? `Atualize os dados de ${editingTask.title}.` : "Registre o contexto, responsável e prazo para a tarefa entrar no fluxo certo."} icon={editingTask ? Pencil : ListTodo} className="max-w-2xl">
        <form key={editingTask?.id ?? "new-task"} onSubmit={saveTask} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="title" label="Título da tarefa" icon={ListTodo} placeholder="Ex.: Revisar protocolo de retorno" defaultValue={editingTask?.title} required className="sm:col-span-2" />
            <ModalField name="tag" label="Etiqueta" icon={ClipboardCheck} placeholder="Ex.: Paciente, Qualidade" defaultValue={editingTask?.tag} required />
            <ModalField name="patient" label="Paciente (opcional)" icon={UserRound} placeholder="Ex.: Amanda Souza" defaultValue={editingTask?.patient} />
            <ModalTextarea name="description" label="Contexto e descrição" icon={ClipboardCheck} placeholder="O que precisa ser feito e qual o resultado esperado?" defaultValue={editingTask?.description} required className="sm:col-span-2" />
            <ModalSelect name="responsible" label="Responsável" icon={UserRound} defaultValue={editingTask?.responsible ?? "Marina Costa"}>{Array.from(new Set(["Marina Costa", ...responsibles, ...(editingTask ? [editingTask.responsible] : [])])).map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            <ModalSelect name="sector" label="Setor" icon={Grid2X2} defaultValue={editingTask?.sector ?? "Operação"}>{Array.from(new Set(["Operação", ...sectors, ...(editingTask ? [editingTask.sector] : [])])).map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            <ModalSelect name="priority" label="Prioridade" icon={CheckCircle2} defaultValue={editingTask?.priority ?? "Média"}><option>Alta</option><option>Média</option><option>Baixa</option></ModalSelect>
            <ModalSelect name="status" label="Status" icon={ListTodo} defaultValue={editingTask?.status ?? "Novo"}>{statuses.map((status) => <option key={status}>{status}</option>)}</ModalSelect>
            <ModalField name="due" label="Prazo" icon={CalendarClock} placeholder="Ex.: Hoje, 24 jul" defaultValue={editingTask?.due} required />
          </div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4"><Button type="button" variant="ghost" onClick={closeTaskModal}>Cancelar</Button><Button type="submit"><Check className="size-4" />{editingTask ? "Salvar alterações" : "Criar tarefa"}</Button></div>
        </form>
      </Modal>

      <ConfirmationDialog open={Boolean(taskToDelete)} onClose={() => setTaskToDelete(null)} onConfirm={confirmDelete} title="Excluir tarefa?" description={`A tarefa "${taskToDelete?.title ?? ""}" será removida da lista local. Você poderá desfazer a ação pelo aviso da tela.`} confirmLabel="Excluir tarefa" />
    </div>
  );
}
