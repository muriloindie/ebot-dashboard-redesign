import type {
  Assistant,
  AutomationTemplate,
  DriveFile,
  FlowExecution,
  KnowledgeBase,
  Prompt,
  QuickReply,
  Workflow
} from "@/lib/automation/types";

export const automationProtocols = [
  { id: "PR-101", name: "Primeiro agendamento" },
  { id: "PR-102", name: "Retorno" },
  { id: "PR-103", name: "Confirmação de agendamento" },
  { id: "PR-104", name: "Pós-venda" },
  { id: "PR-105", name: "Cancelamento" },
  { id: "PR-106", name: "Reagendamento" },
  { id: "PR-107", name: "Entrega de resultados" }
];

export const automationRoles = ["Administrador", "Atendente", "Atendimento", "Pedidos"];

export const automationUsers = ["Marina Costa", "Ricardo Lima", "Fernanda Rocha", "Julia Alves", "Ruan"];

export const automationTemplates: AutomationTemplate[] = [
  {
    id: "tpl-confirmacao-d1",
    name: "Confirmação de agendamento D-1",
    tagline: "Confirma agendamentos 24h antes e libera horários automaticamente.",
    description: "Envia mensagem um dia antes do agendamento, captura a resposta do cliente e confirma ou libera o horário para a fila de espera. Reduz faltas sem intervenção manual.",
    category: "Agendamento",
    channel: "WhatsApp",
    installs: 1284,
    rating: 4.9,
    requiresKnowledgeBase: false,
    requiresProtocol: true,
    credentials: [
      { id: "google-calendar", name: "Google Calendar", provider: "Google", connected: true },
      { id: "whatsapp-api", name: "WhatsApp Business API", provider: "Meta", connected: true }
    ],
    nodes: [
      { type: "ebot.scheduleTrigger", name: "D-1 do agendamento", position: { x: 0, y: 120 }, parameters: { moment: "D-1 do agendamento", time: "09:00" } },
      { type: "ebot.lookupClient", name: "Buscar cliente", position: { x: 260, y: 120 }, parameters: { fields: "agenda, parceria, ultimo_atendimento" } },
      { type: "ebot.sendMessage", name: "Mensagem de confirmação", position: { x: 520, y: 120 }, parameters: { text: "Olá {nome_cliente}! Sua agendamento com {nome_atendente} é amanhã às {hora_agendamento}. Posso confirmar?" } },
      { type: "ebot.askQuestion", name: "Aguardar resposta", position: { x: 780, y: 120 }, parameters: { question: "Você confirma a agendamento de amanhã?", options: "Confirmo; Reagendar; Cancelar" } },
      { type: "ebot.condition", name: "Confirmou?", position: { x: 1040, y: 120 }, parameters: { field: "resposta_cliente", operator: "contém", value: "Confirmo" } },
      { type: "ebot.updateAgenda", name: "Confirmar agendamento", position: { x: 1300, y: 0 }, parameters: { operation: "Confirmar agendamento" } },
      { type: "ebot.humanHandoff", name: "Transferir para atendimento", position: { x: 1300, y: 240 }, parameters: { queue: "Atendimento", summary: true } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "3", target: "4" },
      { source: "4", target: "5", sourceHandle: "true" },
      { source: "4", target: "6", sourceHandle: "false" }
    ]
  },
  {
    id: "tpl-anti-noshow",
    name: "Anti-no-show inteligente",
    tagline: "Reage a faltas com reagenda automático e lista de espera.",
    description: "Quando o cliente falta, o fluxo dispara uma sequência de reengajamento: mensagem imediata, espera e nova tentativa de agendamento antes de mover para a lista de espera.",
    category: "Agendamento",
    channel: "WhatsApp",
    installs: 946,
    rating: 4.8,
    requiresKnowledgeBase: false,
    requiresProtocol: true,
    credentials: [
      { id: "google-calendar", name: "Google Calendar", provider: "Google", connected: true },
      { id: "whatsapp-api", name: "WhatsApp Business API", provider: "Meta", connected: true }
    ],
    nodes: [
      { type: "ebot.webhookTrigger", name: "Falta registrada", position: { x: 0, y: 120 }, parameters: { event: "agenda.falta_registrada" } },
      { type: "ebot.sendMessage", name: "Mensagem de reengajamento", position: { x: 260, y: 120 }, parameters: { text: "Sentimos sua falta hoje, {nome_cliente}. Quer reagendar com {nome_atendente}?" } },
      { type: "ebot.wait", name: "Aguardar 2 horas", position: { x: 520, y: 120 }, parameters: { duration: "2 horas" } },
      { type: "ebot.askQuestion", name: "Perguntar novo horário", position: { x: 780, y: 120 }, parameters: { question: "Qual período prefere para a nova agendamento?", options: "Manhã; Tarde" } },
      { type: "ebot.condition", name: "Respondeu?", position: { x: 1040, y: 120 }, parameters: { field: "resposta_cliente", operator: "é diferente de", value: "" } },
      { type: "ebot.updateAgenda", name: "Reagendar", position: { x: 1300, y: 0 }, parameters: { operation: "Reagendar" } },
      { type: "ebot.end", name: "Lista de espera", position: { x: 1300, y: 240 }, parameters: { resolution: "Transferido" } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "3", target: "4" },
      { source: "4", target: "5", sourceHandle: "true" },
      { source: "4", target: "6", sourceHandle: "false" }
    ]
  },
  {
    id: "tpl-preparo-pedidos",
    name: "Preparo de pedidos",
    tagline: "Orientações corretas por tipo de pedido, direto da base de conhecimento.",
    description: "Quando o cliente pergunta sobre preparo, a IA identifica o tipo de pedido e envia a orientação validada pela equipe empresa, com documento de apoio quando existir.",
    category: "Pedidos",
    channel: "Todos os canais",
    installs: 812,
    rating: 4.7,
    requiresKnowledgeBase: true,
    requiresProtocol: false,
    credentials: [
      { id: "openai", name: "OpenAI", provider: "OpenAI", connected: true }
    ],
    nodes: [
      { type: "ebot.chatTrigger", name: "Pergunta sobre pedido", position: { x: 0, y: 120 }, parameters: { channel: "Todos", keyword: "" } },
      { type: "ebot.classifyIntent", name: "Identificar pedido", position: { x: 260, y: 120 }, parameters: { categories: "Peças; Serviços; Revisão; Outro" } },
      { type: "ebot.aiReply", name: "Gerar orientação", position: { x: 520, y: 120 }, parameters: { instruction: "Responda com a orientação de preparo da base de conhecimento para o pedido identificado." } },
      { type: "ebot.sendDocument", name: "Enviar PDF de preparo", position: { x: 780, y: 120 }, parameters: { document: "preparo-pedidos.pdf" } },
      { type: "ebot.end", name: "Encerrar", position: { x: 1040, y: 120 }, parameters: { resolution: "Resolvido" } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "3", target: "4" }
    ]
  },
  {
    id: "tpl-pos-agendamento",
    name: "Pós-venda + satisfação",
    tagline: "Cuidado 48h depois do agendamento com pesquisa de satisfação.",
    description: "Envia mensagem de cuidado dois dias após a agendamento, coleta a avaliação do atendimento e prioriza casos insatisfeitos para contato humano imediato.",
    category: "Pós-venda",
    channel: "WhatsApp",
    installs: 704,
    rating: 4.8,
    requiresKnowledgeBase: false,
    requiresProtocol: true,
    credentials: [
      { id: "whatsapp-api", name: "WhatsApp Business API", provider: "Meta", connected: true }
    ],
    nodes: [
      { type: "ebot.scheduleTrigger", name: "48h após agendamento", position: { x: 0, y: 120 }, parameters: { moment: "48h após agendamento", time: "10:00" } },
      { type: "ebot.sendMessage", name: "Mensagem de cuidado", position: { x: 260, y: 120 }, parameters: { text: "Olá {nome_cliente}, como você está após a agendamento com {nome_atendente}?" } },
      { type: "ebot.askQuestion", name: "Coletar avaliação", position: { x: 520, y: 120 }, parameters: { question: "De 1 a 5, como foi sua experiência?", options: "1; 2; 3; 4; 5" } },
      { type: "ebot.sentiment", name: "Avaliar satisfação", position: { x: 780, y: 120 }, parameters: { threshold: "Insatisfeito" } },
      { type: "ebot.condition", name: "Satisfeito?", position: { x: 1040, y: 120 }, parameters: { field: "sentimento", operator: "é igual a", value: "satisfeito" } },
      { type: "ebot.writeRecord", name: "Registrar avaliação", position: { x: 1300, y: 0 }, parameters: { note: "Avaliação de satisfação registrada no histórico." } },
      { type: "ebot.humanHandoff", name: "Priorizar contato", position: { x: 1300, y: 240 }, parameters: { queue: "Prioridade", summary: true } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "3", target: "4" },
      { source: "4", target: "5", sourceHandle: "true" },
      { source: "4", target: "6", sourceHandle: "false" }
    ]
  },
  {
    id: "tpl-triagem-ia",
    name: "Triagem inicial com IA",
    tagline: "Primeiro contato acolhido pela IA com handoff seguro.",
    description: "A IA acolhe o primeiro contato, entende o pedido e classifica a urgência. Casos sensíveis ou urgentes são transferidos para humanos com resumo completo do contexto.",
    category: "Triagem",
    channel: "Todos os canais",
    installs: 1531,
    rating: 4.9,
    requiresKnowledgeBase: true,
    requiresProtocol: true,
    credentials: [
      { id: "openai", name: "OpenAI", provider: "OpenAI", connected: true },
      { id: "whatsapp-api", name: "WhatsApp Business API", provider: "Meta", connected: true }
    ],
    nodes: [
      { type: "ebot.chatTrigger", name: "Primeira mensagem", position: { x: 0, y: 120 }, parameters: { channel: "Todos", keyword: "" } },
      { type: "ebot.aiAgent", name: "Assistente de triagem", position: { x: 260, y: 120 }, parameters: { assistant: "Triagem inicial", fallback: "Transferir para humano" } },
      { type: "ebot.classifyIntent", name: "Classificar urgência", position: { x: 520, y: 120 }, parameters: { categories: "Rotina; Urgência; Sensível" } },
      { type: "ebot.condition", name: "É urgente?", position: { x: 780, y: 120 }, parameters: { field: "urgencia", operator: "é igual a", value: "Urgência" } },
      { type: "ebot.humanHandoff", name: "Handoff prioritário", position: { x: 1040, y: 0 }, parameters: { queue: "Prioridade", summary: true } },
      { type: "ebot.aiReply", name: "Continuar com IA", position: { x: 1040, y: 240 }, parameters: { instruction: "Continue o atendimento de rotina com a base de conhecimento." } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "3", target: "4", sourceHandle: "true" },
      { source: "3", target: "5", sourceHandle: "false" }
    ]
  },
  {
    id: "tpl-resultado-pedidos",
    name: "Entrega de resultados",
    tagline: "Aviso automático quando o relatório é liberado.",
    description: "Quando o ERP atualiza o pedido, o cliente é avisado com orientações e convite para agendar a próxima etapa com o atendente responsável.",
    category: "Pedidos",
    channel: "WhatsApp",
    installs: 655,
    rating: 4.6,
    requiresKnowledgeBase: false,
    requiresProtocol: true,
    credentials: [
      { id: "lab-api", name: "API do ERP", provider: "ERP parceiro", connected: false },
      { id: "whatsapp-api", name: "WhatsApp Business API", provider: "Meta", connected: true }
    ],
    nodes: [
      { type: "ebot.webhookTrigger", name: "Relatório liberado", position: { x: 0, y: 120 }, parameters: { event: "pedido.resultado_liberado" } },
      { type: "ebot.lookupClient", name: "Buscar cliente", position: { x: 260, y: 120 }, parameters: { fields: "agenda, parceria" } },
      { type: "ebot.sendMessage", name: "Avisar cliente", position: { x: 520, y: 120 }, parameters: { text: "{nome_cliente}, seu resultado já está disponível. Quer agendar a leitura com {nome_atendente}?" } },
      { type: "ebot.askQuestion", name: "Oferecer agendamento", position: { x: 780, y: 120 }, parameters: { question: "Deseja agendar a leitura do resultado?", options: "Sim; Não" } },
      { type: "ebot.updateAgenda", name: "Agendar leitura", position: { x: 1040, y: 120 }, parameters: { operation: "Agendar" } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "3", target: "4" }
    ]
  },
  {
    id: "tpl-renovacao-contratos",
    name: "Renovação de contratos",
    tagline: "Pedido de renovação de contrato com aprovação do atendente.",
    description: "Recebe pedidos de renovação, valida o histórico do cliente e envia para aprovação do atendente antes de qualquer resposta definitiva.",
    category: "Pós-venda",
    channel: "WhatsApp",
    installs: 438,
    rating: 4.5,
    requiresKnowledgeBase: false,
    requiresProtocol: true,
    credentials: [
      { id: "whatsapp-api", name: "WhatsApp Business API", provider: "Meta", connected: true }
    ],
    nodes: [
      { type: "ebot.chatTrigger", name: "Pedido de renovação", position: { x: 0, y: 120 }, parameters: { channel: "Todos", keyword: "renovação" } },
      { type: "ebot.lookupClient", name: "Validar histórico", position: { x: 260, y: 120 }, parameters: { fields: "ultimo_atendimento, parceria" } },
      { type: "ebot.humanHandoff", name: "Aprovação atendente", position: { x: 520, y: 120 }, parameters: { queue: "Frota", summary: true } },
      { type: "ebot.sendMessage", name: "Retorno ao cliente", position: { x: 780, y: 120 }, parameters: { text: "{nome_cliente}, sua solicitação foi aprovada. O contrato atualizado está disponível na filial {filial}." } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" }
    ]
  },
  {
    id: "tpl-faq-parcerias",
    name: "FAQ de parcerias",
    tagline: "Responde cobertura e carência usando a tabela atualizada.",
    description: "A IA responde perguntas sobre parcerias, cobertura e carência consultando a base de conhecimento mantida pela administração, com handoff para casos específicos.",
    category: "Triagem",
    channel: "Todos os canais",
    installs: 923,
    rating: 4.7,
    requiresKnowledgeBase: true,
    requiresProtocol: false,
    credentials: [
      { id: "openai", name: "OpenAI", provider: "OpenAI", connected: true }
    ],
    nodes: [
      { type: "ebot.chatTrigger", name: "Dúvida de parceria", position: { x: 0, y: 120 }, parameters: { channel: "Todos", keyword: "" } },
      { type: "ebot.aiAgent", name: "Agente de parcerias", position: { x: 260, y: 120 }, parameters: { assistant: "Atendimento geral", fallback: "Transferir para humano" } },
      { type: "ebot.condition", name: "Resolveu?", position: { x: 520, y: 120 }, parameters: { field: "resolvido", operator: "é igual a", value: "sim" } },
      { type: "ebot.end", name: "Encerrar", position: { x: 780, y: 0 }, parameters: { resolution: "Resolvido" } },
      { type: "ebot.humanHandoff", name: "Transferir para atendimento", position: { x: 780, y: 240 }, parameters: { queue: "Atendimento", summary: true } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3", sourceHandle: "true" },
      { source: "2", target: "4", sourceHandle: "false" }
    ]
  },
  {
    id: "tpl-aniversariantes",
    name: "Aniversariantes do dia",
    tagline: "Mensagem de relacionamento no aniversário do cliente.",
    description: "Envia uma mensagem humanizada no dia do aniversário, fortalecendo o relacionamento sem tom comercial.",
    category: "Relacionamento",
    channel: "WhatsApp",
    installs: 512,
    rating: 4.6,
    requiresKnowledgeBase: false,
    requiresProtocol: false,
    credentials: [
      { id: "whatsapp-api", name: "WhatsApp Business API", provider: "Meta", connected: true }
    ],
    nodes: [
      { type: "ebot.scheduleTrigger", name: "Todo dia às 9h", position: { x: 0, y: 120 }, parameters: { moment: "Personalizado", time: "09:00" } },
      { type: "ebot.lookupClient", name: "Aniversariantes de hoje", position: { x: 260, y: 120 }, parameters: { fields: "nome, data_nascimento" } },
      { type: "ebot.sendMessage", name: "Mensagem de parabéns", position: { x: 520, y: 120 }, parameters: { text: "Feliz aniversário, {nome_cliente}! A equipe {nome_empresa} deseja um dia cheio de saúde." } },
      { type: "ebot.end", name: "Encerrar", position: { x: 780, y: 120 }, parameters: { resolution: "Resolvido" } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" }
    ]
  },
  {
    id: "tpl-reativacao-inativos",
    name: "Reativação de clientes inativos",
    tagline: "Reconecta clientes sem agendamento há mais de 6 meses.",
    description: "Identifica clientes inativos e envia convite de retorno com cuidado, respeitando opt-out e janela de contato definidos nas configurações de campanhas.",
    category: "Relacionamento",
    channel: "WhatsApp",
    installs: 387,
    rating: 4.4,
    requiresKnowledgeBase: false,
    requiresProtocol: false,
    credentials: [
      { id: "whatsapp-api", name: "WhatsApp Business API", provider: "Meta", connected: true }
    ],
    nodes: [
      { type: "ebot.scheduleTrigger", name: "Mensal, dia 1", position: { x: 0, y: 120 }, parameters: { moment: "Personalizado", time: "10:00" } },
      { type: "ebot.lookupClient", name: "Inativos há 6+ meses", position: { x: 260, y: 120 }, parameters: { fields: "ultimo_atendimento" } },
      { type: "ebot.condition", name: "Consentimento ativo?", position: { x: 520, y: 120 }, parameters: { field: "consentimento", operator: "é igual a", value: "ativo" } },
      { type: "ebot.sendMessage", name: "Convite de retorno", position: { x: 780, y: 0 }, parameters: { text: "Olá {nome_cliente}, sentimos sua falta na {nome_empresa}. Quer agendar seu acompanhamento com {nome_atendente}?" } },
      { type: "ebot.end", name: "Respeitar opt-out", position: { x: 780, y: 240 }, parameters: { resolution: "Cancelado" } }
    ],
    connections: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3", sourceHandle: "true" },
      { source: "2", target: "4", sourceHandle: "false" }
    ]
  }
];

export const seedWorkflows: Workflow[] = [
  {
    id: "wf-primeira-agendamento",
    name: "Primeiro agendamento",
    description: "Boas-vindas, triagem com IA e pré-agendamento de novos clientes.",
    status: "active",
    channel: "WhatsApp",
    protocolId: "PR-101",
    protocolName: "Primeiro agendamento",
    templateId: "tpl-triagem-ia",
    knowledgeBaseId: "kb-protocolos",
    nodes: [
      { id: "wf1-n1", type: "ebot.chatTrigger", name: "Primeira mensagem", position: { x: 0, y: 120 }, parameters: { channel: "WhatsApp", keyword: "" } },
      { id: "wf1-n2", type: "ebot.aiAgent", name: "Assistente de triagem", position: { x: 260, y: 120 }, parameters: { assistant: "Triagem inicial", fallback: "Transferir para humano" } },
      { id: "wf1-n3", type: "ebot.condition", name: "Quer agendar?", position: { x: 520, y: 120 }, parameters: { field: "intencao", operator: "é igual a", value: "Agendar agendamento" } },
      { id: "wf1-n4", type: "ebot.updateAgenda", name: "Pré-agendar", position: { x: 780, y: 0 }, parameters: { operation: "Agendar" } },
      { id: "wf1-n5", type: "ebot.humanHandoff", name: "Transferir para atendimento", position: { x: 780, y: 240 }, parameters: { queue: "Atendimento", summary: true } }
    ],
    connections: [
      { id: "wf1-c1", source: "wf1-n1", target: "wf1-n2" },
      { id: "wf1-c2", source: "wf1-n2", target: "wf1-n3" },
      { id: "wf1-c3", source: "wf1-n3", target: "wf1-n4", sourceHandle: "true" },
      { id: "wf1-c4", source: "wf1-n3", target: "wf1-n5", sourceHandle: "false" }
    ],
    settings: { timezone: "America/Sao_Paulo", saveExecutions: true, onError: "continuar" },
    tags: ["triagem", "novos clientes"],
    executions7d: 128,
    successRate: 96,
    lastRun: "há 4 min",
    updatedAt: "há 2 dias"
  },
  {
    id: "wf-confirmacao-d1",
    name: "Confirmação D-1",
    description: "Confirma ou libera horários para a fila 24h antes do agendamento.",
    status: "active",
    channel: "WhatsApp",
    protocolId: "PR-103",
    protocolName: "Confirmação de agendamento",
    templateId: "tpl-confirmacao-d1",
    knowledgeBaseId: null,
    nodes: [
      { id: "wf2-n1", type: "ebot.scheduleTrigger", name: "D-1 do agendamento", position: { x: 0, y: 120 }, parameters: { moment: "D-1 do agendamento", time: "09:00" } },
      { id: "wf2-n2", type: "ebot.lookupClient", name: "Buscar cliente", position: { x: 260, y: 120 }, parameters: { fields: "agenda, parceria" } },
      { id: "wf2-n3", type: "ebot.sendMessage", name: "Mensagem de confirmação", position: { x: 520, y: 120 }, parameters: { text: "Olá {nome_cliente}! Sua agendamento é amanhã às {hora_agendamento}. Posso confirmar?" } },
      { id: "wf2-n4", type: "ebot.askQuestion", name: "Aguardar resposta", position: { x: 780, y: 120 }, parameters: { question: "Você confirma a agendamento de amanhã?", options: "Confirmo; Reagendar" } },
      { id: "wf2-n5", type: "ebot.condition", name: "Confirmou?", position: { x: 1040, y: 120 }, parameters: { field: "resposta_cliente", operator: "contém", value: "Confirmo" } },
      { id: "wf2-n6", type: "ebot.updateAgenda", name: "Confirmar agendamento", position: { x: 1300, y: 0 }, parameters: { operation: "Confirmar agendamento" } },
      { id: "wf2-n7", type: "ebot.humanHandoff", name: "Transferir para atendimento", position: { x: 1300, y: 240 }, parameters: { queue: "Atendimento", summary: true } }
    ],
    connections: [
      { id: "wf2-c1", source: "wf2-n1", target: "wf2-n2" },
      { id: "wf2-c2", source: "wf2-n2", target: "wf2-n3" },
      { id: "wf2-c3", source: "wf2-n3", target: "wf2-n4" },
      { id: "wf2-c4", source: "wf2-n4", target: "wf2-n5" },
      { id: "wf2-c5", source: "wf2-n5", target: "wf2-n6", sourceHandle: "true" },
      { id: "wf2-c6", source: "wf2-n5", target: "wf2-n7", sourceHandle: "false" }
    ],
    settings: { timezone: "America/Sao_Paulo", saveExecutions: true, onError: "continuar" },
    tags: ["agenda", "confirmação"],
    executions7d: 412,
    successRate: 98,
    lastRun: "há 18 min",
    updatedAt: "há 5 dias"
  },
  {
    id: "wf-resultado-pedidos",
    name: "Resultado de pedidos",
    description: "Aviso de relatório liberado e agendamento de leitura com o atendente.",
    status: "draft",
    channel: "WhatsApp",
    protocolId: "PR-107",
    protocolName: "Entrega de resultados",
    templateId: "tpl-resultado-pedidos",
    knowledgeBaseId: null,
    nodes: [
      { id: "wf3-n1", type: "ebot.webhookTrigger", name: "Relatório liberado", position: { x: 0, y: 120 }, parameters: { event: "pedido.resultado_liberado" } },
      { id: "wf3-n2", type: "ebot.lookupClient", name: "Buscar cliente", position: { x: 260, y: 120 }, parameters: { fields: "agenda, parceria" } },
      { id: "wf3-n3", type: "ebot.sendMessage", name: "Avisar cliente", position: { x: 520, y: 120 }, parameters: { text: "{nome_cliente}, seu resultado já está disponível. Quer agendar a leitura?" } },
      { id: "wf3-n4", type: "ebot.updateAgenda", name: "Agendar leitura", position: { x: 780, y: 120 }, parameters: { operation: "Agendar" } }
    ],
    connections: [
      { id: "wf3-c1", source: "wf3-n1", target: "wf3-n2" },
      { id: "wf3-c2", source: "wf3-n2", target: "wf3-n3" },
      { id: "wf3-c3", source: "wf3-n3", target: "wf3-n4" }
    ],
    settings: { timezone: "America/Sao_Paulo", saveExecutions: true, onError: "parar" },
    tags: ["pedidos"],
    executions7d: 0,
    successRate: 0,
    lastRun: "nunca",
    updatedAt: "há 1 dia"
  }
];

export const seedExecutions: FlowExecution[] = [
  {
    id: "exec-1042",
    workflowId: "wf-confirmacao-d1",
    status: "success",
    startedAt: "hoje, 09:12",
    durationMs: 4200,
    trigger: "D-1 do agendamento · Maria Oliveira",
    nodeResults: {
      "wf2-n1": { status: "success", durationMs: 120, output: "43 agendamentos encontradas para amanhã." },
      "wf2-n2": { status: "success", durationMs: 240, output: "Dados de agenda e parceria carregados." },
      "wf2-n3": { status: "success", durationMs: 380, output: "Mensagem entregue no WhatsApp." },
      "wf2-n4": { status: "success", durationMs: 2900, output: "Resposta recebida: \"Confirmo\"" },
      "wf2-n5": { status: "success", durationMs: 60, output: "Condição verdadeira." },
      "wf2-n6": { status: "success", durationMs: 500, output: "Agendamento confirmado na agenda." },
      "wf2-n7": { status: "skipped", durationMs: 0 }
    }
  },
  {
    id: "exec-1041",
    workflowId: "wf-confirmacao-d1",
    status: "error",
    startedAt: "hoje, 09:04",
    durationMs: 6900,
    trigger: "D-1 do agendamento · João Victor Costa",
    nodeResults: {
      "wf2-n1": { status: "success", durationMs: 110, output: "43 agendamentos encontradas para amanhã." },
      "wf2-n2": { status: "success", durationMs: 230, output: "Dados carregados." },
      "wf2-n3": { status: "error", durationMs: 6500, error: "Número bloqueou mensagens promocionais (opt-out registrado).", output: "" },
      "wf2-n4": { status: "skipped", durationMs: 0 },
      "wf2-n5": { status: "skipped", durationMs: 0 },
      "wf2-n6": { status: "skipped", durationMs: 0 },
      "wf2-n7": { status: "skipped", durationMs: 0 }
    }
  },
  {
    id: "exec-1040",
    workflowId: "wf-primeira-agendamento",
    status: "success",
    startedAt: "hoje, 08:47",
    durationMs: 12400,
    trigger: "Mensagem recebida · +55 11 98821-0421",
    nodeResults: {
      "wf1-n1": { status: "success", durationMs: 90, output: "Nova conversa iniciada." },
      "wf1-n2": { status: "success", durationMs: 8200, output: "IA identificou intenção: Agendar agendamento." },
      "wf1-n3": { status: "success", durationMs: 70, output: "Condição verdadeira." },
      "wf1-n4": { status: "success", durationMs: 4040, output: "Pré-agendamento enviado para validação." },
      "wf1-n5": { status: "skipped", durationMs: 0 }
    }
  },
  {
    id: "exec-1039",
    workflowId: "wf-primeira-agendamento",
    status: "success",
    startedAt: "ontem, 17:32",
    durationMs: 9800,
    trigger: "Mensagem recebida · +55 11 99122-7703",
    nodeResults: {
      "wf1-n1": { status: "success", durationMs: 85, output: "Nova conversa iniciada." },
      "wf1-n2": { status: "success", durationMs: 6100, output: "IA identificou intenção: Dúvida de valores." },
      "wf1-n3": { status: "success", durationMs: 65, output: "Condição falsa." },
      "wf1-n4": { status: "skipped", durationMs: 0 },
      "wf1-n5": { status: "success", durationMs: 3550, output: "Conversa transferida com resumo para o atendimento." }
    }
  }
];

export const seedQuickReplies: QuickReply[] = [
  {
    id: "qr-confirmacao",
    title: "Confirmar agendamento",
    text: "Olá {nome_cliente}! Sua agendamento com {nome_atendente} está marcada para {proximo_agendamento} na {filial}. Podemos confirmar?",
    scopes: ["clientes"],
    category: "Agendamento",
    usage7d: 98,
    updatedAt: "há 2 dias"
  },
  {
    id: "qr-endereco",
    title: "Endereço e horário da filial",
    text: "Estamos na {endereco_unidade}. Nosso atendimento é de {horario_atendimento}. Se precisar, é só chamar por aqui!",
    scopes: ["clientes"],
    category: "Informações",
    usage7d: 76,
    updatedAt: "há 4 dias"
  },
  {
    id: "qr-parceria",
    title: "Parceria e valores",
    text: "{nome_cliente}, atendemos clientes do segmento {parceria}. Para valores e cobertura, posso te detalhar por aqui ou, se preferir, falar com nossa atendimento pelo {telefone_unidade}.",
    scopes: ["clientes"],
    category: "Financeiro",
    usage7d: 54,
    updatedAt: "há 1 semana"
  },
  {
    id: "qr-preparo-sangue",
    title: "Preparo para pedidos de sangue",
    text: "Para o pedido de sangue é necessário jejum de 8 horas. Beba água normalmente e evite exercícios antes da coleta. Sua coleta está marcada para {proximo_agendamento}.",
    scopes: ["clientes", "interno"],
    category: "Pedidos",
    usage7d: 41,
    updatedAt: "há 3 dias"
  },
  {
    id: "qr-handoff-interno",
    title: "Passagem de caso (interno)",
    text: "Cliente {nome_completo}, {idade_cliente}, parceria {parceria}. Último atendimento em {ultimo_atendimento} com {nome_atendente}. Preciso de apoio com o caso.",
    scopes: ["interno"],
    category: "Equipe",
    usage7d: 32,
    updatedAt: "há 5 dias"
  },
  {
    id: "qr-retorno-interno",
    title: "Solicitar retorno do atendente",
    text: "O cliente {nome_cliente} aguarda retorno do atendente {nome_atendente} ({segmento}) sobre o atendimento de {ultimo_atendimento}.",
    scopes: ["interno"],
    category: "Equipe",
    usage7d: 18,
    updatedAt: "há 1 dia"
  }
];

export const seedKnowledgeBases: KnowledgeBase[] = [
  {
    id: "kb-protocolos",
    name: "Protocolos comerciais e orientações",
    description: "Fluxos de atendimento, orientações de cuidado e políticas de triagem validadas pela direção empresa.",
    category: "Protocolos",
    status: "indexed",
    files: [
      { id: "kbf-1", name: "protocolo-primeiro-atendimento.pdf", kind: "pdf", size: "1,8 MB", chunks: 42, status: "indexed", updatedAt: "há 2 dias", uploadedBy: "Fernanda Rocha" },
      { id: "kbf-2", name: "triagem-classificacao-demandas.md", kind: "md", size: "64 KB", chunks: 18, status: "indexed", updatedAt: "há 5 dias", uploadedBy: "Ricardo Lima" },
      { id: "kbf-3", name: "orientacoes-pos-venda.docx", kind: "docx", size: "420 KB", chunks: 26, status: "processing", updatedAt: "há 40 min", uploadedBy: "Marina Costa" }
    ],
    queries30d: 3842,
    agents: ["asst-geral", "asst-triagem"],
    access: { roles: ["Administrador", "Atendente", "Atendimento"], users: [], classification: "interna" },
    graph: {
      nodes: [
        { id: "g1", label: "Primeiro atendimento", kind: "entidade" },
        { id: "g2", label: "Levantamento inicial", kind: "conceito" },
        { id: "g3", label: "Triagem de demanda", kind: "regra" },
        { id: "g4", label: "Urgência", kind: "conceito" },
        { id: "g5", label: "Handoff humano", kind: "regra" },
        { id: "g6", label: "Pré-agendamento", kind: "conceito" }
      ],
      edges: [
        { id: "ge1", source: "g1", target: "g2", label: "inclui" },
        { id: "ge2", source: "g1", target: "g3", label: "exige" },
        { id: "ge3", source: "g3", target: "g4", label: "detecta" },
        { id: "ge4", source: "g4", target: "g5", label: "aciona" },
        { id: "ge5", source: "g1", target: "g6", label: "pode gerar" }
      ]
    },
    chunking: { strategy: "Por seção do documento", size: 512, overlap: 64 },
    updatedAt: "há 40 min"
  },
  {
    id: "kb-parcerias",
    name: "Parcerias e credenciamentos",
    description: "Tabela atualizada de planos aceitos por filial, carências e regras de faturamento.",
    category: "Parcerias",
    status: "indexed",
    files: [
      { id: "kbf-4", name: "tabela-parcerias-2026.xlsx", kind: "xlsx", size: "340 KB", chunks: 31, status: "indexed", updatedAt: "há 5 dias", uploadedBy: "Admin" },
      { id: "kbf-5", name: "credenciados-filial-norte.pdf", kind: "pdf", size: "1,1 MB", chunks: 22, status: "indexed", updatedAt: "há 1 semana", uploadedBy: "Julia Alves" },
      { id: "kbf-6", name: "politica-carncias.md", kind: "md", size: "28 KB", chunks: 9, status: "indexed", updatedAt: "há 2 semanas", uploadedBy: "Admin" }
    ],
    queries30d: 2118,
    agents: ["asst-geral"],
    access: { roles: ["Administrador", "Atendimento"], users: [], classification: "interna" },
    graph: {
      nodes: [
        { id: "g1", label: "Corporativo", kind: "entidade" },
        { id: "g2", label: "Bradesco Saúde", kind: "entidade" },
        { id: "g3", label: "Filial Centro", kind: "entidade" },
        { id: "g4", label: "Cobertura total", kind: "regra" },
        { id: "g5", label: "Carência 30 dias", kind: "regra" }
      ],
      edges: [
        { id: "ge1", source: "g1", target: "g3", label: "aceito em" },
        { id: "ge2", source: "g2", target: "g3", label: "aceito em" },
        { id: "ge3", source: "g1", target: "g4", label: "possui" },
        { id: "ge4", source: "g2", target: "g5", label: "possui" }
      ]
    },
    chunking: { strategy: "Por linha da tabela", size: 256, overlap: 32 },
    updatedAt: "há 5 dias"
  },
  {
    id: "kb-pedidos",
    name: "Preparo e orientação de pedidos",
    description: "Orientações de preparo por tipo de pedido, validadas pela equipe, com imagens de apoio.",
    category: "Pedidos",
    status: "syncing",
    files: [
      { id: "kbf-7", name: "preparo-pedidos-sangue.pdf", kind: "pdf", size: "760 KB", chunks: 19, status: "indexed", updatedAt: "há 3 dias", uploadedBy: "Fernanda Rocha" },
      { id: "kbf-8", name: "posicionamento-ecocardiograma.png", kind: "image", size: "2,4 MB", chunks: 4, status: "indexed", updatedAt: "há 6 dias", uploadedBy: "Pedidos" },
      { id: "kbf-9", name: "checklist-holter.md", kind: "md", size: "12 KB", chunks: 6, status: "processing", updatedAt: "há 15 min", uploadedBy: "Ricardo Lima" }
    ],
    queries30d: 1560,
    agents: ["asst-pedidos"],
    access: { roles: ["Administrador", "Atendente", "Pedidos"], users: [], classification: "interna" },
    graph: {
      nodes: [
        { id: "g1", label: "Orçamento", kind: "entidade" },
        { id: "g2", label: "Prazo de entrega", kind: "regra" },
        { id: "g3", label: "Contrato de frota", kind: "entidade" },
        { id: "g4", label: "Sem pendências", kind: "regra" },
        { id: "g5", label: "Instalação agendada", kind: "entidade" }
      ],
      edges: [
        { id: "ge1", source: "g1", target: "g2", label: "requer" },
        { id: "ge2", source: "g3", target: "g4", label: "requer" },
        { id: "ge3", source: "g5", target: "g2", label: "não requer" }
      ]
    },
    chunking: { strategy: "Por seção do documento", size: 512, overlap: 64 },
    updatedAt: "há 15 min"
  }
];

export const seedFiles: DriveFile[] = [
  {
    id: "file-1",
    name: "Relatório ecocardiograma",
    kind: "pdf",
    size: "2,4 MB",
    scope: "client",
    clientId: "CLI-0176",
    clientName: "Carlos Eduardo Santos",
    folder: "Relatórios",
    sensitivity: "sensivel",
    consent: { granted: true, date: "02 mar 2026", purpose: "Armazenamento e compartilhamento com a equipe comercial" },
    retention: "20 anos (histórico)",
    starred: true,
    uploadedBy: "Ricardo Lima",
    updatedAt: "há 18 min",
    permissions: [
      { id: "perm-1", granteeType: "role", grantee: "Atendente", level: "edit" },
      { id: "perm-2", granteeType: "user", grantee: "Marina Costa", level: "view" }
    ],
    audit: [
      { id: "aud-1", user: "Ricardo Lima", action: "enviou", at: "hoje, 09:12" },
      { id: "aud-2", user: "Marina Costa", action: "visualizou", at: "hoje, 09:30" }
    ]
  },
  {
    id: "file-2",
    name: "Solicitação de orçamento",
    kind: "pdf",
    size: "840 KB",
    scope: "client",
    clientId: "CLI-0149",
    clientName: "João Victor Costa",
    folder: "Documentos",
    sensitivity: "sensivel",
    consent: { granted: true, date: "14 jan 2026", purpose: "Armazenamento e continuidade do cuidado" },
    retention: "20 anos (histórico)",
    starred: false,
    uploadedBy: "Atendimento",
    updatedAt: "há 42 min",
    permissions: [{ id: "perm-3", granteeType: "role", grantee: "Atendente", level: "edit" }],
    audit: [{ id: "aud-3", user: "Julia Alves", action: "enviou", at: "hoje, 08:48" }]
  },
  {
    id: "file-3",
    name: "Contrato renovado - frota",
    kind: "pdf",
    size: "220 KB",
    scope: "client",
    clientId: "CLI-0184",
    clientName: "Maria Oliveira",
    folder: "Contratos",
    sensitivity: "sensivel",
    consent: { granted: true, date: "22 jul 2026", purpose: "Armazenamento e envio ao cliente" },
    retention: "5 anos (prescrição)",
    starred: false,
    uploadedBy: "Camila Duarte",
    updatedAt: "ontem",
    permissions: [
      { id: "perm-4", granteeType: "role", grantee: "Atendente", level: "edit" },
      { id: "perm-5", granteeType: "role", grantee: "Atendimento", level: "view" }
    ],
    audit: [
      { id: "aud-4", user: "Camila Duarte", action: "enviou", at: "ontem, 16:20" },
      { id: "aud-5", user: "IA de atendimento", action: "enviou", at: "ontem, 16:22" }
    ]
  },
  {
    id: "file-4",
    name: "Foto da lesão - acompanhamento",
    kind: "image",
    size: "3,1 MB",
    scope: "client",
    clientId: "CLI-0184",
    clientName: "Maria Oliveira",
    folder: "Anexos",
    sensitivity: "sensivel",
    consent: { granted: true, date: "22 jul 2026", purpose: "Acompanhamento comercial" },
    retention: "20 anos (histórico)",
    starred: false,
    uploadedBy: "Maria Oliveira (cliente)",
    updatedAt: "há 2 dias",
    permissions: [{ id: "perm-6", granteeType: "user", grantee: "Camila Duarte", level: "edit" }],
    audit: [
      { id: "aud-6", user: "Maria Oliveira", action: "enviou", at: "ter, 15:40" },
      { id: "aud-7", user: "Camila Duarte", action: "visualizou", at: "ter, 17:05" }
    ]
  },
  {
    id: "file-5",
    name: "Termo de consentimento LGPD",
    kind: "pdf",
    size: "180 KB",
    scope: "client",
    clientId: "CLI-0184",
    clientName: "Maria Oliveira",
    folder: "Consentimentos",
    sensitivity: "geral",
    consent: null,
    retention: "Indeterminado (base legal)",
    starred: true,
    uploadedBy: "Atendimento",
    updatedAt: "02 mar 2026",
    permissions: [
      { id: "perm-7", granteeType: "role", grantee: "Administrador", level: "edit" },
      { id: "perm-8", granteeType: "role", grantee: "Atendimento", level: "view" }
    ],
    audit: [{ id: "aud-8", user: "Marina Costa", action: "enviou", at: "02 mar, 10:12" }]
  },
  {
    id: "file-6",
    name: "Protocolo primeiro agendamento",
    kind: "pdf",
    size: "1,8 MB",
    scope: "kb",
    kbId: "kb-protocolos",
    folder: "Base de conhecimento",
    sensitivity: "geral",
    consent: null,
    retention: "Até remoção da base",
    starred: false,
    uploadedBy: "Fernanda Rocha",
    updatedAt: "há 2 dias",
    permissions: [{ id: "perm-9", granteeType: "role", grantee: "Atendente", level: "edit" }],
    audit: [{ id: "aud-9", user: "Fernanda Rocha", action: "enviou", at: "ter, 11:00" }]
  },
  {
    id: "file-7",
    name: "Tabela de parcerias 2026",
    kind: "xlsx",
    size: "340 KB",
    scope: "kb",
    kbId: "kb-parcerias",
    folder: "Base de conhecimento",
    sensitivity: "geral",
    consent: null,
    retention: "Até remoção da base",
    starred: false,
    uploadedBy: "Admin",
    updatedAt: "há 5 dias",
    permissions: [{ id: "perm-10", granteeType: "role", grantee: "Administrador", level: "edit" }],
    audit: [{ id: "aud-10", user: "Admin", action: "editou", at: "sáb, 09:15" }]
  },
  {
    id: "file-8",
    name: "Preparo pedidos de sangue",
    kind: "md",
    size: "64 KB",
    scope: "kb",
    kbId: "kb-pedidos",
    folder: "Base de conhecimento",
    sensitivity: "geral",
    consent: null,
    retention: "Até remoção da base",
    starred: false,
    uploadedBy: "Fernanda Rocha",
    updatedAt: "há 3 dias",
    permissions: [{ id: "perm-11", granteeType: "role", grantee: "Pedidos", level: "edit" }],
    audit: [{ id: "aud-11", user: "Fernanda Rocha", action: "enviou", at: "seg, 14:22" }]
  },
  {
    id: "file-9",
    name: "Audiometria anual",
    kind: "pdf",
    size: "1,2 MB",
    scope: "client",
    clientId: "CLI-0163",
    clientName: "Beatriz Ferreira",
    folder: "Relatórios",
    sensitivity: "sensivel",
    consent: { granted: false, date: "—", purpose: "Aguardando consentimento do titular" },
    retention: "Bloqueado até consentimento",
    starred: false,
    uploadedBy: "Atendimento",
    updatedAt: "há 6 dias",
    permissions: [{ id: "perm-12", granteeType: "user", grantee: "Paulo Nogueira", level: "view" }],
    audit: [{ id: "aud-12", user: "Julia Alves", action: "enviou", at: "sex, 08:50" }]
  }
];

export const seedAssistants: Assistant[] = [
  {
    id: "asst-geral",
    name: "Atendimento geral",
    description: "Atendimento digital: dúvidas gerais, horários, parcerias e agendamentos.",
    model: "GPT 5.5 Fast",
    temperature: 0.4,
    persona: "Você é a assistente virtual da Ê-Bot. Fale em português do Brasil com tom acolhedor, objetivo e seguro. Nunca diagnostique; oriente e encaminhe para a equipe quando necessário.",
    knowledgeBaseIds: ["kb-protocolos", "kb-parcerias"],
    handoff: { conditions: ["Cliente pede para falar com humano", "Dúvida fora da base de conhecimento", "Tom de insatisfação detectado"], confidenceThreshold: 70, targetQueue: "Atendimento" },
    guardrails: ["Nunca prometer prazos fora da política", "Nunca expor dados de outros clientes", "Encaminhar urgências imediatamente"],
    status: "active",
    metrics: { resolutionRate: 73, handoffRate: 18, conversations7d: 1284, tokens7d: "482 mil", cost7d: "R$ 96,40", csat: 4.7 }
  },
  {
    id: "asst-triagem",
    name: "Triagem inicial",
    description: "Coleta inicial de informações e direcionamento, sempre com handoff rastreável.",
    model: "GPT 5.5 Fast",
    temperature: 0.2,
    persona: "Você realiza a triagem inicial. Faça perguntas curtas, uma por vez, e classifique a urgência. Nunca prometa prazos ou condições fora da política comercial.",
    knowledgeBaseIds: ["kb-protocolos"],
    handoff: { conditions: ["Classificação de urgência", "Assuntos sensíveis", "Cliente solicitou humano"], confidenceThreshold: 80, targetQueue: "Prioridade" },
    guardrails: ["Nunca prometer prazos fora da política", "Nunca compartilhar dados de outros clientes", "Registrar todo handoff com resumo"],
    status: "active",
    metrics: { resolutionRate: 41, handoffRate: 59, conversations7d: 642, tokens7d: "218 mil", cost7d: "R$ 43,60", csat: 4.5 }
  },
  {
    id: "asst-pedidos",
    name: "Pedidos e resultados",
    description: "Orienta preparo, prazos e entrega de resultados de pedidos.",
    model: "GPT 5.5 Fast",
    temperature: 0.3,
    persona: "Você orienta clientes sobre pedidos: preparo, prazos e resultados. Use somente a base de conhecimento de pedidos e nunca interprete resultados.",
    knowledgeBaseIds: ["kb-pedidos"],
    handoff: { conditions: ["Pedido de interpretação de resultado", "Resultado alterado", "Dúvida de preparo não mapeada"], confidenceThreshold: 75, targetQueue: "Pedidos" },
    guardrails: ["Nunca interpretar relatórios", "Nunca antecipar resultados"],
    status: "paused",
    metrics: { resolutionRate: 68, handoffRate: 24, conversations7d: 0, tokens7d: "0", cost7d: "R$ 0,00", csat: 4.8 }
  }
];

export const seedPrompts: Prompt[] = [
  {
    id: "prompt-recepcao",
    name: "Triagem de atendimento",
    apiKey: "sk-••••••••••••3f2a",
    prompt: "Você é a recepcionista virtual da empresa. Acolha o cliente, identifique o motivo do contato e direcione para a fila correta. Fale em pt-BR, tom acolhedor e objetivo.",
    queueId: "que-recepcao",
    queueName: "Atendimento",
    voiceMode: "texto",
    temperature: 0.4,
    maxTokens: 800,
    maxHistoryMessages: 12,
    active: true,
    updatedAt: "hoje"
  },
  {
    id: "prompt-pedidos",
    name: "Orientação de pedidos",
    apiKey: "sk-••••••••••••8b7c",
    prompt: "Você orienta sobre preparo, prazos e entrega de resultados de pedidos. Use somente a base de pedidos e nunca interprete relatórios.",
    queueId: "que-pedidos",
    queueName: "Pedidos",
    voiceMode: "voz",
    voice: "nova",
    voiceApiKey: "sk-••••••••••••voice1",
    voiceRegion: "pt-BR",
    temperature: 0.3,
    maxTokens: 600,
    maxHistoryMessages: 10,
    active: true,
    updatedAt: "ontem"
  },
  {
    id: "prompt-financeiro",
    name: "Financeiro e parcerias",
    apiKey: "sk-••••••••••••d4e9",
    prompt: "Você responde dúvidas sobre valores, parcerias atendidos, cobertura e formas de pagamento, sempre conferindo a tabela vigente.",
    queueId: "que-financeiro",
    queueName: "Financeiro",
    voiceMode: "texto",
    temperature: 0.2,
    maxTokens: 500,
    maxHistoryMessages: 8,
    active: false,
    updatedAt: "há 3 dias"
  }
];
