"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Mail, Megaphone, MessageCircle, Pause, Play, Plus, Send, Trash2, TrendingUp, Users, Zap } from "lucide-react";
import { deleteCampaign, getCampaignSettings, listCampaigns, listContactLists, saveCampaign } from "@/lib/company/companyService";
import type { Campaign } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { PageHeader, SearchField, SegmentedTabs, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const ALL = "Todas";
const statusOptions = [ALL, "draft", "scheduled", "sending", "paused", "finished"] as const;

const statusMeta: Record<Campaign["status"], { label: string; chip: string; dot: string }> = {
  draft: { label: "Rascunho", chip: "bg-ebot-surfaceMuted text-ebot-slate", dot: "bg-ebot-slate" },
  scheduled: { label: "Agendada", chip: "bg-ebot-primary/[0.10] text-ebot-primaryText", dot: "bg-ebot-primary" },
  sending: { label: "Enviando", chip: "bg-ebot-green/[0.12] text-ebot-green", dot: "bg-ebot-green animate-pulse" },
  paused: { label: "Pausada", chip: "bg-ebot-orange/[0.12] text-ebot-orange", dot: "bg-ebot-orange" },
  finished: { label: "Concluída", chip: "bg-ebot-teal/[0.10] text-ebot-teal", dot: "bg-ebot-teal" }
};

const channelIcon: Record<Campaign["channel"], typeof MessageCircle> = {
  WhatsApp: MessageCircle,
  Instagram: Zap,
  "E-mail": Mail
};

const emptyDraft = { name: "", channel: "WhatsApp" as Campaign["channel"], listId: "", template: "", mode: "agora" as "agora" | "agendada", date: "" };

export function CampanhasPage() {
  const { toast, profile } = useDemo();
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => listCampaigns());
  const [lists] = useState(() => listContactLists());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [deleting, setDeleting] = useState<Campaign | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const templates = useMemo(() => getCampaignSettings().defaultTemplate ? [getCampaignSettings().defaultTemplate, "Confirmação de agendamento D-1", "Reativação de clientes inativos", "Aniversariantes do dia", "Novidades da filial"] : [], []);

  const filtered = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesStatus = status === ALL || campaign.status === status;
      const matchesQuery = `${campaign.name} ${campaign.audienceListName} ${campaign.template} ${campaign.channel}`.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [campaigns, query, status]);

  const stats: StatItem[] = useMemo(() => {
    const sending = campaigns.filter((campaign) => campaign.status === "sending").length;
    const delivered = campaigns.reduce((total, campaign) => total + campaign.stats.delivered, 0);
    const replied = campaigns.reduce((total, campaign) => total + campaign.stats.replied, 0);
    return [
      { id: "campaigns", label: "Campanhas", value: String(campaigns.length), hint: `${sending} em andamento`, tone: "blue", icon: Megaphone },
      { id: "audience", label: "Público total", value: campaigns.reduce((total, campaign) => total + campaign.stats.total, 0).toLocaleString("pt-BR"), hint: "contatos alcançáveis", tone: "teal", icon: Users },
      { id: "delivered", label: "Entregues", value: delivered.toLocaleString("pt-BR"), hint: "nos últimos 30 dias", tone: "green", icon: Send },
      { id: "replied", label: "Respostas", value: replied.toLocaleString("pt-BR"), hint: "conversas iniciadas", tone: "orange", icon: TrendingUp }
    ];
  }, [campaigns]);

  function progress(campaign: Campaign) {
    return campaign.stats.total ? Math.round((campaign.stats.sent / campaign.stats.total) * 100) : 0;
  }

  function togglePause(campaign: Campaign) {
    const next: Campaign = { ...campaign, status: campaign.status === "paused" ? "sending" : campaign.status === "sending" ? "paused" : campaign.status };
    if (campaign.status === "sending" || campaign.status === "paused") {
      saveCampaign(next);
      setCampaigns(listCampaigns());
      toast(campaign.status === "sending" ? `Campanha "${campaign.name}" pausada.` : `Campanha "${campaign.name}" retomada.`);
    }
  }

  function sendNow(campaign: Campaign) {
    const next: Campaign = { ...campaign, status: "sending", schedule: { mode: "agora" }, updatedAt: "agora" };
    saveCampaign(next);
    setCampaigns(listCampaigns());
    setSelected(next);
    toast(`Campanha "${campaign.name}" iniciada agora.`);
  }

  function create() {
    if (!draft.name.trim()) {
      toast("Informe o nome da campanha.", "warning");
      return;
    }
    if (!draft.listId) {
      toast("Selecione a lista de contatos.", "warning");
      return;
    }
    const list = lists.find((item) => item.id === draft.listId);
    const campaign: Campaign = {
      id: "",
      name: draft.name.trim(),
      channel: draft.channel,
      audienceListId: draft.listId,
      audienceListName: list?.name ?? "Lista",
      template: draft.template || templates[0] || "Mensagem personalizada",
      schedule: draft.mode === "agora" ? { mode: "agora" } : { mode: "agendada", date: draft.date || "sem data", window: "—" },
      status: draft.mode === "agora" ? "sending" : "scheduled",
      stats: { total: list?.size ?? 0, sent: 0, delivered: 0, failed: 0, opened: 0, replied: 0 },
      sentBy: profile.name,
      updatedAt: "agora"
    };
    const saved = saveCampaign(campaign);
    setCampaigns(listCampaigns());
    setCreating(false);
    setDraft(emptyDraft);
    toast(draft.mode === "agora" ? `Campanha "${saved.name}" iniciada.` : `Campanha "${saved.name}" agendada.`);
  }

  function remove() {
    if (!deleting) return;
    deleteCampaign(deleting.id);
    setCampaigns(listCampaigns());
    setDeleting(null);
    if (selected?.id === deleting.id) setSelected(null);
    toast(`Campanha "${deleting.name}" excluída.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Comunicação / Disparos"
        title="Campanhas"
        description="Disparos em massa com janelas de horário, listas segmentadas e rastreio de entrega. As regras de envio respeitam consentimento e limites da filial."
        action={<Button onClick={() => setCreating(true)}><Plus className="size-4" />Nova campanha</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs tabs={statusOptions.map((item) => ({ id: item, label: item === ALL ? "Todas" : statusMeta[item].label }))} value={status} onChange={setStatus} />
        <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar campanha…" /></div>
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={Megaphone} title={query || status !== ALL ? "Nenhuma campanha encontrada" : "Nenhuma campanha ainda"} description={query || status !== ALL ? "Ajuste a busca ou o filtro de status." : "Crie sua primeira campanha para disparar mensagens em massa."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((campaign) => {
            const ChannelIcon = channelIcon[campaign.channel];
            const meta = statusMeta[campaign.status];
            const pct = progress(campaign);
            return (
              <article key={campaign.id} className="flex flex-col rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)] transition hover:border-ebot-primary/25 hover:shadow-ebot">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ebot-orange/[0.12] text-ebot-orange">
                    <ChannelIcon className="size-5" />
                  </span>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold", meta.chip)}>
                    <span className={cn("size-1.5 rounded-full", meta.dot)} />
                    {meta.label}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-extrabold tracking-tight text-ebot-dark">{campaign.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-[12px] font-bold text-ebot-muted">
                  <Users className="size-3.5" />{campaign.audienceListName} · {campaign.stats.total.toLocaleString("pt-BR")} contatos
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate">{campaign.template}</span>
                  {campaign.schedule.mode === "agendada" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ebot-primary/[0.08] px-2.5 py-1 text-[11px] font-extrabold text-ebot-primaryText">
                      <CalendarClock className="size-3" />{campaign.schedule.date}
                    </span>
                  ) : campaign.status === "sending" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ebot-green/[0.12] px-2.5 py-1 text-[11px] font-extrabold text-ebot-green">
                      <Send className="size-3" />Enviando agora
                    </span>
                  ) : null}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-ebot-muted">
                    <span>Progresso de envio</span>
                    <span>{campaign.stats.sent.toLocaleString("pt-BR")}/{campaign.stats.total.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ebot-surfaceMuted">
                    <div className={cn("h-full rounded-full transition-all", campaign.status === "finished" ? "bg-ebot-teal" : campaign.status === "paused" ? "bg-ebot-orange" : "bg-ebot-primary")} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-3 text-center">
                  <div><p className="text-sm font-extrabold text-ebot-dark">{campaign.stats.delivered.toLocaleString("pt-BR")}</p><p className="text-[10px] font-extrabold uppercase tracking-wide text-ebot-muted">Entregues</p></div>
                  <div><p className="text-sm font-extrabold text-ebot-dark">{campaign.stats.failed}</p><p className="text-[10px] font-extrabold uppercase tracking-wide text-ebot-muted">Falhas</p></div>
                  <div><p className="text-sm font-extrabold text-ebot-dark">{campaign.stats.replied}</p><p className="text-[10px] font-extrabold uppercase tracking-wide text-ebot-muted">Respostas</p></div>
                </div>
                <div className="mt-4 flex gap-2 border-t border-ebot-border/[0.10] pt-4">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelected(campaign)}>Detalhes</Button>
                  {campaign.status === "draft" ? (
                    <Button size="sm" className="flex-1" onClick={() => sendNow(campaign)}><Send className="size-4" />Enviar agora</Button>
                  ) : campaign.status === "sending" || campaign.status === "paused" ? (
                    <Button size="sm" variant={campaign.status === "sending" ? "secondary" : "primary"} className="flex-1" onClick={() => togglePause(campaign)}>
                      {campaign.status === "sending" ? <><Pause className="size-4" />Pausar</> : <><Play className="size-4" />Retomar</>}
                    </Button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? "Campanha"} description={selected ? `${selected.audienceListName} · ${selected.template}` : undefined} width="max-w-3xl">
        {selected ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold", statusMeta[selected.status].chip)}>
                <span className={cn("size-1.5 rounded-full", statusMeta[selected.status].dot)} />
                {statusMeta[selected.status].label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate">{selected.channel}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate">{selected.sentBy} · {selected.updatedAt}</span>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Enviadas", value: selected.stats.sent.toLocaleString("pt-BR"), icon: Send, tone: "text-ebot-primary" },
                { label: "Entregues", value: selected.stats.delivered.toLocaleString("pt-BR"), icon: CheckIcon, tone: "text-ebot-green" },
                { label: "Falhas", value: String(selected.stats.failed), icon: AlertIcon, tone: "text-ebot-red" },
                { label: "Respostas", value: String(selected.stats.replied), icon: TrendingUp, tone: "text-ebot-orange" }
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-4">
                    <Icon className={cn("size-4", metric.tone)} />
                    <p className="mt-2 text-xl font-extrabold text-ebot-dark">{metric.value}</p>
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-ebot-muted">{metric.label}</p>
                  </div>
                );
              })}
            </section>

            <section className="rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 p-4">
              <h3 className="text-sm font-extrabold text-ebot-dark">Público e segmentação</h3>
              <dl className="mt-3 space-y-2 text-[13px]">
                <div className="flex justify-between gap-4"><dt className="font-bold text-ebot-muted">Lista</dt><dd className="text-right font-extrabold text-ebot-dark">{selected.audienceListName}</dd></div>
                <div className="flex justify-between gap-4"><dt className="font-bold text-ebot-muted">Agendamento</dt><dd className="text-right font-extrabold text-ebot-dark">{selected.schedule.mode === "agora" ? "Envio imediato" : `${selected.schedule.date} · ${selected.schedule.window}`}</dd></div>
                <div className="flex justify-between gap-4"><dt className="font-bold text-ebot-muted">Template</dt><dd className="text-right font-extrabold text-ebot-dark">{selected.template}</dd></div>
                <div className="flex justify-between gap-4"><dt className="font-bold text-ebot-muted">Taxa de entrega</dt><dd className="text-right font-extrabold text-ebot-green">{selected.stats.sent ? Math.round((selected.stats.delivered / selected.stats.sent) * 100) : 0}%</dd></div>
              </dl>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-extrabold text-ebot-dark">Linha do tempo</h3>
              <ol className="space-y-2">
                {[
                  { label: "Campanha criada", by: selected.sentBy, at: selected.updatedAt },
                  ...(selected.status === "finished" ? [{ label: "Envio concluído", by: "Sistema", at: "concluído" }] : []),
                  ...(selected.status === "sending" ? [{ label: "Em andamento", by: "Sistema", at: "enviando agora" }] : [])
                ].map((event, index) => (
                  <li key={index} className="flex items-center gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/35 px-3 py-2.5">
                    <span className="size-2 shrink-0 rounded-full bg-ebot-primary" />
                    <span className="flex-1 text-[13px] font-extrabold text-ebot-dark">{event.label}</span>
                    <span className="text-[11px] font-bold text-ebot-muted">{event.by} · {event.at}</span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ebot-border/[0.10] pt-4">
              <Button variant="ghost" size="sm" className="text-ebot-red hover:bg-ebot-red/[0.08] hover:text-ebot-red" onClick={() => setDeleting(selected)}><Trash2 className="size-4" />Excluir campanha</Button>
              {selected.status === "scheduled" ? <Button onClick={() => sendNow(selected)}><Send className="size-4" />Enviar agora</Button> : null}
              {selected.status === "sending" || selected.status === "paused" ? (
                <Button variant={selected.status === "sending" ? "secondary" : "primary"} onClick={() => togglePause(selected)}>
                  {selected.status === "sending" ? <><Pause className="size-4" />Pausar</> : <><Play className="size-4" />Retomar</>}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal open={creating} onClose={() => setCreating(false)} title="Nova campanha" eyebrow="Comunicação / Disparos" description="Configure público, canal e agendamento. A mensagem usa um template de fluxo." icon={Megaphone} className="max-w-xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="cmp-name" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Nome da campanha</label>
            <input id="cmp-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Lembrete de retorno pós-agendamento" className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cmp-channel" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Canal</label>
              <select id="cmp-channel" value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value as Campaign["channel"] })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45">
                <option>WhatsApp</option><option>Instagram</option><option>E-mail</option>
              </select>
            </div>
            <div>
              <label htmlFor="cmp-list" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Lista de contatos</label>
              <select id="cmp-list" value={draft.listId} onChange={(event) => setDraft({ ...draft, listId: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45">
                <option value="">Selecione…</option>
                {lists.map((list) => <option key={list.id} value={list.id}>{list.name} ({list.size.toLocaleString("pt-BR")})</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="cmp-template" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Template de mensagem</label>
            <select id="cmp-template" value={draft.template} onChange={(event) => setDraft({ ...draft, template: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45">
              <option value="">Selecione…</option>
              {templates.map((template) => <option key={template}>{template}</option>)}
            </select>
          </div>
          <fieldset>
            <legend className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Agendamento</legend>
            <div className="flex gap-2">
              {(["agora", "agendada"] as const).map((mode) => (
                <button key={mode} type="button" onClick={() => setDraft({ ...draft, mode })} className={cn("h-11 flex-1 rounded-2xl border text-xs font-extrabold transition", draft.mode === mode ? "border-ebot-primary/40 bg-ebot-primary/[0.10] text-ebot-primaryText" : "border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 text-ebot-muted")}>
                  {mode === "agora" ? "Enviar agora" : "Agendar"}
                </button>
              ))}
            </div>
            {draft.mode === "agendada" ? (
              <input value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} placeholder="Ex.: hoje, 10:00 ou sex, 10:00" className="mt-3 h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            ) : null}
          </fieldset>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.10] pt-4">
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancelar</Button>
            <Button onClick={create}><Plus className="size-4" />Criar campanha</Button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Excluir campanha"
        description={deleting ? `Excluir "${deleting.name}"? O histórico de envio também é removido.` : ""}
        confirmLabel="Excluir campanha"
      />
    </div>
  );
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function AlertIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}