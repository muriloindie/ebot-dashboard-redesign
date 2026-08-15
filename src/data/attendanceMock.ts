export type AttendanceStatus = "Aguardando" | "Em atendimento humano" | "Resolvido pela IA" | "Encerrado";
export type AttendancePriority = "Alta" | "Média" | "Baixa";
export type AttendanceChannel = "WhatsApp" | "Instagram" | "E-mail" | "Telefone";
export type AttendanceSource = "IA" | "Humano" | "IA + humano";
export type AttendanceUnit = "Unidade Centro" | "Unidade Norte" | "Unidade Sul";

export type AttendanceMessage = {
  id: string;
  from: "patient" | "ai" | "human" | "me";
  text: string;
  time: string;
};

export type Attendance = {
  id: string;
  patientName: string;
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
export const attendanceUnits: AttendanceUnit[] = ["Unidade Centro", "Unidade Norte", "Unidade Sul"];
export const attendanceResponsibles = ["IA", "Marina Costa", "Julia Alves", "Dr. Ruan", "Dra. Fernanda"];

export const attendances: Attendance[] = [
  {
    id: "AT-1101",
    patientName: "Maria Oliveira",
    phone: "+55 11 98741-1122",
    channel: "WhatsApp",
    status: "Aguardando",
    priority: "Alta",
    responsible: "IA",
    source: "IA",
    unit: "Unidade Centro",
    sector: "Recepção",
    queue: "Confirmação de consulta",
    lastMessage: "Gostaria de confirmar minha consulta de amanhã, se possível.",
    time: "09:58",
    unread: 2,
    startedAt: "09:54",
    duration: "04 min",
    messages: [
      { id: "m1", from: "patient", text: "Bom dia! Gostaria de confirmar minha consulta de amanhã, se possível.", time: "09:54" },
      { id: "m2", from: "ai", text: "Bom dia, Maria! Aqui é o assistente do É-Bot. Verifiquei aqui: sua consulta está agendada com a Dra. Camila Duarte, às 14h30 na Unidade Centro. Posso confirmar?", time: "09:55" },
      { id: "m3", from: "patient", text: "Pode sim! E preciso levar algum exame?", time: "09:57" },
      { id: "m4", from: "ai", text: "Consulta confirmada para amanhã, 14h30, com a Dra. Camila Duarte. Para a sua avaliação dermatológica, traga os exames de sangue solicitados na última consulta. Precisa de ajuda com o endereço?", time: "09:58" }
    ]
  },
  {
    id: "AT-1100",
    patientName: "Carlos Eduardo Santos",
    phone: "+55 11 98812-4410",
    channel: "WhatsApp",
    status: "Em atendimento humano",
    priority: "Alta",
    responsible: "Marina Costa",
    source: "IA + humano",
    unit: "Unidade Centro",
    sector: "Cardiologia",
    queue: "Resultados",
    lastMessage: "O resultado do ecocardiograma foi liberado para o Dr. Ricardo avaliar.",
    time: "09:52",
    unread: 1,
    startedAt: "09:31",
    duration: "21 min",
    messages: [
      { id: "m1", from: "patient", text: "Olá, queria saber se o resultado do meu ecocardiograma já saiu.", time: "09:28" },
      { id: "m2", from: "ai", text: "Olá, Carlos! O resultado ainda está em análise com o Dr. Ricardo Lima. Vou avisar o setor de cardiologia para agilizar, ok?", time: "09:29" },
      { id: "m3", from: "human", text: "Carlos, bom dia! Aqui é a Marina, da recepção. O Dr. Ricardo acabou de liberar o resultado. Vou te encaminhar o resumo por aqui em instantes.", time: "09:50" },
      { id: "m4", from: "patient", text: "Perfeito, Marina. Muito obrigado!", time: "09:52" }
    ]
  },
  {
    id: "AT-1098",
    patientName: "Fernanda Lima",
    phone: "+55 11 99320-7781",
    channel: "Instagram",
    status: "Aguardando",
    priority: "Média",
    responsible: "IA",
    source: "IA",
    unit: "Unidade Norte",
    sector: "Recepção",
    queue: "Convênios",
    lastMessage: "Vocês atendem pelo plano Amil? Preciso de um retorno de dermatologia.",
    time: "09:44",
    unread: 0,
    startedAt: "09:41",
    duration: "03 min",
    messages: [
      { id: "m1", from: "patient", text: "Oi! Vocês atendem pelo plano Amil? Preciso de um retorno de dermatologia.", time: "09:41" },
      { id: "m2", from: "ai", text: "Oi, Fernanda! Atendemos sim pelo Amil em todas as unidades. Para retorno com dermatologia, tenho disponibilidade para quinta-feira à tarde na Unidade Norte. Posso verificar com a recepção?", time: "09:43" },
      { id: "m3", from: "patient", text: "Quinta-feira à tarde funciona. Qual horário?", time: "09:44" }
    ]
  },
  {
    id: "AT-1096",
    patientName: "José Ricardo Alves",
    phone: "+55 11 98577-0934",
    channel: "Telefone",
    status: "Em atendimento humano",
    priority: "Média",
    responsible: "Julia Alves",
    source: "Humano",
    unit: "Unidade Sul",
    sector: "Ortopedia",
    queue: "Reagendamento",
    lastMessage: "Aguarde um instante, Sr. José, vou confirmar o novo horário com o Dr. André.",
    time: "09:38",
    unread: 0,
    startedAt: "09:22",
    duration: "16 min",
    messages: [
      { id: "m1", from: "patient", text: "Preciso remarcar minha consulta de ortopedia, o exame atrasou.", time: "09:22" },
      { id: "m2", from: "human", text: "Entendi, Sr. José. Sua consulta estava marcada para hoje, 11h, com o Dr. André Martins. Vou verificar as próximas disponibilidades.", time: "09:24" },
      { id: "m3", from: "human", text: "Aguarde um instante, Sr. José, vou confirmar o novo horário com o Dr. André.", time: "09:38" }
    ]
  },
  {
    id: "AT-1094",
    patientName: "Patrícia Gomes",
    phone: "+55 11 98214-3356",
    channel: "E-mail",
    status: "Aguardando",
    priority: "Baixa",
    responsible: "IA",
    source: "IA",
    unit: "Unidade Centro",
    sector: "Exames",
    queue: "Documentos",
    lastMessage: "Preciso de uma via do laudo do exame de maio para encaminhar ao convênio.",
    time: "09:31",
    unread: 1,
    startedAt: "09:18",
    duration: "13 min",
    messages: [
      { id: "m1", from: "patient", text: "Olá, preciso de uma via do laudo do meu exame de maio para encaminhar ao convênio.", time: "09:18" },
      { id: "m2", from: "ai", text: "Olá, Patrícia! O laudo do exame de 12 de maio está disponível no portal do paciente. Posso enviar uma cópia em PDF por e-mail?", time: "09:20" },
      { id: "m3", from: "patient", text: "Sim, por favor. Obrigada!", time: "09:31" }
    ]
  },
  {
    id: "AT-1091",
    patientName: "Rafael Monteiro",
    phone: "+55 11 99012-8873",
    channel: "WhatsApp",
    status: "Resolvido pela IA",
    priority: "Baixa",
    responsible: "IA",
    source: "IA",
    unit: "Unidade Norte",
    sector: "Recepção",
    queue: "Informações",
    lastMessage: "Perfeito, obrigado pelas informações!",
    time: "09:12",
    unread: 0,
    startedAt: "09:02",
    duration: "10 min",
    messages: [
      { id: "m1", from: "patient", text: "Até que horas a Unidade Norte funciona aos sábados?", time: "09:02" },
      { id: "m2", from: "ai", text: "A Unidade Norte funciona aos sábados das 8h às 12h, com emergências até as 14h. Posso ajudar com mais alguma coisa?", time: "09:03" },
      { id: "m3", from: "patient", text: "Perfeito, obrigado pelas informações!", time: "09:12" }
    ]
  },
  {
    id: "AT-1089",
    patientName: "Amanda Souza",
    phone: "+55 11 99674-2208",
    channel: "WhatsApp",
    status: "Aguardando",
    priority: "Alta",
    responsible: "IA",
    source: "IA",
    unit: "Unidade Centro",
    sector: "Recepção",
    queue: "Primeiro contato",
    lastMessage: "Quero marcar minha primeira consulta com a Dra. Fernanda, tem vaga ainda hoje?",
    time: "09:05",
    unread: 3,
    startedAt: "08:58",
    duration: "07 min",
    messages: [
      { id: "m1", from: "patient", text: "Oi! Quero marcar minha primeira consulta com a Dra. Fernanda, tem vaga ainda hoje?", time: "08:58" },
      { id: "m2", from: "ai", text: "Oi, Amanda! Que bom ter você aqui. Tenho disponibilidade com a Dra. Fernanda hoje às 16h ou amanhã às 9h30. Qual prefere?", time: "08:59" },
      { id: "m3", from: "patient", text: "Hoje às 16h fica perfeito!", time: "09:02" },
      { id: "m4", from: "ai", text: "Sua primeira consulta está pré-agendada para hoje, 16h, na Unidade Centro. Para confirmar, preciso de um retorno seu: você tem convênio ou será particular?", time: "09:04" },
      { id: "m5", from: "patient", text: "Vou ser particular mesmo.", time: "09:05" }
    ]
  },
  {
    id: "AT-1086",
    patientName: "Beatriz Ferreira",
    phone: "+55 11 98455-6619",
    channel: "WhatsApp",
    status: "Em atendimento humano",
    priority: "Alta",
    responsible: "Marina Costa",
    source: "IA + humano",
    unit: "Unidade Norte",
    sector: "Recepção",
    queue: "Atraso",
    lastMessage: "Você tem razão, Beatriz. Vou priorizar seu encaixe assim que o Dr. Paulo liberar.",
    time: "08:52",
    unread: 2,
    startedAt: "08:20",
    duration: "32 min",
    messages: [
      { id: "m1", from: "patient", text: "Estou aguardando há 40 minutos e ainda não fui chamada. Minha consulta era às 8h.", time: "08:20" },
      { id: "m2", from: "ai", text: "Sinto muito pelo atraso, Beatriz. O Dr. Paulo teve uma intercorrência de emergência. Já sinalizei para a recepção acompanhar o seu caso com prioridade.", time: "08:21" },
      { id: "m3", from: "human", text: "Beatriz, aqui é a Marina. Já alinhei com o Dr. Paulo, ele vai te receber assim que terminar o atendimento em andamento. Pode ser em uns 15 minutos?", time: "08:40" },
      { id: "m4", from: "patient", text: "Consigo esperar mais 15 minutos, mas preciso sair às 9h15 para o trabalho.", time: "08:50" },
      { id: "m5", from: "human", text: "Você tem razão, Beatriz. Vou priorizar seu encaixe assim que o Dr. Paulo liberar.", time: "08:52" }
    ]
  },
  {
    id: "AT-1083",
    patientName: "Lucas Pereira",
    phone: "+55 11 99183-4477",
    channel: "WhatsApp",
    status: "Resolvido pela IA",
    priority: "Média",
    responsible: "IA",
    source: "IA",
    unit: "Unidade Sul",
    sector: "Exames",
    queue: "Documentos",
    lastMessage: "Recebi o documento, muito obrigado!",
    time: "08:44",
    unread: 0,
    startedAt: "08:36",
    duration: "08 min",
    messages: [
      { id: "m1", from: "patient", text: "Pode me enviar o pedido médico que ficou no sistema?", time: "08:36" },
      { id: "m2", from: "ai", text: "Claro, Lucas! O pedido médico foi enviado no formato PDF para o seu e-mail cadastrado.", time: "08:37" },
      { id: "m3", from: "patient", text: "Recebi o documento, muito obrigado!", time: "08:44" }
    ]
  },
  {
    id: "AT-1080",
    patientName: "Camila Rodrigues",
    phone: "+55 11 98703-2254",
    channel: "Instagram",
    status: "Aguardando",
    priority: "Média",
    responsible: "IA",
    source: "IA",
    unit: "Unidade Centro",
    sector: "Recepção",
    queue: "Valores",
    lastMessage: "Qual o valor da consulta particular com a Dra. Fernanda?",
    time: "08:33",
    unread: 0,
    startedAt: "08:29",
    duration: "04 min",
    messages: [
      { id: "m1", from: "patient", text: "Qual o valor da consulta particular com a Dra. Fernanda?", time: "08:29" },
      { id: "m2", from: "ai", text: "A consulta particular com a Dra. Fernanda Rocha custa R$ 380,00, com possibilidade de parcelamento. Gostaria que eu reservasse um horário?", time: "08:31" },
      { id: "m3", from: "patient", text: "Vou confirmar e te aviso, obrigada!", time: "08:33" }
    ]
  },
  {
    id: "AT-1077",
    patientName: "Henrique Barros",
    phone: "+55 11 98641-9902",
    channel: "E-mail",
    status: "Em atendimento humano",
    priority: "Baixa",
    responsible: "Julia Alves",
    source: "Humano",
    unit: "Unidade Norte",
    sector: "Recepção",
    queue: "Convênios",
    lastMessage: "Encaminhei a tabela de credenciados para seu e-mail, Henrique.",
    time: "08:19",
    unread: 0,
    startedAt: "08:02",
    duration: "17 min",
    dateOffset: -1,
    messages: [
      { id: "m1", from: "patient", text: "Prezados, gostaria de saber se o plano SulAmérica é aceito para fisioterapia.", time: "08:02" },
      { id: "m2", from: "human", text: "Olá, Henrique! O SulAmérica é aceito para fisioterapia na Unidade Norte. Vou enviar a tabela de procedimentos credenciados para você.", time: "08:12" },
      { id: "m3", from: "human", text: "Encaminhei a tabela de credenciados para seu e-mail, Henrique.", time: "08:19" }
    ]
  },
  {
    id: "AT-1074",
    patientName: "Juliana Martins",
    phone: "+55 11 98912-8830",
    channel: "WhatsApp",
    status: "Aguardando",
    priority: "Alta",
    responsible: "IA + humano",
    source: "IA + humano",
    unit: "Unidade Centro",
    sector: "Cardiologia",
    queue: "Pós-cirurgia",
    lastMessage: "Dr. Ricardo pediu retorno em 10 dias. Pode me agendar o mais cedo possível?",
    time: "08:07",
    unread: 1,
    startedAt: "07:58",
    duration: "09 min",
    dateOffset: -2,
    messages: [
      { id: "m1", from: "patient", text: "Fiz uma cirurgia há 3 semanas e o Dr. Ricardo pediu retorno em 10 dias. Pode me agendar o mais cedo possível?", time: "07:58" },
      { id: "m2", from: "ai", text: "Oi, Juliana! Que bom saber que você está se recuperando. Vou verificar os retornos do Dr. Ricardo para esta semana.", time: "08:00" },
      { id: "m3", from: "human", text: "Juliana, encontrei uma vaga de retorno para sexta-feira, 10h. Quer que eu confirme? A equipe de cardiologia pediu prioridade para o seu caso.", time: "08:06" },
      { id: "m4", from: "patient", text: "Sexta às 10h está ótimo. Confirmo!", time: "08:07" }
    ]
  }
];
