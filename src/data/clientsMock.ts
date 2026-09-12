export type ClientStatus = "Ativo" | "Novo" | "Inativo";

export type ClientHistoryItem = {
  id: string;
  type: "Agendamento" | "Atendimento" | "Protocolo" | "Interação com IA";
  title: string;
  date: string;
  detail?: string;
};

export type ClientNextEvent = {
  id: string;
  kind: "agendamento" | "retorno" | "tarefa";
  title: string;
  date: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
  birthDate: string;
  gender: "Feminino" | "Masculino";
  tags: string[];
  agent: string;
  unit: string;
  status: ClientStatus;
  lastAppointment: string;
  nextAppointment: string;
  notes?: string;
  history: ClientHistoryItem[];
  nextEvents: ClientNextEvent[];
};

export const clients: Client[] = [
  {
    id: "CLI-0184",
    name: "Maria Oliveira",
    phone: "+55 11 98741-1122",
    email: "maria.oliveira@email.com",
    cpf: "412.587.963-00",
    birthDate: "12/03/1988",
    gender: "Feminino",
    tags: ["VIP", "Varejo"],
    agent: "Camila Duarte",
    unit: "Filial Centro",
    status: "Ativo",
    lastAppointment: "22 jul 2026",
    nextAppointment: "Amanhã, 14:30",
    notes: "Cliente recorrente de revisão preventiva. Prefere confirmações pelo WhatsApp.",
    history: [
      { id: "h1", type: "Agendamento", title: "Revisão preventiva com Camila Duarte", date: "22 jul 2026", detail: "Orçamento aprovado para revisão completa; peças encomendadas." },
      { id: "h2", type: "Interação com IA", title: "Confirmação de agendamento", date: "06 ago 2026", detail: "Confirmou agendamento de retorno via WhatsApp em 14h30." },
      { id: "h3", type: "Atendimento", title: "Dúvida sobre documentos", date: "18 jul 2026", detail: "IA esclareceu quais documentos levar para a revisão." },
      { id: "h4", type: "Protocolo", title: "Protocolo PR-2026-0841 · Retorno", date: "14 jul 2026", detail: "Protocolo de retorno concluído pelo atendimento." },
      { id: "h5", type: "Agendamento", title: "Primeiro atendimento com Camila Duarte", date: "12 jul 2026", detail: "Avaliação inicial e plano de manutenção semestral." }
    ],
    nextEvents: [
      { id: "e1", kind: "agendamento", title: "Agendamento · Camila Duarte", date: "Amanhã, 14:30" },
      { id: "e2", kind: "tarefa", title: "Enviar lembrete de agendamento", date: "Hoje, 17:00" }
    ]
  },
  {
    id: "CLI-0176",
    name: "Carlos Eduardo Santos",
    phone: "+55 11 98812-4410",
    email: "carlos.santos@email.com",
    cpf: "398.214.765-18",
    birthDate: "03/11/1975",
    gender: "Masculino",
    tags: ["Frota", "Pós-venda"],
    agent: "Ricardo Lima",
    unit: "Filial Centro",
    status: "Ativo",
    lastAppointment: "28 jul 2026",
    nextAppointment: "Hoje, 14:00",
    notes: "Gestor de frota com contrato mensal. Acompanhamento de pedidos com o Ricardo.",
    history: [
      { id: "h1", type: "Agendamento", title: "Retorno com Ricardo Lima", date: "28 jul 2026", detail: "Avaliação do contrato de manutenção; peças solicitadas." },
      { id: "h2", type: "Protocolo", title: "Pedido de peças em andamento", date: "02 ago 2026", detail: "Pedido realizado na Filial Centro; rastreio atualizado em 06/08." },
      { id: "h3", type: "Atendimento", title: "Status do pedido de peças", date: "Hoje, 09:50", detail: "Peças chegaram e instalação liberada pelo atendimento." },
      { id: "h4", type: "Protocolo", title: "Protocolo PR-2026-0110 · Pedidos", date: "06 ago 2026", detail: "Protocolo de pedidos em andamento com o time comercial." },
      { id: "h5", type: "Agendamento", title: "Assinatura do contrato de frota", date: "12 jun 2026", detail: "Contrato firmado na Filial Centro." }
    ],
    nextEvents: [
      { id: "e1", kind: "retorno", title: "Retorno · Ricardo Lima", date: "Hoje, 14:00" },
      { id: "e2", kind: "tarefa", title: "Agendar instalação das peças", date: "Hoje" }
    ]
  },
  {
    id: "CLI-0171",
    name: "Amanda Souza",
    phone: "+55 11 99674-2208",
    email: "amanda.souza@email.com",
    cpf: "529.874.331-47",
    birthDate: "25/07/1992",
    gender: "Feminino",
    tags: ["Novo cliente", "Particular"],
    agent: "Fernanda Rocha",
    unit: "Filial Centro",
    status: "Novo",
    lastAppointment: "—",
    nextAppointment: "Hoje, 16:00",
    notes: "Primeiro contato via WhatsApp. Pré-agendamento feito pela IA, aguardando confirmação do orçamento.",
    history: [
      { id: "h1", type: "Atendimento", title: "Primeiro contato · WhatsApp", date: "Hoje, 08:58", detail: "IA realizou pré-agendamento da primeira avaliação." },
      { id: "h2", type: "Interação com IA", title: "Agendamento com Fernanda", date: "Hoje, 09:02", detail: "Escolheu horário das 16h na Filial Centro." },
      { id: "h3", type: "Protocolo", title: "Protocolo PR-2026-0112 · Primeiro contato", date: "Hoje, 09:05", detail: "Protocolo de primeira avaliação em andamento." }
    ],
    nextEvents: [
      { id: "e1", kind: "agendamento", title: "Primeira avaliação · Fernanda Rocha", date: "Hoje, 16:00" },
      { id: "e2", kind: "tarefa", title: "Confirmar dados de cadastro", date: "Hoje, 15:30" }
    ]
  },
  {
    id: "CLI-0163",
    name: "Beatriz Ferreira",
    phone: "+55 11 98455-6619",
    email: "beatriz.ferreira@email.com",
    cpf: "476.215.809-52",
    birthDate: "18/01/1984",
    gender: "Feminino",
    tags: ["VIP", "Suporte"],
    agent: "Paulo Nogueira",
    unit: "Filial Norte",
    status: "Ativo",
    lastAppointment: "30 jul 2026",
    nextAppointment: "Hoje, 08:00",
    notes: "Prefere atendimentos pela manhã. Histórico de solicitação de prioridade.",
    history: [
      { id: "h1", type: "Agendamento", title: "Agendamento com Paulo Nogueira", date: "30 jul 2026", detail: "Manutenção preventiva mensal do veículo." },
      { id: "h2", type: "Atendimento", title: "Registro de atraso na fila", date: "Hoje, 08:20", detail: "IA registrou atraso; atendimento priorizou o caso." },
      { id: "h3", type: "Protocolo", title: "Protocolo PR-2026-0098 · Pós-atendimento", date: "30 jul 2026", detail: "Protocolo de pós-atendimento concluído." }
    ],
    nextEvents: [
      { id: "e1", kind: "agendamento", title: "Agendamento · Paulo Nogueira", date: "Hoje, 08:00" },
      { id: "e2", kind: "retorno", title: "Retorno de acompanhamento", date: "Qua, 12 ago" }
    ]
  },
  {
    id: "CLI-0158",
    name: "Fernanda Lima",
    phone: "+55 11 99320-7781",
    email: "fernanda.lima@email.com",
    cpf: "335.908.174-26",
    birthDate: "07/09/1990",
    gender: "Feminino",
    tags: ["Corporativo", "Parcerias"],
    agent: "Camila Duarte",
    unit: "Filial Norte",
    status: "Ativo",
    lastAppointment: "18 jul 2026",
    nextAppointment: "Hoje, 15:00",
    notes: "Interessada em contrato de frota corporativa; retorno via Instagram.",
    history: [
      { id: "h1", type: "Agendamento", title: "Reunião com Camila Duarte", date: "18 jul 2026", detail: "Apresentação das condições para frotas corporativas." },
      { id: "h2", type: "Atendimento", title: "Dúvida sobre contrato corporativo", date: "Hoje, 09:41", detail: "IA confirmou condições e disponibilidade para retorno." },
      { id: "h3", type: "Interação com IA", title: "Agendamento de horário", date: "Hoje, 09:44", detail: "Solicitou quinta-feira à tarde; reservado 15h." }
    ],
    nextEvents: [
      { id: "e1", kind: "retorno", title: "Retorno · Camila Duarte", date: "Hoje, 15:00" }
    ]
  },
  {
    id: "CLI-0149",
    name: "João Victor Costa",
    phone: "+55 11 98900-2291",
    email: "joao.costa@email.com",
    cpf: "284.651.093-73",
    birthDate: "22/04/1995",
    gender: "Masculino",
    tags: ["Corporativo", "Particular"],
    agent: "André Martins",
    unit: "Filial Sul",
    status: "Ativo",
    lastAppointment: "14 jul 2026",
    nextAppointment: "Hoje, 09:00",
    notes: "Cliente corporativo com veículo utilitário. Prefere atendimento na parte da manhã.",
    history: [
      { id: "h1", type: "Agendamento", title: "Retorno com André Martins", date: "14 jul 2026", detail: "Avaliação do câmbio; liberado para teste em rodagem." },
      { id: "h2", type: "Interação com IA", title: "Envio de manual", date: "Hoje, 08:41", detail: "Enviou o manual do veículo conforme orientação do atendimento." },
      { id: "h3", type: "Protocolo", title: "Protocolo PR-2026-0817 · Avaliação", date: "12 jul 2026", detail: "Protocolo de avaliação concluído." }
    ],
    nextEvents: [
      { id: "e1", kind: "agendamento", title: "Retorno · André Martins", date: "Hoje, 09:00" }
    ]
  },
  {
    id: "CLI-0141",
    name: "Marcos Silva",
    phone: "+55 11 99122-7703",
    email: "marcos.silva@email.com",
    cpf: "561.238.904-14",
    birthDate: "30/06/1970",
    gender: "Masculino",
    tags: ["Corporativo", "Retorno"],
    agent: "André Martins",
    unit: "Filial Sul",
    status: "Ativo",
    lastAppointment: "02 jul 2026",
    nextAppointment: "Hoje, 10:00",
    notes: "Deseja reagendar retorno para a próxima semana.",
    history: [
      { id: "h1", type: "Agendamento", title: "Agendamento com André Martins", date: "02 jul 2026", detail: "Manutenção corretiva concluída." },
      { id: "h2", type: "Atendimento", title: "Pedido de reagendamento", date: "Hoje, 09:36", detail: "Solicitou reagendar retorno; IA repassou ao atendimento." }
    ],
    nextEvents: [
      { id: "e1", kind: "agendamento", title: "Agendamento · André Martins", date: "Hoje, 10:00" },
      { id: "e2", kind: "tarefa", title: "Confirmar novo horário de retorno", date: "Hoje" }
    ]
  },
  {
    id: "CLI-0134",
    name: "Carolina Nunes",
    phone: "+55 11 99731-1802",
    email: "carolina.nunes@email.com",
    cpf: "448.791.236-90",
    birthDate: "14/02/1987",
    gender: "Feminino",
    tags: ["Varejo", "Pedidos"],
    agent: "Camila Duarte",
    unit: "Filial Centro",
    status: "Ativo",
    lastAppointment: "06 ago 2026",
    nextAppointment: "—",
    notes: "Orçamento aprovado disponibilizado no portal do cliente.",
    history: [
      { id: "h1", type: "Agendamento", title: "Avaliação com Camila Duarte", date: "Hoje, 08:15", detail: "Orçamento de peças aprovado e enviado." },
      { id: "h2", type: "Protocolo", title: "Protocolo PR-2026-0829 · Orçamento", date: "13 jul 2026", detail: "Protocolo de orçamento concluído." },
      { id: "h3", type: "Atendimento", title: "Envio de orçamento", date: "Hoje, 08:55", detail: "Orçamento disponibilizado por e-mail." }
    ],
    nextEvents: [
      { id: "e1", kind: "tarefa", title: "Follow-up do orçamento aprovado", date: "Em 2 dias" }
    ]
  },
  {
    id: "CLI-0127",
    name: "Rafael Monteiro",
    phone: "+55 11 99012-8873",
    email: "rafael.monteiro@email.com",
    cpf: "390.562.718-35",
    birthDate: "09/12/1981",
    gender: "Masculino",
    tags: ["Varejo", "WhatsApp"],
    agent: "Fernanda Rocha",
    unit: "Filial Norte",
    status: "Ativo",
    lastAppointment: "25 jun 2026",
    nextAppointment: "Amanhã, 15:00",
    notes: "Cliente recorrente de revisão preventiva.",
    history: [
      { id: "h1", type: "Agendamento", title: "Revisão com Fernanda Rocha", date: "25 jun 2026", detail: "Revisão anual aprovada sem pendências." },
      { id: "h2", type: "Interação com IA", title: "Dúvida sobre horários", date: "Hoje, 09:02", detail: "Perguntou sobre funcionamento aos sábados; resolvido pela IA." }
    ],
    nextEvents: [
      { id: "e1", kind: "agendamento", title: "Revisão · Fernanda Rocha", date: "Amanhã, 15:00" }
    ]
  },
  {
    id: "CLI-0119",
    name: "José Ricardo Alves",
    phone: "+55 11 98577-0934",
    email: "jose.alves@email.com",
    cpf: "223.418.906-58",
    birthDate: "15/05/1963",
    gender: "Masculino",
    tags: ["Corporativo", "Atacado"],
    agent: "André Martins",
    unit: "Filial Sul",
    status: "Ativo",
    lastAppointment: "09 jul 2026",
    nextAppointment: "Aguardando reagendamento",
    notes: "Remarcação solicitada devido ao atraso de pedido.",
    history: [
      { id: "h1", type: "Agendamento", title: "Instalação com André Martins", date: "09 jul 2026", detail: "Instalação de acessórios solicitada por contrato." },
      { id: "h2", type: "Atendimento", title: "Reagendamento por telefone", date: "Hoje, 09:22", detail: "Atendimento verificando novas disponibilidades." }
    ],
    nextEvents: [
      { id: "e1", kind: "retorno", title: "Instalação · André Martins", date: "A confirmar" }
    ]
  },
  {
    id: "CLI-0112",
    name: "Patrícia Gomes",
    phone: "+55 11 98214-3356",
    email: "patricia.gomes@email.com",
    cpf: "517.629.384-07",
    birthDate: "27/08/1978",
    gender: "Feminino",
    tags: ["Financeiro", "E-mail"],
    agent: "Fernanda Rocha",
    unit: "Filial Centro",
    status: "Ativo",
    lastAppointment: "12 mai 2026",
    nextAppointment: "—",
    notes: "Solicitou via da nota fiscal para o financeiro.",
    history: [
      { id: "h1", type: "Agendamento", title: "Serviço com Fernanda Rocha", date: "12 mai 2026", detail: "Serviço de manutenção contratado." },
      { id: "h2", type: "Atendimento", title: "Pedido de nota fiscal", date: "Hoje, 09:18", detail: "IA verificou disponibilidade do documento no portal." }
    ],
    nextEvents: []
  },
  {
    id: "CLI-0105",
    name: "Juliana Martins",
    phone: "+55 11 98912-8830",
    email: "juliana.martins@email.com",
    cpf: "271.384.596-29",
    birthDate: "19/10/1991",
    gender: "Feminino",
    tags: ["Frota", "Pós-venda", "Prioridade"],
    agent: "Ricardo Lima",
    unit: "Filial Centro",
    status: "Ativo",
    lastAppointment: "16 jul 2026",
    nextAppointment: "Amanhã, 10:00",
    notes: "Retorno de garantia com prioridade conforme orientação do pós-venda.",
    history: [
      { id: "h1", type: "Agendamento", title: "Instalação · Ricardo Lima", date: "16 jul 2026", detail: "Retorno de garantia em 10 dias solicitado pelo atendente." },
      { id: "h2", type: "Atendimento", title: "Agendamento prioritário", date: "Hoje, 07:58", detail: "IA e atendimento encontraram vaga para sexta-feira, 10h." }
    ],
    nextEvents: [
      { id: "e1", kind: "retorno", title: "Garantia · Ricardo Lima", date: "Amanhã, 10:00" }
    ]
  }
];
