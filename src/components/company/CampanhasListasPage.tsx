"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ExternalLink, Filter, LayoutGrid, List, Plus, RefreshCcw, Trash2, Users } from "lucide-react";
import { deleteContactList, listContactLists, newCompanyId, saveContactList } from "@/lib/company/companyService";
import type { ContactList } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { ContactListDownloadModal } from "@/components/company/ContactListDownloadModal";
import { Modal } from "@/components/ui/Modal";
import { PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { cn } from "@/lib/cn";

const statusMeta: Record<ContactList["status"], { label: string; chip: string; dot: string }> = {
  ready: { label: "Pronta", chip: "bg-ebot-green/[0.12] text-ebot-green", dot: "bg-ebot-green" },
  syncing: { label: "Sincronizando", chip: "bg-ebot-primary/[0.10] text-ebot-primaryText", dot: "bg-ebot-primary animate-pulse" },
  error: { label: "Erro de sincronização", chip: "bg-ebot-red/[0.12] text-ebot-red", dot: "bg-ebot-red" }
};

const availableFilters = ["WhatsApp válido", "Consentimento ativo", "Opt-in vigente", "Instagram vinculado", "Sem agendamento há 6+ meses", "Agendamentos concluídos em julho", "Aniversário no mês atual", "Interação nos últimos 90 dias", "Consentimento de reativação"];

export function CampanhasListasPage() {
  const { toast, profile } = useDemo();
  const router = useRouter();
  const [lists, setLists] = useState<ContactList[]>(() => listContactLists());
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ContactList | null>(null);
  const [downloading, setDownloading] = useState<ContactList | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [view, setView] = useState<"lista" | "cards">("lista");
  const [draft, setDraft] = useState({ name: "", description: "", filters: [] as string[] });

  const filtered = useMemo(() => {
    return lists.filter((list) => `${list.name} ${list.description} ${list.filters.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  }, [lists, query]);

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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar lista…" /></div>
        <ViewSwitch
          views={[{ id: "lista", label: "Lista", icon: List }, { id: "cards", label: "Cards", icon: LayoutGrid }]}
          value={view}
          onChange={(id) => setView(id as "lista" | "cards")}
          className="self-end sm:self-auto"
        />
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={Users} title={query ? "Nenhuma lista encontrada" : "Nenhuma lista ainda"} description={query ? "Ajuste a busca." : "Crie uma lista segmentada para suas campanhas."} />
      ) : view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((list) => {
            const meta = statusMeta[list.status];
            return (
              <article key={list.id} data-contact-list-card data-list-id={list.id} className="flex flex-col rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_22px_rgba(4,27,21,0.04)] transition hover:-translate-y-0.5 hover:shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ebot-primary/[0.10] text-ebot-primaryText">
                    <Users className="size-4" />
                  </span>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold", meta.chip)}>
                    <span className={cn("size-1.5 rounded-full", meta.dot)} />
                    {meta.label}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-extrabold tracking-tight text-ebot-dark">{list.name}</h2>
                <p className="mt-1 line-clamp-2 flex-1 text-[13px] leading-5 text-ebot-muted">{list.description}</p>
                <dl className="mt-4 space-y-1.5 rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/30 px-3 py-2.5 text-[12px] font-bold">
                  <div className="flex items-center justify-between"><dt className="uppercase tracking-wider text-ebot-muted">Contatos</dt><dd className="tabular-nums text-ebot-dark">{list.size.toLocaleString("pt-BR")}</dd></div>
                  <div className="flex items-center justify-between"><dt className="uppercase tracking-wider text-ebot-muted">Sincronização</dt><dd className="text-ebot-dark">{list.lastSync}</dd></div>
                </dl>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-ebot-border/[0.10] pt-3">
                  <Button variant="secondary" size="sm" onClick={() => router.push(`/campanhas/listas/${list.id}`)}>
                    <ExternalLink className="size-3.5" />Ver lista
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setDownloading(list)}>
                    <Download className="size-3.5" />Baixar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => sync(list)} disabled={syncingId === list.id}>
                    <RefreshCcw className={cn("size-3.5", syncingId === list.id && "animate-spin")} />
                    {syncingId === list.id ? "Sincronizando…" : "Sincronizar"}
                  </Button>
                  <Button variant="ghost" size="sm" aria-label={`Excluir ${list.name}`} onClick={() => setDeleting(list)}><Trash2 className="size-4 text-ebot-red" /></Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
          <ul className="divide-y divide-ebot-border/[0.08]">
            {filtered.map((list) => {
              const meta = statusMeta[list.status];
              return (
                <li key={list.id} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-ebot-surfaceMuted/30 lg:flex-row lg:items-center">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ebot-primary/[0.10] text-ebot-primaryText">
                    <Users className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => router.push(`/campanhas/listas/${list.id}`)} className="text-sm font-extrabold tracking-tight text-ebot-dark underline-offset-2 transition hover:text-ebot-primary hover:underline">
                        {list.name}
                      </button>
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold", meta.chip)}>
                        <span className={cn("size-1.5 rounded-full", meta.dot)} />
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[13px] text-ebot-muted">{list.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {list.filters.map((filter) => (
                        <span key={filter} className="inline-flex items-center gap-1 rounded-full bg-ebot-surfaceMuted px-2 py-0.5 text-[10px] font-extrabold text-ebot-slate">
                          <Filter className="size-2.5" />{filter}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[12px] font-extrabold text-ebot-dark">{list.size.toLocaleString("pt-BR")} contatos</span>
                    <span className="hidden text-[11px] font-bold text-ebot-muted md:inline">última sincronização: {list.lastSync}</span>
                    <Button variant="secondary" size="sm" onClick={() => setDownloading(list)}>
                      <Download className="size-3.5" />Baixar
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => router.push(`/campanhas/listas/${list.id}`)}>
                      <ExternalLink className="size-3.5" />Abrir lista
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => sync(list)} disabled={syncingId === list.id}>
                      <RefreshCcw className={cn("size-3.5", syncingId === list.id && "animate-spin")} />
                      {syncingId === list.id ? "Sincronizando…" : "Sincronizar"}
                    </Button>
                    <Button variant="ghost" size="sm" aria-label={`Excluir ${list.name}`} onClick={() => setDeleting(list)}><Trash2 className="size-4 text-ebot-red" /></Button>
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
            <label htmlFor="cl-name" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Nome</label>
            <input id="cl-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Clientes do plano básico" className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
          </div>
          <div>
            <label htmlFor="cl-description" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Descrição</label>
            <input id="cl-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Qual segmento esta lista representa?" className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
          </div>
          <fieldset>
            <legend className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Filtros da segmentação</legend>
            <div className="flex flex-wrap gap-1.5">
              {availableFilters.map((filter) => {
                const active = draft.filters.includes(filter);
                return (
                  <button key={filter} type="button" onClick={() => toggleFilter(filter)} className={cn("rounded-full px-3 py-1.5 text-[11px] font-extrabold transition", active ? "bg-ebot-primary/[0.10] text-ebot-primaryText ring-1 ring-ebot-primary/30" : "bg-ebot-surfaceMuted text-ebot-muted hover:text-ebot-dark")}>
                    {filter}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.10] pt-4">
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

      <ContactListDownloadModal list={downloading} open={Boolean(downloading)} onClose={() => setDownloading(null)} onDone={(message) => toast(message)} />
    </div>
  );
}