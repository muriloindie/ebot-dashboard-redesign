"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Ban,
  BellRing,
  Bot,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  FlaskConical,
  HeartPulse,
  Layers3,
  ListChecks,
  MessageSquareText,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  SearchX,
  Send,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  UserRound,
  X,
  type LucideIcon
} from "lucide-react";
import { protocolTemplates, protocolCategories, type ProtocolCategory, type ProtocolStatus, type ProtocolTemplate } from "@/data/protocolTemplatesMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect } from "@/components/ui/ModalField";
import { Dropdown } from "@/components/ui/Dropdown";
import { PageHeader, SearchField, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const CACHE_KEY = "ebot-week2-protocols";
const ALL = "Todos";

const categoryTone: Record<ProtocolCategory, "blue" | "green" | "orange" | "teal" | "neutral"> = {
  Atendimento: "blue",
  Agendamento: "teal",
  Confirmação: "blue",
  "Pós-consulta": "green",
  Cancelamento: "neutral",
  Reagendamento: "orange",
  Exames: "green"
};

const statusTone: Record<ProtocolStatus, "green" | "orange" | "neutral"> = {
  Ativo: "green",
  Rascunho: "orange",
  Inativo: "neutral"
};

const categoryIconTone: Record<ProtocolCategory, string> = {
  Atendimento: "bg-clinical-blue/10 text-clinical-blueText",
  Agendamento: "bg-clinical-teal/12 text-clinical-teal",
  Confirmação: "bg-clinical-blue/10 text-clinical-blueText",
  "Pós-consulta": "bg-clinical-green/12 text-clinical-green",
  Cancelamento: "bg-clinical-surfaceMuted text-clinical-muted",
  Reagendamento: "bg-clinical-orange/12 text-clinical-orange",
  Exames: "bg-clinical-green/12 text-clinical-green"
};

export function ProtocolsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<ProtocolTemplate[]>(protocolTemplates);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [responsible, setResponsible] = useState(ALL);
  const [selected, setSelected] = useState<ProtocolTemplate | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [assignResponsible, setAssignResponsible] = useState(false);
  const [responsibleValue, setResponsibleValue] = useState(ALL);
  const [selectedIcon, setSelectedIcon] = useState("ClipboardList");

  usePageEnter(pageRef, [
    { selector: "[data-protocol-card]", from: { opacity: 0, y: 18 } },
    { selector: "[data-search-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } }
  ], { stagger: 0.07, delay: 0.05 });

  useEffect(() => setRows(readLocalCache(CACHE_KEY, protocolTemplates)), []);

  const responsibles = Array.from(new Set(rows.map((row) => row.responsible)));
  const hasFilters = category !== ALL || status !== ALL || responsible !== ALL;

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = `${row.name} ${row.description} ${row.id}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === ALL || row.category === category;
      const matchesStatus = status === ALL || row.status === status;
      const matchesResponsible = responsible === ALL || row.responsible === responsible;
      return matchesSearch && matchesCategory && matchesStatus && matchesResponsible;
    });
  }, [rows, search, category, status, responsible]);

  const totalUses = rows.reduce((sum, row) => sum + row.uses, 0);
  const activeCount = rows.filter((row) => row.status === "Ativo").length;

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function persist(next: ProtocolTemplate[]) {
    setRows(next);
    writeLocalCache(CACHE_KEY, next);
  }

  function createProtocol(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const next: ProtocolTemplate = {
      id: `PT-${String(rows.length + 8).padStart(2, "0")}`,
      name,
      category: String(form.get("category")) as ProtocolCategory,
      status: String(form.get("status")) as ProtocolStatus,
      responsible: assignResponsible && responsibleValue !== ALL ? responsibleValue : "IA + equipe",
      icon: String(form.get("icon") ?? "ClipboardList"),
      updatedAt: "Hoje",
      uses: 0,
      description: "Novo protocolo criado pela equipe. As etapas serão configuradas em seguida.",
      steps: [
        { id: `s-${Date.now()}`, title: "Primeira etapa", description: "Configure o primeiro passo do fluxo.", channel: "WhatsApp", trigger: "Início do contato" }
      ]
    };
    persist([...rows, next]);
    setNewOpen(false);
    setSelected(next);
    showNotice(`Protocolo "${name}" criado como ${next.status}.`);
  }

  function clearFilters() {
    setSearch("");
    setCategory(ALL);
    setStatus(ALL);
    setResponsible(ALL);
  }

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Pacientes / Automação clínica"
        title="Protocolos"
        description="Fluxos operacionais e clínicos que padronizam e automatizam o atendimento."
        aside={
          <span className="inline-flex items-center gap-2 rounded-full bg-clinical-green/[0.09] px-3 py-2 text-xs font-extrabold text-clinical-green">
            <Activity className="size-4" />{activeCount} ativos · {totalUses} utilizações
          </span>
        }
        action={<Button onClick={() => setNewOpen(true)}><Plus className="size-4" />Novo protocolo</Button>}
      />

      {notice ? (
        <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div data-search-bar className="mb-4 flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5 lg:flex-row lg:items-center">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar protocolo por nome ou descrição" />
        <div className="grid shrink-0 grid-cols-3 gap-2 xl:flex">
          <Dropdown label="Categoria" value={category} options={[ALL, ...protocolCategories]} onChange={setCategory} />
          <Dropdown label="Status" value={status} options={[ALL, "Ativo", "Rascunho", "Inativo"]} onChange={setStatus} />
          <Dropdown label="Responsável" value={responsible} options={[ALL, ...responsibles]} onChange={setResponsible} />
        </div>
        {hasFilters ? (
          <Button variant="secondary" size="sm" onClick={clearFilters} className="shrink-0"><X className="size-4" />Limpar</Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={SearchX}
          title="Nenhum protocolo encontrado"
          description="Ajuste a busca ou os filtros de categoria, status e responsável."
          action={<Button size="sm" variant="secondary" onClick={clearFilters}>Limpar filtros</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((protocol) => (
            <button
              key={protocol.id}
              type="button"
              data-protocol-card
              onClick={() => setSelected(protocol)}
              className="animate-list-in flex min-h-[240px] flex-col rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/75 p-5 text-left shadow-[0_8px_22px_rgba(38,53,50,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-clinical-blue/30 hover:bg-clinical-surface hover:shadow-card dark:shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", categoryIconTone[protocol.category])}>
                  <ProtocolIcon name={protocol.icon} className="size-5" />
                </span>
                <div className="flex flex-col items-end gap-1.5">
                  <Chip label={protocol.status} tone={statusTone[protocol.status]} />
                  <Chip label={protocol.category} tone={categoryTone[protocol.category]} />
                </div>
              </div>
              <h2 className="mt-4 text-base font-extrabold tracking-tight text-clinical-dark">{protocol.name}</h2>
              <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-5 text-clinical-muted">{protocol.description}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-clinical-border/[0.10] pt-3.5">
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-clinical-muted">Etapas</dt><dd className="mt-0.5 flex items-center gap-1 text-[13px] font-extrabold text-clinical-dark"><ListChecks className="size-3.5 text-clinical-blue" />{protocol.steps.length}</dd></div>
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-clinical-muted">Usos</dt><dd className="mt-0.5 text-[13px] font-extrabold tabular-nums text-clinical-dark">{protocol.uses}</dd></div>
                <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-clinical-muted">Atualizado</dt><dd className="mt-0.5 text-[13px] font-extrabold text-clinical-dark">{protocol.updatedAt}</dd></div>
              </dl>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-clinical-muted"><UserRound className="size-3.5 shrink-0" /><span className="truncate">{protocol.responsible}</span></span>
                <span className="flex shrink-0 items-center gap-1 text-xs font-extrabold text-clinical-blueText">Ver fluxo <ArrowRight className="size-3.5" /></span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? "Protocolo"} description={selected ? `${selected.id} · ${selected.category}` : undefined} width="max-w-xl">
        {selected ? (
          <div>
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-clinical-blue/[0.07] p-4">
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", categoryIconTone[selected.category])}>
                <ProtocolIcon name={selected.icon} className="size-4" />
              </span>
              <Chip label={selected.status} tone={statusTone[selected.status]} />
              <Chip label={selected.category} tone={categoryTone[selected.category]} />
              <span className="flex items-center gap-1.5 text-xs font-bold text-clinical-muted"><UserRound className="size-3.5" />{selected.responsible}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-clinical-slate">{selected.description}</p>
            <dl className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-clinical-muted">Utilizações</dt><dd className="mt-1 text-lg font-extrabold tabular-nums text-clinical-dark">{selected.uses}</dd></div>
              <div className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-clinical-muted">Etapas</dt><dd className="mt-1 text-lg font-extrabold tabular-nums text-clinical-dark">{selected.steps.length}</dd></div>
              <div className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-clinical-muted">Atualizado</dt><dd className="mt-1 text-lg font-extrabold text-clinical-dark">{selected.updatedAt}</dd></div>
            </dl>

            <h3 className="mb-3 mt-7 flex items-center gap-2 text-sm font-extrabold text-clinical-dark"><ListChecks className="size-4 text-clinical-blue" />Etapas do fluxo</h3>
            <ol className="relative space-y-0">
              {selected.steps.map((step, index) => (
                <li key={step.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {index < selected.steps.length - 1 ? <span className="absolute left-[17px] top-9 h-[calc(100%-28px)] w-px bg-clinical-border/[0.16]" aria-hidden="true" /> : null}
                  <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center rounded-xl border border-clinical-blue/25 bg-clinical-blue/10 text-[13px] font-black text-clinical-blue">{index + 1}</span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-extrabold text-clinical-dark">{step.title}</p>
                    <p className="mt-1 text-[13px] leading-5 text-clinical-muted">{step.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-clinical-whatsapp/10 px-2.5 py-1 text-[11px] font-extrabold text-clinical-whatsapp"><Bot className="size-3" />{step.channel}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-muted"><RefreshCw className="size-3" />{step.trigger}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 flex items-center gap-2 rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.07] p-3 text-xs font-semibold leading-5 text-clinical-slate">
              <Bot className="size-4 shrink-0 text-clinical-green" />
              Este fluxo roda automaticamente pela IA do É-Bot, com handoff humano quando necessário.
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Novo protocolo" eyebrow="Automação clínica" description="Crie um fluxo de atendimento padronizado para a equipe e a IA." icon={ClipboardList} className="max-w-xl">
        <form onSubmit={createProtocol} className="space-y-4">
          <ModalField name="name" label="Nome do protocolo" icon={ClipboardList} placeholder="Ex.: Pré-cirurgia, Acolhimento por telefone" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalSelect name="category" label="Categoria" icon={Layers3} defaultValue="Atendimento">{protocolCategories.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            <ModalSelect name="status" label="Status" icon={Activity} defaultValue="Rascunho"><option>Rascunho</option><option>Ativo</option><option>Inativo</option></ModalSelect>
          </div>
          <fieldset className="rounded-2xl border border-clinical-border/[0.12] p-3.5">
            <legend className="px-1.5 text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Ícone do protocolo</legend>
            <input type="hidden" name="icon" value={selectedIcon} />
            <div className="grid grid-cols-8 gap-1.5">
              {pickableIcons.map((iconName) => {
                const Icon = protocolIconMap[iconName];
                const isSelected = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    aria-pressed={isSelected}
                    title={iconName}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-xl border transition",
                      isSelected
                        ? "border-clinical-teal bg-clinical-teal/15 text-clinical-teal"
                        : "border-clinical-border/[0.14] bg-clinical-surfaceMuted/40 text-clinical-muted hover:border-clinical-blue/30 hover:text-clinical-blueText"
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-clinical-muted">O ícone aparece no card do protocolo e no catálogo de fluxos.</p>
          </fieldset>
          <div className="flex items-center gap-3 rounded-2xl border border-clinical-border/[0.12] p-3.5">
            <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm font-bold text-clinical-dark">
              <input type="checkbox" checked={assignResponsible} onChange={(e) => setAssignResponsible(e.target.checked)} className="size-4 accent-clinical-teal" />
              Colocar responsável
            </label>
            {assignResponsible ? (
              <div className="w-44 shrink-0"><Dropdown label="Responsável" value={responsibleValue} options={[ALL, ...responsibles]} onChange={setResponsibleValue} /></div>
            ) : (
              <span className="shrink-0 text-xs font-semibold text-clinical-muted">IA + equipe</span>
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setNewOpen(false)}>Cancelar</Button>
            <Button type="submit"><Plus className="size-4" />Criar protocolo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const protocolIconMap: Record<string, LucideIcon> = {
  HeartPulse,
  CalendarClock,
  MessageSquareText,
  Stethoscope,
  Ban,
  RotateCcw,
  FlaskConical,
  BellRing,
  ClipboardList,
  FileText,
  Phone,
  Send,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Clock3
};

const pickableIcons = Object.keys(protocolIconMap);

function ProtocolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = protocolIconMap[name] ?? Layers3;
  return <Icon className={className} />;
}

function Chip({ label, tone }: { label: string; tone: "blue" | "green" | "orange" | "teal" | "neutral" }) {
  const styles = {
    blue: "bg-clinical-blue/10 text-clinical-blueText",
    green: "bg-clinical-green/12 text-clinical-green",
    orange: "bg-clinical-orange/12 text-clinical-orange",
    teal: "bg-clinical-teal/12 text-clinical-teal",
    neutral: "bg-clinical-surfaceMuted text-clinical-muted"
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold", styles)}>{label}</span>;
}
