import type {
  ApiEndpoint,
  AppConfigSection,
  Campaign,
  CampaignSettings,
  ContactList,
  HelpTopic,
  Integration,
  Invoice,
  PermissionMatrix,
  Queue,
  Sector,
  StaffUser
} from "@/lib/company/types";

export const seedCampaigns: Campaign[] = [
  {
    id: "cmp-1",
    name: "Lembrete de retorno pós-consulta",
    channel: "WhatsApp",
    audienceListId: "list-1",
    audienceListName: "Pacientes atendidos em julho",
    template: "Pós-consulta + satisfação",
    schedule: { mode: "agendada", date: "hoje, 10:00", window: "10:00 – 12:00" },
    status: "sending",
    stats: { total: 842, sent: 612, delivered: 588, failed: 8, opened: 0, replied: 47 },
    sentBy: "Marina Costa",
    updatedAt: "há 12 min"
  },
  {
    id: "cmp-2",
    name: "Dia do aniversariante",
    channel: "WhatsApp",
    audienceListId: "list-2",
    audienceListName: "Aniversariantes do mês",
    template: "Aniversariantes do dia",
    schedule: { mode: "agendada", date: "amanhã, 09:00", window: "09:00 – 09:30" },
    status: "scheduled",
    stats: { total: 126, sent: 0, delivered: 0, failed: 0, opened: 0, replied: 0 },
    sentBy: "IA de campanhas",
    updatedAt: "há 2 horas"
  },
  {
    id: "cmp-3",
    name: "Reativação de pacientes inativos",
    channel: "WhatsApp",
    audienceListId: "list-3",
    audienceListName: "Inativos há 6+ meses",
    template: "Reativação de pacientes inativos",
    schedule: { mode: "agendada", date: "sex, 10:00", window: "10:00 – 12:00" },
    status: "draft",
    stats: { total: 1983, sent: 0, delivered: 0, failed: 0, opened: 0, replied: 0 },
    sentBy: "Marina Costa",
    updatedAt: "há 1 dia"
  },
  {
    id: "cmp-4",
    name: "Campanha de vacina da gripe",
    channel: "Instagram",
    audienceListId: "list-4",
    audienceListName: "Seguidores da unidade",
    template: "Novidades da unidade",
    schedule: { mode: "agendada", date: "seg, 18:00", window: "18:00 – 19:00" },
    status: "paused",
    stats: { total: 2540, sent: 310, delivered: 302, failed: 4, opened: 0, replied: 12 },
    sentBy: "Julia Alves",
    updatedAt: "há 3 dias"
  },
  {
    id: "cmp-5",
    name: "Confirmação de consulta D-1",
    channel: "WhatsApp",
    audienceListId: "list-1",
    audienceListName: "Pacientes atendidos em julho",
    template: "Confirmação de consulta D-1",
    schedule: { mode: "agora" },
    status: "finished",
    stats: { total: 842, sent: 842, delivered: 811, failed: 18, opened: 0, replied: 403 },
    sentBy: "IA de campanhas",
    updatedAt: "há 4 dias"
  }
];

export const seedContactLists: ContactList[] = [
  {
    id: "list-1",
    name: "Pacientes atendidos em julho",
    description: "Pacientes com pelo menos uma consulta finalizada em julho de 2026.",
    size: 842,
    filters: ["Consultas concluídas em julho", "WhatsApp válido", "Consentimento ativo"],
    status: "ready",
    lastSync: "hoje, 06:00",
    updatedAt: "hoje, 06:00",
    createdBy: "Marina Costa"
  },
  {
    id: "list-2",
    name: "Aniversariantes do mês",
    description: "Aniversariantes do mês com canal ativo e opt-in vigente.",
    size: 126,
    filters: ["Aniversário no mês atual", "Opt-in vigente"],
    status: "ready",
    lastSync: "hoje, 00:10",
    updatedAt: "hoje, 00:10",
    createdBy: "IA de campanhas"
  },
  {
    id: "list-3",
    name: "Inativos há 6+ meses",
    description: "Pacientes sem consulta nos últimos 6 meses, com consentimento de reatoivação.",
    size: 1983,
    filters: ["Sem consulta há 6+ meses", "Consentimento de reativação"],
    status: "syncing",
    lastSync: "—",
    updatedAt: "há 20 min",
    createdBy: "Marina Costa"
  },
  {
    id: "list-4",
    name: "Seguidores da unidade",
    description: "Contatos do Instagram que interagiram com a unidade nos últimos 90 dias.",
    size: 2540,
    filters: ["Instagram vinculado", "Interação nos últimos 90 dias"],
    status: "error",
    lastSync: "há 2 dias",
    updatedAt: "há 2 dias",
    createdBy: "Julia Alves"
  }
];

export const seedCampaignSettings: CampaignSettings = {
  sender: "Ê-Bot Clinical (Unidade Centro)",
  dailyLimit: 500,
  sendWindowStart: "08:00",
  sendWindowEnd: "20:00",
  ratePerMinute: 30,
  signature: "Equipe Ê-Bot Clinical — (46) 99913-0505",
  autoOptOut: true,
  reOptInIntervalDays: 90,
  defaultTemplate: "Pós-consulta + satisfação"
};

export const seedSectors: Sector[] = [
  { id: "sec-1", name: "Atendimento", color: "#3A9DCA", description: "Recepção, triagem e fila principal de atendimento.", queueIds: ["que-1", "que-2"], memberCount: 6, active: true, updatedAt: "há 1 dia" },
  { id: "sec-2", name: "Cardiologia", color: "#E2574C", description: "Consultas e exames da especialidade.", queueIds: ["que-3", "que-4"], memberCount: 4, active: true, updatedAt: "há 2 dias" },
  { id: "sec-3", name: "Dermatologia", color: "#F2A34D", description: "Consultas dermatológicas e procedimentos.", queueIds: ["que-5"], memberCount: 3, active: true, updatedAt: "há 3 dias" },
  { id: "sec-4", name: "Exames", color: "#4CB782", description: "Coleta e orientação de exames laboratoriais e de imagem.", queueIds: ["que-6"], memberCount: 5, active: true, updatedAt: "há 1 semana" },
  { id: "sec-5", name: "Financeiro", color: "#8E6FBD", description: "Convênios, faturamento e recepção financeira.", queueIds: ["que-7"], memberCount: 2, active: true, updatedAt: "há 1 semana" },
  { id: "sec-6", name: "Atendimento noturno", color: "#5A7873", description: "Cobertura fora do horário comercial.", queueIds: [], memberCount: 2, active: false, updatedAt: "há 1 mês" }
];

export const seedQueues: Queue[] = [
  { id: "que-1", name: "Recepção geral", color: "#3A9DCA", sectorId: "sec-1", sectorName: "Atendimento", botOrder: 1, greeting: "Olá! Sou a recepção virtual da Ê-Bot Clinical. Como posso ajudar?", maxWaitSeconds: 300, priority: "alta", activeAgents: 3, totalAgents: 4, active: true },
  { id: "que-2", name: "Triagem de novos", color: "#4CB782", sectorId: "sec-1", sectorName: "Atendimento", botOrder: 2, greeting: "Antes de agendar, preciso fazer algumas perguntas rápidas de triagem.", maxWaitSeconds: 600, priority: "normal", activeAgents: 1, totalAgents: 2, active: true },
  { id: "que-3", name: "Cardiologia — consultas", color: "#E2574C", sectorId: "sec-2", sectorName: "Cardiologia", botOrder: 1, greeting: "Você está na fila de Cardiologia. Em breve uma atendente responde.", maxWaitSeconds: 420, priority: "alta", activeAgents: 2, totalAgents: 3, active: true },
  { id: "que-4", name: "Cardiologia — exames", color: "#F2A34D", sectorId: "sec-2", sectorName: "Cardiologia", botOrder: 2, greeting: "Fila de exames cardiológicos. Verificamos sua disponibilidade.", maxWaitSeconds: 480, priority: "media", activeAgents: 1, totalAgents: 1, active: true },
  { id: "que-5", name: "Dermatologia", color: "#F2A34D", sectorId: "sec-3", sectorName: "Dermatologia", botOrder: 1, greeting: "Olá! Em que posso ajudar com sua pele e saúde?", maxWaitSeconds: 540, priority: "media", activeAgents: 1, totalAgents: 2, active: true },
  { id: "que-6", name: "Exames e resultados", color: "#4CB782", sectorId: "sec-4", sectorName: "Exames", botOrder: 1, greeting: "Fila de exames. Orientamos preparo e resultados por aqui.", maxWaitSeconds: 360, priority: "media", activeAgents: 2, totalAgents: 3, active: true },
  { id: "que-7", name: "Financeiro", color: "#8E6FBD", sectorId: "sec-5", sectorName: "Financeiro", botOrder: 1, greeting: "Conversa com o setor financeiro. Um instante, por favor.", maxWaitSeconds: 900, priority: "normal", activeAgents: 1, totalAgents: 1, active: true }
];

export const seedUsers: StaffUser[] = [
  { id: "usr-1", name: "Marina Costa", email: "marina@ebotclinical.com.br", role: "Coordenadora de recepção", sectorId: "sec-1", sectorName: "Atendimento", queueIds: ["que-1", "que-2"], status: "online", lastSeen: "agora", permissions: ["Atendimentos", "Agenda", "Campanhas"], createdAt: "02 jan 2025", avatarColor: "#3A9DCA" },
  { id: "usr-2", name: "Dr. Ricardo Lima", email: "ricardo@ebotclinical.com.br", role: "Cardiologista", sectorId: "sec-2", sectorName: "Cardiologia", queueIds: ["que-3"], status: "online", lastSeen: "há 2 min", permissions: ["Atendimentos", "Agenda", "Arquivos"], createdAt: "15 mar 2024", avatarColor: "#E2574C" },
  { id: "usr-3", name: "Dra. Fernanda Rocha", email: "fernanda@ebotclinical.com.br", role: "Clínica geral", sectorId: "sec-1", sectorName: "Atendimento", queueIds: ["que-2"], status: "ausente", lastSeen: "há 18 min", permissions: ["Atendimentos", "Agenda", "Protocolos"], createdAt: "10 abr 2024", avatarColor: "#4CB782" },
  { id: "usr-4", name: "Julia Alves", email: "julia@ebotclinical.com.br", role: "Analista de comunicação", sectorId: "sec-3", sectorName: "Dermatologia", queueIds: ["que-5"], status: "online", lastSeen: "há 5 min", permissions: ["Campanhas", "Arquivos", "Financeiro"], createdAt: "22 set 2025", avatarColor: "#F2A34D" },
  { id: "usr-5", name: "Dr. Paulo Nogueira", email: "paulo@ebotclinical.com.br", role: "Radiologista", sectorId: "sec-4", sectorName: "Exames", queueIds: ["que-6"], status: "offline", lastSeen: "ontem, 18:40", permissions: ["Atendimentos", "Agenda"], createdAt: "01 fev 2024", avatarColor: "#8E6FBD" },
  { id: "usr-6", name: "Carla Mendes", email: "carla@ebotclinical.com.br", role: "Faturamento", sectorId: "sec-5", sectorName: "Financeiro", queueIds: ["que-7"], status: "online", lastSeen: "há 1 min", permissions: ["Financeiro", "Configurações"], createdAt: "12 jun 2025", avatarColor: "#5A7873" },
  { id: "usr-7", name: "Dr. Ruan Viana", email: "ruan@ebotclinical.com.br", role: "Diretor clínico", sectorId: "sec-1", sectorName: "Atendimento", queueIds: [], status: "online", lastSeen: "agora", permissions: ["Todos os módulos"], createdAt: "02 jan 2024", avatarColor: "#3A9DCA" }
];

const moduleOptions = ["Dashboard", "Atendimentos", "Agenda", "Pacientes", "Arquivos", "Campanhas", "Automação", "Financeiro", "Usuários", "Configurações"] as const;

export const seedPermissionMatrix: PermissionMatrix[] = [
  {
    roleId: "role-admin",
    roleName: "Administrador",
    description: "Acesso total à plataforma, incluindo usuários, permissões e integrações.",
    usersCount: 1,
    modules: Object.fromEntries(moduleOptions.map((module) => [module, "total"]))
  },
  {
    roleId: "role-diretor",
    roleName: "Diretor clínico",
    description: "Visão completa da operação com capacidade de ajustar regras dos fluxos.",
    usersCount: 1,
    modules: Object.fromEntries(moduleOptions.map((module, index) => [module, index === 8 || index === 9 ? "leitura" : "total"]))
  },
  {
    roleId: "role-profissional",
    roleName: "Profissional de saúde",
    description: "Atende conversas, agenda e acessa documentos do paciente na sua especialidade.",
    usersCount: 4,
    modules: Object.fromEntries(moduleOptions.map((module, index) => [module, index === 5 || index === 6 || index === 7 || index === 8 || index === 9 ? "nenhum" : index === 2 || index === 3 || index === 4 ? "leitura" : "edicao"]))
  },
  {
    roleId: "role-recepcao",
    roleName: "Recepção",
    description: "Opera atendimentos e agenda no dia a dia, sem acesso a configurações.",
    usersCount: 5,
    modules: Object.fromEntries(moduleOptions.map((module, index) => [module, index === 6 || index === 7 || index === 8 || index === 9 ? "nenhum" : index === 0 ? "leitura" : index === 4 ? "edicao" : "total"]))
  },
  {
    roleId: "role-exames",
    roleName: "Exames",
    description: "Acesso restrito às filas de exames, orientações e resultados.",
    usersCount: 3,
    modules: Object.fromEntries(moduleOptions.map((module, index) => [module, index === 5 || index === 6 || index === 7 || index === 8 || index === 9 ? "nenhum" : index === 0 || index === 3 ? "leitura" : "edicao"]))
  }
];

export const seedIntegrations: Integration[] = [
  { id: "int-1", name: "WhatsApp Business API", provider: "Meta", kind: "whatsapp", status: "connected", iconColor: "#4CB782", lastSync: "agora", details: [{ label: "Número", value: "+55 46 99913-0505" }, { label: "Webhook", value: "ativo" }, { label: "QR Code", value: "conectado" }], scopes: ["Mensagens", "Mídia", "Webhook"] },
  { id: "int-2", name: "Google Calendar", provider: "Google", kind: "google", status: "connected", iconColor: "#3A9DCA", lastSync: "agora", details: [{ label: "Conta", value: "agenda@ebotclinical.com.br" }, { label: "Agendas vinculadas", value: "3 de 3" }], scopes: ["Agenda", "Eventos", "Disponibilidade"] },
  { id: "int-3", name: "OpenAI", provider: "OpenAI", kind: "openai", status: "connected", iconColor: "#5A7873", lastSync: "há 5 min", details: [{ label: "Modelo", value: "GPT 5.5 Fast" }, { label: "Chave", value: "••••••••d3k9" }], scopes: ["Chat completions", "Embeddings"] },
  { id: "int-4", name: "API do laboratório", provider: "Lab parceiro", kind: "lab", status: "attention", iconColor: "#F2A34D", lastSync: "há 2 horas", details: [{ label: "Endpoint", value: "api.labparceiro.com.br" }, { label: "Laudos pendentes", value: "4" }], scopes: ["Resultados", "Webhooks"] },
  { id: "int-5", name: "iSIS Agenda", provider: "Integrador", kind: "agenda", status: "disconnected", iconColor: "#E2574C", lastSync: "há 3 dias", details: [{ label: "Mensagem", value: "Token expirado" }], scopes: ["Agenda", "Profissionais"] }
];

export const seedApiEndpoints: ApiEndpoint[] = [
  { id: "api-1", method: "GET", path: "/v1/workflows", module: "Automação", description: "Lista de fluxos de automação com status e execuções.", auth: "Bearer", usage7d: 1284 },
  { id: "api-2", method: "POST", path: "/v1/workflows", module: "Automação", description: "Cria um novo fluxo de automação.", auth: "Bearer", usage7d: 32 },
  { id: "api-3", method: "GET", path: "/v1/messages", module: "Mensagens", description: "Histórico de mensagens enviadas e recebidas.", auth: "Bearer", usage7d: 5921 },
  { id: "api-4", method: "POST", path: "/v1/messages/send", module: "Mensagens", description: "Envia uma mensagem de texto ou mídia por canal.", auth: "Bearer", usage7d: 840 },
  { id: "api-5", method: "GET", path: "/v1/appointments", module: "Agenda", description: "Agendamentos do período com status.", auth: "Bearer", usage7d: 2103 },
  { id: "api-6", method: "PUT", path: "/v1/appointments/{id}", module: "Agenda", description: "Atualiza horário ou status do agendamento.", auth: "Bearer", usage7d: 187 },
  { id: "api-7", method: "GET", path: "/v1/patients/{id}", module: "Pacientes", description: "Dados do paciente com histórico resumido.", auth: "Bearer", usage7d: 3420 },
  { id: "api-8", method: "POST", path: "/v1/files", module: "Arquivos", description: "Faz upload de arquivo e registra consentimento.", auth: "Bearer", usage7d: 64 },
  { id: "api-9", method: "GET", path: "/v1/knowledge-bases", module: "Automação", description: "Bases de conhecimento com status de indexação.", auth: "Bearer", usage7d: 92 },
  { id: "api-10", method: "POST", path: "/webhooks/lab/results", module: "Integrações", description: "Webhook do laboratório para liberação de laudos.", auth: "Interno", usage7d: 41 },
  { id: "api-11", method: "POST", path: "/webhooks/whatsapp/events", module: "Integrações", description: "Eventos de entrega e leitura do WhatsApp.", auth: "Interno", usage7d: 15120 },
  { id: "api-12", method: "DELETE", path: "/v1/messages/{id}", module: "Mensagens", description: "Remove uma mensagem não entregue.", auth: "Bearer", usage7d: 3 }
];

export const seedInvoices: Invoice[] = [
  { id: "inv-1", description: "Assinatura mensal — Plano Clínica Pro", plan: "Clínica Pro", period: "Agosto/2026", amount: "R$ 890,00", dueDate: "05/08/2026", status: "pago", paidAt: "02/08/2026", paymentMethod: "Pix", pdfUrl: "fatura-agosto-2026.pdf" },
  { id: "inv-2", description: "Assinatura mensal — Plano Clínica Pro", plan: "Clínica Pro", period: "Setembro/2026", amount: "R$ 890,00", dueDate: "05/09/2026", status: "pendente", paymentMethod: "Pix" },
  { id: "inv-3", description: "Excedente de conversas (1.240 além do plano)", plan: "Clínica Pro", period: "Julho/2026", amount: "R$ 124,00", dueDate: "05/08/2026", status: "pago", paidAt: "03/08/2026", paymentMethod: "Cartão de crédito", pdfUrl: "excedente-julho-2026.pdf" },
  { id: "inv-4", description: "Assinatura mensal — Plano Clínica Pro", plan: "Clínica Pro", period: "Julho/2026", amount: "R$ 890,00", dueDate: "05/07/2026", status: "pago", paidAt: "01/07/2026", paymentMethod: "Pix", pdfUrl: "fatura-julho-2026.pdf" },
  { id: "inv-5", description: "Assinatura mensal — Plano Clínica Pro", plan: "Clínica Pro", period: "Junho/2026", amount: "R$ 890,00", dueDate: "05/06/2026", status: "atrasado", paidAt: "18/06/2026", paymentMethod: "Boleto", pdfUrl: "fatura-junho-2026.pdf" }
];

export const seedHelpTopics: HelpTopic[] = [
  { id: "help-1", question: "Como conectar o WhatsApp da unidade?", answer: "Acesse Canais, clique em Conectar canal e siga o QR Code. O webhook é configurado automaticamente pela Ê-Bot.", category: "Canais" },
  { id: "help-2", question: "O que acontece se o bot não souber responder?", answer: "Análises de confiança abaixo do limite vão para a fila da equipe com o resumo da conversa. Você pode ajustar o limite em OpenIA.", category: "Automação" },
  { id: "help-3", question: "Como criar uma campanha sem afetar a agenda?", answer: "Defina a janela de envio em Configurações de campanha. O sistema respeita o limite diário e o horário comercial.", category: "Campanhas" },
  { id: "help-4", question: "Pacientes com consentimento pendente podem receber campanhas?", answer: "Não. Listas de envio consideram apenas contatos com opt-in vigente. O upload de arquivos sensíveis também fica bloqueado até o consentimento.", category: "LGPD" },
  { id: "help-5", question: "Como funciona o agendamento pelo bot?", answer: "O bot consulta a agenda do profissional, oferece horários disponíveis e registra a confirmação. Cancelamentos liberam horários para encaixe.", category: "Agenda" },
  { id: "help-6", question: "Consegui acesso à API?", answer: "Gerencie chaves e webhooks na página API. Cada chamada usa Bearer token com escopo definido por módulo.", category: "Sistema" },
  { id: "help-7", question: "Onde vejo o resumo das transferências para humanos?", answer: "Em Atendimentos, filtre por Conversas transferidas. O resumo é gerado automaticamente pelo bot antes do handoff.", category: "Atendimento" },
  { id: "help-8", question: "Como a Ê-Bot trata os dados dos pacientes?", answer: "Seguimos princípios LGPD: consentimentos estruturados, retenção por política, auditoria de acesso e minimização de dados.", category: "LGPD" }
];

export const seedConfig: Record<AppConfigSection, Record<string, string | boolean | number>> = {
  geral: {
    clinicName: "Ê-Bot Clinical — Unidade Centro",
    timezone: "America/Sao_Paulo (UTC-3)",
    language: "Português (Brasil)",
    defaultUnit: "Unidade Centro",
    appointmentReminder: true,
    reminderHours: 24
  },
  notificacoes: {
    newAttendance: true,
    handoffAlert: true,
    campaignFinished: true,
    invoiceAlert: true,
    emailSummary: false,
    digestFrequency: "Diária"
  },
  aparencia: {
    theme: "sistema",
    compactMode: false,
    density: "Confortável",
    accent: "Azul clínico"
  },
  seguranca: {
    apiKey: "sk-live-••••••••••d3k9",
    sessionTimeout: 60,
    twoFactor: true,
    auditLog: true,
    dataRetention: "20 anos (prontuário)"
  }
};