"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Bot, Building2, Columns3, LifeBuoy, Palette, Save, ShieldCheck, UserRound } from "lucide-react";
import { getConfig, saveConfig } from "@/lib/company/companyService";
import type { AppConfigSection } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { AjudaConfigPanel } from "@/components/company/AjudaConfigPanel";
import { PermissoesPanel } from "@/components/company/PermissoesPage";
import { KanbanConfigPanel } from "@/components/work-management/KanbanConfigPage";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { PageHeader, SegmentedTabs } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

type ConfigValues = Record<string, string | boolean | number>;
type SettingsTab = AppConfigSection | "permissoes" | "kanban" | "ajuda";

const SECTIONS: { id: SettingsTab; label: string; icon: typeof Bell; description: string }[] = [
  { id: "geral", label: "Geral", icon: Building2, description: "Identidade da filial e padrões de agendamento." },
  { id: "notificacoes", label: "Notificações", icon: Bell, description: "Alertas enviados para a equipe e resumos por e-mail." },
  { id: "aparencia", label: "Aparência", icon: Palette, description: "Tema, densidade e cor de destaque da interface." },
  { id: "kanban", label: "Kanban", icon: Columns3, description: "Colunas, cores, etapas e limites do quadro operacional." },
  { id: "seguranca", label: "Segurança", icon: ShieldCheck, description: "Chaves de API, sessões e políticas de retenção." },
  { id: "ia", label: "IA (Open.AI)", icon: Bot, description: "Comportamento do assistente de atendimento, limiar de handoff e mensagem inicial." },
  { id: "ajuda", label: "Ajuda", icon: LifeBuoy, description: "Vídeos, textos e perguntas do Centro de ajuda, com sugestões da IA." },
  { id: "permissoes", label: "Permissões", icon: UserRound, description: "Matriz de acesso por papel aplicada a todos os módulos do sistema." }
];

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-extrabold text-ebot-slate">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45";
const selectClass = inputClass;

export function ConfiguracoesPage() {
  const { toast } = useDemo();
  const [section, setSection] = useState<SettingsTab>("geral");
  const [values, setValues] = useState<ConfigValues>(() => getConfig("geral"));

  useEffect(() => {
    const secao = new URLSearchParams(window.location.search).get("secao");
    if (secao === "kanban" || secao === "ajuda") setSection(secao);
  }, []);

  const active = useMemo(() => SECTIONS.find((item) => item.id === section) ?? SECTIONS[0], [section]);
  const isConfigSection = (id: SettingsTab): id is AppConfigSection => id !== "permissoes" && id !== "kanban" && id !== "ajuda";

  function open(next: SettingsTab) {
    setSection(next);
    if (isConfigSection(next)) setValues(getConfig(next));
  }

  function set(key: string, value: string | boolean | number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function save() {
    if (isConfigSection(section)) {
      saveConfig(section, values);
      toast(`Configurações de ${active.label.toLowerCase()} salvas.`);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Preferências"
        title="Configurações"
        description="Preferências da filial: identidade, alertas, aparência e políticas de segurança."
         action={section === "kanban" ? undefined : <Button onClick={save}><Save className="size-4" />Salvar seção</Button>}
      />

      <SegmentedTabs
        tabs={SECTIONS.map((item) => ({ id: item.id, label: item.label }))}
        value={section}
        onChange={(id) => open(id as SettingsTab)}
      />

      {section === "kanban" ? (
        <KanbanConfigPanel embedded />
      ) : section === "ajuda" ? (
        <AjudaConfigPanel />
      ) : section === "permissoes" ? (
        <PermissoesPanel />
      ) : (
      <section className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-ebot-primary/[0.10] text-ebot-primary"><active.icon className="size-5" /></span>
          <div>
            <h2 className="text-sm font-extrabold text-ebot-dark">{active.label}</h2>
            <p className="text-[12px] font-bold text-ebot-muted">{active.description}</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {section === "geral" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-company" label="Nome da empresa"><input id="cfg-company" className={inputClass} value={String(values.companyName ?? "")} onChange={(event) => set("companyName", event.target.value)} /></Field>
                <Field id="cfg-unit" label="Filial padrão">
                  <select id="cfg-unit" className={selectClass} value={String(values.defaultUnit ?? "")} onChange={(event) => set("defaultUnit", event.target.value)}>
                    {["Filial Centro", "Filial Norte", "Filial Sul"].map((unit) => <option key={unit}>{unit}</option>)}
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
              <Toggle label="Lembrete automático de agendamento" hint="O bot envia confirmação antes do horário marcado." checked={Boolean(values.appointmentReminder)} onChange={(value) => set("appointmentReminder", value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-reminder" label="Antecedência do lembrete (h)"><input id="cfg-reminder" type="number" min={1} max={72} className={inputClass} value={Number(values.reminderHours ?? 24)} onChange={(event) => set("reminderHours", Number(event.target.value))} /></Field>
              </div>
            </>
          )}

          {section === "notificacoes" && (
            <>
              <Toggle label="Nova conversa na fila" hint="Alerta imediato quando o bot transfere uma conversa." checked={Boolean(values.newAttendance)} onChange={(value) => set("newAttendance", value)} />
              <Toggle label="Handoff crítico" hint="Alerta quando um cliente aguarda além do tempo máximo." checked={Boolean(values.handoffAlert)} onChange={(value) => set("handoffAlert", value)} />
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
                  <select id="cfg-accent" className={selectClass} value={String(values.accent ?? "Verde Ê-Bot")} onChange={(event) => set("accent", event.target.value)}>
                    <option>Verde Ê-Bot</option>
                    <option>Verde profundo</option>
                    <option>Âmbar</option>
                  </select>
                </Field>
              </div>
              <Toggle label="Modo compacto" hint="Reduz espaçamentos para telas menores." checked={Boolean(values.compactMode)} onChange={(value) => set("compactMode", value)} />
            </>
          )}

          {section === "ia" && (
            <>
              <Toggle label="Assistente de IA ativo" hint="A IA responde os primeiros contatos antes do handoff para a equipe." checked={Boolean(values.aiEnabled)} onChange={(value) => set("aiEnabled", value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-ai-model" label="Modelo">
                  <select id="cfg-ai-model" className={selectClass} value={String(values.aiModel ?? "GPT 5.5 Fast")} onChange={(event) => set("aiModel", event.target.value)}>
                    <option>GPT 5.5 Fast</option>
                    <option>GPT 5.5</option>
                    <option>GPT 5 Mini (econômico)</option>
                  </select>
                </Field>
                <Field id="cfg-ai-tone" label="Tom da conversa">
                  <select id="cfg-ai-tone" className={selectClass} value={String(values.aiTone ?? "Acolhedor e objetivo")} onChange={(event) => set("aiTone", event.target.value)}>
                    <option>Acolhedor e objetivo</option>
                    <option>Formal</option>
                    <option>Descontraído</option>
                  </select>
                </Field>
                <Field id="cfg-ai-handoff" label="Limiar de transferência para humano (%)"><input id="cfg-ai-handoff" type="number" min={40} max={99} className={inputClass} value={Number(values.handoffThreshold ?? 72)} onChange={(event) => set("handoffThreshold", Number(event.target.value))} /></Field>
                <Field id="cfg-ai-signature" label="Assinatura do bot"><input id="cfg-ai-signature" className={inputClass} value={String(values.aiSignature ?? "")} onChange={(event) => set("aiSignature", event.target.value)} /></Field>
              </div>
              <Field id="cfg-ai-greeting" label="Mensagem inicial da IA">
                <textarea id="cfg-ai-greeting" rows={2} className={cn(inputClass, "h-auto py-2.5")} value={String(values.aiGreeting ?? "")} onChange={(event) => set("aiGreeting", event.target.value)} />
              </Field>
            </>
          )}

          {section === "seguranca" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cfg-key" label="Chave da API"><input id="cfg-key" readOnly className={cn(inputClass, "font-mono")} value={String(values.apiKey ?? "")} /></Field>
                <Field id="cfg-timeout" label="Sessão expira em (min)"><input id="cfg-timeout" type="number" min={5} max={480} className={inputClass} value={Number(values.sessionTimeout ?? 60)} onChange={(event) => set("sessionTimeout", Number(event.target.value))} /></Field>
                <Field id="cfg-retention" label="Política de retenção">
                  <select id="cfg-retention" className={selectClass} value={String(values.dataRetention ?? "")} onChange={(event) => set("dataRetention", event.target.value)}>
                    <option>20 anos (histórico)</option>
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
      )}
    </div>
  );
}
