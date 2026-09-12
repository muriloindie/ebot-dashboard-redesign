export type ProtocolCategory = "Primeiro contato" | "Agendamento" | "Pós-venda" | "Pedidos" | "Reagendamento";
export type ProtocolStatus = "Em andamento" | "Concluído" | "Aguardando" | "Cancelado";
export type ProtocolMessageDirection = "incoming" | "outgoing" | "system";
export type ProtocolMessageKind = "text" | "image" | "document" | "audio";
export type ProtocolSenderKind = "client" | "attendant" | "robot" | "system";

export type ProtocolMessage = {
  id: string;
  direction: ProtocolMessageDirection;
  kind: ProtocolMessageKind;
  sender: string;
  senderKind: ProtocolSenderKind;
  attendant?: string;
  sentAt: string;
  text: string;
  attachmentName?: string;
  device?: string;
  read?: boolean;
  listened?: boolean;
  durationSeconds?: number;
};

export type ProtocolRecord = {
  id: string;
  number: string;
  title: string;
  category: ProtocolCategory;
  status: ProtocolStatus;
  clientName: string;
  clientId: string;
  phone: string;
  user: string;
  sector: string;
  queue: string;
  responsible: string;
  channel: string;
  date: string;
  startedAt: string;
  firstMessageAt: string;
  attendedAt: string;
  updatedAt: string;
  duration: string;
  summary: string;
  messages: ProtocolMessage[];
};

export const protocolCategories: ProtocolCategory[] = ["Primeiro contato", "Agendamento", "Pós-venda", "Pedidos", "Reagendamento"];

export const protocolStatuses: ProtocolStatus[] = ["Em andamento", "Concluído", "Aguardando", "Cancelado"];

export const protocols: ProtocolRecord[] = [
  {
    id: "PR-2026-0112",
    number: "#46-20260812083959",
    title: "Primeiro contato",
    category: "Primeiro contato",
    status: "Em andamento",
    clientName: "Amanda Souza",
    clientId: "CLI-0171",
    phone: "+55 11 99674-2208",
    user: "Marina Costa",
    sector: "Atendimento",
    queue: "Primeiro agendamento",
    responsible: "Marina Costa",
    channel: "WhatsApp",
    date: "12/08/2026",
    startedAt: "Hoje, 08:58",
    firstMessageAt: "Hoje, 08:58",
    attendedAt: "Hoje, 08:59",
    updatedAt: "Hoje, 09:05",
    duration: "7 min",
    summary: "Pré-agendamento do primeiro atendimento com validação de filial e horário.",
    messages: [
      { id: "m-0112-1", direction: "incoming", kind: "text", sender: "Amanda Souza", senderKind: "client", sentAt: "08:58", text: "Olá, gostaria de marcar um agendamento com a Fernanda.", device: "Android · WhatsApp", read: true },
      { id: "m-0112-2", direction: "outgoing", kind: "text", sender: "Ê-Bot", senderKind: "robot", sentAt: "08:59", text: "Bom dia, Amanda. Posso ajudar. Você prefere a Filial Centro ou a Filial Norte?", device: "Ê-Bot · API", read: true },
      { id: "m-0112-3", direction: "incoming", kind: "text", sender: "Amanda Souza", senderKind: "client", sentAt: "09:01", text: "Pode ser na Filial Centro, no período da tarde.", device: "Android · WhatsApp", read: true },
      { id: "m-0112-4", direction: "system", kind: "text", sender: "Sistema", senderKind: "system", sentAt: "09:05", text: "Pré-agendamento criado para hoje às 16:00. Aguardando confirmação do atendimento." }
    ]
  },
  {
    id: "PR-2026-0110",
    number: "#45-20260812081204",
    title: "Resultado de ecocardiograma",
    category: "Pedidos",
    status: "Aguardando",
    clientName: "Carlos Eduardo Santos",
    clientId: "CLI-0176",
    phone: "+55 11 98812-4410",
    user: "Ricardo Lima",
    sector: "Frota",
    queue: "Resultados de pedidos",
    responsible: "Ricardo Lima",
    channel: "WhatsApp",
    date: "12/08/2026",
    startedAt: "Hoje, 09:50",
    firstMessageAt: "Hoje, 09:50",
    attendedAt: "Hoje, 09:52",
    updatedAt: "Hoje, 10:04",
    duration: "14 min",
    summary: "Resultado liberado e encaminhado para avaliação do atendente responsável.",
    messages: [
      { id: "m-0110-1", direction: "outgoing", kind: "text", sender: "Atendimento", senderKind: "attendant", attendant: "Julia Alves", sentAt: "09:50", text: "Olá, Carlos. Seu resultado de ecocardiograma já está disponível para avaliação.", device: "Web · Painel", read: true },
      { id: "m-0110-2", direction: "incoming", kind: "audio", sender: "Carlos Eduardo Santos", senderKind: "client", sentAt: "09:53", text: "Áudio do cliente.", device: "iPhone · WhatsApp", listened: false, durationSeconds: 24 },
      { id: "m-0110-3", direction: "outgoing", kind: "document", sender: "Atendimento", senderKind: "attendant", attendant: "Julia Alves", sentAt: "10:04", text: "Relatório encaminhado para o atendimento do atendente.", attachmentName: "relatório-relatorio-motor.pdf", device: "Web · Painel", read: false }
    ]
  },
  {
    id: "PR-2026-0108",
    number: "#44-20260812080517",
    title: "Confirmação de agendamento",
    category: "Agendamento",
    status: "Concluído",
    clientName: "Fernanda Lima",
    clientId: "CLI-0158",
    phone: "+55 11 99320-7781",
    user: "Ê-Bot",
    sector: "Varejo",
    queue: "Confirmação de agendamentos",
    responsible: "IA + equipe",
    channel: "Instagram",
    date: "12/08/2026",
    startedAt: "Hoje, 09:38",
    firstMessageAt: "Hoje, 09:38",
    attendedAt: "Hoje, 09:38",
    updatedAt: "Hoje, 09:44",
    duration: "6 min",
    summary: "Agendamento de retorno confirmada após conversa iniciada no Instagram.",
    messages: [
      { id: "m-0108-1", direction: "outgoing", kind: "text", sender: "Ê-Bot", senderKind: "robot", sentAt: "09:38", text: "Olá, Fernanda. Podemos confirmar seu retorno de pós-venda hoje às 15:00?", device: "Ê-Bot · API", read: true },
      { id: "m-0108-2", direction: "incoming", kind: "text", sender: "Fernanda Lima", senderKind: "client", sentAt: "09:43", text: "Sim, está confirmado.", device: "Android · Instagram", read: true },
      { id: "m-0108-3", direction: "system", kind: "text", sender: "Sistema", senderKind: "system", sentAt: "09:44", text: "Agendamento confirmado e status atualizado na agenda." }
    ]
  },
  {
    id: "PR-2026-0103",
    number: "#43-20260811080733",
    title: "Acompanhamento pós-agendamento",
    category: "Pós-venda",
    status: "Concluído",
    clientName: "Beatriz Ferreira",
    clientId: "CLI-0163",
    phone: "+55 11 98455-6619",
    user: "Marina Costa",
    sector: "Suporte",
    queue: "Pós-venda",
    responsible: "Marina Costa",
    channel: "WhatsApp",
    date: "11/08/2026",
    startedAt: "Ontem, 08:20",
    firstMessageAt: "Ontem, 08:20",
    attendedAt: "Ontem, 08:34",
    updatedAt: "Ontem, 08:42",
    duration: "22 min",
    summary: "Acompanhamento de atraso com priorização de encaixe pelo atendimento.",
    messages: [
      { id: "m-0103-1", direction: "incoming", kind: "text", sender: "Beatriz Ferreira", senderKind: "client", sentAt: "08:20", text: "Estou aguardando há bastante tempo. Existe previsão para o atendimento?", device: "Android · WhatsApp", read: true },
      { id: "m-0103-2", direction: "outgoing", kind: "image", sender: "Atendimento", senderKind: "attendant", attendant: "Marina Costa", sentAt: "08:34", text: "Foto da nova sala de espera enviada.", attachmentName: "sala-espera.jpg", device: "Web · Painel", read: true },
      { id: "m-0103-3", direction: "system", kind: "text", sender: "Sistema", senderKind: "system", sentAt: "08:42", text: "Encaixe priorizado e cliente notificada." }
    ]
  },
  {
    id: "PR-2026-0098",
    number: "#42-20260812080402",
    title: "Entrega de resultado",
    category: "Pedidos",
    status: "Concluído",
    clientName: "Carolina Nunes",
    clientId: "CLI-0134",
    phone: "+55 11 99731-1802",
    user: "Julia Alves",
    sector: "Varejo",
    queue: "Resultados de pedidos",
    responsible: "Julia Alves",
    channel: "E-mail",
    date: "12/08/2026",
    startedAt: "Hoje, 08:48",
    firstMessageAt: "Hoje, 08:48",
    attendedAt: "Hoje, 08:48",
    updatedAt: "Hoje, 08:55",
    duration: "7 min",
    summary: "Pedido atualizado e disponibilizado no portal, com aviso ao cliente.",
    messages: [
      { id: "m-0098-1", direction: "outgoing", kind: "text", sender: "Atendimento", senderKind: "attendant", attendant: "Julia Alves", sentAt: "08:48", text: "Carolina, seu resultado já está disponível no portal do cliente.", device: "Web · Painel", read: true },
      { id: "m-0098-2", direction: "incoming", kind: "text", sender: "Carolina Nunes", senderKind: "client", sentAt: "08:55", text: "Recebi a mensagem. Obrigada pelo aviso.", device: "Web · E-mail", read: true }
    ]
  },
  {
    id: "PR-2026-0094",
    number: "#41-20260812075948",
    title: "Reagendamento de retorno",
    category: "Reagendamento",
    status: "Em andamento",
    clientName: "José Ricardo Alves",
    clientId: "CLI-0119",
    phone: "+55 11 98577-0934",
    user: "Julia Alves",
    sector: "Corporativo",
    queue: "Reagendamentos",
    responsible: "Julia Alves",
    channel: "Telefone",
    date: "12/08/2026",
    startedAt: "Hoje, 09:18",
    firstMessageAt: "Hoje, 09:18",
    attendedAt: "Hoje, 09:22",
    updatedAt: "Hoje, 09:22",
    duration: "4 min",
    summary: "Cliente solicitou nova data por atraso na liberação do pedido.",
    messages: [
      { id: "m-0094-1", direction: "incoming", kind: "text", sender: "José Ricardo Alves", senderKind: "client", sentAt: "09:18", text: "Preciso trocar a data do retorno porque meu pedido ainda não ficou pronto.", device: "Telefone · Ligação", read: true },
      { id: "m-0094-2", direction: "outgoing", kind: "text", sender: "Atendimento", senderKind: "attendant", attendant: "Julia Alves", sentAt: "09:22", text: "Vou verificar as próximas disponibilidades do André e retorno com as opções.", device: "Web · Painel", read: false }
    ]
  },
  {
    id: "PR-2026-0086",
    number: "#40-20260807090114",
    title: "Orientação de preparo",
    category: "Pedidos",
    status: "Cancelado",
    clientName: "Patrícia Gomes",
    clientId: "CLI-0112",
    phone: "+55 11 98214-3356",
    user: "Ê-Bot",
    sector: "Atendimento",
    queue: "Preparo de pedidos",
    responsible: "IA + equipe",
    channel: "E-mail",
    date: "07/08/2026",
    startedAt: "07 ago 2026, 09:10",
    firstMessageAt: "07 ago 2026, 09:10",
    attendedAt: "07 ago 2026, 09:10",
    updatedAt: "07 ago 2026, 09:14",
    duration: "4 min",
    summary: "Orientação interrompida após o contato solicitar atendimento por telefone.",
    messages: [
      { id: "m-0086-1", direction: "incoming", kind: "text", sender: "Patrícia Gomes", senderKind: "client", sentAt: "09:10", text: "Gostaria de confirmar o preparo para o pedido de amanhã.", device: "Web · E-mail", read: true },
      { id: "m-0086-2", direction: "system", kind: "text", sender: "Sistema", senderKind: "system", sentAt: "09:14", text: "Atendimento encerrado a pedido do contato. Novo contato por telefone necessário." }
    ]
  }
];
