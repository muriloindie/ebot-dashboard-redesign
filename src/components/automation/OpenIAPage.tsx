"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  Check,
  KeyRound,
  LayoutGrid,
  List,
  ListOrdered,
  Mic,
  Pencil,
  Plus,
  SearchX,
  Sparkles,
  Thermometer,
  Trash2,
  Type,
  X
} from "lucide-react";
import { deletePrompt, listPrompts, newPromptId, savePrompt } from "@/lib/automation/n8nService";
import { OPENAI_VOICES, type OpenAIVoice, type Prompt, type PromptVoiceMode } from "@/lib/automation/types";
import { listQueues } from "@/lib/company/companyService";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { Toggle } from "@/components/ui/Toggle";
import { PageHeader, SearchField, StatePanel, StatusBadge } from "@/components/ui/Week1Primitives";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { cn } from "@/lib/cn";

type Draft = {
  id: string;
  name: string;
  apiKey: string;
  prompt: string;
  queueId: string;
  queueName: string;
  voiceMode: PromptVoiceMode;
  voice: OpenAIVoice;
  voiceApiKey: string;
  voiceRegion: string;
  temperature: number;
  maxTokens: number;
  maxHistoryMessages: number;
  active: boolean;
};

function toDraft(prompt?: Prompt, fallbackQueue?: { id: string; name: string }): Draft {
  return {
    id: prompt?.id ?? "",
    name: prompt?.name ?? "",
    apiKey: prompt?.apiKey ?? "",
    prompt: prompt?.prompt ?? "",
    queueId: prompt?.queueId ?? fallbackQueue?.id ?? "",
    queueName: prompt?.queueName ?? fallbackQueue?.name ?? "",
    voiceMode: prompt?.voiceMode ?? "texto",
    voice: prompt?.voice ?? "nova",
    voiceApiKey: prompt?.voiceApiKey ?? "",
    voiceRegion: prompt?.voiceRegion ?? "pt-BR",
    temperature: prompt?.temperature ?? 0.4,
    maxTokens: prompt?.maxTokens ?? 800,
    maxHistoryMessages: prompt?.maxHistoryMessages ?? 12,
    active: prompt?.active ?? true
  };
}

export function OpenIAPage() {
  const { toast } = useDemo();
  const [prompts, setPrompts] = useState<Prompt[]>(() => listPrompts());
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"cards" | "lista">("cards");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState<Prompt | null>(null);
  const [deleting, setDeleting] = useState<Prompt | null>(null);
  const [notice, setNotice] = useState("");

  const queues = useMemo(() => listQueues(), []);

  useEffect(() => setPrompts(listPrompts()), []);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  const filtered = useMemo(() => {
    return prompts.filter((prompt) => `${prompt.name} ${prompt.prompt} ${prompt.queueName}`.toLowerCase().includes(query.toLowerCase()));
  }, [prompts, query]);

  function openCreate() {
    setEditing(null);
    setDraft(toDraft(undefined, queues[0] ? { id: queues[0].id, name: queues[0].name } : undefined));
  }

  function openEdit(prompt: Prompt) {
    setEditing(prompt);
    setDraft(toDraft(prompt));
  }

  function toggle(prompt: Prompt) {
    savePrompt({ ...prompt, active: !prompt.active });
    setPrompts(listPrompts());
    toast(prompt.active ? `Prompt "${prompt.name}" pausado.` : `Prompt "${prompt.name}" ativado.`);
  }

  function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast("Informe o nome do prompt.", "warning");
      return;
    }
    if (!draft.apiKey.trim()) {
      toast("Informe a API key.", "warning");
      return;
    }
    if (!draft.prompt.trim()) {
      toast("Escreva o prompt.", "warning");
      return;
    }
    if (!draft.queueId) {
      toast("Selecione a fila do prompt.", "warning");
      return;
    }
    if (draft.voiceMode === "voz" && !draft.voiceApiKey.trim()) {
      toast("Informe a API da voz.", "warning");
      return;
    }
    const queue = queues.find((item) => item.id === draft.queueId);
    const base = editing ?? prompts.find((row) => row.id === draft.id);
    const next: Prompt = {
      id: editing?.id ?? newPromptId(),
      name: draft.name.trim(),
      apiKey: draft.apiKey.trim(),
      prompt: draft.prompt.trim(),
      queueId: draft.queueId,
      queueName: queue?.name ?? draft.queueName,
      voiceMode: draft.voiceMode,
      voice: draft.voiceMode === "voz" ? draft.voice : undefined,
      voiceApiKey: draft.voiceMode === "voz" ? draft.voiceApiKey.trim() : undefined,
      voiceRegion: draft.voiceMode === "voz" ? draft.voiceRegion.trim() || "pt-BR" : undefined,
      temperature: draft.temperature,
      maxTokens: Math.max(1, Math.round(draft.maxTokens)),
      maxHistoryMessages: Math.max(1, Math.round(draft.maxHistoryMessages)),
      active: draft.active,
      updatedAt: "agora"
    };
    savePrompt(next);
    setPrompts(listPrompts());
    setDraft(null);
    setEditing(null);
    showNotice(base ? `Prompt "${next.name}" atualizado.` : `Prompt "${next.name}" criado.`);
  }

  function remove() {
    if (!deleting) return;
    deletePrompt(deleting.id);
    setPrompts(listPrompts());
    setDeleting(null);
    showNotice(`Prompt "${deleting.name}" removido.`);
  }

  const activeCount = prompts.filter((prompt) => prompt.active).length;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Automação / Inteligência"
        title="OpenAI — Prompts"
        description="Prompts que conduzem as conversas da IA: chave, fila vinculada, voz ou texto, temperatura e limites de resposta e histórico."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-ebot-teal/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-teal"><BrainCircuit className="size-4" />{activeCount} ativos de {prompts.length}</span>}
        action={<Button onClick={openCreate}><Plus className="size-4" />Adicionar Prompt</Button>}
      />

      {notice ? (
        <div role="status" className="flex items-center justify-between rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar prompt…" /></div>
        <ViewSwitch
          views={[{ id: "cards", label: "Cards", icon: LayoutGrid }, { id: "lista", label: "Lista", icon: List }]}
          value={view}
          onChange={(id) => setView(id as "cards" | "lista")}
          className="self-end sm:self-auto"
        />
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={SearchX}
          title="Nenhum prompt encontrado"
          description="Ajuste a busca ou crie um novo prompt para a operação."
          action={<Button size="sm" variant="secondary" onClick={openCreate}><Plus className="size-3.5" />Adicionar Prompt</Button>}
        />
      ) : view === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((prompt) => (
            <article key={prompt.id} data-prompt-card data-prompt-id={prompt.id} className="flex flex-col rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)] transition hover:-translate-y-0.5 hover:border-ebot-primary/25 hover:shadow-ebot">
              <div className="flex items-start justify-between gap-3">
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", prompt.active ? "bg-ebot-teal/[0.12] text-ebot-teal" : "bg-ebot-surfaceMuted text-ebot-muted")}>
                  <Sparkles className="size-5" />
                </span>
                <StatusBadge label={prompt.active ? "Ativo" : "Pausado"} tone={prompt.active ? "green" : "neutral"} />
              </div>
              <h2 className="mt-3 text-base font-extrabold tracking-tight text-ebot-dark">{prompt.name}</h2>
              <p className="mt-1 line-clamp-2 flex-1 text-[13px] leading-5 text-ebot-muted">{prompt.prompt}</p>
              <dl className="mt-4 space-y-1.5 rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/30 px-3 py-2.5 text-[12px] font-bold">
                <div className="flex items-center justify-between gap-2"><dt className="flex items-center gap-1.5 uppercase tracking-wider text-ebot-muted"><ListOrdered className="size-3.5" />Fila</dt><dd className="truncate text-ebot-dark">{prompt.queueName}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt className="flex items-center gap-1.5 uppercase tracking-wider text-ebot-muted">{prompt.voiceMode === "voz" ? <Mic className="size-3.5" /> : <Type className="size-3.5" />}{prompt.voiceMode === "voz" ? `Voz · ${prompt.voice}` : "Texto"}</dt><dd className="flex items-center gap-1 text-ebot-dark"><Thermometer className="size-3.5" />{prompt.temperature.toFixed(1)}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt className="uppercase tracking-wider text-ebot-muted">Tokens / Histórico</dt><dd className="tabular-nums text-ebot-dark">{prompt.maxTokens} · {prompt.maxHistoryMessages}</dd></div>
              </dl>
              <div className="mt-3 flex items-center gap-1.5 border-t border-ebot-border/[0.10] pt-3">
                <Toggle checked={prompt.active} onChange={() => toggle(prompt)} statusOn="Ativo" statusOff="Pausado" className="flex-1 border-0 !bg-transparent !px-0 !py-0" />
                <button type="button" onClick={() => openEdit(prompt)} aria-label={`Editar ${prompt.name}`} title="Editar prompt" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-3.5" /></button>
                <button type="button" onClick={() => setDeleting(prompt)} aria-label={`Remover ${prompt.name}`} title="Remover prompt" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500"><Trash2 className="size-3.5" /></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
          <ul className="divide-y divide-ebot-border/[0.10]" aria-label="Lista de prompts">
            {filtered.map((prompt) => (
              <li key={prompt.id} data-prompt-item data-prompt-id={prompt.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5 transition hover:bg-ebot-primary/[0.035] sm:flex-nowrap">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", prompt.active ? "bg-ebot-teal/[0.12] text-ebot-teal" : "bg-ebot-surfaceMuted text-ebot-muted")}><Sparkles className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-ebot-dark">{prompt.name}</p>
                  <p className="truncate text-xs font-semibold text-ebot-muted">{prompt.queueName} · {prompt.voiceMode === "voz" ? `Voz ${prompt.voice}` : "Texto"} · {prompt.temperature.toFixed(1)} · {prompt.maxTokens} tokens</p>
                </div>
                <StatusBadge label={prompt.active ? "Ativo" : "Pausado"} tone={prompt.active ? "green" : "neutral"} />
                <Toggle checked={prompt.active} onChange={() => toggle(prompt)} statusOn="Ativo" statusOff="Pausado" className="!w-auto border-0 !bg-transparent !px-1 !py-0" />
                <div className="flex shrink-0 items-center gap-0.5">
                  <button type="button" onClick={() => openEdit(prompt)} aria-label={`Editar ${prompt.name}`} title="Editar prompt" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-ebot-primary/10 hover:text-ebot-primary"><Pencil className="size-3.5" /></button>
                  <button type="button" onClick={() => setDeleting(prompt)} aria-label={`Remover ${prompt.name}`} title="Remover prompt" className="flex size-9 items-center justify-center rounded-xl text-ebot-muted transition hover:bg-red-500/10 hover:text-red-500"><Trash2 className="size-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        open={Boolean(draft)}
        onClose={() => { setDraft(null); setEditing(null); }}
        title={editing ? "Editar prompt" : "Adicionar Prompt"}
        eyebrow="Automação / Inteligência"
        description="Vincule o prompt a uma fila e defina como a IA responde: texto ou voz."
        icon={Sparkles}
        className="max-w-2xl"
      >
        {draft ? (
          <form onSubmit={(event) => { event.preventDefault(); save(); }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ModalField label="Nome" icon={Sparkles} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Triagem de atendimento" required />
              <ModalField label="API Key" icon={KeyRound} value={draft.apiKey} onChange={(event) => setDraft({ ...draft, apiKey: event.target.value })} placeholder="sk-…" required />
            </div>
            <ModalTextarea label="Prompt" value={draft.prompt} onChange={(event) => setDraft({ ...draft, prompt: event.target.value })} placeholder="Instruções e persona da IA…" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <ModalSelect
                label="Fila (somente uma)"
                value={draft.queueId}
                onChange={(event) => {
                  const queue = queues.find((item) => item.id === event.target.value);
                  setDraft({ ...draft, queueId: event.target.value, queueName: queue?.name ?? "" });
                }}
              >
                <option value="">Selecione…</option>
                {queues.map((queue) => <option key={queue.id} value={queue.id}>{queue.name}</option>)}
              </ModalSelect>
              <ModalSelect label="Voz" value={draft.voiceMode} onChange={(event) => setDraft({ ...draft, voiceMode: event.target.value as PromptVoiceMode })}>
                <option value="texto">Texto</option>
                <option value="voz">Voz</option>
              </ModalSelect>
            </div>
            {draft.voiceMode === "voz" ? (
              <div className="grid gap-4 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 p-3 sm:grid-cols-3">
                <ModalSelect label="Voz (OpenAI)" icon={Mic} value={draft.voice} onChange={(event) => setDraft({ ...draft, voice: event.target.value as OpenAIVoice })}>
                  {OPENAI_VOICES.map((voice) => <option key={voice} value={voice}>{voice}</option>)}
                </ModalSelect>
                <ModalField label="API da voz" icon={KeyRound} value={draft.voiceApiKey} onChange={(event) => setDraft({ ...draft, voiceApiKey: event.target.value })} placeholder="sk-…" required />
                <ModalField label="Região da voz" value={draft.voiceRegion} onChange={(event) => setDraft({ ...draft, voiceRegion: event.target.value })} placeholder="pt-BR" />
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="prompt-temp" className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Temperatura · {draft.temperature.toFixed(1)}</label>
                <input id="prompt-temp" type="range" min={0} max={2} step={0.1} value={draft.temperature} onChange={(event) => setDraft({ ...draft, temperature: Number(event.target.value) })} className="h-11 w-full accent-ebot-primary" />
              </div>
              <ModalField label="Máximo de tokens" type="number" min={1} value={draft.maxTokens} onChange={(event) => setDraft({ ...draft, maxTokens: Number(event.target.value) })} />
              <ModalField label="Máx. msgs no histórico" type="number" min={1} value={draft.maxHistoryMessages} onChange={(event) => setDraft({ ...draft, maxHistoryMessages: Number(event.target.value) })} />
            </div>
            <Toggle checked={draft.active} onChange={(checked) => setDraft({ ...draft, active: checked })} label="Prompt ativo" hint="Prompts pausados não são usados pela IA." icon={BrainCircuit} />
            <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
              <Button type="button" variant="ghost" onClick={() => { setDraft(null); setEditing(null); }}>Cancelar</Button>
              <Button type="submit"><Check className="size-4" />{editing ? "Salvar alterações" : "Adicionar Prompt"}</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Remover prompt?"
        description={`O prompt "${deleting?.name ?? ""}" deixará de ser usado pela IA (dados locais).`}
        confirmLabel="Remover prompt"
      />
    </div>
  );
}
