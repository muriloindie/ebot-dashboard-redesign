"use client";

import { useMemo, useState } from "react";
import { Bell, Building2, Palette, Save, ShieldCheck } from "lucide-react";
import { getConfig, saveConfig } from "@/lib/company/companyService";
import type { AppConfigSection } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { PageHeader, SegmentedTabs } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

type ConfigValues = Record<string, string | boolean | number>;

const SECTIONS: { id: AppConfigSection; label: string; icon: typeof Bell; description: string }[] = [
  { id: "geral", label: "Geral", icon: Building2, description: "Identidade da unidade e padrões de agendamento." },
  { id: "notificacoes", label: "Notificações", icon: Bell, description: "Alertas enviados para a equipe e resumos por e-mail." },
  { id: "aparencia", label: "Aparência", icon: Palette, description: "Tema, densidade e cor de destaque da interface." },
  { id: "seguranca", label: "Segurança", icon: ShieldCheck, description: "Chaves de API, sessões e políticas de retenção." }
];

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-extrabold text-clinical-slate">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45";
const selectClass = inputClass;

export function ConfiguracoesPage() {
  const { toast } = useDemo();
  const [section, setSection] = useState<AppConfigSection>("geral");
  const [values, setValues] = useState<ConfigValues>(() => getConfig("geral"));

  const active = useMemo(() => SECTIONS.find((item) => item.id === section) ?? SECTIONS[0], [section]);

  function open(next: AppConfigSection) {
    setSection(next);
    setValues(getConfig(next));
  }

  function set(key: string, value: string | boolean | number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function save() {
    saveConfig(section, values);
    toast(`Configurações de ${active.label.toLowerCase()} salvas.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Preferências"
        title="Configurações"
        description="Preferências da unidade: identidade, alertas, aparência e políticas de segurança."
        action={<Button onClick={save}><Save className="size-4" />Salvar seção</Button>}
      />

      <SegmentedTabs
        tabs={SECTIONS.map((item) => ({ id: item.id, label: item.label }))}
        value={section}
        onChange={(id) => open(id as AppConfigSection)}
      />

      <section className="rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5 shadow-[0_8px_24px_rgba(38,53,50,0.04)]">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-clinical-blue/[0.10] text-clinical-blue"><active.icon className="size-5" /></span>
          <div>
            <h2 className="text-sm font-extrabold text-clinical-dark">{active.label}</h2>
            <p className="text-[12px] font-bold text-clinical-muted">{active.description}</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {section === "geral" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-clinic" label="Nome da clínica"><input id="cfg-clinic" className={inputClass} value={String(values.clinicName ?? "")} onChange={(event) => set("clinicName", event.target.value)} /></Field>
                <Field id="cfg-unit" label="Unidade padrão">
                  <select id="cfg-unit" className={selectClass} value={String(values.defaultUnit ?? "")} onChange={(event) => set("defaultUnit", event.target.value)}>
                    {["Unidade Centro", "Unidade Norte", "Unidade Sul"].map((unit) => <option key={unit}>{unit}</option>)}
                  </select>
                </Field>
                <Field id="cfg-tz" label="Fuso horário">
                  <select id="cfg-tz" className={selectClass} value={String(values.timezone ?? "")} onChange={(event) => set("timezone", event.target.value)}>
                    <option>America/Sao_Paulo (UTC-3)</option>
                    <option>America/Manaus (UTC-4)</option>
                    <option>America/Fortaleza (UTC-3)</option>
                  </select>
                </Field>
                <Field id="cfg-lang" label="Idioma">
                  <select id="cfg-lang" className={selectClass} value={String(values.language ?? "")} onChange={(event) => set("language", event.target.value)}>
                    <option>Português (Brasil)</option>
                    <option>Español</option>
                    <option>English</option>
                  </select>
                </Field>
              </div>
              <Toggle label="Lembrete automático de consulta" hint="O bot envia confirmação antes do horário marcado." checked={Boolean(values.appointmentReminder)} onChange={(value) => set("appointmentReminder", value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-reminder" label="Antecedência do lembrete (h)"><input id="cfg-reminder" type="number" min={1} max={72} className={inputClass} value={Number(values.reminderHours ?? 24)} onChange={(event) => set("reminderHours", Number(event.target.value))} /></Field>
              </div>
            </>
          )}

          {section === "notificacoes" && (
            <>
              <Toggle label="Nova conversa na fila" hint="Alerta imediato quando o bot transfere uma conversa." checked={Boolean(values.newAttendance)} onChange={(value) => set("newAttendance", value)} />
              <Toggle label="Handoff crítico" hint="Alerta quando um paciente aguarda além do tempo máximo." checked={Boolean(values.handoffAlert)} onChange={(value) => set("handoffAlert", value)} />
              <Toggle label="Campanha concluída" hint="Resumo com entregues, falhas e respostas." checked={Boolean(values.campaignFinished)} onChange={(value) => set("campaignFinished", value)} />
              <Toggle label="Fatura próxima do vencimento" hint="Aviso 5 dias antes do vencimento da fatura." checked={Boolean(values.invoiceAlert)} onChange={(value) => set("invoiceAlert", value)} />
              <Toggle label="Resumo por e-mail" hint="Digest diário ou semanal com indicadores da operação." checked={Boolean(values.emailSummary)} onChange={(value) => set("emailSummary", value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-digest" label="Frequência do resumo">
                  <select id="cfg-digest" className={selectClass} value={String(values.digestFrequency ?? "Diária")} onChange={(event) => set("digestFrequency", event.target.value)}>
                    <option>Diária</option>
                    <option>Semanal</option>
                    <option>Mensal</option>
                  </select>
                </Field>
              </div>
            </>
          )}

          {section === "aparencia" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-theme" label="Tema">
                  <select id="cfg-theme" className={selectClass} value={String(values.theme ?? "sistema")} onChange={(event) => set("theme", event.target.value)}>
                    <option value="sistema">Seguir sistema</option>
                    <option value="claro">Claro</option>
                    <option value="escuro">Escuro</option>
                  </select>
                </Field>
                <Field id="cfg-density" label="Densidade">
                  <select id="cfg-density" className={selectClass} value={String(values.density ?? "Confortável")} onChange={(event) => set("density", event.target.value)}>
                    <option>Confortável</option>
                    <option>Compacta</option>
                  </select>
                </Field>
                <Field id="cfg-accent" label="Cor de destaque">
                  <select id="cfg-accent" className={selectClass} value={String(values.accent ?? "Azul clínico")} onChange={(event) => set("accent", event.target.value)}>
                    <option>Azul clínico</option>
                    <option>Verde clínico</option>
                    <option>Âmbar</option>
                  </select>
                </Field>
              </div>
              <Toggle label="Modo compacto" hint="Reduz espaçamentos para telas menores." checked={Boolean(values.compactMode)} onChange={(value) => set("compactMode", value)} />
            </>
          )}

          {section === "seguranca" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-key" label="Chave da API"><input id="cfg-key" readOnly className={cn(inputClass, "font-mono")} value={String(values.apiKey ?? "")} /></Field>
                <Field id="cfg-timeout" label="Sessão expira em (min)"><input id="cfg-timeout" type="number" min={5} max={480} className={inputClass} value={Number(values.sessionTimeout ?? 60)} onChange={(event) => set("sessionTimeout", Number(event.target.value))} /></Field>
                <Field id="cfg-retention" label="Política de retenção">
                  <select id="cfg-retention" className={selectClass} value={String(values.dataRetention ?? "")} onChange={(event) => set("dataRetention", event.target.value)}>
                    <option>20 anos (prontuário)</option>
                    <option>10 anos</option>
                    <option>5 anos</option>
                  </select>
                </Field>
              </div>
              <Toggle label="Autenticação em dois fatores" hint="Exige código adicional no login de membros." checked={Boolean(values.twoFactor)} onChange={(value) => set("twoFactor", value)} />
              <Toggle label="Registro de auditoria" hint="Todos os acessos a arquivos e dados sensíveis ficam gravados." checked={Boolean(values.auditLog)} onChange={(value) => set("auditLog", value)} />
            </>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={save}><Save className="size-4" />Salvar seção</Button>
        </div>
      </section>
    </div>
  );
}