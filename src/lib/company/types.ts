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
};

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

export type AppConfigSection = "geral" | "notificacoes" | "aparencia" | "seguranca";