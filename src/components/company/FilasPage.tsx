"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Hash,
  LayoutGrid,
  List,
  ListOrdered,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Power,
  Save,
  Timer,
  Trash2,
  UsersRound,
  X
} from "lucide-react";
import { defaultQueueSchedule, type Queue, type QueueOption, type QueueScheduleSlot, type Sector } from "@/lib/company/types";
import { deleteQueue, listQueues, listSectors, listTypebotIntegrations, newCompanyId, saveQueue } from "@/lib/company/companyService";
import { listPrompts } from "@/lib/automation/n8nService";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ColorField } from "@/components/ui/ColorField";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { SearchField, PageHeader } from "@/components/ui/Week1Primitives";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { cn } from "@/lib/cn";

type Priority = Queue["priority"];
type Draft = Queue & { waitMinutes: number };

const priorityMeta: Record<Priority, { label: string; chip: string }> = {
  alta: { label: "Prioridade alta", chip: "bg-ebot-red/10 text-ebot-red" },
  media: { label: "Prioridade média", chip: "bg-ebot-orange/[0.12] text-ebot-orange" },
  normal: { label: "Normal", chip: "bg-ebot-teal/[0.10] text-ebot-teal" }
};

const legacyIntegrations = ["WhatsApp — Filial Centro", "WhatsApp — Filial Norte", "Instagram Direct", "API do ERP"];

function newOptionId() {
  return `qopt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function toDraft(queue?: Partial<Queue> & { sector?: Sector }): Draft {
  const sector = queue?.sector;
  return {
    id: queue?.id ?? "",
    name: queue?.name ?? "",
    color: queue?.color ?? sector?.color ?? "#6B942E",
    sectorId: queue?.sectorId ?? sector?.id ?? "",
    sectorName: queue?.sectorName ?? sector?.name ?? "",
    botOrder: queue?.botOrder ?? 1,
    greeting: queue?.greeting ?? "",
    maxWaitSeconds: queue?.maxWaitSeconds ?? 300,
    priority: queue?.priority ?? "normal",
    activeAgents: queue?.activeAgents ?? 0,
    totalAgents: queue?.totalAgents ?? 1,
    active: queue?.active ?? true,
    botTransfers: queue?.botTransfers ?? true,
    integration: queue?.integration ?? legacyIntegrations[0],
    prompt: queue?.prompt ?? "",
    outOfHoursMessage: queue?.outOfHoursMessage ?? "",
    options: queue?.options ? queue.options.map((option) => ({ ...option })) : [],
    schedule: queue?.schedule ? queue.schedule.map((slot) => ({ ...slot })) : defaultQueueSchedule(),
    waitMinutes: Math.round((queue?.maxWaitSeconds ?? 300) / 60)
  };
}

const emptyOption = (): QueueOption => ({ id: newOptionId(), order: 1, label: "", target: "", response: "" });

export function FilasPage() {
  const { toast } = useDemo();
  const [queues, setQueues] = useState<Queue[]>(() => listQueues());
  const [sectors] = useState<Sector[]>(() => listSectors());
  const [typebots] = useState(() => listTypebotIntegrations());
  const [prompts] = useState(() => listPrompts());
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"lista" | "cards">("lista");
  const [deleting, setDeleting] = useState<Queue | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [sectorPicker, setSectorPicker] = useState(false);

  const integrationOptions = useMemo(
    () => [...typebots.map((item) => `Typebot · ${item.name}`), ...legacyIntegrations],
    [typebots]
  );

  const flat = useMemo(() => {
    return queues.filter((queue) => `${queue.id} ${queue.name} ${queue.greeting}`.toLowerCase().includes(query.toLowerCase()));
  }, [queues, query]);

  const groups = useMemo(() => {
    const bySector = new Map<string, { sector: Sector; items: Queue[] }>();
    sectors.forEach((sector) => bySector.set(sector.id, { sector, items: [] }));
    flat.forEach((queue) => bySector.get(queue.sectorId)?.items.push(queue));
    return [...bySector.values()];
  }, [sectors, flat]);

  function openCreateForSector(sector: Sector) {
    setStep(1);
    setDraft(toDraft({ sector }));
  }

  function openEdit(queue: Queue) {
    setStep(1);
    setDraft(toDraft(queue));
  }

  function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast("Informe o nome da fila.", "warning");
      return;
    }
    if (!draft.sectorId) {
      toast("Selecione o setor da fila.", "warning");
      return;
    }
    const payload: Queue = {
      id: draft.id || newCompanyId("que"),
      name: draft.name.trim(),
      color: draft.color,
      sectorId: draft.sectorId,
      sectorName: draft.sectorName,
      botOrder: draft.botOrder,
      greeting: draft.greeting.trim(),
      maxWaitSeconds: draft.waitMinutes * 60,
      priority: draft.priority,
      activeAgents: draft.activeAgents,
      totalAgents: draft.totalAgents,
      active: draft.active,
      botTransfers: draft.botTransfers,
      integration: draft.integration,
      prompt: draft.prompt,
      outOfHoursMessage: draft.outOfHoursMessage.trim(),
      options: draft.options
        .filter((option) => option.label.trim())
        .map((option, index) => ({ ...option, order: option.order || index + 1, label: option.label.trim(), target: option.target.trim() })),
      schedule: draft.schedule
    };
    saveQueue(payload);
    setQueues(listQueues());
    setDraft(null);
    toast(draft.id ? `Fila "${payload.name}" atualizada.` : `Fila "${payload.name}" adicionada ao setor ${payload.sectorName}.`);
  }

  function updateSchedule(index: number, patch: Partial<QueueScheduleSlot>) {
    if (!draft) return;
    setDraft({ ...draft, schedule: draft.schedule.map((slot, slotIndex) => (slotIndex === index ? { ...slot, ...patch } : slot)) });
  }

  function updateOption(id: string, patch: Partial<QueueOption>) {
    if (!draft) return;
    setDraft({ ...draft, options: draft.options.map((option) => (option.id === id ? { ...option, ...patch } : option)) });
  }

  function removeOption(id: string) {
    if (!draft) return;
    setDraft({ ...draft, options: draft.options.filter((option) => option.id !== id) });
  }

  function toggle(queue: Queue) {
    saveQueue({ ...queue, active: !queue.active });
    setQueues(listQueues());
    toast(queue.active ? `Fila "${queue.name}" pausada.` : `Fila "${queue.name}" ativada.`);
  }

  function remove() {
    if (!deleting) return;
    deleteQueue(deleting.id);
    setQueues(listQueues());
    toast(`Fila "${deleting.name}" excluída.`);
    setDeleting(null);
  }

  function QueueCard({ queue }: { queue: Queue }) {
    return (
      <article data-queue-card data-queue-id={queue.id} className={cn("rounded-[20px] border border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 p-4", !queue.active && "opacity-70")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-lg bg-ebot-surfaceMuted/80 px-2 py-0.5 text-[10px] font-extrabold text-ebot-slate"><ListOrdered className="size-3" />Ordem {queue.botOrder}</span>
              <span className={cn("rounded-lg px-2 py-0.5 text-[10px] font-extrabold", priorityMeta[queue.priority].chip)}>{priorityMeta[queue.priority].label}</span>
              {queue.botTransfers ? <span className="flex items-center gap-1 rounded-lg bg-ebot-primary/[0.08] px-2 py-0.5 text-[10px] font-extrabold text-ebot-primaryText"><Bot className="size-3" />Recebe do bot</span> : null}
              {!queue.active && <span className="rounded-lg bg-ebot-orange/[0.12] px-2 py-0.5 text-[10px] font-extrabold text-ebot-orange">Em pausa</span>}
            </div>
            <h3 className="mt-2 flex items-center gap-2 text-[14px] font-extrabold text-ebot-dark">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: queue.color }} />
              {queue.name}
            </h3>
            <p className="mt-1 flex items-start gap-1.5 text-[12px] font-semibold leading-4 text-ebot-muted">
              <MessageCircle className="mt-0.5 size-3.5 shrink-0" />
              {queue.greeting || "Sem mensagem de saudação."}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1">
            <button onClick={() => openEdit(queue)} title="Editar fila" aria-label={`Editar fila ${queue.name}`} className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-surfaceMuted hover:text-ebot-dark"><Pencil className="size-4" /></button>
            <button onClick={() => setDeleting(queue)} title="Remover fila" aria-label={`Excluir fila ${queue.name}`} className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-red/10 hover:text-ebot-red"><Trash2 className="size-4" /></button>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-xl bg-ebot-surfaceMuted/70 px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate">
            <Timer className="size-3.5" />{Math.round(queue.maxWaitSeconds / 60)} min de espera
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-ebot-surfaceMuted/70 px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate">
            {queue.activeAgents > 0 ? <span className="size-1.5 rounded-full bg-ebot-green" /> : <Loader2 className="size-3.5" />}
            {queue.activeAgents}/{queue.totalAgents} atendentes
          </span>
          <span className="max-w-full truncate rounded-xl bg-ebot-surfaceMuted/70 px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate" title={queue.integration}>
            {queue.integration}
          </span>
          {queue.options.length ? (
            <span className="rounded-xl bg-ebot-surfaceMuted/70 px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate">{queue.options.length} opções</span>
          ) : null}
        </div>

        <Toggle
          className="mt-3"
          checked={queue.active}
          onChange={() => toggle(queue)}
          statusOn="Fila ativa no bot"
          statusOff="Fila em pausa no bot"
          icon={Power}
          accent="amber"
        />
      </article>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Chatbot"
        title="Filas"
        description="Cadastros únicos de filas do bot, adicionados aos setores. Cada fila define cor, ordem no bot, integração, prompts e horários."
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setSectorPicker(true)}><Plus className="size-4" />Adicionar fila</Button>
          </div>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar fila…" /></div>
        <ViewSwitch
          views={[{ id: "lista", label: "Lista", icon: List }, { id: "cards", label: "Cards", icon: LayoutGrid }]}
          value={view}
          onChange={(id) => setView(id as "lista" | "cards")}
          className="self-end sm:self-auto"
        />
        <span className="hidden text-[11px] font-bold text-ebot-muted sm:ml-auto sm:block">{queues.length} filas · {sectors.length} setores</span>
      </div>

      {flat.length === 0 ? (
        <div className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-10 text-center text-sm font-bold text-ebot-muted">Nenhuma fila encontrada.</div>
      ) : view === "cards" ? (
        <div className="space-y-5">
          {groups.map(({ sector, items }) => (
            items.length ? (
              <section key={sector.id} className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="size-3 rounded-md" style={{ backgroundColor: sector.color }} />
                    <h2 className="text-sm font-extrabold text-ebot-dark">{sector.name}</h2>
                    <span className="rounded-xl bg-ebot-surfaceMuted/70 px-2 py-0.5 text-[11px] font-extrabold text-ebot-slate">{items.length} fila{items.length > 1 ? "s" : ""}</span>
                  </div>
                  <button onClick={() => openCreateForSector(sector)} className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[12px] font-extrabold text-ebot-primary transition hover:bg-ebot-primary/[0.08]">
                    <Plus className="size-3.5" />Adicionar nesta fila
                  </button>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {items.map((queue) => <QueueCard key={queue.id} queue={queue} />)}
                </div>
              </section>
            ) : null
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ebot-border/[0.10] text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Cor</th>
                <th className="px-4 py-3">Ordenação (Bot)</th>
                <th className="px-4 py-3">Mensagem de saudação</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ebot-border/[0.08]">
              {flat.map((queue) => (
                <tr key={queue.id} data-queue-row data-queue-id={queue.id} className="transition hover:bg-ebot-primary/[0.035]">
                  <td className="px-4 py-3 font-mono text-[12px] font-bold text-ebot-muted">{queue.id}</td>
                  <td className="px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: queue.color }} />
                      {queue.name}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold text-ebot-muted">{queue.sectorName}</p>
                  </td>
                  <td className="px-4 py-3"><span className="inline-block size-6 rounded-lg border border-ebot-border/[0.14]" style={{ backgroundColor: queue.color }} title={queue.color} /></td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 rounded-lg bg-ebot-surfaceMuted px-2 py-1 text-[11px] font-extrabold text-ebot-slate"><Hash className="size-3" />{queue.botOrder}</span></td>
                  <td className="max-w-[280px] truncate px-4 py-3 text-[13px] font-semibold text-ebot-muted" title={queue.greeting}>{queue.greeting || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={() => openEdit(queue)} title="Editar fila" aria-label={`Editar fila ${queue.name}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-3.5" /></button>
                      <button onClick={() => setDeleting(queue)} title="Remover fila" aria-label={`Excluir fila ${queue.name}`} className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-red/10 hover:text-ebot-red"><Trash2 className="size-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Editar fila" : "Adicionar fila"}
        eyebrow="Sistema / Filas & Chatbot"
        description={draft?.sectorName ? `Setor: ${draft.sectorName}` : "Cadastros únicos de fila, organizados dentro dos setores."}
        icon={ListOrdered}
        className="max-w-2xl"
        footer={
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-ebot-muted">
              <span className={cn("flex size-6 items-center justify-center rounded-full", step === 1 ? "bg-ebot-primary text-ebot-charcoal" : "bg-ebot-primary/15 text-ebot-primaryText")}>1</span>
              <span className={step === 1 ? "text-ebot-dark" : ""}>Dados da fila</span>
              <ChevronRight className="size-3" />
              <span className={cn("flex size-6 items-center justify-center rounded-full", step === 2 ? "bg-ebot-primary text-ebot-charcoal" : "bg-ebot-primary/15 text-ebot-primaryText")}>2</span>
              <span className={step === 2 ? "text-ebot-dark" : ""}>Horários</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDraft(null)}>Cancelar</Button>
              {step === 2 ? <Button variant="secondary" onClick={() => setStep(1)}><ChevronLeft className="size-4" />Voltar</Button> : null}
              {step === 1
                ? <Button onClick={() => setStep(2)}>Continuar<ChevronRight className="size-4" /></Button>
                : <Button onClick={save}><Save className="size-4" />Salvar fila</Button>}
            </div>
          </div>
        }
      >
        {draft && (
          <div>
            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Nome</span>
                    <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Pós-vendas" className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Ordem da fila (bot)</span>
                    <input type="number" min={1} max={9} value={draft.botOrder} onChange={(event) => setDraft({ ...draft, botOrder: Math.max(1, Number(event.target.value)) })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Espera máxima (min)</span>
                    <input type="number" min={1} max={60} value={draft.waitMinutes} onChange={(event) => setDraft({ ...draft, waitMinutes: Math.max(1, Number(event.target.value)) })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Setor</span>
                    <select value={draft.sectorId} onChange={(event) => {
                      const sector = sectors.find((item) => item.id === event.target.value);
                      setDraft({ ...draft, sectorId: event.target.value, sectorName: sector?.name ?? "" });
                    }} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10">
                      <option value="">Selecione…</option>
                      {sectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Prioridade</span>
                    <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as Priority })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10">
                      <option value="normal">Normal</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Integração</span>
                    <select value={draft.integration} onChange={(event) => setDraft({ ...draft, integration: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10">
                      {integrationOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Prompt (OpenAI)</span>
                    <select value={draft.prompt} onChange={(event) => setDraft({ ...draft, prompt: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10">
                      <option value="">Nenhum</option>
                      {prompts.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                    </select>
                  </label>
                  <div className="flex items-end gap-2">
                    <span className="flex h-11 flex-1 items-center gap-1.5 rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-[13px] font-bold text-ebot-muted"><UsersRound className="size-4" />{draft.activeAgents}/{draft.totalAgents} atendentes</span>
                  </div>
                </div>

                <ColorField label="Cor da fila" value={draft.color} onChange={(color) => setDraft({ ...draft, color })} />

                <Toggle
                  checked={draft.botTransfers}
                  onChange={(checked) => setDraft({ ...draft, botTransfers: checked })}
                  label="Receber transferências do bot"
                  hint="Quando ativo, o bot pode transferir conversas para esta fila."
                  icon={Bot}
                />

                <label className="block">
                  <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Mensagem de saudação</span>
                  <textarea rows={2} value={draft.greeting} onChange={(event) => setDraft({ ...draft, greeting: event.target.value })} placeholder="Mensagem exibida quando o cliente entra na fila…" className="w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 py-2.5 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Mensagem de fora de expediente</span>
                  <textarea rows={2} value={draft.outOfHoursMessage} onChange={(event) => setDraft({ ...draft, outOfHoursMessage: event.target.value })} placeholder="Mensagem enviada fora dos horários configurados…" className="w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 py-2.5 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10" />
                </label>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-extrabold text-ebot-dark">Opções da fila</p>
                    <Button type="button" size="sm" variant="secondary" onClick={() => setDraft({ ...draft, options: [...draft.options, { ...emptyOption(), order: draft.options.length + 1 }] })}>
                      <Plus className="size-3.5" />Adicionar opção
                    </Button>
                  </div>
                  {draft.options.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-ebot-border/[0.18] p-4 text-center text-[13px] font-semibold text-ebot-muted">Nenhuma opção. Adicione as alternativas apresentadas pelo bot nesta fila.</p>
                  ) : (
                    <ul className="space-y-2">
                      {draft.options.map((option) => (
                        <li key={option.id} className="grid gap-2 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/25 p-2.5 sm:grid-cols-[64px_1fr_1fr_auto]">
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Ordem</span>
                            <input type="number" min={1} value={option.order} onChange={(event) => updateOption(option.id, { order: Math.max(1, Number(event.target.value)) })} className="h-10 w-full rounded-xl border border-ebot-border/[0.14] bg-ebot-surface px-2 text-[13px] font-bold text-ebot-dark outline-none" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Opção</span>
                            <input value={option.label} onChange={(event) => updateOption(option.id, { label: event.target.value })} placeholder="Ex.: Agendar agendamento" className="h-10 w-full rounded-xl border border-ebot-border/[0.14] bg-ebot-surface px-2 text-[13px] font-semibold text-ebot-dark outline-none" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Destino</span>
                            <input value={option.target} onChange={(event) => updateOption(option.id, { target: event.target.value })} placeholder="Ex.: Fila Pedidos" className="h-10 w-full rounded-xl border border-ebot-border/[0.14] bg-ebot-surface px-2 text-[13px] font-semibold text-ebot-dark outline-none" />
                          </label>
                          <button type="button" onClick={() => removeOption(option.id)} aria-label="Remover opção" title="Remover opção" className="flex size-10 items-center justify-center self-end rounded-xl text-ebot-muted transition hover:bg-ebot-red/10 hover:text-ebot-red"><Trash2 className="size-4" /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ebot-muted"><CalendarClock className="size-4 text-ebot-primary" />Etapa 2 — selecione o horário de atendimento em cada dia (início e fim).</p>
                {draft.schedule.map((slot, index) => (
                  <div key={slot.day} className={cn("flex flex-wrap items-center gap-2 rounded-2xl border p-2.5", slot.enabled ? "border-ebot-border/[0.12] bg-ebot-surfaceMuted/25" : "border-dashed border-ebot-border/[0.16] bg-ebot-surfaceMuted/10")}>
                    <button type="button" role="switch" aria-checked={slot.enabled} onClick={() => updateSchedule(index, { enabled: !slot.enabled })} className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", slot.enabled ? "bg-ebot-green" : "bg-ebot-surfaceMuted")} aria-label={`${slot.enabled ? "Desativar" : "Atender"} ${slot.day}`}>
                      <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-all", slot.enabled ? "left-[18px]" : "left-0.5")} />
                    </button>
                    <span className="w-20 shrink-0 text-[13px] font-extrabold text-ebot-dark">{slot.day}</span>
                    <span className="ml-auto flex items-center gap-1.5">
                      <input type="time" value={slot.start} disabled={!slot.enabled} onChange={(event) => updateSchedule(index, { start: event.target.value })} aria-label={`Início em ${slot.day}`} className="h-9 rounded-xl border border-ebot-border/[0.14] bg-ebot-surface px-2 text-[13px] font-semibold text-ebot-dark outline-none disabled:opacity-45" />
                      <ChevronRight className="size-3 text-ebot-muted" aria-hidden="true" />
                      <input type="time" value={slot.end} disabled={!slot.enabled} onChange={(event) => updateSchedule(index, { end: event.target.value })} aria-label={`Fim em ${slot.day}`} className="h-9 rounded-xl border border-ebot-border/[0.14] bg-ebot-surface px-2 text-[13px] font-semibold text-ebot-dark outline-none disabled:opacity-45" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={sectorPicker}
        onClose={() => setSectorPicker(false)}
        title="Adicionar fila"
        eyebrow="Sistema / Filas & Chatbot"
        description="Escolha o setor em que a nova fila será criada."
        icon={Plus}
        className="max-w-lg"
      >
        <div className="space-y-2">
          {sectors.map((sector) => {
            const count = queues.filter((queue) => queue.sectorId === sector.id).length;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => { setSectorPicker(false); openCreateForSector(sector); }}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 p-3 text-left transition hover:border-ebot-primary/25 hover:bg-ebot-primary/[0.05]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="size-4 shrink-0 rounded-md" style={{ backgroundColor: sector.color }} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-ebot-dark">{sector.name}</span>
                    <span className="block truncate text-[11px] font-bold text-ebot-muted">{sector.description}</span>
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-ebot-muted">{count} fila{count === 1 ? "" : "s"}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end border-t border-ebot-border/[0.12] pt-4">
          <Button variant="ghost" onClick={() => setSectorPicker(false)}><X className="size-4" />Fechar</Button>
        </div>
      </Modal>

      <ConfirmationDialog
        open={deleting !== null}
        title={`Excluir fila "${deleting?.name ?? ""}"?`}
        description="A exclusão remove a fila do roteamento do bot imediatamente. Conversas em andamento seguem com a equipe."
        confirmLabel="Excluir fila"
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
