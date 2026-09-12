import type {
  ApiEndpoint,
  AppConfigSection,
  Campaign,
  CampaignSettings,
  ContactEntry,
  ContactList,
  HelpTopic,
  HelpVideo,
  Integration,
  Invoice,
  PermissionMatrix,
  Queue,
  Sector,
  StaffUser,
  TypebotIntegration
} from "@/lib/company/types";
import { defaultQueueSchedule } from "@/lib/company/types";

const fullSchedule = defaultQueueSchedule();
const weekdaySchedule = defaultQueueSchedule().slice(0, 5).map((slot) => ({ ...slot }));
const eveningSchedule = defaultQueueSchedule().map((slot) => ({ ...slot, start: "18:00", end: "23:00", enabled: slot.day !== "Domingo" }));

export const seedContactEntries: ContactEntry[] = [
  { id: "ent-1", listId: "list-1", name: "Amanda Souza", phone: "+55 46 99111-0101", channel: "WhatsApp", consent: true, addedAt: "01 ago 2026", addedBy: "Sincronização" },
  { id: "ent-2", listId: "list-1", name: "Carlos Eduardo Santos", phone: "+55 46 99111-0202", channel: "WhatsApp", consent: true, addedAt: "01 ago 2026", addedBy: "Sincronização" },
  { id: "ent-3", listId: "list-1", name: "Fernanda Lima", phone: "+55 46 99111-0303", channel: "WhatsApp", consent: true, addedAt: "03 ago 2026", addedBy: "Marina Costa" },
  { id: "ent-4", listId: "list-1", name: "José Ricardo Alves", phone: "+55 46 99111-0404", channel: "WhatsApp", consent: false, addedAt: "05 ago 2026", addedBy: "Sincronização" },
  { id: "ent-5", listId: "list-2", name: "Beatriz Ferreira", phone: "+55 46 99111-0505", channel: "WhatsApp", consent: true, addedAt: "01 set 2026", addedBy: "IA de campanhas" },
  { id: "ent-6", listId: "list-2", name: "Juliana Martins", phone: "+55 46 99111-0606", channel: "WhatsApp", consent: true, addedAt: "01 set 2026", addedBy: "IA de campanhas" },
  { id: "ent-7", listId: "list-4", name: "Patrícia Gomes", phone: "@patricia.gomes", channel: "Instagram", consent: true, addedAt: "10 ago 2026", addedBy: "Julia Alves" },
  { id: "ent-8", listId: "list-4", name: "Henrique Barros", phone: "@henrique.barros", channel: "Instagram", consent: false, addedAt: "12 ago 2026", addedBy: "Julia Alves" }
];

export const seedCampaigns: Campaign[] = [
  {
    id: "cmp-1",
    name: "Lembrete de retorno pós-agendamento",
    channel: "WhatsApp",
    audienceListId: "list-1",
    audienceListName: "Clientes atendidos em julho",
    template: "Pós-venda + satisfação",
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
    name: "Reativação de clientes inativos",
    channel: "WhatsApp",
    audienceListId: "list-3",
    audienceListName: "Inativos há 6+ meses",
    template: "Reativação de clientes inativos",
    schedule: { mode: "agendada", date: "sex, 10:00", window: "10:00 – 12:00" },
    status: "draft",
    stats: { total: 1983, sent: 0, delivered: 0, failed: 0, opened: 0, replied: 0 },
    sentBy: "Marina Costa",
    updatedAt: "há 1 dia"
  },
  {
    id: "cmp-4",
    name: "Campanha de revisão de fim de ano",
    channel: "Instagram",
    audienceListId: "list-4",
    audienceListName: "Seguidores da filial",
    template: "Novidades da filial",
    schedule: { mode: "agendada", date: "seg, 18:00", window: "18:00 – 19:00" },
    status: "paused",
    stats: { total: 2540, sent: 310, delivered: 302, failed: 4, opened: 0, replied: 12 },
    sentBy: "Julia Alves",
    updatedAt: "há 3 dias"
  },
  {
    id: "cmp-5",
    name: "Confirmação de agendamento D-1",
    channel: "WhatsApp",
    audienceListId: "list-1",
    audienceListName: "Clientes atendidos em julho",
    template: "Confirmação de agendamento D-1",
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
    name: "Clientes atendidos em julho",
    description: "Clientes com pelo menos um atendimento concluído em julho de 2026.",
    size: 842,
    filters: ["Agendamentos concluídos em julho", "WhatsApp válido", "Consentimento ativo"],
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
    description: "Clientes sem atendimento nos últimos 6 meses, com consentimento para reativação.",
    size: 1983,
    filters: ["Sem atendimento há 6+ meses", "Consentimento de reativação"],
    status: "syncing",
    lastSync: "—",
    updatedAt: "há 20 min",
    createdBy: "Marina Costa"
  },
  {
    id: "list-4",
    name: "Seguidores da filial",
    description: "Contatos do Instagram que interagiram com a filial nos últimos 90 dias.",
    size: 2540,
    filters: ["Instagram vinculado", "Interação nos últimos 90 dias"],
    status: "error",
    lastSync: "há 2 dias",
    updatedAt: "há 2 dias",
    createdBy: "Julia Alves"
  }
];

export const seedCampaignSettings: CampaignSettings = {
  sender: "Ê-Bot (Filial Centro)",
  dailyLimit: 500,
  sendWindowStart: "08:00",
  sendWindowEnd: "20:00",
  ratePerMinute: 30,
  signature: "Equipe Ê-Bot — (46) 99913-0505",
  autoOptOut: true,
  reOptInIntervalDays: 90,
  defaultTemplate: "Pós-venda + satisfação"
};

export const seedSectors: Sector[] = [
  { id: "sec-1", name: "Atendimento", color: "#A9D16C", description: "Vendas, triagem e fila principal de atendimento.", queueIds: ["que-1", "que-2"], memberCount: 6, active: true, updatedAt: "há 1 dia" },
  { id: "sec-2", name: "Frota", color: "#5D737E", description: "Contratos e pedidos de frota.", queueIds: ["que-3", "que-4"], memberCount: 4, active: true, updatedAt: "há 2 dias" },
  { id: "sec-3", name: "Varejo", color: "#C7CCDB", description: "Atendimento ao público e serviços de balcão.", queueIds: ["que-5"], memberCount: 3, active: true, updatedAt: "há 3 dias" },
  { id: "sec-4", name: "Pedidos", color: "#5C8529", description: "Acompanhamento de pedidos e entregas.", queueIds: ["que-6"], memberCount: 5, active: true, updatedAt: "há 1 semana" },
  { id: "sec-5", name: "Financeiro", color: "#6B942E", description: "Parcerias, faturamento e cobranças.", queueIds: ["que-7"], memberCount: 2, active: true, updatedAt: "há 1 semana" },
  { id: "sec-6", name: "Atendimento noturno", color: "#8FA9B4", description: "Cobertura fora do horário comercial.", queueIds: [], memberCount: 2, active: false, updatedAt: "há 1 mês" }
];

export const seedQueues: Queue[] = [
  { id: "que-1", name: "Atendimento geral", color: "#A9D16C", sectorId: "sec-1", sectorName: "Atendimento", botOrder: 1, greeting: "Olá! Sou o assistente virtual da Ê-Bot. Como posso ajudar?", maxWaitSeconds: 300, priority: "alta", activeAgents: 3, totalAgents: 4, active: true, botTransfers: true, integration: "WhatsApp — Filial Centro", prompt: "Triagem de atendimento v3", outOfHoursMessage: "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Deixe sua mensagem que retornaremos!", options: [], schedule: fullSchedule },
  { id: "que-2", name: "Triagem de novos", color: "#5C8529", sectorId: "sec-1", sectorName: "Atendimento", botOrder: 2, greeting: "Antes de agendar, preciso fazer algumas perguntas rápidas de triagem.", maxWaitSeconds: 600, priority: "normal", activeAgents: 1, totalAgents: 2, active: true, botTransfers: true, integration: "WhatsApp — Filial Centro", prompt: "Triagem de novos clientes v2", outOfHoursMessage: "A triagem automática funciona 24/7. Nossa equipe responde em horário comercial.", options: [], schedule: fullSchedule },
  { id: "que-3", name: "Frota — agendamentos", color: "#5D737E", sectorId: "sec-2", sectorName: "Frota", botOrder: 1, greeting: "Você está na fila de Frota. Em breve uma atendente responde.", maxWaitSeconds: 420, priority: "alta", activeAgents: 2, totalAgents: 3, active: true, botTransfers: true, integration: "WhatsApp — Filial Centro", prompt: "Atendimento de frota v1", outOfHoursMessage: "A fila de Frota atende em horário comercial. Para urgências, ligue para a filial.", options: [], schedule: weekdaySchedule },
  { id: "que-4", name: "Frota — pedidos", color: "#C7CCDB", sectorId: "sec-2", sectorName: "Frota", botOrder: 2, greeting: "Fila de pedidos de peças. Verificamos sua disponibilidade.", maxWaitSeconds: 480, priority: "media", activeAgents: 1, totalAgents: 1, active: true, botTransfers: false, integration: "WhatsApp — Filial Centro", prompt: "Orientação de pedidos v4", outOfHoursMessage: "Pedidos são agendados em horário comercial. Verifique o preparo no portal do cliente.", options: [], schedule: weekdaySchedule },
  { id: "que-5", name: "Varejo", color: "#C7CCDB", sectorId: "sec-3", sectorName: "Varejo", botOrder: 1, greeting: "Olá! Em que posso ajudar com sua pele e saúde?", maxWaitSeconds: 540, priority: "media", activeAgents: 1, totalAgents: 2, active: true, botTransfers: true, integration: "Instagram Direct", prompt: "Atendimento ao público v2", outOfHoursMessage: "Responderemos sua mensagem no próximo horário comercial. Até logo!", options: [], schedule: weekdaySchedule },
  { id: "que-6", name: "Pedidos e resultados", color: "#5C8529", sectorId: "sec-4", sectorName: "Pedidos", botOrder: 1, greeting: "Fila de pedidos. Acompanhamos pedidos e entregas por aqui.", maxWaitSeconds: 360, priority: "media", activeAgents: 2, totalAgents: 3, active: true, botTransfers: true, integration: "API do ERP", prompt: "Pedidos e entregas v3", outOfHoursMessage: "Os pedidos são atualizados pelo fornecedor em até 48h úteis. Acompanhe pelo portal.", options: [], schedule: fullSchedule },
  { id: "que-7", name: "Financeiro", color: "#6B942E", sectorId: "sec-5", sectorName: "Financeiro", botOrder: 1, greeting: "Conversa com o setor financeiro. Um instante, por favor.", maxWaitSeconds: 900, priority: "normal", activeAgents: 1, totalAgents: 1, active: true, botTransfers: false, integration: "WhatsApp — Filial Centro", prompt: "Financeiro e cobranças v1", outOfHoursMessage: "O setor financeiro atende de segunda a sexta, das 9h às 18h.", options: [], schedule: weekdaySchedule },
  { id: "que-8", name: "Plantão noturno", color: "#8FA9B4", sectorId: "sec-6", sectorName: "Atendimento noturno", botOrder: 1, greeting: "Atendimento noturno da Ê-Bot. Como podemos ajudar?", maxWaitSeconds: 600, priority: "normal", activeAgents: 0, totalAgents: 2, active: false, botTransfers: true, integration: "WhatsApp — Filial Norte", prompt: "Plantão noturno v1", outOfHoursMessage: "Estamos disponíveis das 18h às 23h. Para emergências, ligue para o número da filial.", options: [], schedule: eveningSchedule }
];

export const seedUsers: StaffUser[] = [
  { id: "usr-1", name: "Marina Costa", email: "marina@ebot.com.br", role: "Coordenadora de atendimento", sectorId: "sec-1", sectorName: "Atendimento", queueIds: ["que-1", "que-2"], status: "online", lastSeen: "agora", permissions: ["Atendimentos", "Agenda", "Campanhas"], createdAt: "02 jan 2025", avatarColor: "#A9D16C" },
  { id: "usr-2", name: "Ricardo Lima", email: "ricardo@ebot.com.br", role: "Analista de frota", sectorId: "sec-2", sectorName: "Frota", queueIds: ["que-3"], status: "online", lastSeen: "há 2 min", permissions: ["Atendimentos", "Agenda", "Arquivos"], createdAt: "15 mar 2024", avatarColor: "#5D737E" },
  { id: "usr-3", name: "Fernanda Rocha", email: "fernanda@ebot.com.br", role: "Consultora comercial", sectorId: "sec-1", sectorName: "Atendimento", queueIds: ["que-2"], status: "ausente", lastSeen: "há 18 min", permissions: ["Atendimentos", "Agenda", "Protocolos"], createdAt: "10 abr 2024", avatarColor: "#5C8529" },
  { id: "usr-4", name: "Julia Alves", email: "julia@ebot.com.br", role: "Analista de comunicação", sectorId: "sec-3", sectorName: "Varejo", queueIds: ["que-5"], status: "online", lastSeen: "há 5 min", permissions: ["Campanhas", "Arquivos", "Financeiro"], createdAt: "22 set 2025", avatarColor: "#C7CCDB" },
  { id: "usr-5", name: "Paulo Nogueira", email: "paulo@ebot.com.br", role: "Especialista de produto", sectorId: "sec-4", sectorName: "Pedidos", queueIds: ["que-6"], status: "offline", lastSeen: "ontem, 18:40", permissions: ["Atendimentos", "Agenda"], createdAt: "01 fev 2024", avatarColor: "#6B942E" },
  { id: "usr-6", name: "Carla Mendes", email: "carla@ebot.com.br", role: "Faturamento", sectorId: "sec-5", sectorName: "Financeiro", queueIds: ["que-7"], status: "online", lastSeen: "há 1 min", permissions: ["Financeiro", "Configurações"], createdAt: "12 jun 2025", avatarColor: "#8FA9B4" },
  { id: "usr-7", name: "Ruan Viana", email: "ruan@ebot.com.br", role: "Gestor de operações", sectorId: "sec-1", sectorName: "Atendimento", queueIds: [], status: "online", lastSeen: "agora", permissions: ["Todos os módulos"], createdAt: "02 jan 2024", avatarColor: "#A9D16C" }
];

const moduleOptions = ["Dashboard", "Atendimentos", "Agenda", "Clientes", "Arquivos", "Campanhas", "Automação", "Financeiro", "Usuários", "Configurações"] as const;

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
    roleName: "Gestor de operações",
    description: "Visão completa da operação com capacidade de ajustar regras dos fluxos.",
    usersCount: 1,
    modules: Object.fromEntries(moduleOptions.map((module, index) => [module, index === 8 || index === 9 ? "leitura" : "total"]))
  },
  {
    roleId: "role-atendente",
    roleName: "Atendente",
    description: "Atende conversas, agenda e acessa documentos do cliente na sua segmento.",
    usersCount: 4,
    modules: Object.fromEntries(moduleOptions.map((module, index) => [module, index === 5 || index === 6 || index === 7 || index === 8 || index === 9 ? "nenhum" : index === 2 || index === 3 || index === 4 ? "leitura" : "edicao"]))
  },
  {
    roleId: "role-recepcao",
    roleName: "Atendimento",
    description: "Opera atendimentos e agenda no dia a dia, sem acesso a configurações.",
    usersCount: 5,
    modules: Object.fromEntries(moduleOptions.map((module, index) => [module, index === 6 || index === 7 || index === 8 || index === 9 ? "nenhum" : index === 0 ? "leitura" : index === 4 ? "edicao" : "total"]))
  },
  {
    roleId: "role-pedidos",
    roleName: "Pedidos",
    description: "Acesso restrito às filas de pedidos, entregas e garantia.",
    usersCount: 3,
    modules: Object.fromEntries(moduleOptions.map((module, index) => [module, index === 5 || index === 6 || index === 7 || index === 8 || index === 9 ? "nenhum" : index === 0 || index === 3 ? "leitura" : "edicao"]))
  }
];

export const seedIntegrations: Integration[] = [
  { id: "int-1", name: "WhatsApp Business API", provider: "Meta", kind: "whatsapp", status: "connected", iconColor: "#5C8529", lastSync: "agora", details: [{ label: "Número", value: "+55 46 99913-0505" }, { label: "Webhook", value: "ativo" }, { label: "QR Code", value: "conectado" }], scopes: ["Mensagens", "Mídia", "Webhook"] },
  { id: "int-2", name: "Google Calendar", provider: "Google", kind: "google", status: "connected", iconColor: "#A9D16C", lastSync: "agora", details: [{ label: "Conta", value: "agenda@ebot.com.br" }, { label: "Agendas vinculadas", value: "3 de 3" }], scopes: ["Agenda", "Eventos", "Disponibilidade"] },
  { id: "int-3", name: "OpenAI", provider: "OpenAI", kind: "openai", status: "connected", iconColor: "#8FA9B4", lastSync: "há 5 min", details: [{ label: "Modelo", value: "GPT 5.5 Fast" }, { label: "Chave", value: "••••••••d3k9" }], scopes: ["Chat completions", "Embeddings"] },
  { id: "int-4", name: "API do ERP", provider: "ERP parceiro", kind: "lab", status: "attention", iconColor: "#C7CCDB", lastSync: "há 2 horas", details: [{ label: "Endpoint", value: "api.erpparceiro.com.br" }, { label: "Pedidos pendentes", value: "4" }], scopes: ["Pedidos", "Webhooks"] },
  { id: "int-5", name: "iSIS Agenda", provider: "Integrador", kind: "agenda", status: "disconnected", iconColor: "#5D737E", lastSync: "há 3 dias", details: [{ label: "Mensagem", value: "Token expirado" }], scopes: ["Agenda", "Atendentes"] }
];

export const seedApiEndpoints: ApiEndpoint[] = [
  { id: "api-1", method: "GET", path: "/v1/workflows", module: "Automação", description: "Lista de fluxos de automação com status e execuções.", auth: "Bearer", usage7d: 1284 },
  { id: "api-2", method: "POST", path: "/v1/workflows", module: "Automação", description: "Cria um novo fluxo de automação.", auth: "Bearer", usage7d: 32 },
  { id: "api-3", method: "GET", path: "/v1/messages", module: "Mensagens", description: "Histórico de mensagens enviadas e recebidas.", auth: "Bearer", usage7d: 5921 },
  { id: "api-4", method: "POST", path: "/v1/messages/send", module: "Mensagens", description: "Envia uma mensagem de texto ou mídia por canal.", auth: "Bearer", usage7d: 840 },
  { id: "api-5", method: "GET", path: "/v1/appointments", module: "Agenda", description: "Agendamentos do período com status.", auth: "Bearer", usage7d: 2103 },
  { id: "api-6", method: "PUT", path: "/v1/appointments/{id}", module: "Agenda", description: "Atualiza horário ou status do agendamento.", auth: "Bearer", usage7d: 187 },
  { id: "api-7", method: "GET", path: "/v1/customers/{id}", module: "Clientes", description: "Dados do cliente com histórico resumido.", auth: "Bearer", usage7d: 3420 },
  { id: "api-8", method: "POST", path: "/v1/files", module: "Arquivos", description: "Faz upload de arquivo e registra consentimento.", auth: "Bearer", usage7d: 64 },
  { id: "api-9", method: "GET", path: "/v1/knowledge-bases", module: "Automação", description: "Bases de conhecimento com status de indexação.", auth: "Bearer", usage7d: 92 },
  { id: "api-10", method: "POST", path: "/webhooks/erp/orders", module: "Integrações", description: "Webhook do ERP para atualização de pedidos.", auth: "Interno", usage7d: 41 },
  { id: "api-11", method: "POST", path: "/webhooks/whatsapp/events", module: "Integrações", description: "Eventos de entrega e leitura do WhatsApp.", auth: "Interno", usage7d: 15120 },
  { id: "api-12", method: "DELETE", path: "/v1/messages/{id}", module: "Mensagens", description: "Remove uma mensagem não entregue.", auth: "Bearer", usage7d: 3 }
];

export const seedInvoices: Invoice[] = [
  { id: "inv-1", description: "Assinatura mensal — Plano Ê-Bot Pro", plan: "Ê-Bot Pro", period: "Agosto/2026", amount: "R$ 890,00", dueDate: "05/08/2026", status: "pago", paidAt: "02/08/2026", paymentMethod: "Pix", pdfUrl: "fatura-agosto-2026.pdf" },
  { id: "inv-2", description: "Assinatura mensal — Plano Ê-Bot Pro", plan: "Ê-Bot Pro", period: "Setembro/2026", amount: "R$ 890,00", dueDate: "05/09/2026", status: "pendente", paymentMethod: "Pix" },
  { id: "inv-3", description: "Excedente de conversas (1.240 além do plano)", plan: "Ê-Bot Pro", period: "Julho/2026", amount: "R$ 124,00", dueDate: "05/08/2026", status: "pago", paidAt: "03/08/2026", paymentMethod: "Cartão de crédito", pdfUrl: "excedente-julho-2026.pdf" },
  { id: "inv-4", description: "Assinatura mensal — Plano Ê-Bot Pro", plan: "Ê-Bot Pro", period: "Julho/2026", amount: "R$ 890,00", dueDate: "05/07/2026", status: "pago", paidAt: "01/07/2026", paymentMethod: "Pix", pdfUrl: "fatura-julho-2026.pdf" },
  { id: "inv-5", description: "Assinatura mensal — Plano Ê-Bot Pro", plan: "Ê-Bot Pro", period: "Junho/2026", amount: "R$ 890,00", dueDate: "05/06/2026", status: "atrasado", paidAt: "18/06/2026", paymentMethod: "Boleto", pdfUrl: "fatura-junho-2026.pdf" }
];

export const seedHelpTopics: HelpTopic[] = [
  { id: "help-1", question: "Como conectar o WhatsApp da filial?", answer: "Acesse Canais, clique em Conectar canal e siga o QR Code. O webhook é configurado automaticamente pela Ê-Bot.", category: "Canais" },
  { id: "help-2", question: "O que acontece se o bot não souber responder?", answer: "Análises de confiança abaixo do limite vão para a fila da equipe com o resumo da conversa. Você pode ajustar o limite em Prompts.", category: "Automação" },
  { id: "help-3", question: "Como criar uma campanha sem afetar a agenda?", answer: "Defina a janela de envio em Configurações de campanha. O sistema respeita o limite diário e o horário comercial.", category: "Campanhas" },
  { id: "help-4", question: "Clientes com consentimento pendente podem receber campanhas?", answer: "Não. Listas de envio consideram apenas contatos com opt-in vigente. O upload de arquivos sensíveis também fica bloqueado até o consentimento.", category: "LGPD" },
  { id: "help-5", question: "Como funciona o agendamento pelo bot?", answer: "O bot verifica a agenda do atendente, oferece horários disponíveis e registra a confirmação. Cancelamentos liberam horários para encaixe.", category: "Agenda" },
  { id: "help-6", question: "Consegui acesso à API?", answer: "Gerencie chaves e webhooks na página API. Cada chamada usa Bearer token com escopo definido por módulo.", category: "Sistema" },
  { id: "help-7", question: "Onde vejo o resumo das transferências para humanos?", answer: "Em Atendimentos, filtre por Conversas transferidas. O resumo é gerado automaticamente pelo bot antes do handoff.", category: "Atendimento" },
  { id: "help-8", question: "Como a Ê-Bot trata os dados dos clientes?", answer: "Seguimos princípios LGPD: consentimentos estruturados, retenção por política, auditoria de acesso e minimização de dados.", category: "LGPD" }
];

export const seedTypebotIntegrations: TypebotIntegration[] = [
  {
    id: "tb-1",
    name: "Atendimento — Typebot principal",
    url: "https://typebot.ebot.com.br",
    slug: "atendimento-principal",
    expireMinutes: 30,
    messageIntervalMs: 1200,
    finishWord: "#sair",
    restartWord: "#reiniciar",
    invalidOptionMessage: "Opção inválida. Escolha uma das alternativas enviadas.",
    restartMessage: "Conversa reiniciada. Vamos começar de novo?",
    status: "connected",
    lastSync: "agora",
    agent: {
      agentName: "Recepcionista virtual",
      companyName: "Ê-Bot",
      companyDescription: "Rede de atendimento com filiais Centro, Norte e Sul.",
      businessRules: "Confirmar condições comerciais antes de fechar. Priorizar urgências e clientes VIP.",
      companyContext: "Atendimento de segunda a sexta, 8h às 18h. Plantão noturno até 23h.",
      extraInfo: "Estacionamento gratuito na Filial Centro.",
      welcomeMessage: "Olá! Sou o assistente virtual da Ê-Bot. Como posso ajudar?",
      queueIntegrationId: "que-1",
      options: [
        { id: "opt-1", order: 1, identifier: "agendar", key: "1", description: "Agendar atendimento" },
        { id: "opt-2", order: 2, identifier: "pedidos", key: "2", description: "Pedidos e resultados" },
        { id: "opt-3", order: 3, identifier: "humano", key: "3", description: "Falar com atendente" }
      ]
    }
  },
  {
    id: "tb-2",
    name: "Pedidos — Typebot de entregas",
    url: "https://typebot.ebot.com.br",
    slug: "pedidos-entrega",
    expireMinutes: 45,
    messageIntervalMs: 1500,
    finishWord: "#fim",
    restartWord: "#voltar",
    invalidOptionMessage: "Não entendi. Digite o número da opção desejada.",
    restartMessage: "Fluxo de pedidos reiniciado.",
    status: "attention",
    lastSync: "há 2 horas",
    agent: {
      agentName: "Assistente de pedidos",
      companyName: "Ê-Bot",
      companyDescription: "Rede de atendimento com múltiplas filiais.",
      businessRules: "Nunca prometer prazos fora da política comercial. Confirmar condições antes de fechar negócio.",
      companyContext: "Atendimento de segunda a sábado, das 8h às 18h.",
      extraInfo: "",
      welcomeMessage: "Olá! Vamos cuidar dos seus pedidos. O que você precisa?",
      queueIntegrationId: "que-6",
      options: [
        { id: "opt-4", order: 1, identifier: "preparo", key: "1", description: "Status do pedido" },
        { id: "opt-5", order: 2, identifier: "resultado", key: "2", description: "Segunda via de documento" }
      ]
    }
  }
];

export const seedHelpVideos: HelpVideo[] = [
  { id: "hv-1", title: "Como conectar o WhatsApp da filial", description: "Passo a passo para conectar o canal oficial via QR Code e validar o webhook de eventos.", category: "Canais", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "04:32", icon: "MessageCircle", views: 1284, featured: true, createdAt: "há 1 semana" },
  { id: "hv-2", title: "Criando sua primeira campanha", description: "Da lista de contatos ao envio: janela, limite diário e acompanhamento de respostas.", category: "Campanhas", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "06:10", icon: "Megaphone", views: 862, featured: true, createdAt: "há 2 semanas" },
  { id: "hv-3", title: "Configurando prompts da OpenAI", description: "Fila vinculada, voz ou texto, temperatura e histórico de mensagens na medida certa.", category: "Automação", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "08:45", icon: "Sparkles", views: 640, featured: false, createdAt: "há 3 semanas" },
  { id: "hv-4", title: "Sincronização de agenda sem conflito", description: "Seleção de agendas, verificação de conexão e criação de eventos com contatos.", category: "Agenda", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "05:27", icon: "CalendarDays", views: 418, featured: false, createdAt: "há 1 mês" },
  { id: "hv-5", title: "Filas e horários de atendimento", description: "Ordem do bot, transferências, mensagens fora de expediente e grade semanal.", category: "Filas", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "07:03", icon: "ListOrdered", views: 355, featured: false, createdAt: "há 1 mês" },
  { id: "hv-6", title: "LGPD na prática", description: "Consentimento, opt-in de campanhas e bloqueio de dados sensíveis.", category: "LGPD", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "09:51", icon: "ShieldCheck", views: 502, featured: false, createdAt: "há 2 meses" }
];

export const seedConfig: Record<AppConfigSection, Record<string, string | boolean | number>> = {
  geral: {
    companyName: "Ê-Bot — Filial Centro",
    timezone: "America/Sao_Paulo (UTC-3)",
    language: "Português (Brasil)",
    defaultUnit: "Filial Centro",
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
    accent: "Verde Ê-Bot"
  },
  seguranca: {
    apiKey: "sk-live-••••••••••d3k9",
    sessionTimeout: 60,
    twoFactor: true,
    auditLog: true,
    dataRetention: "5 anos (política)"
  },
  ia: {
    aiEnabled: true,
    aiModel: "GPT 5.5 Fast",
    aiTone: "Acolhedor e objetivo",
    handoffThreshold: 72,
    aiGreeting: "Olá! Sou a assistente virtual da empresa. Em que posso ajudar hoje?",
    aiSignature: "Ê-Bot"
  }
};