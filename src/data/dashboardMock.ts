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
    id: "leads-qualified",
    title: "Leads qualificados",
    value: 186,
    format: "number",
    delta: "+32%",
    deltaTone: "success",
    subtitle: "triagem da IA",
    icon: "Sparkles"
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
    id: "funnel-conversion",
    title: "Conversão do funil",
    value: 24,
    format: "percent",
    delta: "+6%",
    deltaTone: "success",
    subtitle: "lead até ganho",
    icon: "TrendingUp"
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
  { label: "Canal", key: "channel", options: ["WhatsApp", "Instagram", "E-mail", "Todos"] },
  { label: "Status", key: "status", options: ["Todos", "IA resolveu", "Humano assumiu", "Aguardando"] },
  { label: "Equipe", key: "team", options: ["Todas", "Comercial", "Suporte", "Financeiro"] }
] as const;

export const automationInsights = [
  {
    icon: "ClipboardList",
    category: "Automação sugerida",
    highlight: "23 conversas",
    title: "Respostas de orçamento",
    description: "23 clientes pediram orçamento hoje, principalmente no fim da tarde. Um fluxo com tabela de preços resolveria sem humano.",
    action: "Criar automação"
  },
  {
    icon: "Workflow",
    category: "Oportunidades",
    highlight: "12 leads",
    title: "Follow-up de leads parados",
    description: "12 leads estão sem interação há 3+ dias e podem receber follow-up automático no WhatsApp.",
    action: "Ver no CRM"
  },
  {
    icon: "CalendarPlus",
    category: "Financeiro",
    highlight: "9 cobranças",
    title: "Cobranças vencidas via API",
    description: "9 faturas vencidas podem ser lembradas automaticamente pela API oficial com retorno de status.",
    action: "Enviar cobranças"
  },
  {
    icon: "AlertTriangle",
    category: "Gargalos",
    highlight: "17h às 19h",
    title: "Pico fora do horário",
    description: "Clientes procuraram a operação entre 17h e 19h; a IA absorveu 82% das conversas e pode assumir o restante.",
    action: "Criar automação"
  }
];

export const whatsappChannels = [
  { id: "wa-main", name: "WhatsApp Comercial", number: "+55 46 99913-0505", api: "API oficial", status: "Online", health: "online", lastSync: "agora" },
  { id: "wa-support", name: "WhatsApp Suporte", number: "+55 46 99742-1188", api: "API oficial", status: "Atenção", health: "warning", lastSync: "há 18 min" },
  { id: "wa-finance", name: "WhatsApp Financeiro", number: "+55 46 95508-7741", api: "Pausado pela equipe", status: "Desativado", health: "offline", lastSync: "desativado" }
] as const;

export const aiConnection = {
  id: "ai-ebot-main",
  name: "IA Atendimento Ê-Bot",
  provider: "OpenAI",
  model: "GPT 5.5 Fast",
  status: "Online",
  health: "online",
  accuracy: "94%",
  latency: "1.2s",
  context: "Base Ê-Bot + CRM comercial",
  lastAction: "resumiu 18 conversas e qualificou 6 leads"
} as const;

export const contactReasons = [
  { label: "Orçamento e vendas", value: 34, color: "#A9D16C" },
  { label: "Suporte técnico", value: 22, color: "#6B942E" },
  { label: "Financeiro e cobranças", value: 16, color: "#5D737E" },
  { label: "Status de pedido", value: 11, color: "#8FA9B4" },
  { label: "Documentos e notas", value: 9, color: "#C7CCDB" },
  { label: "Falar com humano", value: 8, color: "#C97F12" }
];

export const recentConversations = [
  { client: "Ana Paula", initials: "AP", summary: "orçamento aprovado", status: "IA resolveu", tone: "success" as StatusTone, time: "há 2 min" },
  { client: "Marcos Silva", initials: "MS", summary: "dúvida sobre contrato de frota", status: "humano assumiu", tone: "warning" as StatusTone, time: "há 6 min" },
  { client: "Fernanda Lima", initials: "FL", summary: "proposta enviada", status: "resolvido por IA", tone: "info" as StatusTone, time: "há 9 min" },
  { client: "João Pereira", initials: "JP", summary: "status do pedido", status: "resposta enviada", tone: "success" as StatusTone, time: "há 14 min" },
  { client: "Camila Rocha", initials: "CR", summary: "segunda via de nota fiscal", status: "aguardando humano", tone: "danger" as StatusTone, time: "há 18 min" }
];

export const teamPerformance = [
  { name: "Marina Costa", status: "Comercial", tone: "success" as StatusTone, assumed: 68, response: "01m 08s", rating: 4.9, sla: "98%" },
  { name: "Ricardo Lima", status: "Frota", tone: "info" as StatusTone, assumed: 24, response: "03m 22s", rating: 4.8, sla: "94%" },
  { name: "Julia Alves", status: "Pós-venda", tone: "success" as StatusTone, assumed: 51, response: "01m 46s", rating: 4.7, sla: "96%" },
  { name: "Carla Mendes", status: "Financeiro", tone: "neutral" as StatusTone, assumed: 12, response: "05m 12s", rating: 4.6, sla: "89%" }
];

export const crmMetrics: Metric[] = [
  {
    id: "pipeline-open",
    title: "Pipeline aberto",
    value: 63400,
    format: "currency",
    delta: "+12%",
    deltaTone: "success",
    subtitle: "em negociação",
    icon: "Target"
  },
  {
    id: "won-month",
    title: "Ganhos no mês",
    value: 51200,
    format: "currency",
    delta: "+18%",
    deltaTone: "success",
    icon: "Handshake"
  },
  {
    id: "qualified-leads",
    title: "Leads qualificados",
    value: 186,
    format: "number",
    delta: "+32%",
    deltaTone: "success",
    subtitle: "triagem da IA",
    icon: "Sparkles"
  },
  {
    id: "funnel-conversion",
    title: "Conversão do funil",
    value: 24,
    format: "percent",
    delta: "+6%",
    deltaTone: "success",
    subtitle: "lead até ganho",
    icon: "TrendingUp"
  },
  {
    id: "avg-ticket",
    title: "Ticket médio",
    value: 2850,
    format: "currency",
    delta: "+9%",
    deltaTone: "success",
    icon: "Wallet"
  },
  {
    id: "crm-response",
    title: "Tempo de resposta",
    value: 18,
    format: "seconds",
    delta: "-34%",
    deltaTone: "success",
    icon: "Timer"
  },
  {
    id: "stale-leads",
    title: "Leads parados",
    value: 12,
    format: "number",
    subtitle: "sem interação 3+ dias",
    icon: "AlertTriangle"
  },
  {
    id: "unassigned-leads",
    title: "Sem responsável",
    value: 4,
    format: "number",
    subtitle: "precisam de dono",
    icon: "UserRound"
  }
];

export const crmMonthly = [
  { month: "Abr", ganhos: 24800, pipeline: 38200 },
  { month: "Mai", ganhos: 31200, pipeline: 41500 },
  { month: "Jun", ganhos: 27400, pipeline: 46800 },
  { month: "Jul", ganhos: 38900, pipeline: 52400 },
  { month: "Ago", ganhos: 44100, pipeline: 58900 },
  { month: "Set", ganhos: 51200, pipeline: 63400 }
];

export const leadOrigins = [
  { label: "WhatsApp", value: 46, conversion: 28, color: "#A9D16C" },
  { label: "Instagram", value: 28, conversion: 21, color: "#6B942E" },
  { label: "Site", value: 14, conversion: 34, color: "#5D737E" },
  { label: "Indicação", value: 8, conversion: 47, color: "#8FA9B4" },
  { label: "Campanhas", value: 4, conversion: 19, color: "#C7CCDB" }
];

