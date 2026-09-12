"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Hash, KanbanSquare, LayoutGrid, List, Pencil, Plus, SearchX, Tags, Trash2, TrendingUp, X } from "lucide-react";
import { deleteTag, listTags, newTagId, saveTag, type Tag, type TagStatus } from "@/lib/tags/tagsService";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { ColorField } from "@/components/ui/ColorField";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect } from "@/components/ui/ModalField";
import { SegmentedTabs, StatusBadge, PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { Toggle } from "@/components/ui/Toggle";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { cn } from "@/lib/cn";

const ALL = "Todos";

const emptyForm = { id: "", name: "", color: "#6B942E", description: "", status: "ativa" as TagStatus, showInKanban: true };

export function TagsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Tag[]>(() => listTags());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [view, setView] = useState<"cards" | "lista">("cards");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<Tag | null>(null);
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-tag-item]", from: { opacity: 0, y: 18 } },
    { selector: "[data-filter-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } }
  ], { stagger: 0.05, delay: 0.05 });

  useEffect(() => setRows(listTags()), []);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = `${row.name} ${row.description}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === ALL || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    setForm({ id: tag.id, name: tag.name, color: tag.color, description: tag.description, status: tag.status, showInKanban: tag.showInKanban });
    setFormOpen(true);
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) {
      showNotice("Informe o nome da tag.");
      return;
    }
    const base = editing ?? rows.find((row) => row.id === form.id);
    const next: Tag = {
      id: editing?.id ?? newTagId(),
      name: form.name.trim(),
      color: form.color,
      description: form.description.trim() || "Sem descrição.",
      usage: base?.usage ?? 0,
      status: form.status,
      showInKanban: form.status === "ativa" ? form.showInKanban : false,
      updatedAt: "agora"
    };
    saveTag(next);
    setRows(listTags());
    setFormOpen(false);
    showNotice(base ? `Tag "${next.name}" atualizada.` : `Tag "${next.name}" criada.`);
  }

  function toggleKanban(tag: Tag) {
    saveTag({ ...tag, showInKanban: !tag.showInKanban });
    setRows(listTags());
    showNotice(!tag.showInKanban ? `Tag "${tag.name}" habilitada no Kanban.` : `Tag "${tag.name}" desabilitada no Kanban.`);
  }

  function confirmDelete() {
    if (!toDelete) return;
    deleteTag(toDelete.id);
    setRows(listTags());
    setToDelete(null);
    showNotice(`Tag "${toDelete.name}" removida.`);
  }

  const activeCount = rows.filter((row) => row.status === "ativa").length;
  const totalUsage = rows.reduce((sum, row) => sum + row.usage, 0);

  return (
    <div ref={pageRef} data-tags-page className="space-y-4">
      <PageHeader
        eyebrow="Clientes / Organização"
        title="Tags"
        description="Marcadores usados no painel para classificar atendimentos, cartões e contatos. Mesmas tags aplicadas pela equipe e pela IA."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-ebot-primary/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-primaryText"><Tags className="size-4" />{activeCount} ativas · {totalUsage} aplicações</span>}
        action={<Button onClick={openCreate}><Plus className="size-4" />Nova tag</Button>}
      />

      {notice ? (
        <div role="status" className="flex items-center justify-between rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div data-filter-bar className="flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchField value={search} onChange={setSearch} placeholder="Buscar tag por nome ou descrição" />
          <ViewSwitch
            views={[{ id: "cards", label: "Cards", icon: LayoutGrid }, { id: "lista", label: "Lista", icon: List }]}
            value={view}
            onChange={(id) => setView(id as "cards" | "lista")}
            className="self-end sm:self-auto"
          />
        </div>
        <SegmentedTabs
          tabs={[
            { id: ALL, label: "Todas", count: rows.length },
            { id: "ativa", label: "Ativas", count: rows.filter((row) => row.status === "ativa").length },
            { id: "arquivada", label: "Arquivadas", count: rows.filter((row) => row.status === "arquivada").length }
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={SearchX}
          title="Nenhuma tag encontrada"
          description="Ajuste a busca ou o filtro de status."
          action={<Button size="sm" variant="secondary" onClick={() => { setSearch(""); setStatusFilter(ALL); }}>Limpar filtros</Button>}
        />
      ) : view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((tag) => (
            <article
              key={tag.id}
              data-tag-item
              data-tag-id={tag.id}
              className={cn(
                "flex flex-col rounded-[24px] border bg-ebot-surface/80 p-5 shadow-[0_8px_22px_rgba(4,27,21,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-card",
                tag.status === "arquivada" ? "border-dashed border-ebot-border/[0.18] opacity-75" : "border-ebot-border/[0.14] hover:border-ebot-primary/30"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${tag.color}1E`, color: tag.color }}>
                  <Hash className="size-5" />
                </span>
                <StatusBadge label={tag.status === "ativa" ? "Ativa" : "Arquivada"} tone={tag.status === "ativa" ? "green" : "neutral"} />
              </div>
              <h2 className="mt-3.5 text-base font-extrabold tracking-tight text-ebot-dark">#{tag.name}</h2>
              <p className="mt-1.5 flex-1 text-[13px] leading-5 text-ebot-muted">{tag.description}</p>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/30 px-3 py-2">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">
                  <TrendingUp className="size-3.5 text-ebot-green" />Usos no painel
                </span>
                <span className="text-sm font-extrabold tabular-nums text-ebot-dark">{tag.usage}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-ebot-border/[0.10] px-3 py-2">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">
                  <KanbanSquare className="size-3.5" style={{ color: tag.color }} />Kanban
                </span>
                <Toggle
                  checked={tag.showInKanban}
                  onChange={() => toggleKanban(tag)}
                  statusOn="No Kanban"
                  statusOff="Fora"
                  className="!w-auto border-0 !bg-transparent !px-0 !py-0"
                />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-ebot-border/[0.10] pt-3">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-ebot-muted">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: tag.color }} aria-hidden="true" />
                  Atualizada {tag.updatedAt}
                </span>
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => openEdit(tag)} aria-label={`Editar ${tag.name}`} title="Editar tag" className="flex size-8 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary">
                    <Pencil className="size-3.5" />
                  </button>
                  <button type="button" onClick={() => setToDelete(tag)} aria-label={`Remover ${tag.name}`} title="Remover tag" className="flex size-8 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
          <ul className="divide-y divide-ebot-border/[0.10]" aria-label="Lista de tags">
            {filtered.map((tag) => (
              <li key={tag.id} data-tag-item data-tag-id={tag.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5 transition hover:bg-ebot-primary/[0.035] sm:flex-nowrap">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${tag.color}1E`, color: tag.color }}><Hash className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-ebot-dark">#{tag.name}</p>
                  <p className="truncate text-xs font-semibold text-ebot-muted">{tag.description}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-ebot-muted"><TrendingUp className="size-3.5 text-ebot-green" />{tag.usage} usos</span>
                <StatusBadge label={tag.status === "ativa" ? "Ativa" : "Arquivada"} tone={tag.status === "ativa" ? "green" : "neutral"} />
                <Toggle
                  checked={tag.showInKanban}
                  onChange={() => toggleKanban(tag)}
                  statusOn="Kanban"
                  statusOff="Fora"
                  icon={KanbanSquare}
                  className="!w-auto border-0 !bg-transparent !px-1 !py-0"
                />
                <div className="flex shrink-0 items-center gap-0.5">
                  <button type="button" onClick={() => openEdit(tag)} aria-label={`Editar ${tag.name}`} title="Editar tag" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-3.5" /></button>
                  <button type="button" onClick={() => setToDelete(tag)} aria-label={`Remover ${tag.name}`} title="Remover tag" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500"><Trash2 className="size-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Editar tag" : "Nova tag"}
        eyebrow="Clientes / Organização"
        description="As tags ficam disponíveis na fila de atendimento, no Kanban e nos contatos."
        icon={Tags}
        className="max-w-lg"
      >
        <form onSubmit={submitForm} className="space-y-4">
          <ModalField label="Nome da tag" icon={Hash} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Primeiro contato" required />
          <ModalField label="Descrição" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Quando esta tag deve ser aplicada?" />
          <ColorField label="Cor do marcador" value={form.color} onChange={(color) => setForm({ ...form, color })} />
          <Toggle
            checked={form.showInKanban}
            onChange={(checked) => setForm({ ...form, showInKanban: checked })}
            label="Usar no Kanban"
            hint="Quando ativa, a tag aparece nos filtros e cartões do Kanban."
            icon={KanbanSquare}
          />
          <ModalSelect label="Situação" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as TagStatus })}>
            <option value="ativa">Ativa</option>
            <option value="arquivada">Arquivada</option>
          </ModalSelect>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button type="submit"><Check className="size-4" />{editing ? "Salvar alterações" : "Criar tag"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Remover tag?"
        description={`A tag "${toDelete?.name ?? ""}" deixará de ficar disponível para seleção no painel (dados locais).`}
        confirmLabel="Remover tag"
      />
    </div>
  );
}
