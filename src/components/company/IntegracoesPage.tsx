"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, CalendarDays, CheckCircle2, FlaskConical, MessageCircle, PlugZap, Plus, Power, RefreshCw, Sparkles, Webhook } from "lucide-react";
import { listIntegrations, newCompanyId, saveIntegration } from "@/lib/company/companyService";
import type { Integration } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/Week1Primitives";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { cn } from "@/lib/cn";

const kindMeta = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "#4CB782" },
  google: { label: "Google", icon: CalendarClock, color: "#3A9DCA" },
  openai: { label: "OpenAI", icon: Sparkles, color: "#5A7873" },
  agenda: { label: "Agenda", icon: CalendarDays, color: "#E2574C" },
  lab: { label: "Laboratório", icon: FlaskConical, color: "#F2A34D" },
  webhook: { label: "Webhook", icon: Webhook, color: "#8E6FBD" }
} as const;

const statusMeta = {
  connected: { label: "Conectada", chip: "bg-clinical-green/[0.12] text-clinical-green", dot: "bg-clinical-green" },
  attention: { label: "Atenção", chip: "bg-clinical-orange/[0.12] text-clinical-orange", dot: "bg-clinical-orange animate-pulse" },
  disconnected: { label: "Desconectada", chip: "bg-clinical-red/[0.10] text-clinical-red", dot: "bg-clinical-red" }
} as const;

type PresetField = { key: string; label: string; placeholder?: string; secret?: boolean };
type Preset = {
  id: string;
  label: string;
  hint: string;
  kind: Integration["kind"];
  provider: string;
  iconColor: string;
  scopes: string[];
  fields: PresetField[];
  events?: string[];
};

const PRESETS: Preset[] = [
  {
    id: "whatsapp-oficial",
    label: "WhatsApp Business API (Meta)",
    hint: "Canal oficial do WhatsApp com Cloud API",
    kind: "whatsapp",
    provider: "Meta Cloud API",
    iconColor: "#4CB782",
    scopes: ["envio e recebimento de mensagens", "template messages", "validação de número"],
    fields: [
      { key: "wabaId", label: "WABA ID" },
      { key: "phoneId", label: "Phone Number ID" },
      { key: "accessToken", label: "Token de acesso", secret: true },
      { key: "verifyToken", label: "Verify token", secret: true }
    ]
  },
  {
    id: "whatsapp-evolution",
    label: "WhatsApp — Evolution API",
    hint: "API não oficial com conexão por QR code",
    kind: "whatsapp",
    provider: "Evolution API",
    iconColor: "#4CB782",
    scopes: ["envio e recebimento de mensagens", "QR code", "webhook de eventos"],
    fields: [
      { key: "instance", label: "Nome da instância", placeholder: "recepcao-principal" },
      { key: "baseUrl", label: "Base URL", placeholder: "https://api.evolution.com" },
      { key: "apiKey", label: "API key", secret: true },
      { key: "phone", label: "Número conectado", placeholder: "55 11 91234-5678" }
    ]
  },
  {
    id: "google",
    label: "Google Workspace",
    hint: "Agenda, contatos e calendários da unidade",
    kind: "google",
    provider: "Google",
    iconColor: "#3A9DCA",
    scopes: ["agenda", "contatos"],
    fields: [
      { key: "account", label: "E-mail da conta" },
      { key: "clientId", label: "Client ID", secret: true },
      { key: "clientSecret", label: "Client Secret", secret: true }
    ]
  },
  {
    id: "openai",
    label: "OpenAI",
    hint: "IA conversacional do Ê-Bot",
    kind: "openai",
    provider: "OpenAI",
    iconColor: "#5A7873",
    scopes: ["IA conversacional"],
    fields: [
      { key: "model", label: "Modelo", placeholder: "gpt-4o-mini" },
      { key: "apiKey", label: "API key", secret: true }
    ]
  },
  {
    id: "lab",
    label: "Laboratório parceiro",
    hint: "Resultados de exames e agendamento laboratorial",
    kind: "lab",
    provider: "Laboratório",
    iconColor: "#F2A34D",
    scopes: ["resultados de exames", "agendamento laboratorial"],
    fields: [
      { key: "url", label: "URL do sistema" },
      { key: "token", label: "Token de acesso", secret: true },
      { key: "unit", label: "Código da unidade" }
    ]
  },
  {
    id: "webhook",
    label: "Webhook personalizado",
    hint: "Receba eventos do Ê-Bot em qualquer sistema",
    kind: "webhook",
    provider: "Webhook",
    iconColor: "#8E6FBD",
    scopes: ["eventos configurados"],
    events: ["message.received", "message.sent", "status.changed", "campaign.finished", "patient.created"],
    fields: [
      { key: "url", label: "URL do webhook", placeholder: "https://api.suaempresa.com/ebot" },
      { key: "secret", label: "Secret (assinatura HMAC)", secret: true }
    ]
  }
];

const WEBHOOK_EVENTS = ["message.received", "message.sent", "status.changed", "campaign.finished", "patient.created"];

export function IntegracoesPage() {
  const { toast } = useDemo();
  const [integrations, setIntegrations] = useState<Integration[]>(() => listIntegrations());
  const [creating, setCreating] = useState(false);
  const [presetId, setPresetId] = useState<Preset["id"]>("");
  const [name, setName] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [events, setEvents] = useState<string[]>([]);

  const stats: StatItem[] = useMemo(() => [
    { id: "connected", label: "Integrações ativas", value: String(integrations.filter((item) => item.status === "connected").length), hint: `de ${integrations.length} cadastradas`, tone: "green", icon: PlugZap },
    { id: "attention", label: "Precisam de atenção", value: String(integrations.filter((item) => item.status === "attention").length), hint: "verificar conexão", tone: "orange", icon: AlertTriangle },
    { id: "synced", label: "Sincronização", value: "6/6", hint: "canais em tempo real", tone: "blue", icon: RefreshCw }
  ], [integrations]);

  const preset = PRESETS.find((item) => item.id === presetId);

  function openCreate(presetItem: Preset) {
    setPresetId(presetItem.id);
    setName("");
    setFields({});
    setEvents(presetItem.events ? [presetItem.events[0]] : []);
  }

  function create() {
    if (!preset) return;
    if (!name.trim()) {
      toast("Dê um nome para a integração.", "warning");
      return;
    }
    const required = preset.fields.filter((field) => !field.secret);
    const missing = required.some((field) => !fields[field.key]?.trim());
    if (missing) {
      toast("Preencha os dados de conexão da integração.", "warning");
      return;
    }
    const integration: Integration = {
      id: newCompanyId("int"),
      name: name.trim(),
      provider: preset.provider,
      kind: preset.kind,
      status: "disconnected",
      iconColor: preset.iconColor,
      lastSync: "—",
      details: preset.fields.map((field) => ({
        label: field.label,
        value: fields[field.key]?.trim() ? (field.secret ? "••••••••" : fields[field.key].trim()) : "—"
      })),
      scopes: preset.events && events.length > 0 ? [...events] : preset.scopes
    };
    saveIntegration(integration);
    setIntegrations(listIntegrations());
    setCreating(false);
    toast(`"${integration.name}" cadastrada. Conecte agora para ativar.`);
  }

  function toggleEvent(event: string) {
    setEvents((current) => current.includes(event) ? current.filter((item) => item !== event) : [...current, event]);
  }

  function connect(integration: Integration) {
    const next: Integration = { ...integration, status: "connected", lastSync: "agora" };
    saveIntegration(next);
    setIntegrations(listIntegrations());
    toast(`"${integration.name}" conectada com sucesso.`);
  }

  function check(integration: Integration) {
    window.setTimeout(() => {
      const next: Integration = { ...integration, status: "connected", lastSync: "agora" };
      saveIntegration(next);
      setIntegrations(listIntegrations());
      toast(`Conexão com "${integration.name}" verificada e válida.`);
    }, 900);
    toast(`Verificando conexão de "${integration.name}"…`);
  }

  function disconnect(integration: Integration) {
    const next: Integration = { ...integration, status: revision(integration) };
    saveIntegration(next);
    setIntegrations(listIntegrations());
    toast(`"${integration.name}" desconectada. Os fluxos que a usam foram pausados.`);
  }

  function revision(integration: Integration): Integration["status"] {
    return integration.status === "connected" ? "disconnected" : integration.status;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Conectores"
        title="Integrações"
        description="Canais, agenda, IA e parceiros conectados à operação. Cada conexão define escopos de acesso que o Ê-Bot utiliza."
        action={<Button onClick={() => { setPresetId(""); setCreating(true); }}><Plus className="size-4" />Nova integração</Button>}
      />

      <StatStrip items={stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        {integrations.map((integration) => {
          const kind = kindMeta[integration.kind];
          const status = statusMeta[integration.status];
          const Icon = kind.icon;
          return (
            <article key={integration.id} className="rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5 shadow-[0_8px_24px_rgba(38,53,50,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${integration.iconColor}22`, color: integration.iconColor }}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-clinical-dark">{integration.name}</h3>
                    <p className="text-[11px] font-bold text-clinical-muted">{integration.provider} · sinc. {integration.lastSync}</p>
                  </div>
                </div>
                <span className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-extrabold", status.chip)}>
                  <span className={cn("size-1.5 rounded-full", status.dot)} />
                  {status.label}
                </span>
              </div>

              <dl className="mt-4 space-y-1.5 rounded-2xl bg-clinical-surfaceMuted/30 p-3.5">
                {integration.details.map((detail) => (
                  <div key={detail.label} className="flex items-center justify-between gap-3 text-[12px]">
                    <dt className="font-extrabold text-clinical-muted">{detail.label}</dt>
                    <dd className="font-bold text-clinical-dark">{detail.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {integration.scopes.map((scope) => (
                  <span key={scope} className="rounded-lg bg-clinical-blue/[0.08] px-2 py-1 text-[10px] font-extrabold text-clinical-blueText">{scope}</span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {integration.status === "disconnected" ? (
                  <Button size="sm" onClick={() => connect(integration)}><PlugZap className="size-3.5" />Conectar agora</Button>
                ) : (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => check(integration)}><RefreshCw className="size-3.5" />Verificar conexão</Button>
                    <Button size="sm" variant="ghost" onClick={() => disconnect(integration)}><Power className="size-3.5" />Desconectar</Button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="flex items-start gap-1.5 rounded-[20px] border border-clinical-border/[0.12] bg-clinical-surface/70 px-4 py-3 text-[11px] font-bold leading-4 text-clinical-muted">
        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-clinical-green" />
        A Ê-Bot mantém o webhook de mensagens registrado automaticamente. Ao desconectar um canal, os fluxos que dependem dele entram em pausa com alerta para a equipe.
      </p>

      <Modal open={creating} onClose={() => setCreating(false)} title="Nova integração" description="Escolha o tipo de conexão e preencha os dados de acesso.">
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {PRESETS.map((item) => {
              const meta = kindMeta[item.kind];
              const Icon = meta.icon;
              const selected = presetId === item.id;
              return (
                <button key={item.id} onClick={() => openCreate(item)} className={cn("rounded-2xl border p-3 text-left transition", selected ? "border-clinical-blue/60 bg-clinical-blue/[0.06]" : "border-clinical-border/[0.14] bg-clinical-surfaceMuted/35 hover:border-clinical-blue/30")}>
                  <span className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${item.iconColor}22`, color: item.iconColor }}>
                      <Icon className="size-4" />
                    </span>
                    <span className="text-[12px] font-extrabold leading-tight text-clinical-dark">{item.label}</span>
                  </span>
                  <span className="mt-1.5 block text-[10px] font-bold leading-3.5 text-clinical-muted">{item.hint}</span>
                </button>
              );
            })}
          </div>

          {preset && (
            <div className="space-y-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/25 p-4">
              <div>
                <label htmlFor="int-name" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Nome da integração</label>
                <input id="int-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder={`Ex.: ${preset.label}`} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface/70 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {preset.fields.map((field) => (
                  <div key={field.key}>
                    <label htmlFor={`int-${field.key}`} className="mb-1.5 block text-xs font-extrabold text-clinical-slate">{field.label}</label>
                    <input id={`int-${field.key}`} type={field.secret ? "password" : "text"} value={fields[field.key] ?? ""} onChange={(event) => setFields({ ...fields, [field.key]: event.target.value })} placeholder={field.placeholder} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surface/70 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
                  </div>
                ))}
              </div>

              {preset.events && (
                <div>
                  <p className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Eventos recebidos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {WEBHOOK_EVENTS.map((event) => (
                      <button key={event} onClick={() => toggleEvent(event)} className={cn("rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition", events.includes(event) ? "bg-clinical-blue/[0.10] text-clinical-blueText" : "bg-clinical-surfaceMuted text-clinical-muted hover:text-clinical-slate")}>{event}</button>
                    ))}
                  </div>
                </div>
              )}

              <p className="flex items-start gap-1.5 text-[11px] font-bold leading-4 text-clinical-muted">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-clinical-green" />
                {preset.kind === "whatsapp" ? "A conexão será testada ao clicar em Conectar agora. Para a Evolution API, o QR code aparece na página de Canais." : `A integração ficará disponível com status "Desconectada" até a primeira conexão válida.`}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancelar</Button>
            <Button onClick={create} disabled={!preset}><Plus className="size-4" />Criar integração</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
