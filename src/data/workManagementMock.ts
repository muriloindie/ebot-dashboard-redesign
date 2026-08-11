export type TaskStatus = "Novo" | "Em atendimento" | "Aguardando" | "Agendado" | "Em acompanhamento" | "Concluído";
export type Task = {
  id: string;
  title: string;
  description: string;
  patient?: string;
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
  { id: "Em acompanhamento", label: "Em acompanhamento", description: "Pós-consulta" },
  { id: "Concluído", label: "Concluído", description: "Feitos recentemente" }
];

export const initialTasks: Task[] = [
  { id: "TK-12", title: "Confirmar primeira consulta", description: "Amanda confirmou horário das 16h; falta validar forma de pagamento.", patient: "Amanda Souza", responsible: "Marina Costa", sector: "Recepção", priority: "Alta", due: "Hoje", status: "Novo", tag: "Primeiro contato" },
  { id: "TK-11", title: "Aguardar laudo do ecocardiograma", description: "Resultado liberado; aguardando avaliação do Dr. Ricardo.", patient: "Carlos Eduardo Santos", responsible: "Dr. Ricardo Lima", sector: "Cardiologia", priority: "Alta", due: "Hoje", status: "Novo", tag: "Exames" },
  { id: "TK-10", title: "Reagendar retorno de ortopedia", description: "Sr. José pediu nova data; exame atrasou.", patient: "José Ricardo Alves", responsible: "Julia Alves", sector: "Ortopedia", priority: "Média", due: "Hoje", status: "Em atendimento", tag: "Reagendamento" },
  { id: "TK-09", title: "Priorizar encaixe da Beatriz", description: "Aguardando liberação do Dr. Paulo; paciente precisa sair às 9h15.", patient: "Beatriz Ferreira", responsible: "Marina Costa", sector: "Pediatria", priority: "Alta", due: "Hoje", status: "Em atendimento", tag: "Prioridade" },
  { id: "TK-08", title: "Enviar tabela de credenciados", description: "SulAmérica para fisioterapia na Unidade Norte.", patient: "Henrique Barros", responsible: "Julia Alves", sector: "Recepção", priority: "Baixa", due: "Hoje", status: "Aguardando", tag: "Convênios" },
  { id: "TK-07", title: "Confirmar retorno com o convênio", description: "Fernanda perguntou sobre cobertura Amil para dermatologia.", patient: "Fernanda Lima", responsible: "IA + equipe", sector: "Recepção", priority: "Média", due: "Hoje", status: "Aguardando", tag: "Convênios" },
  { id: "TK-06", title: "Agendar retorno de pós-cirurgia", description: "Vaga de sexta-feira, 10h, oferecida e aceita pelo paciente.", patient: "Juliana Martins", responsible: "Marina Costa", sector: "Cardiologia", priority: "Alta", due: "Hoje", status: "Agendado", tag: "Retorno" },
  { id: "TK-05", title: "Consulta pré-agendada das 16h", description: "Primeira consulta de Amanda com a Dra. Fernanda.", patient: "Amanda Souza", responsible: "Dra. Fernanda Rocha", sector: "Clínica Geral", priority: "Média", due: "Hoje, 16:00", status: "Agendado", tag: "Primeiro contato" },
  { id: "TK-04", title: "Acompanhar resultado de biópsia", description: "Verificar com Carolina se o laudo foi retirado no portal.", patient: "Carolina Nunes", responsible: "Julia Alves", sector: "Exames", priority: "Média", due: "Quinta-feira", status: "Em acompanhamento", tag: "Exames" },
  { id: "TK-03", title: "Pós-consulta do retorno de cardiologia", description: "Confirmar se Carlos recebeu o resumo do ecocardiograma.", patient: "Carlos Eduardo Santos", responsible: "Marina Costa", sector: "Cardiologia", priority: "Média", due: "Sexta-feira", status: "Em acompanhamento", tag: "Pós-consulta" },
  { id: "TK-02", title: "Revisar protocolo de retorno", description: "Validar o resumo antes do envio ao paciente.", patient: "Ana Paula Mendes", responsible: "Marina Costa", sector: "Recepção", priority: "Alta", due: "Hoje", status: "Concluído", tag: "Retorno" },
  { id: "TK-01", title: "Enviar relatório de exames", description: "Compartilhar os relatórios já liberados no portal.", patient: "Patrícia Gomes", responsible: "Julia Alves", sector: "Exames", priority: "Alta", due: "Hoje", status: "Concluído", tag: "Exames" },
  { id: "TK-00", title: "Mapear perguntas frequentes", description: "Organizar dúvidas recorrentes para a base clínica da IA.", responsible: "IA + equipe", sector: "Automação", priority: "Média", due: "22 jul", status: "Concluído", tag: "Conteúdo" }
];
