"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CircleDot,
  GripVertical,
  Handshake,
  Plus,
  RotateCcw,
  SearchX,
  Sparkles,
  Target,
  TrendingUp,
  UserRound
} from "lucide-react";
import { crmChannels, crmStages, type CrmLead, type CrmStage } from "@/data/crmMock";
import {
  computeCrmInsights,
  formatCurrency,
  isTerminal,
  leadTemperature,
  listCrmLeads,
  resetCrmLeads,
  saveCrmLeads,
  temperatureLabel
} from "@/lib/crm/crmService";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { ChannelIcon } from "@/components/ui/ChannelIcon";
import { Drawer } from "@/components/ui/Drawer";
import { Dropdown } from "@/components/ui/Dropdown";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect, ModalTextarea } from "@/components/ui/ModalField";
import { PageHeader, SearchField } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const ALL = "Todos";
const UNASSIGNED = "Sem responsável";

const temperatureTone = {
  quente: "bg-ebot-primary/[0.16] text-ebot-primaryText",
  morno: "bg-ebot-orange/[0.12] text-ebot-orange",
  frio: "bg-ebot-surfaceMuted text-ebot-muted"
} as const;

const activityTone = {
  mensagem: "bg-ebot-whatsapp/10 text-ebot-whatsapp",
  ia: "bg-ebot-primary/[0.12] text-ebot-primaryText",
  proposta: "bg-ebot-teal/10 text-ebot-teal",
  reuniao: "bg-ebot-green/10 text-ebot-green",
  nota: "bg-ebot-orange/10 text-ebot-orange",
  sistema: "bg-ebot-surfaceMuted text-ebot-muted"
} as const;

function withAlpha(hex: string, alpha: string) {
  const value = hex.replace("#", "");
  return value.length === 6 ? `#${value}${alpha}` : hex;
}

function accentInk(hex: string) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;
  const channels = [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16));
  const luminance = (0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]) / 255;
  const factor = luminance > 0.52 ? 0.6 : 1;
  return `rgb(${channels.map((channel) => Math.round(channel * factor)).join(", ")})`;
}

type NewLeadDraft = {
  name: string;
  company: string;
  phone: string;
  channel: (typeof crmChannels)[number];
  value: string;
  owner: string;
  tags: string;
  nextAction: string;
};

const emptyDraft: NewLeadDraft = {
  name: "",
  company: "",
  phone: "",
  channel: "WhatsApp",
  value: "",
  owner: "Sem responsável",
  tags: "",
  nextAction: ""
};

export function CrmPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const [panning, setPanning] = useState(false);
  const feedbackTimerRef = useRef<number | null>(null);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [dragged, setDragged] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState(ALL);
  const [channelFilter, setChannelFilter] = useState(ALL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState<NewLeadDraft>(emptyDraft);
  const [feedback, setFeedback] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-crm-insight]", from: { opacity: 0, y: 16 } },
    { selector: "[data-crm-col]", from: { opacity: 0, y: 22 } }
  ], { stagger: 0.05, delay: 0.05 });

  useEffect(() => {
    setLeads(listCrmLeads());
  }, []);

  useEffect(() => () => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
  }, []);

  function announce(message: string) {
    setFeedback(message);
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(""), 3200);
  }

  function persist(next: CrmLead[]) {
    setLeads(next);
    saveCrmLeads(next);
  }

  function moveLead(id: string, stage: CrmStage) {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;
    if (lead.stage === stage) {
      announce(`${lead.name} já está em ${stage}.`);
      return;
    }
    persist(leads.map((item) => item.id === id ? { ...item, stage, staleDays: isTerminal(stage) ? 0 : item.staleDays } : item));
    announce(`${lead.name} movido para ${stage}.`);
  }

  function moveToWon(id: string) {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;
    persist(leads.map((item) => item.id === id ? { ...item, stage: "Ganho" as CrmStage, staleDays: 0, activity: [...item.activity, { id: `a${item.activity.length + 1}`, kind: "sistema" as const, description: "Negócio marcado como ganho.", at: "agora" }] } : item));
    announce(`${lead.name} marcado como ganho.`);
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLElement>, lead: CrmLead) {
    if (!event.altKey) return;
    const currentIndex = crmStages.findIndex((stage) => stage.id === lead.stage);
    const targetIndex = event.key === "ArrowRight" ? currentIndex + 1 : event.key === "ArrowLeft" ? currentIndex - 1 : -1;
    if (targetIndex < 0 || targetIndex >= crmStages.length) return;
    event.preventDefault();
    moveLead(lead.id, crmStages[targetIndex].id);
  }

  function startPan(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const target = event.target as HTMLElement;
    if (target.closest('[draggable="true"], a, button, input, select, textarea, [role="dialog"]')) return;
    const board = boardRef.current;
    if (!board) return;
    panRef.current = { x: event.clientX, y: event.clientY, left: board.scrollLeft, top: board.scrollTop, moved: false };
    setPanning(true);
  }

  function movePan(event: React.PointerEvent<HTMLDivElement>) {
    const pan = panRef.current;
    const board = boardRef.current;
    if (!pan || !board) return;
    const dx = event.clientX - pan.x;
    const dy = event.clientY - pan.y;
    if (!pan.moved && Math.hypot(dx, dy) > 5) pan.moved = true;
    if (pan.moved) {
      board.scrollLeft = pan.left - dx;
      board.scrollTop = pan.top - dy;
    }
  }

  function endPan() {
    panRef.current = null;
    setPanning(false);
  }

  function makePreview(lead: CrmLead) {
    const preview = document.createElement("div");
    preview.textContent = lead.name;
    preview.style.cssText = "position:fixed;top:-1000px;left:-1000px;width:260px;padding:14px;border-radius:18px;background:#041B15;color:#A9D16C;font:700 13px Inter,sans-serif;box-shadow:0 22px 52px rgba(4,27,21,.4);";
    document.body.appendChild(preview);
    previewRef.current = preview;
    return preview;
  }

  function startDrag(event: React.DragEvent<HTMLElement>, lead: CrmLead) {
    setDragged(lead.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", lead.id);
    const preview = makePreview(lead);
    event.dataTransfer.setDragImage(preview, 24, 20);
    window.setTimeout(() => { preview.remove(); previewRef.current = null; }, 0);
  }

  function drop(stage: string) {
    if (dragged) moveLead(dragged, stage as CrmStage);
    setDragged(null);
    setDropTarget(null);
  }

  function createLead() {
    if (!draft.name.trim() || !draft.phone.trim()) {
      announce("Informe nome e telefone para adicionar o lead.");
      return;
    }
    const nextNumber = Math.max(...leads.map((lead) => Number.parseInt(lead.id.replace("LEAD-", ""), 10) || 0), 1000) + 1;
    const tags = draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    const lead: CrmLead = {
      id: `LEAD-${nextNumber}`,
      name: draft.name.trim(),
      company: draft.company.trim() || undefined,
      phone: draft.phone.trim(),
      channel: draft.channel,
      origin: "Cadastro manual",
      value: Number.parseInt(draft.value, 10) || 0,
      stage: "Novo lead",
      score: 50,
      owner: draft.owner,
      lastActivity: "agora",
      staleDays: 0,
      createdAt: "Agora",
      nextAction: draft.nextAction.trim() || "Qualificar com a IA",
      tags,
      activity: [{ id: "a1", kind: "sistema", description: "Lead criado manualmente no CRM.", at: "agora" }]
    };
    persist([lead, ...leads]);
    announce(`Lead ${lead.name} adicionado ao funil.`);
    setDraft(emptyDraft);
    setCreateOpen(false);
  }

  function restoreDemo() {
    const restored = resetCrmLeads();
    setLeads(restored);
    announce("Leads de demonstração restaurados.");
  }

  const insights = computeCrmInsights(leads);
  const owners = Array.from(new Set(leads.map((lead) => lead.owner)));

  const visibleLeads = leads.filter((lead) => {
    const haystack = `${lead.name} ${lead.company ?? ""} ${lead.origin} ${lead.tags.join(" ")} ${lead.nextAction ?? ""}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const matchesOwner = ownerFilter === ALL || lead.owner === ownerFilter;
    const matchesChannel = channelFilter === ALL || lead.channel === channelFilter;
    return matchesSearch && matchesOwner && matchesChannel;
  });

  const selected = leads.find((lead) => lead.id === selectedId) ?? null;
  const hasFilters = search !== "" || ownerFilter !== ALL || channelFilter !== ALL;

  const insightCards = [
    { id: "pipeline", label: "Valor em pipeline", value: formatCurrency(insights.pipelineValue), hint: `${insights.activeLeads} leads ativos no funil`, icon: TrendingUp },
    { id: "qualified", label: "Qualificação pela IA", value: `${insights.qualifiedRate}%`, hint: `Score médio ${insights.avgScore} no funil`, icon: Sparkles },
    { id: "stale", label: "Leads parados", value: String(insights.staleLeads), hint: "Sem interação há 3+ dias", icon: AlertTriangle, tone: insights.staleLeads > 0 ? "warning" : "neutral" },
    { id: "unassigned", label: "Sem responsável", value: String(insights.unassignedLeads), hint: "Precisam de dono agora", icon: UserRound, tone: insights.unassignedLeads > 0 ? "danger" : "neutral" },
    { id: "conversion", label: "Conversão do funil", value: `${insights.conversionRate}%`, hint: `${formatCurrency(insights.wonValue)} fechados`, icon: Handshake }
  ];

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Clientes / Comercial"
        title="CRM"
        description="Funil comercial com leads qualificados pela IA, valor em pipeline e próximas ações do time."
        aside={
          <span className="inline-flex items-center gap-2 rounded-full bg-ebot-green/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-green">
            <CircleDot className="size-4" />{insights.activeLeads} ativos · {formatCurrency(insights.wonValue)} ganhos
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={restoreDemo}><RotateCcw className="size-4" />Restaurar demo</Button>
            <Button onClick={() => setCreateOpen(true)}><Plus className="size-4" />Novo lead</Button>
          </div>
        }
      />

      <section className="mb-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5" aria-label="Indicadores do funil comercial">
        {insightCards.map((card) => {
          const Icon = card.icon;
          const tone = card.tone === "warning" ? "border-ebot-orange/25 bg-ebot-orange/[0.07] text-ebot-orange" : card.tone === "danger" ? "border-red-500/20 bg-red-500/[0.06] text-red-500" : "border-ebot-border/[0.12] bg-ebot-surface/75 text-ebot-primaryText";
          return (
            <article key={card.id} data-crm-insight className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-4 shadow-ebot">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ebot-muted">{card.label}</p>
                <span className={cn("flex size-8 items-center justify-center rounded-xl border", tone)}><Icon className="size-4" /></span>
              </div>
              <p className="mt-2 text-2xl font-extrabold tabular-nums tracking-tight text-ebot-dark">{card.value}</p>
              <p className="mt-1 text-xs font-semibold text-ebot-muted">{card.hint}</p>
            </article>
          );
        })}
      </section>

      <div data-search-bar className="mb-4 flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5 lg:flex-row lg:items-center">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar lead por nome, empresa ou etiqueta" />
        <div className="grid shrink-0 grid-cols-2 gap-2 xl:flex">
          <Dropdown label="Responsável" value={ownerFilter} options={[ALL, ...owners]} onChange={setOwnerFilter} />
          <Dropdown label="Canal" value={channelFilter} options={[ALL, ...crmChannels]} onChange={setChannelFilter} />
        </div>
      </div>

      {feedback ? <div role="status" className="mb-4 flex items-center gap-2 rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green"><Check className="size-4" />{feedback}</div> : null}
      <p id="crm-keyboard-help" className="sr-only">Foque um cartão e use Alt mais seta para a esquerda ou direita para movê-lo entre as etapas do funil.</p>

      <div
        ref={boardRef}
        role="region"
        data-crm-board
        onPointerDown={startPan}
        onPointerMove={movePan}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onPointerLeave={endPan}
        className={cn("ebot-scrollbar min-w-0 max-w-full overflow-auto overscroll-contain pb-4", panning ? "cursor-grabbing select-none" : "cursor-grab")}
        tabIndex={0}
        aria-label="Funil comercial: arraste com o ponteiro para navegar na horizontal"
      >
        <div className="flex min-w-max items-stretch gap-4 px-0.5">
          {crmStages.map((stage) => {
            const items = visibleLeads.filter((lead) => lead.stage === stage.id);
            const total = items.reduce((sum, lead) => sum + lead.value, 0);
            const ink = accentInk(stage.color);
            return (
              <section
                key={stage.id}
                data-crm-col
                data-stage-id={stage.id}
                onDragOver={(event) => { event.preventDefault(); setDropTarget(stage.id); }}
                onDragLeave={() => setDropTarget(null)}
                onDrop={(event) => { event.preventDefault(); drop(stage.id); }}
                aria-label={`Etapa ${stage.label}`}
                style={{ borderColor: withAlpha(stage.color, "55"), backgroundColor: dropTarget === stage.id ? withAlpha("#A9D16C", "1F") : withAlpha(stage.color, "0A") }}
                className={cn("flex min-h-[440px] w-[min(86vw,320px)] min-w-[270px] max-w-[330px] shrink-0 flex-col rounded-[26px] border p-3 transition duration-200", dropTarget === stage.id && "shadow-glow")}
              >
                <div className="mb-2 flex items-start justify-between gap-2 px-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: stage.color }} aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-extrabold" style={{ color: ink }}>{stage.label}</h3>
                      <p className="text-[11px] font-semibold text-ebot-muted">{stage.description}</p>
                    </div>
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-black tabular-nums" style={{ backgroundColor: withAlpha(stage.color, "1A"), color: ink }}>{items.length}</span>
                </div>
                <p className="mb-3 px-1.5 text-[11px] font-extrabold tabular-nums" style={{ color: ink }}>{formatCurrency(total)}</p>

                <div className="flex flex-1 flex-col gap-3">
                  {items.map((lead) => {
                    const temperature = leadTemperature(lead.score);
                    const stale = !isTerminal(lead.stage) && lead.staleDays >= 3;
                    return (
                      <article
                        key={lead.id}
                        data-crm-card
                        data-lead-id={lead.id}
                        tabIndex={0}
                        draggable
                        onDragStart={(event) => startDrag(event, lead)}
                        onDragEnd={() => { setDragged(null); setDropTarget(null); }}
                        onKeyDown={(event) => handleCardKeyDown(event, lead)}
                        onClick={() => setSelectedId(lead.id)}
                        aria-label={`Lead ${lead.name}, etapa ${lead.stage}. Abra para ver detalhes.`}
                        aria-describedby="crm-keyboard-help"
                        style={{ borderColor: withAlpha(stage.color, "38"), backgroundColor: withAlpha(stage.color, "0D") }}
                        className={cn(
                          "group relative cursor-pointer rounded-2xl border p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card dark:shadow-[0_12px_28px_rgba(0,0,0,0.14)]",
                          dragged === lead.id && "opacity-40"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold", temperatureTone[temperature])}>
                            {temperatureLabel(temperature)} · {lead.score}
                          </span>
                          <span className="text-[11px] font-bold text-ebot-muted">{lead.id}</span>
                        </div>
                        <h4 className="mt-2.5 text-sm font-extrabold leading-5" style={{ color: ink }}>{lead.name}</h4>
                        {lead.company ? <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-ebot-muted"><Building2 className="size-3" />{lead.company}</p> : null}
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <p className="text-base font-extrabold tabular-nums" style={{ color: ink }}>{formatCurrency(lead.value)}</p>
                          <ChannelIcon channel={lead.channel} />
                        </div>
                        {lead.nextAction ? (
                          <p className="mt-2.5 flex items-start gap-1.5 text-[11px] font-semibold leading-4 text-ebot-muted"><Sparkles className="mt-0.5 size-3 shrink-0 text-ebot-primary" />{lead.nextAction}</p>
                        ) : null}
                        {stale ? (
                          <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-ebot-orange/[0.12] px-2.5 py-1 text-[11px] font-extrabold text-ebot-orange"><AlertTriangle className="size-3" />Parado há {lead.staleDays}d</p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {lead.tags.map((tag) => (
                            <span key={tag} className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: withAlpha(stage.color, "1A"), color: ink }}>#{tag}</span>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-ebot-border/[0.10] pt-3">
                          <span className={cn("flex items-center gap-1.5 text-[11px] font-bold", lead.owner === UNASSIGNED ? "text-ebot-orange" : "text-ebot-muted")}>
                            <UserRound className="size-3.5" />{lead.owner}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-ebot-muted"><GripVertical className="size-3.5 text-ebot-border" />{lead.lastActivity}</span>
                        </div>
                      </article>
                    );
                  })}
                  {items.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-ebot-border/[0.18] p-6 text-center text-xs font-semibold text-ebot-muted">
                      {hasFilters ? "Nenhum lead nesta etapa com os filtros atuais" : "Arraste leads para cá"}
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {hasFilters && visibleLeads.length === 0 ? (
        <div className="mt-2 flex flex-col items-center gap-3 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/60 p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-ebot-surfaceMuted"><SearchX className="size-6 text-ebot-muted" /></span>
          <p className="text-sm font-extrabold text-ebot-dark">Nenhum lead encontrado</p>
          <p className="max-w-sm text-xs leading-5 text-ebot-muted">Ajuste a busca ou os filtros de responsável e canal.</p>
          <Button size="sm" variant="secondary" onClick={() => { setSearch(""); setOwnerFilter(ALL); setChannelFilter(ALL); }}>Limpar filtros</Button>
        </div>
      ) : null}

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.name : "Lead"}
        description={selected ? `${selected.id} · ${selected.origin} · entrada em ${selected.createdAt}` : undefined}
        width="max-w-2xl"
      >
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold", temperatureTone[leadTemperature(selected.score)])}>{temperatureLabel(leadTemperature(selected.score))} · score {selected.score}</span>
              <span className="rounded-full bg-ebot-primary/[0.10] px-3 py-1.5 text-xs font-extrabold text-ebot-primaryText">{selected.stage}</span>
              <span className="rounded-full bg-ebot-surfaceMuted px-3 py-1.5 text-xs font-extrabold text-ebot-muted">{selected.channel}</span>
              {!isTerminal(selected.stage) && selected.staleDays >= 3 ? <span className="rounded-full bg-ebot-orange/[0.12] px-3 py-1.5 text-xs font-extrabold text-ebot-orange">Parado há {selected.staleDays} dias</span> : null}
            </div>

            <div className="grid gap-3 rounded-[24px] border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-4 sm:grid-cols-3">
              <div><p className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Valor estimado</p><p className="mt-1 text-lg font-extrabold tabular-nums text-ebot-dark">{formatCurrency(selected.value)}</p></div>
              <div><p className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Responsável</p><p className="mt-1 text-sm font-extrabold text-ebot-dark">{selected.owner}</p></div>
              <div><p className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Última atividade</p><p className="mt-1 text-sm font-extrabold text-ebot-dark">{selected.lastActivity}</p></div>
              <div className="sm:col-span-3"><p className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Próxima ação</p><p className="mt-1 text-sm font-semibold text-ebot-slate">{selected.nextAction ?? "Sem próxima ação definida."}</p></div>
              {selected.notes ? <div className="sm:col-span-3"><p className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Observações</p><p className="mt-1 text-sm leading-6 text-ebot-slate">{selected.notes}</p></div> : null}
            </div>

            <div>
              <p className="mb-2 text-sm font-extrabold text-ebot-dark">Mover etapa</p>
              <div className="flex flex-wrap gap-2">
                {crmStages.map((stage) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => moveLead(selected.id, stage.id)}
                    disabled={selected.stage === stage.id}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-[12px] font-extrabold transition",
                      selected.stage === stage.id ? "border-ebot-primary/40 bg-ebot-primary/[0.12] text-ebot-primaryText" : "border-ebot-border/[0.16] bg-ebot-surface text-ebot-slate hover:border-ebot-primary/30 hover:text-ebot-primaryText"
                    )}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => router.push("/contatos")}>Abrir contato <ArrowRight className="size-4" /></Button>
              <Button size="sm" variant="secondary" onClick={() => router.push("/atendimentos")}>Ver conversa <ArrowRight className="size-4" /></Button>
              <Button size="sm" onClick={() => moveToWon(selected.id)}><Handshake className="size-4" />Marcar como ganho</Button>
            </div>

            <div>
              <p className="mb-3 text-sm font-extrabold text-ebot-dark">Histórico do lead</p>
              <ol className="space-y-3">
                {selected.activity.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl", activityTone[item.kind])}><CircleDot className="size-4" /></span>
                    <div className="min-w-0 border-b border-ebot-border/[0.08] pb-3">
                      <p className="text-sm font-semibold leading-5 text-ebot-slate">{item.description}</p>
                      <p className="mt-0.5 text-[11px] font-bold text-ebot-muted">{item.at}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo lead"
        eyebrow="CRM"
        description="Cadastre o lead para entrar no funil como Novo lead e ser qualificado pela IA."
        icon={Target}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={createLead}><Plus className="size-4" />Adicionar lead</Button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <ModalField label="Nome" icon={UserRound} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nome do contato" required />
          <ModalField label="Empresa" icon={Building2} value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} placeholder="Opcional" />
          <ModalField label="Telefone" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} placeholder="+55 46 99999-0000" required />
          <ModalSelect label="Canal" value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value as NewLeadDraft["channel"] })}>
            {crmChannels.map((channel) => <option key={channel}>{channel}</option>)}
          </ModalSelect>
          <ModalField label="Valor estimado (R$)" type="number" min="0" value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} placeholder="0" />
          <ModalSelect label="Responsável" value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value })}>
            {["Sem responsável", "Marina Costa", "Julia Alves", "Ricardo Lima", "Fernanda Rocha"].map((owner) => <option key={owner}>{owner}</option>)}
          </ModalSelect>
          <div className="sm:col-span-2">
            <ModalField label="Etiquetas" value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="Frota, Corporativo, VIP" hint="Separe por vírgulas" />
          </div>
          <div className="sm:col-span-2">
            <ModalTextarea label="Próxima ação" value={draft.nextAction} onChange={(event) => setDraft({ ...draft, nextAction: event.target.value })} placeholder="Ex.: enviar orçamento e agendar avaliação" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
