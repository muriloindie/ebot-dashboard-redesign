export type CampaignStatus = "draft" | "scheduled" | "sending" | "paused" | "finished";

export type Campaign = {
  id: string;
  name: string;
  channel: "WhatsApp" | "Instagram" | "E-mail";
  audienceListId: string;
  audienceListName: string;
  template: string;
  schedule: { mode: "agora" | "agendada"; date?: string; window?: string };
  status: CampaignStatus;
  stats: { total: number; sent: number; delivered: number; failed: number; opened: number; replied: number };
  sentBy: string;
  updatedAt: string;
};

export type ContactList = {
  id: string;
  name: string;
  description: string;
  size: number;
  filters: string[];
  status: "ready" | "syncing" | "error";
  lastSync: string;
  updatedAt: string;
  createdBy: string;
};

export type ContactEntry = {
  id: string;
  listId: string;
  name: string;
  phone: string;
  channel: "WhatsApp" | "Instagram" | "E-mail";
  consent: boolean;
  addedAt: string;
  addedBy: string;
};

export type CampaignSettings = {
  sender: string;
  dailyLimit: number;
  sendWindowStart: string;
  sendWindowEnd: string;
  ratePerMinute: number;
  signature: string;
  autoOptOut: boolean;
  reOptInIntervalDays: number;
  defaultTemplate: string;
};

export type Sector = {
  id: string;
  name: string;
  color: string;
  description: string;
  queueIds: string[];
  memberCount: number;
  active: boolean;
  updatedAt: string;
};

export type QueueScheduleSlot = { day: string; enabled: boolean; start: string; end: string };

export type QueueOption = {
  id: string;
  order: number;
  label: string;
  target: string;
  response?: string;
};

export type Queue = {
  id: string;
  name: string;
  color: string;
  sectorId: string;
  sectorName: string;
  botOrder: number;
  greeting: string;
  maxWaitSeconds: number;
  priority: "alta" | "media" | "normal";
  activeAgents: number;
  totalAgents: number;
  active: boolean;
  botTransfers: boolean;
  integration: string;
  prompt: string;
  outOfHoursMessage: string;
  options: QueueOption[];
  schedule: QueueScheduleSlot[];
};

export function defaultQueueSchedule(): QueueScheduleSlot[] {
  return [
    { day: "Segunda", enabled: true, start: "08:00", end: "18:00" },
    { day: "Terça", enabled: true, start: "08:00", end: "18:00" },
    { day: "Quarta", enabled: true, start: "08:00", end: "18:00" },
    { day: "Quinta", enabled: true, start: "08:00", end: "18:00" },
    { day: "Sexta", enabled: true, start: "08:00", end: "18:00" },
    { day: "Sábado", enabled: false, start: "08:00", end: "12:00" },
    { day: "Domingo", enabled: false, start: "08:00", end: "12:00" }
  ];
}

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  sectorId: string;
  sectorName: string;
  queueIds: string[];
  status: "online" | "ausente" | "offline";
  lastSeen: string;
  permissions: string[];
  createdAt: string;
  avatarColor: string;
};

export type PermissionMatrix = {
  roleId: string;
  roleName: string;
  description: string;
  modules: Record<string, "nenhum" | "leitura" | "edicao" | "total">;
  usersCount: number;
};

export type Integration = {
  id: string;
  name: string;
  provider: string;
  kind: "whatsapp" | "google" | "openai" | "agenda" | "lab" | "webhook";
  status: "connected" | "attention" | "disconnected";
  iconColor: string;
  lastSync: string;
  details: { label: string; value: string }[];
  scopes: string[];
};

export type ApiEndpoint = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  module: string;
  description: string;
  auth: "Bearer" | "Interno";
  usage7d: number;
};

export type Invoice = {
  id: string;
  description: string;
  plan: string;
  period: string;
  amount: string;
  dueDate: string;
  status: "pago" | "pendente" | "atrasado";
  paidAt?: string;
  paymentMethod?: string;
  pdfUrl?: string;
};

export type HelpTopic = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type HelpVideo = {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  icon: string;
  views: number;
  featured: boolean;
  createdAt: string;
};

export type TypebotAgentOption = {
  id: string;
  order: number;
  identifier: string;
  key: string;
  description: string;
};

export type TypebotAgentConfig = {
  agentName: string;
  companyName: string;
  companyDescription: string;
  businessRules: string;
  companyContext: string;
  extraInfo: string;
  welcomeMessage: string;
  queueIntegrationId: string;
  options: TypebotAgentOption[];
};

export type TypebotIntegration = {
  id: string;
  name: string;
  url: string;
  slug: string;
  expireMinutes: number;
  messageIntervalMs: number;
  finishWord: string;
  restartWord: string;
  invalidOptionMessage: string;
  restartMessage: string;
  status: "connected" | "attention" | "disconnected";
  lastSync: string;
  agent: TypebotAgentConfig;
};

export type AppConfigSection = "geral" | "notificacoes" | "aparencia" | "seguranca" | "ia";