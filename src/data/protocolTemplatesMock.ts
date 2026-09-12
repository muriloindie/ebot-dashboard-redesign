export type ProtocolCategory = "Atendimento" | "Agendamento" | "Confirmação" | "Pós-venda" | "Cancelamento" | "Reagendamento" | "Pedidos";
export type ProtocolStatus = "Ativo" | "Rascunho" | "Inativo";

export type ProtocolStep = {
  id: string;
  title: string;
  description: string;
  channel: string;
  trigger: string;
};

export type ProtocolTemplate = {
  id: string;
  name: string;
  category: ProtocolCategory;
  status: ProtocolStatus;
  responsible: string;
  icon: string;
  updatedAt: string;
  uses: number;
  description: string;
  steps: ProtocolStep[];
};

export const protocolCategories: ProtocolCategory[] = ["Atendimento", "Agendamento", "Confirmação", "Pós-venda", "Cancelamento", "Reagendamento", "Pedidos"];

export const protocolTemplates: ProtocolTemplate[] = [
  {
    id: "PT-01",
    name: "Primeiro agendamento",
    category: "Atendimento",
    status: "Ativo",
    responsible: "Marina Costa",
    icon: "HeartPulse",
    updatedAt: "04 ago 2026",
    uses: 128,
    description: "Fluxo completo de boas-vindas, triagem e agendamento para quem chega à empresa pela primeira vez.",
    steps: [
      { id: "s1", title: "Boas-vindas", description: "Mensagem de apresentação com nome da empresa e horário de funcionamento.", channel: "WhatsApp", trigger: "Novo contato detectado" },
      { id: "s2", title: "Triagem de motivo", description: "Pergunta objetiva sobre o motivo do contato: agendamento, pedido, parceria ou ouvidoria.", channel: "WhatsApp", trigger: "Resposta do cliente" },
      { id: "s3", title: "Captura de dados", description: "Coleta de nome completo, telefone e preferência de filial.", channel: "WhatsApp", trigger: "Motivo informado" },
      { id: "s4", title: "Pré-agendamento", description: "IA oferece horários disponíveis do atendente e cria o pré-agendamento.", channel: "WhatsApp", trigger: "Dados validados" },
      { id: "s5", title: "Handoff humano", description: "Se o cliente tiver dúvidas específicas, a conversa é transferida para o atendimento.", channel: "IA + atendimento", trigger: "Solicitação ou conflito de horário" }
    ]
  },
  {
    id: "PT-02",
    name: "Retorno",
    category: "Agendamento",
    status: "Ativo",
    responsible: "Julia Alves",
    icon: "CalendarClock",
    updatedAt: "02 ago 2026",
    uses: 96,
    description: "Organiza o retorno do cliente após avaliação de atendimento, respeitando o prazo orientado pelo atendente.",
    steps: [
      { id: "s1", title: "Orientação de atendimento", description: "Registro do prazo de retorno informado pelo atendente no agendamento.", channel: "Sistema", trigger: "Fim do agendamento" },
      { id: "s2", title: "Oferta de horários", description: "IA oferece os próximos horários livres do mesmo atendente.", channel: "WhatsApp", trigger: "Prazo de retorno registrado" },
      { id: "s3", title: "Confirmação", description: "Retorno confirmado e adicionado à agenda com status de confirmação.", channel: "WhatsApp", trigger: "Cliente aceita horário" }
    ]
  },
  {
    id: "PT-03",
    name: "Confirmação de agendamento",
    category: "Confirmação",
    status: "Ativo",
    responsible: "IA + equipe",
    icon: "MessageSquareText",
    updatedAt: "05 ago 2026",
    uses: 412,
    description: "Confirma automaticamente as agendamentos do dia seguinte e sinaliza pendências para o atendimento.",
    steps: [
      { id: "s1", title: "Disparo de confirmação", description: "Envio de mensagem de confirmação 24h antes do agendamento.", channel: "WhatsApp", trigger: "T-24h do agendamento" },
      { id: "s2", title: "Resposta do cliente", description: "IA interpreta resposta: confirmar, reagendar ou cancelar.", channel: "WhatsApp", trigger: "Resposta do cliente" },
      { id: "s3", title: "Atualização da agenda", description: "Status do agendamento atualizado em tempo real na agenda.", channel: "Sistema", trigger: "Resposta interpretada" },
      { id: "s4", title: "Sinalização de pendência", description: "Agendamentos sem resposta após 6h entram na fila do atendimento.", channel: "Atendimento", trigger: "Sem resposta em 6h" }
    ]
  },
  {
    id: "PT-04",
    name: "Pós-venda",
    category: "Pós-venda",
    status: "Ativo",
    responsible: "Fernanda Rocha",
    icon: "Stethoscope",
    updatedAt: "28 jul 2026",
    uses: 87,
    description: "Acompanha o cliente após a agendamento com orientações, encaminhamentos e coleta de feedback.",
    steps: [
      { id: "s1", title: "Resumo do agendamento", description: "Envio do resumo com orientações do atendente e documentos.", channel: "WhatsApp", trigger: "Agendamento concluído" },
      { id: "s2", title: "Acompanhamento", description: "IA pergunta sobre a evolução e identifica sinais que exigem retorno.", channel: "WhatsApp", trigger: "48h após a agendamento" },
      { id: "s3", title: "Agendamento de pedidos", description: "Oferece agendamento dos pedidos solicitados no agendamento.", channel: "WhatsApp", trigger: "Solicitação registrada" },
      { id: "s4", title: "Feedback de satisfação", description: "Pesquisa rápida de satisfação ao final do acompanhamento.", channel: "WhatsApp", trigger: "Fluxo de acompanhamento encerrado" }
    ]
  },
  {
    id: "PT-05",
    name: "Cancelamento",
    category: "Cancelamento",
    status: "Ativo",
    responsible: "Marina Costa",
    icon: "Ban",
    updatedAt: "30 jul 2026",
    uses: 54,
    description: "Trata cancelamentos com registro de motivo, liberação do horário e oferta de reagendamento.",
    steps: [
      { id: "s1", title: "Registro do cancelamento", description: "IA registra o cancelamento e o motivo informado pelo cliente.", channel: "WhatsApp", trigger: "Cliente cancela" },
      { id: "s2", title: "Liberação do horário", description: "Horário é liberado na agenda e marcado como disponível.", channel: "Sistema", trigger: "Cancelamento confirmado" },
      { id: "s3", title: "Oferta de reagendamento", description: "IA oferece novos horários antes de encerrar o atendimento.", channel: "WhatsApp", trigger: "Horário liberado" },
      { id: "s4", title: "Aviso ao atendimento", description: "Atendimento é notificada para fila de espera, se houver.", channel: "Atendimento", trigger: "Cancelamento em menos de 24h" }
    ]
  },
  {
    id: "PT-06",
    name: "Reagendamento",
    category: "Reagendamento",
    status: "Ativo",
    responsible: "Julia Alves",
    icon: "RotateCcw",
    updatedAt: "29 jul 2026",
    uses: 71,
    description: "Reorganiza agendamentos quando o cliente ou a empresa precisam alterar a data, sem perder o vínculo.",
    steps: [
      { id: "s1", title: "Motivo do reagendamento", description: "Registro do motivo: disponibilidade do cliente ou da empresa.", channel: "WhatsApp", trigger: "Pedido de alteração" },
      { id: "s2", title: "Nova data", description: "IA verifica a agenda do atendente e oferece alternativas.", channel: "WhatsApp", trigger: "Motivo registrado" },
      { id: "s3", title: "Confirmação da troca", description: "Data antiga é liberada e a nova é agendada com aviso por mensagem.", channel: "WhatsApp", trigger: "Nova data aceita" }
    ]
  },
  {
    id: "PT-07",
    name: "Entrega de resultados",
    category: "Pedidos",
    status: "Rascunho",
    responsible: "Ricardo Lima",
    icon: "FlaskConical",
    updatedAt: "01 ago 2026",
    uses: 0,
    description: "Organiza a entrega de resultados de pedidos com liberação em etapas e aviso ao cliente.",
    steps: [
      { id: "s1", title: "Liberação do relatório", description: "Atendente libera o relatório no sistema após revisão.", channel: "Sistema", trigger: "Relatório revisado" },
      { id: "s2", title: "Aviso ao cliente", description: "IA avisa que o resultado está disponível no portal.", channel: "WhatsApp", trigger: "Relatório liberado" },
      { id: "s3", title: "Agendamento de leitura", description: "Oferece horário para o atendente explicar o resultado.", channel: "WhatsApp", trigger: "Cliente solicita explicação" }
    ]
  }
];
