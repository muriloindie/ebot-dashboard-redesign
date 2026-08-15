"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Bot, Headphones, RadioTower, UserRound, UsersRound, Zap } from "lucide-react";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";

const items = [
  { id: "active", label: "Atendimentos ativos", value: "17", detail: "+3 nos últimos 15 min", tone: "blue", icon: Headphones },
  { id: "waiting", label: "Pacientes aguardando", value: "06", detail: "2 acima do SLA", tone: "orange", icon: UsersRound },
  { id: "agents", label: "Agentes online", value: "18/24", detail: "75% da equipe disponível", tone: "green", icon: UserRound },
  { id: "ai", label: "IA em operação", value: "42", detail: "conversas simultâneas", tone: "teal", icon: Bot }
] as const;

const toneStyles = {
  blue: "bg-clinical-blue/10 text-clinical-blue",
  orange: "bg-clinical-orange/12 text-clinical-orange",
  green: "bg-clinical-green/12 text-clinical-green",
  teal: "bg-clinical-teal/12 text-clinical-teal"
};

export function RealtimeOperation() {
  const router = useRouter();
  const { toast } = useDemo();
  const [live, setLive] = useState(true);
  const [channel, setChannel] = useState<"Todos" | "WhatsApp" | "Instagram" | "E-mail">("Todos");

  return (
    <GlassCard className="overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl bg-clinical-blue/10 text-clinical-blue">
            <Activity className="size-5" />
            {live ? <span className="absolute -right-1 -top-1 size-3 rounded-full bg-clinical-green ring-4 ring-clinical-surface"><span className="absolute inset-0 animate-ping rounded-full bg-clinical-green/70" /></span> : null}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2"><h3 className="text-[21px] font-extrabold tracking-[-0.03em] text-clinical-dark">Operação em tempo real</h3><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold", live ? "bg-clinical-green/10 text-clinical-green" : "bg-clinical-surfaceMuted text-clinical-muted")}>{live ? "Atualizando agora" : "Atualização pausada"}</span></div>
            <p className="mt-1.5 text-sm leading-6 text-clinical-muted">Acompanhe o que exige atenção da equipe neste momento.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["Todos", "WhatsApp", "Instagram", "E-mail"] as const).map((item) => <button key={item} type="button" onClick={() => setChannel(item)} className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition", channel === item ? "bg-clinical-blue text-white" : "bg-clinical-surfaceMuted text-clinical-muted hover:text-clinical-blue")}>{item}</button>)}
          <button type="button" onClick={() => { setLive((current) => !current); toast(live ? "Atualização em tempo real pausada." : "Atualização em tempo real ativada.", "info"); }} aria-pressed={live} className="flex size-9 items-center justify-center rounded-xl border border-clinical-border/[0.12] text-clinical-muted transition hover:border-clinical-blue/25 hover:text-clinical-blue" aria-label={live ? "Pausar atualização" : "Ativar atualização"}><Zap className="size-4" /></button>
        </div>
      </div>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">{items.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => router.push(item.id === "waiting" ? "/atendimentos" : "/atendimentos")} className="group rounded-2xl border border-clinical-border/[0.10] bg-clinical-surfaceMuted/35 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:bg-clinical-surface"><div className="flex items-center justify-between gap-3"><span className={cn("flex size-9 items-center justify-center rounded-xl", toneStyles[item.tone])}><Icon className="size-4" /></span><RadioTower className="size-3.5 text-clinical-muted opacity-60 transition group-hover:text-clinical-blue group-hover:opacity-100" /></div><p className="mt-3 text-2xl font-black tracking-[-0.03em] text-clinical-dark">{item.value}</p><p className="mt-0.5 text-xs font-extrabold text-clinical-slate">{item.label}</p><p className="mt-1 text-[11px] font-semibold text-clinical-muted">{channel === "Todos" ? item.detail : `Filtro: ${channel}`}</p></button>; })}</div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-clinical-border/[0.10] pt-4"><p className="flex items-center gap-2 text-xs font-bold text-clinical-muted"><span className="size-2 rounded-full bg-clinical-green" /> Última leitura há 8 segundos · Dados de demonstração</p><Button size="sm" variant="secondary" onClick={() => router.push("/atendimentos")}>Abrir fila de atendimento</Button></div>
    </GlassCard>
  );
}
