"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Instagram, Mail, MessageCircle, PlugZap, Power, QrCode, RefreshCw, Smartphone, Unplug } from "lucide-react";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/Week1Primitives";
import { Toggle } from "@/components/ui/Toggle";
import { BrandChannelIcon, type BrandChannel } from "@/components/ui/BrandChannelIcon";
import { cn } from "@/lib/cn";

type ChannelKind = "whatsapp-meta" | "whatsapp-evolution" | "instagram" | "email";
type ChannelStatus = "connecting" | "connected" | "attention" | "disconnected";

type Channel = {
  id: string;
  name: string;
  kind: ChannelKind;
  provider: string;
  number: string;
  fields: Record<string, string>;
  status: ChannelStatus;
  qr?: boolean;
  queue: string;
  agents: number;
  messages7d: number;
  messagesToday: number;
  createdAt: string;
};

type Preset = {
  id: ChannelKind;
  brand: BrandChannel;
  label: string;
  hint: string;
  icon: typeof MessageCircle;
  color: string;
  provider: string;
  fields: { key: string; label: string; placeholder?: string; secret?: boolean }[];
};

const PRESETS: Preset[] = [
  {
    id: "whatsapp-meta",
    brand: "whatsapp",
    label: "WhatsApp — API oficial",
    hint: "Meta Cloud API, recomendada para escalar",
    icon: MessageCircle,
    color: "#A9D16C",
    provider: "Meta Cloud API",
    fields: [
      { key: "name", label: "Nome do canal", placeholder: "WhatsApp Filial Leste" },
      { key: "phone", label: "Número", placeholder: "+55 11 99999-1111" },
      { key: "waba", label: "WABA ID" },
      { key: "phoneId", label: "Phone Number ID" },
      { key: "token", label: "Token de acesso", secret: true }
    ]
  },
  {
    id: "whatsapp-evolution",
    brand: "whatsapp",
    label: "WhatsApp — Evolution API",
    hint: "Conexão local por QR code",
    icon: Smartphone,
    color: "#6B942E",
    provider: "Evolution API",
    fields: [
      { key: "name", label: "Nome do canal", placeholder: "WhatsApp Atendimento" },
      { key: "phone", label: "Número", placeholder: "+55 11 98888-2222" },
      { key: "instance", label: "Nome da instância", placeholder: "recepcao-principal" },
      { key: "baseUrl", label: "Base URL", placeholder: "https://api.evolution.com" },
      { key: "apiKey", label: "API key", secret: true }
    ]
  },
  {
    id: "instagram",
    brand: "instagram",
    label: "Instagram",
    hint: "Direct da empresa conectado ao Ê-Bot",
    icon: Instagram,
    color: "#8FA9B4",
    provider: "Meta",
    fields: [
      { key: "name", label: "Nome do canal", placeholder: "Instagram @ebot.oficial" },
      { key: "username", label: "Usuário", placeholder: "@ebot.oficial" },
      { key: "token", label: "Token de acesso", secret: true }
    ]
  },
  {
    id: "email",
    brand: "email",
    label: "E-mail",
    hint: "Caixa de atendimento por e-mail",
    icon: Mail,
    color: "#C97F12",
    provider: "SMTP/IMAP",
    fields: [
      { key: "name", label: "Nome do canal", placeholder: "E-mail de atendimento" },
      { key: "address", label: "E-mail remetente", placeholder: "atendimento@ebot.com.br" },
      { key: "password", label: "Senha do app", secret: true }
    ]
  }
];

type ChannelTone = "connected" | "disconnected" | "other";

const statusTone: Record<ChannelStatus, ChannelTone> = {
  connected: "connected",
  disconnected: "disconnected",
  attention: "other",
  connecting: "other"
};

const toneMeta: Record<ChannelTone, { label: string; chip: string; dot: string; bar: string }> = {
  connected: { label: "Conectado", chip: "bg-ebot-green/[0.12] text-ebot-green", dot: "bg-ebot-green", bar: "bg-ebot-green" },
  disconnected: { label: "Desconectado", chip: "bg-ebot-red/[0.10] text-ebot-red", dot: "bg-ebot-red", bar: "bg-ebot-red" },
  other: { label: "Atenção", chip: "bg-ebot-orange/[0.12] text-ebot-orange", dot: "bg-ebot-orange animate-pulse", bar: "bg-ebot-orange" }
};

const statusMeta: Record<ChannelStatus, { label: string; chip: string; dot: string }> = {
  connected: { label: "Conectado", chip: "bg-ebot-green/[0.12] text-ebot-green", dot: "bg-ebot-green" },
  attention: { label: "Atenção", chip: "bg-ebot-orange/[0.12] text-ebot-orange", dot: "bg-ebot-orange animate-pulse" },
  connecting: { label: "Conectando…", chip: "bg-ebot-orange/[0.12] text-ebot-orange", dot: "bg-ebot-orange animate-pulse" },
  disconnected: { label: "Desconectado", chip: "bg-ebot-red/[0.10] text-ebot-red", dot: "bg-ebot-red" }
};

const SEED_CHANNELS: Channel[] = [
  { id: "chn-wh-principal", name: "WhatsApp Principal", kind: "whatsapp-meta", provider: "Meta Cloud API", number: "+55 11 91234-5678", fields: {}, status: "connected", queue: "Atendimento geral", agents: 6, messages7d: 1284, messagesToday: 213, createdAt: "há 34 dias" },
  { id: "chn-evolution-leste", name: "WhatsApp Filial Leste", kind: "whatsapp-evolution", provider: "Evolution API", number: "+55 11 98765-4321", fields: {}, status: "connected", qr: true, queue: "Triagem de novos", agents: 3, messages7d: 642, messagesToday: 96, createdAt: "há 12 dias" },
  { id: "chn-ig", name: "Instagram da empresa", kind: "instagram", provider: "Meta", number: "@ebot.oficial", fields: {}, status: "attention", queue: "Varejo", agents: 2, messages7d: 118, messagesToday: 12, createdAt: "há 21 dias" },
  { id: "chn-email", name: "E-mail de atendimento", kind: "email", provider: "SMTP/IMAP", number: "atendimento@ebot.com.br", fields: {}, status: "connected", queue: "Financeiro", agents: 2, messages7d: 89, messagesToday: 7, createdAt: "há 41 dias" }
];

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function qrModules(seed: string) {
  const modules: boolean[][] = [];
  let value = hashSeed(seed) || 1;
  for (let row = 0; row < 21; row++) {
    const line: boolean[] = [];
    for (let col = 0; col < 21; col++) {
      const finder = (r: number, c: number) => {
        const zone = (r >= 14 && c >= 0 && c < 7) ? "bl" : (r >= 0 && r < 7 && c >= 14) ? "tr" : (r < 7 && c < 7) ? "tl" : "";
        if (!zone) return null;
        const rr = zone === "bl" ? r - 14 : r;
        const cc = zone === "tr" ? c - 14 : c;
        return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
      };
      const inFinder = finder(row, col);
      if (inFinder !== null) {
        line.push(inFinder);
        continue;
      }
      value = Math.imul(value ^ (value >>> 15), 2246822519) >>> 0;
      line.push((value & 1) === 1);
    }
    modules.push(line);
  }
  return modules;
}

export function CanaisPage() {
  const { toast } = useDemo();
  const [channels, setChannels] = useState<Channel[]>(SEED_CHANNELS);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState<Channel | null>(null);
  const [presetId, setPresetId] = useState<ChannelKind>("whatsapp-meta");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [qrRequested, setQrRequested] = useState(false);

  const preset = PRESETS.find((item) => item.id === presetId) ?? PRESETS[0];
  const qrModulesGrid = useMemo(() => qrModules(draft.name || preset.label || "ebot"), [draft.name, preset.label]);

  const connectedCount = channels.filter((channel) => channel.status === "connected").length;

  function openCreate() {
    setPresetId("whatsapp-meta");
    setDraft({});
    setQrRequested(false);
    setViewing(null);
    setModalOpen(true);
  }

  function openView(channel: Channel) {
    setPresetId(channel.kind);
    setDraft(channel.fields);
    setQrRequested(Boolean(channel.qr));
    setViewing(channel);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setViewing(null);
  }

  function addChannel() {
    if (!draft.name?.trim()) {
      toast("Informe o nome do canal.", "warning");
      return;
    }
    if (!draft.phone?.trim() && preset.fields.some((field) => field.key === "phone")) {
      toast("Informe o número do canal.", "warning");
      return;
    }
    const channel: Channel = {
      id: `chn-${Date.now()}`,
      name: draft.name.trim(),
      kind: preset.id,
      provider: preset.provider,
      number: draft.phone?.trim() || draft.username?.trim() || draft.address?.trim() || "—",
      fields: { ...draft, name: draft.name.trim() },
      status: preset.id === "whatsapp-evolution" ? "connecting" : "disconnected",
      qr: preset.id === "whatsapp-evolution",
      queue: "Triagem de novos",
      agents: 0,
      messages7d: 0,
      messagesToday: 0,
      createdAt: "agora"
    };
    setChannels((current) => [...current, channel]);
    closeModal();
    if (preset.id === "whatsapp-evolution") {
      toast(`QR code de "${channel.name}" gerado. Escaneie com o WhatsApp do número informado.`);
    } else {
      toast("Canal adicionado à fila de conexão.");
    }
  }

  function requestQr() {
    if (!draft.name?.trim()) {
      toast("Informe o nome do canal.", "warning");
      return;
    }
    setQrRequested(true);
    toast("QR code gerado. Escaneie com o WhatsApp do número informado.");
  }

  function finishConnection() {
    if (viewing) {
      const next: Channel = { ...viewing, status: "connected", qr: true };
      setChannels((current) => current.map((channel) => (channel.id === viewing.id ? next : channel)));
      closeModal();
      toast(`"${viewing.name}" conectado com sucesso.`);
      return;
    }
    const channel: Channel = {
      id: `chn-${Date.now()}`,
      name: draft.name?.trim() || preset.label,
      kind: preset.id,
      provider: preset.provider,
      number: draft.phone?.trim() || draft.username?.trim() || draft.address?.trim() || "—",
      fields: { ...draft },
      status: "connected",
      qr: true,
      queue: "Triagem de novos",
      agents: 0,
      messages7d: 0,
      messagesToday: 0,
      createdAt: "agora"
    };
    setChannels((current) => [...current, channel]);
    closeModal();
    toast(`"${channel.name}" conectado com sucesso.`);
  }

  function test(channel: Channel) {
    window.setTimeout(() => {
      setChannels((current) => current.map((item) => (item.id === channel.id ? { ...item, status: "connected" } : item)));
      toast(`Conexão de "${channel.name}" verificada e válida.`);
    }, 900);
    toast(`Testando conexão de "${channel.name}"…`);
  }

  function disconnect(channel: Channel) {
    setChannels((current) => current.map((item) => (item.id === channel.id ? { ...item, status: "disconnected", qr: false } : item)));
    toast(`"${channel.name}" desconectado. Os fluxos que o usam foram pausados.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Comunicação / Canais"
        title="Canais"
        description="WhatsApp, Instagram e e-mail conectados ao Ê-Bot. Cada canal entrega conversas para as filas de atendimento."
        aside={<span className="inline-flex items-center gap-2 rounded-full bg-ebot-green/[0.09] px-3 py-2 text-xs font-extrabold text-ebot-green"><PlugZap className="size-4" />{connectedCount} conectados de {channels.length}</span>}
        action={<Button onClick={openCreate}><PlugZap className="size-4" />Conectar canal</Button>}
      />

      <div data-channel-list className="grid max-w-[1440px] grid-cols-1 justify-start gap-3 sm:grid-cols-[repeat(auto-fit,minmax(260px,320px))]">
        {channels.map((channel) => {
          const meta = statusMeta[channel.status];
          const tone = toneMeta[statusTone[channel.status]];
          const presetMeta = PRESETS.find((item) => item.id === channel.kind);
          const accent = presetMeta?.color ?? "#6B942E";
          const brand = presetMeta?.brand ?? "whatsapp";
          const online = channel.status === "connected";
          return (
            <article key={channel.id} data-channel-card data-channel-id={channel.id} data-channel-kind={channel.kind} data-channel-tone={statusTone[channel.status]} className={cn("overflow-hidden rounded-[20px] border bg-ebot-surface/80 shadow-[0_8px_24px_rgba(4,27,21,0.04)] transition hover:-translate-y-0.5 hover:shadow-card", channel.status === "attention" || channel.status === "connecting" ? "border-ebot-orange/30" : channel.status === "disconnected" ? "border-ebot-red/25" : "border-ebot-border/[0.14]")}>
              <span className={cn("block h-1 w-full", tone.bar)} aria-hidden="true" />
              <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}1E`, color: accent }}>
                    <BrandChannelIcon brand={brand} className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-ebot-dark">{channel.name}</h3>
                    <p className="text-[11px] font-bold text-ebot-muted">{channel.provider}</p>
                  </div>
                </div>
                <span className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-extrabold", meta.chip)}>
                  <span className={cn("size-1.5 rounded-full", meta.dot)} />
                  {meta.label}
                </span>
              </div>

              <dl className="mt-3 space-y-1.5 rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/30 px-3 py-2.5 text-[12px] font-bold">
                <div className="flex items-center justify-between gap-2"><dt className="uppercase tracking-wider text-ebot-muted">Conexão</dt><dd className="truncate text-ebot-dark">{channel.number}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt className="uppercase tracking-wider text-ebot-muted">Fila</dt><dd className="truncate text-ebot-dark">{channel.queue}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt className="uppercase tracking-wider text-ebot-muted">Atividade</dt><dd className="tabular-nums text-ebot-dark">{channel.agents} atendentes · {channel.messagesToday} hoje</dd></div>
              </dl>

              {channel.qr && (
                <button type="button" onClick={() => openView(channel)} className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 p-2.5 text-left transition hover:border-ebot-primary/35">
                  <div className="grid shrink-0 grid-cols-7 gap-0 rounded-lg bg-white p-1.5 shadow-[0_4px_12px_rgba(4,27,21,0.10)]">
                    {qrModules(channel.id).slice(7, 14).map((line, row) =>
                      line.slice(7, 14).map((filled, col) => (
                        <span key={`${row}-${col}`} className={cn("size-1.5", filled ? "bg-ebot-dark" : "bg-white")} />
                      ))
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-extrabold text-ebot-dark">QR code de conexão</p>
                    <p className="text-[11px] font-bold text-ebot-muted">{channel.status === "connecting" ? "Aguardando leitura no WhatsApp…" : "Escaneado e vinculado a este canal"}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-ebot-primaryText"><QrCode className="size-3.5" />Ver QR</span>
                </button>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-ebot-surfaceMuted/30 px-2.5 py-2 text-center">
                  <p className="text-[13px] font-extrabold text-ebot-dark">{channel.agents}</p>
                  <p className="text-[10px] font-bold text-ebot-muted">Atendentes</p>
                </div>
                <div className="rounded-xl bg-ebot-surfaceMuted/30 px-2.5 py-2 text-center">
                  <p className="text-[13px] font-extrabold text-ebot-dark">{channel.messagesToday}</p>
                  <p className="text-[10px] font-bold text-ebot-muted">Msgs hoje</p>
                </div>
                <div className="rounded-xl bg-ebot-surfaceMuted/30 px-2.5 py-2 text-center">
                  <p className="text-[13px] font-extrabold text-ebot-dark">{channel.messages7d}</p>
                  <p className="text-[10px] font-bold text-ebot-muted">Msgs 7 dias</p>
                </div>
              </div>

              <Toggle
                className="mt-3"
                checked={online}
                onChange={() => (online ? disconnect(channel) : test(channel))}
                label="Canal em operação"
                statusOn="Em operação"
                statusOff="Fora de operação"
                icon={Power}
                accent={channel.status === "disconnected" ? "amber" : "green"}
              />

              <div className="mt-3 flex flex-wrap gap-2 border-t border-ebot-border/[0.10] pt-3">
                {channel.status === "connecting" ? (
                  <>
                    <Button size="sm" onClick={() => openView(channel)}><QrCode className="size-3.5" />Ver QR code</Button>
                    <Button size="sm" variant="ghost" onClick={() => disconnect(channel)}><Unplug className="size-3.5" />Desconectar</Button>
                  </>
                ) : channel.status === "disconnected" ? (
                  <>
                    <Button size="sm" onClick={() => openView(channel)}><PlugZap className="size-3.5" />Reconectar</Button>
                    <Button size="sm" variant="ghost" onClick={() => disconnect(channel)}><Power className="size-3.5" />Remover</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => test(channel)}><RefreshCw className="size-3.5" />Testar conexão</Button>
                    <Button size="sm" variant="ghost" onClick={() => disconnect(channel)}><Power className="size-3.5" />Desconectar</Button>
                  </>
                )}
              </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="flex items-start gap-1.5 rounded-[20px] border border-ebot-border/[0.12] bg-ebot-surface/70 px-4 py-3 text-[11px] font-bold leading-4 text-ebot-muted">
        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ebot-green" />
        Na Evolution API a conexão é feita escaneando o QR code com o WhatsApp conectado. Na API oficial da Meta, a validação é automática após o token de acesso.
      </p>

      <Modal open={modalOpen} onClose={closeModal} title={viewing ? `Canal: ${viewing.name}` : "Conectar canal"} description={viewing ? "Acompanhe a conexão deste canal." : "Escolha o tipo de canal e preencha os dados de conexão."}>
        <div className="space-y-4">
          {!viewing && (
            <div className="grid gap-2 sm:grid-cols-2">
              {PRESETS.map((item) => {
                return (
                  <button type="button" key={item.id} onClick={() => { setPresetId(item.id); setDraft({}); setQrRequested(false); }} className={cn("rounded-2xl border p-3 text-left transition", presetId === item.id ? "border-ebot-primary/60 bg-ebot-primary/[0.06]" : "border-ebot-border/[0.14] bg-ebot-surfaceMuted/35 hover:border-ebot-primary/30")}>
                    <span className="flex items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${item.color}22`, color: item.color }}>
                        <BrandChannelIcon brand={item.brand} className="size-4" />
                      </span>
                      <span className="text-[12px] font-extrabold leading-tight text-ebot-dark">{item.label}</span>
                    </span>
                    <span className="mt-1.5 block text-[10px] font-bold leading-3.5 text-ebot-muted">{item.hint}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {preset.fields.map((field) => (
              <div key={field.key} className={cn(field.key === "token" || field.key === "apiKey" || field.key === "password" ? "sm:col-span-2" : "")}>
                <label htmlFor={`chn-${field.key}`} className="mb-1.5 block text-xs font-extrabold text-ebot-slate">{field.label}</label>
                <input id={`chn-${field.key}`} type={field.secret ? "password" : "text"} value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} placeholder={field.placeholder} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
              </div>
            ))}
          </div>

          {preset.id === "whatsapp-evolution" && qrRequested && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/25 p-5">
              <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] gap-0 rounded-xl bg-white p-3 shadow-[0_10px_28px_rgba(4,27,21,0.14)]" aria-label="QR code">
                {qrModulesGrid.flatMap((line, row) => line.map((filled, col) => (
                  <span key={`${row}-${col}`} className={cn("size-1.5", filled ? "bg-ebot-dark" : "bg-white")} />
                )))}
              </div>
              <div className="text-center">
                <p className="text-[12px] font-extrabold text-ebot-dark">Escaneie com o WhatsApp</p>
                <p className="text-[11px] font-bold text-ebot-muted">Abra o WhatsApp no celular do número informado: Configurações → Aparelhos conectados → Conectar um aparelho.</p>
              </div>
              {(viewing?.status === "connecting" || !viewing) && (
                <Button onClick={finishConnection}><CheckCircle2 className="size-4" />Concluir conexão</Button>
              )}
            </div>
          )}

          {preset.id === "whatsapp-evolution" && !qrRequested && (
            <p className="flex items-start gap-1.5 text-[11px] font-bold leading-4 text-ebot-muted">
              <QrCode className="mt-0.5 size-3.5 shrink-0 text-ebot-primaryText" />
              Ao gerar o QR code, conecte o número informado no WhatsApp para ativar o canal. A Evolution API vincula o QR à instância criada.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
            {preset.id === "whatsapp-evolution" && !qrRequested ? (
              <Button onClick={requestQr}><QrCode className="size-4" />Gerar QR Code</Button>
            ) : qrRequested ? null : (
              <Button onClick={addChannel}><PlugZap className="size-4" />Adicionar canal</Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
