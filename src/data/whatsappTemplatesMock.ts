export type TemplateStatus = "Aprovado" | "Pendente" | "Reprovado";
export type TemplateCategory = "Marketing" | "Utilidade" | "Autenticação";

export type WhatsAppTemplate = {
  id: string;
  name: string;
  language: string;
  category: TemplateCategory;
  status: TemplateStatus;
  quality: "Alta" | "Média" | "Baixa" | "—";
  header: string;
  body: string;
  footer: string;
  buttons: { type: "Rápida" | "URL" | "Telefone"; label: string }[];
  variables: string[];
  usesMonth: number;
  updatedAt: string;
};

export const templateCategories = ["Todas", "Marketing", "Utilidade", "Autenticação"] as const;
export const templateStatuses = ["Todos", "Aprovado", "Pendente", "Reprovado"] as const;

export const whatsappTemplates: WhatsAppTemplate[] = [
  {
    id: "tpl-1",
    name: "Pós-venda + satisfação",
    language: "Português (BR)",
    category: "Utilidade",
    status: "Aprovado",
    quality: "Alta",
    header: "Como foi sua agendamento, {{1}}?",
    body: "Olá, {{1}}! Passando para saber como foi sua agendamento com {{2}} no dia {{3}}. Sua opinião ajuda a equipe a melhorar sempre. Responda com uma nota de 1 a 5.",
    footer: "Equipe Ê-Bot",
    buttons: [{ type: "Rápida", label: "Ótimo" }, { type: "Rápida", label: "Regular" }, { type: "Rápida", label: "Preciso falar com a equipe" }],
    variables: ["{{1}} nome do cliente", "{{2}} atendente", "{{3}} data do agendamento"],
    usesMonth: 842,
    updatedAt: "há 2 dias"
  },
  {
    id: "tpl-2",
    name: "Confirmação de agendamento D-1",
    language: "Português (BR)",
    category: "Utilidade",
    status: "Aprovado",
    quality: "Alta",
    header: "Confirmação de agendamento",
    body: "Olá, {{1}}! Sua agendamento com {{2}} está marcada para amanhã, {{3}}, na {{4}}. Confirme sua presença para reservarmos o horário.",
    footer: "Para reagendar, fale com o atendimento.",
    buttons: [{ type: "Rápida", label: "Confirmar" }, { type: "Rápida", label: "Reagendar" }],
    variables: ["{{1}} nome do cliente", "{{2}} atendente", "{{3}} horário", "{{4}} filial"],
    usesMonth: 1210,
    updatedAt: "há 4 dias"
  },
  {
    id: "tpl-3",
    name: "Aniversariantes do dia",
    language: "Português (BR)",
    category: "Marketing",
    status: "Aprovado",
    quality: "Média",
    header: "Feliz aniversário, {{1}}! 🎉",
    body: "A equipe da Ê-Bot deseja um ano cheio de saúde! E para celebrar, você tem {{2}} de desconto em qualquer pedido este mês.",
    footer: "Válido até o fim do mês.",
    buttons: [{ type: "URL", label: "Agendar pedido" }],
    variables: ["{{1}} nome do cliente", "{{2}} percentual de desconto"],
    usesMonth: 126,
    updatedAt: "há 1 semana"
  },
  {
    id: "tpl-4",
    name: "Reativação de clientes inativos",
    language: "Português (BR)",
    category: "Marketing",
    status: "Pendente",
    quality: "—",
    header: "Sentimos sua falta, {{1}}!",
    body: "Olá, {{1}}! Notamos que seu último agendamento foi há mais de 6 meses. Manter seus serviços em dia é importante — quer que a gente encontre o melhor horário com {{2}}?",
    footer: "Ê-Bot — Cuidado contínuo",
    buttons: [{ type: "Rápida", label: "Quero agendar" }, { type: "Rápida", label: "Agora não" }],
    variables: ["{{1}} nome do cliente", "{{2}} segmento"],
    usesMonth: 0,
    updatedAt: "há 1 dia"
  },
  {
    id: "tpl-5",
    name: "Novidades da filial",
    language: "Português (BR)",
    category: "Marketing",
    status: "Reprovado",
    quality: "Baixa",
    header: "Novidades da {{1}}",
    body: "Chegou novidade na {{1}}! Conheça nossos novos horários e pedidos disponíveis. Fale com a gente para saber mais.",
    footer: "Prefere não receber? Responda SAIR.",
    buttons: [],
    variables: ["{{1}} filial"],
    usesMonth: 12,
    updatedAt: "há 3 semanas"
  },
  {
    id: "tpl-6",
    name: "Resultado de pedido disponível",
    language: "Português (BR)",
    category: "Utilidade",
    status: "Aprovado",
    quality: "Alta",
    header: "Seu resultado chegou, {{1}}",
    body: "Olá, {{1}}! O resultado do seu pedido ({{2}}) já está disponível no portal, liberado por {{3}}. Acesse com seu CPF e senha.",
    footer: "Guarde este portal nos favoritos.",
    buttons: [{ type: "URL", label: "Abrir portal de resultados" }],
    variables: ["{{1}} nome do cliente", "{{2}} pedido", "{{3}} atendente responsável"],
    usesMonth: 486,
    updatedAt: "há 6 dias"
  },
  {
    id: "tpl-7",
    name: "Lembrete de retorno",
    language: "Português (BR)",
    category: "Utilidade",
    status: "Aprovado",
    quality: "Média",
    header: "Hora do seu retorno, {{1}}",
    body: "Olá, {{1}}! Conforme combinado pela {{2}}, seu retorno está programado para {{3}}. Podemos confirmar?",
    footer: "Equipe Ê-Bot",
    buttons: [{ type: "Rápida", label: "Confirmar" }, { type: "Rápida", label: "Alterar data" }],
    variables: ["{{1}} nome do cliente", "{{2}} segmento", "{{3}} data do retorno"],
    usesMonth: 358,
    updatedAt: "há 5 dias"
  },
  {
    id: "tpl-8",
    name: "Código de verificação de acesso",
    language: "Português (BR)",
    category: "Autenticação",
    status: "Aprovado",
    quality: "Alta",
    header: "",
    body: "Seu código de verificação Ê-Bot é {{1}}. Ele expira em 5 minutos. Não compartilhe com ninguém.",
    footer: "",
    buttons: [],
    variables: ["{{1}} código"],
    usesMonth: 94,
    updatedAt: "há 1 mês"
  }
];
