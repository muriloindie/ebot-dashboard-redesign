"use client";

import {
  Bot,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  Clock3,
  FileText,
  FlaskConical,
  Headset,
  Image as ImageIcon,
  MessageCircle,
  MessagesSquare,
  Mic,
  MonitorSmartphone,
  Play,
  Stethoscope,
  UserRound,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import type { ProtocolMessage, ProtocolRecord } from "@/data/protocolsMock";
import { StatusBadge } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

export const categoryMeta: Record<ProtocolRecord["category"], { icon: LucideIcon; tone: "blue" | "green" | "orange" | "neutral"; iconClass: string }> = {
  "Primeiro contato": { icon: UserRound, tone: "blue", iconClass: "bg-ebot-primary/10 text-ebot-primaryText" },
  Agendamento: { icon: CalendarDays, tone: "blue", iconClass: "bg-ebot-teal/12 text-ebot-teal" },
  "Pós-venda": { icon: CheckCircle2, tone: "green", iconClass: "bg-ebot-green/12 text-ebot-green" },
  Pedidos: { icon: FlaskConical, tone: "green", iconClass: "bg-ebot-green/12 text-ebot-green" },
  Reagendamento: { icon: Clock3, tone: "orange", iconClass: "bg-ebot-orange/12 text-ebot-orange" }
};

const statusTone: Record<ProtocolRecord["status"], "blue" | "green" | "orange" | "red" | "neutral"> = {
  "Em andamento": "blue",
  Concluído: "green",
  Aguardando: "orange",
  Cancelado: "red"
};

export function statusBadgeTone(status: ProtocolRecord["status"]): "blue" | "green" | "orange" | "red" | "neutral" { return statusTone[status]; }

const senderMeta: Record<ProtocolMessage["senderKind"], { label: string; chip: string; icon: LucideIcon }> = {
  client: { label: "Cliente", chip: "bg-ebot-surfaceMuted text-ebot-muted", icon: UserRound },
  attendant: { label: "Atendente", chip: "bg-ebot-primary/[0.10] text-ebot-primaryText", icon: Headset },
  robot: { label: "Robô", chip: "bg-ebot-teal/[0.12] text-ebot-teal", icon: Bot },
  system: { label: "Sistema", chip: "bg-ebot-green/[0.10] text-ebot-green", icon: CheckCircle2 }
};

export function ProtocolField({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">{label}</dt><dd className="mt-0.5 truncate text-[12px] font-extrabold text-ebot-dark" title={value}>{value}</dd></div>;
}

function ReportCard({ icon: Icon, label, value, accent }: { icon: LucideIcon; label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surface/85 px-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}1E`, color: accent }}>
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-ebot-muted">{label}</span>
        <span className="block truncate text-[13px] font-extrabold text-ebot-dark" title={value}>{value}</span>
      </span>
    </div>
  );
}

function MessageAttachment({ message }: { message: ProtocolMessage }) {
  if (message.kind === "audio") {
    const seconds = message.durationSeconds ?? 0;
    const label = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    return (
      <span className="mt-2 flex items-center gap-2 rounded-xl bg-ebot-surfaceMuted px-2.5 py-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ebot-teal text-white"><Play className="ml-0.5 size-3.5" /></span>
        <span className="h-1 min-w-16 flex-1 overflow-hidden rounded-full bg-ebot-border/[0.20]"><span className="block h-full w-1/3 rounded-full bg-ebot-teal" /></span>
        <span className="text-[11px] font-extrabold tabular-nums text-ebot-slate">{label}</span>
        <Mic className="size-3.5 shrink-0 text-ebot-teal" />
      </span>
    );
  }
  if (message.kind === "image") {
    return (
      <span className="mt-2 flex items-center gap-2.5 rounded-xl bg-ebot-surfaceMuted p-2">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-ebot-primary/[0.10] text-ebot-primaryText"><ImageIcon className="size-5" /></span>
        <span className="min-w-0">
          <span className="block truncate text-[12px] font-extrabold text-ebot-primaryText">{message.attachmentName ?? "Imagem anexada"}</span>
          <span className="block text-[10px] font-bold text-ebot-muted">Toque para visualizar</span>
        </span>
      </span>
    );
  }
  if (message.kind === "document") {
    return (
      <span className="mt-2 flex items-center gap-1.5 rounded-xl bg-ebot-surfaceMuted px-2.5 py-2 text-[11px] font-extrabold text-ebot-primaryText"><FileText className="size-3.5" />{message.attachmentName ?? "Documento anexado"}</span>
    );
  }
  return null;
}

export function ProtocolReport({ protocol, onOpenContact }: { protocol: ProtocolRecord; onOpenContact: () => void }) {
  const meta = categoryMeta[protocol.category];
  const Icon = meta.icon;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-ebot-primary/15 bg-ebot-primary/[0.06] p-4" aria-label="Resumo do atendimento">
        <div className="flex items-start gap-3">
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", meta.iconClass)}><Icon className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-extrabold text-ebot-dark">{protocol.title} · <span className="font-mono">{protocol.number}</span></h3>
            <p className="mt-0.5 text-xs font-semibold text-ebot-muted">{protocol.summary}</p>
          </div>
          <StatusBadge label={protocol.status} tone={statusBadgeTone(protocol.status)} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button type="button" onClick={onOpenContact} title="Abrir página do contato" className="text-left transition hover:opacity-80">
            <ReportCard icon={UserRound} label="Contato" value={`${protocol.clientName}`} accent="#6B942E" />
          </button>
          <ReportCard icon={Headset} label="Usuário" value={protocol.user} accent="#8FA9B4" />
          <ReportCard icon={UsersRound} label="Setor" value={protocol.sector} accent="#A9D16C" />
          <ReportCard icon={MessageCircle} label="Fila" value={protocol.queue} accent="#C97F12" />
          <ReportCard icon={Clock3} label="Primeira mensagem" value={protocol.firstMessageAt} accent="#6B942E" />
          <ReportCard icon={CalendarDays} label="Atendimento iniciado" value={protocol.attendedAt} accent="#A9D16C" />
          <ReportCard icon={Mic} label="Duração" value={protocol.duration} accent="#C13E3E" />
          <ReportCard icon={CheckCircle2} label="Status" value={protocol.status} accent="#5D737E" />
        </div>
      </section>

      <section aria-labelledby="protocol-messages-title">
        <div className="mb-3 flex items-center justify-between gap-2"><div><h3 id="protocol-messages-title" className="text-sm font-extrabold text-ebot-dark">Logs da conversa</h3><p className="mt-0.5 text-xs font-semibold text-ebot-muted">Todas as mensagens trocadas no canal {protocol.channel}, com origem e leitura.</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-ebot-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-ebot-muted"><MessagesSquare className="size-3.5" />{protocol.messages.length} mensagens</span></div>
        {protocol.messages.length ? <div className="space-y-2.5 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/25 p-3" aria-label="Histórico de mensagens">{protocol.messages.map((message) => {
          const sender = senderMeta[message.senderKind];
          const SenderIcon = sender.icon;
          return (
            <article key={message.id} data-protocol-message data-message-id={message.id} className={cn("flex", message.direction === "outgoing" ? "justify-end" : message.direction === "system" ? "justify-center" : "justify-start")}>
              <div className={cn("max-w-[88%] rounded-2xl border px-3.5 py-3", message.direction === "outgoing" ? "rounded-tr-md border-ebot-primary/15 bg-ebot-primary/[0.09]" : message.direction === "system" ? "border-ebot-green/15 bg-ebot-green/[0.07]" : "rounded-tl-md border-ebot-border/[0.12] bg-ebot-surface/85")}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold", sender.chip)}><SenderIcon className="size-3" />{sender.label}</span>
                  <span className="text-[11px] font-extrabold text-ebot-dark">{message.senderKind === "attendant" && message.attendant ? message.attendant : message.sender}</span>
                  <time className="ml-auto shrink-0 text-[10px] font-bold text-ebot-muted">{message.sentAt}</time>
                </div>
                <p className="mt-2 text-[13px] leading-5 text-ebot-slate">{message.text}</p>
                <MessageAttachment message={message} />
                {message.senderKind !== "system" ? (
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-bold text-ebot-muted">
                    {message.device ? <span className="inline-flex items-center gap-1"><MonitorSmartphone className="size-3" />{message.device}</span> : null}
                    {message.kind === "audio"
                      ? <span className="inline-flex items-center gap-1">{message.listened ? <><CheckCheck className="size-3 text-ebot-teal" />Ouvido</> : "Não ouvido"}</span>
                      : message.direction === "outgoing"
                        ? <span className="inline-flex items-center gap-1">{message.read ? <><CheckCheck className="size-3 text-ebot-primary" />Visualizado</> : "Enviado"}</span>
                        : null}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}</div> : <div className="rounded-2xl border border-dashed border-ebot-border/[0.16] p-8 text-center text-sm font-semibold text-ebot-muted">Nenhuma mensagem salva para este atendimento.</div>}
      </section>

      <div className="flex items-start gap-2 rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.07] p-3 text-xs font-semibold leading-5 text-ebot-slate"><Stethoscope className="mt-0.5 size-4 shrink-0 text-ebot-green" />Este relatório é somente leitura. A edição do atendimento acontece na central de atendimentos.</div>
    </div>
  );
}
