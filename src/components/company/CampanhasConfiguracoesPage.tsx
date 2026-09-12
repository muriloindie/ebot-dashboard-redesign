"use client";

import { useMemo, useState } from "react";
import { Clock, Gauge, MessageSquareText, Save, ShieldCheck, Siren } from "lucide-react";
import { getCampaignSettings, saveCampaignSettings } from "@/lib/company/companyService";
import type { CampaignSettings } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { Toggle } from "@/components/ui/Toggle";
import { PageHeader } from "@/components/ui/Week1Primitives";

export function CampanhasConfiguracoesPage() {
  const { toast } = useDemo();
  const [settings, setSettings] = useState<CampaignSettings>(() => getCampaignSettings());

  const stats: StatItem[] = useMemo(() => [
    { id: "limit", label: "Limite diário", value: String(settings.dailyLimit), hint: "mensagens por dia", tone: "blue", icon: Gauge },
    { id: "window", label: "Janela de envio", value: `${settings.sendWindowStart}–${settings.sendWindowEnd}`, hint: "horário comercial", tone: "teal", icon: Clock },
    { id: "rate", label: "Taxa de envio", value: `${settings.ratePerMinute}/min`, hint: "mensagens por minuto", tone: "green", icon: Siren },
    { id: "optout", label: "Opt-out automático", value: settings.autoOptOut ? "Ativo" : "Inativo", hint: settings.autoOptOut ? "respeita " + settings.reOptInIntervalDays + " dias" : "desligado", tone: settings.autoOptOut ? "green" : "orange", icon: ShieldCheck }
  ], [settings]);

  function save() {
    saveCampaignSettings(settings);
    toast("Configurações de campanha salvas.");
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Comunicação / Regras de envio"
        title="Configurações de campanha"
        description="Limites e janelas que protegem a operação e o relacionamento com o cliente durante disparos em massa."
        action={<Button onClick={save}><Save className="size-4" />Salvar configurações</Button>}
      />

      <StatStrip items={stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark"><Clock className="size-4 text-ebot-primary" />Janela e volume</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cs-limit" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Limite diário de mensagens</label>
              <input id="cs-limit" type="number" min={50} max={5000} step={50} value={settings.dailyLimit} onChange={(event) => setSettings({ ...settings, dailyLimit: Number(event.target.value) })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            </div>
            <div>
              <label htmlFor="cs-rate" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Taxa por minuto</label>
              <input id="cs-rate" type="number" min={5} max={120} step={5} value={settings.ratePerMinute} onChange={(event) => setSettings({ ...settings, ratePerMinute: Number(event.target.value) })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            </div>
            <div>
              <label htmlFor="cs-start" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Início da janela</label>
              <input id="cs-start" value={settings.sendWindowStart} onChange={(event) => setSettings({ ...settings, sendWindowStart: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            </div>
            <div>
              <label htmlFor="cs-end" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Fim da janela</label>
              <input id="cs-end" value={settings.sendWindowEnd} onChange={(event) => setSettings({ ...settings, sendWindowEnd: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            </div>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-[11px] font-bold leading-4 text-ebot-muted">
            <Siren className="mt-0.5 size-3.5 shrink-0 text-ebot-orange" />
            Mensagens fora da janela ficam na fila para o próximo horário permitido, evitando notificações fora do horário.
          </p>
        </section>

        <section className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark"><MessageSquareText className="size-4 text-ebot-teal" />Conteúdo e identidade</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="cs-sender" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Remetente exibido</label>
              <input id="cs-sender" value={settings.sender} onChange={(event) => setSettings({ ...settings, sender: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            </div>
            <div>
              <label htmlFor="cs-signature" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Assinatura padrão</label>
              <input id="cs-signature" value={settings.signature} onChange={(event) => setSettings({ ...settings, signature: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            </div>
            <div>
              <label htmlFor="cs-template" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Template padrão</label>
              <select id="cs-template" value={settings.defaultTemplate} onChange={(event) => setSettings({ ...settings, defaultTemplate: event.target.value })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45">
                {["Pós-venda + satisfação", "Confirmação de agendamento D-1", "Reativação de clientes inativos", "Aniversariantes do dia", "Novidades da filial"].map((template) => <option key={template}>{template}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)] lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark"><ShieldCheck className="size-4 text-ebot-green" />Consentimento e opt-out</h2>
          <div className="mt-4 space-y-4">
            <Toggle
              label="Remoção automática ao receber &quot;pare&quot; ou &quot;sair&quot;"
              hint="O contato sai da lista e não recebe novas campanhas até novo opt-in."
              checked={settings.autoOptOut}
              onChange={(value) => setSettings({ ...settings, autoOptOut: value })}
              icon={ShieldCheck}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cs-reoptin" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Intervalo para novo opt-in (dias)</label>
                <input id="cs-reoptin" type="number" min={30} max={365} step={30} value={settings.reOptInIntervalDays} onChange={(event) => setSettings({ ...settings, reOptInIntervalDays: Number(event.target.value) })} className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
              </div>
              <div className="flex items-end">
                <p className="flex items-start gap-1.5 text-[11px] font-bold leading-4 text-ebot-muted">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-ebot-green" />
                  Os limites são aplicados por filial e consideram o consentimento vigente em cada contato.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <Button onClick={save}><Save className="size-4" />Salvar configurações</Button>
      </div>
    </div>
  );
}