export type AttendanceStatus = "Aguardando" | "Em atendimento humano" | "Resolvido pela IA" | "Encerrado";
export type AttendancePriority = "Alta" | "Média" | "Baixa";
export type AttendanceChannel = "WhatsApp" | "Instagram" | "E-mail" | "Telefone";
export type AttendanceSource = "IA" | "Humano" | "IA + humano";
export type AttendanceUnit = "Filial Centro" | "Filial Norte" | "Filial Sul";

export type AttendanceMessage = {
  id: string;
  from: "client" | "ai" | "human" | "me";
  text: string;
  time: string;
};

export type Attendance = {
  id: string;
  clientName: string;
  phone: string;
  channel: AttendanceChannel;
  status: AttendanceStatus;
  priority: AttendancePriority;
  responsible: string;
  source: AttendanceSource;
  unit: AttendanceUnit;
  sector: string;
  queue: string;
  lastMessage: string;
  time: string;
  unread: number;
  startedAt: string;
  duration: string;
  dateOffset?: number;
  messages: AttendanceMessage[];
};

export const attendanceIndicators = {
  active: 17,
  waiting: 6,
  inHuman: 4,
  resolvedByAi: 42,
  avgWait: "02m 40s",
  sla: "94%"
};

export const attendanceChannels: AttendanceChannel[] = ["WhatsApp", "Instagram", "E-mail", "Telefone"];
export const attendanceUnits: AttendanceUnit[] = ["Filial Centro", "Filial Norte", "Filial Sul"];
export const attendanceResponsibles = ["IA", "Marina Costa", "Julia Alves", "Ruan Viana", "Fernanda Rocha"];

export const attendances: Attendance[] = [
  {
    id: "AT-1101",
    clientName: "Maria Oliveira",
    phone: "+55 11 98741-1122",
    channel: "WhatsApp",
    status: "Aguardando",
    priority: "Alta",
    responsible: "IA",
    source: "IA",
    unit: "Filial Centro",
    sector: "Comercial",
    queue: "Agendamento",
    lastMessage: "Gostaria de confirmar meu agendamento de amanhã, se possível.",
    time: "09:58",
    unread: 2,
    startedAt: "09:54",
    duration: "04 min",
    messages: [
      { id: "m1", from: "client", text: "Bom dia! Gostaria de confirmar meu agendamento de amanhã, se possível.", time: "09:54" },
      { id: "m2", from: "ai", text: "Bom dia, Maria! Aqui é o assistente do Ê-Bot. Verifiquei aqui: seu agendamento está confirmado com o Ricardo, às 14h30 na Filial Centro. Posso confirmar?", time: "09:55" },
      { id: "m3", from: "client", text: "Pode sim! E preciso levar algum documento?", time: "09:57" },
      { id: "m4", from: "ai", text: "Agendamento confirmado para amanhã, 14h30, com o Ricardo. Para a revisão do seu veículo, traga o documento do carro e o histórico da última manutenção. Precisa de ajuda com o endereço?", time: "09:58" }
    ]
  },
  {
    id: "AT-1100",
    clientName: "Carlos Eduardo Santos",
    phone: "+55 11 98812-4410",
    channel: "WhatsApp",
    status: "Em atendimento humano",
    priority: "Alta",
    responsible: "Marina Costa",
    source: "IA + humano",
    unit: "Filial Centro",
    sector: "Frota",
    queue: "Status de pedido",
    lastMessage: "As peças do seu caminhão chegaram e a instalação está liberada.",
    time: "09:52",
    unread: 1,
    startedAt: "09:31",
    duration: "21 min",
    messages: [
      { id: "m1", from: "client", text: "Olá, queria saber se as peças do meu caminhão já chegaram.", time: "09:28" },
      { id: "m2", from: "ai", text: "Olá, Carlos! Seu pedido está em trânsito com o fornecedor. Vou avisar o time comercial para acompanhar e te atualizar, ok?", time: "09:29" },
      { id: "m3", from: "human", text: "Carlos, bom dia! Aqui é a Marina, do atendimento. As peças acabaram de chegar e a instalação está liberada. Quer agendar a troca para hoje?", time: "09:50" },
      { id: "m4", from: "client", text: "Perfeito, Marina. Pode agendar para às 15h!", time: "09:52" }
    ]
  },
  {
    id: "AT-1098",
    clientName: "Fernanda Lima",
    phone: "+55 11 99320-7781",
    channel: "Instagram",
    status: "Aguardando",
    priority: "Média",
    responsible: "IA",
    source: "IA",
    unit: "Filial Norte",
    sector: "Comercial",
    queue: "Parcerias",
    lastMessage: "Vocês atendem frota corporativa? Preciso de um retorno de pós-venda.",
    time: "09:44",
    unread: 0,
    startedAt: "09:41",
    duration: "03 min",
    messages: [
      { id: "m1", from: "client", text: "Oi! Vocês atendem frota corporativa? Preciso de um retorno de pós-venda.", time: "09:41" },
      { id: "m2", from: "ai", text: "Oi, Fernanda! Atendemos frotas corporativas em todas as filiais, com condições especiais por contrato. Tenho horário para quinta-feira à tarde na Filial Norte com nosso time de parcerias. Posso reservar?", time: "09:43" },
      { id: "m3", from: "client", text: "Quinta-feira à tarde funciona. Qual horário?", time: "09:44" }
    ]
  },
  {
    id: "AT-1096",
    clientName: "José Ricardo Alves",
    phone: "+55 11 98577-0934",
    channel: "Telefone",
    status: "Em atendimento humano",
    priority: "Média",
    responsible: "Julia Alves",
    source: "Humano",
    unit: "Filial Sul",
    sector: "Comercial",
    queue: "Reagendamento",
    lastMessage: "Aguarde um instante, Sr. José, vou confirmar o novo horário com o André.",
    time: "09:38",
    unread: 0,
    startedAt: "09:22",
    duration: "16 min",
    messages: [
      { id: "m1", from: "client", text: "Preciso remarcar meu agendamento de instalação, o pedido atrasou.", time: "09:22" },
      { id: "m2", from: "human", text: "Entendi, Sr. José. Seu agendamento estava marcado para hoje, 11h, com o André Martins. Vou verificar as próximas disponibilidades.", time: "09:24" },
      { id: "m3", from: "human", text: "Aguarde um instante, Sr. José, vou confirmar o novo horário com o André.", time: "09:38" }
    ]
  },
  {
    id: "AT-1094",
    clientName: "Patrícia Gomes",
    phone: "+55 11 98214-3356",
    channel: "E-mail",
    status: "Aguardando",
    priority: "Baixa",
    responsible: "IA",
    source: "IA",
    unit: "Filial Centro",
    sector: "Financeiro",
    queue: "Documentos",
    lastMessage: "Preciso de uma via da nota fiscal de maio para encaminhar ao financeiro.",
    time: "09:31",
    unread: 1,
    startedAt: "09:18",
    duration: "13 min",
    messages: [
      { id: "m1", from: "client", text: "Olá, preciso de uma via da minha nota fiscal de maio para encaminhar ao financeiro.", time: "09:18" },
      { id: "m2", from: "ai", text: "Olá, Patrícia! A nota fiscal de 12 de maio está disponível no portal do cliente. Posso enviar uma cópia em PDF por e-mail?", time: "09:20" },
      { id: "m3", from: "client", text: "Sim, por favor. Obrigada!", time: "09:31" }
    ]
  },
  {
    id: "AT-1091",
    clientName: "Rafael Monteiro",
    phone: "+55 11 99012-8873",
    channel: "WhatsApp",
    status: "Resolvido pela IA",
    priority: "Baixa",
    responsible: "IA",
    source: "IA",
    unit: "Filial Norte",
    sector: "Suporte",
    queue: "Informações",
    lastMessage: "Perfeito, obrigado pelas informações!",
    time: "09:12",
    unread: 0,
    startedAt: "09:02",
    duration: "10 min",
    messages: [
      { id: "m1", from: "client", text: "Até que horas a Filial Norte funciona aos sábados?", time: "09:02" },
      { id: "m2", from: "ai", text: "A Filial Norte funciona aos sábados das 8h às 12h, com atendimento de emergência até as 14h. Posso ajudar com mais alguma coisa?", time: "09:03" },
      { id: "m3", from: "client", text: "Perfeito, obrigado pelas informações!", time: "09:12" }
    ]
  },
  {
    id: "AT-1089",
    clientName: "Amanda Souza",
    phone: "+55 11 99674-2208",
    channel: "WhatsApp",
    status: "Aguardando",
    priority: "Alta",
    responsible: "IA",
    source: "IA",
    unit: "Filial Centro",
    sector: "Comercial",
    queue: "Orçamentos",
    lastMessage: "Quero um orçamento para revisão completa, tem vaga ainda hoje?",
    time: "09:05",
    unread: 3,
    startedAt: "08:58",
    duration: "07 min",
    messages: [
      { id: "m1", from: "client", text: "Oi! Quero um orçamento para revisão completa do meu carro, tem vaga ainda hoje?", time: "08:58" },
      { id: "m2", from: "ai", text: "Oi, Amanda! Que bom ter você aqui. Tenho disponibilidade hoje às 16h ou amanhã às 9h30 para avaliação. Qual prefere?", time: "08:59" },
      { id: "m3", from: "client", text: "Hoje às 16h fica perfeito!", time: "09:02" },
      { id: "m4", from: "ai", text: "Sua avaliação está pré-agendada para hoje, 16h, na Filial Centro. Para confirmar, preciso de um retorno seu: o serviço será particular ou por contrato corporativo?", time: "09:04" },
      { id: "m5", from: "client", text: "Vou ser particular mesmo.", time: "09:05" }
    ]
  },
  {
    id: "AT-1086",
    clientName: "Beatriz Ferreira",
    phone: "+55 11 98455-6619",
    channel: "WhatsApp",
    status: "Em atendimento humano",
    priority: "Alta",
    responsible: "Marina Costa",
    source: "IA + humano",
    unit: "Filial Norte",
    sector: "Suporte",
    queue: "Atraso",
    lastMessage: "Você tem razão, Beatriz. Vou priorizar seu atendimento agora mesmo.",
    time: "08:52",
    unread: 2,
    startedAt: "08:20",
    duration: "32 min",
    messages: [
      { id: "m1", from: "client", text: "Estou aguardando há 40 minutos e ainda não fui chamada. Meu agendamento era às 8h.", time: "08:20" },
      { id: "m2", from: "ai", text: "Sinto muito pela espera, Beatriz. Houve uma emergência na oficina. Já sinalizei para o atendimento acompanhar o seu caso com prioridade.", time: "08:21" },
      { id: "m3", from: "human", text: "Beatriz, aqui é a Marina. Já alinhei com o Paulo, ele vai te atender assim que terminar o serviço em andamento. Pode ser em uns 15 minutos?", time: "08:40" },
      { id: "m4", from: "client", text: "Consigo esperar mais 15 minutos, mas preciso sair às 9h15 para o trabalho.", time: "08:50" },
      { id: "m5", from: "human", text: "Você tem razão, Beatriz. Vou priorizar seu atendimento agora mesmo.", time: "08:52" }
    ]
  },
  {
    id: "AT-1083",
    clientName: "Lucas Pereira",
    phone: "+55 11 99183-4477",
    channel: "WhatsApp",
    status: "Resolvido pela IA",
    priority: "Média",
    responsible: "IA",
    source: "IA",
    unit: "Filial Sul",
    sector: "Suporte",
    queue: "Documentos",
    lastMessage: "Recebi o manual, muito obrigado!",
    time: "08:44",
    unread: 0,
    startedAt: "08:36",
    duration: "08 min",
    messages: [
      { id: "m1", from: "client", text: "Pode me enviar o manual do equipamento que ficou no sistema?", time: "08:36" },
      { id: "m2", from: "ai", text: "Claro, Lucas! O manual foi enviado em PDF para o seu e-mail cadastrado.", time: "08:37" },
      { id: "m3", from: "client", text: "Recebi o manual, muito obrigado!", time: "08:44" }
    ]
  },
  {
    id: "AT-1080",
    clientName: "Camila Rodrigues",
    phone: "+55 11 98703-2254",
    channel: "Instagram",
    status: "Aguardando",
    priority: "Média",
    responsible: "IA",
    source: "IA",
    unit: "Filial Centro",
    sector: "Comercial",
    queue: "Valores",
    lastMessage: "Qual o valor da revisão completa?",
    time: "08:33",
    unread: 0,
    startedAt: "08:29",
    duration: "04 min",
    messages: [
      { id: "m1", from: "client", text: "Qual o valor da revisão completa?", time: "08:29" },
      { id: "m2", from: "ai", text: "A revisão completa custa R$ 380,00, com parcelamento em até 3x sem juros. Gostaria que eu reservasse um horário para avaliação?", time: "08:31" },
      { id: "m3", from: "client", text: "Vou confirmar e te aviso, obrigada!", time: "08:33" }
    ]
  },
  {
    id: "AT-1077",
    clientName: "Henrique Barros",
    phone: "+55 11 98641-9902",
    channel: "E-mail",
    status: "Em atendimento humano",
    priority: "Baixa",
    responsible: "Julia Alves",
    source: "Humano",
    unit: "Filial Norte",
    sector: "Comercial",
    queue: "Parcerias",
    lastMessage: "Encaminhei a tabela de preços corporativa para seu e-mail, Henrique.",
    time: "08:19",
    unread: 0,
    startedAt: "08:02",
    duration: "17 min",
    dateOffset: -1,
    messages: [
      { id: "m1", from: "client", text: "Prezados, gostaria de saber se vocês atendem contratos de manutenção para frotas.", time: "08:02" },
      { id: "m2", from: "human", text: "Olá, Henrique! Atendemos contratos corporativos para frotas na Filial Norte. Vou enviar a tabela de serviços e condições por e-mail.", time: "08:12" },
      { id: "m3", from: "human", text: "Encaminhei a tabela de preços corporativa para seu e-mail, Henrique.", time: "08:19" }
    ]
  },
  {
    id: "AT-1074",
    clientName: "Juliana Martins",
    phone: "+55 11 98912-8830",
    channel: "WhatsApp",
    status: "Aguardando",
    priority: "Alta",
    responsible: "IA + humano",
    source: "IA + humano",
    unit: "Filial Centro",
    sector: "Pós-venda",
    queue: "Garantia",
    lastMessage: "Ricardo pediu retorno em 10 dias. Pode me agendar o mais cedo possível?",
    time: "08:07",
    unread: 1,
    startedAt: "07:58",
    duration: "09 min",
    dateOffset: -2,
    messages: [
      { id: "m1", from: "client", text: "Fiz uma instalação há 3 semanas e o Ricardo pediu um retorno de garantia em 10 dias. Pode me agendar o mais cedo possível?", time: "07:58" },
      { id: "m2", from: "ai", text: "Oi, Juliana! Vou verificar os retornos de garantia do Ricardo para esta semana e já te encaminho as opções.", time: "08:00" },
      { id: "m3", from: "human", text: "Juliana, encontrei uma vaga para sexta-feira, 10h. Quer que eu confirme? Nosso time de pós-venda deu prioridade para o seu caso.", time: "08:06" },
      { id: "m4", from: "client", text: "Sexta às 10h está ótimo. Confirmo!", time: "08:07" }
    ]
  }
];
