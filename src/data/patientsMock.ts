export type PatientStatus = "Ativo" | "Novo" | "Inativo";

export type PatientHistoryItem = {
  id: string;
  type: "Consulta" | "Atendimento" | "Protocolo" | "Interação com IA";
  title: string;
  date: string;
  detail?: string;
};

export type PatientNextEvent = {
  id: string;
  kind: "consulta" | "retorno" | "tarefa";
  title: string;
  date: string;
};

export type Patient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
  birthDate: string;
  gender: "Feminino" | "Masculino";
  tags: string[];
  professional: string;
  unit: string;
  status: PatientStatus;
  lastAppointment: string;
  nextAppointment: string;
  notes?: string;
  history: PatientHistoryItem[];
  nextEvents: PatientNextEvent[];
};

export const patients: Patient[] = [
  {
    id: "PAC-0184",
    name: "Maria Oliveira",
    phone: "+55 11 98741-1122",
    email: "maria.oliveira@email.com",
    cpf: "412.587.963-00",
    birthDate: "12/03/1988",
    gender: "Feminino",
    tags: ["Dermatologia", "Convênio Amil"],
    professional: "Dra. Camila Duarte",
    unit: "Unidade Centro",
    status: "Ativo",
    lastAppointment: "22 jul 2026",
    nextAppointment: "Amanhã, 14:30",
    notes: "Acompanhamento dermatológico semestral. Alergia a dipirona registrada.",
    history: [
      { id: "h1", type: "Consulta", title: "Consulta com Dra. Camila Duarte", date: "22 jul 2026", detail: "Avaliação de manchas na pele; encaminhada para exames de sangue." },
      { id: "h2", type: "Interação com IA", title: "Confirmação de consulta", date: "06 ago 2026", detail: "Confirmou consulta de retorno via WhatsApp em 14h30." },
      { id: "h3", type: "Atendimento", title: "Pedido de informações sobre exames", date: "18 jul 2026", detail: "Dúvida sobre preparo para exames de sangue." },
      { id: "h4", type: "Protocolo", title: "Protocolo PR-2024-0841 · Retorno", date: "14 jul 2026", detail: "Protocolo de retorno concluído pela recepção." },
      { id: "h5", type: "Consulta", title: "Primeira consulta com Dra. Camila Duarte", date: "12 jul 2026", detail: "Anamnese inicial e prescrição de hidratante tópico." }
    ],
    nextEvents: [
      { id: "e1", kind: "consulta", title: "Consulta · Dra. Camila Duarte", date: "Amanhã, 14:30" },
      { id: "e2", kind: "tarefa", title: "Enviar lembrete de consulta", date: "Hoje, 17:00" }
    ]
  },
  {
    id: "PAC-0176",
    name: "Carlos Eduardo Santos",
    phone: "+55 11 98812-4410",
    email: "carlos.santos@email.com",
    cpf: "398.214.765-18",
    birthDate: "03/11/1975",
    gender: "Masculino",
    tags: ["Cardiologia", "Pós-cirurgia"],
    professional: "Dr. Ricardo Lima",
    unit: "Unidade Centro",
    status: "Ativo",
    lastAppointment: "28 jul 2026",
    nextAppointment: "Hoje, 14:00",
    notes: "Pós-operatório de revascularização. Acompanhamento mensal com Dr. Ricardo.",
    history: [
      { id: "h1", type: "Consulta", title: "Retorno com Dr. Ricardo Lima", date: "28 jul 2026", detail: "Avaliação pós-cirúrgica; solicitado ecocardiograma de controle." },
      { id: "h2", type: "Protocolo", title: "Ecocardiograma de controle", date: "02 ago 2026", detail: "Exame realizado na Unidade Centro; laudo liberado em 06/08." },
      { id: "h3", type: "Atendimento", title: "Resultado de ecocardiograma", date: "Hoje, 09:50", detail: "Resultado liberado e encaminhado pela recepção." },
      { id: "h4", type: "Protocolo", title: "Protocolo PR-2026-0110 · Resultados", date: "06 ago 2026", detail: "Protocolo de resultados em andamento com cardiologia." },
      { id: "h5", type: "Consulta", title: "Cirurgia de revascularização", date: "12 jun 2026", detail: "Procedimento realizado na Unidade Centro." }
    ],
    nextEvents: [
      { id: "e1", kind: "retorno", title: "Retorno · Dr. Ricardo Lima", date: "Hoje, 14:00" },
      { id: "e2", kind: "tarefa", title: "Agendar nova teleconsulta de controle", date: "Próxima semana" }
    ]
  },
  {
    id: "PAC-0171",
    name: "Amanda Souza",
    phone: "+55 11 99674-2208",
    email: "amanda.souza@email.com",
    cpf: "529.874.331-47",
    birthDate: "25/07/1992",
    gender: "Feminino",
    tags: ["Clínica Geral", "Particular", "Novo paciente"],
    professional: "Dra. Fernanda Rocha",
    unit: "Unidade Centro",
    status: "Novo",
    lastAppointment: "—",
    nextAppointment: "Hoje, 16:00",
    notes: "Primeiro contato via WhatsApp. Pré-agendamento feito pela IA, aguardando confirmação do convênio.",
    history: [
      { id: "h1", type: "Atendimento", title: "Primeiro contato · WhatsApp", date: "Hoje, 08:58", detail: "IA realizou pré-agendamento da primeira consulta." },
      { id: "h2", type: "Interação com IA", title: "Agendamento com Dra. Fernanda", date: "Hoje, 09:02", detail: "Escolheu horário das 16h na Unidade Centro." },
      { id: "h3", type: "Protocolo", title: "Protocolo PR-2026-0112 · Primeiro contato", date: "Hoje, 09:05", detail: "Protocolo de primeira consulta em andamento." }
    ],
    nextEvents: [
      { id: "e1", kind: "consulta", title: "Primeira consulta · Dra. Fernanda Rocha", date: "Hoje, 16:00" },
      { id: "e2", kind: "tarefa", title: "Confirmar dados de cadastro", date: "Hoje, 15:30" }
    ]
  },
  {
    id: "PAC-0163",
    name: "Beatriz Ferreira",
    phone: "+55 11 98455-6619",
    email: "beatriz.ferreira@email.com",
    cpf: "476.215.809-52",
    birthDate: "18/01/1984",
    gender: "Feminino",
    tags: ["Pediatria", "Mãe de paciente"],
    professional: "Dr. Paulo Nogueira",
    unit: "Unidade Norte",
    status: "Ativo",
    lastAppointment: "30 jul 2026",
    nextAppointment: "Hoje, 08:00",
    notes: "Responsável pelo acompanhamento pediátrico. Preferência de horários pela manhã.",
    history: [
      { id: "h1", type: "Consulta", title: "Consulta com Dr. Paulo Nogueira", date: "30 jul 2026", detail: "Acompanhamento pediátrico mensal." },
      { id: "h2", type: "Atendimento", title: "Reclamação de atraso", date: "Hoje, 08:20", detail: "IA registrou atraso; recepção priorizou encaixe." },
      { id: "h3", type: "Protocolo", title: "Protocolo PR-2026-0098 · Pós-consulta", date: "30 jul 2026", detail: "Protocolo de pós-consulta concluído." }
    ],
    nextEvents: [
      { id: "e1", kind: "consulta", title: "Consulta · Dr. Paulo Nogueira", date: "Hoje, 08:00" },
      { id: "e2", kind: "retorno", title: "Retorno de acompanhamento", date: "Qua, 12 ago" }
    ]
  },
  {
    id: "PAC-0158",
    name: "Fernanda Lima",
    phone: "+55 11 99320-7781",
    email: "fernanda.lima@email.com",
    cpf: "335.908.174-26",
    birthDate: "07/09/1990",
    gender: "Feminino",
    tags: ["Dermatologia", "Convênio Amil"],
    professional: "Dra. Camila Duarte",
    unit: "Unidade Norte",
    status: "Ativo",
    lastAppointment: "18 jul 2026",
    nextAppointment: "Hoje, 15:00",
    notes: "Retorno de dermatologia aguardando confirmação via Instagram.",
    history: [
      { id: "h1", type: "Consulta", title: "Consulta com Dra. Camila Duarte", date: "18 jul 2026", detail: "Avaliação de lesão pré-cancerígena; retorno solicitado." },
      { id: "h2", type: "Atendimento", title: "Dúvida sobre convênio Amil", date: "Hoje, 09:41", detail: "IA confirmou atendimento pelo plano para retorno." },
      { id: "h3", type: "Interação com IA", title: "Consulta de horário", date: "Hoje, 09:44", detail: "Solicitou quinta-feira à tarde; reservado 15h." }
    ],
    nextEvents: [
      { id: "e1", kind: "retorno", title: "Retorno · Dra. Camila Duarte", date: "Hoje, 15:00" }
    ]
  },
  {
    id: "PAC-0149",
    name: "João Victor Costa",
    phone: "+55 11 98900-2291",
    email: "joao.costa@email.com",
    cpf: "284.651.093-73",
    birthDate: "22/04/1995",
    gender: "Masculino",
    tags: ["Ortopedia", "Particular"],
    professional: "Dr. André Martins",
    unit: "Unidade Sul",
    status: "Ativo",
    lastAppointment: "14 jul 2026",
    nextAppointment: "Hoje, 09:00",
    notes: "Acompanhamento de lesão no joelho direito.",
    history: [
      { id: "h1", type: "Consulta", title: "Retorno com Dr. André Martins", date: "14 jul 2026", detail: "Avaliação da lesão; liberado para fortalecimento." },
      { id: "h2", type: "Interação com IA", title: "Envio de pedido médico", date: "Hoje, 08:41", detail: "Enviou pedido médico conforme orientação da recepção." },
      { id: "h3", type: "Protocolo", title: "Protocolo PR-2024-0817 · Primeiro contato", date: "12 jul 2026", detail: "Protocolo de ortopedia em andamento." }
    ],
    nextEvents: [
      { id: "e1", kind: "consulta", title: "Retorno · Dr. André Martins", date: "Hoje, 09:00" }
    ]
  },
  {
    id: "PAC-0141",
    name: "Marcos Silva",
    phone: "+55 11 99122-7703",
    email: "marcos.silva@email.com",
    cpf: "561.238.904-14",
    birthDate: "30/06/1970",
    gender: "Masculino",
    tags: ["Ortopedia", "Retorno"],
    professional: "Dr. André Martins",
    unit: "Unidade Sul",
    status: "Ativo",
    lastAppointment: "02 jul 2026",
    nextAppointment: "Hoje, 10:00",
    notes: "Deseja reagendar retorno para a próxima semana.",
    history: [
      { id: "h1", type: "Consulta", title: "Consulta com Dr. André Martins", date: "02 jul 2026", detail: "Tratamento conservador de hérnia lombar." },
      { id: "h2", type: "Atendimento", title: "Pedido de reagendamento", date: "Hoje, 09:36", detail: "Solicitou reagendar retorno; IA repassou à recepção." }
    ],
    nextEvents: [
      { id: "e1", kind: "consulta", title: "Consulta · Dr. André Martins", date: "Hoje, 10:00" },
      { id: "e2", kind: "tarefa", title: "Confirmar novo horário de retorno", date: "Hoje" }
    ]
  },
  {
    id: "PAC-0134",
    name: "Carolina Nunes",
    phone: "+55 11 99731-1802",
    email: "carolina.nunes@email.com",
    cpf: "448.791.236-90",
    birthDate: "14/02/1987",
    gender: "Feminino",
    tags: ["Dermatologia", "Exames"],
    professional: "Dra. Camila Duarte",
    unit: "Unidade Centro",
    status: "Ativo",
    lastAppointment: "06 ago 2026",
    nextAppointment: "—",
    notes: "Resultado disponibilizado no portal do paciente.",
    history: [
      { id: "h1", type: "Consulta", title: "Retorno com Dra. Camila Duarte", date: "Hoje, 08:15", detail: "Revisão de biópsia; resultado liberado." },
      { id: "h2", type: "Protocolo", title: "Protocolo PR-2024-0829 · Resultados", date: "13 jul 2026", detail: "Protocolo de resultados concluído." },
      { id: "h3", type: "Atendimento", title: "Resultado no portal", date: "Hoje, 08:55", detail: "Resultado disponibilizado por e-mail." }
    ],
    nextEvents: [
      { id: "e1", kind: "tarefa", title: "Retorno agendado para análise de biópsia", date: "Em 30 dias" }
    ]
  },
  {
    id: "PAC-0127",
    name: "Rafael Monteiro",
    phone: "+55 11 99012-8873",
    email: "rafael.monteiro@email.com",
    cpf: "390.562.718-35",
    birthDate: "09/12/1981",
    gender: "Masculino",
    tags: ["Clínica Geral", "WhatsApp"],
    professional: "Dra. Fernanda Rocha",
    unit: "Unidade Norte",
    status: "Ativo",
    lastAppointment: "25 jun 2026",
    nextAppointment: "Amanhã, 15:00",
    notes: "Paciente recorrente de clínica geral.",
    history: [
      { id: "h1", type: "Consulta", title: "Consulta com Dra. Fernanda Rocha", date: "25 jun 2026", detail: "Check-up anual sem alterações." },
      { id: "h2", type: "Interação com IA", title: "Dúvida sobre horários", date: "Hoje, 09:02", detail: "Perguntou sobre funcionamento aos sábados; resolvido pela IA." }
    ],
    nextEvents: [
      { id: "e1", kind: "consulta", title: "Consulta · Dra. Fernanda Rocha", date: "Amanhã, 15:00" }
    ]
  },
  {
    id: "PAC-0119",
    name: "José Ricardo Alves",
    phone: "+55 11 98577-0934",
    email: "jose.alves@email.com",
    cpf: "223.418.906-58",
    birthDate: "15/05/1963",
    gender: "Masculino",
    tags: ["Ortopedia", "Convênio SulAmérica"],
    professional: "Dr. André Martins",
    unit: "Unidade Sul",
    status: "Ativo",
    lastAppointment: "09 jul 2026",
    nextAppointment: "Aguardando reagendamento",
    notes: "Remarcação solicitada devido ao atraso de exame.",
    history: [
      { id: "h1", type: "Consulta", title: "Consulta com Dr. André Martins", date: "09 jul 2026", detail: "Avaliação de artrose no quadril." },
      { id: "h2", type: "Atendimento", title: "Reagendamento por telefone", date: "Hoje, 09:22", detail: "Recepção verificando novas disponibilidades." }
    ],
    nextEvents: [
      { id: "e1", kind: "retorno", title: "Retorno · Dr. André Martins", date: "A confirmar" }
    ]
  },
  {
    id: "PAC-0112",
    name: "Patrícia Gomes",
    phone: "+55 11 98214-3356",
    email: "patricia.gomes@email.com",
    cpf: "517.629.384-07",
    birthDate: "27/08/1978",
    gender: "Feminino",
    tags: ["Exames", "E-mail"],
    professional: "Dra. Fernanda Rocha",
    unit: "Unidade Centro",
    status: "Ativo",
    lastAppointment: "12 mai 2026",
    nextAppointment: "—",
    notes: "Solicitou via de laudo para o convênio.",
    history: [
      { id: "h1", type: "Consulta", title: "Consulta com Dra. Fernanda Rocha", date: "12 mai 2026", detail: "Solicitados exames de rotina." },
      { id: "h2", type: "Atendimento", title: "Pedido de laudo", date: "Hoje, 09:18", detail: "IA verificou disponibilidade do laudo no portal." }
    ],
    nextEvents: []
  },
  {
    id: "PAC-0105",
    name: "Juliana Martins",
    phone: "+55 11 98912-8830",
    email: "juliana.martins@email.com",
    cpf: "271.384.596-29",
    birthDate: "19/10/1991",
    gender: "Feminino",
    tags: ["Cardiologia", "Pós-cirurgia", "Prioridade"],
    professional: "Dr. Ricardo Lima",
    unit: "Unidade Centro",
    status: "Ativo",
    lastAppointment: "16 jul 2026",
    nextAppointment: "Amanhã, 10:00",
    notes: "Pós-cirúrgico com prioridade de retorno conforme orientação médica.",
    history: [
      { id: "h1", type: "Consulta", title: "Pós-cirurgia · Dr. Ricardo Lima", date: "16 jul 2026", detail: "Retorno em 10 dias solicitado pelo médico." },
      { id: "h2", type: "Atendimento", title: "Agendamento prioritário", date: "Hoje, 07:58", detail: "IA e recepção encontraram vaga para sexta-feira, 10h." }
    ],
    nextEvents: [
      { id: "e1", kind: "retorno", title: "Retorno · Dr. Ricardo Lima", date: "Amanhã, 10:00" }
    ]
  }
];
