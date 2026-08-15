"use client";

import { useMemo, useState } from "react";
import { Loader2, ListOrdered, MessageCircle, Pencil, Plus, Power, Timer, Trash2, UsersRound } from "lucide-react";
import { deleteQueue, listQueues, listSectors, newCompanyId, saveQueue } from "@/lib/company/companyService";
import type { Queue, Sector } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { SearchField, PageHeader } from "@/components/ui/Week1Primitives";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { cn } from "@/lib/cn";

type Priority = Queue["priority"];

const priorityMeta: Record<Priority, { label: string; chip: string }> = {
  alta: { label: "Prioridade alta", chip: "bg-clinical-red/10 text-clinical-red" },
  media: { label: "Prioridade média", chip: "bg-clinical-orange/[0.12] text-clinical-orange" },
  normal: { label: "Normal", chip: "bg-clinical-teal/[0.10] text-clinical-teal" }
};

function blankQueue(sector?: Sector): Queue {
  return {
    id: "",
    name: "",
    color: sector?.color ?? "#3A9DCA",
    sectorId: sector?.id ?? "",
    sectorName: sector?.name ?? "",
    botOrder: 1,
    greeting: "",
    maxWaitSeconds: 300,
    priority: "normal",
    activeAgents: 0,
    totalAgents: 1,
    active: true
  };
}

export function FilasPage() {
  const { toast } = useDemo();
  const [queues, setQueues] = useState<Queue[]>(() => listQueues());
  const [sectors] = useState<Sector[]>(() => listSectors());
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<Queue | null>(null);
  const [draft, setDraft] = useState<Queue | null>(null);

  const groups = useMemo(() => {
    const bySector = new Map<string, { sector: Sector; items: Queue[] }>();
    sectors.forEach((sector) => bySector.set(sector.id, { sector, items: [] }));
    queues.forEach((queue) => {
      const group = bySector.get(queue.sectorId);
      if (!group) return;
      const matches = `${queue.name} ${queue.greeting}`.toLowerCase().includes(query.toLowerCase());
      if (matches) group.items.push(queue);
    });
    return [...bySector.values()].filter((group) => group.items.length > 0);
  }, [queues, sectors, query]);

  const stats: StatItem[] = useMemo(() => {
    const active = queues.filter((queue) => queue.active);
    return [
      { id: "queues", label: "Filas", value: String(queues.length), hint: `${active.length} ativas`, tone: "blue", icon: ListOrdered },
      { id: "agents", label: "Atendentes ativos", value: String(queues.reduce((total, queue) => total + queue.activeAgents, 0)), hint: "no momento", tone: "green", icon: UsersRound },
      { id: "wait", label: "Espera média", value: "6 min", hint: "filas principais", tone: "orange", icon: Timer }
    ];
  }, [queues]);

  function openSector(sectorId: string) {
    const sector = sectors.find((item) => item.id === sectorId);
    setDraft(blankQueue(sector));
  }

  function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast("Informe o nome da fila.", "warning");
      return;
    }
    if (!draft.sectorId) {
      toast("Selecione o setor.", "warning");
      return;
    }
    if (draft.id) {
      saveQueue({ ...draft });
      toast(`Fila "${draft.name}" atualizada.`);
    } else {
      saveQueue({ ...draft, id: newCompanyId("que") });
      toast(`Fila "${draft.name}" criada.`);
    }
    setQueues(listQueues());
    setDraft(null);
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

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Clínica / Atendimento"
        title="Filas"
        description="Roteamento do bot: cada fila define a saudação, a prioridade e o tempo máximo de espera antes do handoff."
        action={<Button onClick={() => setDraft(blankQueue())}><Plus className="size-4" />Nova fila</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex items-center justify-between gap-3">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar fila…" />
        <span className="text-[11px] font-bold text-clinical-muted">Quadro de atendimento em tempo real</span>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-10 text-center text-sm font-bold text-clinical-muted">Nenhuma fila encontrada.</div>
      ) : (
        <div className="space-y-5">
          {groups.map(({ sector, items }) => (
            <section key={sector.id} className="rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-md" style={{ backgroundColor: sector.color }} />
                  <h2 className="text-sm font-extrabold text-clinical-dark">{sector.name}</h2>
                  <span className="rounded-xl bg-clinical-surfaceMuted/70 px-2 py-0.5 text-[11px] font-extrabold text-clinical-slate">{items.length} fila{items.length > 1 ? "s" : ""}</span>
                </div>
                <button onClick={() => openSector(sector.id)} className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[12px] font-extrabold text-clinical-blue transition hover:bg-clinical-blue/[0.08]" title={`Adicionar fila em ${sector.name}`}>
                  <Plus className="size-3.5" />Adicionar nesta fila
                </button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {items.map((queue) => (
                  <article key={queue.id} className={cn("rounded-[20px] border border-clinical-border/[0.12] bg-clinical-surfaceMuted/30 p-4", !queue.active && "opacity-70")}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded-lg bg-clinical-surfaceMuted/80 px-2 py-0.5 text-[10px] font-extrabold text-clinical-slate"><ListOrdered className="size-3" />Ordem {queue.botOrder}</span>
                          <span className={cn("rounded-lg px-2 py-0.5 text-[10px] font-extrabold", priorityMeta[queue.priority].chip)}>{priorityMeta[queue.priority].label}</span>
                          {!queue.active && <span className="rounded-lg bg-clinical-orange/[0.12] px-2 py-0.5 text-[10px] font-extrabold text-clinical-orange">Em pausa</span>}
                        </div>
                        <h3 className="mt-2 text-[14px] font-extrabold text-clinical-dark">{queue.name}</h3>
                        <p className="mt-1 flex items-start gap-1.5 text-[12px] font-semibold leading-4 text-clinical-muted">
                          <MessageCircle className="mt-0.5 size-3.5 shrink-0" style={{ color: queue.color }} />
                          {queue.greeting}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1">
                        <button onClick={() => setDraft({ ...queue })} title="Editar fila" className="rounded-xl p-2 text-clinical-muted transition hover:bg-clinical-surfaceMuted hover:text-clinical-dark"><Pencil className="size-4" /></button>
                        <button onClick={() => setDeleting(queue)} title="Excluir fila" className="rounded-xl p-2 text-clinical-muted transition hover:bg-clinical-red/10 hover:text-clinical-red"><Trash2 className="size-4" /></button>
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-xl bg-clinical-surfaceMuted/70 px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate">
                        <Timer className="size-3.5" />{Math.round(queue.maxWaitSeconds / 60)} min de espera
                      </span>
                      <span className="flex items-center gap-1.5 rounded-xl bg-clinical-surfaceMuted/70 px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate">
                        {queue.activeAgents > 0 ? <span className="size-1.5 rounded-full bg-clinical-green" /> : <Loader2 className="size-3.5" />}
                        {queue.activeAgents}/{queue.totalAgents} atendentes
                      </span>
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
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal open={draft !== null} onClose={() => setDraft(null)} title={draft?.id ? "Editar fila" : "Nova fila"}>
        {draft && (
          <div className="space-y-4">
            <div>
              <label htmlFor="que-name" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Nome da fila</label>
              <input id="que-name" autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Cardiologia — consultas" className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="que-sector" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Setor</label>
                <select id="que-sector" value={draft.sectorId} onChange={(event) => {
                  const sector = sectors.find((item) => item.id === event.target.value);
                  setDraft({ ...draft, sectorId: event.target.value, sectorName: sector?.name ?? "", color: sector?.color ?? draft.color });
                }} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                  <option value="">Selecione…</option>
                  {sectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="que-order" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Ordem no bot</label>
                <input id="que-order" type="number" min={1} max={9} value={draft.botOrder} onChange={(event) => setDraft({ ...draft, botOrder: Number(event.target.value) })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
              </div>
              <div>
                <label htmlFor="que-priority" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Prioridade</label>
                <select id="que-priority" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as Priority })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                  <option value="normal">Normal</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div>
                <label htmlFor="que-wait" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Espera máxima (min)</label>
                <input id="que-wait" type="number" min={1} max={60} step={1} value={Math.round(draft.maxWaitSeconds / 60)} onChange={(event) => setDraft({ ...draft, maxWaitSeconds: Number(event.target.value) * 60 })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
              </div>
            </div>
            <div>
              <label htmlFor="que-greeting" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Saudação do bot</label>
              <textarea id="que-greeting" rows={2} value={draft.greeting} onChange={(event) => setDraft({ ...draft, greeting: event.target.value })} placeholder="Mensagem exibida quando o paciente entra na fila…" className="w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 py-2.5 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDraft(null)}>Cancelar</Button>
              <Button onClick={save}>{draft.id ? "Salvar alterações" : "Criar fila"}</Button>
            </div>
          </div>
        )}
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