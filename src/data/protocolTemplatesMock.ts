export type ProtocolCategory = "Atendimento" | "Agendamento" | "Confirmação" | "Pós-consulta" | "Cancelamento" | "Reagendamento" | "Exames";
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

export const protocolCategories: ProtocolCategory[] = ["Atendimento", "Agendamento", "Confirmação", "Pós-consulta", "Cancelamento", "Reagendamento", "Exames"];

export const protocolTemplates: ProtocolTemplate[] = [
  {
    id: "PT-01",
    name: "Primeira consulta",
    category: "Atendimento",
    status: "Ativo",
    responsible: "Marina Costa",
    icon: "HeartPulse",
    updatedAt: "04 ago 2026",
    uses: 128,
    description: "Fluxo completo de boas-vindas, triagem e agendamento para quem chega à clínica pela primeira vez.",
    steps: [
      { id: "s1", title: "Boas-vindas", description: "Mensagem de apresentação com nome da clínica e horário de funcionamento.", channel: "WhatsApp", trigger: "Novo contato detectado" },
      { id: "s2", title: "Triagem de motivo", description: "Pergunta objetiva sobre o motivo do contato: consulta, exame, convênio ou ouvidoria.", channel: "WhatsApp", trigger: "Resposta do paciente" },
      { id: "s3", title: "Captura de dados", description: "Coleta de nome completo, telefone e preferência de unidade.", channel: "WhatsApp", trigger: "Motivo informado" },
      { id: "s4", title: "Pré-agendamento", description: "IA oferece horários disponíveis do profissional e cria o pré-agendamento.", channel: "WhatsApp", trigger: "Dados validados" },
      { id: "s5", title: "Handoff humano", description: "Se o paciente tiver dúvidas específicas, a conversa é transferida para a recepção.", channel: "IA + recepção", trigger: "Solicitação ou conflito de horário" }
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
    description: "Organiza o retorno do paciente após avaliação médica, respeitando o prazo orientado pelo profissional.",
    steps: [
      { id: "s1", title: "Orientação médica", description: "Registro do prazo de retorno informado pelo profissional na consulta.", channel: "Sistema", trigger: "Fim da consulta" },
      { id: "s2", title: "Oferta de horários", description: "IA oferece os próximos horários livres do mesmo profissional.", channel: "WhatsApp", trigger: "Prazo de retorno registrado" },
      { id: "s3", title: "Confirmação", description: "Retorno confirmado e adicionado à agenda com status de confirmação.", channel: "WhatsApp", trigger: "Paciente aceita horário" }
    ]
  },
  {
    id: "PT-03",
    name: "Confirmação de consulta",
    category: "Confirmação",
    status: "Ativo",
    responsible: "IA + equipe",
    icon: "MessageSquareText",
    updatedAt: "05 ago 2026",
    uses: 412,
    description: "Confirma automaticamente as consultas do dia seguinte e sinaliza pendências para a recepção.",
    steps: [
      { id: "s1", title: "Disparo de confirmação", description: "Envio de mensagem de confirmação 24h antes da consulta.", channel: "WhatsApp", trigger: "T-24h da consulta" },
      { id: "s2", title: "Resposta do paciente", description: "IA interpreta resposta: confirmar, reagendar ou cancelar.", channel: "WhatsApp", trigger: "Resposta do paciente" },
      { id: "s3", title: "Atualização da agenda", description: "Status da consulta atualizado em tempo real na agenda.", channel: "Sistema", trigger: "Resposta interpretada" },
      { id: "s4", title: "Sinalização de pendência", description: "Consultas sem resposta após 6h entram na fila da recepção.", channel: "Recepção", trigger: "Sem resposta em 6h" }
    ]
  },
  {
    id: "PT-04",
    name: "Pós-consulta",
    category: "Pós-consulta",
    status: "Ativo",
    responsible: "Dra. Fernanda Rocha",
    icon: "Stethoscope",
    updatedAt: "28 jul 2026",
    uses: 87,
    description: "Acompanha o paciente após a consulta com orientações, encaminhamentos e coleta de feedback.",
    steps: [
      { id: "s1", title: "Resumo da consulta", description: "Envio do resumo com orientações do profissional e receitas.", channel: "WhatsApp", trigger: "Consulta concluída" },
      { id: "s2", title: "Acompanhamento", description: "IA pergunta sobre a evolução e identifica sinais que exigem retorno.", channel: "WhatsApp", trigger: "48h após a consulta" },
      { id: "s3", title: "Agendamento de exames", description: "Oferece agendamento dos exames solicitados na consulta.", channel: "WhatsApp", trigger: "Solicitação médica registrada" },
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
      { id: "s1", title: "Registro do cancelamento", description: "IA registra o cancelamento e o motivo informado pelo paciente.", channel: "WhatsApp", trigger: "Paciente cancela" },
      { id: "s2", title: "Liberação do horário", description: "Horário é liberado na agenda e marcado como disponível.", channel: "Sistema", trigger: "Cancelamento confirmado" },
      { id: "s3", title: "Oferta de reagendamento", description: "IA oferece novos horários antes de encerrar o atendimento.", channel: "WhatsApp", trigger: "Horário liberado" },
      { id: "s4", title: "Aviso à recepção", description: "Recepção é notificada para fila de espera, se houver.", channel: "Recepção", trigger: "Cancelamento em menos de 24h" }
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
    description: "Reorganiza consultas quando o paciente ou a clínica precisam alterar a data, sem perder o vínculo.",
    steps: [
      { id: "s1", title: "Motivo do reagendamento", description: "Registro do motivo: disponibilidade do paciente ou da clínica.", channel: "WhatsApp", trigger: "Pedido de alteração" },
      { id: "s2", title: "Nova data", description: "IA consulta a agenda do profissional e oferece alternativas.", channel: "WhatsApp", trigger: "Motivo registrado" },
      { id: "s3", title: "Confirmação da troca", description: "Data antiga é liberada e a nova é agendada com aviso por mensagem.", channel: "WhatsApp", trigger: "Nova data aceita" }
    ]
  },
  {
    id: "PT-07",
    name: "Entrega de resultados",
    category: "Exames",
    status: "Rascunho",
    responsible: "Dr. Ricardo Lima",
    icon: "FlaskConical",
    updatedAt: "01 ago 2026",
    uses: 0,
    description: "Organiza a entrega de resultados de exames com liberação em etapas e aviso ao paciente.",
    steps: [
      { id: "s1", title: "Liberação do laudo", description: "Profissional libera o laudo no sistema após revisão.", channel: "Sistema", trigger: "Laudo revisado" },
      { id: "s2", title: "Aviso ao paciente", description: "IA avisa que o resultado está disponível no portal.", channel: "WhatsApp", trigger: "Laudo liberado" },
      { id: "s3", title: "Agendamento de leitura", description: "Oferece horário para o profissional explicar o resultado.", channel: "WhatsApp", trigger: "Paciente solicita explicação" }
    ]
  }
];
