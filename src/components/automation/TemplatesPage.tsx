"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Check,
  CircleAlert,
  Clock3,
  Languages,
  Layers3,
  MessageSquareText,
  MessagesSquare,
  Pencil,
  Plus,
  SearchX,
  Send,
  Sparkles,
  TrendingUp,
  X
} from "lucide-react";
import {
  templateCategories,
  templateStatuses,
  type TemplateCategory,
  type TemplateStatus,
  type WhatsAppTemplate
} from "@/data/whatsappTemplatesMock";
import { deleteTemplate, listTemplates, saveTemplate } from "@/lib/messaging/templateService";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { Dropdown } from "@/components/ui/Dropdown";
import { SegmentedTabs, StatusBadge, PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const ALL_CATEGORIES = "Todas";
const ALL_STATUS = "Todos";

const statusTone: Record<TemplateStatus, "green" | "orange" | "red"> = {
  Aprovado: "green",
  Pendente: "orange",
  Reprovado: "red"
};

const categoryTone: Record<TemplateCategory, string> = {
  Marketing: "bg-ebot-orange/12 text-ebot-orange",
  Utilidade: "bg-ebot-primary/10 text-ebot-primaryText",
  Autenticação: "bg-ebot-teal/12 text-ebot-teal"
};

const qualityTone: Record<string, "green" | "orange" | "red" | "neutral"> = {
  Alta: "green",
  Média: "orange",
  Baixa: "red",
  "—": "neutral"
};

const emptyForm = { id: "", name: "", category: "Utilidade" as TemplateCategory, language: "Português (BR)", header: "", body: "", footer: "", status: "Pendente" as TemplateStatus };

export function TemplatesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<WhatsAppTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [status, setStatus] = useState<string>(ALL_STATUS);
  const [detail, setDetail] = useState<WhatsAppTemplate | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<WhatsAppTemplate | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-template-card]", from: { opacity: 0, y: 18 } },
    { selector: "[data-filter-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } }
  ], { stagger: 0.06, delay: 0.05 });

  useEffect(() => setRows(listTemplates()), []);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  const approved = rows.filter((row) => row.status === "Aprovado").length;
  const totalUses = rows.reduce((sum, row) => sum + row.usesMonth, 0);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = `${row.name} ${row.body} ${row.category}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === ALL_CATEGORIES || row.category === category;
      const matchesStatus = status === ALL_STATUS || row.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [rows, search, category, status]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(template: WhatsAppTemplate) {
    setEditing(template);
    setForm({ id: template.id, name: template.name, category: template.category, language: template.language, header: template.header, body: template.body, footer: template.footer, status: template.status });
    setFormOpen(true);
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.body.trim()) {
      showNotice("Informe o nome e o corpo do template.");
      return;
    }
    const base = editing ?? rows.find((row) => row.id === form.id);
    const next: WhatsAppTemplate = {
      id: editing?.id ?? `tpl-${Date.now().toString(36)}`,
      name: form.name.trim(),
      language: form.language,
      category: form.category,
      status: form.status,
      quality: editing?.quality ?? "—",
      header: form.header.trim(),
      body: form.body.trim(),
      footer: form.footer.trim(),
      buttons: editing?.buttons ?? [],
      variables: editing?.variables ?? extractVariables(form.body),
      usesMonth: editing?.usesMonth ?? 0,
      updatedAt: "Agora"
    };
    saveTemplate(next);
    setRows(listTemplates());
    setFormOpen(false);
    setDetail(null);
    showNotice(base ? `Template "${next.name}" atualizado localmente.` : `Template "${next.name}" enviado para aprovação (demo).`);
  }

  function extractVariables(body: string) {
    return Array.from(new Set(body.match(/{{\d+}}/g) ?? []));
  }

  function removeTemplate(id: string) {
    deleteTemplate(id);
    setRows(listTemplates());
    setDetail(null);
    showNotice("Template removido da lista local.");
  }

  return (
    <div ref={pageRef} className="space-y-4">
      <PageHeader
        eyebrow="Automação / Templates de mensagem"
        title="Templates"
        description="Templates de mensagem do WhatsApp aprovados pela Meta, usados por campanhas, protocolos e automações da empresa."
        aside={
          <span className="inline-flex items-center gap-2 rounded-full bg-ebot-green/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-green">
            <BadgeCheck className="size-4" />{approved} aprovados · {totalUses} envios no mês
          </span>
        }
        action={<Button onClick={openCreate}><Plus className="size-4" />Novo template</Button>}
      />

      {notice ? (
        <div role="status" className="flex items-center justify-between rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div data-filter-bar className="flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar template por nome, texto ou categoria" />
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <SegmentedTabs
            tabs={templateCategories.map((item) => ({ id: item, label: item === ALL_CATEGORIES ? "Todas" : item, count: item === ALL_CATEGORIES ? rows.length : rows.filter((row) => row.category === item).length }))}
            value={category}
            onChange={setCategory}
          />
          <div className="w-full lg:w-56">
            <Dropdown label="Status" value={status} options={[...templateStatuses]} onChange={setStatus} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={SearchX}
          title="Nenhum template encontrado"
          description="Ajuste a busca ou os filtros de categoria e status."
          action={<Button size="sm" variant="secondary" onClick={() => { setSearch(""); setCategory(ALL_CATEGORIES); setStatus(ALL_STATUS); }}>Limpar filtros</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((template) => (
            <article
              key={template.id}
              data-template-card
              className="flex min-h-[250px] flex-col rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75 p-5 shadow-[0_8px_22px_rgba(4,27,21,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-ebot-primary/30 hover:bg-ebot-surface hover:shadow-card dark:shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ebot-whatsapp/10 text-ebot-whatsapp">
                  <MessageSquareText className="size-5" />
                </span>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge label={template.status} tone={statusTone[template.status]} />
                  <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold", categoryTone[template.category])}>{template.category}</span>
                </div>
              </div>
              <h2 className="mt-4 text-base font-extrabold tracking-tight text-ebot-dark">{template.name}</h2>
              <div className="relative mt-2.5 flex-1 rounded-2xl rounded-tl-md bg-[#DCF8C6] p-3.5 shadow-[0_6px_18px_rgba(4,27,21,0.16)] dark:bg-[#05464080] dark:shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                <span aria-hidden="true" className="absolute -left-1.5 top-0 size-3 rounded-[3px] bg-[#DCF8C6] [clip-path:polygon(100%_0,0_0,100%_100%)] dark:bg-[#054640]" />
                <p className="line-clamp-4 text-[13px] leading-5 text-[#1F2A24] dark:text-ebot-dark">{template.body}</p>
                <p className="mt-1.5 text-right text-[10px] font-bold tabular-nums text-[#5B6B62] dark:text-ebot-muted">pré-visualização · WhatsApp</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-ebot-surfaceMuted px-2 py-1 text-[11px] font-bold text-ebot-muted"><Languages className="size-3" />{template.language}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-ebot-primary/[0.08] px-2 py-1 text-[11px] font-bold text-ebot-primaryText"><Sparkles className="size-3" />{template.variables.length} variáveis</span>
                {template.buttons.length ? <span className="inline-flex items-center gap-1 rounded-full bg-ebot-teal/10 px-2 py-1 text-[11px] font-bold text-ebot-teal">{template.buttons.length} botões</span> : null}
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-ebot-border/[0.10] pt-3.5">
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Qualidade</dt><dd className="mt-1"><StatusBadge label={template.quality} tone={qualityTone[template.quality]} /></dd></div>
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Envios/mês</dt><dd className="mt-0.5 flex items-center gap-1 text-[13px] font-extrabold tabular-nums text-ebot-dark"><TrendingUp className="size-3.5 text-ebot-green" />{template.usesMonth}</dd></div>
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Atualizado</dt><dd className="mt-0.5 text-[13px] font-extrabold text-ebot-dark">{template.updatedAt}</dd></div>
              </dl>
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => setDetail(template)}><MessagesSquare className="size-3.5" />Ver estrutura</Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(template)} aria-label={`Editar ${template.name}`}><Pencil className="size-3.5" /></Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Drawer open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.name ?? "Template"} description={detail ? `${detail.category} · ${detail.language} · ${detail.status}` : undefined} width="max-w-lg">
        {detail ? (
          <div className="space-y-4">
            <div className="rounded-[26px] border border-ebot-border/[0.14] bg-[#EDF0F6] p-4">
              <div className="ml-auto max-w-[340px] rounded-2xl rounded-tr-md bg-white p-4 shadow-[0_10px_28px_rgba(4,27,21,0.14)]">
                {detail.header ? <p className="mb-2 text-sm font-extrabold text-ebot-dark">{detail.header}</p> : null}
                <p className="whitespace-pre-line text-[13px] leading-5 text-ebot-slate">{detail.body}</p>
                {detail.footer ? <p className="mt-2 text-[11px] font-semibold text-ebot-muted">{detail.footer}</p> : null}
                {detail.buttons.length ? (
                  <div className="mt-3 space-y-1.5 border-t border-ebot-border/[0.10] pt-2.5">
                    {detail.buttons.map((button) => (
                      <span key={button.label} className="flex items-center justify-center gap-1.5 rounded-xl bg-ebot-surfaceMuted/60 px-3 py-2 text-[12px] font-extrabold text-ebot-primaryText">
                        <Send className="size-3" />{button.label}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p className="mt-2 text-right text-[10px] font-bold text-ebot-muted">✓✓ 10:42</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-3"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Status Meta</dt><dd className="mt-1.5"><StatusBadge label={detail.status} tone={statusTone[detail.status]} /></dd></div>
              <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-3"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Qualidade</dt><dd className="mt-1.5"><StatusBadge label={detail.quality} tone={qualityTone[detail.quality]} /></dd></div>
              <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-3"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Envios no mês</dt><dd className="mt-1 text-lg font-extrabold tabular-nums text-ebot-dark">{detail.usesMonth}</dd></div>
              <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-3"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Atualizado</dt><dd className="mt-1 text-lg font-extrabold text-ebot-dark">{detail.updatedAt}</dd></div>
            </div>

            {detail.variables.length ? (
              <div className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/25 p-3.5">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted"><Layers3 className="size-3.5" />Variáveis do template</p>
                <ul className="flex flex-wrap gap-1.5">
                  {detail.variables.map((variable) => <li key={variable} className="rounded-full bg-ebot-primary/[0.08] px-2.5 py-1 text-[11px] font-extrabold text-ebot-primaryText">{variable}</li>)}
                </ul>
              </div>
            ) : null}

            {detail.status === "Reprovado" ? (
              <div className="flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-3 text-xs font-semibold leading-5 text-red-500">
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                Reprovado pela Meta. Ajuste o conteúdo (evite promessas de resultado) e reenvie para aprovação.
              </div>
            ) : null}
            {detail.status === "Pendente" ? (
              <div className="flex items-start gap-2 rounded-2xl border border-ebot-orange/20 bg-ebot-orange/[0.08] p-3 text-xs font-semibold leading-5 text-ebot-orange">
                <Clock3 className="mt-0.5 size-4 shrink-0" />
                Aguardando revisão da Meta. O status costuma sair em até 24 horas.
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 border-t border-ebot-border/[0.12] pt-4">
              <Button size="sm" onClick={() => openEdit(detail)}><Pencil className="size-3.5" />Editar template</Button>
              <Button size="sm" variant="ghost" onClick={() => removeTemplate(detail.id)}><X className="size-3.5" />Remover</Button>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Editar template" : "Novo template de mensagem"}
        eyebrow="Automação / WhatsApp"
        description="O template segue o formato exigido pela Meta e entra em aprovação após salvo (demo local)."
        icon={MessageSquareText}
        className="max-w-2xl"
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField label="Nome do template" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Lembrete de retorno" required />
            <ModalSelect label="Categoria" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as TemplateCategory })}>
              <option>Utilidade</option><option>Marketing</option><option>Autenticação</option>
            </ModalSelect>
            <ModalField label="Cabeçalho (opcional)" value={form.header} onChange={(event) => setForm({ ...form, header: event.target.value })} placeholder="Ex.: Olá, {{1}}!" />
            <ModalSelect label="Idioma" value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })}>
              <option>Português (BR)</option><option>Inglês (EUA)</option><option>Espanhol</option>
            </ModalSelect>
          </div>
          <ModalTextarea label="Corpo da mensagem" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="Use {{1}}, {{2}}… para as variáveis." required />
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField label="Rodapé (opcional)" value={form.footer} onChange={(event) => setForm({ ...form, footer: event.target.value })} placeholder="Ex.: Equipe Ê-Bot" />
            <ModalSelect label="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as TemplateStatus })}>
              <option>Pendente</option><option>Aprovado</option><option>Reprovado</option>
            </ModalSelect>
          </div>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button type="submit"><Check className="size-4" />{editing ? "Salvar alterações" : "Enviar para aprovação"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
