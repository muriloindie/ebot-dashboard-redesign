import type { KpiFormat } from "@/lib/format";

export type DeltaTone = "success" | "warning" | "neutral";
export type StatusTone = "success" | "warning" | "info" | "danger" | "neutral" | "whatsapp";

export type Metric = {
  id: string;
  title: string;
  value: number;
  format: KpiFormat;
  delta?: string;
  deltaTone?: DeltaTone;
  subtitle?: string;
  icon: string;
};

export const metrics: Metric[] = [
  {
    id: "today-service",
    title: "Atendimentos hoje",
    value: 1284,
    format: "number",
    delta: "+18%",
    deltaTone: "success",
    icon: "MessageCircle"
  },
  {
    id: "ai-resolved",
    title: "Resolvidos pela IA",
    value: 73,
    format: "percent",
    delta: "+12%",
    deltaTone: "success",
    icon: "Bot"
  },
  {
    id: "human-waiting",
    title: "Aguardando humano",
    value: 42,
    format: "number",
    delta: "-8%",
    deltaTone: "success",
    icon: "UserRoundCheck"
  },
  {
    id: "confirmed",
    title: "Consultas confirmadas",
    value: 312,
    format: "number",
    delta: "+27%",
    deltaTone: "success",
    icon: "CalendarCheck"
  },
  {
    id: "response-time",
    title: "Tempo médio de resposta",
    value: 18,
    format: "seconds",
    delta: "-34%",
    deltaTone: "success",
    icon: "Timer"
  },
  {
    id: "waiting-time",
    title: "Tempo médio de espera",
    value: 134,
    format: "duration",
    delta: "-21%",
    deltaTone: "success",
    icon: "Hourglass"
  },
  {
    id: "no-show",
    title: "Faltas evitadas",
    value: 38,
    format: "number",
    delta: "+11%",
    deltaTone: "success",
    icon: "ShieldCheck"
  },
  {
    id: "after-hours",
    title: "Fora do horário",
    value: 156,
    format: "number",
    subtitle: "atendidos pela IA",
    icon: "Moon"
  }
];

export const hourlyFlow = [
  { hour: "07h", total: 24, ai: 18, human: 6 },
  { hour: "08h", total: 38, ai: 28, human: 10 },
  { hour: "09h", total: 62, ai: 46, human: 16 },
  { hour: "10h", total: 74, ai: 56, human: 18 },
  { hour: "11h", total: 58, ai: 44, human: 14 },
  { hour: "12h", total: 49, ai: 38, human: 11 },
  { hour: "13h", total: 53, ai: 40, human: 13 },
  { hour: "14h", total: 68, ai: 52, human: 16 },
  { hour: "15h", total: 91, ai: 68, human: 23 },
  { hour: "16h", total: 96, ai: 71, human: 25 },
  { hour: "17h", total: 112, ai: 79, human: 33 },
  { hour: "18h", total: 138, ai: 99, human: 39 },
  { hour: "19h", total: 156, ai: 118, human: 38 },
  { hour: "20h", total: 129, ai: 101, human: 28 },
  { hour: "21h", total: 104, ai: 82, human: 22 },
  { hour: "22h", total: 82, ai: 66, human: 16 },
  { hour: "23h", total: 61, ai: 49, human: 12 }
];

export const filterGroups = [
  { label: "Período", key: "period", options: ["Hoje", "7 dias", "30 dias", "Personalizado"] },
  { label: "Canal", key: "channel", options: ["WhatsApp", "Webchat", "Todos"] },
  { label: "Status", key: "status", options: ["Todos", "IA resolveu", "Humano assumiu", "Aguardando"] },
  { label: "Unidade/Médico", key: "unit", options: ["Clínica Geral", "Dr. Ricardo Lima", "Dra. Juliana Mendes"] }
] as const;

export const agendaDates = ["Hoje", "Amanhã", "15 Jul", "16 Jul", "17 Jul"];

export const appointments = [
  { day: "Hoje", time: "09:00", title: "Dra. Juliana Mendes", detail: "Consulta particular", status: "Confirmado", tone: "success" as StatusTone },
  { day: "Hoje", time: "10:30", title: "Dr. Ricardo Lima", detail: "Retorno cardiologia", status: "Aguardando confirmação", tone: "warning" as StatusTone },
  { day: "Amanhã", time: "11:15", title: "Encaixe liberado", detail: "IA sugeriu contato", status: "IA em ação", tone: "info" as StatusTone },
  { day: "Amanhã", time: "14:00", title: "Clínica Geral", detail: "Primeira consulta", status: "Confirmado", tone: "success" as StatusTone },
  { day: "15 Jul", time: "15:00", title: "Retorno particular", detail: "Lembrete enviado", status: "WhatsApp", tone: "whatsapp" as StatusTone },
  { day: "16 Jul", time: "18:30", title: "Fora do horário", detail: "Paciente pediu remarcação", status: "IA em atendimento", tone: "info" as StatusTone }
];

export const automationInsights = [
  {
    icon: "ClipboardList",
    category: "Automação sugerida",
    highlight: "23 pacientes",
    title: "Preparo de exames recorrente",
    description: "23 pacientes perguntaram sobre preparo de exames hoje, principalmente no fim da tarde.",
    action: "Criar automação"
  },
  {
    icon: "Workflow",
    category: "Oportunidades",
    highlight: "12 conversas",
    title: "Fluxos repetitivos detectados",
    description: "12 conversas poderiam virar fluxo automático sem intervenção da recepção.",
    action: "Ver conversas"
  },
  {
    icon: "CalendarPlus",
    category: "Risco de faltas",
    highlight: "3 horários",
    title: "Encaixes recuperados",
    description: "3 horários foram liberados após cancelamento e podem ser preenchidos por lista de espera.",
    action: "Enviar campanha"
  },
  {
    icon: "AlertTriangle",
    category: "Gargalos",
    highlight: "17h às 19h",
    title: "Gargalo no fim do dia",
    description: "Pacientes repetiram dúvidas sobre preparo de exames entre 17h e 19h.",
    action: "Criar automação"
  }
];

export const whatsappChannels = [
  { id: "wa-main", name: "WhatsApp Principal", number: "+55 11 98765-2301", api: "API oficial", status: "Online", health: "online", lastSync: "agora" },
  { id: "wa-schedule", name: "WhatsApp Agendamentos", number: "+55 11 97642-1188", api: "API oficial", status: "Atenção", health: "warning", lastSync: "há 18 min" },
  { id: "wa-finance", name: "WhatsApp Financeiro", number: "+55 11 95508-7741", api: "Pausado pela equipe", status: "Desativado", health: "offline", lastSync: "desativado" }
] as const;

export const aiConnection = {
  id: "ai-clinical-main",
  name: "IA Atendimento Clinical",
  provider: "OpenAI",
  model: "GPT 5.5 Fast",
  status: "Online",
  health: "online",
  accuracy: "94%",
  latency: "1.2s",
  context: "Base Ê-Bot + protocolos da clínica",
  lastAction: "resumiu 18 conversas e sugeriu 4 automações"
} as const;

export const contactReasons = [
  { label: "Agendamento", value: 34, color: "#3A9DCA" },
  { label: "Confirmação", value: 22, color: "#30A3A4" },
  { label: "Valores e convênios", value: 16, color: "#87A630" },
  { label: "Preparo de exames", value: 11, color: "#3A9DCA" },
  { label: "Receita/documentos", value: 9, color: "#30A3A4" },
  { label: "Falar com humano", value: 8, color: "#F19D18" }
];

export const recentConversations = [
  { patient: "Ana Paula", initials: "AP", summary: "agendamento confirmado", status: "IA resolveu", tone: "success" as StatusTone, time: "há 2 min" },
  { patient: "Marcos Silva", initials: "MS", summary: "dúvida sobre convênio", status: "humano assumiu", tone: "warning" as StatusTone, time: "há 6 min" },
  { patient: "Fernanda Lima", initials: "FL", summary: "remarcação", status: "resolvido por IA", tone: "info" as StatusTone, time: "há 9 min" },
  { patient: "João Pereira", initials: "JP", summary: "preparo de exame", status: "orientação enviada", tone: "success" as StatusTone, time: "há 14 min" },
  { patient: "Camila Rocha", initials: "CR", summary: "solicitação de receita", status: "aguardando humano", tone: "danger" as StatusTone, time: "há 18 min" }
];

export const teamPerformance = [
  { name: "Admin", status: "Online", tone: "success" as StatusTone, assumed: 68, response: "01m 08s", rating: 4.9, sla: "98%" },
  { name: "Dr. Ruan", status: "Em consulta", tone: "info" as StatusTone, assumed: 24, response: "03m 22s", rating: 4.8, sla: "94%" },
  { name: "Superuser", status: "Monitorando", tone: "success" as StatusTone, assumed: 51, response: "01m 46s", rating: 4.7, sla: "96%" },
  { name: "Designer", status: "Ausente", tone: "neutral" as StatusTone, assumed: 12, response: "05m 12s", rating: 4.6, sla: "89%" }
];
