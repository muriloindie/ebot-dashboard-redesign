export type TaskStatus = "Novo" | "Em atendimento" | "Aguardando" | "Agendado" | "Em acompanhamento" | "Concluído";
export type Task = {
  id: string;
  title: string;
  description: string;
  client?: string;
  responsible: string;
  sector: string;
  priority: "Alta" | "Média" | "Baixa";
  due: string;
  status: TaskStatus;
  tag: string;
};

export const kanbanColumns: { id: TaskStatus; label: string; description: string }[] = [
  { id: "Novo", label: "Novo", description: "Recém-chegados" },
  { id: "Em atendimento", label: "Em atendimento", description: "Em execução" },
  { id: "Aguardando", label: "Aguardando", description: "Dependem de terceiros" },
  { id: "Agendado", label: "Agendado", description: "Horário marcado" },
  { id: "Em acompanhamento", label: "Em acompanhamento", description: "Pós-venda" },
  { id: "Concluído", label: "Concluído", description: "Feitos recentemente" }
];

export const initialTasks: Task[] = [
  { id: "TK-12", title: "Confirmar primeira avaliação", description: "Amanda confirmou horário das 16h; falta validar forma de pagamento.", client: "Amanda Souza", responsible: "Marina Costa", sector: "Comercial", priority: "Alta", due: "Hoje", status: "Novo", tag: "Primeiro contato" },
  { id: "TK-11", title: "Acompanhar pedido de peças", description: "Peças chegaram; aguardando confirmação de instalação do Carlos.", client: "Carlos Eduardo Santos", responsible: "Ricardo Lima", sector: "Frota", priority: "Alta", due: "Hoje", status: "Novo", tag: "Pedidos" },
  { id: "TK-10", title: "Reagendar instalação", description: "Sr. José pediu nova data; pedido atrasou.", client: "José Ricardo Alves", responsible: "Julia Alves", sector: "Comercial", priority: "Média", due: "Hoje", status: "Em atendimento", tag: "Reagendamento" },
  { id: "TK-09", title: "Priorizar atendimento da Beatriz", description: "Aguardando liberação do Paulo; cliente precisa sair às 9h15.", client: "Beatriz Ferreira", responsible: "Marina Costa", sector: "Suporte", priority: "Alta", due: "Hoje", status: "Em atendimento", tag: "Prioridade" },
  { id: "TK-08", title: "Enviar tabela de preços corporativa", description: "Contrato de manutenção para frotas na Filial Norte.", client: "Henrique Barros", responsible: "Julia Alves", sector: "Comercial", priority: "Baixa", due: "Hoje", status: "Aguardando", tag: "Parcerias" },
  { id: "TK-07", title: "Retornar condições para frota corporativa", description: "Fernanda pediu detalhes do contrato corporativo.", client: "Fernanda Lima", responsible: "IA + equipe", sector: "Comercial", priority: "Média", due: "Hoje", status: "Aguardando", tag: "Parcerias" },
  { id: "TK-06", title: "Confirmar retorno de garantia", description: "Vaga de sexta-feira, 10h, oferecida e aceita pelo cliente.", client: "Juliana Martins", responsible: "Marina Costa", sector: "Pós-venda", priority: "Alta", due: "Hoje", status: "Agendado", tag: "Retorno" },
  { id: "TK-05", title: "Avaliação pré-agendada das 16h", description: "Primeira avaliação de Amanda com a Fernanda.", client: "Amanda Souza", responsible: "Fernanda Rocha", sector: "Comercial", priority: "Média", due: "Hoje, 16:00", status: "Agendado", tag: "Primeiro contato" },
  { id: "TK-04", title: "Acompanhar orçamento aprovado", description: "Verificar com Carolina se o orçamento foi aprovado no portal.", client: "Carolina Nunes", responsible: "Julia Alves", sector: "Comercial", priority: "Média", due: "Quinta-feira", status: "Em acompanhamento", tag: "Orçamentos" },
  { id: "TK-03", title: "Pós-venda do pedido de peças", description: "Confirmar se Carlos recebeu o resumo da instalação.", client: "Carlos Eduardo Santos", responsible: "Marina Costa", sector: "Frota", priority: "Média", due: "Sexta-feira", status: "Em acompanhamento", tag: "Pós-venda" },
  { id: "TK-02", title: "Revisar protocolo de retorno", description: "Validar o resumo antes do envio ao cliente.", client: "Ana Paula Mendes", responsible: "Marina Costa", sector: "Atendimento", priority: "Alta", due: "Hoje", status: "Concluído", tag: "Retorno" },
  { id: "TK-01", title: "Enviar notas fiscais de maio", description: "Compartilhar os documentos já liberados no portal.", client: "Patrícia Gomes", responsible: "Julia Alves", sector: "Financeiro", priority: "Alta", due: "Hoje", status: "Concluído", tag: "Documentos" },
  { id: "TK-00", title: "Mapear perguntas frequentes", description: "Organizar dúvidas recorrentes para a base de conhecimento da IA.", responsible: "IA + equipe", sector: "Automação", priority: "Média", due: "22 jul", status: "Concluído", tag: "Conteúdo" }
];
