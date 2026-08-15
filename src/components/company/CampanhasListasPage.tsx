"use client";

import { useMemo, useState } from "react";
import { Filter, Plus, RefreshCcw, Trash2, Users } from "lucide-react";
import { deleteContactList, listContactLists, newCompanyId, saveContactList } from "@/lib/company/companyService";
import type { ContactList } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const statusMeta: Record<ContactList["status"], { label: string; chip: string; dot: string }> = {
  ready: { label: "Pronta", chip: "bg-clinical-green/[0.12] text-clinical-green", dot: "bg-clinical-green" },
  syncing: { label: "Sincronizando", chip: "bg-clinical-blue/[0.10] text-clinical-blueText", dot: "bg-clinical-blue animate-pulse" },
  error: { label: "Erro de sincronização", chip: "bg-clinical-red/[0.12] text-clinical-red", dot: "bg-clinical-red" }
};

const availableFilters = ["WhatsApp válido", "Consentimento ativo", "Opt-in vigente", "Instagram vinculado", "Sem consulta há 6+ meses", "Consultas concluídas em julho", "Aniversário no mês atual", "Interação nos últimos 90 dias", "Consentimento de reativação"];

export function CampanhasListasPage() {
  const { toast, profile } = useDemo();
  const [lists, setLists] = useState<ContactList[]>(() => listContactLists());
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ContactList | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", description: "", filters: [] as string[] });

  const filtered = useMemo(() => {
    return lists.filter((list) => `${list.name} ${list.description} ${list.filters.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  }, [lists, query]);

  const stats: StatItem[] = useMemo(() => {
    const total = lists.reduce((sum, list) => sum + list.size, 0);
    return [
      { id: "lists", label: "Listas", value: String(lists.length), hint: "segmentos criados", tone: "blue", icon: Users },
      { id: "contacts", label: "Contatos", value: total.toLocaleString("pt-BR"), hint: "em todas as listas", tone: "teal", icon: Filter },
      { id: "ready", label: "Prontas para envio", value: String(lists.filter((list) => list.status === "ready").length), hint: "sem pendências", tone: "green", icon: RefreshCcw },
      { id: "attention", label: "Com atenção", value: String(lists.filter((list) => list.status !== "ready").length), hint: "sincronizando ou erro", tone: "orange", icon: Trash2 }
    ];
  }, [lists]);

  function reload() {
    setLists(listContactLists());
  }

  function toggleFilter(filter: string) {
    setDraft((current) => ({ ...current, filters: current.filters.includes(filter) ? current.filters.filter((item) => item !== filter) : [...current.filters, filter] }));
  }

  function create() {
    if (!draft.name.trim()) {
      toast("Informe o nome da lista.", "warning");
      return;
    }
    const list: ContactList = {
      id: newCompanyId("list"),
      name: draft.name.trim(),
      description: draft.description.trim() || "Lista criada pela equipe.",
      size: Math.round(50 + Math.random() * 1900),
      filters: draft.filters,
      status: "syncing",
      lastSync: "—",
      updatedAt: "agora",
      createdBy: profile.name
    };
    saveContactList(list);
    window.setTimeout(() => {
      const current = listContactLists().find((item) => item.id === list.id);
      if (current) {
        saveContactList({ ...current, status: "ready", lastSync: "agora" });
        reload();
        toast(`Lista "${list.name}" sincronizada com ${current.size.toLocaleString("pt-BR")} contatos.`);
      }
    }, 1200);
    setCreating(false);
    setDraft({ name: "", description: "", filters: [] });
  }

  function sync(list: ContactList) {
    setSyncingId(list.id);
    window.setTimeout(() => {
      const current = listContactLists().find((item) => item.id === list.id);
      if (current) {
        saveContactList({ ...current, status: "ready", lastSync: "agora", updatedAt: "agora", size: current.size + Math.round(Math.random() * 40) });
        reload();
        setSyncingId(null);
        toast(`Lista "${list.name}" sincronizada.`);
      }
    }, 1300);
  }

  function remove() {
    if (!deleting) return;
    deleteContactList(deleting.id);
    reload();
    setDeleting(null);
    toast(`Lista "${deleting.name}" excluída.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Comunicação / Listas"
        title="Listas de contatos"
        description="Segmentos com filtros combinados e status de sincronização. Somente contatos com opt-in vigente entram em disparos."
        action={<Button onClick={() => setCreating(true)}><Plus className="size-4" />Nova lista</Button>}
      />

      <StatStrip items={stats} />

      <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar lista…" /></div>

      {filtered.length === 0 ? (
        <StatePanel icon={Users} title={query ? "Nenhuma lista encontrada" : "Nenhuma lista ainda"} description={query ? "Ajuste a busca." : "Crie uma lista segmentada para suas campanhas."} />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 shadow-[0_8px_24px_rgba(38,53,50,0.04)]">
          <ul className="divide-y divide-clinical-border/[0.08]">
            {filtered.map((list) => {
              const meta = statusMeta[list.status];
              return (
                <li key={list.id} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-clinical-surfaceMuted/30 lg:flex-row lg:items-center">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-clinical-blue/[0.10] text-clinical-blueText">
                    <Users className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-extrabold tracking-tight text-clinical-dark">{list.name}</h2>
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold", meta.chip)}>
                        <span className={cn("size-1.5 rounded-full", meta.dot)} />
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[13px] text-clinical-muted">{list.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {list.filters.map((filter) => (
                        <span key={filter} className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2 py-0.5 text-[10px] font-extrabold text-clinical-slate">
                          <Filter className="size-2.5" />{filter}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[12px] font-extrabold text-clinical-dark">{list.size.toLocaleString("pt-BR")} contatos</span>
                    <span className="hidden text-[11px] font-bold text-clinical-muted md:inline">última sincronização: {list.lastSync}</span>
                    <Button variant="secondary" size="sm" onClick={() => sync(list)} disabled={syncingId === list.id}>
                      <RefreshCcw className={cn("size-3.5", syncingId === list.id && "animate-spin")} />
                      {syncingId === list.id ? "Sincronizando…" : "Sincronizar"}
                    </Button>
                    <Button variant="ghost" size="sm" aria-label={`Excluir ${list.name}`} onClick={() => setDeleting(list)}><Trash2 className="size-4 text-clinical-red" /></Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Nova lista de contatos" eyebrow="Comunicação / Listas" description="Combine filtros para formar o público da campanha." icon={Users} className="max-w-xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="cl-name" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Nome</label>
            <input id="cl-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Pacientes do plano básico" className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
          </div>
          <div>
            <label htmlFor="cl-description" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Descrição</label>
            <input id="cl-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Qual segmento esta lista representa?" className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
          </div>
          <fieldset>
            <legend className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Filtros da segmentação</legend>
            <div className="flex flex-wrap gap-1.5">
              {availableFilters.map((filter) => {
                const active = draft.filters.includes(filter);
                return (
                  <button key={filter} type="button" onClick={() => toggleFilter(filter)} className={cn("rounded-full px-3 py-1.5 text-[11px] font-extrabold transition", active ? "bg-clinical-blue/[0.10] text-clinical-blueText ring-1 ring-clinical-blue/30" : "bg-clinical-surfaceMuted text-clinical-muted hover:text-clinical-dark")}>
                    {filter}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.10] pt-4">
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancelar</Button>
            <Button onClick={create}><Plus className="size-4" />Criar e sincronizar</Button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Excluir lista de contatos"
        description={deleting ? `Excluir "${deleting.name}"? Campanhas agendadas com esta lista precisarão de novo público.` : ""}
        confirmLabel="Excluir lista"
      />
    </div>
  );
}