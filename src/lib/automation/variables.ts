export type VariableDefinition = {
  key: string;
  label: string;
  description: string;
  example: string;
};

export const variableCatalog: VariableDefinition[] = [
  { key: "nome_cliente", label: "Nome do cliente", description: "Primeiro nome do cliente em atendimento.", example: "Maria" },
  { key: "nome_completo", label: "Nome completo", description: "Nome completo do cliente.", example: "Maria Oliveira" },
  { key: "idade_cliente", label: "Idade do cliente", description: "Idade calculada a partir da data de nascimento.", example: "38 anos" },
  { key: "proximo_agendamento", label: "Próximo agendamento", description: "Data e horário do próximo agendamento marcado.", example: "15 ago, 14:30" },
  { key: "data_agendamento", label: "Data do agendamento", description: "Somente a data do próximo agendamento.", example: "15 ago 2026" },
  { key: "hora_agendamento", label: "Horário do agendamento", description: "Somente o horário do próximo agendamento.", example: "14:30" },
  { key: "ultimo_atendimento", label: "Último atendimento", description: "Data do agendamento mais recente.", example: "22 jul 2026" },
  { key: "nome_atendente", label: "Atendente", description: "Atendente responsável pelo cliente.", example: "Camila Duarte" },
  { key: "segmento", label: "Segmento", description: "Segmento do atendimento.", example: "Varejo" },
  { key: "parceria", label: "Parceria", description: "Parceria vinculada ao cliente.", example: "Corporativo" },
  { key: "filial", label: "Filial", description: "Filial da empresa do cliente.", example: "Filial Centro" },
  { key: "endereco_unidade", label: "Endereço da filial", description: "Endereço completo da filial.", example: "Av. Paulista, 1245 - São Paulo" },
  { key: "telefone_unidade", label: "Telefone da filial", description: "Telefone de contato da filial.", example: "+55 11 4002-8922" },
  { key: "nome_empresa", label: "Nome da empresa", description: "Nome da empresa configurada.", example: "Ê-Bot" },
  { key: "horario_atendimento", label: "Horário de atendimento", description: "Janela de atendimento da empresa.", example: "segunda a sexta, das 8h às 19h" }
];

export type VariableContext = Record<string, string>;

export function buildVariableToken(key: string) {
  return `{${key}}`;
}

export function resolveVariables(text: string, context: VariableContext) {
  return text.replace(/\{([a-z0-9_]+)\}/gi, (match, key: string) => {
    const value = context[key.toLowerCase()];
    return value && value.trim() ? value : match;
  });
}

export function extractVariables(text: string) {
  const found = text.match(/\{([a-z0-9_]+)\}/gi) ?? [];
  return Array.from(new Set(found.map((token) => token.replace(/[{}]/g, "").toLowerCase())));
}

export function defaultVariableContext(): VariableContext {
  return {
    nome_cliente: "Maria",
    nome_completo: "Maria Oliveira",
    idade_cliente: "38 anos",
    proximo_agendamento: "15 ago, 14:30",
    data_agendamento: "15 ago 2026",
    hora_agendamento: "14:30",
    ultimo_atendimento: "22 jul 2026",
    nome_atendente: "Camila Duarte",
    segmento: "Varejo",
    parceria: "Corporativo",
    filial: "Filial Centro",
    endereco_unidade: "Av. Paulista, 1245 - São Paulo",
    telefone_unidade: "+55 11 4002-8922",
    nome_empresa: "Ê-Bot",
    horario_atendimento: "segunda a sexta, das 8h às 19h"
  };
}
