export type TaskStatus = "Backlog" | "Em andamento" | "Concluída";
export type Task = { id: string; title: string; description: string; responsible: string; sector: string; priority: "Alta" | "Média" | "Baixa"; due: string; status: TaskStatus; tag?: string };

export const initialTasks: Task[] = [
  { id: "TK-01", title: "Revisar protocolo de retorno", description: "Validar o resumo antes do envio ao paciente.", responsible: "Marina Costa", sector: "Recepção", priority: "Alta", due: "Hoje", status: "Em andamento", tag: "Paciente" },
  { id: "TK-02", title: "Atualizar fila de cardiologia", description: "Conferir responsáveis e horários da semana.", responsible: "Dr. Ruan", sector: "Cardiologia", priority: "Média", due: "Amanhã", status: "Backlog", tag: "Operação" },
  { id: "TK-03", title: "Conferir contatos duplicados", description: "Separar registros que precisam de revisão manual.", responsible: "Julia Alves", sector: "Operação", priority: "Baixa", due: "18 jul", status: "Backlog", tag: "Qualidade" },
  { id: "TK-04", title: "Enviar relatório de exames", description: "Compartilhar os relatórios que já foram liberados.", responsible: "Marina Costa", sector: "Exames", priority: "Alta", due: "Hoje", status: "Concluída", tag: "Exames" },
  { id: "TK-05", title: "Mapear perguntas frequentes", description: "Organizar dúvidas recorrentes para a base clínica.", responsible: "IA + equipe", sector: "Automação", priority: "Média", due: "22 jul", status: "Concluída", tag: "Conteúdo" }
];

export const kanbanColumns: { id: TaskStatus; label: string; description: string }[] = [
  { id: "Backlog", label: "Backlog", description: "Próximas ações" },
  { id: "Em andamento", label: "Em andamento", description: "Em execução" },
  { id: "Concluída", label: "Concluída", description: "Feitas recentemente" }
];
