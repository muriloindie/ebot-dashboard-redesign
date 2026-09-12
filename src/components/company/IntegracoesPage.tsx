"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Building2,
  Check,
  Link2,
  ListOrdered,
  Pencil,
  Plus,
  SearchX,
  Settings2,
  Timer,
  Trash2,
  Webhook,
  X,
  Zap
} from "lucide-react";
import {
  deleteTypebotIntegration,
  listQueues,
  listTypebotIntegrations,
  saveTypebotIntegration
} from "@/lib/company/companyService";
import type { TypebotAgentOption, TypebotIntegration } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { PageHeader, SearchField, StatePanel, StatusBadge } from "@/components/ui/Week1Primitives";

const statusTone: Record<TypebotIntegration["status"], "green" | "orange" | "neutral"> = {
  connected: "green",
  attention: "orange",
  disconnected: "neutral"
};

const statusLabel: Record<TypebotIntegration["status"], string> = {
  connected: "Conectada",
  attention: "Atenção",
  disconnected: "Desconectada"
};

function emptyAgent(queueId: string) {
  return {
    agentName: "",
    companyName: "",
    companyDescription: "",
    businessRules: "",
    companyContext: "",
    extraInfo: "",
    welcomeMessage: "",
    queueIntegrationId: queueId,
    options: [] as TypebotAgentOption[]
  };
}

type Draft = Omit<TypebotIntegration, "id" | "status" | "lastSync"> & { id: string };

function toDraft(integration?: TypebotIntegration, fallbackQueueId?: string): Draft {
  return {
    id: integration?.id ?? "",
    name: integration?.name ?? "",
    url: integration?.url ?? "",
    slug: integration?.slug ?? "",
    expireMinutes: integration?.expireMinutes ?? 30,
    messageIntervalMs: integration?.messageIntervalMs ?? 1200,
    finishWord: integration?.finishWord ?? "#sair",
    restartWord: integration?.restartWord ?? "#reiniciar",
    invalidOptionMessage: integration?.invalidOptionMessage ?? "Opção inválida. Escolha uma das alternativas enviadas.",
    restartMessage: integration?.restartMessage ?? "Conversa reiniciada. Vamos começar de novo?",
    agent: integration ? { ...integration.agent, options: integration.agent.options.map((option) => ({ ...option })) } : emptyAgent(fallbackQueueId ?? "")
  };
}

function newOptionId() {
  return `aopt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function IntegracoesPage() {
  const { toast } = useDemo();
  const [rows, setRows] = useState<TypebotIntegration[]>(() => listTypebotIntegrations());
  const [queues] = useState(() => listQueues());
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState<TypebotIntegration | null>(null);
  const [agentFor, setAgentFor] = useState<TypebotIntegration | null>(null);
  const [agentDraft, setAgentDraft] = useState<TypebotIntegration["agent"] | null>(null);
  const [deleting, setDeleting] = useState<TypebotIntegration | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => setRows(listTypebotIntegrations()), []);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  const filtered = useMemo(() => {
    return rows.filter((row) => `${row.name} ${row.url} ${row.slug} ${row.agent.agentName}`.toLowerCase().includes(query.toLowerCase()));
  }, [rows, query]);

  function queueName(id: string) {
    return queues.find((queue) => queue.id === id)?.name ?? "—";
  }

  function openCreate() {
    setEditing(null);
    setDraft(toDraft(undefined, queues[0]?.id));
  }

  function openEdit(integration: TypebotIntegration) {
    setEditing(integration);
    setDraft(toDraft(integration));
  }

  function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast("Informe o nome da integração.", "warning");
      return;
    }
    if (!draft.url.trim()) {
      toast("Informe a URL do Typebot.", "warning");
      return;
    }
    if (!draft.slug.trim()) {
      toast("Informe o slug do Typebot.", "warning");
      return;
    }
    const base = editing ?? rows.find((row) => row.id === draft.id);
    const next: TypebotIntegration = {
      id: editing?.id ?? `tb-${Date.now().toString(36)}`,
      name: draft.name.trim(),
      url: draft.url.trim(),
      slug: draft.slug.trim(),
      expireMinutes: Math.max(1, Math.round(draft.expireMinutes)),
      messageIntervalMs: Math.max(0, Math.round(draft.messageIntervalMs)),
      finishWord: draft.finishWord.trim() || "#sair",
      restartWord: draft.restartWord.trim() || "#reiniciar",
      invalidOptionMessage: draft.invalidOptionMessage.trim(),
      restartMessage: draft.restartMessage.trim(),
      status: base?.status ?? "disconnected",
      lastSync: base?.lastSync ?? "—",
      agent: draft.agent
    };
    saveTypebotIntegration(next);
    setRows(listTypebotIntegrations());
    setDraft(null);
    setEditing(null);
    showNotice(base ? `Integração "${next.name}" atualizada.` : `Integração "${next.name}" adicionada.`);
  }

  function openAgent(integration: TypebotIntegration) {
    setAgentFor(integration);
    setAgentDraft({ ...integration.agent, options: integration.agent.options.map((option) => ({ ...option })) });
  }

  function saveAgent() {
    if (!agentFor || !agentDraft) return;
    if (!agentDraft.agentName.trim()) {
      toast("Informe o nome do agente.", "warning");
      return;
    }
    const next: TypebotIntegration = {
      ...agentFor,
      agent: {
        ...agentDraft,
        agentName: agentDraft.agentName.trim(),
        options: agentDraft.options
          .filter((option) => option.identifier.trim() || option.description.trim())
          .map((option, index) => ({ ...option, order: option.order || index + 1 }))
      }
    };
    saveTypebotIntegration(next);
    setRows(listTypebotIntegrations());
    setAgentFor(null);
    setAgentDraft(null);
    showNotice(`Agente de "${next.name}" configurado com ${next.agent.options.length} opção(ões).`);
  }

  function addAgentOption() {
    if (!agentDraft) return;
    setAgentDraft({
      ...agentDraft,
      options: [...agentDraft.options, { id: newOptionId(), order: agentDraft.options.length + 1, identifier: "", key: "", description: "" }]
    });
  }

  function updateAgentOption(id: string, patch: Partial<TypebotAgentOption>) {
    if (!agentDraft) return;
    setAgentDraft({ ...agentDraft, options: agentDraft.options.map((option) => (option.id === id ? { ...option, ...patch } : option)) });
  }

  function removeAgentOption(id: string) {
    if (!agentDraft) return;
    setAgentDraft({ ...agentDraft, options: agentDraft.options.filter((option) => option.id !== id) });
  }

  function toggle(integration: TypebotIntegration) {
    const next: TypebotIntegration = {
      ...integration,
      status: integration.status === "connected" ? "disconnected" : "connected",
      lastSync: "agora"
    };
    saveTypebotIntegration(next);
    setRows(listTypebotIntegrations());
    toast(next.status === "connected" ? `Integração "${next.name}" conectada.` : `Integração "${next.name}" desconectada.`);
  }

  function remove() {
    if (!deleting) return;
    deleteTypebotIntegration(deleting.id);
    setRows(listTypebotIntegrations());
    setDeleting(null);
    showNotice(`Integração "${deleting.name}" removida.`);
  }

  const connectedCount = rows.filter((row) => row.status === "connected").length;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Conectores"
        title="Integrações"
        description="Conectores Typebot da operação: expiração, ritmo de mensagens, palavras de controle e o agente que conduz cada conversa."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-ebot-green/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-green"><Webhook className="size-4" />{connectedCount} conectadas de {rows.length}</span>}
        action={<Button onClick={openCreate}><Plus className="size-4" />Adicionar Integração</Button>}
      />

      {notice ? (
        <div role="status" className="flex items-center justify-between rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar integração…" /></div>

      {filtered.length === 0 ? (
        <StatePanel icon={SearchX} title="Nenhuma integração encontrada" description="Ajuste a busca ou adicione uma integração Typebot." action={<Button size="sm" variant="secondary" onClick={openCreate}><Plus className="size-3.5" />Adicionar Integração</Button>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((integration) => (
            <article key={integration.id} data-integration-card data-integration-id={integration.id} className="flex flex-col rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)] transition hover:-translate-y-0.5 hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ebot-primary/[0.10] text-ebot-primaryText"><Webhook className="size-5" /></span>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-extrabold tracking-tight text-ebot-dark">{integration.name}</h2>
                    <p className="flex items-center gap-1 truncate text-[11px] font-bold text-ebot-muted"><Link2 className="size-3 shrink-0" />{integration.slug}</p>
                  </div>
                </div>
                <StatusBadge label={statusLabel[integration.status]} tone={statusTone[integration.status]} />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/30 p-3.5">
                <div className="col-span-2 min-w-0"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">URL</dt><dd className="truncate font-mono text-[12px] font-bold text-ebot-dark" title={integration.url}>{integration.url}</dd></div>
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Expira em</dt><dd className="mt-0.5 flex items-center gap-1 text-[12px] font-extrabold text-ebot-dark"><Timer className="size-3.5" />{integration.expireMinutes} min</dd></div>
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Intervalo</dt><dd className="mt-0.5 flex items-center gap-1 text-[12px] font-extrabold text-ebot-dark"><Zap className="size-3.5" />{integration.messageIntervalMs} ms</dd></div>
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Finalizar</dt><dd className="mt-0.5 font-mono text-[12px] font-extrabold text-ebot-dark">{integration.finishWord}</dd></div>
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Reiniciar</dt><dd className="mt-0.5 font-mono text-[12px] font-extrabold text-ebot-dark">{integration.restartWord}</dd></div>
              </dl>

              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-ebot-teal/[0.18] bg-ebot-teal/[0.06] px-3.5 py-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ebot-teal text-white"><Bot className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold text-ebot-dark">{integration.agent.agentName || "Agente sem nome"}</p>
                  <p className="truncate text-[11px] font-bold text-ebot-muted">{integration.agent.options.length} opções · fila {queueName(integration.agent.queueIntegrationId)}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => openAgent(integration)}><Settings2 className="size-3.5" />Configurar agente</Button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-ebot-border/[0.10] pt-3">
                <Button size="sm" variant={integration.status === "connected" ? "secondary" : "primary"} onClick={() => toggle(integration)}>
                  {integration.status === "connected" ? "Desconectar" : "Conectar"}
                </Button>
                <button type="button" onClick={() => openEdit(integration)} aria-label={`Editar ${integration.name}`} title="Editar integração" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-3.5" /></button>
                <button type="button" onClick={() => setDeleting(integration)} aria-label={`Remover ${integration.name}`} title="Remover integração" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500"><Trash2 className="size-3.5" /></button>
                <span className="ml-auto text-[11px] font-bold text-ebot-muted">sinc. {integration.lastSync}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(draft)}
        onClose={() => { setDraft(null); setEditing(null); }}
        title={editing ? "Editar integração" : "Adicionar Integração"}
        eyebrow="Sistema / Conectores"
        description="Dados de conexão do Typebot e comportamento da conversa."
        icon={Webhook}
        className="max-w-2xl"
      >
        {draft ? (
          <form onSubmit={(event) => { event.preventDefault(); save(); }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ModalField label="Nome" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Atendimento — Typebot principal" required />
              <ModalField label="URL" icon={Link2} value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} placeholder="https://typebot.suaempresa.com.br" required />
              <ModalField label="Typebot — Slug" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="recepcao-principal" required />
              <ModalField label="Tempo em minutos para expirar uma conversa" type="number" min={1} value={draft.expireMinutes} onChange={(event) => setDraft({ ...draft, expireMinutes: Number(event.target.value) })} />
              <ModalField label="Intervalo (ms) entre mensagens" type="number" min={0} value={draft.messageIntervalMs} onChange={(event) => setDraft({ ...draft, messageIntervalMs: Number(event.target.value) })} />
              <ModalField label="Palavra para finalizar o ticket" value={draft.finishWord} onChange={(event) => setDraft({ ...draft, finishWord: event.target.value })} placeholder="#sair" />
              <ModalField label="Palavra para reiniciar o fluxo" value={draft.restartWord} onChange={(event) => setDraft({ ...draft, restartWord: event.target.value })} placeholder="#reiniciar" />
            </div>
            <ModalField label="Mensagem de opção inválida" value={draft.invalidOptionMessage} onChange={(event) => setDraft({ ...draft, invalidOptionMessage: event.target.value })} />
            <ModalField label="Mensagem ao reiniciar a conversa" value={draft.restartMessage} onChange={(event) => setDraft({ ...draft, restartMessage: event.target.value })} />
            <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
              <Button type="button" variant="ghost" onClick={() => { setDraft(null); setEditing(null); }}>Cancelar</Button>
              <Button type="submit"><Check className="size-4" />{editing ? "Salvar alterações" : "Adicionar Integração"}</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(agentFor) && Boolean(agentDraft)}
        onClose={() => { setAgentFor(null); setAgentDraft(null); }}
        title={`Configurar agente — ${agentFor?.name ?? ""}`}
        eyebrow="Sistema / Conectores"
        description="Identidade, contexto e opções apresentadas pelo agente."
        icon={Bot}
        className="max-w-2xl"
      >
        {agentDraft ? (
          <form onSubmit={(event) => { event.preventDefault(); saveAgent(); }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ModalField label="Nome do agente" icon={Bot} value={agentDraft.agentName} onChange={(event) => setAgentDraft({ ...agentDraft, agentName: event.target.value })} placeholder="Ex.: Recepcionista virtual" required />
              <ModalField label="Nome da Empresa" icon={Building2} value={agentDraft.companyName} onChange={(event) => setAgentDraft({ ...agentDraft, companyName: event.target.value })} placeholder="Ex.: Ê-Bot" />
            </div>
            <ModalTextarea label="Descrição da Empresa" value={agentDraft.companyDescription} onChange={(event) => setAgentDraft({ ...agentDraft, companyDescription: event.target.value })} placeholder="O que a empresa faz…" />
            <ModalTextarea label="Regras do negócio" value={agentDraft.businessRules} onChange={(event) => setAgentDraft({ ...agentDraft, businessRules: event.target.value })} placeholder="Ex.: Nunca diagnosticar…" />
            <ModalTextarea label="Contexto da empresa" value={agentDraft.companyContext} onChange={(event) => setAgentDraft({ ...agentDraft, companyContext: event.target.value })} placeholder="Horários, filiais, canais…" />
            <ModalTextarea label="Informações extra" value={agentDraft.extraInfo} onChange={(event) => setAgentDraft({ ...agentDraft, extraInfo: event.target.value })} />
            <ModalTextarea label="Mensagem de apresentação" value={agentDraft.welcomeMessage} onChange={(event) => setAgentDraft({ ...agentDraft, welcomeMessage: event.target.value })} placeholder="Mensagem inicial do agente…" />

            <fieldset className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/25 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <legend className="px-1 text-sm font-extrabold text-ebot-dark">Opções de agente</legend>
                <Button type="button" size="sm" variant="secondary" onClick={addAgentOption}><Plus className="size-3.5" />Adicionar opção</Button>
              </div>
              <ModalSelect
                label="Integração de Fila"
                value={agentDraft.queueIntegrationId}
                onChange={(event) => setAgentDraft({ ...agentDraft, queueIntegrationId: event.target.value })}
              >
                <option value="">Selecione…</option>
                {queues.map((queue) => <option key={queue.id} value={queue.id}>{queue.name}</option>)}
              </ModalSelect>
              {agentDraft.options.length === 0 ? (
                <p className="mt-2 rounded-xl border border-dashed border-ebot-border/[0.18] p-3 text-center text-[12px] font-semibold text-ebot-muted">Nenhuma opção. Use “Adicionar opção”.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {agentDraft.options
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((option) => (
                      <li key={option.id} className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface p-2.5">
                        <div className="grid gap-2 sm:grid-cols-[64px_1fr_1fr]">
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Ordem</span>
                            <input type="number" min={1} value={option.order} onChange={(event) => updateAgentOption(option.id, { order: Math.max(1, Number(event.target.value)) })} className="h-10 w-full rounded-xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-2 text-[13px] font-bold text-ebot-dark outline-none" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Identificador</span>
                            <input value={option.identifier} onChange={(event) => updateAgentOption(option.id, { identifier: event.target.value })} placeholder="Ex.: agendar" className="h-10 w-full rounded-xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-2 text-[13px] font-semibold text-ebot-dark outline-none" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Chave</span>
                            <input value={option.key} onChange={(event) => updateAgentOption(option.id, { key: event.target.value })} placeholder="Ex.: 1" className="h-10 w-full rounded-xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-2 text-[13px] font-semibold text-ebot-dark outline-none" />
                          </label>
                        </div>
                        <div className="mt-2 flex items-start gap-2">
                          <label className="block flex-1">
                            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">Descrição</span>
                            <input value={option.description} onChange={(event) => updateAgentOption(option.id, { description: event.target.value })} placeholder="Ex.: Agendar agendamento" className="h-10 w-full rounded-xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-2 text-[13px] font-semibold text-ebot-dark outline-none" />
                          </label>
                          <button type="button" onClick={() => removeAgentOption(option.id)} aria-label="Remover opção" title="Remover opção" className="mt-5 flex size-10 shrink-0 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-red/10 hover:text-ebot-red"><Trash2 className="size-4" /></button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </fieldset>

            <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
              <Button type="button" variant="ghost" onClick={() => { setAgentFor(null); setAgentDraft(null); }}>Cancelar</Button>
              <Button type="submit"><Check className="size-4" />Salvar agente</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Remover integração?"
        description={`A integração "${deleting?.name ?? ""}" será removida (dados locais).`}
        confirmLabel="Remover integração"
      />

      <p className="flex items-start gap-1.5 rounded-[20px] border border-ebot-border/[0.12] bg-ebot-surface/70 px-4 py-3 text-[11px] font-bold leading-4 text-ebot-muted">
        <ListOrdered className="mt-0.5 size-3.5 shrink-0 text-ebot-green" />
        Os canais de WhatsApp, Instagram e e-mail continuam sendo gerenciados na página de Canais. Aqui ficam somente os conectores Typebot com seus agentes.
      </p>
    </div>
  );
}
