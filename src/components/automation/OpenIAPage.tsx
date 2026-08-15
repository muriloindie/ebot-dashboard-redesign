"use client";

import { useMemo, useState } from "react";
import { BrainCircuit, CheckCircle2, Handshake, MessageCircle, Pause, Pencil, Play, ShieldAlert, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import { listAssistants, listKnowledgeBases, saveAssistant } from "@/lib/automation/n8nService";
import type { Assistant } from "@/lib/automation/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";

const models = ["GPT 5.5 Fast", "GPT 5.5", "GPT 4.1 Mini"];

export function OpenIAPage() {
  const { toast } = useDemo();
  const [assistants, setAssistants] = useState<Assistant[]>(() => listAssistants());
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Assistant | null>(null);
  const [draft, setDraft] = useState<Assistant | null>(null);
  const [saving, setSaving] = useState(false);

  const bases = useMemo(() => listKnowledgeBases(), []);

  const filtered = useMemo(() => {
    return assistants.filter((assistant) => `${assistant.name} ${assistant.description} ${assistant.persona}`.toLowerCase().includes(query.toLowerCase()));
  }, [assistants, query]);

  const stats: StatItem[] = useMemo(() => {
    const active = assistants.filter((assistant) => assistant.status === "active");
    const conversations = active.reduce((total, assistant) => total + assistant.metrics.conversations7d, 0);
    const cost = active.reduce((total, assistant) => total + parseFloat(assistant.metrics.cost7d.replace("R$ ", "").replace(",", ".")), 0);
    return [
      { id: "assistants", label: "Assistentes", value: String(assistants.length), hint: `${active.length} ativos`, tone: "blue", icon: BrainCircuit },
      { id: "conversations", label: "Conversas (7 dias)", value: conversations.toLocaleString("pt-BR"), hint: "conduzidas pela IA", tone: "green", icon: MessageCircle },
      { id: "resolution", label: "Resolução média", value: `${Math.round(active.reduce((total, assistant) => total + assistant.metrics.resolutionRate, 0) / Math.max(active.length, 1))}%`, hint: "sem mão humana", tone: "teal", icon: CheckCircle2 },
      { id: "cost", label: "Custo (7 dias)", value: `R$ ${cost.toFixed(2).replace(".", ",")}`, hint: "todos os ativos", tone: "orange", icon: Wallet }
    ];
  }, [assistants]);

  function toggle(assistant: Assistant) {
    const next: Assistant = { ...assistant, status: assistant.status === "active" ? "paused" : "active" };
    saveAssistant(next);
    setAssistants(listAssistants());
    if (selected?.id === assistant.id) setSelected(next);
    toast(next.status === "active" ? `Assistente "${next.name}" ativado.` : `Assistente "${next.name}" pausado.`);
  }

  function openConfig(assistant: Assistant) {
    setDraft(JSON.parse(JSON.stringify(assistant)) as Assistant);
    setSelected(assistant);
  }

  function saveDraft() {
    if (!draft) return;
    setSaving(true);
    window.setTimeout(() => {
      saveAssistant(draft);
      setAssistants(listAssistants());
      setSelected(draft);
      setSaving(false);
      toast(`Configurações do assistente "${draft.name}" salvas.`);
    }, 600);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Automação / Inteligência"
        title="OpenIA"
        description="Assistentes que conduzem conversas com pacientes usando base de conhecimento, tom definido e regras de handoff para a equipe humana."
      />

      <StatStrip items={stats} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar assistente…" /></div>
        <Button onClick={() => toast("Criação de assistente em construção nesta etapa.")}><Sparkles className="size-4" />Novo assistente</Button>
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={BrainCircuit} title="Nenhum assistente encontrado" description="Ajuste a busca para encontrar o assistente desejado." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((assistant) => (
            <article key={assistant.id} className="flex flex-col rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5 shadow-[0_8px_24px_rgba(38,53,50,0.04)] transition hover:border-clinical-blue/25 hover:shadow-clinical">
              <div className="flex items-start justify-between gap-3">
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", assistant.status === "active" ? "bg-clinical-teal/[0.12] text-clinical-teal" : "bg-clinical-surfaceMuted text-clinical-muted")}>
                  <BrainCircuit className="size-5" />
                </span>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold", assistant.status === "active" ? "bg-clinical-green/[0.12] text-clinical-green" : "bg-clinical-surfaceMuted text-clinical-muted")}>
                  <span className={cn("size-1.5 rounded-full", assistant.status === "active" ? "bg-clinical-green" : "bg-clinical-muted")} />
                  {assistant.status === "active" ? "Ativo" : "Pausado"}
                </span>
              </div>
              <h2 className="mt-3 text-base font-extrabold tracking-tight text-clinical-dark">{assistant.name}</h2>
              <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-clinical-muted">{assistant.description}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3 text-center">
                <div>
                  <p className="text-lg font-extrabold text-clinical-dark">{assistant.metrics.resolutionRate}%</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-clinical-muted">Resolução</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-clinical-dark">{assistant.metrics.handoffRate}%</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-clinical-muted">Handoff</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-clinical-dark">{assistant.metrics.conversations7d > 0 ? assistant.metrics.conversations7d.toLocaleString("pt-BR") : "—"}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-clinical-muted">7 dias</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate"><Sparkles className="size-3" />{assistant.model}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate"><Users className="size-3" />{assistant.knowledgeBaseIds.length} bases</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate"><Wallet className="size-3" />{assistant.metrics.cost7d}</span>
              </div>

              <div className="mt-4 space-y-2 border-t border-clinical-border/[0.10] pt-4">
                <Toggle
                  checked={assistant.status === "active"}
                  onChange={() => toggle(assistant)}
                  statusOn="Em operação"
                  statusOff="Em pausa"
                  iconOn={Play}
                  iconOff={Pause}
                  accent="amber"
                />
                <Button variant="secondary" size="sm" className="w-full" onClick={() => openConfig(assistant)}><Pencil className="size-4" />Configurar</Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? "Assistente"} description={selected?.description} width="max-w-3xl">
        {draft ? (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Resolução", value: `${draft.metrics.resolutionRate}%`, icon: CheckCircle2, tone: "text-clinical-green" },
                { label: "Handoff", value: `${draft.metrics.handoffRate}%`, icon: Handshake, tone: "text-clinical-orange" },
                { label: "Satisfação", value: draft.metrics.csat.toFixed(1), icon: TrendingUp, tone: "text-clinical-blue" }
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                    <Icon className={cn("size-4", metric.tone)} />
                    <p className="mt-2 text-xl font-extrabold text-clinical-dark">{metric.value}</p>
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-clinical-muted">{metric.label}</p>
                  </div>
                );
              })}
            </section>

            <section>
              <h3 className="mb-2 text-sm font-extrabold text-clinical-dark">Configuração geral</h3>
              <div className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="asst-name" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Nome</label>
                    <input id="asst-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface/70 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
                  </div>
                  <div>
                    <label htmlFor="asst-model" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Modelo</label>
                    <select id="asst-model" value={draft.model} onChange={(event) => setDraft({ ...draft, model: event.target.value })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface/70 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                      {models.map((model) => <option key={model}>{model}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="asst-persona" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Persona e instruções iniciais</label>
                  <textarea id="asst-persona" value={draft.persona} onChange={(event) => setDraft({ ...draft, persona: event.target.value })} rows={4} className="w-full resize-none rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface/70 px-3 py-2.5 text-sm font-semibold leading-6 text-clinical-dark outline-none focus:border-clinical-blue/45" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <label htmlFor="asst-temp" className="text-xs font-extrabold text-clinical-slate">Temperatura</label>
                  <input id="asst-temp" type="range" min={0} max={1} step={0.1} value={draft.temperature} onChange={(event) => setDraft({ ...draft, temperature: Number(event.target.value) })} className="flex-1 accent-clinical-blue" />
                  <span className="rounded-full bg-clinical-surfaceMuted px-2 py-0.5 text-[11px] font-extrabold text-clinical-slate">{draft.temperature.toFixed(1)}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-extrabold text-clinical-dark">Base de conhecimento</h3>
              <div className="flex flex-wrap gap-1.5">
                {bases.map((base) => {
                  const active = draft.knowledgeBaseIds.includes(base.id);
                  return (
                    <button key={base.id} type="button" onClick={() => setDraft({ ...draft, knowledgeBaseIds: active ? draft.knowledgeBaseIds.filter((id) => id !== base.id) : [...draft.knowledgeBaseIds, base.id] })} className={cn("rounded-full px-3 py-1.5 text-[11px] font-extrabold transition", active ? "bg-clinical-blue/[0.10] text-clinical-blueText ring-1 ring-clinical-blue/30" : "bg-clinical-surfaceMuted text-clinical-muted hover:text-clinical-dark")}>
                      {base.name}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-clinical-dark"><Handshake className="size-4 text-clinical-orange" />Handoff para a equipe</h3>
              <div className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="asst-threshold" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Confiança mínima para responders</label>
                    <div className="flex items-center gap-2">
                      <input id="asst-threshold" type="range" min={50} max={95} step={5} value={draft.handoff.confidenceThreshold} onChange={(event) => setDraft({ ...draft, handoff: { ...draft.handoff, confidenceThreshold: Number(event.target.value) } })} className="flex-1 accent-clinical-blue" />
                      <span className="rounded-full bg-clinical-surfaceMuted px-2 py-0.5 text-[11px] font-extrabold text-clinical-slate">{draft.handoff.confidenceThreshold}%</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="asst-queue" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Fila de destino</label>
                    <select id="asst-queue" value={draft.handoff.targetQueue} onChange={(event) => setDraft({ ...draft, handoff: { ...draft.handoff, targetQueue: event.target.value } })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface/70 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                      {["Recepção", "Prioridade", "Exames", "Cardiologia"].map((queue) => <option key={queue}>{queue}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-1.5 text-xs font-extrabold text-clinical-slate">Condições que acionam o handoff</p>
                  <ul className="space-y-1.5">
                    {draft.handoff.conditions.map((condition, index) => (
                      <li key={condition} className="flex items-center gap-2">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-clinical-orange/[0.12] text-[10px] font-extrabold text-clinical-orange">{index + 1}</span>
                        <span className="text-[13px] font-semibold text-clinical-slate">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-clinical-dark"><ShieldAlert className="size-4 text-clinical-teal" />Salvaguardas</h3>
              <ul className="space-y-1.5">
                {draft.guardrails.map((guardrail) => (
                  <li key={guardrail} className="inline-flex items-start gap-2 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-3 py-2.5 text-[13px] font-semibold text-clinical-slate">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-clinical-teal" />
                    {guardrail}
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex items-center justify-between border-t border-clinical-border/[0.10] pt-4">
              <p className="text-[11px] font-bold text-clinical-muted">
                {draft.metrics.conversations7d.toLocaleString("pt-BR")} conversas · {draft.metrics.tokens7d} tokens · {draft.metrics.cost7d} nos últimos 7 dias
              </p>
              <Button onClick={saveDraft} disabled={saving}>{saving ? "Salvando…" : "Salvar configurações"}</Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}