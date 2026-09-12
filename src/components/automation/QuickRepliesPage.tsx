"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Braces, Hash, MessageCircle, Pencil, Plus, Sparkles, Trash2, TrendingUp, Zap } from "lucide-react";
import { deleteQuickReply, listQuickReplies, newQuickReplyId, saveQuickReply } from "@/lib/automation/n8nService";
import type { QuickReply } from "@/lib/automation/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { PageHeader, SearchField, SegmentedTabs, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const ALL = "Todas";
const categories = [ALL, "Agendamento", "Informações", "Financeiro", "Pedidos", "Equipe"];

const scopeChip: Record<QuickReply["scopes"][number], { label: string; chip: string }> = {
  clientes: { label: "Clientes", chip: "bg-ebot-primary/[0.08] text-ebot-primaryText" },
  interno: { label: "Equipe", chip: "bg-ebot-teal/[0.10] text-ebot-teal" }
};

const emptyDraft = { title: "", shortcut: "", category: "Agendamento", scopes: ["clientes"] as QuickReply["scopes"], text: "" };

const VARIABLE_GROUPS: { label: string; chip: string; variables: string[] }[] = [
  { label: "Cliente", chip: "bg-ebot-primary/[0.08] text-ebot-primaryText hover:bg-ebot-primary/[0.14]", variables: ["nome_cliente", "telefone_cliente", "parceria", "nascimento_cliente"] },
  { label: "Atendimento", chip: "bg-ebot-green/[0.10] text-ebot-green hover:bg-ebot-green/[0.16]", variables: ["nome_atendente", "segmento", "horario_atendimento", "data_atendimento", "status_atendimento"] },
  { label: "Filial", chip: "bg-ebot-orange/[0.10] text-ebot-orange hover:bg-ebot-orange/[0.16]", variables: ["nome_unidade", "endereco_unidade", "telefone_unidade"] },
  { label: "Financeiro", chip: "bg-ebot-teal/[0.10] text-ebot-teal hover:bg-ebot-teal/[0.16]", variables: ["valor_servico", "formas_pagamento"] }
];

export function QuickRepliesPage() {
  const { toast } = useDemo();
  const [replies, setReplies] = useState<QuickReply[]>(() => listQuickReplies());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [editing, setEditing] = useState<QuickReply | null>(null);
  const [deleting, setDeleting] = useState<QuickReply | null>(null);
  const [draft, setDraft] = useState<typeof emptyDraft>(emptyDraft);
  const editorRef = useRef<HTMLDivElement>(null);

  const detectedVariables = useMemo(() => {
    const found = draft.text.match(/\{\{([a-z0-9_]+)\}\}/g) ?? [];
    return Array.from(new Set(found.map((token) => token.slice(2, -2))));
  }, [draft.text]);

  function insertVariable(name: string) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand("insertText", false, `{{${name}}}`);
    const next = editor.innerText;
    setDraft((current) => ({ ...current, text: next }));
  }

  useEffect(() => {
    if (!editing || !editorRef.current) return;
    if (editorRef.current.innerText !== draft.text) {
      editorRef.current.innerText = draft.text;
    }
  }, [editing, draft.text]);

  const filtered = useMemo(() => {
    return replies.filter((reply) => {
      const matchesCategory = category === ALL || reply.category === category;
      const matchesQuery = `${reply.title} ${reply.text} ${reply.category}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [replies, query, category]);


  function openNew() {
    setDraft(emptyDraft);
    setEditing({ id: "", title: "", text: "", scopes: ["clientes"], category: "Agendamento", usage7d: 0, updatedAt: "agora" });
  }

  function openEdit(reply: QuickReply) {
    setEditing(reply);
    setDraft({
      title: reply.title,
      shortcut: reply.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      category: reply.category,
      scopes: [...reply.scopes],
      text: reply.text
    });
  }

  function save() {
    if (!editing) return;
    if (!draft.title.trim() || !draft.text.trim()) {
      toast("Informe o título e o texto da resposta rápida.", "warning");
      return;
    }
    const next: QuickReply = {
      id: editing.id || newQuickReplyId(),
      title: draft.title.trim(),
      text: draft.text.trim(),
      scopes: draft.scopes,
      category: draft.category,
      usage7d: editing.usage7d,
      updatedAt: "agora"
    };
    saveQuickReply(next);
    setReplies(listQuickReplies());
    setEditing(null);
    toast(editing.id ? "Resposta rápida atualizada." : "Resposta rápida criada.");
  }

  function remove() {
    if (!deleting) return;
    deleteQuickReply(deleting.id);
    setReplies(listQuickReplies());
    setDeleting(null);
    toast(`Resposta rápida "${deleting.title}" excluída.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Automação / Atendimento"
        title="Respostas rápidas"
        description="Atalhos de texto que agilizam o atendimento com variáveis dinâmicas como {nome_cliente} e {horario_atendimento}, substituídas automaticamente pela IA."
        action={<Button onClick={openNew}><Plus className="size-4" />Nova resposta</Button>}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs tabs={categories.map((item) => ({ id: item, label: item }))} value={category} onChange={setCategory} />
        <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar por título ou texto…" /></div>
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={MessageCircle} title={query || category !== ALL ? "Nenhuma resposta encontrada" : "Nenhuma resposta ainda"} description={query || category !== ALL ? "Ajuste a busca ou o filtro de categoria." : "Crie atalhos para as respostas mais usadas pela equipe."} />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
          <ul className="divide-y divide-ebot-border/[0.08]">
            {filtered.map((reply) => (
              <li key={reply.id} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-ebot-surfaceMuted/30 sm:flex-row sm:items-center">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ebot-orange/[0.12] text-ebot-orange">
                  <Zap className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-extrabold tracking-tight text-ebot-dark">{reply.title}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-ebot-surfaceMuted px-2 py-0.5 text-[10px] font-extrabold text-ebot-slate">
                      <Hash className="size-3" />{reply.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
                    </span>
                    {reply.scopes.map((scope) => (
                      <span key={scope} className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold", scopeChip[scope].chip)}>{scopeChip[scope].label}</span>
                    ))}
                  </div>
                  <p className="mt-1 truncate text-[13px] text-ebot-muted">{reply.text}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate">{reply.category}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-ebot-green"><TrendingUp className="size-3.5" />{reply.usage7d} usos</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" aria-label={`Editar ${reply.title}`} onClick={() => openEdit(reply)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="sm" aria-label={`Excluir ${reply.title}`} onClick={() => setDeleting(reply)}><Trash2 className="size-4 text-ebot-red" /></Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? "Editar resposta rápida" : "Nova resposta rápida"} eyebrow="Automação / Atendimento" description="Crie um atalho com variáveis que serão preenchidas pelo bot em tempo real." icon={Zap} className="max-w-xl">
        {editing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="qr-title" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Título</label>
                <input id="qr-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Ex.: Confirmar agendamento" className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
              </div>
              <div>
                <label htmlFor="qr-shortcut" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Atalho</label>
                <div className="relative">
                  <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ebot-muted" />
                  <input id="qr-shortcut" value={draft.shortcut} onChange={(event) => setDraft({ ...draft, shortcut: event.target.value })} placeholder="confirmar-agendamento" className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 pl-9 pr-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="qr-category" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Categoria</label>
                <select id="qr-category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45">
                  {categories.filter((item) => item !== ALL).map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <fieldset>
                <legend className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Disponível para</legend>
                <div className="flex gap-2">
                  {(["clientes", "interno"] as const).map((scope) => (
                    <button key={scope} type="button" onClick={() => setDraft({ ...draft, scopes: draft.scopes.includes(scope) ? draft.scopes.filter((item) => item !== scope) : [...draft.scopes, scope] })} className={cn("h-10 flex-1 rounded-2xl border text-xs font-extrabold transition", draft.scopes.includes(scope) ? "border-ebot-primary/40 bg-ebot-primary/[0.10] text-ebot-primaryText" : "border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 text-ebot-muted")}>
                      {scopeChip[scope].label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor="qr-text" className="block text-xs font-extrabold text-ebot-slate">Texto da resposta</label>
                <button type="button" onClick={() => editorRef.current?.focus()} className="flex items-center gap-1 text-[10px] font-extrabold text-ebot-primaryText transition hover:opacity-80"><Braces className="size-3" />Clique ou arraste variáveis abaixo</button>
              </div>
              <div
                ref={editorRef}
                id="qr-text"
                role="textbox"
                aria-label="Texto da resposta"
                aria-multiline="true"
                contentEditable
                suppressContentEditableWarning
                onInput={(event) => { setDraft({ ...draft, text: event.currentTarget.innerText }); }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const variable = event.dataTransfer.getData("text/plain");
                  if (variable) insertVariable(variable);
                }}
                data-placeholder="Olá {nome_cliente}! Sua agendamento está confirmada…"
                className="qr-editor min-h-36 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 py-2.5 text-sm font-semibold leading-6 text-ebot-dark outline-none focus:border-ebot-primary/45"
              />
              {detectedVariables.length > 0 ? (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-ebot-muted">Detectadas no texto:</span>
                  {detectedVariables.map((variable) => (
                    <span key={variable} className="flex items-center gap-1 rounded-lg bg-ebot-primary/[0.08] px-2 py-0.5 text-[10px] font-extrabold text-ebot-primaryText"><Braces className="size-3" />{`{{${variable}}}`}</span>
                  ))}
                </div>
              ) : null}
              <div className="mt-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/20 p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-ebot-slate"><Sparkles className="size-3.5 text-ebot-primary" />Variáveis dinâmicas</p>
                <div className="mt-2 space-y-2.5">
                  {VARIABLE_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-ebot-muted">{group.label}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {group.variables.map((variable) => (
                          <button
                            key={variable}
                            type="button"
                            draggable
                            onClick={() => insertVariable(variable)}
                            onDragStart={(event) => event.dataTransfer.setData("text/plain", variable)}
                            title={`Inserir {{${variable}}}`}
                            className={cn("rounded-lg px-2 py-1 text-[10px] font-extrabold transition", group.chip)}
                          >
                            {`{{${variable}}}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2.5 text-[10px] font-bold leading-4 text-ebot-muted">Clique para inserir na posição do cursor ou arraste até o texto. O bot substitui cada variável pelo dado real do cliente no momento do envio.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-ebot-border/[0.10] pt-4">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button onClick={save}>{editing.id ? "Salvar alterações" : "Criar resposta"}</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Excluir resposta rápida?"
        description={deleting ? `A resposta "${deleting.title}" será removida e deixará de aparecer nos atalhos da equipe.` : ""}
        confirmLabel="Excluir"
        onConfirm={remove}
      />
    </div>
  );
}