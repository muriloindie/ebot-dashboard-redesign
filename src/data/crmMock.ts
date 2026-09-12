export type CrmStage = "Novo lead" | "Qualificado" | "Em negociação" | "Follow-up" | "Ganho" | "Perdido";
export type CrmChannel = "WhatsApp" | "Instagram" | "E-mail" | "Site" | "Telefone";
export type CrmTemperature = "quente" | "morno" | "frio";
export type CrmActivityKind = "mensagem" | "ia" | "proposta" | "reuniao" | "nota" | "sistema";

export type CrmActivity = {
  id: string;
  kind: CrmActivityKind;
  description: string;
  at: string;
};

export type CrmLead = {
  id: string;
  name: string;
  company?: string;
  phone: string;
  channel: CrmChannel;
  origin: string;
  value: number;
  stage: CrmStage;
  score: number;
  owner: string;
  lastActivity: string;
  staleDays: number;
  createdAt: string;
  nextAction?: string;
  tags: string[];
  notes?: string;
  activity: CrmActivity[];
};

export type CrmStageConfig = {
  id: CrmStage;
  label: string;
  description: string;
  color: string;
  terminal?: boolean;
};

export const crmStages: CrmStageConfig[] = [
  { id: "Novo lead", label: "Novo lead", description: "Recém-chegados no funil", color: "#A9D16C" },
  { id: "Qualificado", label: "Qualificado (IA)", description: "Validados pela triagem", color: "#6B942E" },
  { id: "Em negociação", label: "Em negociação", description: "Proposta em andamento", color: "#5D737E" },
  { id: "Follow-up", label: "Follow-up", description: "Aguardando retorno", color: "#8FA9B4" },
  { id: "Ganho", label: "Ganho", description: "Negócios fechados", color: "#5C8529", terminal: true },
  { id: "Perdido", label: "Perdido", description: "Sem avanço no funil", color: "#7A8E98", terminal: true }
];

export const crmOwners = ["Marina Costa", "Julia Alves", "Ricardo Lima", "Fernanda Rocha", "Sem responsável"];

export const crmChannels: CrmChannel[] = ["WhatsApp", "Instagram", "E-mail", "Site", "Telefone"];

export function scoreTemperature(score: number): CrmTemperature {
  if (score >= 80) return "quente";
  if (score >= 55) return "morno";
  return "frio";
}

export const crmLeadsSeed: CrmLead[] = [
  {
    id: "LEAD-1042",
    name: "Bruno Carvalho",
    company: "Vale Transportes",
    phone: "+55 46 99812-1104",
    channel: "WhatsApp",
    origin: "Instagram",
    value: 4800,
    stage: "Novo lead",
    score: 62,
    owner: "Sem responsável",
    lastActivity: "há 8 min",
    staleDays: 0,
    createdAt: "Hoje, 09:52",
    nextAction: "Qualificar com a IA e confirmar tamanho da frota",
    tags: ["Frota", "Inbound"],
    notes: "Pediu orçamento para manutenção de 4 vans. Ainda sem dono no funil.",
    activity: [
      { id: "a1", kind: "mensagem", description: "Primeiro contato pelo Instagram Direct pedindo orçamento.", at: "Hoje, 09:50" },
      { id: "a2", kind: "ia", description: "IA coletou segmento, porte da frota e urgência.", at: "Hoje, 09:52" }
    ]
  },
  {
    id: "LEAD-1041",
    name: "Patrícia Nogueira",
    phone: "+55 46 99744-3320",
    channel: "WhatsApp",
    origin: "Site",
    value: 980,
    stage: "Novo lead",
    score: 58,
    owner: "Sem responsável",
    lastActivity: "há 3 horas",
    staleDays: 1,
    createdAt: "Hoje, 07:10",
    nextAction: "Enviar orçamento de revisão",
    tags: ["Varejo"],
    activity: [
      { id: "a1", kind: "mensagem", description: "Formulário do site convertido em conversa no WhatsApp.", at: "Hoje, 07:05" },
      { id: "a2", kind: "ia", description: "IA confirmou veículo e serviço desejado.", at: "Hoje, 07:10" }
    ]
  },
  {
    id: "LEAD-1039",
    name: "Gustavo Nunes",
    phone: "+55 46 99123-8890",
    channel: "Instagram",
    origin: "Instagram",
    value: 2200,
    stage: "Novo lead",
    score: 71,
    owner: "Julia Alves",
    lastActivity: "há 40 min",
    staleDays: 0,
    createdAt: "Hoje, 09:18",
    nextAction: "Confirmar visita para avaliação",
    tags: ["Varejo", "Campanha"],
    activity: [
      { id: "a1", kind: "mensagem", description: "Respondeu campanha de revisão de fim de ano.", at: "Hoje, 09:05" },
      { id: "a2", kind: "nota", description: "Julia assumiu a conversa e agendou retorno.", at: "Hoje, 09:18" }
    ]
  },
  {
    id: "LEAD-1035",
    name: "Camila Rodrigues",
    phone: "+55 11 98703-2254",
    channel: "WhatsApp",
    origin: "Campanha de revisão",
    value: 1500,
    stage: "Qualificado",
    score: 88,
    owner: "Fernanda Rocha",
    lastActivity: "há 25 min",
    staleDays: 0,
    createdAt: "Hoje, 08:29",
    nextAction: "Agendar avaliação",
    tags: ["Varejo", "Quente"],
    notes: "Respondeu rápido, pediu valor e disponibilidade no mesmo dia.",
    activity: [
      { id: "a1", kind: "mensagem", description: "Pediu valor da revisão completa pelo WhatsApp.", at: "Hoje, 08:29" },
      { id: "a2", kind: "ia", description: "IA classificou como lead quente (score 88).", at: "Hoje, 08:31" },
      { id: "a3", kind: "proposta", description: "Orçamento enviado com opção de parcelamento.", at: "Hoje, 08:33" }
    ]
  },
  {
    id: "LEAD-1033",
    name: "Henrique Barros",
    company: "Barros Distribuidora",
    phone: "+55 11 98641-9902",
    channel: "E-mail",
    origin: "Indicação",
    value: 12600,
    stage: "Qualificado",
    score: 84,
    owner: "Marina Costa",
    lastActivity: "há 1 hora",
    staleDays: 0,
    createdAt: "Ontem, 16:40",
    nextAction: "Reunião para apresentar proposta de contrato",
    tags: ["Corporativo", "Frota"],
    activity: [
      { id: "a1", kind: "mensagem", description: "Pediu condições para contrato de manutenção de frota.", at: "Ontem, 16:12" },
      { id: "a2", kind: "ia", description: "IA qualificou porte, quantidade de veículos e prazo.", at: "Ontem, 16:20" },
      { id: "a3", kind: "reuniao", description: "Reunião marcada com o time comercial.", at: "Hoje, 08:05" }
    ]
  },
  {
    id: "LEAD-1031",
    name: "Rafael Monteiro",
    phone: "+55 11 99012-8873",
    channel: "WhatsApp",
    origin: "WhatsApp",
    value: 780,
    stage: "Qualificado",
    score: 76,
    owner: "Fernanda Rocha",
    lastActivity: "há 4 horas",
    staleDays: 0,
    createdAt: "Ontem, 15:22",
    nextAction: "Confirmar horário sugerido pela IA",
    tags: ["Varejo"],
    activity: [
      { id: "a1", kind: "mensagem", description: "Perguntou sobre horários de sábado e tipos de revisão.", at: "Ontem, 15:02" },
      { id: "a2", kind: "ia", description: "IA ofereceu horários e registrou preferência pela manhã.", at: "Ontem, 15:22" }
    ]
  },
  {
    id: "LEAD-1026",
    name: "Fernanda Lima",
    company: "Lima Log",
    phone: "+55 11 99320-7781",
    channel: "Instagram",
    origin: "Parcerias",
    value: 18500,
    stage: "Em negociação",
    score: 91,
    owner: "Marina Costa",
    lastActivity: "há 2 horas",
    staleDays: 0,
    createdAt: "14 ago 2026",
    nextAction: "Follow-up da proposta na quinta-feira",
    tags: ["Corporativo", "Frota", "VIP"],
    notes: "Negociando contrato de frota com SLA de atendimento em 4h.",
    activity: [
      { id: "a1", kind: "mensagem", description: "Solicitou condições para frotas corporativas.", at: "Hoje, 09:41" },
      { id: "a2", kind: "reuniao", description: "Reunião de apresentação realizada na Filial Norte.", at: "Hoje, 10:10" },
      { id: "a3", kind: "proposta", description: "Proposta comercial enviada para aprovação.", at: "Hoje, 11:35" }
    ]
  },
  {
    id: "LEAD-1024",
    name: "José Ricardo Alves",
    phone: "+55 11 98577-0934",
    channel: "Telefone",
    origin: "Telefone",
    value: 6200,
    stage: "Em negociação",
    score: 74,
    owner: "Julia Alves",
    lastActivity: "há 3 dias",
    staleDays: 3,
    createdAt: "12 ago 2026",
    nextAction: "Confirmar aprovação da instalação",
    tags: ["Corporativo", "Atacado"],
    notes: "Pedido de instalação atrasou; cliente aguarda nova data.",
    activity: [
      { id: "a1", kind: "mensagem", description: "Pediu remarcação da instalação por atraso de pedido.", at: "Hoje, 09:22" },
      { id: "a2", kind: "nota", description: "Sem interação há 3 dias — precisa de follow-up.", at: "Hoje, 09:40" }
    ]
  },
  {
    id: "LEAD-1021",
    name: "Amanda Souza",
    phone: "+55 11 99674-2208",
    channel: "WhatsApp",
    origin: "WhatsApp",
    value: 2400,
    stage: "Em negociação",
    score: 79,
    owner: "Fernanda Rocha",
    lastActivity: "há 50 min",
    staleDays: 0,
    createdAt: "Hoje, 08:58",
    nextAction: "Confirmar avaliação das 16h",
    tags: ["Varejo", "Primeiro contato"],
    activity: [
      { id: "a1", kind: "mensagem", description: "Pediu orçamento para revisão completa.", at: "Hoje, 08:58" },
      { id: "a2", kind: "ia", description: "Pré-agendamento criado para hoje às 16h.", at: "Hoje, 09:04" },
      { id: "a3", kind: "sistema", description: "Avaliação confirmada na agenda da Filial Centro.", at: "Hoje, 09:10" }
    ]
  },
  {
    id: "LEAD-1018",
    name: "Marcos Silva",
    phone: "+55 11 99122-7703",
    channel: "WhatsApp",
    origin: "WhatsApp",
    value: 4300,
    stage: "Follow-up",
    score: 68,
    owner: "Ricardo Lima",
    lastActivity: "há 5 dias",
    staleDays: 5,
    createdAt: "08 ago 2026",
    nextAction: "Retomar contato sobre proposta de manutenção",
    tags: ["Corporativo"],
    notes: "Recebeu a proposta mas não respondeu os últimos follow-ups.",
    activity: [
      { id: "a1", kind: "proposta", description: "Proposta de manutenção corretiva enviada.", at: "08 ago 2026" },
      { id: "a2", kind: "mensagem", description: "Follow-up enviado sem resposta.", at: "Há 5 dias" }
    ]
  },
  {
    id: "LEAD-1015",
    name: "Carolina Nunes",
    phone: "+55 11 99731-1802",
    channel: "E-mail",
    origin: "Site",
    value: 1900,
    stage: "Follow-up",
    score: 66,
    owner: "Julia Alves",
    lastActivity: "há 4 dias",
    staleDays: 4,
    createdAt: "06 ago 2026",
    nextAction: "Lembrar do orçamento aprovado no portal",
    tags: ["Varejo", "Pedidos"],
    activity: [
      { id: "a1", kind: "proposta", description: "Orçamento de peças aprovado e enviado.", at: "06 ago 2026" },
      { id: "a2", kind: "sistema", description: "Documento disponibilizado no portal do cliente.", at: "Há 4 dias" }
    ]
  },
  {
    id: "LEAD-1009",
    name: "Carlos Eduardo Santos",
    company: "Santos Entregas",
    phone: "+55 11 98812-4410",
    channel: "WhatsApp",
    origin: "Contrato de frota",
    value: 24800,
    stage: "Ganho",
    score: 95,
    owner: "Ricardo Lima",
    lastActivity: "hoje, 09:52",
    staleDays: 0,
    createdAt: "28 jul 2026",
    nextAction: "Instalação das peças agendada para hoje",
    tags: ["Frota", "VIP"],
    notes: "Contrato mensal de frota fechado com renovação automática.",
    activity: [
      { id: "a1", kind: "reuniao", description: "Reunião de fechamento do contrato de frota.", at: "28 jul 2026" },
      { id: "a2", kind: "proposta", description: "Proposta aceita e assinada digitalmente.", at: "29 jul 2026" },
      { id: "a3", kind: "mensagem", description: "Cliente avisado da chegada das peças.", at: "Hoje, 09:50" }
    ]
  },
  {
    id: "LEAD-1004",
    name: "Beatriz Ferreira",
    phone: "+55 11 98455-6619",
    channel: "WhatsApp",
    origin: "WhatsApp",
    value: 3600,
    stage: "Ganho",
    score: 82,
    owner: "Marina Costa",
    lastActivity: "ontem, 18:20",
    staleDays: 1,
    createdAt: "30 jul 2026",
    nextAction: "Pesquisa de satisfação pós-serviço",
    tags: ["VIP", "Pós-venda"],
    activity: [
      { id: "a1", kind: "mensagem", description: "Fechou a manutenção preventiva anual.", at: "30 jul 2026" },
      { id: "a2", kind: "sistema", description: "Pagamento confirmado e nota fiscal emitida.", at: "Ontem, 18:20" }
    ]
  },
  {
    id: "LEAD-0998",
    name: "Otávio Rangel",
    phone: "+55 11 98177-5520",
    channel: "Instagram",
    origin: "Instagram",
    value: 5500,
    stage: "Perdido",
    score: 41,
    owner: "Julia Alves",
    lastActivity: "há 12 dias",
    staleDays: 12,
    createdAt: "30 jul 2026",
    nextAction: "Reativar na próxima campanha",
    tags: ["Varejo"],
    notes: "Sem retorno após a proposta e sem resposta aos follow-ups.",
    activity: [
      { id: "a1", kind: "proposta", description: "Proposta de serviço enviada pelo Instagram.", at: "30 jul 2026" },
      { id: "a2", kind: "nota", description: "Lead marcado como perdido por inatividade.", at: "Há 12 dias" }
    ]
  }
];
