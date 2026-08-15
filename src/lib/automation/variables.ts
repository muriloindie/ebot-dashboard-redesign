export type VariableDefinition = {
  key: string;
  label: string;
  description: string;
  example: string;
};

export const variableCatalog: VariableDefinition[] = [
  { key: "nome_paciente", label: "Nome do paciente", description: "Primeiro nome do paciente em atendimento.", example: "Maria" },
  { key: "nome_completo", label: "Nome completo", description: "Nome completo do paciente.", example: "Maria Oliveira" },
  { key: "idade_paciente", label: "Idade do paciente", description: "Idade calculada a partir da data de nascimento.", example: "38 anos" },
  { key: "proxima_consulta", label: "Próxima consulta", description: "Data e horário da próxima consulta agendada.", example: "15 ago, 14:30" },
  { key: "data_consulta", label: "Data da consulta", description: "Somente a data da próxima consulta.", example: "15 ago 2026" },
  { key: "hora_consulta", label: "Horário da consulta", description: "Somente o horário da próxima consulta.", example: "14:30" },
  { key: "ultima_consulta", label: "Última consulta", description: "Data da consulta mais recente.", example: "22 jul 2026" },
  { key: "nome_profissional", label: "Profissional", description: "Profissional responsável pelo paciente.", example: "Dra. Camila Duarte" },
  { key: "especialidade", label: "Especialidade", description: "Especialidade do atendimento.", example: "Dermatologia" },
  { key: "convenio", label: "Convênio", description: "Convênio vinculado ao paciente.", example: "Amil" },
  { key: "unidade", label: "Unidade", description: "Unidade da clínica do paciente.", example: "Unidade Centro" },
  { key: "endereco_unidade", label: "Endereço da unidade", description: "Endereço completo da unidade.", example: "Av. Paulista, 1245 - São Paulo" },
  { key: "telefone_unidade", label: "Telefone da unidade", description: "Telefone de contato da unidade.", example: "+55 11 4002-8922" },
  { key: "nome_clinica", label: "Nome da clínica", description: "Nome da clínica configurada.", example: "Ê-Bot Clinical" },
  { key: "horario_atendimento", label: "Horário de atendimento", description: "Janela de atendimento da clínica.", example: "segunda a sexta, das 8h às 19h" }
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
    nome_paciente: "Maria",
    nome_completo: "Maria Oliveira",
    idade_paciente: "38 anos",
    proxima_consulta: "15 ago, 14:30",
    data_consulta: "15 ago 2026",
    hora_consulta: "14:30",
    ultima_consulta: "22 jul 2026",
    nome_profissional: "Dra. Camila Duarte",
    especialidade: "Dermatologia",
    convenio: "Amil",
    unidade: "Unidade Centro",
    endereco_unidade: "Av. Paulista, 1245 - São Paulo",
    telefone_unidade: "+55 11 4002-8922",
    nome_clinica: "Ê-Bot Clinical",
    horario_atendimento: "segunda a sexta, das 8h às 19h"
  };
}
