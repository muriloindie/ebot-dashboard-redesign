"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardList,
  Download,
  ExternalLink,
  Plug,
  RadioTower,
  Search,
  Sparkles,
  Star,
  Store,
  Workflow,
  Zap
} from "lucide-react";
import { automationProtocols, automationTemplates } from "@/data/automationMock";
import { createWorkflowFromTemplate, listKnowledgeBases } from "@/lib/automation/n8nService";
import type { AutomationTemplate, FlowChannel } from "@/lib/automation/types";
import { getNodeVisual } from "@/lib/automation/nodeCatalog";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { PageHeader, SearchField, SegmentedTabs, StatePanel } from "@/components/ui/Week1Primitives";
import { CategoryChip, MiniFlowPreview, StepIndicator, templateCategoryVisuals, toneChip } from "./shared";
import { cn } from "@/lib/cn";

const ALL = "Todos";
const categories = [ALL, "Agendamento", "Exames", "Pós-consulta", "Triagem", "Relacionamento"];
const channelOptions: FlowChannel[] = ["WhatsApp", "Instagram", "Webchat", "Todos os canais"];

const stats: StatItem[] = [
  { id: "available", label: "Templates disponíveis", value: String(automationTemplates.length), hint: "criados pela Ê-Bot", tone: "blue", icon: Store },
  { id: "installs", label: "Aplicações no total", value: "8.1 mil", hint: "em clínicas", tone: "green", icon: Download },
  { id: "rating", label: "Avaliação média", value: "4,7", hint: "de 5,0", tone: "teal", icon: Star },
  { id: "top", label: "Mais aplicado", value: "Triagem IA", hint: "1.531 clínicas", tone: "orange", icon: Zap }
];

export function TemplatesPage() {
  const router = useRouter();
  const { toast } = useDemo();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [selected, setSelected] = useState<AutomationTemplate | null>(null);
  const [applying, setApplying] = useState<AutomationTemplate | null>(null);

  const filtered = useMemo(() => {
    return automationTemplates.filter((template) => {
      const matchesCategory = category === ALL || template.category === category;
      const matchesQuery = `${template.name} ${template.tagline} ${template.description}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  function startApply(template: AutomationTemplate) {
    setSelected(null);
    setApplying(template);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Automação / Loja de templates"
        title="Templates de automação"
        description="Automações de atendimento prontas para clínicas, criadas pela Ê-Bot. Escolha um template, configure canal, protocolo e base de conhecimento, e ative em Fluxos de automação."
        aside={
          <span className="inline-flex items-center gap-2 rounded-full bg-clinical-blue/[0.08] px-3 py-2 text-xs font-extrabold text-clinical-blueText">
            <Sparkles className="size-4" />
            Powered by n8n
          </span>
        }
        action={<Button variant="secondary" onClick={() => router.push("/fluxos-automacao")}><Workflow className="size-4" />Ver fluxos ativos</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchField value={query} onChange={setQuery} placeholder="Buscar template por nome ou objetivo" />
        </div>
        <SegmentedTabs
          tabs={categories.map((item) => ({
            id: item,
            label: item,
            count: item === ALL ? automationTemplates.length : automationTemplates.filter((template) => template.category === item).length
          }))}
          value={category}
          onChange={setCategory}
        />
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={Search} title="Nenhum template encontrado" description="Tente outro termo ou escolha outra categoria." action={<Button size="sm" variant="secondary" onClick={() => { setQuery(""); setCategory(ALL); }}>Limpar busca</Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((template) => {
            const visual = templateCategoryVisuals[template.category];
            const Icon = visual.icon;
            const pendingCredentials = template.credentials.filter((credential) => !credential.connected);
            return (
              <article key={template.id} className="flex flex-col rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5 shadow-[0_8px_24px_rgba(38,53,50,0.04)] transition hover:border-clinical-blue/25 hover:shadow-clinical">
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", toneChip[visual.tone])}>
                    <Icon className="size-5" />
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate">
                    <Star className="size-3 text-clinical-orange" />
                    {template.rating.toFixed(1)}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-extrabold tracking-tight text-clinical-dark">{template.name}</h2>
                <p className="mt-1 text-[13px] leading-5 text-clinical-muted">{template.tagline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <CategoryChip category={template.category} />
                  <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate">
                    <RadioTower className="size-3" />
                    {template.channel}
                  </span>
                  {template.requiresKnowledgeBase ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-clinical-teal/[0.10] px-2.5 py-1 text-[11px] font-extrabold text-clinical-teal">
                      <BookOpen className="size-3" />
                      Base de conhecimento
                    </span>
                  ) : null}
                  {template.requiresProtocol ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-clinical-blue/[0.08] px-2.5 py-1 text-[11px] font-extrabold text-clinical-blueText">
                      <ClipboardList className="size-3" />
                      Protocolo
                    </span>
                  ) : null}
                </div>
                <div className="mt-4">
                  <MiniFlowPreview template={template} compact />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-clinical-border/[0.10] pt-3 text-[11px] font-bold text-clinical-muted">
                  <span className="inline-flex items-center gap-1"><Download className="size-3.5" />{template.installs.toLocaleString("pt-BR")} aplicações</span>
                  {pendingCredentials.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-clinical-orange"><Plug className="size-3.5" />{pendingCredentials.length} integração pendente</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-clinical-green"><BadgeCheck className="size-3.5" />Integrações conectadas</span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelected(template)}>Ver detalhes</Button>
                  <Button size="sm" className="flex-1" onClick={() => startApply(template)}><Zap className="size-4" />Aplicar</Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? "Template"} description={selected?.tagline} width="max-w-2xl">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryChip category={selected.category} />
              <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate"><RadioTower className="size-3" />{selected.channel}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate"><Download className="size-3" />{selected.installs.toLocaleString("pt-BR")} aplicações</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate"><Star className="size-3 text-clinical-orange" />{selected.rating.toFixed(1)} de 5,0</span>
            </div>

            <p className="text-sm leading-6 text-clinical-slate">{selected.description}</p>

            <section>
              <h3 className="mb-2 text-sm font-extrabold text-clinical-dark">Como o fluxo funciona</h3>
              <MiniFlowPreview template={selected} />
            </section>

            <section>
              <h3 className="mb-2 text-sm font-extrabold text-clinical-dark">Estrutura do fluxo</h3>
              <div className="space-y-2">
                {selected.nodes.map((node, index) => {
                  const visual = getNodeVisual(node.type);
                  const Icon = visual.icon;
                  return (
                    <div key={`${selected.id}-row-${index}`} className="flex items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-3.5 py-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-clinical-blue/[0.09] text-clinical-blue"><Icon className="size-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold text-clinical-dark">{node.name}</span>
                        <span className="block text-xs font-semibold text-clinical-muted">{visual.label}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-extrabold text-clinical-dark">Integrações necessárias</h3>
              <div className="space-y-2">
                {selected.credentials.map((credential) => (
                  <div key={credential.id} className="flex items-center justify-between gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-3.5 py-2.5">
                    <span className="flex items-center gap-2 text-sm font-bold text-clinical-dark"><Plug className="size-4 text-clinical-blue" />{credential.name}</span>
                    {credential.connected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-clinical-green/[0.12] px-2.5 py-1 text-[11px] font-extrabold text-clinical-green"><BadgeCheck className="size-3" />Conectada</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-clinical-orange/[0.12] px-2.5 py-1 text-[11px] font-extrabold text-clinical-orange"><ExternalLink className="size-3" />Configurar</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <Button className="w-full" onClick={() => startApply(selected)}><Zap className="size-4" />Aplicar template</Button>
          </div>
        ) : null}
      </Drawer>

      {applying ? <ApplyTemplateWizard template={applying} onClose={() => setApplying(null)} onApplied={(workflowId, name) => { setApplying(null); toast(`Template "${name}" aplicado. Fluxo criado como rascunho.`); router.push(`/fluxos-automacao?novo=${workflowId}`); }} /> : null}
    </div>
  );
}

function ApplyTemplateWizard({ template, onClose, onApplied }: { template: AutomationTemplate; onClose: () => void; onApplied: (workflowId: string, name: string) => void }) {
  const router = useRouter();
  const knowledgeBases = useMemo(() => listKnowledgeBases(), []);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(template.name);
  const [protocol, setProtocol] = useState(template.requiresProtocol ? automationProtocols[0].id : "livre");
  const [channel, setChannel] = useState<FlowChannel>(template.channel === "Todos os canais" ? "WhatsApp" : template.channel);
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string>(template.requiresKnowledgeBase ? knowledgeBases[0]?.id ?? "" : "");
  const steps = ["Nome e protocolo", "Canal", "Integrações", template.requiresKnowledgeBase ? "Base de conhecimento" : "Revisão"];

  const pendingCredentials = template.credentials.filter((credential) => !credential.connected);
  const canContinue = step === 0 ? name.trim().length > 0 : true;

  function confirm() {
    const selectedProtocol = protocol === "livre" ? null : automationProtocols.find((item) => item.id === protocol) ?? null;
    const workflow = createWorkflowFromTemplate(template, {
      name: name.trim(),
      channel,
      protocolId: selectedProtocol?.id ?? null,
      protocolName: selectedProtocol?.name ?? null,
      knowledgeBaseId: template.requiresKnowledgeBase && knowledgeBaseId ? knowledgeBaseId : null
    });
    onApplied(workflow.id, workflow.name);
  }

  return (
    <Modal open onClose={onClose} title={`Aplicar "${template.name}"`} eyebrow="Loja de templates" description="Configure a automação antes de levá-la para Fluxos de automação." icon={Store} className="max-w-2xl">
      <StepIndicator steps={steps} current={step} />

      {step === 0 ? (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-clinical-dark">Nome do fluxo</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Confirmação D-1 Unidade Centro" className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none transition focus:border-clinical-blue/45 focus:bg-clinical-surface focus:ring-2 focus:ring-clinical-blue/10" />
          </label>
          <div>
            <span className="mb-1.5 block text-sm font-extrabold text-clinical-dark">Vincular a um protocolo</span>
            <div className="space-y-2">
              <button type="button" onClick={() => setProtocol("livre")} className={cn("flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition", protocol === "livre" ? "border-clinical-blue/40 bg-clinical-blue/[0.08] text-clinical-blueText" : "border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 text-clinical-slate hover:border-clinical-blue/25")}>
                <span className="flex items-center gap-2"><Workflow className="size-4" />Somente fluxo de trabalho (sem protocolo)</span>
                {protocol === "livre" ? <Check className="size-4" /> : null}
              </button>
              {automationProtocols.map((item) => (
                <button key={item.id} type="button" onClick={() => setProtocol(item.id)} className={cn("flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition", protocol === item.id ? "border-clinical-blue/40 bg-clinical-blue/[0.08] text-clinical-blueText" : "border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 text-clinical-slate hover:border-clinical-blue/25")}>
                  <span className="flex items-center gap-2"><ClipboardList className="size-4" />{item.name} <span className="text-[11px] font-extrabold text-clinical-muted">{item.id}</span></span>
                  {protocol === item.id ? <Check className="size-4" /> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-2">
          <span className="mb-1.5 block text-sm font-extrabold text-clinical-dark">Canal de ativação</span>
          {channelOptions.map((option) => (
            <button key={option} type="button" onClick={() => setChannel(option)} className={cn("flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition", channel === option ? "border-clinical-blue/40 bg-clinical-blue/[0.08] text-clinical-blueText" : "border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 text-clinical-slate hover:border-clinical-blue/25")}>
              <span className="flex items-center gap-2"><RadioTower className="size-4" />{option}</span>
              {channel === option ? <Check className="size-4" /> : null}
            </button>
          ))}
          <p className="pt-1 text-xs font-semibold leading-5 text-clinical-muted">O canal define por onde o gatilho e as mensagens do fluxo serão executados. Você pode ajustar depois no editor.</p>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          {template.credentials.map((credential) => (
            <div key={credential.id} className="flex items-center justify-between gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-4 py-3">
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-clinical-dark">{credential.name}</span>
                <span className="block text-xs font-semibold text-clinical-muted">{credential.provider}</span>
              </span>
              {credential.connected ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-clinical-green/[0.12] px-2.5 py-1 text-[11px] font-extrabold text-clinical-green"><BadgeCheck className="size-3" />Conectada</span>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => { onClose(); router.push("/configuracoes"); }}><ExternalLink className="size-3.5" />Configurar</Button>
              )}
            </div>
          ))}
          {pendingCredentials.length > 0 ? (
            <div className="rounded-2xl border border-clinical-orange/25 bg-clinical-orange/[0.08] p-3.5 text-xs font-semibold leading-5 text-clinical-slate">
              <p className="font-extrabold text-clinical-orange">Integração necessária</p>
              Este template usa {pendingCredentials.map((item) => item.name).join(", ")}. Configure em <strong>Configurações</strong> antes de ativar o fluxo — você ainda pode aplicar e deixar como rascunho.
            </div>
          ) : (
            <div className="rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.07] p-3.5 text-xs font-bold text-clinical-green">Todas as integrações deste template já estão conectadas nesta demonstração.</div>
          )}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          {template.requiresKnowledgeBase ? (
            <div>
              <span className="mb-1.5 block text-sm font-extrabold text-clinical-dark">Base de conhecimento do agente</span>
              <div className="space-y-2">
                {knowledgeBases.map((base) => (
                  <button key={base.id} type="button" onClick={() => setKnowledgeBaseId(base.id)} className={cn("flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition", knowledgeBaseId === base.id ? "border-clinical-blue/40 bg-clinical-blue/[0.08]" : "border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 hover:border-clinical-blue/25")}>
                    <span className="flex min-w-0 items-center gap-2">
                      <BookOpen className="size-4 shrink-0 text-clinical-teal" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold text-clinical-dark">{base.name}</span>
                        <span className="block text-xs font-semibold text-clinical-muted">{base.files.length} arquivos · {base.queries30d.toLocaleString("pt-BR")} consultas/mês</span>
                      </span>
                    </span>
                    {knowledgeBaseId === base.id ? <Check className="size-4 shrink-0 text-clinical-blue" /> : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <section className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
            <h3 className="text-sm font-extrabold text-clinical-dark">Resumo da aplicação</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3"><dt className="font-bold text-clinical-muted">Fluxo</dt><dd className="font-extrabold text-clinical-dark">{name.trim() || template.name}</dd></div>
              <div className="flex justify-between gap-3"><dt className="font-bold text-clinical-muted">Protocolo</dt><dd className="font-extrabold text-clinical-dark">{protocol === "livre" ? "Somente fluxo de trabalho" : automationProtocols.find((item) => item.id === protocol)?.name}</dd></div>
              <div className="flex justify-between gap-3"><dt className="font-bold text-clinical-muted">Canal</dt><dd className="font-extrabold text-clinical-dark">{channel}</dd></div>
              <div className="flex justify-between gap-3"><dt className="font-bold text-clinical-muted">Integrações</dt><dd className="font-extrabold text-clinical-dark">{template.credentials.length - pendingCredentials.length}/{template.credentials.length} conectadas</dd></div>
              {template.requiresKnowledgeBase ? <div className="flex justify-between gap-3"><dt className="font-bold text-clinical-muted">Base de conhecimento</dt><dd className="font-extrabold text-clinical-dark">{knowledgeBases.find((base) => base.id === knowledgeBaseId)?.name ?? "Nenhuma"}</dd></div> : null}
            </dl>
            <p className="mt-3 rounded-xl bg-clinical-blue/[0.07] p-3 text-xs font-semibold leading-5 text-clinical-slate">O fluxo será criado como <strong>rascunho</strong> e você será levado para <strong>Fluxos de automação</strong>, onde pode editar no canvas, testar e ativar.</p>
          </section>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-2 border-t border-clinical-border/[0.12] pt-4">
        <Button variant="ghost" onClick={step === 0 ? onClose : () => setStep((current) => current - 1)}>{step === 0 ? "Cancelar" : "Voltar"}</Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((current) => current + 1)} disabled={!canContinue}>Continuar<ArrowRight className="size-4" /></Button>
        ) : (
          <Button onClick={confirm}><Zap className="size-4" />Aplicar e abrir fluxo<ChevronRight className="size-4" /></Button>
        )}
      </div>
    </Modal>
  );
}
